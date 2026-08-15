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
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 0,
      font: "",
      textAlign: "",
      textBaseline: "",
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      arc: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      fillText: vi.fn(),
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
