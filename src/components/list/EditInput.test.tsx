import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "test-utils/render";
import { EditInput } from "./EditInput";

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

describe("EditInput", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      jsonResponse({ message: "Updated" })
    ) as unknown as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("closes without saving when the title is unchanged on blur", async () => {
    const setIsEditing = jest.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <EditInput
        setListTitle={jest.fn()}
        setIsEditing={setIsEditing}
        listID="list-1"
        listTitle="To Do"
        boardID="board-1"
        title="To Do"
      />,
      { route: "/board-1", path: "/:boardID" }
    );

    await user.click(screen.getByDisplayValue("To Do"));
    await user.tab();

    expect(global.fetch).not.toHaveBeenCalled();
    expect(setIsEditing).toHaveBeenCalledWith(false);
  });

  it("saves the new title on blur when it has changed", async () => {
    const setIsEditing = jest.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <EditInput
        setListTitle={jest.fn()}
        setIsEditing={setIsEditing}
        listID="list-1"
        listTitle="Backlog"
        boardID="board-1"
        title="To Do"
      />,
      { route: "/board-1", path: "/:boardID" }
    );

    await user.click(screen.getByDisplayValue("Backlog"));
    await user.tab();

    const [request] = (global.fetch as jest.Mock).mock.calls[0];
    expect(requestUrl(request)).toContain("/api/boards/lists/updateList/list-1");
    expect(JSON.parse(await (request as Request).text())).toEqual({
      title: "Backlog",
      boardID: "board-1",
    });
  });

  it("saves on Enter as well as on blur", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <EditInput
        setListTitle={jest.fn()}
        setIsEditing={jest.fn()}
        listID="list-1"
        listTitle="Backlog"
        boardID="board-1"
        title="To Do"
      />,
      { route: "/board-1", path: "/:boardID" }
    );

    await user.type(screen.getByDisplayValue("Backlog"), "{Enter}");
    expect(global.fetch).toHaveBeenCalled();
  });

  it("calls setListTitle as the user types", async () => {
    const setListTitle = jest.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <EditInput
        setListTitle={setListTitle}
        setIsEditing={jest.fn()}
        listID="list-1"
        listTitle=""
        boardID="board-1"
        title="To Do"
      />,
      { route: "/board-1", path: "/:boardID" }
    );

    await user.type(screen.getByRole("textbox"), "B");
    expect(setListTitle).toHaveBeenCalledWith("B");
  });
});
