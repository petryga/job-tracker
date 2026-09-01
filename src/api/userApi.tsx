import { apiSlice } from "./apiSlice";

// Sign-up / login / sessions are handled by Supabase Auth (see
// features/auth). The only account endpoint the API exposes is a self-service
// "delete everything I own", scoped to the caller's token.
export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    deleteUser: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/api/users/me",
        method: "DELETE",
      }),
    }),
  }),
});

export const { useDeleteUserMutation } = userApi;
