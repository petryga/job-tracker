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
import { ToastBar, Toaster } from "react-hot-toast";
import store, { persistor } from "./store/store";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import Icon from "@mui/material/Icon";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// MUI v4's default palette (this app never set its own theme, so v9's
// default palette swap from indigo to blue would otherwise be a visual
// regression). Pinned here to keep the original look.
const theme = createTheme({
  palette: {
    primary: { main: "#3f51b5" },
    secondary: { main: "#f50057" },
  },
});

window.React = React;

let root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

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
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <PersistGate loading={null} persistor={persistor}>
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
      </PersistGate>
    </ThemeProvider>
  </Provider>
);
