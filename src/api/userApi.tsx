import { apiSlice } from "./apiSlice";

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
      }),
    }),

    deleteUser: builder.mutation({
      query: ({ userId }) => ({
        url: `/api/users/delete/${userId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useDeleteUserMutation,
} = userApi;
