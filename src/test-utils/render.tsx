import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import modalSlice from "reducers/modalSlice";
import appSlice from "reducers/appSlice";
import { apiSlice } from "api/apiSlice";
import { AuthProvider } from "features/auth/AuthContext";
import type { InitialState, ModalState } from "reducers/types";
import { appInitialState, modalInitialState } from "reducers/helpers";

interface RenderOptions {
  route?: string;
  path?: string;
  preloadedState?: {
    app?: Partial<InitialState>;
    modal?: Partial<ModalState>;
  };
}

export const makeStore = (preloadedState?: RenderOptions["preloadedState"]) =>
  configureStore({
    reducer: {
      modal: modalSlice,
      app: appSlice,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    preloadedState: {
      app: { ...appInitialState, ...preloadedState?.app },
      modal: { ...modalInitialState, ...preloadedState?.modal },
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });

export const renderWithProviders = (
  ui: ReactElement,
  { route = "/", path = "/", preloadedState }: RenderOptions = {}
) => {
  const store = makeStore(preloadedState);

  const utils = render(
    <Provider store={store}>
      <AuthProvider>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path={path} element={ui} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </Provider>
  );

  return { store, ...utils };
};
