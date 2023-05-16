import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BACKEND_URL = "http://localhost:3000";
// export const BACKEND_URL = "https://job-board-backend.onrender.com/";
export const BOARD_TAG = "Board";
export const JOB_TAG = "Job";
export const LIST = "LIST";
export const CONTACT = "CONTACT";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL, // todo from env
    credentials: "include",
    prepareHeaders: async (headers) => {
      const token = await localStorage.getItem("token");
      headers.set("content-type", "application/json");
      headers.set("allow-access-control-origin", BACKEND_URL);
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [BOARD_TAG, JOB_TAG, CONTACT],
  endpoints: () => ({}),
});
