import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "test-utils/render";
import FormList from "./List";
import type { BoardApi, List } from "features/boardPage/types";

vi.mock("@hello-pangea/dnd", () => import("test-utils/rbdMock"));

const board: BoardApi = {
  _id: "board-1",
  title: "Board",
  isJobSearchBoard: true,
  lists: [],
};

const list: List = {
  _id: "list-a",
  title: "To Do",
  cards: [
    { _id: "card-1", text: "First", subtext: "", color: "", isFavorite: false },
    { _id: "card-2", text: "Second", subtext: "", color: "", isFavorite: false },
  ],
};

describe("List", () => {
  it("renders the list title and every card", () => {
    renderWithProviders(
      <FormList list={list} index={0} board={board} cards={list.cards} />,
      { route: "/board-1", path: "/:boardID" }
    );

    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("shows the job count only for job-search boards", () => {
    renderWithProviders(
      <FormList list={list} index={0} board={board} cards={list.cards} />,
      { route: "/board-1", path: "/:boardID" }
    );

    expect(screen.getByText("2 JOBS")).toBeInTheDocument();
  });

  it("hides the job count on a plain to-do board", () => {
    renderWithProviders(
      <FormList
        list={list}
        index={0}
        board={{ ...board, isJobSearchBoard: false }}
        cards={list.cards}
      />,
      { route: "/board-1", path: "/:boardID" }
    );

    expect(screen.queryByText(/JOBS/)).not.toBeInTheDocument();
  });

  it("opens the list menu and offers edit/delete actions", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <FormList list={list} index={0} board={board} cards={list.cards} />,
      { route: "/board-1", path: "/:boardID" }
    );

    await user.click(screen.getByText("more_horiz"));

    expect(screen.getByText("Edit Name")).toBeInTheDocument();
    expect(screen.getByText("Delete List")).toBeInTheDocument();
  });

  it("switches to an editable title field from the menu", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <FormList list={list} index={0} board={board} cards={list.cards} />,
      { route: "/board-1", path: "/:boardID" }
    );

    await user.click(screen.getByText("more_horiz"));
    await user.click(screen.getByText("Edit Name"));

    expect(screen.getByDisplayValue("To Do")).toBeInTheDocument();
  });
});
