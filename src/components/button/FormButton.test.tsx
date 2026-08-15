import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormButton from "./FormButton";

describe("FormButton", () => {
  it("renders its children", () => {
    render(<FormButton onClick={vi.fn()}>Save</FormButton>);
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("fires onClick on mouse down, not click, so it beats the textarea's onBlur", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<FormButton onClick={onClick}>Save</FormButton>);

    await user.pointer([{ target: screen.getByText("Save"), keys: "[MouseLeft]" }]);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
