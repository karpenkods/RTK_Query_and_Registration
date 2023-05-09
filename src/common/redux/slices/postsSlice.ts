import { createSlice } from '@reduxjs/toolkit'
import { IPostsState } from '../../models/redux'

const initialState: IPostsState = {
  post: {},
  createPost: false,
  deletePost: false,
  postId: 0,
  limit: 12,
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postReducer(state, action) {
      state.post = action.payload
    },
    createPostReducer(state, action) {
      state.createPost = action.payload
    },
    deletePostReducer(state, action) {
      state.deletePost = action.payload
    },
    postIdReducer(state, action) {
      state.postId = action.payload
    },
    limitReducer(state, action) {
      state.limit = action.payload
    },
  },
})

export const {
  postReducer,
  createPostReducer,
  deletePostReducer,
  postIdReducer,
  limitReducer,
} = postsSlice.actions

export default postsSlice.reducer
