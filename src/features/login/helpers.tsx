import Icon from "@mui/material/Icon";
import InputAdornment from "@mui/material/InputAdornment";
import { Dispatch } from "react";
import type { LoginInitialValues } from "./types";

export const LOGIN_FIELDS = [
  {
    name: "email",
    label: "Email",
    required: true,
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    required: true,
    type: "password",
  },
];

export const SIGN_UP_FORM = [
  {
    name: "name",
    label: "Name",
    required: true,
    type: "text",
  },
  ...LOGIN_FIELDS,
  {
    name: "confirm_password",
    label: "Confirm Password",
    required: true,
    type: "password",
  },
];

export const PasswordIcon = (
  visible: boolean,
  setVisible: Dispatch<React.SetStateAction<boolean>>
) => {
  return {
    endAdornment: (
      <InputAdornment position="end" onClick={() => setVisible(!visible)}>
        <Icon fontSize="small">
          {!visible ? "visibility" : "visibility_off"}
        </Icon>
      </InputAdornment>
    ),
  };
};

export const tabProps = {
  style: { background: "#89949F", height: "2px" },
};

export const loginInitialValues = {
  email: "",
  password: "",
  confirm_password: "",
  name: "",
};

export const getAutocompleteProps = (
  name: string,
  tabIndex: number
): string => {
  if (tabIndex === 0) {
    return name === "email" ? "username" : "password";
  } else {
    return name === "email" ? "email" : "new-password";
  }
};

export const getErrorState = (
  formData: LoginInitialValues,
  tabIndex: number
) => {
  if (tabIndex === 0) {
    return formData.email === "" || formData.password === "";
  } else {
    return (
      formData.email === "" ||
      formData.password === "" ||
      formData.confirm_password === "" ||
      formData.password !== formData.confirm_password
    );
  }
};

export const getPasswordLengthError = (
  formData: LoginInitialValues,
  tabIndex: number
) => {
  if (tabIndex === 0) {
    return formData.password.length < 9;
  } else {
    return formData.password.length < 9 || formData.confirm_password.length < 9;
  }
};
