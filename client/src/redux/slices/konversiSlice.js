import { createSlice } from "@reduxjs/toolkit";

const konversiSlice = createSlice({
    name: "konversi",
    initialState: {
        data: []
    },
    reducers: {
        addKonversi: (state, action) => {
            const findData = state.data.findIndex(item => action.payload.mata_kuliah_tujuan === item.mata_kuliah_tujuan);
            if (findData !== -1) {
                state.data[findData] = action.payload;
                return;
            }
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
            const { index } = action.payload;
            state.data.splice(index, 1);
            console.log(state.data);
            console.log("Deleted data: ", action.payload);
        }
    }
});

export const { addKonversi, clearData, updateKonversi, deleteKonversi } = konversiSlice.actions;
export default konversiSlice.reducer;