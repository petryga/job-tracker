import type { Mock } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "test-utils/render";
import { CreateNewEntry } from "./CreateNewEntry";
import type { BoardApi } from "features/boardPage/types";

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

const emptyBoard: BoardApi = {
  _id: "board-1",
  title: "Board",
  isJobSearchBoard: false,
  lists: [],
};

describe("CreateNewEntry", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() => jsonResponse({ _id: "new" })) as unknown as Mock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("invites to add the first list when the board is empty", () => {
    renderWithProviders(<CreateNewEntry list board={emptyBoard} />, {
      route: "/board-1",
      path: "/:boardID",
    });
    expect(screen.getByText("Add list")).toBeInTheDocument();
  });

  it("invites to add another list once the board already has one", () => {
    renderWithProviders(
      <CreateNewEntry
        list
        board={{ ...emptyBoard, lists: [{ _id: "l1", title: "To Do", cards: [] }] }}
      />,
      { route: "/board-1", path: "/:boardID" }
    );
    expect(screen.getByText("Add another list")).toBeInTheDocument();
  });

  it("opens the form and submits a new list", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateNewEntry list board={emptyBoard} />, {
      route: "/board-1",
      path: "/:boardID",
    });

    await user.click(screen.getByText("Add list"));
    await user.type(screen.getByPlaceholderText("Enter list title"), "Backlog");
    await user.click(screen.getByText("Add List"));

    const [request] = (global.fetch as Mock).mock.calls[0];
    expect(requestUrl(request)).toContain("/api/boards/lists/createList");
    expect(JSON.parse(await (request as Request).text())).toEqual({
      title: "Backlog",
      boardID: "board-1",
    });
  });

  it("opens the form and submits a new card for a given list", async () => {
    const user = userEvent.setup();
    const boardWithList: BoardApi = {
      ...emptyBoard,
      lists: [{ _id: "list-1", title: "To Do", cards: [] }],
    };
    renderWithProviders(<CreateNewEntry listID="list-1" board={boardWithList} />, {
      route: "/board-1",
      path: "/:boardID",
    });

    await user.click(screen.getByText("add"));
    await user.type(screen.getByPlaceholderText("Enter a title for this card"), "Write tests");
    await user.click(screen.getByText("Add Card"));

    const [request] = (global.fetch as Mock).mock.calls[0];
    expect(requestUrl(request)).toContain("/api/boards/cards/createCard");
    expect(JSON.parse(await (request as Request).text())).toEqual({
      listID: "list-1",
      boardID: "board-1",
      text: "Write tests",
      isJobSearchBoard: false,
    });
  });

  it("submits on Enter and closes the form", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateNewEntry list board={emptyBoard} />, {
      route: "/board-1",
      path: "/:boardID",
    });

    await user.click(screen.getByText("Add list"));
    await user.type(screen.getByPlaceholderText("Enter list title"), "Backlog{Enter}");

    expect(global.fetch).toHaveBeenCalled();
    expect(screen.queryByPlaceholderText("Enter list title")).not.toBeInTheDocument();
  });
});
