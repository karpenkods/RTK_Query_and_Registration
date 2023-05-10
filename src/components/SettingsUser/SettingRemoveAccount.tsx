import { FC, useState, MouseEvent, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  EmailAuthProvider,
  deleteUser,
  getAuth,
  reauthenticateWithCredential,
} from 'firebase/auth'
import { useFormik } from 'formik'

import {
  Typography,
  Stack,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

import {
  CostumButton,
  closeFunction,
  pushDangerNotification,
  pushSuccessNotification,
  refreshReducer,
  settingsRemoveSchema,
  useAppDispatch,
  useAppSelector,
  useFocus,
} from '../../common'

export const SettingRemoveAccount: FC = () => {
  const [showInput, setShowInput] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const user = getAuth().currentUser
  const close = closeFunction(user)
  const focus = useFocus(showInput)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const refresh = useAppSelector((store) => store.menu.refresh)

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
    },
    validationSchema: settingsRemoveSchema(t),
    onSubmit: async () => {
      handleRemoveAccaunt()
    },
  })

  const handleRemoveAccaunt = () => {
    if (user && user.email) {
      reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(user.email, formik.values.oldPassword),
      )
        .then(() => {
          deleteUser(user)
            .then(() => {
              dispatch(pushSuccessNotification(`${t('accountDeleted')}`))
              dispatch(refreshReducer(false))
              navigate('/')
            })
            .catch(() => {
              dispatch(pushDangerNotification(`${t('errorTryLater')}`))
            })
        })
        .catch(() => {
          dispatch(pushDangerNotification(`${t('passwordIsIncorrect')}`))
        })
    }
  }

  const handleClickShowPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setShowPassword((show) => !show)
  }

  useEffect(() => {
    if (refresh === false) {
      setShowInput(false)
      setShowPassword(false)
      formik.resetForm()
    }
  }, [formik, refresh])

  return (
    <Stack direction="column" alignItems="center">
      <Typography variant="h5" color="primary" margin="15px 0">
        {t('accountDeleting')}
      </Typography>
      <Typography variant="body1" color="error">
        {t('logInUsingPassword')}
      </Typography>
      <Typography variant="body2" mb="30px">
        {t('accountRecovered')}
      </Typography>
      <Typography variant="body1" color="error" mb="30px">
        {t('cannotDeleteAccounts')}
      </Typography>

      {!showInput && (
        <CostumButton
          onClick={() => setShowInput(true)}
          variant="contained"
          color="error"
          startIcon={<PersonRemoveIcon sx={{ color: 'white' }} />}
          disabled={close}
        >
          {t('deleteAccount')}
        </CostumButton>
      )}
      {showInput && (
        <Stack direction="column" gap={'30px'} width="100%">
          <TextField
            label={t('currentPassword')}
            name="oldPassword"
            size="medium"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={formik.values.oldPassword}
            disabled={formik.isSubmitting}
            inputRef={focus}
            onChange={formik.handleChange}
            error={
              Boolean(formik.errors.oldPassword) && formik.touched.oldPassword
            }
            helperText={
              formik.errors.oldPassword && formik.touched.oldPassword
                ? formik.errors.oldPassword
                : ' '
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Stack direction="row" justifyContent="space-between" width="100%">
            <CostumButton
              onClick={() => {
                setShowInput(false), setShowPassword(false)
                formik.resetForm()
              }}
              variant="contained"
              disabled={formik.isSubmitting}
              color="error"
            >
              {t('cancel')}
            </CostumButton>
            <CostumButton
              onClick={() => formik.handleSubmit()}
              variant="contained"
              color="primary"
              disabled={formik.isSubmitting || !formik.dirty}
            >
              {t('remove')}
            </CostumButton>
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}
