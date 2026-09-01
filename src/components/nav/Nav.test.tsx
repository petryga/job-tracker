import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "test-utils/render";
import { Nav } from "./Nav";

describe("Nav", () => {
  const originalLocation = window.location;
  const reload = vi.fn();

  beforeEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, reload },
    });
  });

  afterEach(() => {
    reload.mockClear();
    localStorage.clear();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("shows the app title", () => {
    renderWithProviders(<Nav />);
    expect(screen.getByText("Job Application Tracker")).toBeInTheDocument();
  });

  it("opens the menu with a logout option", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Nav />);

    await user.click(screen.getByText("power_settings_new"));

    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.queryByText("Delete User")).not.toBeInTheDocument();
  });

  it("logs out and reloads when Logout is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Nav />);

    await user.click(screen.getByText("power_settings_new"));
    await user.click(screen.getByText("Logout"));

    await waitFor(() => expect(reload).toHaveBeenCalled());
  });
});
