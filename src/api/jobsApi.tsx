import { BOARD_TAG, JOB_TAG, apiSlice } from "./apiSlice";

export const jobApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJob: builder.query({
      query: ({ cardID }) => ({
        url: `/api/jobs/getOne/${cardID}`,
        method: "GET",
      }),
      providesTags: (result) => [{ type: JOB_TAG, id: result._id }],
    }),
    updateJob: builder.mutation({
      query: (data) => ({
        url: `/api/jobs/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result) => [{ type: BOARD_TAG, id: result.boardID }],
    }),
  }),
});

export const { useLazyGetJobQuery, useUpdateJobMutation } = jobApi;
