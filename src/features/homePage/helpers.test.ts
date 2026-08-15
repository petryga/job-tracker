import { handleLogout } from "./helpers";

describe("handleLogout", () => {
  it("clears auth state from localStorage and reloads the page", () => {
    localStorage.setItem("token", "abc");
    localStorage.setItem("userId", "user-1");
    const reload = vi.fn();
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, reload },
    });

    handleLogout();

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("userId")).toBeNull();
    expect(reload).toHaveBeenCalled();

    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });
});
