import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserType } from '../models/user.model';

export interface UserState {
  user: User | null;
  userType: UserType | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  userType: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async Thunks

export const signInWithPhone = createAsyncThunk(
  'user/signInWithPhone',
  async ({ phone, otp }: { phone: string; otp: string }, { rejectWithValue }) => {
    try {
      // TODO: Call Firebase Auth phone sign-in with OTP
      // TODO: Return User object after successful sign-in
      throw new Error('signInWithPhone not implemented');
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const loadUserProfile = createAsyncThunk(
  'user/loadUserProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      // TODO: Call userProfileLoader skill
      throw new Error('loadUserProfile not implemented');
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const signOut = createAsyncThunk('user/signOut', async (_, { rejectWithValue }) => {
  try {
    // TODO: Call Firebase Auth signOut
    // TODO: Clear local session data
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

// Slice

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.userType = action.payload.userType;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.user = null;
      state.userType = null;
      state.isAuthenticated = false;
    },
    updateFcmToken(state, action: PayloadAction<string>) {
      if (state.user) {
        state.user.fcmToken = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signInWithPhone.pending, state => { state.loading = true; state.error = null; })
      .addCase(signInWithPhone.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload as User;
          state.userType = (action.payload as User).userType;
          state.isAuthenticated = true;
        }
      })
      .addCase(signInWithPhone.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(loadUserProfile.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload as User;
        }
      })
      .addCase(signOut.fulfilled, state => {
        state.user = null;
        state.userType = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, clearUser, updateFcmToken } = userSlice.actions;
export default userSlice.reducer;
