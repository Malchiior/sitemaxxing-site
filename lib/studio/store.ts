import {get,put} from "@vercel/blob";
export async function read<T>(path:string):Promise<{value:T;etag:string}|null>{
 const r=await get(`studio/${path}`,{access:"private",useCache:false});
 if(!r||r.statusCode!==200)return null;
 return {value:await new Response(r.stream).json() as T,etag:r.blob.etag};
}
export async function write(path:string,value:unknown,etag?:string){
 return put(`studio/${path}`,JSON.stringify(value),{access:"private",addRandomSuffix:false,contentType:"application/json",...(etag?{ifMatch:etag}:{allowOverwrite:false})});
}
export async function bytes(path:string){const r=await get(path,{access:"private",useCache:false});return r?.statusCode===200?new Uint8Array(await new Response(r.stream).arrayBuffer()):null;}
export async function asset(path:string,data:Uint8Array,type:string){await put(path,Buffer.from(data),{access:"private",addRandomSuffix:false,contentType:type,allowOverwrite:false});}
