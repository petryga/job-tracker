import {
  drawPieSlice,
  drawText,
  getTotal,
  isPointInSlice,
  getTransformedData,
} from "./helpers";
import type { Board } from "reducers/types";

const makeCtx = () =>
  ({
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 0,
    font: "",
    textAlign: "",
    textBaseline: "",
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    arc: jest.fn(),
    closePath: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    fillText: jest.fn(),
  } as unknown as CanvasRenderingContext2D);

describe("drawPieSlice", () => {
  it("fills the slice and strokes a border when borderWidth is positive", () => {
    const ctx = makeCtx();
    drawPieSlice({
      ctx,
      centerX: 10,
      centerY: 10,
      radius: 5,
      startAngle: 0,
      endAngle: 1,
      color: "#fff",
      borderColor: "#000",
      borderWidth: 2,
    });

    expect(ctx.fillStyle).toBe("#fff");
    expect(ctx.fill).toHaveBeenCalled();
    expect(ctx.strokeStyle).toBe("#000");
    expect(ctx.lineWidth).toBe(2);
    expect(ctx.stroke).toHaveBeenCalled();
  });

  it("skips the border stroke when borderWidth is zero", () => {
    const ctx = makeCtx();
    drawPieSlice({
      ctx,
      centerX: 10,
      centerY: 10,
      radius: 5,
      startAngle: 0,
      endAngle: 1,
      color: "#fff",
      borderColor: "#000",
      borderWidth: 0,
    });

    expect(ctx.stroke).not.toHaveBeenCalled();
  });
});

describe("drawText", () => {
  it("draws the percentage and title text at the slice's midpoint", () => {
    const ctx = makeCtx();
    drawText({
      ctx,
      centerX: 100,
      centerY: 100,
      radius: 50,
      startAngle: 0,
      endAngle: Math.PI,
      text: "50%",
      title: "To Do",
    });

    expect(ctx.fillText).toHaveBeenCalledWith("To Do", expect.any(Number), expect.any(Number));
    expect(ctx.fillText).toHaveBeenCalledWith("50%", expect.any(Number), expect.any(Number));
  });
});

describe("getTotal", () => {
  it("sums the value across every slice", () => {
    expect(getTotal([{ value: 2, color: "", title: "", companies: [] }, { value: 3, color: "", title: "", companies: [] }])).toBe(5);
  });

  it("returns 0 for no slices", () => {
    expect(getTotal([])).toBe(0);
  });
});

describe("isPointInSlice", () => {
  const canvas = { width: 200, height: 200 } as HTMLCanvasElement;

  it("detects a point inside the slice's angle range and radius", () => {
    expect(
      isPointInSlice({
        mouseX: 150,
        mouseY: 100,
        sliceStartAngle: -0.1,
        sliceEndAngle: 0.1,
        sliceRadius: 100,
        canvas,
      })
    ).toBe(true);
  });

  it("rejects a point outside the slice radius", () => {
    expect(
      isPointInSlice({
        mouseX: 199,
        mouseY: 199,
        sliceStartAngle: 0,
        sliceEndAngle: 2 * Math.PI,
        sliceRadius: 10,
        canvas,
      })
    ).toBe(false);
  });

  it("rejects a point in radius but outside the slice's angle range", () => {
    expect(
      isPointInSlice({
        mouseX: 100,
        mouseY: 150,
        sliceStartAngle: 0,
        sliceEndAngle: 0.1,
        sliceRadius: 100,
        canvas,
      })
    ).toBe(false);
  });
});

describe("getTransformedData", () => {
  const board: Board = {
    _id: "b1",
    title: "Board",
    isJobSearchBoard: true,
    lists: [
      {
        _id: "l1",
        title: "To Do",
        cards: [
          { _id: "c1", text: "Acme", isFavorite: false, subtext: "", color: "#fff" },
        ],
      },
      { _id: "l2", title: "Empty", cards: [] },
    ],
  };

  it("maps each non-empty list to a slice keyed on its first card's color", () => {
    expect(getTransformedData(board)).toEqual([
      { value: 1, color: "#fff", title: "To Do", companies: ["Acme"] },
    ]);
  });

  it("excludes lists with no cards", () => {
    const titles = getTransformedData(board).map((slice) => slice.title);
    expect(titles).not.toContain("Empty");
  });
});
