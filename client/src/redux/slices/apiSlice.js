import { createSlice } from '@reduxjs/toolkit';
import { postData, fetchData, deleteData, updateData, patchData } from '../thunks/apiThunks';

const apiSlice = createSlice({
  name: 'apiData',
  initialState: {
    data: [],
    loading: false,
    error: null,
    message: '',
    status: '',
    action: false
  },
  reducers: {
    addData: (state, action) => {
      const newData = action.payload;
      state.data = newData;
    }
  },
  extraReducers: (builder) => {
    // Handle GET request
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = null;
        state.message = null;
        state.data = [];
        state.action = false;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload.data ;
        state.data = {};
        console.log(data);
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Terjadi kesalahan pada server.";
        state.status = action.payload.status || "Error";
        state.action = true;
        state.data = [];
      })

      // Handle POST request
      .addCase(postData.pending, (state) => {
        state.action = false;
        state.loading = true;
        state.error = null;
        state.message = null;
        state.data = [];
      })
      .addCase(postData.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload.data;

        if (!action.payload.search) {
          state.action = true;
          state.message = action.payload.message;
          state.status = action.payload.status;
        }
        state.data = data;
      })
      .addCase(postData.rejected, (state, action) => {
        state.action = true;
        state.loading = false;
        state.message = action.payload.message || "Terjadi kesalahan pada server.";
        state.status = action.payload.status || "Error";
        state.error = true;
        const data = action.payload.data || [];
        state.data = data;
      })

      // Handle PUT request
      .addCase(updateData.pending, (state) => {
        state.data = [];
        state.action = false;
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateData.fulfilled, (state, action) => {
        state.action = true;
        state.loading = false;
        state.message = action.payload.message 
        state.status = action.payload.status 
        const data = action.payload.data;
        console.log(data);
        state.data = data;
      })
      .addCase(updateData.rejected, (state, action) => {
        state.action = true;
        state.loading = false;
        state.message = action.payload.message || "Terjadi kesalahan pada server.";
        state.status = action.payload.status || "Error";
        state.error = true;
        const data = action.payload.data || [];
        state.data = data;
      })

      // Handle patch request
      .addCase(patchData.pending, (state) => {
        state.data = [];
        state.action = false;
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(patchData.fulfilled, (state, action) => {
        state.action = true;
        state.loading = false;
        state.message = action.payload.message;
        state.status = action.payload.status;
        const data = action.payload.data;
        state.data = data;
      })
      .addCase(patchData.rejected, (state, action) => {
        state.action = true;
        state.loading = false;
        state.message = action.payload.message || "Terjadi kesalahan pada server.";
        state.status = action.payload.status || "Error";
        state.error = true;
        const data = action.payload.data || [];
        state.data = data;
      })

      // Handle DELETE request
      .addCase(deleteData.pending, (state) => {
        state.action = false;
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        state.action = true;
        state.loading = false;
        state.message = action.payload.message;
        state.status = action.payload.status;
        const data = action.payload.data;
        state.data = data;
      })
      .addCase(deleteData.rejected, (state, action) => {
        state.action = true;
        state.loading = false;
        state.message = action.payload.message || "Terjadi kesalahan pada server.";
        state.status = action.payload.status || "Error";
        state.error = true;
        const data = action.payload.data || [];
        state.data = data;
      });
  },
});

export const { orderBy, addData } = apiSlice.actions;
export default apiSlice.reducer;

