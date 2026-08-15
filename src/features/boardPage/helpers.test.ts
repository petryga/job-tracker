import { getRandomColor, tabProps } from "./helpers";

describe("getRandomColor", () => {
  it("returns one of the known palette colors", () => {
    const colors = [
      "#FACC00",
      "#FC8025",
      "#FB6A79",
      "#FB8355",
      "#FB6A85",
      "#EE649C",
      "#ACCF93",
      "#33AFFA",
      "#4177F7",
      "#637DB4",
      "#E84779",
      "#53C0A1",
      "#75DF9A",
    ];

    for (let i = 0; i < 20; i++) {
      expect(colors).toContain(getRandomColor());
    }
  });
});

describe("tabProps", () => {
  it("carries a background style", () => {
    expect(tabProps.style.background).toEqual(expect.any(String));
  });
});
