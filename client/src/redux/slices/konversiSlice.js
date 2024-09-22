import { createSlice } from "@reduxjs/toolkit";
import { deleteKonversiData, fetchData, fetchKonversiData, postKonversiData } from "../thunks/apiThunks";

const konversiSlice = createSlice({
    name: "konversi",
    initialState: {
        data: [],
        konversiData: [],
        mkData: [],
        loading: false,
        message: null,
        status: null,
    },
    reducers: {
        addKonversi: (state, action) => {
            const findData = state.data.findIndex(item => action.payload.mata_kuliah_tujuan === item.mata_kuliah_tujuan);
            state.data.push(action.payload);
        },
        clearData: (state) => {
            state.data = [];
        },
        updateKonversi: (state, action) => {
            const { index, key, value } = action.payload;
            state.data[index][key] = value;
        },
        deleteKonversi: (state, action) => {
            const index = action.payload.index;
            state.data = state.data.filter.splice(index, 1); // Filter berdasarkan index
            console.log("Deleted data: ", state.data);
        },
        insertMK: (state, action) => {
            const data = action.payload;
            state.mkData = data;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchKonversiData.pending, (state) => {
                state.action = false;
                state.loading = true;
                state.error = null;
                state.status = null;
                state.message = null;
            })
            .addCase(fetchKonversiData.fulfilled, (state, action) => {
                const data = action.payload.data;
                state.konversiData = data;
                state.loading = false;
            })
            .addCase(fetchKonversiData.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                state.status = action.payload.status;
            })

            // post konversi
            .addCase(postKonversiData.pending, (state) => {
                state.action = false;
                state.loading = true;
                state.error = null;
                state.status = null;
                state.message = null;
            })
            .addCase(postKonversiData.fulfilled, (state, action) => {
                const data = action.payload.data;
                state.konversiData = data;
                state.loading = false;
                state.action = true;
                if (action.payload.status) {
                    state.status = action.payload.status;
                    state.message = action.payload.message;
                    return;
                }
            })
            .addCase(postKonversiData.rejected, (state, action) => {
                state.loading = false;
                state.action = true;
                state.message = action.payload.message;
                state.status = action.payload.status;
            })

            // delete konversi
            .addCase(deleteKonversiData.pending, (state) => {
                state.action = false;
                state.loading = true;
                state.error = null;
                state.status = null;
                state.message = null;
            })
            .addCase(deleteKonversiData.fulfilled, (state, action) => {
                const data = action.payload.data;
                state.konversiData = data;
                state.action = true;
                state.loading = false;
                if (action.payload.status) {
                    state.status = action.payload.status;
                    state.message = action.payload.message;
                    return;
                }
            })
            .addCase(deleteKonversiData.rejected, (state, action) => {
                state.loading = false;
                state.action = true;
                state.message = action.payload.message;
                state.status = action.payload.status;
            })

    }
});

export const { addKonversi, clearData, updateKonversi, deleteKonversi, insertMK } = konversiSlice.actions;
export default konversiSlice.reducer;