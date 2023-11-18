import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from './api/apiSlice';
import authReducer from "../features/auth/authSlice";
import { setupListeners } from "@reduxjs/toolkit/query"; //Making able to adding listeners to endpoints. Ex- : Automaticcaly refresh data after a ceratin time period

export const store = configureStore({
    reducer : {
        [apiSlice.reducerPath] : apiSlice.reducer,
        auth : authReducer

    },
    middleware : getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools : true
});

setupListeners(store.dispatch);