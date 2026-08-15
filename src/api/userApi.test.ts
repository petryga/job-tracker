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

  it("posts registration data", async () => {
    global.fetch = jest.fn(() =>
      jsonResponse({ message: "Registered" })
    ) as unknown as jest.Mock;

    await store.dispatch(
      userApi.endpoints.registerUser.initiate({
        data: { email: "a@b.com", password: "secret", name: "Ada" },
      })
    );

    const [request] = (global.fetch as jest.Mock).mock.calls[0];
    expect(requestUrl(request)).toContain("/api/users/register");
    expect((request as Request).method).toBe("POST");
  });

  it("posts login credentials", async () => {
    global.fetch = jest.fn(() =>
      jsonResponse({ token: "tok" })
    ) as unknown as jest.Mock;

    await store.dispatch(
      userApi.endpoints.loginUser.initiate({
        data: { email: "a@b.com", password: "secret" },
      })
    );

    const [request] = (global.fetch as jest.Mock).mock.calls[0];
    expect(requestUrl(request)).toContain("/api/users/login");
    expect((request as Request).method).toBe("POST");
  });

  it("deletes a user by id", async () => {
    global.fetch = jest.fn(() =>
      jsonResponse({ message: "Deleted" })
    ) as unknown as jest.Mock;

    await store.dispatch(userApi.endpoints.deleteUser.initiate({ userId: "user-1" }));

    const [request] = (global.fetch as jest.Mock).mock.calls[0];
    expect(requestUrl(request)).toContain("/api/users/delete/user-1");
    expect((request as Request).method).toBe("DELETE");
  });
});
