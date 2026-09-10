import { describe, expect, it } from "vitest";
import { isReservedUsername, nextUsernameChangeAt, normalizeUsername } from "./username";

describe("username policy", () => {
  it("normalizes case, spaces and the optional at sign", () => {
    expect(normalizeUsername("  @Fabit ")).toBe("fabit");
  });

  it("reserves platform and impersonation-sensitive names", () => {
    expect(isReservedUsername("@Admin")).toBe(true);
    expect(isReservedUsername("fabit")).toBe(false);
  });

  it("blocks another change during the first 24 hours", () => {
    const changed = new Date("2026-09-10T10:00:00Z");
    expect(nextUsernameChangeAt(changed, new Date("2026-09-11T09:59:59Z")))?.toEqual(new Date("2026-09-11T10:00:00Z"));
    expect(nextUsernameChangeAt(changed, new Date("2026-09-11T10:00:00Z"))).toBeNull();
  });
});
