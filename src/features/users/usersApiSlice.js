import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import {apiSlice} from '../../app/api/apiSlice';

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints : builder => ({

        // Query to get All users
        getUsers : builder.query({

            // where should the front end look at in backend mapping to get users data
            query : () => ({
                
            url : '/users',

            // if there is no error return the success status 200
            validateStatus : (response, result) => {
                return response.status === 200 && !result.isError
            }}),

            // The keepUnusedDataFor attribute in Redux Toolkit’s RTK Query is used to manage the cache behavior of data. When data is fetched from the server, RTK Query will store the data in the Redux store as a ‘cache’. If no components have asked to read that data when the timer expires, it will remove the data from the cache
            // keepUnusedDataFor : 5,

            // Make appropriate changes to neccessary attibutes in default response from backend/database
            // Redux won't look at _id it looks at id default
            transformResponse : responseData => {
                const loadedUsers = responseData.map(user => {
                    user.id = user._id
                    return user
                });

                return usersAdapter.setAll(initialState, loadedUsers);
            },
            
            providesTags : (result, error, arg) => {
                if (result?.ids) {
                    return [
                        {type : 'User', id : 'LIST'},
                        ...result.ids.map(id => ({type : 'User', id}))
                    ]
                }else return [
                    {type : 'User', id : 'LIST'}
                ]
            }

        }),

        // Mutation for create new user
        addNewUser : builder.mutation({
            query : initialUserData => ({
                url : '/users',
                method : 'POST',
                body : {
                    ...initialUserData,
                }
            }),

            invalidatesTags : [
                {type : 'User', id : "LIST"}
            ]
        }),

        // Mutation for update an existing user in the state
        updateUser : builder.mutation({
            query : initialUserData => ({
                url : '/users',
                method : 'PATCH',
                body : {
                    ...initialUserData,
                }
            }),

            invalidatesTags : (result, error , arg) => [
                {type : 'User', id : arg.id}
            ]
        }),

        // Mutation for delete an user from the state
        deleteUser : builder.mutation({
            query : ({ id }) => ({
                url : '/users',
                method : 'DELETE',
                body : { id }
            }),

            invalidatesTags : (result, error, arg) => (
                {type : 'User', id : arg.id}
            )
        })


    })
});

// these destructured hooks are automatically created with RTK Query for every endpoint of apiSlice.
export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;

// Returns query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// creating memoized selector
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data //Normalized state object with ids 7 entities
); 

// getSelectors from the toolkit creates these selctors and those selecteres renamed with following aliases as my preference.
export const {
    selectAll : selectAllUsers,
    selectById : selectUserById,
    selectIds : selectUserIds
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)
