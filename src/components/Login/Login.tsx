import { FC, useState, MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import GoogleIcon from '@mui/icons-material/Google'
import GitHubIcon from '@mui/icons-material/GitHub'

import {
  CostumButton,
  ILoginValues,
  closeFunction,
  loginSchema,
  pushDangerNotification,
  pushInfoNotification,
  pushSuccessNotification,
  refreshReducer,
  useAppDispatch,
  useAutoFocus,
} from '../../common'
import { NewPasswordModal } from '../Modals'

export const Login: FC = () => {
  const [open, setOpen] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [successAuth, setSuccessAuth] = useState(false)
  const [errorAuth, setErrorAuth] = useState(false)
  const [errorGit, setErrortGit] = useState(false)
  const [disabledGit, setDisabledGit] = useState(false)
  const [openNewPassword, setOpenNewPassword] = useState(false)

  const auth = getAuth()
  const close = closeFunction(auth.currentUser)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const focus = useAutoFocus()

  const providerGoogle = new GoogleAuthProvider()
  const providerGitHub = new GithubAuthProvider()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      handleSubmit(values)
    },
  })

  const goodAuth = () => {
    setSuccessAuth(true)
    dispatch(refreshReducer(false))
    setTimeout(() => navigate('/'), 1000)
  }

  const handleSubmitGoogle = () => {
    setDisabledGit(true)
    signInWithPopup(auth, providerGoogle)
      .then(() => {
        goodAuth()
        dispatch(pushInfoNotification('Вы успешно вошли через Google'))
      })
      .catch(() => {
        setErrortGit(true)
        setDisabledGit(false)
        dispatch(pushDangerNotification('Выберите другой способ входа'))
      })
  }

  const handleSubmitGitHub = () => {
    setDisabledGit(true)
    signInWithPopup(auth, providerGitHub)
      .then(() => {
        goodAuth()
        dispatch(pushInfoNotification('Вы успешно вошли через GitHub'))
      })
      .catch(() => {
        setErrortGit(true)
        setDisabledGit(false)
        dispatch(pushDangerNotification('Выберите другой способ входа'))
      })
  }

  const handleSubmit = (values: ILoginValues) => {
    setDisabledGit(true)
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(() => {
        goodAuth()
        dispatch(pushSuccessNotification('Вход выполнен'))
      })
      .catch(() => {
        setDisabledGit(false)
        setErrorAuth(true)
        dispatch(pushDangerNotification('Неверный email или пароль'))
      })
  }

  const handleSubmitAnonymous = () => {
    setDisabledGit(true)
    signInAnonymously(auth)
      .then(() => {
        goodAuth()
        dispatch(pushSuccessNotification('Вы вошли как анонимный пользователь'))
      })
      .catch(() => {
        setDisabledGit(false)
        setErrortGit(true)
        dispatch(pushDangerNotification('Ошибка, проверьте подключение к сети'))
      })
  }

  const handleClose = () => {
    setOpen(false)
    navigate('/')
  }

  const handleClickShowPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setShowPassword((show) => !show)
  }

  return (
    <>
      <Dialog open={open} keepMounted>
        <DialogTitle sx={{ padding: '20px 24px 0 24px', textAlign: 'center' }}>
          {successAuth ? (
            <Typography variant="h6" color="green">
              Вход выполнен
            </Typography>
          ) : errorAuth ? (
            <Typography variant="h6" color="error">
              Неверный email или пароль
            </Typography>
          ) : errorGit ? (
            <Typography variant="h6" color="error">
              Выберите другой способ входа
            </Typography>
          ) : (
            'Авторизация'
          )}
        </DialogTitle>
        <DialogContent
          sx={{
            width: '450px',
            padding: '20px 20px 0 20px',
            '&.MuiDialogContent-root': {
              paddingTop: '20px',
            },
          }}
        >
          <Stack direction="column" gap={'15px'} sx={{ marginBottom: '15px' }}>
            <TextField
              label="Email"
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur('email')}
              disabled={disabledGit || formik.isSubmitting}
              inputRef={focus}
              fullWidth
              size="medium"
              error={Boolean(formik.errors.email) && formik.touched.email}
              helperText={
                formik.errors.email && formik.touched.email
                  ? formik.errors.email
                  : ' '
              }
            />
            <TextField
              label="Пароль"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password}
              onChange={formik.handleChange}
              disabled={disabledGit || formik.isSubmitting}
              fullWidth
              size="medium"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={Boolean(formik.errors.password) && formik.touched.password}
              helperText={
                formik.errors.password && formik.touched.password
                  ? formik.errors.password
                  : ' '
              }
            />
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              marginBottom: '25px',
            }}
          >
            <Typography variant="h6">Войти с помощью:</Typography>
            <IconButton
              onClick={() => {
                handleSubmitGoogle()
              }}
              disabled={disabledGit || formik.isSubmitting}
              color="info"
              style={{ margin: '0 7px 0 10px' }}
            >
              <GoogleIcon style={{ width: '30px', height: '30px' }} />
            </IconButton>
            <IconButton
              onClick={() => {
                handleSubmitGitHub()
              }}
              disabled={disabledGit || formik.isSubmitting}
              color="inherit"
            >
              <GitHubIcon style={{ width: '30px', height: '30px' }} />
            </IconButton>
          </Stack>
          <Tooltip title="Некоторые функции ограничены" placement="right">
            <CostumButton
              variant="contained"
              color="warning"
              sx={{ marginBottom: '20px' }}
              disabled={
                disabledGit ||
                formik.isSubmitting ||
                auth.currentUser?.isAnonymous
              }
              onClick={() => {
                handleSubmitAnonymous()
              }}
            >
              Войти как анонимный пользователь
            </CostumButton>
          </Tooltip>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            '&.MuiDialogActions-root>:not(:first-of-type)': {
              marginLeft: 0,
            },
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              width: '100%',
              marginBottom: '25px',
            }}
          >
            <CostumButton
              onClick={handleClose}
              variant="contained"
              color="error"
              disabled={disabledGit || formik.isSubmitting}
            >
              Отмена
            </CostumButton>
            <CostumButton
              variant="contained"
              color="success"
              disabled={formik.isSubmitting || !formik.dirty || disabledGit}
              onClick={() => formik.handleSubmit()}
            >
              Войти
            </CostumButton>
          </Stack>
          <Stack direction="row" alignItems="center" alignSelf="flex-start">
            <Typography variant="body1">Ещё нет аккаунта?</Typography>
            <CostumButton
              variant="text"
              onClick={() => navigate('/registration')}
              disabled={disabledGit || formik.isSubmitting}
              sx={{ fontSize: '16px' }}
            >
              Регистрация
            </CostumButton>
          </Stack>
          <CostumButton
            variant="text"
            disabled={
              disabledGit ||
              formik.isSubmitting ||
              close ||
              auth.currentUser?.isAnonymous ||
              !auth.currentUser
            }
            sx={{ fontSize: '16px', padding: 0, alignSelf: 'flex-start' }}
            onClick={() => {
              setOpenNewPassword(true), setOpen(false)
            }}
          >
            Забыли пароль?
          </CostumButton>
        </DialogActions>
      </Dialog>
      <NewPasswordModal
        openNewPassword={openNewPassword}
        onOpen={setOpenNewPassword}
        onOpenLoginModal={setOpen}
      />
    </>
  )
}
