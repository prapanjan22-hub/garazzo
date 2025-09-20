import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import reducers
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import vehicleReducer from './slices/vehicleSlice';
import bookingReducer from './slices/bookingSlice';
import mechanicReducer from './slices/mechanicSlice';
import garageReducer from './slices/garageSlice';
import emergencyReducer from './slices/emergencySlice';
import communityReducer from './slices/communitySlice';
import notificationReducer from './slices/notificationSlice';
import locationReducer from './slices/locationSlice';

// Persist config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'user', 'vehicles', 'location'], // Only persist these reducers
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  vehicles: vehicleReducer,
  bookings: bookingReducer,
  mechanics: mechanicReducer,
  garages: garageReducer,
  emergency: emergencyReducer,
  community: communityReducer,
  notifications: notificationReducer,
  location: locationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: __DEV__,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
