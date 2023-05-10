import { createSlice } from '@reduxjs/toolkit'
import { IMenuState } from '../../models/redux'

const initialState: IMenuState = {
  openLogin: false,
  openRegistration: false,
  openNewPassword: false,
  openSettingsUser: false,
  openCropper: false,
  openChangePost: false,
  openRemovePost: false,
  refresh: false,
  pathName: '',
}

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    openLoginReducer(state, action) {
      state.openLogin = action.payload
    },
    openRegistrationReducer(state, action) {
      state.openRegistration = action.payload
    },
    openNewPasswordReducer(state, action) {
      state.openNewPassword = action.payload
    },
    openSettingsUserReducer(state, action) {
      state.openSettingsUser = action.payload
    },
    openCropperReducer(state, action) {
      state.openCropper = action.payload
    },
    openChangePostReducer(state, action) {
      state.openChangePost = action.payload
    },
    openRemovePostReducer(state, action) {
      state.openRemovePost = action.payload
    },
    refreshReducer(state, action) {
      state.refresh = action.payload
    },
    pathNameReducer(state, action) {
      state.pathName = action.payload
    },
  },
})

export const {
  openLoginReducer,
  openRegistrationReducer,
  openNewPasswordReducer,
  openSettingsUserReducer,
  openCropperReducer,
  openRemovePostReducer,
  openChangePostReducer,
  refreshReducer,
  pathNameReducer,
} = menuSlice.actions

export default menuSlice.reducer
