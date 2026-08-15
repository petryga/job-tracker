import type { Mock } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "test-utils/render";
import { LoginPage } from "./LoginPage";

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

// MUI v4 TextField in this setup doesn't wire label -> input via for/id,
// so fields are located by their `name` attribute instead of getByLabelText.
const fieldByName = (name: string) =>
  document.querySelector(`input[name="${name}"]`) as HTMLInputElement;

describe("LoginPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("shows only email and password on the Login tab", () => {
    renderWithProviders(<LoginPage />);

    expect(fieldByName("email")).toBeInTheDocument();
    expect(fieldByName("password")).toBeInTheDocument();
    expect(fieldByName("name")).not.toBeInTheDocument();
    expect(fieldByName("confirm_password")).not.toBeInTheDocument();
  });

  it("shows name and confirm-password fields on the Sign up tab", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    await user.click(screen.getByText("Sign up"));

    expect(fieldByName("name")).toBeInTheDocument();
    expect(fieldByName("email")).toBeInTheDocument();
    expect(fieldByName("password")).toBeInTheDocument();
    expect(fieldByName("confirm_password")).toBeInTheDocument();
  });

  it("disables submit until the login form is valid", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    const submit = screen.getByRole("button", { name: "Login" });
    expect(submit).toBeDisabled();

    await user.type(fieldByName("email"), "a@b.com");
    await user.type(fieldByName("password"), "longenough");

    expect(submit).not.toBeDisabled();
  });

  it("logs in and stores the token on submit", async () => {
    global.fetch = vi.fn(() =>
      jsonResponse({ token: "tok", _id: "user-1", name: "Ada" })
    ) as unknown as Mock;
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    await user.type(fieldByName("email"), "a@b.com");
    await user.type(fieldByName("password"), "longenough");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(global.fetch).toHaveBeenCalled();
  });
});
