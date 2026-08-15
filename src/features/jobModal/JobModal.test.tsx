import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "test-utils/render";
import { JobModal } from "./JobModal";

const job = {
  _id: "job-1",
  boardID: "board-1",
  companyName: "Acme",
  position: "Engineer",
  location: "Denver",
  salary: "100,000",
  remoteOnsite: "Remote",
  link: "",
  description: "",
  notes: "",
  isFavorite: false,
  contacts: [
    {
      _id: "",
      jobID: "",
      contactName: "",
      contactPosition: "",
      contactEmail: "",
      contactPhone: "",
      contactNotes: "",
      companyName: "",
    },
  ],
};

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

const openState = {
  modal: {
    openModal: "jobSearch",
    modalProps: { id: "card-1", listID: "list-a", name: "", contactID: "" },
  },
};

describe("JobModal", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => jsonResponse(job)) as unknown as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders nothing until the job has loaded", () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as unknown as jest.Mock;
    const { container } = renderWithProviders(<JobModal />, {
      preloadedState: openState,
    });
    expect(container).toBeEmptyDOMElement();
  });

  it("populates the form fields from the fetched job", async () => {
    renderWithProviders(<JobModal />, { preloadedState: openState });

    expect(await screen.findByDisplayValue("Acme")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Engineer")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Denver")).toBeInTheDocument();
  });

  it("disables submit until a field actually changes", async () => {
    renderWithProviders(<JobModal />, { preloadedState: openState });

    await screen.findByDisplayValue("Acme");
    expect(screen.getByText("Submit").closest("button")).toBeDisabled();

    const user = userEvent.setup();
    await user.type(screen.getByDisplayValue("Acme"), " Corp");

    await waitFor(() =>
      expect(screen.getByText("Submit").closest("button")).not.toBeDisabled()
    );
  });

  it("switches to the Contacts tab without losing job field data", async () => {
    const user = userEvent.setup();
    renderWithProviders(<JobModal />, { preloadedState: openState });

    await screen.findByDisplayValue("Acme");
    await user.click(screen.getByText("Contacts"));

    expect(screen.getByText("add another contact")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("Acme")).not.toBeInTheDocument();

    await user.click(screen.getByText("Job Details"));
    expect(screen.getByDisplayValue("Acme")).toBeInTheDocument();
  });

  it("submits the changed job and closes the modal", async () => {
    global.fetch = jest.fn((input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : (input as Request).url;
      if (url.includes("/api/jobs/job-1")) {
        return jsonResponse({ message: "Updated", boardID: "board-1" });
      }
      return jsonResponse(job);
    }) as jest.Mock;

    const user = userEvent.setup();
    const { store } = renderWithProviders(<JobModal />, {
      route: "/board-1",
      path: "/:boardID",
      preloadedState: openState,
    });

    await user.type(await screen.findByDisplayValue("Acme"), " Corp");
    await user.click(screen.getByText("Submit"));

    await waitFor(() => expect(store.getState().modal.openModal).toBeNull());
    const putCall = (global.fetch as jest.Mock).mock.calls.find(([input]) =>
      (typeof input === "string" ? input : (input as Request).url).includes(
        "/api/jobs/job-1"
      )
    );
    expect(putCall).toBeDefined();
    expect((putCall![0] as Request).method).toBe("PUT");
  });

  it("deletes the card and job when the delete icon is clicked", async () => {
    global.fetch = jest.fn((input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : (input as Request).url;
      if (url.includes("/api/boards/cards/deleteCard/card-1")) {
        return jsonResponse({ message: "Deleted" });
      }
      return jsonResponse(job);
    }) as jest.Mock;

    const user = userEvent.setup();
    renderWithProviders(<JobModal />, {
      route: "/board-1",
      path: "/:boardID",
      preloadedState: openState,
    });

    await screen.findByDisplayValue("Acme");
    await user.click(screen.getByTitle("DELETE"));

    await waitFor(() => {
      const deleteCall = (global.fetch as jest.Mock).mock.calls.find(([input]) =>
        (typeof input === "string" ? input : (input as Request).url).includes(
          "/api/boards/cards/deleteCard/card-1"
        )
      );
      expect(deleteCall).toBeDefined();
      expect((deleteCall![0] as Request).method).toBe("DELETE");
    });
  });
});
