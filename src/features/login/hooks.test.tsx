import { act } from "@testing-library/react";
import toast from "react-hot-toast";
import { renderHookWithProviders } from "test-utils/renderHook";
import { supabase } from "lib/supabaseClient";
import { useLoginSignUpForm } from "./hooks";

const auth = supabase!.auth as unknown as {
  signInWithPassword: ReturnType<typeof vi.fn>;
  signUp: ReturnType<typeof vi.fn>;
};

const fakeEvent = () =>
  ({ preventDefault: vi.fn() } as unknown as React.FormEvent);

const fill = (
  result: { current: ReturnType<typeof useLoginSignUpForm> },
  values: Record<string, string>
) => {
  act(() => {
    const [, handleChange] = result.current;
    for (const [name, value] of Object.entries(values)) {
      handleChange({
        target: { name, value },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  });
};

describe("useLoginSignUpForm", () => {
  beforeEach(() => {
    vi.spyOn(toast, "success").mockImplementation(() => "");
    vi.spyOn(toast, "error").mockImplementation(() => "");
    auth.signInWithPassword.mockResolvedValue({ data: {}, error: null });
    auth.signUp.mockResolvedValue({ data: { session: null }, error: null });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    auth.signInWithPassword.mockReset();
    auth.signUp.mockReset();
  });

  it("starts with a disabled button and empty fields", () => {
    const { result } = renderHookWithProviders(() =>
      useLoginSignUpForm(0, vi.fn())
    );
    const [, , buttonDisabled, formData] = result.current;

    expect(buttonDisabled).toBe(true);
    expect(formData).toEqual({
      email: "",
      password: "",
      confirm_password: "",
      name: "",
    });
  });

  it("enables the button once login fields are valid", () => {
    const { result } = renderHookWithProviders(() =>
      useLoginSignUpForm(0, vi.fn())
    );

    fill(result, { email: "a@b.com", password: "longenough" });

    expect(result.current[2]).toBe(false);
  });

  it("rejects a short password on submit without calling Supabase", async () => {
    const { result } = renderHookWithProviders(() =>
      useLoginSignUpForm(0, vi.fn())
    );

    fill(result, { email: "a@b.com", password: "short" });

    await act(async () => {
      await result.current[0](fakeEvent());
    });

    expect(auth.signInWithPassword).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(
      "Password must be at least 9 characters long"
    );
  });

  it("signs in with the entered credentials", async () => {
    const { result } = renderHookWithProviders(() =>
      useLoginSignUpForm(0, vi.fn())
    );

    fill(result, { email: "a@b.com", password: "longenough" });

    await act(async () => {
      await result.current[0](fakeEvent());
    });

    expect(auth.signInWithPassword).toHaveBeenCalledWith({
      email: "a@b.com",
      password: "longenough",
    });
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("surfaces a sign-in failure as a toast error", async () => {
    auth.signInWithPassword.mockResolvedValue({
      data: {},
      error: { message: "Invalid login credentials" },
    });

    const { result } = renderHookWithProviders(() =>
      useLoginSignUpForm(0, vi.fn())
    );

    fill(result, { email: "a@b.com", password: "longenough" });

    await act(async () => {
      await result.current[0](fakeEvent());
    });

    expect(toast.error).toHaveBeenCalledWith("Invalid login credentials");
  });

  it("signs up a new user and switches back to the login tab", async () => {
    const setTabIndex = vi.fn();
    const { result } = renderHookWithProviders(() =>
      useLoginSignUpForm(1, setTabIndex)
    );

    fill(result, {
      email: "a@b.com",
      password: "longenough",
      confirm_password: "longenough",
      name: "Ada",
    });

    await act(async () => {
      await result.current[0](fakeEvent());
    });

    expect(auth.signUp).toHaveBeenCalledWith({
      email: "a@b.com",
      password: "longenough",
    });
    expect(setTabIndex).toHaveBeenCalledWith(0);
    expect(toast.success).toHaveBeenCalledWith(
      "Check your email to confirm your account, then log in."
    );
  });
});
