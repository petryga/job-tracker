import { BACKEND_URL, apiSlice } from "./apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: ({ data }) => ({
        url: "/api/users/register",
        method: "POST",
        body: data,
      }),
    }),

    loginUser: builder.mutation({
      query: ({ data }) => ({
        url: "/api/users/login",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
          "allow-access-control-origin": BACKEND_URL,
        },
      }),
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation } = userApi;
