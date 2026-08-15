import type { Mock } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { makeStore } from "test-utils/render";
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

const renderApp = (route: string) => {
  const store = makeStore();
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    </Provider>
  );
};

describe("App", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    global.fetch = vi.fn(() => jsonResponse([])) as unknown as Mock;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, replace: vi.fn() },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("redirects to the root when there is no logged-in user", () => {
    renderApp("/home");
    expect(window.location.replace).toHaveBeenCalledWith("/");
  });

  it("renders the home route when a user token exists", () => {
    localStorage.setItem("token", "abc");
    renderApp("/home");
    expect(screen.getByText("Job Application Tracker")).toBeInTheDocument();
  });

  it("does not register any route without a logged-in user", () => {
    renderApp("/home");
    expect(screen.queryByText("Job Application Tracker")).not.toBeInTheDocument();
  });
});
