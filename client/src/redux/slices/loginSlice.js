import { createSlice } from '@reduxjs/toolkit';
import { fetchData, postData } from '../thunks/loginApiThunks';

const loginSlice = createSlice({
  name: 'loginData',
  initialState: {
    data: {},
    user: null,
    loading: false,
    status: null,
    message: null,
    action: false,
    logOut: false
  },
  reducers: {
    logout: function(state, action){
      state.logOut = action.payload;
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
        state.status = payload.status;
        state.message = payload.message;
        state.action = true;
      })  

      .addCase(fetchData.pending, (state) => {
        state.action = false;
        state.loading = true;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (!payload.message) {
          state.data = payload.auth; // Update state.data directly from payload.auth
        } else {
          state.message = payload.message;
        }
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.status = payload.status;
        state.message = payload.message;
      })  
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;

