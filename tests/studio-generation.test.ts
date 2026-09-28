import {it,expect,vi,beforeEach} from "vitest";
import {configure,type StudioProject} from "../lib/studio/model";
const mocks=vi.hoisted(()=>({project:vi.fn(),sameOrigin:vi.fn(),read:vi.fn(),write:vi.fn(),asset:vi.fn(),bytes:vi.fn(),generate:vi.fn(),unseal:vi.fn()}));
vi.mock("@/lib/studio/auth",()=>({project:mocks.project,sameOrigin:mocks.sameOrigin}));
vi.mock("@/lib/studio/store",()=>({read:mocks.read,write:mocks.write,asset:mocks.asset,bytes:mocks.bytes}));
vi.mock("@/lib/studio/provider",()=>({generate:mocks.generate}));
vi.mock("@/lib/studio/security",()=>({unseal:mocks.unseal}));
import {POST} from "../app/api/studio/[id]/generate/route";
const p:StudioProject={id:"a".repeat(32),owner:"owner",host:"example.com",site:"https://example.com/",createdAt:"now",mode:"redesign",summary:"test",fix:"test",candidates:[{label:"Home",url:"https://example.com/"}],tasks:[],direction:"",allowance:0,spentAttempts:0,sampleApproved:false,version:1,files:[]};
let current:StudioProject;
beforeEach(()=>{vi.resetAllMocks();process.env.STUDIO_BYOK_ENABLED="true";current=configure(p,[{label:"Home",page:p.site,kind:"screen",brief:""}],"Ivory and blue editorial style",2);mocks.project.mockImplementation(async()=>({value:structuredClone(current),etag:String(current.version)}));mocks.read.mockImplementation(async(path:string)=>path.startsWith("connections/")?{value:{sealed:"encrypted"},etag:"1"}:{value:structuredClone(current),etag:String(current.version)});mocks.write.mockImplementation(async(_path:string,value:StudioProject,etag:string)=>{if(etag!==String(current.version))throw new Error("conflict");current=value;});mocks.unseal.mockReturnValue("secret-key");mocks.generate.mockResolvedValue({image:new Uint8Array([1]),requestId:"request"});});
function call(version=2){return POST(new Request("https://site.test/api/studio/x/generate",{method:"POST",body:JSON.stringify({taskId:"1",version})}),{params:Promise.resolve({id:p.id})});}
it("blocks before contacting provider when owner auth fails",async()=>{mocks.project.mockRejectedValue(new Error("Denied"));expect((await call()).status).toBe(400);expect(mocks.generate).not.toHaveBeenCalled();});
it("blocks without a connection and without feature activation",async()=>{mocks.read.mockResolvedValue(null);await call();expect(mocks.generate).not.toHaveBeenCalled();process.env.STUDIO_BYOK_ENABLED="false";await call();expect(mocks.generate).not.toHaveBeenCalled();});
it("concurrent submissions make at most one provider call",async()=>{await Promise.all([call(),call()]);expect(mocks.generate).toHaveBeenCalledTimes(1);expect(current.spentAttempts).toBe(1);});
it("does not retry or refund an uncertain provider request",async()=>{mocks.generate.mockRejectedValue(new Error("network timeout including sensitive provider detail"));const r=await call();expect(r.status).toBe(400);expect(await r.text()).not.toContain("sensitive provider detail");expect(mocks.generate).toHaveBeenCalledTimes(1);expect(current.spentAttempts).toBe(1);expect(current.tasks[0].state).toBe("uncertain");});
it("stores a completed image without leaking the key",async()=>{const r=await call();expect(r.status).toBe(200);expect(current.tasks[0].state).toBe("ready");expect(JSON.stringify(current)).not.toContain("secret-key");expect(mocks.asset).toHaveBeenCalledTimes(1);});
