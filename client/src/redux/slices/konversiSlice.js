import { createSlice } from "@reduxjs/toolkit";
import { deleteKonversiData, fetchKonversiData, postKonversiData, updateKonversiData } from "../thunks/apiThunks";

const konversiSlice = createSlice({
    name: "konversi",
    initialState: {
        data: [],
        filteredMk: [],
        konversiData: [],
        spesifikFilteredData: [],
        mkData: [],
        loading: false,
        message: null,
        status: null,
    },
    reducers: {
        addKonversi: (state, action) => {
            state.data.push(action.payload);
        },
        deleteKonversi: (state, action) => {
            const index = action.payload.index;
            state.data.splice(index, 1);
            const arr = [];
            state.data.forEach(item => {
                const regex = /\(([^)]+)\)/g;
                const matches = item.dataTujuan.match(regex);
                const mk = matches ? matches.map(match => match.slice(1, -1)) : [];
                arr.push(mk[0]);
            });
            const filteredArray = state.mkData.filter(item1 =>
                !arr.some(item2 => item2 === item1.mata_kuliah)
            );
            state.filteredMk = filteredArray;
        },
        insertMK: (state, action) => {
            const data = action.payload;
            state.mkData = data;
        },
        emptyData: (state, action) => {
            state.data = [];
        },
        emptyFilteredData: (state, action) => {
            state.filteredMk = [];
        },
        filteredKonversi: (state, action) => {
            state.filteredMk = action.payload;
        },
        insertData: (state, action) => {
            state.konversiData = action.payload;
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
                state.filteredData = data;
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
                state.loading = false;
                state.action = true;
                const { status, message, data } = action.payload;
                if (status) {
                    state.status = status;
                    state.message = message;
                }
                if (data) {
                    state.konversiData = data;
                }
            })
            .addCase(deleteKonversiData.rejected, (state, action) => {
                state.loading = false;
                state.action = true;
                state.message = action.payload.message;
                state.status = action.payload.status;
            })

            // Update konversi
            .addCase(updateKonversiData.pending, (state, action) => {
                state.action = false;
                state.loading = true;
                state.error = null;
                state.status = null;
                state.message = null;
            })
            .addCase(updateKonversiData.fulfilled, (state, action) => {
                state.loading = false;
                state.action = true;
                const { status, message, data } = action.payload;
                if (status) {
                    state.status = status;
                    state.message = message;
                }
                if (data) {
                    state.konversiData = data;
                }
            })
            .addCase(updateKonversiData.rejected, (state, action) => {
                state.loading = false;
                state.action = true;
                state.message = action.payload.message;
                state.status = action.payload.status;
            })

    }
});

export const { addKonversi, deleteKonversi, insertMK, emptyData, emptyFilteredData, filteredKonversi, insertData } = konversiSlice.actions;
export default konversiSlice.reducer;