import { createSlice } from '@reduxjs/toolkit'
import { IUserState } from '../../models'

const initialState: IUserState = {
  user: {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
  },
  anonymous: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userReducer(state, action) {
      state.user = action.payload
    },
    userAnonymousReducer(state, action) {
      state.anonymous = action.payload
    },
  },
})

export const { userReducer, userAnonymousReducer } = userSlice.actions

export default userSlice.reducer
