import { ChangeEvent, FC, useState, MouseEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'

import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import GitHubIcon from '@mui/icons-material/GitHub'

import { useAppDispatch, useEmail } from '../../common/hooks'
import {
  pushDangerNotification,
  pushInfoNotification,
  pushSuccessNotification,
} from '../../common/redux'
import { NewPasswordModal } from '../NewPasswordModal/NewPasswordModal'

export const Login: FC = () => {
  const [open, setOpen] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [inputErrorEmail, setInputErrorEmail] = useState(false)
  const [inputErrorPassword, setInputErrorPassword] = useState(false)
  const [successAuth, setSuccessAuth] = useState(false)
  const [errorAuth, setErrorAuth] = useState(false)
  const [submit, setSubmit] = useState(false)
  const [openNewPassword, setOpenNewPassword] = useState(false)
  const [errorGit, setErrorGit] = useState(false)

  const auth = getAuth()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const correctEmail = useEmail(email)

  const providerGoogle = new GoogleAuthProvider()
  const providerGitHub = new GithubAuthProvider()

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setSubmit(false)
  }
  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setSubmit(false)
  }

  const handleClickShowPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setShowPassword((show) => !show)
  }

  const handleErrorEmail = () => {
    if (!email.length || correctEmail === false) {
      setInputErrorEmail(true)
    } else setInputErrorEmail(false)
  }
  const handleErrorPassword = () => {
    if (!password.length || password.length < 6) {
      setInputErrorPassword(true)
    } else setInputErrorPassword(false)
  }

  const handleSubmitGoogle = () => {
    setErrorAuth(false)
    setErrorGit(false)
    signInWithPopup(auth, providerGoogle)
      .then(() => {
        setSuccessAuth(true)
        dispatch(pushInfoNotification('Вы успешно вошли через Google'))
      })
      .catch(() => {
        setErrorAuth(true)
        setSubmit(false)
        dispatch(pushDangerNotification('Неверный email или пароль'))
      })
  }

  const handleSubmitGitHub = () => {
    setErrorAuth(false)
    signInWithPopup(auth, providerGitHub)
      .then(() => {
        setSuccessAuth(true)
        dispatch(pushInfoNotification('Вы успешно вошли через GitHub'))
      })
      .catch(() => {
        setErrorGit(true)
        setSubmit(false)
        dispatch(pushDangerNotification('Выберите другой способ входа'))
      })
  }

  const handleSubmit = () => {
    if (!email.length || correctEmail === false) {
      setInputErrorEmail(true)
      return
    } else if (!password.length || password.length < 6) {
      setInputErrorPassword(true)
      return
    } else {
      setInputErrorPassword(false)
      setInputErrorEmail(false)
      setErrorGit(false)
      setErrorAuth(false)
      signInWithEmailAndPassword(auth, email, password)
        .then(({ user }) => {
          user
          setSuccessAuth(true)
          dispatch(pushSuccessNotification('Вход выполнен'))
        })
        .catch(() => {
          setErrorAuth(true)
          setSubmit(false)
          dispatch(pushDangerNotification('Неверный email или пароль'))
        })
    }
  }

  const handleSubmitAnonymous = () => {
    setErrorGit(false)
    setErrorAuth(false)
    signInAnonymously(auth)
      .then(() => {
        setSuccessAuth(true)
        dispatch(pushSuccessNotification('Вы вошли как анонимный пользователь'))
      })
      .catch(() => {
        setSubmit(false)
        dispatch(pushDangerNotification('Ошибка, проверьте подключение к сети'))
      })
  }

  const handleClose = () => {
    setOpen(false)
    navigate('/')
  }

  useEffect(() => {
    if (successAuth) {
      setTimeout(() => navigate('/'), 1500)
    }
  }, [navigate, successAuth])

  return (
    <>
      <Dialog open={open} keepMounted>
        <DialogTitle sx={{ padding: '20px 24px 0 24px', textAlign: 'center' }}>
          {successAuth ? (
            <p style={{ color: 'green' }}>Вход выполнен</p>
          ) : errorAuth ? (
            <p style={{ color: 'red' }}>Неверный email или пароль</p>
          ) : errorGit ? (
            <p style={{ color: 'red', fontSize: '18px' }}>
              Выберите другой способ входа
            </p>
          ) : (
            'Авторизация'
          )}
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '450px',
            padding: '20px 20px 0 20px',
            '&.MuiDialogContent-root': {
              paddingTop: '20px',
            },
          }}
        >
          <TextField
            label="Почта"
            type="email"
            value={email}
            onChange={(event: never) => {
              handleChangeEmail(event), setErrorAuth(false)
            }}
            onBlur={handleErrorEmail}
            fullWidth
            size="medium"
            sx={{ marginBottom: '20px' }}
            error={inputErrorEmail && (!email.length || correctEmail === false)}
            helperText={
              inputErrorEmail && !email.length
                ? 'Обязательное поле'
                : inputErrorEmail && correctEmail === false
                ? 'Введите корректный email'
                : ' '
            }
          />
          <TextField
            label="Пароль"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event: never) => {
              handleChangePassword(event), setErrorAuth(false)
            }}
            onBlur={handleErrorPassword}
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
            error={
              inputErrorPassword && (!password.length || password.length < 6)
            }
            helperText={
              inputErrorPassword && !password.length
                ? 'Обязательное поле'
                : inputErrorPassword && password.length < 6
                ? 'Длина пароля должна не менее 6 символов'
                : ' '
            }
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <Typography variant="h6">Войти с помощью:</Typography>
            <IconButton
              onClick={() => {
                handleSubmitGoogle(), setSubmit(true)
              }}
              color="info"
              style={{ margin: '0 7px 0 10px' }}
            >
              <GoogleIcon style={{ width: '30px', height: '30px' }} />
            </IconButton>
            <IconButton
              onClick={() => {
                handleSubmitGitHub(), setSubmit(true)
              }}
              color="inherit"
            >
              <GitHubIcon style={{ width: '30px', height: '30px' }} />
            </IconButton>
          </div>
          <Tooltip title="Некоторые функции ограничены" placement="right">
            <Button
              variant="contained"
              color="warning"
              sx={{
                textTransform: 'none',
                padding: '5px 10px',
                marginBottom: '20px',
                width: 'fit-content',
              }}
              disabled={submit}
              onClick={() => {
                handleSubmitAnonymous(), setSubmit(true)
              }}
            >
              Войти как анонимный пользователь
            </Button>
          </Tooltip>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <Button
              onClick={handleClose}
              variant="contained"
              color="error"
              sx={{ textTransform: 'none', padding: '5px 10px' }}
            >
              Отмена
            </Button>
            <Button
              variant="contained"
              color="success"
              sx={{ textTransform: 'none', padding: '5px 30px' }}
              disabled={submit}
              onClick={() => {
                handleSubmit(), setSubmit(true)
              }}
            >
              Войти
            </Button>
          </div>
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              alignItems: 'center',
              margin: 0,
              marginBottom: '15px',
            }}
          >
            <Typography variant="body1">Ещё нет аккаунта?</Typography>
            <Button
              variant="text"
              sx={{
                textTransform: 'none',
                fontSize: '18px',
                padding: '0 10px',
              }}
              onClick={() => navigate('/register')}
            >
              Регистрация
            </Button>
          </div>
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              alignItems: 'center',
              margin: 0,
            }}
          >
            <Button
              variant="text"
              sx={{
                textTransform: 'none',
                fontSize: '16px',
                padding: 0,
              }}
              onClick={() => {
                setOpenNewPassword(true), setOpen(false)
              }}
            >
              Забыли пароль?
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <NewPasswordModal
        openNewPassword={openNewPassword}
        onOpen={setOpenNewPassword}
      />
    </>
  )
}
