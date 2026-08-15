import { configureStore } from "@reduxjs/toolkit";
import modalSlice from "reducers/modalSlice";
import appSlice from "reducers/appSlice";
import { apiSlice } from "api/apiSlice";

export const makeTestStore = () =>
  configureStore({
    reducer: {
      modal: modalSlice,
      app: appSlice,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });

export type TestStore = ReturnType<typeof makeTestStore>;
