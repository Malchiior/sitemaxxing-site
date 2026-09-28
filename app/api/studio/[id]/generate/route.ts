import {project,sameOrigin} from "@/lib/studio/auth";
import {read,write,asset,bytes} from "@/lib/studio/store";
import {imagePrompt,reserve,type Connection,type StudioProject} from "@/lib/studio/model";
import {unseal} from "@/lib/studio/security";
import {generate} from "@/lib/studio/provider";
export const runtime="nodejs";export const maxDuration=240;
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
 let reserved:StudioProject|undefined;let taskId="";
 try{
  await sameOrigin();if(process.env.STUDIO_BYOK_ENABLED!=="true")throw new Error("Image generation is not enabled yet.");
  const {id}=await params;const p=await project(id);const b=await req.json();taskId=String(b.taskId);
  const connection=await read<Connection>(`connections/${p.value.owner}.json`);if(!connection?.value.sealed)throw new Error("Connect an image provider first.");
  const key=unseal(connection.value.sealed,p.value.owner);
  const next=reserve(p.value,taskId,b.version);await write(`projects/${id}.json`,next,p.etag);reserved=next;
  const task=next.tasks.find(t=>t.id===taskId)!;
  const referencePath=taskId!==next.tasks[0].id&&next.tasks[0].asset?next.tasks[0].asset:task.kind==="screen"&&task.page===next.site?next.files.find(f=>f.name==="baseline-screenshot.jpg")?.path:undefined;
  const reference=referencePath?await bytes(referencePath):undefined;
  const result=await generate(key,imagePrompt(next,task),reference||undefined,task.kind);
  const name=`${task.id}-${task.kind}-${task.label.toLowerCase().replace(/[^a-z0-9]+/g,"-").slice(0,65)}-v${task.attempts}.png`;
  const path=`studio/assets/${id}/${name}`;await asset(path,result.image,"image/png");
  const current=await read<StudioProject>(`projects/${id}.json`);
  if(!current||current.value.version!==next.version)throw new Error("The project changed while generating. Refresh to check its state.");
  await write(`projects/${id}.json`,{...next,version:next.version+1,tasks:next.tasks.map(t=>t.id===taskId?{...t,state:"ready",asset:path,requestId:result.requestId}:t),files:[...next.files,{name,path,type:"image/png"}]},current.etag);
  return Response.json({ok:true});
 }catch(e){
  if(reserved){try{const p=await read<StudioProject>(`projects/${reserved.id}.json`);if(p&&p.value.version===reserved.version)await write(`projects/${reserved.id}.json`,{...p.value,version:p.value.version+1,tasks:p.value.tasks.map(t=>t.id===taskId?{...t,state:"uncertain"}:t)},p.etag);}catch{/* Never retry a possibly charged provider request. */}}
  return Response.json({error:reserved?"No confirmed image was returned. This attempt remains counted. Check provider usage before choosing a retry.":e instanceof Error?e.message:"Unable to generate."},{status:400});
 }
}
