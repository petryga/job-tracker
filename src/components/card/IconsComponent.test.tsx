import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IconsComponent, LikeIcon } from "./IconsComponent";

describe("LikeIcon", () => {
  it("uses the liked prop when inside a modal", () => {
    render(<LikeIcon liked setLiked={vi.fn()} isFavorite={false} insideModal />);
    expect(screen.getByText("favorite")).toBeInTheDocument();
  });

  it("uses the isFavorite prop when not inside a modal", () => {
    render(
      <LikeIcon liked={false} setLiked={vi.fn()} isFavorite insideModal={false} />
    );
    expect(screen.getByText("favorite")).toBeInTheDocument();
  });

  it("toggles liked only when inside a modal", async () => {
    const setLiked = vi.fn();
    const user = userEvent.setup();
    render(
      <LikeIcon liked={false} setLiked={setLiked} isFavorite={false} insideModal={false} />
    );

    await user.click(screen.getByText("favorite_border"));
    expect(setLiked).not.toHaveBeenCalled();
  });
});

describe("IconsComponent", () => {
  it("shows a favorite icon on a job-search board", () => {
    render(
      <IconsComponent
        isJobSearchBoard
        setLiked={vi.fn()}
        liked={false}
        openDeleteModal={vi.fn()}
        isFavorite
      />
    );
    expect(screen.getByText("favorite")).toBeInTheDocument();
  });

  it("shows a delete icon on a plain to-do board and wires it to openDeleteModal", async () => {
    const openDeleteModal = vi.fn();
    const user = userEvent.setup();
    render(
      <IconsComponent
        isJobSearchBoard={false}
        setLiked={vi.fn()}
        liked={false}
        openDeleteModal={openDeleteModal}
        isFavorite={false}
      />
    );

    await user.click(screen.getByText("delete_outline"));
    expect(openDeleteModal).toHaveBeenCalledWith("confirmDelete");
  });
});
