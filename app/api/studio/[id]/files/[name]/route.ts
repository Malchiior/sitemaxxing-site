import {get} from "@vercel/blob";
import {project} from "@/lib/studio/auth";
export const runtime="nodejs";
export async function GET(_req:Request,{params}:{params:Promise<{id:string;name:string}>}){
 try{const {id,name}=await params;const p=await project(id);const f=p.value.files.find(f=>f.name===name);if(!f)return new Response(null,{status:404});const r=await get(f.path,{access:"private",useCache:false});if(!r||r.statusCode!==200)return new Response(null,{status:404});return new Response(r.stream,{headers:{"Content-Type":f.type,"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});}catch{return new Response(null,{status:403});}
}
