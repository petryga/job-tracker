import { makeTestStore } from "test-utils/testStore";
import { contactsApi } from "./contactsApi";

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

describe("contactsApi", () => {
  let store: ReturnType<typeof makeTestStore>;

  beforeEach(() => {
    store = makeTestStore();
  });

  it("fetches contacts for a board", async () => {
    const contacts = [{ _id: "c1", contactName: "Jamie" }];
    global.fetch = jest.fn(() => jsonResponse(contacts)) as unknown as jest.Mock;

    const result = await store.dispatch(
      contactsApi.endpoints.getContacts.initiate({ boardID: "board-1" })
    );

    expect(result.data).toEqual(contacts);
    const [request] = (global.fetch as jest.Mock).mock.calls[0];
    expect(requestUrl(request)).toContain("/api/contacts/getAll/board-1");
  });

  it("deletes a contact by id", async () => {
    global.fetch = jest.fn(() =>
      jsonResponse({ message: "Deleted" })
    ) as unknown as jest.Mock;

    await store.dispatch(
      contactsApi.endpoints.deleteContact.initiate({ contactID: "c1" })
    );

    const [request] = (global.fetch as jest.Mock).mock.calls[0];
    expect(requestUrl(request)).toContain("/api/contacts/delete/c1");
    expect((request as Request).method).toBe("DELETE");
  });
});
