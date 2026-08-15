import type { Mock } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "test-utils/render";
import Board from "./Board";

vi.mock("react-beautiful-dnd", () => import("test-utils/rbdMock"));

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

const board = {
  _id: "board-1",
  title: "Job Search",
  isJobSearchBoard: false,
  lists: [
    {
      _id: "list-a",
      title: "To Do",
      cards: [
        { _id: "card-1", text: "Write tests", subtext: "", color: "", isFavorite: false },
      ],
    },
  ],
};

describe("Board", () => {
  beforeEach(() => {
    global.fetch = vi.fn((input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : (input as Request).url;
      if (url.includes("/api/contacts")) return jsonResponse([]);
      return jsonResponse(board);
    }) as Mock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a loading state before the board data arrives", async () => {
    renderWithProviders(<Board />, { route: "/board-1", path: "/:boardID" });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    // drain the queries so this test's pending effects don't leak into the next one
    await screen.findByRole("heading", { name: "Job Search" });
  });

  it("renders the fetched board's title, lists and cards", async () => {
    renderWithProviders(<Board />, { route: "/board-1", path: "/:boardID" });

    expect(await screen.findByRole("heading", { name: "Job Search" })).toBeInTheDocument();
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("Write tests")).toBeInTheDocument();
  });

  it("shows a not-found state when there is no board for this id", async () => {
    global.fetch = vi.fn(() =>
      jsonResponse(null)
    ) as unknown as Mock;

    renderWithProviders(<Board />, { route: "/missing", path: "/:boardID" });

    expect(await screen.findByText(/board not found/i)).toBeInTheDocument();
  });

  it("dispatches the fetched board into app state", async () => {
    const { store } = renderWithProviders(<Board />, {
      route: "/board-1",
      path: "/:boardID",
    });

    await waitFor(() =>
      expect(store.getState().app.boards["board-1"]).toBeDefined()
    );
    expect(store.getState().app.boards["board-1"].title).toBe("Job Search");
  });

  it("shows Board/Contacts tabs and switches between them on a job-search board", async () => {
    global.fetch = vi.fn((input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : (input as Request).url;
      if (url.includes("/api/contacts")) {
        return jsonResponse([
          {
            _id: "c1",
            contactName: "Jamie",
            companyName: "",
            position: "",
            contactEmail: "",
            contactPhone: "",
            contactNotes: "",
          },
        ]);
      }
      return jsonResponse({ ...board, isJobSearchBoard: true });
    }) as Mock;

    const user = userEvent.setup();
    renderWithProviders(<Board />, { route: "/board-1", path: "/:boardID" });

    await screen.findByRole("heading", { name: "Job Search" });
    expect(screen.getByText("Write tests")).toBeInTheDocument();
    expect(screen.queryByText("Jamie")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Contacts" }));

    expect(await screen.findByText("Jamie")).toBeInTheDocument();
    expect(screen.queryByText("Write tests")).not.toBeInTheDocument();
  });

  it("does not show tabs on a plain to-do board", async () => {
    renderWithProviders(<Board />, { route: "/board-1", path: "/:boardID" });

    await screen.findByRole("heading", { name: "Job Search" });
    expect(screen.queryByRole("tab", { name: "Contacts" })).not.toBeInTheDocument();
  });
});
