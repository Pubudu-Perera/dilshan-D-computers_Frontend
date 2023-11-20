import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const notesAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query to get All notes
    getNotes: builder.query({
      // where should the front end look at in backend mapping to get notes data
      query: () => ({

        url : "/notes",

        // if there is no error return the success status 200
        // if there is some unexpected error it will go throgh this
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        }
      }),

      // keepUnusedDataFor: 5,

      // Redux won't look at _id it looks at id, default
      transformResponse: (responseData) => {
        const loadedNotes = responseData.map((note) => {
          note.id = note._id;
          return note;
        });

        return notesAdapter.setAll(initialState, loadedNotes);
      },

      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Note", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Note", id })),
          ];
        } else return [{ type: "Note", id: "LIST" }];
      },
    }),

    // Mutation for create new note
    addNewNote: builder.mutation({
      query: initialNoteData => ({
        url: "/notes",
        method: "POST",
        body: {
          ...initialNoteData,
        },
      }),

      invalidatesTags: [{ type: "Note", id: "LIST" }],
    }),

    // Mutation for update an existing note in the state
    updateNote: builder.mutation({
      query: (initialNoteData) => ({
        url: "/notes",
        method: "PATCH",
        body: {
          ...initialNoteData,
        },
      }),

      invalidatesTags: (result, error, arg) => [{ type: "Note", id: arg.id }],
    }),

    // Mutation for delete an note from the state
    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: "/notes",
        method: "DELETE",
        body: { id },
      }),

      invalidatesTags: (result, error, arg) => ({ type: "Note", id: arg.id }),
    }),
  }),
});

// these destructured hooks are automatically created with RTK Query for every endpoint of apiSlice.
export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApiSlice;

// This is where actually get the users list using getNotes endpoint above.
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// creating memoized selector
const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data //Normalized state object with ids 7 entities
);

// getSelectors from the toolkit creates these selctors and those selecteres renamed with following aliases as my preference.
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
} = notesAdapter.getSelectors(
  (state) => selectNotesData(state) ?? initialState
);
