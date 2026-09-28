import {project,sameOrigin} from "@/lib/studio/auth";
import {approve,configure,type Connection} from "@/lib/studio/model";
import {read,write} from "@/lib/studio/store";
import {seal} from "@/lib/studio/security";
import {validateKey} from "@/lib/studio/provider";
export const runtime="nodejs";
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
 try{
  await sameOrigin();const {id}=await params;const p=await project(id);const b=await req.json();
  if(b.version!==p.value.version)throw new Error("Refresh to use the latest project version.");
  if(b.action==="plan")await write(`projects/${id}.json`,configure(p.value,b.tasks,b.direction,b.allowance),p.etag);
  else if(b.action==="approve")await write(`projects/${id}.json`,approve(p.value,b.version),p.etag);
  else if(b.action==="connect"){
   if(process.env.STUDIO_BYOK_ENABLED!=="true")throw new Error("Provider connections are not enabled yet.");
   const key=String(b.key||"");await validateKey(key);
   const name=`connections/${p.value.owner}.json`;const old=await read<Connection>(name);
   await write(name,{sealed:seal(key,p.value.owner),last4:key.slice(-4),updatedAt:new Date().toISOString()},old?.etag);
  }else if(b.action==="disconnect"){
   const name=`connections/${p.value.owner}.json`;const old=await read<Connection>(name);
   if(old)await write(name,{sealed:"",last4:"",updatedAt:new Date().toISOString()},old.etag);
  }else if(b.action==="recover"){
   if(!p.value.tasks.some(t=>t.state==="running"&&Date.now()-Date.parse(t.startedAt||"")>300000))throw new Error("There is no interrupted request older than five minutes.");
   const tasks=p.value.tasks.map(t=>t.state==="running"&&Date.now()-Date.parse(t.startedAt||"")>300000?{...t,state:"uncertain" as const}:t);
   await write(`projects/${id}.json`,{...p.value,tasks,version:p.value.version+1},p.etag);
  }else throw new Error("Unknown action.");
  return Response.json({ok:true},{headers:{"Cache-Control":"no-store"}});
 }catch(e){return Response.json({error:e instanceof Error?e.message:"Unable to save. Refresh and try again."},{status:400});}
}
