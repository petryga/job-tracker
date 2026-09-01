import { BoardApi } from "features/boardPage/types";
import { providesList } from "./helpers";
import { BOARD_TAG, LIST, apiSlice } from "./apiSlice";

export const boardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBoard: builder.mutation({
      query: ({ title }) => ({
        url: "/api/boards/create",
        method: "POST",
        body: { title },
      }),
      invalidatesTags: [{ type: BOARD_TAG, id: LIST }],
    }),

    // The API scopes boards to the authenticated user (Supabase JWT); no id in
    // the URL.
    getBoards: builder.query<BoardApi[], void>({
      query: () => ({
        url: `/api/boards/getAll`,
        method: "GET",
      }),
      providesTags: (result) => providesList(result, BOARD_TAG),
    }),

    getBoardById: builder.query<BoardApi, { id: string }>({
      query: ({ id }) => ({
        url: `/api/boards/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { id }) => [{ type: BOARD_TAG, id }],
    }),

    deleteBoard: builder.mutation({
      query: (id) => ({
        url: `/api/boards/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: BOARD_TAG, id: "LIST" }],
    }),

    updateBoard: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/boards/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result) => [
        { type: BOARD_TAG, id: "LIST" },
        { type: BOARD_TAG, id: result._id },
      ],
    }),

    addList: builder.mutation({
      query: ({ title, boardID }) => ({
        url: "/api/boards/lists/createList",
        method: "POST",
        body: { title, boardID },
      }),
      invalidatesTags: (_result, _err, { boardID }) => [
        { type: BOARD_TAG, id: boardID },
      ],
    }),

    updateList: builder.mutation({
      query: ({ id, boardID, title }) => ({
        url: `/api/boards/lists/updateList/${id}`,
        method: "PUT",
        body: { title, boardID },
      }),
      invalidatesTags: (_result, _err, { boardID }) => [
        { type: BOARD_TAG, id: boardID },
      ],
    }),

    deleteList: builder.mutation({
      query: ({ id, boardID }) => ({
        url: `/api/boards/lists/deleteList/${id}`,
        method: "DELETE",
        body: { boardID },
      }),
      invalidatesTags: (_result, _err, { boardID }) => [
        { type: BOARD_TAG, id: boardID },
      ],
    }),

    addCard: builder.mutation({
      query: (data) => ({
        url: "/api/boards/cards/createCard",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _err, { boardID }) => [
        { type: BOARD_TAG, id: boardID },
      ],
    }),

    updateCard: builder.mutation({
      query: ({ id, listID, boardID, text }) => ({
        url: `/api/boards/cards/updateCard/${id}`,
        method: "PUT",
        body: { text, listID, boardID },
      }),

      invalidatesTags: (_result, _err, { boardID }) => [
        { type: BOARD_TAG, id: boardID },
      ],
    }),

    deleteCard: builder.mutation({
      query: ({ id, listID, boardID }) => ({
        url: `/api/boards/cards/deleteCard/${id}`,
        method: "DELETE",
        body: { listID, boardID },
      }),
      invalidatesTags: (_result, _err, { boardID }) => [
        { type: BOARD_TAG, id: boardID },
      ],
    }),

    drag: builder.mutation({
      query: ({
        droppableIdStart,
        droppableIdEnd,
        droppableIndexEnd,
        droppableIndexStart,
        type,
        boardID,
      }) => ({
        url: `/api/boards/all/drag`,
        method: "PUT",
        body: {
          droppableIdStart,
          droppableIdEnd,
          droppableIndexEnd,
          droppableIndexStart,
          type,
          boardID,
        },
      }),
      invalidatesTags: (_result, _err, { boardID }) => [
        { type: BOARD_TAG, id: boardID },
      ],
    }),
  }),
});

export const {
  useCreateBoardMutation,
  useGetBoardsQuery,
  useGetBoardByIdQuery,
  useLazyGetBoardByIdQuery,
  useDeleteBoardMutation,
  useUpdateBoardMutation,
  useAddListMutation,
  useUpdateListMutation,
  useDeleteListMutation,
  useAddCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,
  useDragMutation,
} = boardApi;
