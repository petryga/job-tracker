import type { Mock } from "vitest";
import { act } from "@testing-library/react";
import toast from "react-hot-toast";
import { renderHookWithProviders } from "test-utils/renderHook";
import { useLoginSignUpForm } from "./hooks";

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

const fakeEvent = () => ({ preventDefault: vi.fn() } as unknown as React.FormEvent);

describe("useLoginSignUpForm", () => {
  beforeEach(() => {
    vi.spyOn(toast, "success").mockImplementation(() => "");
    vi.spyOn(toast, "error").mockImplementation(() => "");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("starts with a disabled button and empty fields", () => {
    const { result } = renderHookWithProviders(() => useLoginSignUpForm(0, vi.fn()));
    const [, , buttonDisabled, formData] = result.current;

    expect(buttonDisabled).toBe(true);
    expect(formData).toEqual({ email: "", password: "", confirm_password: "", name: "" });
  });

  it("enables the button once login fields are valid", () => {
    const { result } = renderHookWithProviders(() => useLoginSignUpForm(0, vi.fn()));

    act(() => {
      const [, handleChange] = result.current;
      handleChange({
        target: { name: "email", value: "a@b.com" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    act(() => {
      const [, handleChange] = result.current;
      handleChange({
        target: { name: "password", value: "longenough" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current[2]).toBe(false);
  });

  it("rejects a short password on submit without calling the API", async () => {
    global.fetch = vi.fn() as unknown as Mock;
    const { result } = renderHookWithProviders(() => useLoginSignUpForm(0, vi.fn()));

    act(() => {
      const [, handleChange] = result.current;
      handleChange({
        target: { name: "email", value: "a@b.com" },
      } as React.ChangeEvent<HTMLInputElement>);
      handleChange({
        target: { name: "password", value: "short" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current[0](fakeEvent());
    });

    expect(global.fetch).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(
      "Password must be at least 9 characters long"
    );
  });

  it("logs in, stores the token and navigates home", async () => {
    global.fetch = vi.fn(() =>
      jsonResponse({ token: "tok", _id: "user-1", name: "Ada" })
    ) as unknown as Mock;

    const { result } = renderHookWithProviders(() => useLoginSignUpForm(0, vi.fn()), {
      route: "/",
      path: "/",
    });

    act(() => {
      const [, handleChange] = result.current;
      handleChange({
        target: { name: "email", value: "a@b.com" },
      } as React.ChangeEvent<HTMLInputElement>);
      handleChange({
        target: { name: "password", value: "longenough" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current[0](fakeEvent());
    });

    expect(localStorage.getItem("token")).toBe("tok");
    expect(localStorage.getItem("userId")).toBe("user-1");
    expect(toast.success).toHaveBeenCalledWith("Hi Ada");
  });

  it("registers a new user and switches back to the login tab", async () => {
    global.fetch = vi.fn(() =>
      jsonResponse({ message: "Registered", data: { email: "a@b.com" } })
    ) as unknown as Mock;
    const setTabIndex = vi.fn();

    const { result } = renderHookWithProviders(() => useLoginSignUpForm(1, setTabIndex));

    act(() => {
      const [, handleChange] = result.current;
      handleChange({
        target: { name: "email", value: "a@b.com" },
      } as React.ChangeEvent<HTMLInputElement>);
      handleChange({
        target: { name: "password", value: "longenough" },
      } as React.ChangeEvent<HTMLInputElement>);
      handleChange({
        target: { name: "confirm_password", value: "longenough" },
      } as React.ChangeEvent<HTMLInputElement>);
      handleChange({
        target: { name: "name", value: "Ada" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current[0](fakeEvent());
    });

    expect(toast.success).toHaveBeenCalledWith("Registered");
    expect(setTabIndex).toHaveBeenCalledWith(0);
  });

  it("surfaces a login failure as a toast error", async () => {
    global.fetch = vi.fn(() =>
      jsonResponse({ message: "Invalid credentials" }, { ok: false, status: 401 })
    ) as unknown as Mock;

    const { result } = renderHookWithProviders(() => useLoginSignUpForm(0, vi.fn()));

    act(() => {
      const [, handleChange] = result.current;
      handleChange({
        target: { name: "email", value: "a@b.com" },
      } as React.ChangeEvent<HTMLInputElement>);
      handleChange({
        target: { name: "password", value: "longenough" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current[0](fakeEvent());
    });

    expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
  });
});
