import { Contact } from "features/jobModal/types";
import { CONTACT, LIST, apiSlice } from "./apiSlice";
import { providesList } from "./helpers";

export const contactsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query<Contact[], { boardID: string }>({
      query: ({ boardID }) => ({
        url: `/api/contacts/getAll/${boardID}`,
        method: "GET",
      }),
      providesTags: (result) => providesList(result, CONTACT),
    }),

    deleteContact: builder.mutation({
      query: ({ contactID }) => ({
        url: `/api/contacts/delete/${contactID}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: CONTACT, id: LIST }],
    }),
  }),
});

export const { useGetContactsQuery, useDeleteContactMutation } = contactsApi;
