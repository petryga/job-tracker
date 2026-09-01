import type { Mock } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { makeStore } from "test-utils/render";
import { AuthProvider } from "features/auth/AuthContext";
import { supabase } from "lib/supabaseClient";
import App from "./App";

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

const session = { user: { id: "user-1" }, access_token: "tok" } as never;

const renderApp = (route: string) => {
  const store = makeStore();
  return render(
    <Provider store={store}>
      <AuthProvider>
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>
      </AuthProvider>
    </Provider>
  );
};

describe("App", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() => jsonResponse([])) as unknown as Mock;
    vi.mocked(supabase!.auth.getSession).mockResolvedValue({
      data: { session: null },
    } as never);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("keeps protected content hidden when there is no session", async () => {
    renderApp("/home");
    // give the auth check a tick to resolve
    await Promise.resolve();
    expect(
      screen.queryByText("Job Application Tracker")
    ).not.toBeInTheDocument();
  });

  it("renders the home route once a session is present", async () => {
    vi.mocked(supabase!.auth.getSession).mockResolvedValue({
      data: { session },
    } as never);

    renderApp("/home");

    expect(
      await screen.findByText("Job Application Tracker")
    ).toBeInTheDocument();
  });
});
