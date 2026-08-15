import { screen } from "@testing-library/react";
import { renderWithProviders } from "test-utils/render";
import { ContactsPage } from "./ContactsPage";
import type { Contact } from "features/jobModal/types";

const contact = (name: string, id: string): Contact => ({
  _id: id,
  contactName: name,
  companyName: "Acme",
  position: "Recruiter",
  contactEmail: "",
  contactPhone: "",
  contactNotes: "",
});

describe("ContactsPage", () => {
  it("renders a card for every contact", () => {
    renderWithProviders(
      <ContactsPage contacts={[contact("Jamie", "c1"), contact("Alex", "c2")]} />
    );

    expect(screen.getByText("Jamie")).toBeInTheDocument();
    expect(screen.getByText("Alex")).toBeInTheDocument();
  });

  it("renders without error when there are no contacts", () => {
    const { container } = renderWithProviders(<ContactsPage contacts={[]} />);
    expect(container.querySelector(".root")).toBeInTheDocument();
  });
});
