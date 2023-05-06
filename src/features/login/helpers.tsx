import Icon from "@material-ui/core/Icon";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Dispatch } from "react";

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
  {
    name: "confirm_password",
    label: "Confirm Password",
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
