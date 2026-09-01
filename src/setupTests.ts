import "@testing-library/jest-dom";

// A functional fake Supabase client. Auth is "enabled" (so LoginPage / RequireAuth
// take their real code paths) but every call is a spy. Individual tests override
// e.g. getAccessToken or auth.signInWithPassword as needed.
vi.mock("./lib/supabaseClient", () => {
  const auth = {
    getSession: vi.fn(async () => ({ data: { session: null } })),
    signInWithPassword: vi.fn(async () => ({ data: {}, error: null })),
    signUp: vi.fn(async () => ({ data: { session: null }, error: null })),
    signOut: vi.fn(async () => ({ error: null })),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    })),
  };
  return {
    isAuthEnabled: true,
    supabase: { auth },
    getAccessToken: vi.fn(async () => null),
  };
});
