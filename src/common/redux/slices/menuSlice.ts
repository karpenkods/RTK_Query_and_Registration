import { createSlice } from '@reduxjs/toolkit'
import { IMenuState } from '../../models/redux'

const initialState: IMenuState = {
  open: false,
}

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    openReducer(state, action) {
      state.open = action.payload
    },
  },
})

export const { openReducer } = menuSlice.actions

export default menuSlice.reducer
