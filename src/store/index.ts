import { configureStore } from '@reduxjs/toolkit';
import jobReducer from './job.slice';
import userReducer from './user.slice';
import bookingReducer from './booking.slice';

export const store = configureStore({
  reducer: {
    jobs: jobReducer,
    user: userReducer,
    bookings: bookingReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Date objects in actions/state (we use JS Date in models)
        ignoredActionPaths: ['payload.createdAt', 'payload.updatedAt', 'payload.expiresAt'],
        ignoredPaths: ['jobs.jobs', 'bookings.bookings'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
