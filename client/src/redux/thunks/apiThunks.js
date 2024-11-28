import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchData = createAsyncThunk(
  'apiData/fectData',
  async ({ endpoint }, { rejectWithValue }) => {
    try {
      axios.defaults.withCredentials = true;
      const url = `http://localhost:3000/${endpoint}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const postData = createAsyncThunk(
  'apiData/postData',
  async ({ endpoint, data, contentType }, { rejectWithValue }) => {
    try {
      axios.defaults.withCredentials = true;
      const url = `http://localhost:3000/${endpoint}`;
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': !contentType ? 'application/json' : contentType,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const patchData = createAsyncThunk(
  'apiData/patchData',
  async ({ endpoint, data, contentType }, { rejectWithValue }) => {
    try {
      axios.defaults.withCredentials = true;
      const url = `http://localhost:3000/${endpoint}`;
      const response = await axios.patch(url, data, {
        headers: {
          'Content-Type': !contentType ? 'application/json' : contentType,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const updateData = createAsyncThunk(
  'apiData/updateData',
  async ({ endpoint, data, contentType }, { rejectWithValue }) => {
    try {
      axios.defaults.withCredentials = true;
      const url = `http://localhost:3000/${endpoint}`;
      const response = await axios.put(url, data, {
        headers: {
          'Content-Type': !contentType ? 'application/json' : contentType,
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const deleteData = createAsyncThunk(
  'apiData/deleteData',
  async ({ endpoint }, { rejectWithValue }) => {
    try {
      const url = `http://localhost:3000/${endpoint}`;
      const response = await axios.delete(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const fetchKonversiData = createAsyncThunk(
  'konversi/fetchKonversiData',
  async ({ endpoint }, { rejectWithValue }) => {
    try {
      axios.defaults.withCredentials = true;
      const url = `http://localhost:3000/${endpoint}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const postKonversiData = createAsyncThunk(
  'konversi/postKonversiData',
  async ({ endpoint, data, contentType }, { rejectWithValue }) => {
    try {
      axios.defaults.withCredentials = true;
      const url = `http://localhost:3000/${endpoint}`;
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': !contentType ? 'application/json' : contentType,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const deleteKonversiData = createAsyncThunk(
  'konversi/deleteKonversiData',
  async ({ endpoint }, { rejectWithValue }) => {
    try {
      const url = `http://localhost:3000/${endpoint}`;
      const response = await axios.delete(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);
export const updateKonversiData = createAsyncThunk(
  'konversi/updateKonversiData',
  async ({ endpoint, data, contentType }, { rejectWithValue }) => {
    try {
      axios.defaults.withCredentials = true;
      const url = `http://localhost:3000/${endpoint}`;
      const response = await axios.put(url, data, {
        headers: {
          'Content-Type': !contentType ? 'application/json' : contentType,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);
