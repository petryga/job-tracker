import { fireEvent, render, screen } from "@testing-library/react";
import { PieChart } from "./PieChart";
import type { Board } from "reducers/types";

const boardState: Board = {
  _id: "board-1",
  title: "Board",
  isJobSearchBoard: true,
  lists: [
    {
      _id: "l1",
      title: "To Do",
      cards: [{ _id: "c1", text: "Acme", isFavorite: false, subtext: "", color: "#fff" }],
    },
  ],
};

describe("PieChart", () => {
  beforeEach(() => {
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
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
    })) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  });

  it("renders a canvas sized to the chart", () => {
    const { container } = render(<PieChart boardState={boardState} />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toHaveAttribute("width", "550");
    expect(canvas).toHaveAttribute("height", "400");
  });

  it("shows a tooltip with the slice's companies when hovering inside it", () => {
    const { container } = render(<PieChart boardState={boardState} />);
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;

    fireEvent.mouseMove(canvas, { clientX: 275, clientY: 200 });

    expect(screen.getByText("Acme")).toBeInTheDocument();
  });

  it("hides the tooltip once the pointer leaves the slice", () => {
    const { container } = render(<PieChart boardState={boardState} />);
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;

    fireEvent.mouseMove(canvas, { clientX: 275, clientY: 200 });
    expect(screen.getByText("Acme")).toBeInTheDocument();

    fireEvent.mouseMove(canvas, { clientX: 5000, clientY: 5000 });
    expect(screen.queryByText("Acme")).not.toBeInTheDocument();
  });
});
