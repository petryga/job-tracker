import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BACKEND_URL = "http://localhost:3000";
// export const BACKEND_URL = "https://job-board-backend.onrender.com";
export const BOARD_TAG = "Board";
export const JOB_TAG = "Job";
export const LIST = "LIST";
export const CONTACT = "CONTACT";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [BOARD_TAG, JOB_TAG, CONTACT],
  endpoints: () => ({}),
});
// TODO  change facebook to meta
