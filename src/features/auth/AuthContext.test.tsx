import { act, render, screen, waitFor } from "@testing-library/react";
import type { Mock } from "vitest";
import { supabase } from "lib/supabaseClient";
import store from "store/store";
import { AuthProvider } from "./AuthContext";
import { useAuth } from "./useAuth";

const auth = supabase!.auth as unknown as {
  getSession: Mock;
  onAuthStateChange: Mock;
};

type AuthCallback = (event: string, session: unknown) => void;

const Probe = () => {
  const { session, isLoading } = useAuth();
  const user = (session as { user?: { id: string } } | null)?.user;
  return <div>{isLoading ? "loading" : user ? `in:${user.id}` : "out"}</div>;
};

const resetApiState = expect.objectContaining({
  type: expect.stringMatching(/resetApiState/),
});

describe("AuthProvider", () => {
  let authCb: AuthCallback;
  let unsubscribe: Mock;
  let dispatchSpy: Mock;

  beforeEach(() => {
    unsubscribe = vi.fn();
    authCb = () => {};
    auth.getSession.mockResolvedValue({ data: { session: null } });
    auth.onAuthStateChange.mockImplementation((cb: AuthCallback) => {
      authCb = cb;
      return { data: { subscription: { unsubscribe } } };
    });
    dispatchSpy = vi.spyOn(store, "dispatch") as unknown as Mock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    auth.getSession.mockReset();
    auth.onAuthStateChange.mockReset();
  });

  it("starts loading, then reflects the session returned by getSession", async () => {
    auth.getSession.mockResolvedValue({
      data: { session: { user: { id: "u1" } } },
    });

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    expect(screen.getByText("loading")).toBeInTheDocument();
    expect(await screen.findByText("in:u1")).toBeInTheDocument();
  });

  it("resolves to signed-out when getSession returns no session", async () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    expect(await screen.findByText("out")).toBeInTheDocument();
  });

  it("clears the RTK Query cache on SIGNED_OUT", async () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await screen.findByText("out");
    dispatchSpy.mockClear();

    act(() => authCb("SIGNED_OUT", null));

    expect(dispatchSpy).toHaveBeenCalledWith(resetApiState);
  });

  it("clears the RTK Query cache when a different user signs in", async () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await screen.findByText("out");
    dispatchSpy.mockClear();

    act(() => authCb("SIGNED_IN", { user: { id: "u2" } }));

    expect(dispatchSpy).toHaveBeenCalledWith(resetApiState);
  });

  it("does not clear the cache when SIGNED_IN re-fires for the same user", async () => {
    auth.getSession.mockResolvedValue({
      data: { session: { user: { id: "u1" } } },
    });

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await screen.findByText("in:u1");
    dispatchSpy.mockClear();

    act(() => authCb("SIGNED_IN", { user: { id: "u1" } }));

    expect(dispatchSpy).not.toHaveBeenCalledWith(resetApiState);
  });

  it("unsubscribes from auth changes on unmount", async () => {
    const { unmount } = render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await screen.findByText("out");

    unmount();

    await waitFor(() => expect(unsubscribe).toHaveBeenCalled());
  });
});
