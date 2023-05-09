import { createSlice } from '@reduxjs/toolkit'
import { IMenuState } from '../../models/redux'

const initialState: IMenuState = {
  open: false,
  refresh: false,
  pathName: '',
}

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    openReducer(state, action) {
      state.open = action.payload
    },
    refreshReducer(state, action) {
      state.refresh = action.payload
    },
    pathNameReducer(state, action) {
      state.pathName = action.payload
    },
  },
})

export const { openReducer, refreshReducer, pathNameReducer } =
  menuSlice.actions

export default menuSlice.reducer
