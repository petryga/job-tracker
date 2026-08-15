import type { ReactElement, ReactNode } from "react";
import { renderHook as rtlRenderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { makeStore } from "./render";
import type { InitialState, ModalState } from "reducers/types";

interface RenderHookOptions {
  route?: string;
  path?: string;
  preloadedState?: {
    app?: Partial<InitialState>;
    modal?: Partial<ModalState>;
  };
}

export const renderHookWithProviders = <Result,>(
  hook: () => Result,
  { route = "/", path = "/", preloadedState }: RenderHookOptions = {}
) => {
  const store = makeStore(preloadedState);

  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={path} element={children as ReactElement} />
          <Route path="/home" element={<div>HOME</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  const utils = rtlRenderHook(hook, { wrapper });
  return { store, ...utils };
};
