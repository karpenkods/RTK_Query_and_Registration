import { createSlice } from '@reduxjs/toolkit'
import { IPostsState } from '../../models/redux'

const initialState: IPostsState = {
  postId: '',
  limit: 12,
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postIdReducer(state, action) {
      state.postId = action.payload
    },
    limitReducer(state, action) {
      state.limit = action.payload
    },
  },
})

export const { postIdReducer, limitReducer } = postsSlice.actions

export default postsSlice.reducer
