import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { postsApi } from './api/postsApi'
import { usersApi } from './api/usersApi'
import postsReducer from './slices/postsSlice'
import usersReducer from './slices/usersSlice'
import snackbarReducer from './slices/snackbarSlice'
import menuReducer from './slices/menuSlice'

const rootReducer = combineReducers({
  [postsApi.reducerPath]: postsApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  posts: postsReducer,
  users: usersReducer,
  snackbar: snackbarReducer,
  menu: menuReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(postsApi.middleware, usersApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
