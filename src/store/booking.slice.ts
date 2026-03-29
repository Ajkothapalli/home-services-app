import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Booking, BookingStatus, PaymentStatus } from '../models/booking.model';

export interface BookingsState {
  bookings: Booking[];
  activeBooking: Booking | null;
  loading: boolean;
  error: string | null;
}

const initialState: BookingsState = {
  bookings: [],
  activeBooking: null,
  loading: false,
  error: null,
};

// Async Thunks

export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (userId: string, { rejectWithValue }) => {
    try {
      // TODO: Query Firestore /bookings where userId == userId
      return [] as Booking[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchBooking = createAsyncThunk(
  'bookings/fetchBooking',
  async (bookingId: string, { rejectWithValue }) => {
    try {
      // TODO: Fetch Firestore /bookings/{bookingId}
      throw new Error('fetchBooking not implemented');
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async (
    { bookingId, reason }: { bookingId: string; reason: string },
    { rejectWithValue },
  ) => {
    try {
      // TODO: Call booking-modifier.skill with cancellationReason
      // TODO: Trigger on-booking-cancelled hook
      throw new Error('cancelBooking not implemented');
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// Slice

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setActiveBooking(state, action: PayloadAction<Booking | null>) {
      state.activeBooking = action.payload;
    },
    updatePaymentStatus(
      state,
      action: PayloadAction<{ bookingId: string; paymentStatus: PaymentStatus; paymentId?: string }>,
    ) {
      const booking = state.bookings.find(b => b.bookingId === action.payload.bookingId);
      if (booking) {
        booking.paymentStatus = action.payload.paymentStatus;
        if (action.payload.paymentId) booking.paymentId = action.payload.paymentId;
        booking.updatedAt = new Date();
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBookings.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchBookings.fulfilled, (state, action) => { state.loading = false; state.bookings = action.payload; })
      .addCase(fetchBookings.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchBooking.fulfilled, (state, action) => { state.activeBooking = action.payload; })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const booking = state.bookings.find(b => b.bookingId === (action.payload as any)?.bookingId);
        if (booking) booking.status = BookingStatus.CANCELLED;
      });
  },
});

export const { setActiveBooking, updatePaymentStatus } = bookingSlice.actions;
export default bookingSlice.reducer;
