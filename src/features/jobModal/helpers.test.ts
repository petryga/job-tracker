import {
  Fields,
  getStyle,
  getWidth,
  getIsButtonDisabled,
  handleFormatSalary,
  openLink,
  INITIAL_VALUES,
} from "./helpers";
import type { Job } from "./types";

describe("getStyle", () => {
  it("gives link and salary fields the wide-field style", () => {
    expect(getStyle(false, Fields.link)).toEqual({ width: "90%", marginTop: "10px" });
    expect(getStyle(false, Fields.salary)).toEqual({ width: "90%", marginTop: "10px" });
  });

  it("gives a textarea field the textarea style, before checking wide fields", () => {
    expect(getStyle(true, Fields.notes)).toEqual({ width: "90%", marginTop: "13px" });
  });

  it("gives location a right margin to pair with company name", () => {
    expect(getStyle(false, Fields.location)).toEqual({
      width: "44%",
      marginTop: "10px",
      marginRight: "10px",
    });
  });

  it("gives company name a right margin and no top margin", () => {
    expect(getStyle(false, Fields.companyName)).toEqual({
      width: "44%",
      marginRight: "10px",
    });
  });

  it("gives remoteOnsite a top margin and no right margin", () => {
    expect(getStyle(false, Fields.remoteOnsite)).toEqual({
      width: "44%",
      marginTop: "10px",
    });
  });

  it("falls back to a bare half-width style for everything else", () => {
    expect(getStyle(false, Fields.position)).toEqual({ width: "44%" });
  });
});

describe("getWidth", () => {
  it("gives a single contact half the width", () => {
    expect(getWidth({ length: 1 })).toBe("50%");
  });

  it("gives multiple contacts nearly full width", () => {
    expect(getWidth({ length: 2 })).toBe("95%");
    expect(getWidth({ length: 3 })).toBe("95%");
  });
});

describe("getIsButtonDisabled", () => {
  const job: Job = { ...INITIAL_VALUES, companyName: "Acme" };

  it("is disabled without a company name", () => {
    expect(getIsButtonDisabled({ ...INITIAL_VALUES }, job)).toBe(true);
  });

  it("is disabled when the form is unchanged from the loaded job", () => {
    expect(getIsButtonDisabled(job, job)).toBe(true);
  });

  it("is enabled once a field differs from the loaded job", () => {
    expect(getIsButtonDisabled({ ...job, position: "Engineer" }, job)).toBe(false);
  });
});

describe("handleFormatSalary", () => {
  it("formats the salary field with thousands separators", () => {
    const setFormData = jest.fn();
    handleFormatSalary(
      Fields.salary,
      { ...INITIAL_VALUES, salary: "100000" },
      setFormData
    );
    expect(setFormData).toHaveBeenCalledWith({ salary: "100,000.00" });
  });

  it("does nothing for a non-salary field", () => {
    const setFormData = jest.fn();
    handleFormatSalary(
      Fields.position,
      { ...INITIAL_VALUES, salary: "100000" },
      setFormData
    );
    expect(setFormData).not.toHaveBeenCalled();
  });

  it("does nothing when salary is empty", () => {
    const setFormData = jest.fn();
    handleFormatSalary(Fields.salary, { ...INITIAL_VALUES, salary: "" }, setFormData);
    expect(setFormData).not.toHaveBeenCalled();
  });
});

describe("openLink", () => {
  beforeEach(() => {
    jest.spyOn(window, "open").mockImplementation(() => null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("opens the link as-is when it already has a protocol", () => {
    openLink("https://example.com");
    expect(window.open).toHaveBeenCalledWith(
      "https://example.com",
      "_blank",
      "noopener noreferrer"
    );
  });

  it("prepends https:// to a bare domain", () => {
    openLink("example.com");
    expect(window.open).toHaveBeenCalledWith(
      "https://example.com",
      "_blank",
      "noopener noreferrer"
    );
  });
});
