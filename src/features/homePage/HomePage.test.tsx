import type { Mock } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "test-utils/render";
import HomePage from "./HomePage";

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

const board = (i: number) => ({
  _id: `board-${i}`,
  title: `Board ${i}`,
  lists: [],
  isJobSearchBoard: false,
});

describe("HomePage", () => {
  beforeEach(() => {
    localStorage.setItem("userId", "user-1");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("shows a loading state before boards arrive", () => {
    global.fetch = vi.fn(() => new Promise(() => {})) as unknown as Mock;
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows a no-boards message and a create button when there are none", async () => {
    global.fetch = vi.fn(() => jsonResponse([])) as unknown as Mock;
    renderWithProviders(<HomePage />);

    expect(await screen.findByText("no boards")).toBeInTheDocument();
    expect(screen.getByText("create board")).toBeInTheDocument();
  });

  it("renders a thumbnail linking to each board", async () => {
    global.fetch = vi.fn(() =>
      jsonResponse([board(1), board(2)])
    ) as unknown as Mock;
    renderWithProviders(<HomePage />);

    expect(await screen.findByText("Board 1")).toBeInTheDocument();
    expect(screen.getByText("Board 1").closest("a")).toHaveAttribute(
      "href",
      "/board-1"
    );
    expect(screen.getByText("Board 2")).toBeInTheDocument();
  });

  it("shows a limit-reached message instead of the create button at 10 boards", async () => {
    global.fetch = vi.fn(() =>
      jsonResponse(Array.from({ length: 10 }, (_, i) => board(i)))
    ) as unknown as Mock;
    renderWithProviders(<HomePage />);

    expect(await screen.findByText("Limit reached")).toBeInTheDocument();
    expect(screen.queryByText("create board")).not.toBeInTheDocument();
  });

  it("opens the create-board modal when the button is clicked", async () => {
    global.fetch = vi.fn(() => jsonResponse([])) as unknown as Mock;
    const user = userEvent.setup();
    const { store } = renderWithProviders(<HomePage />);

    await screen.findByText("create board");
    await user.click(screen.getByText("create board"));

    expect(store.getState().modal.openModal).toBe("createBoard");
  });
});
