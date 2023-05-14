import { FC, useState, MouseEvent, useEffect } from 'react'
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  sendEmailVerification,
  updateEmail,
  updatePassword,
} from 'firebase/auth'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'

import {
  Typography,
  Stack,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material'
import CreateIcon from '@mui/icons-material/Create'
import KeyIcon from '@mui/icons-material/Key'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

import {
  CostumButton,
  IChangeEmailValues,
  IChangePasswordValues,
  closeFunction,
  pushDangerNotification,
  pushSuccessNotification,
  refreshReducer,
  settingsEmailSchema,
  settingsPasswordSchema,
  useAppDispatch,
  useAppSelector,
  useFocus,
} from '../../common'

export const SettingEmailAndPassword: FC = () => {
  const [showInput, setShowInput] = useState(false)
  const [showPasswordInput, setShowPasswordInput] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const user = getAuth().currentUser
  const close = closeFunction(user)
  const focusEmail = useFocus(showInput)
  const focusPassword = useFocus(showPasswordInput)
  const darkTheme = useAppSelector((store) => store.theme.theme) === 'dark'
  const refresh = useAppSelector((store) => store.menu.refresh)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const formikEmail = useFormik({
    initialValues: {
      email: '',
      oldPassword: '',
    },
    validationSchema: settingsEmailSchema(t),
    onSubmit: async (values) => {
      handleChangeEmail(values)
    },
  })

  const formikPassword = useFormik({
    initialValues: {
      oldPassword: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: settingsPasswordSchema(t),
    onSubmit: async (values) => {
      handleChangePassword(values)
    },
  })

  const handleChangeEmail = (values: IChangeEmailValues) => {
    if (user && user.email) {
      reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(user.email, values.oldPassword),
      )
        .then(() => {
          updateEmail(user, values.email)
            .then(() => {
              dispatch(pushSuccessNotification(`${t('emailChanged')}`))
              sendEmailVerification(user, {
                handleCodeInApp: true,
                url: 'http://localhost:3000/',
              })
              dispatch(refreshReducer(false))
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

  const handleChangePassword = (values: IChangePasswordValues) => {
    if (user && user.email) {
      reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(user.email, values.oldPassword),
      )
        .then(() => {
          updatePassword(user, values.password)
            .then(() => {
              dispatch(pushSuccessNotification(`${t('passwordChanged')}`))
              setShowPasswordInput(false)
              setShowPassword(false)
              formikPassword.resetForm()
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
      setShowPasswordInput(false)
      setShowPassword(false)
      formikEmail.resetForm()
      formikPassword.resetForm()
    }
  }, [formikEmail, formikPassword, refresh])

  return (
    <Stack direction="column" alignItems="center" width="100%">
      <Typography
        color="primary"
        sx={{
          alignSelf: 'flex-start',
          margin: '15px 0 5px 10px',
          textDecoration: 'underline',
          fontSize: '18px',
        }}
      >
        {t('currentEmail')}
      </Typography>
      <Typography variant="h6" mb="30px">
        {user?.email}
      </Typography>
      <Stack direction="column" alignItems="flex-end" gap="30px" width="100%">
        {!showInput && (
          <CostumButton
            onClick={() => setShowInput(true)}
            variant="contained"
            color="primary"
            disabled={showPasswordInput || close}
            startIcon={<CreateIcon sx={{ color: 'white' }} />}
            sx={{ color: 'white' }}
          >
            {t('changeEmail')}
          </CostumButton>
        )}
        {!showInput && (
          <div
            style={{
              borderTop: darkTheme
                ? '1px solid rgba(255, 255, 255, 0.13)'
                : '1px solid rgba(0, 0, 0, 0.13)',
              width: '100%',
            }}
          />
        )}
        {!showPasswordInput && !showInput && (
          <CostumButton
            onClick={() => setShowPasswordInput(true)}
            variant="contained"
            color="success"
            startIcon={<KeyIcon sx={{ color: 'white' }} />}
            sx={{ color: 'white' }}
            disabled={close}
          >
            {t('changePassword')}
          </CostumButton>
        )}
      </Stack>
      {showInput && (
        <Stack direction="column" gap="20px" width="100%">
          <TextField
            name="email"
            size="medium"
            fullWidth
            label={t('newEmail')}
            value={formikEmail.values.email}
            onChange={formikEmail.handleChange}
            disabled={formikEmail.isSubmitting}
            inputRef={focusEmail}
            onBlur={formikEmail.handleBlur('email')}
            error={
              Boolean(formikEmail.errors.email) && formikEmail.touched.email
            }
            helperText={
              formikEmail.errors.email && formikEmail.touched.email
                ? formikEmail.errors.email
                : ' '
            }
          />
          <TextField
            label={t('currentPassword')}
            name="oldPassword"
            size="medium"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={formikEmail.values.oldPassword}
            disabled={formikEmail.isSubmitting}
            onChange={formikEmail.handleChange}
            error={
              Boolean(formikEmail.errors.oldPassword) &&
              formikEmail.touched.oldPassword
            }
            helperText={
              formikEmail.errors.oldPassword && formikEmail.touched.oldPassword
                ? formikEmail.errors.oldPassword
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
                setShowInput(false),
                  setShowPassword(false),
                  formikEmail.resetForm()
              }}
              variant="contained"
              disabled={formikEmail.isSubmitting}
              color="error"
            >
              {t('cancel')}
            </CostumButton>
            <CostumButton
              onClick={() => formikEmail.handleSubmit()}
              variant="contained"
              color="primary"
              disabled={formikEmail.isSubmitting || !formikEmail.dirty}
            >
              {t('save')}
            </CostumButton>
          </Stack>
        </Stack>
      )}
      {showPasswordInput && (
        <Stack direction="column" gap={'15px'} width="100%" mt="30px">
          <TextField
            label={t('currentPassword')}
            name="oldPassword"
            size="medium"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={formikPassword.values.oldPassword}
            onChange={formikPassword.handleChange}
            disabled={formikPassword.isSubmitting}
            inputRef={focusPassword}
            error={
              Boolean(formikPassword.errors.oldPassword) &&
              formikPassword.touched.oldPassword
            }
            helperText={
              formikPassword.errors.oldPassword &&
              formikPassword.touched.oldPassword
                ? formikPassword.errors.oldPassword
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
          <TextField
            label={t('newPassword')}
            name="password"
            size="medium"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={formikPassword.values.password}
            onChange={formikPassword.handleChange}
            disabled={formikPassword.isSubmitting}
            onBlur={formikPassword.handleBlur('password')}
            error={
              Boolean(formikPassword.errors.password) &&
              formikPassword.touched.password
            }
            helperText={
              formikPassword.errors.password && formikPassword.touched.password
                ? formikPassword.errors.password
                : ' '
            }
          />
          <TextField
            label={t('repeatPassword')}
            name="confirmPassword"
            size="medium"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={formikPassword.values.confirmPassword}
            onChange={formikPassword.handleChange}
            disabled={formikPassword.isSubmitting}
            onBlur={formikPassword.handleBlur('confirmPassword')}
            error={
              Boolean(formikPassword.errors.confirmPassword) &&
              formikPassword.touched.confirmPassword
            }
            helperText={
              formikPassword.errors.confirmPassword &&
              formikPassword.touched.confirmPassword
                ? formikPassword.errors.confirmPassword
                : ' '
            }
          />
          <Stack direction="row" justifyContent="space-between" width="100%">
            <CostumButton
              onClick={() => {
                setShowPasswordInput(false),
                  setShowPassword(false),
                  formikPassword.resetForm()
              }}
              variant="contained"
              disabled={formikPassword.isSubmitting}
              color="error"
            >
              {t('cancel')}
            </CostumButton>
            <CostumButton
              onClick={() => {
                formikPassword.handleSubmit()
              }}
              variant="contained"
              color="primary"
              disabled={formikPassword.isSubmitting || !formikPassword.dirty}
            >
              {t('save')}
            </CostumButton>
          </Stack>
        </Stack>
      )}
      {close && (
        <Typography variant="h6" color="primary" mt="50px">
          {t('passwordForbidden')}
        </Typography>
      )}
    </Stack>
  )
}
