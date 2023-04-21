import { createSlice } from '@reduxjs/toolkit'
import { IUsersState } from '../../models/redux'

const initialState: IUsersState = {
  user: {},
  userId: 0,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    userReducer(state, action) {
      state.user = action.payload
    },
    userIdReducer(state, action) {
      state.userId = action.payload
    },
  },
})

export const { userIdReducer, userReducer } = usersSlice.actions

export default usersSlice.reducer
