import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { AuthContext, type AuthContextValue } from "./useAuth";
import { RequireAuth } from "./RequireAuth";

// This file needs isAuthEnabled to be both true and false, so it replaces the
// global supabaseClient mock with one backed by a mutable flag.
let authEnabled = true;
vi.mock("lib/supabaseClient", () => ({
  get isAuthEnabled() {
    return authEnabled;
  },
  supabase: null,
  getAccessToken: vi.fn(async () => null),
}));

const fakeSession = { user: { id: "u1" } } as unknown as Session;

const renderGuard = (ctx: AuthContextValue, children: ReactNode = "SECRET") =>
  render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route path="/" element={<div>LOGIN</div>} />
        <Route
          path="/protected"
          element={
            <AuthContext.Provider value={ctx}>
              <RequireAuth>{children}</RequireAuth>
            </AuthContext.Provider>
          }
        />
      </Routes>
    </MemoryRouter>
  );

describe("RequireAuth", () => {
  afterEach(() => {
    authEnabled = true;
  });

  it("renders children without checking the session when auth is disabled", () => {
    authEnabled = false;
    renderGuard({ session: null, isLoading: false });

    expect(screen.getByText("SECRET")).toBeInTheDocument();
    expect(screen.queryByText("LOGIN")).not.toBeInTheDocument();
  });

  it("renders nothing while the session is still loading", () => {
    renderGuard({ session: null, isLoading: true });

    expect(screen.queryByText("SECRET")).not.toBeInTheDocument();
    expect(screen.queryByText("LOGIN")).not.toBeInTheDocument();
  });

  it("redirects to the login route when there is no session", () => {
    renderGuard({ session: null, isLoading: false });

    expect(screen.getByText("LOGIN")).toBeInTheDocument();
    expect(screen.queryByText("SECRET")).not.toBeInTheDocument();
  });

  it("renders children once a session is present", () => {
    renderGuard({ session: fakeSession, isLoading: false });

    expect(screen.getByText("SECRET")).toBeInTheDocument();
    expect(screen.queryByText("LOGIN")).not.toBeInTheDocument();
  });
});
