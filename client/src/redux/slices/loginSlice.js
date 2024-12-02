import { createSlice } from '@reduxjs/toolkit';
import { fetchData, postData } from '../thunks/loginApiThunks';

const loginSlice = createSlice({
  name: 'loginData',
  initialState: {
    data: {},
    hasNavigated: false,
    status: null,
    message: null,
    action: false,
    tokenExpired: {},
    logOut: false
  },
  reducers: {
    logout: function(state, action){
      state.logOut = action.payload;
      state.hasNavigated = action.payload;
    },
    changeNavigated: (state, action) => {
      state.status = action.payload.status;
      state.action = action.payload.action;
      state.message = action.payload.message;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle POST request
      .addCase(postData.pending, (state) => {
        state.action = false
        state.loading = true;
      })
      .addCase(postData.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.status = payload.status;
        state.action = true;
        if(!payload.message){
            state.user = payload.user;
            state.token = payload.token;
            return;
        }
        state.message = payload.message;
      })
      .addCase(postData.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.status = payload.status || "Error";
        state.message = payload.message || "Terjadi kesalahan pada server.";
        state.action = true;
      })  

      .addCase(fetchData.pending, (state) => {
        state.action = false;
        state.loading = true;
        state.hasNavigated = false;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (!payload.auth.message) {
          state.data = payload.auth; 
        } else {
          state.action = true;
          state.status = payload.auth.status;
          state.message = payload.auth.message;
        }
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload.auth;
        state.status = payload.status;
        state.message = payload.message;
      })  
  },
});

export const { logout, changeNavigated } = loginSlice.actions;
export default loginSlice.reducer;

