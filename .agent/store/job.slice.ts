import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Job, JobStatus } from '../models/job.model';

export interface JobsState {
  jobs: Job[];
  activeJob: Job | null;
  loading: boolean;
  error: string | null;
}

const initialState: JobsState = {
  jobs: [],
  activeJob: null,
  loading: false,
  error: null,
};

// Async Thunks

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData: Omit<Job, 'jobId' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      // TODO: Call writeJobRecord skill
      // TODO: Return the created Job object
      throw new Error('createJob thunk not implemented');
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async (
    { jobId, updates }: { jobId: string; updates: Partial<Job> },
    { rejectWithValue },
  ) => {
    try {
      // TODO: Call updateJobRecord skill
      throw new Error('updateJob thunk not implemented');
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (userId: string, { rejectWithValue }) => {
    try {
      // TODO: Query Firestore /jobs where userId == userId
      return [] as Job[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchJob = createAsyncThunk(
  'jobs/fetchJob',
  async (jobId: string, { rejectWithValue }) => {
    try {
      // TODO: Fetch single job from Firestore /jobs/{jobId}
      throw new Error('fetchJob thunk not implemented');
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// Slice

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setActiveJob(state, action: PayloadAction<Job | null>) {
      state.activeJob = action.payload;
    },
    updateJobStatusLocal(
      state,
      action: PayloadAction<{ jobId: string; status: JobStatus }>,
    ) {
      const job = state.jobs.find(j => j.jobId === action.payload.jobId);
      if (job) {
        job.status = action.payload.status;
        job.updatedAt = new Date();
      }
      if (state.activeJob?.jobId === action.payload.jobId) {
        state.activeJob.status = action.payload.status;
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchJobs.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchJobs.fulfilled, (state, action) => { state.loading = false; state.jobs = action.payload; })
      .addCase(fetchJobs.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(createJob.fulfilled, (state, action) => { state.jobs.unshift(action.payload); state.activeJob = action.payload; })
      .addCase(fetchJob.fulfilled, (state, action) => { state.activeJob = action.payload; });
  },
});

export const { setActiveJob, updateJobStatusLocal, clearError } = jobSlice.actions;
export default jobSlice.reducer;
