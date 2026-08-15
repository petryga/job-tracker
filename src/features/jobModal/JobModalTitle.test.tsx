import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JobModalTitle } from "./JobModalTitle";

describe("JobModalTitle", () => {
  it("shows the card title", () => {
    render(
      <JobModalTitle
        cardTitle="Acme"
        dispatch={vi.fn()}
        liked={false}
        setLiked={vi.fn()}
        isFavorite={false}
      />
    );
    expect(screen.getByText("Acme")).toBeInTheDocument();
  });

  it("shows an outlined heart when not liked", () => {
    render(
      <JobModalTitle
        cardTitle="Acme"
        dispatch={vi.fn()}
        liked={false}
        setLiked={vi.fn()}
        isFavorite={false}
      />
    );
    expect(screen.getByText("favorite_border")).toBeInTheDocument();
  });

  it("shows a filled heart when liked", () => {
    render(
      <JobModalTitle
        cardTitle="Acme"
        dispatch={vi.fn()}
        liked={true}
        setLiked={vi.fn()}
        isFavorite={false}
      />
    );
    expect(screen.getByText("favorite")).toBeInTheDocument();
  });

  it("toggles liked state when the heart is clicked", async () => {
    const setLiked = vi.fn();
    const user = userEvent.setup();
    render(
      <JobModalTitle
        cardTitle="Acme"
        dispatch={vi.fn()}
        liked={false}
        setLiked={setLiked}
        isFavorite={false}
      />
    );

    await user.click(screen.getByText("favorite_border"));
    expect(setLiked).toHaveBeenCalledWith(true);
  });
});
