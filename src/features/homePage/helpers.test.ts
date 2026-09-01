import { handleLogout } from "./helpers";
import { supabase } from "lib/supabaseClient";

describe("handleLogout", () => {
  it("signs out of Supabase and reloads the page", async () => {
    const reload = vi.fn();
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, reload },
    });

    await handleLogout();

    expect(supabase!.auth.signOut).toHaveBeenCalled();
    expect(reload).toHaveBeenCalled();

    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });
});
