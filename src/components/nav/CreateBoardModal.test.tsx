import type { Mock } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "test-utils/render";
import { CreateBoardModal } from "./CreateBoardModal";
import { CREATE_BOARD } from "utils/constants";

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

describe("CreateBoardModal", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      jsonResponse({ _id: "board-1", title: "Job Search" })
    ) as unknown as Mock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("disables submit until a title is entered", () => {
    renderWithProviders(<CreateBoardModal />, {
      preloadedState: { modal: { openModal: CREATE_BOARD } },
    });

    expect(screen.getByText("Submit").closest("button")).toBeDisabled();
  });

  it("fills the title from a suggestion button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateBoardModal />, {
      preloadedState: { modal: { openModal: CREATE_BOARD } },
    });

    await user.click(screen.getByText(/Job Search/));
    expect(screen.getByDisplayValue("Job Search")).toBeInTheDocument();
    expect(screen.getByText("Submit").closest("button")).not.toBeDisabled();
  });

  it("clears the title via the clear icon once text is present", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateBoardModal />, {
      preloadedState: { modal: { openModal: CREATE_BOARD } },
    });

    await user.type(screen.getByRole("textbox"), "My Board");
    expect(screen.queryByText("clear")).toBeInTheDocument();

    await user.click(screen.getByText("clear"));
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("creates the board and closes the modal on submit", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<CreateBoardModal />, {
      preloadedState: { modal: { openModal: CREATE_BOARD } },
    });

    await user.type(screen.getByRole("textbox"), "New Board");
    await user.click(screen.getByText("Submit"));

    await waitFor(() => expect(store.getState().modal.openModal).toBeNull());
    const [request] = (global.fetch as Mock).mock.calls[0];
    expect(JSON.parse(await (request as Request).text())).toEqual({
      title: "New Board",
    });
  });
});
