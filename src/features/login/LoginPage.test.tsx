import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "test-utils/render";
import { supabase } from "lib/supabaseClient";
import { LoginPage } from "./LoginPage";

const auth = supabase!.auth as unknown as {
  signInWithPassword: ReturnType<typeof vi.fn>;
};

// MUI TextField in this setup doesn't wire label -> input via for/id,
// so fields are located by their `name` attribute instead of getByLabelText.
const fieldByName = (name: string) =>
  document.querySelector(`input[name="${name}"]`) as HTMLInputElement;

describe("LoginPage", () => {
  beforeEach(() => {
    auth.signInWithPassword.mockResolvedValue({ data: {}, error: null });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    auth.signInWithPassword.mockReset();
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

  it("signs in through Supabase on submit", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    await user.type(fieldByName("email"), "a@b.com");
    await user.type(fieldByName("password"), "longenough");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(auth.signInWithPassword).toHaveBeenCalledWith({
      email: "a@b.com",
      password: "longenough",
    });
  });
});
