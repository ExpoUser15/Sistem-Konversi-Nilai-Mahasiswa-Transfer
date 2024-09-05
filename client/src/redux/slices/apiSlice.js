import { createSlice } from '@reduxjs/toolkit';
import { postData, fetchData, deleteData, updateData, patchData } from '../thunks/apiThunks';

const apiSlice = createSlice({
  name: 'apiData',
  initialState: {
    data: [],
    loading: false,
    error: null,
    message: null,
    status: null,
    action: false
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handle GET request
    builder
      .addCase(fetchData.pending, (state) => {
        state.action = false;
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        const data = action.payload.mahasiswaData;
        state.loading = false;
        state.data = data.length > 0 ? data[0] : [[]];
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.error = true;
      })

      // Handle POST request
      .addCase(postData.pending, (state) => {
        state.action = false;
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(postData.fulfilled, (state, action) => {
        state.action = true;
        state.loading = false;
        state.message = action.payload.message;
        state.status = action.payload.status;
        const data = action.payload.mahasiswaData;
        state.data = data?.length > 0 ? data[0] : [[]];
      })
      .addCase(postData.rejected, (state, action) => {
        state.action = true;
        state.loading = false;
        state.message = action.payload.message;
        state.status = action.payload.status;
        state.error = true;
      })

      // Handle PUT request
      .addCase(updateData.pending, (state) => {
        state.action = false;
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateData.fulfilled, (state, action) => {
        state.action = true;
        state.loading = false;
        state.message = action.payload.message;
        state.status = action.payload.status;
        const data = action.payload.mahasiswaData;
        state.data = data?.length > 0 ? data[0] : [[]];
      })
      .addCase(updateData.rejected, (state, action) => {
        state.action = true;
        state.loading = false;
        state.message = action.payload.message;
        state.status = action.payload.status;
        state.error = true;
      })

      // Handle patch request
      .addCase(patchData.pending, (state) => {
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
        const data = action.payload.mahasiswaData;
        state.data = data?.length > 0 ? data[0] : [[]];
      })
      .addCase(patchData.rejected, (state, action) => {
        state.action = true;
        state.loading = false;
        state.message = action.payload.message;
        state.status = action.payload.status;
        state.error = true;
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
        const data = action.payload.mahasiswaData;
        state.data = data.length > 0 ? data[0] : [[]];
      })
      .addCase(deleteData.rejected, (state, action) => {
        state.action = true;
        state.loading = false;
        state.message = action.payload.message;
        state.status = action.payload.status;
        state.error = true;
      });
  },
});

export default apiSlice.reducer;

