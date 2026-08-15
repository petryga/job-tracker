import type { Mock } from "vitest";
import { makeTestStore } from "test-utils/testStore";
import { boardApi } from "./boardApi";

const requestUrl = (input: unknown): string =>
  typeof input === "string" ? input : (input as Request).url;

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

describe("boardApi", () => {
  let store: ReturnType<typeof makeTestStore>;

  beforeEach(() => {
    store = makeTestStore();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches boards for a user and hits the expected url", async () => {
    const boards = [{ _id: "board-1", title: "Board", lists: [], isJobSearchBoard: false }];
    (global.fetch as Mock).mockReturnValue(jsonResponse(boards));

    const result = await store.dispatch(
      boardApi.endpoints.getBoards.initiate({ userId: "user-1" })
    );

    expect(result.data).toEqual(boards);
    const [request] = (global.fetch as Mock).mock.calls[0];
    expect(requestUrl(request)).toContain("/api/boards/getAll/user-1");
  });

  it("fetches a single board by id", async () => {
    const board = { _id: "board-1", title: "Board", lists: [], isJobSearchBoard: false };
    (global.fetch as Mock).mockReturnValue(jsonResponse(board));

    const result = await store.dispatch(
      boardApi.endpoints.getBoardById.initiate({ id: "board-1" })
    );

    expect(result.data).toEqual(board);
    const [request] = (global.fetch as Mock).mock.calls[0];
    expect(requestUrl(request)).toContain("/api/boards/board-1");
  });

  it("posts a new board with the given title and userId", async () => {
    (global.fetch as Mock).mockReturnValue(
      jsonResponse({ _id: "new-board" })
    );

    await store.dispatch(
      boardApi.endpoints.createBoard.initiate({ title: "New", userId: "user-1" })
    );

    const [request] = (global.fetch as Mock).mock.calls[0];
    expect(requestUrl(request)).toContain("/api/boards/create");
    expect((request as Request).method).toBe("POST");
    expect(JSON.parse(await (request as Request).text())).toEqual({
      title: "New",
      userId: "user-1",
    });
  });

  it("surfaces a non-2xx response as an error result rather than throwing", async () => {
    (global.fetch as Mock).mockReturnValue(
      jsonResponse({ message: "not found" }, { ok: false, status: 404 })
    );

    const result = await store.dispatch(
      boardApi.endpoints.getBoardById.initiate({ id: "missing" })
    );

    expect(result.error).toBeDefined();
    expect((result.error as { status: number }).status).toBe(404);
  });
});
