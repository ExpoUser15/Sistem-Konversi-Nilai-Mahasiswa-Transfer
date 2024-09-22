import { configureStore } from "@reduxjs/toolkit";
import konversiReducer from "./slices/konversiSlice";
import apiReducer from './slices/apiSlice';
import loginReducer from './slices/loginSlice'

const store = configureStore({
    reducer: { 
        konversi: konversiReducer, 
        apiData: apiReducer,
        loginData: loginReducer
    }
});

console.log("Store Created: ", store.getState())

store.subscribe(() => {
    console.log("Store Change: ", store.getState())
});

export default store;