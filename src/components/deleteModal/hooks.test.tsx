import type { Mock } from "vitest";
import { act, screen, waitFor } from "@testing-library/react";
import toast from "react-hot-toast";
import { renderHookWithProviders } from "test-utils/renderHook";
import useHandleSubmit from "./hooks";
import { DELETE_BOARD, DELETE_CONTACT, DELETE_USER } from "utils/constants";

const jsonResponse = (body: unknown, init: Partial<Response> = {}) =>
  Promise.resolve({
    ok: true,
    status: 200,
    headers: new Headers({ "content-type": "application/json" }),
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
    clone() {
      return this as unknown as Response;
    },
    ...init,
  } as Response);

describe("useHandleSubmit", () => {
  const originalLocation = window.location;
  const reload = vi.fn();

  beforeEach(() => {
    localStorage.setItem("userId", "user-1");
    vi.spyOn(toast, "success").mockImplementation(() => "");
    vi.spyOn(toast, "error").mockImplementation(() => "");
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, reload },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    reload.mockClear();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("deletes the user, logs out and closes the modal", async () => {
    global.fetch = vi.fn(() =>
      jsonResponse({ message: "User deleted" })
    ) as unknown as Mock;

    const { result, store } = renderHookWithProviders(() => useHandleSubmit(), {
      preloadedState: {
        modal: { modalProps: { id: "", listID: "", name: DELETE_USER, contactID: "" } },
      },
    });

    await act(async () => {
      await result.current();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.objectContaining({ url: expect.stringContaining("/api/users/delete/user-1") })
    );
    expect(store.getState().modal.openModal).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
    expect(reload).toHaveBeenCalled();
  });

  it("deletes a contact and closes the modal", async () => {
    global.fetch = vi.fn(() =>
      jsonResponse({ message: "Contact deleted" })
    ) as unknown as Mock;

    const { result, store } = renderHookWithProviders(() => useHandleSubmit(), {
      preloadedState: {
        modal: {
          modalProps: { id: "", listID: "", name: DELETE_CONTACT, contactID: "contact-1" },
        },
      },
    });

    await act(async () => {
      await result.current();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining("/api/contacts/delete/contact-1"),
      })
    );
    expect(store.getState().modal.openModal).toBeNull();
  });

  it("deletes the board, closes the modal and navigates home", async () => {
    global.fetch = vi.fn(() =>
      jsonResponse({ message: "Board deleted" })
    ) as unknown as Mock;

    const { result, store } = renderHookWithProviders(() => useHandleSubmit(), {
      route: "/board-1",
      path: "/:boardID",
      preloadedState: {
        modal: { modalProps: { id: "", listID: "", name: DELETE_BOARD, contactID: "" } },
      },
    });

    await act(async () => {
      await result.current();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.objectContaining({ url: expect.stringContaining("/api/boards/board-1") })
    );
    expect(store.getState().modal.openModal).toBeNull();
    await waitFor(() => expect(screen.getByText("HOME")).toBeInTheDocument());
  });

  it("deletes a card when both cardID and listID are present", async () => {
    global.fetch = vi.fn(() =>
      jsonResponse({ message: "Card deleted" })
    ) as unknown as Mock;

    const { result } = renderHookWithProviders(() => useHandleSubmit(), {
      route: "/board-1",
      path: "/:boardID",
      preloadedState: {
        modal: {
          modalProps: { id: "card-1", listID: "list-1", name: "", contactID: "" },
        },
      },
    });

    await act(async () => {
      await result.current();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining("/api/boards/cards/deleteCard/card-1"),
      })
    );
  });

  it("deletes a list when only listID is present", async () => {
    global.fetch = vi.fn(() =>
      jsonResponse({ message: "List deleted" })
    ) as unknown as Mock;

    const { result } = renderHookWithProviders(() => useHandleSubmit(), {
      route: "/board-1",
      path: "/:boardID",
      preloadedState: {
        modal: { modalProps: { id: "", listID: "list-1", name: "", contactID: "" } },
      },
    });

    await act(async () => {
      await result.current();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining("/api/boards/lists/deleteList/list-1"),
      })
    );
  });

  it("surfaces a failed deletion as a toast error instead of throwing", async () => {
    global.fetch = vi.fn(() =>
      jsonResponse({ message: "boom" }, { ok: false, status: 500 })
    ) as unknown as Mock;

    const { result } = renderHookWithProviders(() => useHandleSubmit(), {
      route: "/board-1",
      path: "/:boardID",
      preloadedState: {
        modal: { modalProps: { id: "", listID: "list-1", name: "", contactID: "" } },
      },
    });

    await act(async () => {
      await result.current();
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("boom"));
  });
});
