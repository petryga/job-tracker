import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "test-utils/render";
import OpenForm from "./OpenForm";

describe("OpenForm", () => {
  it("shows an add icon and the given label when not dragging", () => {
    renderWithProviders(<OpenForm onClick={jest.fn()}>Add another list</OpenForm>);

    expect(screen.getByText("add")).toBeInTheDocument();
    expect(screen.getByText("Add another list")).toBeInTheDocument();
  });

  it("swaps to a down-arrow icon while a drag is in progress", () => {
    renderWithProviders(<OpenForm onClick={jest.fn()}>Add another list</OpenForm>, {
      preloadedState: { app: { isDragging: true } },
    });

    expect(screen.getByText("keyboard_arrow_down")).toBeInTheDocument();
    expect(screen.queryByText("add")).not.toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();
    renderWithProviders(<OpenForm onClick={onClick}>Add list</OpenForm>);

    await user.click(screen.getByText("Add list"));
    expect(onClick).toHaveBeenCalled();
  });
});
