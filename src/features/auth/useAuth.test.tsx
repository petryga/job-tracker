import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { AuthContext, useAuth, type AuthContextValue } from "./useAuth";

describe("useAuth", () => {
  it("throws when called outside an AuthProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(
      /must be used within an AuthProvider/
    );
    spy.mockRestore();
  });

  it("returns the context value when inside a provider", () => {
    const value: AuthContextValue = { session: null, isLoading: false };
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toBe(value);
  });
});
