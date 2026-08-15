import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "test-utils/render";
import { ModalComponent } from "./Modal";

describe("ModalComponent", () => {
  it("renders nothing visible when its name isn't the open modal", () => {
    renderWithProviders(
      <ModalComponent name="thisModal" title="Title" handleSubmit={vi.fn()}>
        body
      </ModalComponent>,
      { preloadedState: { modal: { openModal: "otherModal" } } }
    );

    expect(screen.queryByText("Title")).not.toBeInTheDocument();
    expect(screen.queryByText("body")).not.toBeInTheDocument();
  });

  it("renders title, children and both buttons when open", () => {
    renderWithProviders(
      <ModalComponent name="thisModal" title="Title" handleSubmit={vi.fn()}>
        body
      </ModalComponent>,
      { preloadedState: { modal: { openModal: "thisModal" } } }
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("body")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("calls handleSubmit when the primary button is clicked", async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <ModalComponent name="thisModal" title="Title" handleSubmit={handleSubmit}>
        body
      </ModalComponent>,
      { preloadedState: { modal: { openModal: "thisModal" } } }
    );

    await user.click(screen.getByText("Submit"));
    expect(handleSubmit).toHaveBeenCalled();
  });

  it("disables the primary button via isButtonDisabled", () => {
    renderWithProviders(
      <ModalComponent
        name="thisModal"
        title="Title"
        handleSubmit={vi.fn()}
        isButtonDisabled
      >
        body
      </ModalComponent>,
      { preloadedState: { modal: { openModal: "thisModal" } } }
    );

    expect(screen.getByText("Submit").closest("button")).toBeDisabled();
  });

  it("closes the modal in the store when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(
      <ModalComponent name="thisModal" title="Title" handleSubmit={vi.fn()}>
        body
      </ModalComponent>,
      { preloadedState: { modal: { openModal: "thisModal" } } }
    );

    await user.click(screen.getByText("Cancel"));
    expect(store.getState().modal.openModal).toBeNull();
  });

  it("hides the Cancel button when hideSecondaryButton is set", () => {
    renderWithProviders(
      <ModalComponent
        name="thisModal"
        title="Title"
        handleSubmit={vi.fn()}
        hideSecondaryButton
      >
        body
      </ModalComponent>,
      { preloadedState: { modal: { openModal: "thisModal" } } }
    );

    expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
  });

  it("shows a delete icon and fires onSecondaryAction then closes when clicked", async () => {
    const onSecondaryAction = vi.fn();
    const user = userEvent.setup();
    const { store } = renderWithProviders(
      <ModalComponent
        name="thisModal"
        title="Title"
        handleSubmit={vi.fn()}
        secondaryAction={{ hide: false, onSecondaryAction }}
      >
        body
      </ModalComponent>,
      { preloadedState: { modal: { openModal: "thisModal" } } }
    );

    await user.click(screen.getByTitle("DELETE"));
    expect(onSecondaryAction).toHaveBeenCalled();
    expect(store.getState().modal.openModal).toBeNull();
  });

  it("uses a custom primary button label when given", () => {
    renderWithProviders(
      <ModalComponent
        name="thisModal"
        title="Title"
        handleSubmit={vi.fn()}
        primaryButtonText="Close"
      >
        body
      </ModalComponent>,
      { preloadedState: { modal: { openModal: "thisModal" } } }
    );

    expect(screen.getByText("Close")).toBeInTheDocument();
  });
});
