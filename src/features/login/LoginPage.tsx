import {
  LOGIN_FIELDS,
  PasswordIcon,
  SIGN_UP_FORM,
  getAutocompleteProps,
  tabProps,
} from "./helpers";
import TextField from "@mui/material/TextField";
import { Button, Tab, Tabs } from "@mui/material";
import { TabPanel } from "components/tabPanel/TabPanel";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginSignUpForm } from "./hooks";
import { useAuth } from "features/auth/useAuth";

import styles from "./LoginPage.module.css";

export const LoginPage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const fields = tabIndex === 0 ? LOGIN_FIELDS : SIGN_UP_FORM;
  const [handleSubmit, handleChange, buttonDisabled, formData] =
    useLoginSignUpForm(tabIndex, setTabIndex);

  useEffect(() => {
    if (session && window.location.pathname === "/") {
      navigate("/home");
    }
  }, [navigate, session]);

  return (
    <div className={styles.root}>
      <form onSubmit={handleSubmit}>
        <Tabs variant="fullWidth" value={tabIndex} slotProps={{ indicator: tabProps }}>
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
              const autocomplete = getAutocompleteProps(name, tabIndex);

              return (
                <TextField
                  margin="dense"
                  variant="outlined"
                  autoComplete={autocomplete}
                  key={name}
                  className={styles.input}
                  label={label}
                  name={name}
                  type={isPasswordWithData ? passwordType : type}
                  required={required}
                  onChange={handleChange}
                  value={formData[name as keyof typeof formData]}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: isPasswordWithData
                      ? PasswordIcon(visible, setVisible)
                      : undefined,
                  }}
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
