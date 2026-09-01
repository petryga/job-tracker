import type { Mock } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "test-utils/render";
import { DeleteModal } from "./DeleteModal";
import { CONFIRM_DELETE, DELETE_BOARD, DELETE_CONTACT } from "utils/constants";

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

describe("DeleteModal", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      jsonResponse({ message: "Deleted" })
    ) as unknown as Mock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("titles itself for a board deletion", () => {
    renderWithProviders(<DeleteModal />, {
      preloadedState: {
        modal: {
          openModal: CONFIRM_DELETE,
          modalProps: { id: "", listID: "", name: DELETE_BOARD, contactID: "" },
        },
      },
    });
    expect(screen.getByText("Delete Board?")).toBeInTheDocument();
  });

  it("titles itself for a contact deletion and shows the contact-specific note", () => {
    renderWithProviders(<DeleteModal />, {
      preloadedState: {
        modal: {
          openModal: CONFIRM_DELETE,
          modalProps: { id: "", listID: "", name: DELETE_CONTACT, contactID: "c1" },
        },
      },
    });
    expect(screen.getByText("Delete Contact?")).toBeInTheDocument();
    expect(screen.getByText("This won't delete the contact from the job")).toBeInTheDocument();
  });

  it("titles itself for a card deletion when a card id is set", () => {
    renderWithProviders(<DeleteModal />, {
      preloadedState: {
        modal: {
          openModal: CONFIRM_DELETE,
          modalProps: { id: "card-1", listID: "list-1", name: "", contactID: "" },
        },
      },
    });
    expect(screen.getByText("Delete Card?")).toBeInTheDocument();
  });

  it("falls back to a list deletion title otherwise", () => {
    renderWithProviders(<DeleteModal />, {
      preloadedState: {
        modal: {
          openModal: CONFIRM_DELETE,
          modalProps: { id: "", listID: "list-1", name: "", contactID: "" },
        },
      },
    });
    expect(screen.getByText("Delete List?")).toBeInTheDocument();
  });

  it("submits the deletion when Submit is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DeleteModal />, {
      route: "/board-1",
      path: "/:boardID",
      preloadedState: {
        modal: {
          openModal: CONFIRM_DELETE,
          modalProps: { id: "", listID: "list-1", name: "", contactID: "" },
        },
      },
    });

    await user.click(screen.getByText("Submit"));
    expect(global.fetch).toHaveBeenCalled();
  });
});
