import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  gigs: [],
  gig: null, 
  loading: false,
  error: null,
};


export const fetchGigs = createAsyncThunk(
  'gigs/fetchAll',
  async (keyword = '', { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/gigs?search=${keyword}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const createGig = createAsyncThunk(
  'gigs/create',
  async (gigData, { rejectWithValue }) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/gigs', gigData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const fetchGigById = createAsyncThunk(
  'gigs/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/gigs/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const gigSlice = createSlice({
  name: 'gigs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchGigs.pending, (state) => { state.loading = true; })
      .addCase(fetchGigs.fulfilled, (state, action) => {
        state.loading = false;
        state.gigs = action.payload;
      })
      .addCase(fetchGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(createGig.fulfilled, (state, action) => {
        state.gigs.unshift(action.payload);
      })
      
      .addCase(fetchGigById.pending, (state) => {
        state.loading = true;
        state.gig = null; 
      })
      .addCase(fetchGigById.fulfilled, (state, action) => {
        state.loading = false;
        state.gig = action.payload;
      })
      .addCase(fetchGigById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default gigSlice.reducer;