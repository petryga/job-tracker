import {
  LOGIN_FIELDS,
  PasswordIcon,
  SIGN_UP_FORM,
  loginInitialValues,
  tabProps,
} from "./helpers";
import TextField from "@material-ui/core/TextField";
import { Button, Tab, Tabs } from "@material-ui/core";
import { TabPanel } from "components/tabPanel/TabPanel";
import { ChangeEvent, FormEvent, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorState } from "features/boardPage/helpers";
import { LoginInitialValues } from "./types";
import { useLoginUserMutation, useRegisterUserMutation } from "api/userApi";
import toast from "react-hot-toast";

import styles from "./LoginPage.module.css";

export const LoginPage = () => {
  const user = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (user && window.location.pathname === "/") {
      navigate("/home");
    }
  }, [navigate, user]);

  const [tabIndex, setTabIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [registerUser] = useRegisterUserMutation();
  const [loginUser] = useLoginUserMutation();
  const [formData, setFormData] = useReducer(
    (state: LoginInitialValues, newState: LoginInitialValues) => ({
      ...state,
      ...newState,
    }),
    loginInitialValues
  );

  const error = getErrorState(formData);
  const buttonDisabled = tabIndex === 0 ? error : error || formData.name === "";
  const passwordLengthError =
    formData.password.length < 9 || formData.confirm_password.length < 9;
  const fields = tabIndex === 0 ? LOGIN_FIELDS : SIGN_UP_FORM;

  useEffect(() => {
    setFormData(loginInitialValues);
  }, [tabIndex]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordLengthError) {
      toast.error("Password must be at least 9 characters long");
      return;
    }

    if (tabIndex === 0) {
      return loginUser({ data: formData })
        .unwrap()
        .then((res) => {
          if (res) {
            localStorage.setItem("token", res.token);
            localStorage.setItem("userId", res._id);
            navigate("/home");
            toast.success(`Hi ${res.name}`);
          }
        })
        .catch((error) => {
          toast.error(error.data.message);
        });
    } else {
      return registerUser({ data: formData })
        .unwrap()
        .then((res) => {
          toast.success(res.message);
          setTabIndex(0);
        })
        .catch((error) => {
          toast.error(error.data.message);
        });
    }
  };

  const handleChange = (e: ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData({ [name]: value } as Pick<
      LoginInitialValues,
      keyof LoginInitialValues
    >);
  };

  return (
    <div className={styles.root}>
      <form onSubmit={handleSubmit}>
        <Tabs variant="fullWidth" value={tabIndex} TabIndicatorProps={tabProps}>
          <Tab label="Login" onClick={() => setTabIndex(0)} />
          <Tab label="Sign up" onClick={() => setTabIndex(1)} />
        </Tabs>
        <TabPanel value={tabIndex} index={tabIndex}>
          <div className={styles.inputContainer}>
            {fields.map(({ name, type, label, required }) => {
              const isPasswordWithData =
                (name === "password" && formData.password) ||
                (name === "confirm_password" && formData.confirm_password);

              const passwordType = visible ? "text" : "password";
              return (
                <TextField
                  InputLabelProps={{ shrink: true }}
                  margin="dense"
                  variant="outlined"
                  autoComplete={type === "email" ? "email" : "password"} // TODO name field
                  key={name}
                  className={styles.input}
                  label={label}
                  name={name}
                  type={isPasswordWithData ? passwordType : type}
                  required={required}
                  onChange={handleChange}
                  value={formData[name as keyof typeof formData]}
                  InputProps={
                    isPasswordWithData
                      ? PasswordIcon(visible, setVisible)
                      : undefined
                  }
                />
              );
            })}
          </div>
        </TabPanel>

        <Button type="submit" disabled={buttonDisabled}>
          {tabIndex === 0 ? "Login" : "Sign up"}
        </Button>
      </form>
    </div>
  );
};
