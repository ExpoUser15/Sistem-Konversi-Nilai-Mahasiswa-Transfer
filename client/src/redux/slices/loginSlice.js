import { createSlice } from '@reduxjs/toolkit';
import { fetchData, postData } from '../thunks/loginApiThunks';

const loginSlice = createSlice({
  name: 'loginData',
  initialState: {
    data: {},
    status: null,
    message: null,
    action: false,
    logOut: false
  },
  reducers: {
    logout: function(state, action){
      state.logOut = action.payload;
      state.data = {};
      state.message = null;
      state.action = false;
      state.status = null;
    },
    rateLimitterStatus: (state) => {
      state.status = "Error";
      state.message = "Terjadi kesalahan pada server.";
      state.action = true;
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
        state.status = payload.status || null;
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
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (!payload.auth.message) {
          state.data = payload.auth; 
        } 
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload.auth;
        state.status = payload?.status || "Error";
        state.message = payload?.message || "Terjadi kesalahan pada server.";
        state.action = true;
      })  
  },
});

export const { logout, rateLimitterStatus } = loginSlice.actions;
export default loginSlice.reducer;

