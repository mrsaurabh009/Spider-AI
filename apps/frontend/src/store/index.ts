import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import authSlice from './slices/authSlice';
import projectsSlice from './slices/projectsSlice';
import chatSlice from './slices/chatSlice';
import editorSlice from './slices/editorSlice';
import previewSlice from './slices/previewSlice';
import uiSlice from './slices/uiSlice';


export const store = configureStore({
  reducer: {
    auth: authSlice,
    projects: projectsSlice,
    chat: chatSlice,
    editor: editorSlice,
    preview: previewSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export type AppRootState = ReturnType<typeof store.getState>;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppRootState> = useSelector;

export default store;
