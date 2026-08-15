import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactsTab } from "./ContactsTab";
import { INITIAL_VALUES } from "./helpers";
import type { Job } from "./types";

// Field order per contact, per CONTACTS_FIELDS: name, position, email, phone, notes.
const FIELDS_PER_CONTACT = 5;

const Wrapper = ({ initial }: { initial: Job }) => {
  const [formData, setFormData] = useState(initial);
  return <ContactsTab formData={formData} setFormData={setFormData as never} />;
};

describe("ContactsTab", () => {
  it("renders one blank contact form by default", () => {
    render(<Wrapper initial={INITIAL_VALUES} />);
    expect(screen.getAllByRole("textbox")).toHaveLength(FIELDS_PER_CONTACT);
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("adds another contact form up to a limit of three", async () => {
    const user = userEvent.setup();
    render(<Wrapper initial={INITIAL_VALUES} />);

    await user.click(screen.getByText("add another contact"));
    expect(screen.getAllByRole("textbox")).toHaveLength(FIELDS_PER_CONTACT * 2);

    await user.click(screen.getByText("add another contact"));
    expect(screen.getAllByRole("textbox")).toHaveLength(FIELDS_PER_CONTACT * 3);
    expect(screen.queryByText("add another contact")).not.toBeInTheDocument();
  });

  it("shows a Delete button on every contact after the first", async () => {
    const user = userEvent.setup();
    render(<Wrapper initial={INITIAL_VALUES} />);

    await user.click(screen.getByText("add another contact"));
    expect(screen.getAllByText("Delete")).toHaveLength(1);
  });

  it("removes a contact when its Delete button is clicked", async () => {
    const user = userEvent.setup();
    render(<Wrapper initial={INITIAL_VALUES} />);

    await user.click(screen.getByText("add another contact"));
    expect(screen.getAllByRole("textbox")).toHaveLength(FIELDS_PER_CONTACT * 2);

    await user.click(screen.getByText("Delete"));
    expect(screen.getAllByRole("textbox")).toHaveLength(FIELDS_PER_CONTACT);
  });

  it("updates a contact field as the user types", async () => {
    const user = userEvent.setup();
    render(<Wrapper initial={INITIAL_VALUES} />);

    const [nameField] = screen.getAllByRole("textbox");
    await user.type(nameField, "Jamie");
    expect(screen.getByDisplayValue("Jamie")).toBeInTheDocument();
  });
});
