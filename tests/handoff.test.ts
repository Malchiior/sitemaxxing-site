import { describe, it, expect } from "vitest";
import { handoffFile, handoffType } from "../lib/handoff";
import type { ReportMeta } from "../lib/reports";
const meta:ReportMeta = {host:"app.plow.co",kind:"handoff",pages:0,summary:"",salt:"",codeHash:"",createdAt:"",handoff:{prefix:"handoffs/version",files:[{path:"AGENT-PROMPT.md",bytes:12,sha256:"a"}]}};
describe("handoff file allowlist",()=>{
  it("only serves exact manifest files",()=>{expect(handoffFile(meta,"AGENT-PROMPT.md")?.bytes).toBe(12);expect(handoffFile(meta,"secret.env")).toBeNull();});
  it("rejects path traversal and non-handoffs",()=>{for(const path of ["../AGENT-PROMPT.md","x/../AGENT-PROMPT.md","x\\AGENT-PROMPT.md","/AGENT-PROMPT.md"])expect(handoffFile(meta,path)).toBeNull();expect(handoffFile({...meta,kind:"page"},"AGENT-PROMPT.md")).toBeNull();});
  it("serves prompts as text and ZIP as archive",()=>{expect(handoffType("AGENT-PROMPT.md")).toBe("text/plain; charset=utf-8");expect(handoffType("a.zip")).toBe("application/zip");});
});
