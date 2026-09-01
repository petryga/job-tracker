// supabaseClient.ts is globally mocked in setupTests, so this file pulls the
// real module in with vi.importActual. createClient() spins up a realtime
// (WebSocket) client Node has no implementation for, so it's stubbed — these
// tests are about supabaseClient.ts's own conditional-creation logic.
const getSession = vi.fn();
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({ auth: { getSession } })),
}));

type Mod = typeof import("./supabaseClient");
const loadReal = () => vi.importActual<Mod>("./supabaseClient");

const withEnv = async (url: string, key: string) => {
  vi.resetModules();
  vi.stubEnv("VITE_SUPABASE_URL", url);
  vi.stubEnv("VITE_SUPABASE_ANON_KEY", key);
  return loadReal();
};

describe("supabaseClient", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    getSession.mockReset();
  });

  it("enables auth and builds a client when both env vars are set", async () => {
    const { isAuthEnabled, supabase } = await withEnv(
      "https://example.supabase.co",
      "anon-key"
    );

    expect(isAuthEnabled).toBe(true);
    expect(supabase).not.toBeNull();
  });

  it.each([
    ["", ""],
    ["https://example.supabase.co", ""],
    ["", "anon-key"],
  ])("disables auth for a missing/partial env (%j, %j)", async (url, key) => {
    const { isAuthEnabled, supabase } = await withEnv(url, key);

    expect(isAuthEnabled).toBe(false);
    expect(supabase).toBeNull();
  });

  describe("getAccessToken", () => {
    it("returns null when auth is disabled (no client)", async () => {
      const { getAccessToken } = await withEnv("", "");
      expect(await getAccessToken()).toBeNull();
    });

    it("returns the session's access token when signed in", async () => {
      getSession.mockResolvedValue({
        data: { session: { access_token: "the-token" } },
      });
      const { getAccessToken } = await withEnv(
        "https://example.supabase.co",
        "anon-key"
      );

      expect(await getAccessToken()).toBe("the-token");
    });

    it("returns null when there is a client but no session", async () => {
      getSession.mockResolvedValue({ data: { session: null } });
      const { getAccessToken } = await withEnv(
        "https://example.supabase.co",
        "anon-key"
      );

      expect(await getAccessToken()).toBeNull();
    });
  });
});
