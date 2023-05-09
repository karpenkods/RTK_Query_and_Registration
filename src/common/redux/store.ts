import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { postsApi } from './api/postsApi'
import { usersApi } from './api/usersApi'
import { commentsApi } from './api/commentsApi'
import postsReducer from './slices/postsSlice'
import usersReducer from './slices/usersSlice'
import snackbarReducer from './slices/snackbarSlice'
import menuReducer from './slices/menuSlice'
import themeAppReducer from './slices/themeSlice'
import likeAppReducer from './slices/likeSlice'

const rootReducer = combineReducers({
  [postsApi.reducerPath]: postsApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [commentsApi.reducerPath]: commentsApi.reducer,
  posts: postsReducer,
  users: usersReducer,
  snackbar: snackbarReducer,
  menu: menuReducer,
  theme: themeAppReducer,
  like: likeAppReducer,
})

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [
    postsApi.reducerPath,
    usersApi.reducerPath,
    commentsApi.reducerPath,
  ],
  whitelist: ['theme', 'like'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(postsApi.middleware, usersApi.middleware, commentsApi.middleware),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
