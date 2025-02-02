import { createSlice } from '@reduxjs/toolkit';
import { fetchData } from '../thunks/loginApiThunks';

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
    logout: function (state, action) {
      state.logOut = action.payload;
      state.data = {};
      state.message = null;
      state.action = false;
      state.status = null;
    },
    addLoginData: (state, action) => {
      const payload = action.payload;
      state.data = payload;
    },
    rateLimitterStatus: (state) => {
      state.status = "Error";
      state.message = "Terjadi kesalahan pada server.";
      state.action = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.action = false;
        state.loading = true;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.data = payload.auth;
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

export const { logout, rateLimitterStatus, addLoginData } = loginSlice.actions;
export default loginSlice.reducer;

