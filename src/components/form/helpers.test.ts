import { getPlaceholder, getNewJobData } from "./helpers";
import { INITIAL_VALUES } from "features/jobModal/helpers";

describe("getPlaceholder", () => {
  it("prompts for a list title when creating a list", () => {
    expect(getPlaceholder(true, false)).toBe("Enter list title");
    expect(getPlaceholder(true, true)).toBe("Enter list title");
  });

  it("prompts for a company name on a job-search board", () => {
    expect(getPlaceholder(false, true)).toBe("Enter company name");
  });

  it("prompts for a generic card title otherwise", () => {
    expect(getPlaceholder(false, false)).toBe("Enter a title for this card");
  });
});

describe("getNewJobData", () => {
  it("seeds job initial values with the given company name and id", () => {
    expect(getNewJobData("Acme", "card-1")).toEqual({
      ...INITIAL_VALUES,
      companyName: "Acme",
      id: "card-1",
    });
  });
});
