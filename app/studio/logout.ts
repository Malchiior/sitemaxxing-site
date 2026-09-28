"use server";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {sameOrigin} from "@/lib/studio/auth";
import {digest} from "@/lib/studio/security";
import {read,write} from "@/lib/studio/store";
export async function logout(){await sameOrigin();const jar=await cookies();const raw=jar.get("__Host-studio")?.value;if(raw&&/^[a-f0-9]{64}$/.test(raw)){const name=`sessions/${digest(raw)}.json`;const s=await read<{owner:string;expires:number}>(name);if(s)await write(name,{...s.value,expires:0},s.etag);}jar.delete("__Host-studio");redirect("/studio/open");}
