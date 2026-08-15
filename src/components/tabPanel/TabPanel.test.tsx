import { render, screen } from "@testing-library/react";
import { TabPanel } from "./TabPanel";

describe("TabPanel", () => {
  it("renders its children when its index matches the active tab", () => {
    render(
      <TabPanel value={0} index={0}>
        content
      </TabPanel>
    );

    expect(screen.getByText("content")).toBeInTheDocument();
    expect(screen.getByRole("tabpanel", { hidden: false })).not.toHaveAttribute(
      "hidden"
    );
  });

  it("hides itself and skips rendering children when its index does not match", () => {
    render(
      <TabPanel value={1} index={0}>
        content
      </TabPanel>
    );

    expect(screen.queryByText("content")).not.toBeInTheDocument();
    expect(screen.getByRole("tabpanel", { hidden: true })).toHaveAttribute("hidden");
  });
});
