import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "test-utils/render";
import FormCard from "./Card";
import type { BoardApi, Card as CardType } from "features/boardPage/types";

jest.mock("react-beautiful-dnd", () => require("test-utils/rbdMock"));

const jsonResponse = (body: unknown) =>
  Promise.resolve({
    ok: true,
    status: 200,
    headers: new Headers({ "content-type": "application/json" }),
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
    clone() {
      return this as unknown as Response;
    },
  } as Response);

const requestUrl = (input: unknown): string =>
  typeof input === "string" ? input : (input as Request).url;

const card: CardType = {
  _id: "card-1",
  text: "Write tests",
  subtext: "Backend Engineer",
  color: "#FACC00",
  isFavorite: false,
};

const jobBoard: BoardApi = {
  _id: "board-1",
  title: "Job Search",
  isJobSearchBoard: true,
  lists: [],
};

const todoBoard: BoardApi = { ...jobBoard, isJobSearchBoard: false };

describe("Card", () => {
  it("renders the card text and, on a job board, the subtext", () => {
    renderWithProviders(
      <FormCard card={card} listID="list-a" index={0} board={jobBoard} />,
      { route: "/board-1", path: "/:boardID" }
    );

    expect(screen.getByText("Write tests")).toBeInTheDocument();
    expect(screen.getByText("Backend Engineer")).toBeInTheDocument();
  });

  it("hides the subtext on a plain to-do board", () => {
    renderWithProviders(
      <FormCard card={card} listID="list-a" index={0} board={todoBoard} />,
      { route: "/board-1", path: "/:boardID" }
    );

    expect(screen.queryByText("Backend Engineer")).not.toBeInTheDocument();
  });

  it("shows a delete icon on a to-do board and a favorite icon on a job board", () => {
    renderWithProviders(
      <FormCard card={card} listID="list-a" index={0} board={todoBoard} />,
      { route: "/board-1", path: "/:boardID" }
    );
    expect(screen.getByText("delete_outline")).toBeInTheDocument();

    renderWithProviders(
      <FormCard card={card} listID="list-a" index={0} board={jobBoard} />,
      { route: "/board-1", path: "/:boardID" }
    );
    expect(screen.getByText("favorite_border")).toBeInTheDocument();
  });

  it("reflects isFavorite in the job-board favorite icon", () => {
    renderWithProviders(
      <FormCard
        card={{ ...card, isFavorite: true }}
        listID="list-a"
        index={0}
        board={jobBoard}
      />,
      { route: "/board-1", path: "/:boardID" }
    );

    expect(screen.getByText("favorite")).toBeInTheDocument();
  });

  it("double-clicking a to-do card opens an inline edit form", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <FormCard card={card} listID="list-a" index={0} board={todoBoard} />,
      { route: "/board-1", path: "/:boardID" }
    );

    await user.dblClick(screen.getByText("Write tests"));

    expect(screen.getByDisplayValue("Write tests")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("double-clicking a job card opens the job modal instead of editing inline", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(
      <FormCard card={card} listID="list-a" index={0} board={jobBoard} />,
      { route: "/board-1", path: "/:boardID" }
    );

    await user.dblClick(screen.getByText("Write tests"));

    expect(screen.queryByText("Save")).not.toBeInTheDocument();
    expect(store.getState().modal.openModal).toBe("jobSearch");
    expect(store.getState().modal.modalProps.id).toBe("card-1");
  });

  it("saves an edited to-do card's text and exits edit mode", async () => {
    global.fetch = jest.fn(() =>
      jsonResponse({ message: "Updated" })
    ) as unknown as jest.Mock;
    const user = userEvent.setup();
    renderWithProviders(
      <FormCard card={card} listID="list-a" index={0} board={todoBoard} />,
      { route: "/board-1", path: "/:boardID" }
    );

    await user.dblClick(screen.getByText("Write tests"));
    const textarea = screen.getByDisplayValue("Write tests");
    await user.clear(textarea);
    await user.type(textarea, "Write more tests");
    await user.click(screen.getByText("Save"));

    const [request] = (global.fetch as jest.Mock).mock.calls[0];
    expect(requestUrl(request)).toContain("/api/boards/cards/updateCard/card-1");
    expect(JSON.parse(await (request as Request).text())).toEqual({
      text: "Write more tests",
      listID: "list-a",
      boardID: "board-1",
    });
    // The card's displayed text comes from the `card` prop, which only
    // changes once the parent re-fetches; here we just confirm the request
    // fired with the new text and edit mode was exited.
    await screen.findByText("Write tests");
    expect(screen.queryByText("Save")).not.toBeInTheDocument();
  });

  it("closes the edit form without saving when the close icon is clicked", async () => {
    global.fetch = jest.fn() as unknown as jest.Mock;
    const user = userEvent.setup();
    renderWithProviders(
      <FormCard card={card} listID="list-a" index={0} board={todoBoard} />,
      { route: "/board-1", path: "/:boardID" }
    );

    await user.dblClick(screen.getByText("Write tests"));
    await user.click(screen.getByText("close"));

    expect(global.fetch).not.toHaveBeenCalled();
    expect(screen.getByText("Write tests")).toBeInTheDocument();
  });

  it("does not save when the text is unchanged", async () => {
    global.fetch = jest.fn() as unknown as jest.Mock;
    const user = userEvent.setup();
    renderWithProviders(
      <FormCard card={card} listID="list-a" index={0} board={todoBoard} />,
      { route: "/board-1", path: "/:boardID" }
    );

    await user.dblClick(screen.getByText("Write tests"));
    await user.click(screen.getByText("Save"));

    expect(global.fetch).not.toHaveBeenCalled();
  });
});
