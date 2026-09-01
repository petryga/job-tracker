import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./components/App";
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LoginPage } from "features/login/LoginPage";
import { AuthProvider } from "features/auth/AuthContext";
import { ToastBar, Toaster } from "react-hot-toast";
import store, { persistor } from "./store/store";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import Icon from "@mui/material/Icon";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// MUI v4's default palette (this app never set its own theme, so v9's
// default palette swap from indigo to blue would otherwise be a visual
// regression). Pinned here to keep the original look.
//
// This also restores Button's and Tabs' old default look: v4's Button
// defaulted to color="default" (neutral grey), and v4's Tabs defaulted to
// textColor="inherit" (selected tab stayed plain text, only the indicator
// line showed selection). v5+ dropped color="default" and switched Tabs'
// default textColor to "primary" - neither component in this app sets
// those props explicitly, so both quietly started rendering in the theme's
// primary color instead of staying neutral. Re-defaulting both back to
// "inherit" restores the original appearance everywhere at once.
const theme = createTheme({
  palette: {
    primary: { main: "#3f51b5" },
    secondary: { main: "#f50057" },
  },
  components: {
    MuiButton: {
      defaultProps: {
        color: "inherit",
      },
    },
    MuiTabs: {
      defaultProps: {
        textColor: "inherit",
      },
    },
  },
});

window.React = React;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const TOAST_OPTIONS = {
  duration: 100000,
  icon: <Icon className="infoIcon">info</Icon>,
  style: {
    background: "#fff",
    border: "1px solid #dd881e",
    color: "#dd881e",
    borderRadius: "3px",
    boxShadow: "none",
  },

  success: {
    duration: 5000,
    icon: <Icon className="infoIcon">info</Icon>,
    style: {
      background: "#fff",
      border: "1px solid #42bd41",
      color: "#42bd41",
      borderRadius: "3px",
      boxShadow: "none",
    },
  },

  error: {
    duration: 6000,
    icon: <Icon className="infoIcon">info</Icon>,
    style: {
      background: "#fff",
      border: "1px solid #d41717",
      color: "#d41717",
      borderRadius: "3px",
      boxShadow: "none",
    },
  },
};

if (import.meta.env.PROD) {
  disableReactDevTools();
}

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthProvider>
            <Router>
              <Toaster position="bottom-left" toastOptions={TOAST_OPTIONS}>
                {(toast) => (
                  <ToastBar toast={toast} style={{ maxWidth: "530px" }} />
                )}
              </Toaster>

              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="*" element={<App />} />
              </Routes>
            </Router>
          </AuthProvider>
        </PersistGate>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
