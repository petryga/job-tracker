import type { Mock } from "vitest";
import { makeTestStore } from "test-utils/testStore";
import { userApi } from "./userApi";

const requestUrl = (input: unknown): string =>
  typeof input === "string" ? input : (input as Request).url;

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

describe("userApi", () => {
  let store: ReturnType<typeof makeTestStore>;

  beforeEach(() => {
    store = makeTestStore();
  });

  it("deletes the caller's account data via DELETE /api/users/me", async () => {
    global.fetch = vi.fn(() =>
      jsonResponse({ message: "Account data deleted" })
    ) as unknown as Mock;

    await store.dispatch(userApi.endpoints.deleteUser.initiate());

    const [request] = (global.fetch as Mock).mock.calls[0];
    expect(requestUrl(request)).toContain("/api/users/me");
    expect((request as Request).method).toBe("DELETE");
  });
});
