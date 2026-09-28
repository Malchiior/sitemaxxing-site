import {describe,it,expect,afterEach} from "vitest";
import {configure,reserve,approve,type StudioProject} from "../lib/studio/model";
import {seal,unseal} from "../lib/studio/security";
import {makePackage} from "../lib/studio/package";
import {unzipSync,strFromU8} from "fflate";
const base:StudioProject={id:"a".repeat(32),owner:"private-owner-id",host:"example.com",site:"https://example.com/",createdAt:"2026-09-28",mode:"redesign",summary:"Measured finding",fix:"Measured repair",candidates:[{label:"Home",url:"https://example.com/"}],tasks:[],direction:"",allowance:0,spentAttempts:0,sampleApproved:false,version:1,files:[]};
const task={label:"Home",page:base.site,kind:"screen" as const,brief:"Readable buttons"};
const planned=()=>configure(base,[task,{...task,label:"Logo",kind:"logo"}],"Warm colors",3);
describe("generation authorization and accounting",()=>{
 it("does not spend during planning",()=>expect(planned().spentAttempts).toBe(0));
 it("does not accept caller-injected asset paths or generation state",()=>{const t={...task,asset:"studio/assets/another-owner/private.png",state:"ready",attempts:-1};const p=configure(base,[t],"",2);expect(p.tasks[0].asset).toBeUndefined();expect(p.tasks[0].state).toBe("planned");expect(p.tasks[0].attempts).toBe(0);});
 it("rejects another site's page and excess scope",()=>{expect(()=>configure(base,[{...task,page:"https://evil.test"}],"",1)).toThrow();expect(()=>configure(base,[task],"",21)).toThrow();expect(()=>configure(base,[task,task],"",1)).toThrow();});
 it("requires a current version and first sample approval",()=>{const p=planned();expect(()=>reserve(p,"1",0)).toThrow();expect(()=>reserve(p,"2",p.version)).toThrow();expect(()=>approve(p,p.version)).toThrow();});
 it("reserves one attempt before execution and rejects concurrency",()=>{const p=planned();const r=reserve(p,"1",p.version);expect(r.spentAttempts).toBe(1);expect(r.tasks[0].state).toBe("running");expect(()=>reserve(r,"1",r.version)).toThrow();expect(()=>configure(r,[task],"",2)).toThrow();});
 it("invalidates approval on a new sample and enforces allowance",()=>{let p=planned();p.tasks[0].state="ready";p=approve(p,p.version);p=reserve(p,"1",p.version);expect(p.sampleApproved).toBe(false);p.tasks[0].state="uncertain";p.spentAttempts=p.allowance;expect(()=>reserve(p,"1",p.version)).toThrow();});
 it("allows the other output only after approval",()=>{let p=planned();p.tasks[0].state="ready";p=approve(p,p.version);expect(reserve(p,"2",p.version).tasks[1].state).toBe("running");});
});
describe("provider secrets",()=>{
 const previous=process.env.STUDIO_ENCRYPTION_KEY;afterEach(()=>{if(previous)process.env.STUDIO_ENCRYPTION_KEY=previous;else delete process.env.STUDIO_ENCRYPTION_KEY;});
 it("fails closed without a configured encryption key",()=>{delete process.env.STUDIO_ENCRYPTION_KEY;expect(()=>seal("secret","owner")).toThrow();});
 it("encrypts and binds the credential to its owner",()=>{process.env.STUDIO_ENCRYPTION_KEY="a".repeat(64);const encrypted=seal("sk-test-private","owner-a");expect(encrypted).not.toContain("sk-test-private");expect(unseal(encrypted,"owner-a")).toBe("sk-test-private");expect(()=>unseal(encrypted,"owner-b")).toThrow();expect(()=>unseal(encrypted.slice(0,-4)+"AAAA","owner-a")).toThrow();});
});
describe("report-only package",()=>{
 it("contains measured material, instructions and hashes without owner credentials",()=>{const {zip}=makePackage(base,{});const files=unzipSync(zip);expect(strFromU8(files["FIX-PROMPT.md"])).toBe(base.fix);expect(strFromU8(files["AGENT-PROMPT.md"])).toContain("nine viewports");expect(strFromU8(files["DESIGN-PLAN.json"])).not.toContain(base.owner);const manifest=JSON.parse(strFromU8(files["MANIFEST.json"]));expect(manifest.every((f:{sha256:string})=>/^[a-f0-9]{64}$/.test(f.sha256))).toBe(true);expect(strFromU8(files["START-HERE.md"])).toContain("0/0");});
});
