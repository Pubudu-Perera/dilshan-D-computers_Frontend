import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    // From where data would be fetched 
    // Node Port
    // About to change at the deployement
    baseQuery : fetchBaseQuery({ baseUrl :'http://localhost:3500'}),

    // to invalidate cache & synchronize every time when a change occur
    tagTypes : ['Note', 'User'],

    
    endpoints : builder => ({})

});