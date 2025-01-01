import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const postData = createAsyncThunk(
    'loginData/postData',
    async ({ endpoint, data }, { rejectWithValue }) => {
        try {
            axios.defaults.withCredentials = true;
            const url = `${import.meta.env.VITE_API_URL}${endpoint}`;
            const response = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

export const fetchData = createAsyncThunk(
    'loginData/fetchData',
    async ({ endpoint }, { rejectWithValue }) => {
        try {
            axios.defaults.withCredentials = true;
            const url = `${import.meta.env.VITE_API_URL}${endpoint}`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);