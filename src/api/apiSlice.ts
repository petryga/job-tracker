import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const LOCAL_BACKEND_URL = "http://localhost:3000";
export const BOARD_TAG = "Board";
export const JOB_TAG = "Job";
export const LIST = "LIST";
export const CONTACT = "Contact";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.DEV
      ? LOCAL_BACKEND_URL
      : import.meta.env.VITE_BACKEND_URL,
    credentials: "include",
    prepareHeaders: async (headers) => {
      const token = await localStorage.getItem("token");

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [BOARD_TAG, JOB_TAG, CONTACT, LIST],
  endpoints: () => ({}),
});
