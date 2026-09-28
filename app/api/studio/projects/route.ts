import {randomBytes,timingSafeEqual} from "node:crypto";
import {asset,read,write} from "@/lib/studio/store";
import {digest,token,validId} from "@/lib/studio/security";
import type {StudioProject} from "@/lib/studio/model";
export const runtime="nodejs";
function authorized(req:Request){const a=Buffer.from(req.headers.get("authorization")?.replace(/^Bearer /,"")||"");const b=Buffer.from(process.env.REPORT_KEY||"");return b.length>0&&a.length===b.length&&timingSafeEqual(a,b);}
export async function POST(req:Request){
 if(!authorized(req))return Response.json({error:"Unauthorized"},{status:401});
 try{
  const body=await req.json();
  // Verify identity against Plow itself; a report code or caller-supplied owner id is insufficient.
  const plow=req.headers.get("x-plow-agent-token");if(!plow)return Response.json({error:"Owner verification required"},{status:403});
  const response=await fetch("https://api.plow.co/v1/chats",{headers:{Authorization:`Bearer ${plow}`},signal:AbortSignal.timeout(15000)});
  if(!response.ok)return Response.json({error:"Owner verification failed"},{status:403});
  const chats=await response.json();
  const owned=chats.data?.filter((c:{uid:string;status:string;participants:{type:string;role?:string;relationship?:string}[]})=>c.status==="active"&&c.participants?.length===2&&c.participants.some(p=>p.type==="agent"&&p.relationship==="self")&&c.participants.some(p=>p.type==="member"&&p.role==="owner"));
  if(owned?.length!==1||body.ownerChat!==owned[0].uid)return Response.json({error:"Owner conversation required"},{status:403});
  const owner=digest(owned[0].uid);let p:StudioProject;
  if(typeof body.projectId==="string"&&validId(body.projectId)){
   const old=await read<StudioProject>(`projects/${body.projectId}.json`);if(!old||old.value.owner!==owner)return Response.json({error:"Project not found"},{status:404});p=old.value;
  }else{
   const url=new URL(body.site);if(url.protocol!=="https:"&&url.protocol!=="http:")throw new Error("Invalid site");
   if(!["redesign","assets","package"].includes(body.mode))throw new Error("Invalid mode");
   if(typeof body.summary!=="string"||body.summary.length>20000||typeof body.fix!=="string"||body.fix.length>150000)throw new Error("Invalid report");
   const id=randomBytes(16).toString("hex");
   const candidates=[{label:"First checked page",url:url.href},...(Array.isArray(body.pages)?body.pages:[])].filter((c,i,a)=>{try{return typeof c.label==="string"&&c.label.length<=100&&new URL(c.url).origin===url.origin&&a.findIndex(x=>x.url===c.url)===i;}catch{return false;}}).slice(0,5);
   p={id,owner,host:url.hostname,site:url.href,createdAt:new Date().toISOString(),mode:body.mode,summary:body.summary,fix:body.fix,candidates,tasks:[],direction:typeof body.direction==="string"?body.direction.trim().slice(0,2000):"",allowance:0,spentAttempts:0,sampleApproved:false,version:1,files:[]};
   if(typeof body.pdf==="string"){
    const pdf=Buffer.from(body.pdf,"base64");if(pdf.length>3*1024*1024||pdf.subarray(0,5).toString()!=="%PDF-")throw new Error("Invalid PDF");
    const path=`studio/assets/${id}/baseline-report.pdf`;await asset(path,pdf,"application/pdf");p.files.push({name:"baseline-report.pdf",path,type:"application/pdf"});
   }
   if(typeof body.reference==="string"){
    const image=Buffer.from(body.reference,"base64");if(image.length>500000||image.subarray(0,3).toString("hex")!=="ffd8ff")throw new Error("Invalid screenshot");
    const path=`studio/assets/${id}/baseline-screenshot.jpg`;await asset(path,image,"image/jpeg");p.files.push({name:"baseline-screenshot.jpg",path,type:"image/jpeg"});
   }
   await write(`projects/${id}.json`,p);
  }
  const ticket=token();await write(`tickets/${digest(ticket)}.json`,{owner,project:p.id,expires:Date.now()+15*60*1000,used:false});
  const base=process.env.SITE_URL||new URL(req.url).origin;
  return Response.json({projectId:p.id,url:`${base}/studio/open?ticket=${ticket}`,expiresInMinutes:15},{headers:{"Cache-Control":"no-store"}});
 }catch{return Response.json({error:"Could not create the workspace. Check the report and owner connection."},{status:400});}
}
