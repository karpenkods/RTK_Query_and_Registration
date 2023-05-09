import { createSlice } from '@reduxjs/toolkit'
import { ILikeState } from '../../models/redux'

const initialState: ILikeState = {
  like: [],
}

const likeSlice = createSlice({
  name: 'like',
  initialState,
  reducers: {
    likeReducer(state, action) {
      state.like.includes(action.payload)
        ? state.like
        : state.like.push(action.payload)
    },
    disLikeReducer(state, action) {
      state.like = state.like.filter((el) => el !== action.payload)
    },
  },
})

export const { likeReducer, disLikeReducer } = likeSlice.actions

export default likeSlice.reducer
