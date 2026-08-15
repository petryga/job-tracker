import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Form from "./Form";
import type { BoardApi } from "features/boardPage/types";

const board: BoardApi = {
  _id: "board-1",
  title: "Board",
  isJobSearchBoard: true,
  lists: [],
};

describe("Form", () => {
  it("shows the job-search placeholder for a card on a job board", () => {
    render(
      <Form text="" onChange={vi.fn()} closeForm={vi.fn()} board={board}>
        <button>Save</button>
      </Form>
    );

    expect(screen.getByPlaceholderText("Enter company name")).toBeInTheDocument();
  });

  it("shows the list placeholder when creating a list", () => {
    render(
      <Form list text="" onChange={vi.fn()} closeForm={vi.fn()} board={board}>
        <button>Save</button>
      </Form>
    );

    expect(screen.getByPlaceholderText("Enter list title")).toBeInTheDocument();
  });

  it("closes on blur and calls onChange as the user types", async () => {
    const onChange = vi.fn();
    const closeForm = vi.fn();
    const user = userEvent.setup();
    render(
      <Form text="" onChange={onChange} closeForm={closeForm} board={board}>
        <button>Save</button>
      </Form>
    );

    await user.type(screen.getByPlaceholderText("Enter company name"), "A");
    expect(onChange).toHaveBeenCalled();

    await user.tab();
    expect(closeForm).toHaveBeenCalled();
  });

  it("closes when the close icon is pressed", async () => {
    const closeForm = vi.fn();
    const user = userEvent.setup();
    render(
      <Form text="" onChange={vi.fn()} closeForm={closeForm} board={board}>
        <button>Save</button>
      </Form>
    );

    await user.click(screen.getByText("close"));
    expect(closeForm).toHaveBeenCalled();
  });
});
