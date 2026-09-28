import {project,sameOrigin} from "@/lib/studio/auth";
import {asset,bytes} from "@/lib/studio/store";
import {makePackage} from "@/lib/studio/package";
import {put,get} from "@vercel/blob";
import {randomBytes,createHash} from "node:crypto";
import {generateCode,hashCode,type ReportMeta} from "@/lib/reports";
export const runtime="nodejs";export const maxDuration=120;
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
 try{
  await sameOrigin();const {id}=await params;const p=await project(id);const b=await req.json();
  if(b.version!==p.value.version||p.value.tasks.some(t=>t.state==="running"))throw new Error("Refresh after the current work finishes.");
  const assets:Record<string,Uint8Array>={};let total=0;
  for(const f of p.value.files){const data=await bytes(f.path);if(!data)throw new Error("A project file could not be loaded. Try again.");total+=data.length;if(total>150*1024*1024)throw new Error("The package is too large to build in one request.");assets[f.name]=data;}
  const result=makePackage(p.value,assets);
  if(!b.share){
   const downloadPath=`studio/packages/${id}/${randomBytes(12).toString("hex")}.zip`;
   await asset(downloadPath,result.zip,"application/zip");
   const download=await get(downloadPath,{access:"private",useCache:false});
   if(!download||download.statusCode!==200)throw new Error("The package could not be downloaded.");
   return new Response(download.stream,{headers:{"Content-Type":"application/zip","Content-Disposition":`attachment; filename="${p.value.host}-handoff.zip"`,"Cache-Control":"no-store"}});
  }
  // Each share is a new immutable snapshot; never overwrite another website's report.
  const suffix=randomBytes(8).toString("hex");const host=`${p.value.host.slice(0,180)}--${suffix}`;const prefix=`handoffs/${host}`;
  const entries=[...Object.entries(result.files),["handoff.zip",result.zip] as const];
  const files=[];
  for(const [name,data] of entries){await asset(`${prefix}/${name}`,data,name.endsWith(".png")?"image/png":name.endsWith(".zip")?"application/zip":"application/octet-stream");files.push({path:name,bytes:data.length,sha256:createHash("sha256").update(data).digest("hex")});}
  const code=generateCode();const salt=randomBytes(16).toString("hex");
  const meta:ReportMeta={host,kind:"handoff",pages:p.value.candidates.length,summary:p.value.summary,salt,codeHash:hashCode(code,salt),createdAt:new Date().toISOString(),handoff:{prefix,files,title:p.value.host}};
  await put(`reports/${host}/meta.json`,JSON.stringify(meta),{access:"private",addRandomSuffix:false,allowOverwrite:false,contentType:"application/json"});
  return Response.json({url:`${new URL(req.url).origin}/r/${host}`,code},{headers:{"Cache-Control":"no-store"}});
 }catch(e){return Response.json({error:e instanceof Error?e.message:"Unable to build package."},{status:400});}
}
