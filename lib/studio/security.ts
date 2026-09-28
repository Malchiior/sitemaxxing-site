import {createCipheriv,createDecipheriv,createHash,randomBytes} from "node:crypto";
export const digest=(s:string)=>createHash("sha256").update(s).digest("hex");
export const token=()=>randomBytes(32).toString("hex");
export const validId=(s:string)=>/^[a-f0-9]{32}$/.test(s);
function key(){const s=process.env.STUDIO_ENCRYPTION_KEY;if(!s||!/^[a-f0-9]{64}$/.test(s))throw new Error("Provider storage is not configured.");return Buffer.from(s,"hex");}
export function seal(secret:string,owner:string){const iv=randomBytes(12);const c=createCipheriv("aes-256-gcm",key(),iv);c.setAAD(Buffer.from(owner));const data=Buffer.concat([c.update(secret,"utf8"),c.final()]);return Buffer.concat([iv,c.getAuthTag(),data]).toString("base64");}
export function unseal(payload:string,owner:string){const b=Buffer.from(payload,"base64");const d=createDecipheriv("aes-256-gcm",key(),b.subarray(0,12));d.setAAD(Buffer.from(owner));d.setAuthTag(b.subarray(12,28));return Buffer.concat([d.update(b.subarray(28)),d.final()]).toString("utf8");}
