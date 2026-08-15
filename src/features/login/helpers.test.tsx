import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  getAutocompleteProps,
  getErrorState,
  getPasswordLengthError,
  loginInitialValues,
  PasswordIcon,
} from "./helpers";
import type { LoginInitialValues } from "./types";

describe("getAutocompleteProps", () => {
  it("uses login autocomplete hints on the login tab", () => {
    expect(getAutocompleteProps("email", 0)).toBe("username");
    expect(getAutocompleteProps("password", 0)).toBe("password");
  });

  it("uses sign-up autocomplete hints on the sign-up tab", () => {
    expect(getAutocompleteProps("email", 1)).toBe("email");
    expect(getAutocompleteProps("password", 1)).toBe("new-password");
  });
});

describe("getErrorState", () => {
  const base: LoginInitialValues = { ...loginInitialValues };

  it("requires email and password on the login tab", () => {
    expect(getErrorState(base, 0)).toBe(true);
    expect(getErrorState({ ...base, email: "a@b.com", password: "secretsecret" }, 0)).toBe(
      false
    );
  });

  it("also requires a matching confirm_password on the sign-up tab", () => {
    const filled = {
      ...base,
      email: "a@b.com",
      password: "secretsecret",
      confirm_password: "different",
    };
    expect(getErrorState(filled, 1)).toBe(true);
    expect(
      getErrorState({ ...filled, confirm_password: "secretsecret" }, 1)
    ).toBe(false);
  });
});

describe("getPasswordLengthError", () => {
  it("flags a login password under 9 characters", () => {
    expect(getPasswordLengthError({ ...loginInitialValues, password: "short" }, 0)).toBe(
      true
    );
    expect(
      getPasswordLengthError({ ...loginInitialValues, password: "longenough" }, 0)
    ).toBe(false);
  });

  it("also checks confirm_password length on the sign-up tab", () => {
    expect(
      getPasswordLengthError(
        { ...loginInitialValues, password: "longenough", confirm_password: "short" },
        1
      )
    ).toBe(true);
    expect(
      getPasswordLengthError(
        {
          ...loginInitialValues,
          password: "longenough",
          confirm_password: "alsolongenough",
        },
        1
      )
    ).toBe(false);
  });
});

describe("PasswordIcon", () => {
  it("toggles visibility when clicked", async () => {
    const user = userEvent.setup();
    const setVisible = jest.fn();
    const { endAdornment } = PasswordIcon(false, setVisible);
    render(<>{endAdornment}</>);

    expect(screen.getByText("visibility")).toBeInTheDocument();
    await user.click(screen.getByText("visibility"));
    expect(setVisible).toHaveBeenCalledWith(true);
  });

  it("shows the crossed-out icon when already visible", () => {
    const { endAdornment } = PasswordIcon(true, jest.fn());
    render(<>{endAdornment}</>);
    expect(screen.getByText("visibility_off")).toBeInTheDocument();
  });
});
