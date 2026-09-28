import {cookies,headers} from "next/headers";
import {read} from "./store";
import {digest,validId} from "./security";
import type {StudioProject} from "./model";
export async function owner(){
 const raw=(await cookies()).get("__Host-studio")?.value;
 if(!raw||!/^\w{64}$/.test(raw))return null;
 const s=await read<{owner:string;expires:number}>(`sessions/${digest(raw)}.json`);
 return s&&s.value.expires>Date.now()?s.value.owner:null;
}
export async function project(id:string){
 if(!validId(id))throw new Error("Project not found.");
 const who=await owner();if(!who)throw new Error("Open a fresh owner link from your Sitemaxxing agent.");
 const p=await read<StudioProject>(`projects/${id}.json`);
 if(!p||p.value.owner!==who)throw new Error("Project not found.");return p;
}
export async function sameOrigin(){const h=await headers();const origin=h.get("origin");const host=h.get("x-forwarded-host")||h.get("host");if(!origin||new URL(origin).host!==host)throw new Error("Open this action from the Sitemaxxing website.");}
