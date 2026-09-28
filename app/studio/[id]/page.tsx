import {project} from "@/lib/studio/auth";
import {read} from "@/lib/studio/store";
import type {Connection} from "@/lib/studio/model";
import {SiteHeader,SiteFooter} from "@/app/components/site-chrome";
import {Workspace} from "./workspace";
import {logout} from "../logout";
export const dynamic="force-dynamic";
export const metadata={title:"Sitemaxxing design workspace",robots:{index:false,follow:false},referrer:"no-referrer" as const};
export default async function Studio({params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 let p;
 try{p=await project(id);}catch{return <><SiteHeader/><main className="handoff-main"><h1>Open your owner link.</h1><p>Text REDESIGN, ASSETS or PACKAGE to your Sitemaxxing agent for a new private link. A report viewing code cannot open this workspace.</p></main></>;}
 const c=await read<Connection>(`connections/${p.value.owner}.json`);
 // Never serialize the encrypted credential or internal storage paths into the client.
 const safe={...p.value,owner:"",files:p.value.files.map(f=>({...f,path:""})),tasks:p.value.tasks.map(t=>({...t,asset:t.asset?.split('/').pop()}))};
 return <><SiteHeader/><main className="handoff-main"><form action={logout}><button className="button button-outline">Sign out of owner workspace</button></form><Workspace initial={safe} connected={Boolean(c?.value.sealed)} last4={c?.value.last4||""} enabled={process.env.STUDIO_BYOK_ENABLED==="true"}/></main><SiteFooter/></>;
}
