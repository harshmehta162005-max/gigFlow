
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  bids: [], 
  loading: false,
  error: null,
  successMessage: null, 
};


export const placeBid = createAsyncThunk(
  'bids/place',
  async ({ gigId, price, message }, { rejectWithValue }) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/bids', { gigId, price, message }, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const fetchBids = createAsyncThunk(
  'bids/fetchByGig',
  async (gigId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/bids/${gigId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const hireFreelancer = createAsyncThunk(
  'bids/hire',
  async (bidId, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`/api/bids/${bidId}/hire`);
      return { bidId, message: data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const bidSlice = createSlice({
  name: 'bids',
  initialState,
  reducers: {
    clearBidMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(placeBid.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(placeBid.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Bid placed successfully!";
      })
      .addCase(placeBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchBids.pending, (state) => { state.loading = true; })
      .addCase(fetchBids.fulfilled, (state, action) => {
        state.loading = false;
        state.bids = action.payload;
      })
      
      .addCase(hireFreelancer.fulfilled, (state, action) => {
        
        const index = state.bids.findIndex(bid => bid._id === action.payload.bidId);
        if(index !== -1) {
            state.bids[index].status = 'hired';
            
            state.bids.forEach((bid, i) => {
                if (i !== index) bid.status = 'rejected';
            });
        }
        state.successMessage = "Freelancer hired successfully!";
      });
  },
});

export const { clearBidMessages } = bidSlice.actions;
export default bidSlice.reducer;