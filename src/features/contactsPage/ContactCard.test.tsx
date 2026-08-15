import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "test-utils/render";
import ContactCard from "./ContactCard";
import type { Contact } from "features/jobModal/types";

const contact: Contact = {
  _id: "c1",
  contactName: "Jamie Doe",
  companyName: "Acme",
  position: "Recruiter",
  contactEmail: "jamie@acme.com",
  contactPhone: "555-1234",
  contactNotes: "Met at a conference",
};

describe("ContactCard", () => {
  it("renders nothing for a contact with no name", () => {
    const { container } = renderWithProviders(
      <ContactCard contact={{ ...contact, contactName: "" }} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders name, company, position and contact details", () => {
    renderWithProviders(<ContactCard contact={contact} />);

    expect(screen.getByText("Jamie Doe")).toBeInTheDocument();
    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.getByText("Recruiter")).toBeInTheDocument();
    expect(screen.getByText("jamie@acme.com").closest("a")).toHaveAttribute(
      "href",
      "mailto:jamie@acme.com"
    );
    expect(screen.getByText("555-1234")).toBeInTheDocument();
    expect(screen.getByText("Met at a conference")).toBeInTheDocument();
  });

  it("falls back to 'none' for missing phone and notes", () => {
    renderWithProviders(
      <ContactCard contact={{ ...contact, contactPhone: "", contactNotes: "" }} />
    );

    expect(screen.getAllByText("none")).toHaveLength(2);
  });

  it("shows a mail icon placeholder of 'none' when there is no email", () => {
    renderWithProviders(<ContactCard contact={{ ...contact, contactEmail: "" }} />);
    expect(screen.getByText("none")).toBeInTheDocument();
  });

  it("opens the delete-contact confirmation from the menu", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<ContactCard contact={contact} />);

    await user.click(screen.getByText("more_horiz"));
    await user.click(screen.getByText("Delete Contact"));

    expect(store.getState().modal.openModal).toBe("confirmDelete");
    expect(store.getState().modal.modalProps).toEqual(
      expect.objectContaining({ contactID: "c1", name: "deleteContact" })
    );
  });
});
