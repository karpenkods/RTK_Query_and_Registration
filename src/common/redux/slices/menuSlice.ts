import { createSlice } from '@reduxjs/toolkit'
import { IMenuState } from '../../models/redux'

const initialState: IMenuState = {
  open: false,
  refresh: false,
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
  },
})

export const { openReducer, refreshReducer } = menuSlice.actions

export default menuSlice.reducer
