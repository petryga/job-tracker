import { Contact } from "features/jobModal/types";
import { CONTACT, JOB_TAG, LIST, apiSlice } from "../api/apiSlice";
import { providesList } from "../api/helpers";

export const contactsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query<Contact[], any>({
      query: () => ({
        url: `/api/contacts/getAll`,
        method: "GET",
      }),
      providesTags: (result: any) => providesList(result, CONTACT),
    }),

    getContact: builder.query<Contact, any>({
      query: ({ id }) => ({
        url: `/api/contacts/getOne/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: CONTACT, id }],
    }),

    updateContact: builder.mutation({
      query: (data) => ({
        url: `/api/contacts/update/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, _err, arg) => [
        { type: CONTACT, id: result._id },
        { type: CONTACT, id: LIST },
        { type: JOB_TAG, id: arg.contact.jobID },
      ],
    }),

    deleteContact: builder.mutation({
      query: ({ id }) => ({
        url: `/api/contacts/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: CONTACT, id: LIST }],
    }),
  }),
});

export const {
  useGetContactsQuery,
  useGetContactQuery,
  useUpdateContactMutation,
  useDeleteContactMutation,
} = contactsApi;
