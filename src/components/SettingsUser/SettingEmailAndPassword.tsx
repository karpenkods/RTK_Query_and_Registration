import { FC, useState, MouseEvent } from 'react'
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  sendEmailVerification,
  updateEmail,
  updatePassword,
} from 'firebase/auth'
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
  closeFunction,
  pushDangerNotification,
  pushSuccessNotification,
  settingsEmailSchema,
  settingsPasswordSchema,
  useAppDispatch,
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
  const dispatch = useAppDispatch()

  const formikEmail = useFormik({
    initialValues: {
      email: '',
      oldPassword: '',
    },
    validationSchema: settingsEmailSchema,
    onSubmit: async () => {
      handleChangeEmail()
    },
  })

  const formikPassword = useFormik({
    initialValues: {
      oldPassword: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: settingsPasswordSchema,
    onSubmit: async () => {
      handleChangePassword()
    },
  })

  const handleChangeEmail = () => {
    if (user && user.email) {
      reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(
          user.email,
          formikPassword.values.oldPassword,
        ),
      )
        .then(() => {
          updateEmail(user, formikEmail.values.email)
            .then(() => {
              dispatch(pushSuccessNotification('Email изменён'))
              sendEmailVerification(user)
              location.reload()
            })
            .catch(() => {
              dispatch(pushDangerNotification('Ошибка, попробуйте позднее'))
            })
        })
        .catch(() => {
          dispatch(pushDangerNotification('Текущий пароль введён неверно'))
        })
    }
  }

  const handleChangePassword = () => {
    if (user && user.email) {
      reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(
          user.email,
          formikPassword.values.oldPassword,
        ),
      )
        .then(() => {
          updatePassword(user, formikPassword.values.password)
            .then(() => {
              dispatch(pushSuccessNotification('Пароль изменён'))
              setShowPasswordInput(false)
              setShowPassword(false)
              formikPassword.resetForm()
            })
            .catch(() => {
              dispatch(pushDangerNotification('Ошибка, попробуйте позднее'))
            })
        })
        .catch(() => {
          dispatch(pushDangerNotification('Текущий пароль введён неверно'))
        })
    }
  }

  const handleClickShowPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setShowPassword((show) => !show)
  }

  return (
    <Stack direction="column" alignItems="center">
      <Typography
        sx={{
          alignSelf: 'flex-start',
          margin: '15px 0 5px 10px',
          textDecoration: 'underline',
          fontSize: '18px',
          color: 'green',
        }}
      >
        Текущий Email:
      </Typography>
      <Typography variant="h6" sx={{ marginBottom: '30px' }}>
        {user?.email}
      </Typography>
      <Stack
        direction="column"
        alignItems="flex-end"
        gap="30px"
        sx={{ width: '100%' }}
      >
        {!showInput && (
          <CostumButton
            onClick={() => setShowInput(true)}
            variant="contained"
            color="primary"
            disabled={showPasswordInput || close}
            startIcon={<CreateIcon sx={{ color: 'white' }} />}
          >
            Изменить Email
          </CostumButton>
        )}
        {!showInput && (
          <div
            style={{
              borderTop: '1px solid rgba(0, 0, 0, 0.13)',
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
            disabled={close}
          >
            Изменить пароль
          </CostumButton>
        )}
      </Stack>
      {showInput && (
        <Stack direction="column" gap={'20px'} sx={{ width: '100%' }}>
          <TextField
            name="email"
            size="medium"
            fullWidth
            label="Введите новый Email"
            value={formikEmail.values.email}
            onChange={formikEmail.handleChange}
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
            label="Введите текущий пароль"
            name="oldPassword"
            size="medium"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={formikEmail.values.oldPassword}
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
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ width: '100%' }}
          >
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
              Отмена
            </CostumButton>
            <CostumButton
              onClick={() => formikEmail.handleSubmit()}
              variant="contained"
              color="primary"
              disabled={formikEmail.isSubmitting || !formikEmail.dirty}
            >
              Сохранить
            </CostumButton>
          </Stack>
        </Stack>
      )}
      {showPasswordInput && (
        <Stack
          direction="column"
          gap={'15px'}
          sx={{ width: '100%', marginTop: '30px' }}
        >
          <TextField
            label="Введите текущий пароль"
            name="oldPassword"
            size="medium"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={formikPassword.values.oldPassword}
            onChange={formikPassword.handleChange}
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
            label="Введите новый пароль"
            name="password"
            size="medium"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={formikPassword.values.password}
            onChange={formikPassword.handleChange}
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
            label="Повторите пароль"
            name="confirmPassword"
            size="medium"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={formikPassword.values.confirmPassword}
            onChange={formikPassword.handleChange}
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
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ width: '100%' }}
          >
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
              Отмена
            </CostumButton>
            <CostumButton
              onClick={() => {
                formikPassword.handleSubmit()
              }}
              variant="contained"
              color="primary"
              disabled={formikPassword.isSubmitting || !formikPassword.dirty}
            >
              Сохранить
            </CostumButton>
          </Stack>
        </Stack>
      )}
      {close && (
        <Typography variant="h6" color="primary" sx={{ marginTop: '50px' }}>
          При авторизации через Google или GitHub изменить Email или пароль
          нельзя.
        </Typography>
      )}
    </Stack>
  )
}
