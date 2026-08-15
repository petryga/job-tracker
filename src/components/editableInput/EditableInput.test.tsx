import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "test-utils/render";
import { EditableInput } from "./EditableInput";
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

const board: BoardApi = {
  _id: "board-1",
  title: "Job Search",
  isJobSearchBoard: true,
  lists: [],
};

describe("EditableInput", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      jsonResponse({ _id: "board-1", title: "Updated" })
    ) as unknown as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("starts pre-filled with the board's current title", () => {
    renderWithProviders(<EditableInput board={board} setEditTitle={jest.fn()} />);
    expect(screen.getByDisplayValue("Job Search")).toBeInTheDocument();
  });

  it("saves the new title and exits edit mode when the check icon is clicked", async () => {
    const setEditTitle = jest.fn();
    const user = userEvent.setup();
    renderWithProviders(<EditableInput board={board} setEditTitle={setEditTitle} />);

    const input = screen.getByDisplayValue("Job Search");
    await user.clear(input);
    await user.type(input, "New Title");
    await user.click(screen.getByText("check"));

    await waitFor(() => expect(setEditTitle).toHaveBeenCalledWith(false));
    const [request] = (global.fetch as jest.Mock).mock.calls[0];
    expect(requestUrl(request)).toContain("/api/boards/board-1");
    expect(JSON.parse(await (request as Request).text())).toEqual({
      title: "New Title",
    });
  });

  it("does nothing when submitted with an empty title", async () => {
    const setEditTitle = jest.fn();
    const user = userEvent.setup();
    renderWithProviders(<EditableInput board={board} setEditTitle={setEditTitle} />);

    await user.clear(screen.getByDisplayValue("Job Search"));
    await user.click(screen.getByText("check"));

    expect(global.fetch).not.toHaveBeenCalled();
    expect(setEditTitle).not.toHaveBeenCalled();
  });
});
