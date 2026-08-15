import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BoardThumbnail from "./BoardThumbnail";

describe("BoardThumbnail", () => {
  it("links to the board's own page and shows its title", () => {
    render(
      <MemoryRouter>
        <BoardThumbnail title="Job Search" id="board-1" />
      </MemoryRouter>
    );

    const link = screen.getByText("Job Search").closest("a");
    expect(link).toHaveAttribute("href", "/board-1");
  });
});
