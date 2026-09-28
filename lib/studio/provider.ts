import {IMAGE_MODEL} from "./model";
export async function validateKey(key:string){
 if(key.length>512||!/^sk-[A-Za-z0-9_-]{16,}$/.test(key))throw new Error("Enter an OpenAI API key.");
 const r=await fetch(`https://api.openai.com/v1/models/${IMAGE_MODEL}`,{headers:{Authorization:`Bearer ${key}`},signal:AbortSignal.timeout(15000)});
 if(!r.ok)throw new Error("The provider could not verify access to this image model. Check the key and project permissions.");
}
export async function generate(key:string,prompt:string,reference?:Uint8Array){
 let body:BodyInit,headers:Record<string,string>={Authorization:`Bearer ${key}`};let endpoint="generations";
 if(reference){const form=new FormData();form.set("model",IMAGE_MODEL);form.set("prompt",prompt);form.set("n","1");form.set("size","1024x1536");form.set("quality","medium");form.set("output_format","png");const jpeg=reference[0]===255&&reference[1]===216;form.set("image",new Blob([Buffer.from(reference)],{type:jpeg?"image/jpeg":"image/png"}),jpeg?"baseline-screenshot.jpg":"approved-sample.png");body=form;endpoint="edits";}
 else {headers={...headers,"Content-Type":"application/json"};body=JSON.stringify({model:IMAGE_MODEL,prompt,n:1,size:"1024x1536",quality:"medium",output_format:"png"});}
 // No automatic retry: an ambiguous failure may already have incurred a provider charge.
 const response=await fetch(`https://api.openai.com/v1/images/${endpoint}`,{method:"POST",headers,body,signal:AbortSignal.timeout(210000)});
 if(!response.ok)throw new Error("Generation did not return an image. Check your provider's usage before retrying; an attempt has been reserved.");
 const data=await response.json();const b64=data.data?.[0]?.b64_json;
 if(typeof b64!=="string"||b64.length>40_000_000)throw new Error("The provider returned an unexpected image response.");
 const image=Buffer.from(b64,"base64");if(image.subarray(0,8).toString("hex")!=="89504e470d0a1a0a")throw new Error("The provider did not return a PNG.");
 return {image,requestId:response.headers.get("x-request-id")??undefined};
}
