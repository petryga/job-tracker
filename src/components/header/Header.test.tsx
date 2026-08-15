import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "test-utils/render";
import { Header } from "./Header";
import type { BoardApi } from "features/boardPage/types";

const board: BoardApi = {
  _id: "board-1",
  title: "Job Search",
  isJobSearchBoard: true,
  lists: [],
};

describe("Header", () => {
  it("shows the board title and a back link", () => {
    renderWithProviders(<Header title={board.title} board={board} />, {
      route: "/board-1",
      path: "/:boardID",
    });

    expect(screen.getByText("Job Search")).toBeInTheDocument();
    expect(screen.getByText("arrow_back").closest("a")).toHaveAttribute(
      "href",
      "/home"
    );
  });

  it("opens the menu with chart, edit and delete options", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header title={board.title} board={board} />, {
      route: "/board-1",
      path: "/:boardID",
    });

    await user.click(screen.getByText("more_horiz"));

    expect(screen.getByText("See Chart")).toBeInTheDocument();
    expect(screen.getByText("Edit Name")).toBeInTheDocument();
    expect(screen.getByText("Delete Board")).toBeInTheDocument();
  });

  it("switches to an editable title field via the menu", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header title={board.title} board={board} />, {
      route: "/board-1",
      path: "/:boardID",
    });

    await user.click(screen.getByText("more_horiz"));
    await user.click(screen.getByText("Edit Name"));

    expect(screen.getByDisplayValue("Job Search")).toBeInTheDocument();
  });

  it("opens the chart modal from the menu", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<Header title={board.title} board={board} />, {
      route: "/board-1",
      path: "/:boardID",
    });

    await user.click(screen.getByText("more_horiz"));
    await user.click(screen.getByText("See Chart"));

    expect(store.getState().modal.openModal).toBe("chartModal");
  });

  it("opens the delete-board confirmation from the menu", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<Header title={board.title} board={board} />, {
      route: "/board-1",
      path: "/:boardID",
    });

    await user.click(screen.getByText("more_horiz"));
    await user.click(screen.getByText("Delete Board"));

    expect(store.getState().modal.openModal).toBe("confirmDelete");
    expect(store.getState().modal.modalProps.name).toBe("deleteBoard");
  });
});
