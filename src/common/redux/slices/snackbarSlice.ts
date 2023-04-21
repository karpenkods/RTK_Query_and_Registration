import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'

import { ISnackbar } from '../../models'

const initialState: ISnackbar[] = []

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    pushSnackbar: (state, action: PayloadAction<ISnackbar>) => {
      state.push(action.payload)
    },

    removeSnackbar: (state, action: PayloadAction<string | number>) => {
      return state.filter(({ id }) => id !== action.payload)
    },
  },
})

export const pushDangerNotification = (
  message: string,
  isDismissed?: boolean,
) =>
  pushSnackbar({
    id: nanoid(),
    kind: 'error',
    message,
    isDismissed,
  })
export const pushWarningNotification = (
  message: string,
  isDismissed?: boolean,
) =>
  pushSnackbar({
    id: nanoid(),
    kind: 'warning',
    message,
    isDismissed,
  })
export const pushSuccessNotification = (
  message: string,
  isDismissed?: boolean,
) =>
  pushSnackbar({
    id: nanoid(),
    kind: 'success',
    message,
    isDismissed,
  })
export const pushInfoNotification = (message: string, isDismissed?: boolean) =>
  pushSnackbar({
    id: nanoid(),
    kind: 'info',
    message,
    isDismissed,
  })

export const { pushSnackbar, removeSnackbar } = snackbarSlice.actions

export default snackbarSlice.reducer
