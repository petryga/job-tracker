import { makeTestStore } from "test-utils/testStore";
import { jobApi } from "./jobsApi";

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

describe("jobApi", () => {
  let store: ReturnType<typeof makeTestStore>;

  beforeEach(() => {
    store = makeTestStore();
  });

  it("fetches a job by cardID", async () => {
    const job = { _id: "job-1", boardID: "board-1", companyName: "Acme" };
    global.fetch = jest.fn(() => jsonResponse(job)) as unknown as jest.Mock;

    const result = await store.dispatch(
      jobApi.endpoints.getJob.initiate({ cardID: "card-1" })
    );

    expect(result.data).toEqual(job);
    const [request] = (global.fetch as jest.Mock).mock.calls[0];
    expect(requestUrl(request)).toContain("/api/jobs/getOne/card-1");
  });

  it("updates a job with a PUT request", async () => {
    global.fetch = jest.fn(() =>
      jsonResponse({ message: "Updated", boardID: "board-1" })
    ) as unknown as jest.Mock;

    await store.dispatch(
      jobApi.endpoints.updateJob.initiate({ id: "job-1", companyName: "Acme 2" })
    );

    const [request] = (global.fetch as jest.Mock).mock.calls[0];
    expect(requestUrl(request)).toContain("/api/jobs/job-1");
    expect((request as Request).method).toBe("PUT");
  });
});
