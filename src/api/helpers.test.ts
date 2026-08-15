import { providesList } from "./helpers";

describe("providesList", () => {
  it("tags a LIST id plus one tag per result", () => {
    const results = [{ _id: "a" }, { _id: "b" }];
    expect(providesList(results, "Board")).toEqual([
      { type: "Board", id: "LIST" },
      { type: "Board", id: "a" },
      { type: "Board", id: "b" },
    ]);
  });

  it("tags only LIST when results are empty", () => {
    expect(providesList([], "Board")).toEqual([{ type: "Board", id: "LIST" }]);
  });

  it("tags only LIST when results are undefined", () => {
    expect(providesList(undefined, "Board")).toEqual([
      { type: "Board", id: "LIST" },
    ]);
  });
});
