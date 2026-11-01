import { describe, expect, it } from "vitest";
import { isAdminEmail } from "./admin-email";

describe("isAdminEmail", () => {
  it("accepts the owner's email, any letter case", () => {
    expect(isAdminEmail("enockkavuma349@gmail.com")).toBe(true);
    expect(isAdminEmail("EnockKavuma349@Gmail.com")).toBe(true);
  });
  it("rejects any other email or no email", () => {
    expect(isAdminEmail("someone@gmail.com")).toBe(false);
    expect(isAdminEmail(null)).toBe(false);
  });
});
