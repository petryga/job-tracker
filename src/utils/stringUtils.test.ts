import { withCommas } from "./stringUtils";

describe("withCommas", () => {
  it("returns an empty string for falsy input", () => {
    expect(withCommas("")).toBe("");
    expect(withCommas(undefined)).toBe("");
    expect(withCommas(0)).toBe("");
  });

  it("formats a number with thousands separators and two decimals", () => {
    expect(withCommas(1234567)).toBe("1,234,567.00");
  });

  it("formats a numeric string, stripping any existing commas first", () => {
    expect(withCommas("1,234")).toBe("1,234.00");
    expect(withCommas("1000")).toBe("1,000.00");
  });

  it("returns an empty string for non-numeric input", () => {
    expect(withCommas("not a number")).toBe("");
  });

  it("leaves small numbers unpadded with separators", () => {
    expect(withCommas("42")).toBe("42.00");
  });
});
