import {SiteHeader,SiteFooter} from "@/app/components/site-chrome";
import {enter} from "./session";
import {UnlockButton} from "@/app/r/[host]/unlock-button";
export const dynamic="force-dynamic";
export const metadata={title:"Open your Sitemaxxing workspace",robots:{index:false,follow:false},referrer:"no-referrer" as const};
export default async function Open({searchParams}:{searchParams:Promise<{ticket?:string;error?:string}>}){
 const {ticket,error}=await searchParams;
 return <><SiteHeader/><main className="handoff-main"><p className="eyebrow">OWNER WORKSPACE</p><h1>Your next version starts here.</h1><p>Open this private workspace to choose your scope, connect an image provider and approve generation. Your report viewing code cannot authorize these actions.</p>{error&&<p role="alert">This owner link expired or was already used. Text REDESIGN to your agent for a fresh link.</p>}{ticket?<form action={enter}><input type="hidden" name="ticket" value={ticket}/><UnlockButton label="Open my workspace"/></form>:<p>Text REDESIGN, ASSETS or PACKAGE to your Sitemaxxing agent to get a private owner link.</p>}<p className="small muted">Owner links expire after 15 minutes and work once. Do not forward them. Share the finished package instead.</p></main><SiteFooter/></>;
}
