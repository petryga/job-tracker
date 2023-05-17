import { BOARD_TAG, CONTACT, JOB_TAG, LIST, apiSlice } from "./apiSlice";

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
      invalidatesTags: (result) => [
        { type: BOARD_TAG, id: result.boardID },
        { type: CONTACT, id: LIST },
      ],
    }),
  }),
});

export const { useLazyGetJobQuery, useUpdateJobMutation } = jobApi;
