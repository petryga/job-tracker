import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "test-utils/render";
import { ChartModal } from "./ChartModal";
import { CHART_MODAL } from "utils/constants";
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

describe("ChartModal", () => {
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

  it("renders nothing when it isn't the open modal", () => {
    renderWithProviders(<ChartModal boardState={boardState} />, {
      preloadedState: { modal: { openModal: null } },
    });
    expect(screen.queryByText("chart")).not.toBeInTheDocument();
  });

  it("renders the chart canvas and a Close button when open", () => {
    renderWithProviders(<ChartModal boardState={boardState} />, {
      preloadedState: { modal: { openModal: CHART_MODAL } },
    });

    expect(screen.getByText("chart")).toBeInTheDocument();
    // MUI's Modal portals into document.body, outside the render container.
    expect(document.querySelector("canvas")).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();
    expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
  });

  it("closes the modal when Close is clicked", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<ChartModal boardState={boardState} />, {
      preloadedState: { modal: { openModal: CHART_MODAL } },
    });

    await user.click(screen.getByText("Close"));
    expect(store.getState().modal.openModal).toBeNull();
  });
});
