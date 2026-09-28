"use server";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {read,write} from "@/lib/studio/store";
import {digest,token} from "@/lib/studio/security";
import {sameOrigin} from "@/lib/studio/auth";
export async function enter(form:FormData){
 await sameOrigin();const raw=String(form.get("ticket")||"");let id="";
 try{
  if(!/^[a-f0-9]{64}$/.test(raw))throw new Error();
  const t=await read<{owner:string;project:string;expires:number;used:boolean}>(`tickets/${digest(raw)}.json`);
  if(!t||t.value.used||t.value.expires<Date.now())throw new Error();
  await write(`tickets/${digest(raw)}.json`,{...t.value,used:true},t.etag);
  const session=token();await write(`sessions/${digest(session)}.json`,{owner:t.value.owner,expires:Date.now()+7*86400000});
  (await cookies()).set("__Host-studio",session,{httpOnly:true,secure:true,sameSite:"strict",path:"/",maxAge:7*86400});id=t.value.project;
 }catch{redirect("/studio/open?error=1");}
 redirect(`/studio/${id}`);
}
