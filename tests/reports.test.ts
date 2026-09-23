import { describe, expect, it } from "vitest";
import {
  generateCode,
  hashCode,
  isValidHost,
  rateLimited,
  resetRateLimits,
  sessionToken,
  verifyCode,
  verifySessionToken,
} from "../lib/reports";

describe("isValidHost", () => {
  it.each(["sbeoc.com", "a.b.c", "my-site.co.uk", "localhost", "x1"])("accepts %s", (h) =>
    expect(isValidHost(h)).toBe(true),
  );
  it.each([
    "",
    "SBEOC.com",
    "a b.com",
    "../etc",
    "site.com/",
    "-a.com",
    "a-.com",
    ".a.com",
    "a..com",
    "a.com.",
    "héllo.com",
    "a_b.com",
    "a.com?x",
    null,
    42,
  ])("rejects %s", (h) => expect(isValidHost(h)).toBe(false));
});

describe("codes", () => {
  it("generates 6 digits", () => {
    for (let i = 0; i < 50; i++) expect(generateCode()).toMatch(/^\d{6}$/);
  });
  it("verifies the right code and rejects others", () => {
    const salt = "abc";
    const hash = hashCode("114242", salt);
    expect(verifyCode("114242", salt, hash)).toBe(true);
    expect(verifyCode("114243", salt, hash)).toBe(false);
    expect(verifyCode("114242", "other", hash)).toBe(false);
    expect(verifyCode("11424", salt, hash)).toBe(false);
    expect(verifyCode("", salt, hash)).toBe(false);
    expect(verifyCode(undefined, salt, hash)).toBe(false);
  });
  it("cookie token is bound to host and hash", () => {
    const t = sessionToken("sbeoc.com", "h1", "k");
    expect(verifySessionToken(t, "sbeoc.com", "h1", "k")).toBe(true);
    expect(verifySessionToken(t, "sbeoc.com", "h2", "k")).toBe(false);
    expect(verifySessionToken(t, "other.com", "h1", "k")).toBe(false);
    expect(verifySessionToken("nope", "sbeoc.com", "h1", "k")).toBe(false);
  });
});

describe("rateLimited", () => {
  it("allows up to the limit then blocks, and resets after the window", () => {
    resetRateLimits();
    for (let i = 0; i < 3; i++) expect(rateLimited("ip", 3, 1000, 0)).toBe(false);
    expect(rateLimited("ip", 3, 1000, 0)).toBe(true);
    expect(rateLimited("ip", 3, 1000, 2000)).toBe(false);
  });
});
