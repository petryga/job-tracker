import { makeTestStore } from "test-utils/testStore";
import { apiSlice } from "./apiSlice";

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

const testApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    ping: builder.query({
      query: () => "/api/ping",
    }),
  }),
});

describe("apiSlice", () => {
  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it("attaches a bearer token header when one is stored", async () => {
    localStorage.setItem("token", "abc123");
    global.fetch = jest.fn(() => jsonResponse({})) as unknown as jest.Mock;

    const store = makeTestStore();
    await store.dispatch(testApi.endpoints.ping.initiate(undefined));

    const [request] = (global.fetch as jest.Mock).mock.calls[0];
    expect((request as Request).headers.get("authorization")).toBe("Bearer abc123");
  });

  it("omits the authorization header when there is no token", async () => {
    global.fetch = jest.fn(() => jsonResponse({})) as unknown as jest.Mock;

    const store = makeTestStore();
    await store.dispatch(testApi.endpoints.ping.initiate(undefined));

    const [request] = (global.fetch as jest.Mock).mock.calls[0];
    expect((request as Request).headers.get("authorization")).toBeNull();
  });
});
