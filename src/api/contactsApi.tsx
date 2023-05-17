import { Contact } from "features/jobModal/types";
import { CONTACT, LIST, apiSlice } from "./apiSlice";
import { providesList } from "./helpers";

export const contactsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query<Contact[], any>({
      query: ({ boardID }) => ({
        url: `/api/contacts/getAll/${boardID}`,
        method: "GET",
      }),
      providesTags: (result) => providesList(result, CONTACT),
    }),

    // getContact: builder.query<Contact, any>({
    //   query: ({ id }) => ({
    //     url: `/api/contacts/getOne/${id}`,
    //     method: "GET",
    //   }),
    //   providesTags: (_result, _error, id) => [{ type: CONTACT, id }],
    // }),

    // updateContact: builder.mutation({
    //   query: (data) => ({
    //     url: `/api/contacts/update/${data.id}`,
    //     method: "PUT",
    //     body: data,
    //   }),
    //   invalidatesTags: (result, _err, arg) => [
    //     { type: CONTACT, id: result._id },
    //     { type: CONTACT, id: LIST },
    //     { type: JOB_TAG, id: arg.contact.jobID },
    //   ],
    // }),

    deleteContact: builder.mutation({
      query: ({ contactID }) => ({
        url: `/api/contacts/delete/${contactID}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: CONTACT, id: LIST }],
    }),
  }),
});

export const {
  useGetContactsQuery,
  // useGetContactQuery,
  // useUpdateContactMutation,
  useDeleteContactMutation,
} = contactsApi;
