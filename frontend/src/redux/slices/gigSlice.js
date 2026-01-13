import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

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
      const { data } = await api.get(`/gigs?search=${keyword}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const createGig = createAsyncThunk(
  'gigs/create',
  async (gigData, { rejectWithValue }) => {
    try {
      // ✅ FIX: Ensure budget is a number, not a string
      const cleanData = {
        ...gigData,
        budget: Number(gigData.budget)
      };

      const { data } = await api.post('/gigs', cleanData);
      return data;
    } catch (error) {
      // This will print the exact reason the server rejected it
      console.error("Create Gig Failed:", error.response?.data);
      
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const fetchGigById = createAsyncThunk(
  'gigs/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/gigs/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const gigSlice = createSlice({
  name: 'gigs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGigs.pending, (state) => {
        state.loading = true;
      })
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
