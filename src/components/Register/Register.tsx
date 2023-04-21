/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, FC, useState, MouseEvent, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth'

import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import GitHubIcon from '@mui/icons-material/GitHub'
import DoneIcon from '@mui/icons-material/Done'
import DoneAllIcon from '@mui/icons-material/DoneAll'

import { useAppDispatch, useEmail } from '../../common/hooks'
import {
  pushDangerNotification,
  pushInfoNotification,
  pushSuccessNotification,
} from '../../common/redux'

export const Register: FC = () => {
  const [open, setOpen] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordAgain, setPasswordAgain] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [inputErrorName, setInputErrorName] = useState(false)
  const [inputErrorEmail, setInputErrorEmail] = useState(false)
  const [inputErrorPassword, setInputErrorPassword] = useState(false)
  const [inputErrorPasswordAgain, setInputErrorPasswordAgain] = useState(false)
  const [successAuth, setSuccessAuth] = useState(false)
  const [errorAuth, setErrorAuth] = useState(false)
  const [submit, setSubmit] = useState(false)
  const [check, setCheck] = useState(true)
  const [errorGit, setErrorGit] = useState(false)

  const auth = getAuth()
  const dispatch = useAppDispatch()
  const correctEmail = useEmail(email)

  const providerGoogle = new GoogleAuthProvider()
  const providerGitHub = new GithubAuthProvider()

  const navigate = useNavigate()

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    setSubmit(false)
  }
  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setSubmit(false)
  }
  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setSubmit(false)
  }
  const handleChangePasswordAgain = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPasswordAgain(e.target.value)
    setSubmit(false)
  }

  const handleClickShowPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setShowPassword((show) => !show)
  }

  const handleErrorName = () => {
    if (!name.length || name.length < 3) {
      setInputErrorName(true)
    } else setInputErrorName(false)
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
    setErrorGit(false)
    setErrorAuth(false)
    signInWithPopup(auth, providerGoogle)
      .then(() => {
        setSuccessAuth(true)
        dispatch(
          pushInfoNotification('Вы успешно зарегистрировались через Google'),
        )
      })
      .catch(() => {
        setErrorAuth(true)
        setSubmit(false)
        dispatch(pushDangerNotification('Такой email уже существует'))
      })
  }

  const handleSubmitGitHub = () => {
    setErrorAuth(false)
    signInWithPopup(auth, providerGitHub)
      .then(() => {
        setSuccessAuth(true)
        dispatch(
          pushInfoNotification('Вы успешно зарегистрировались через GitHub'),
        )
      })
      .catch(() => {
        setErrorGit(true)
        setSubmit(false)
        dispatch(
          pushDangerNotification(
            'Зарегистрируйтесь с помощью email или аккаунта Google',
          ),
        )
      })
  }

  const handleSubmit = async () => {
    if (!name.length || name.length < 3) {
      setInputErrorName(true)
      return
    } else if (!email.length || correctEmail === false) {
      setInputErrorEmail(true)
      return
    } else if (!password.length || password.length < 6) {
      setInputErrorPassword(true)
      return
    } else if (!passwordAgain.length || inputErrorPasswordAgain) {
      setInputErrorPasswordAgain(true)
      return
    } else {
      setInputErrorPassword(false),
        setInputErrorEmail(false),
        setInputErrorName(false),
        setInputErrorPasswordAgain(false)
      setErrorGit(false)
      setErrorAuth(false)

      await createUserWithEmailAndPassword(auth, email, password)
        .then(({ user }: any) => {
          updateProfile(user, {
            displayName: name,
          })
          sendEmailVerification(user)
          setSuccessAuth(true)
          dispatch(pushSuccessNotification('Вы успешно зарегистрировались'))
        })
        .catch(() => {
          setErrorAuth(true)
          setSubmit(false)
          dispatch(pushDangerNotification('Такой email уже существует'))
        })
    }
  }

  useEffect(() => {
    if (password !== passwordAgain && passwordAgain.length > 0) {
      setInputErrorPasswordAgain(true)
    } else setInputErrorPasswordAgain(false)
  }, [password, passwordAgain])

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
    <Dialog open={open} keepMounted>
      <DialogTitle
        variant="h5"
        sx={{
          padding: '20px 24px 0 24px',
          textAlign: 'center',
          width: '500px',
        }}
      >
        {successAuth ? (
          <p style={{ color: 'green' }}>Вы успешно зарегистрировались</p>
        ) : errorAuth ? (
          <p style={{ color: 'red' }}>Такой email уже существует</p>
        ) : errorGit ? (
          <p style={{ color: 'red', fontSize: '18px' }}>
            Зарегистрируйтесь с помощью email или аккаунта Google
          </p>
        ) : (
          'Регистрация'
        )}
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '500px',
          padding: '20px 20px 10px 20px',
          '&.MuiDialogContent-root': {
            paddingTop: '20px',
          },
        }}
      >
        <TextField
          label="Ваше имя"
          type="text"
          value={name}
          onChange={(event: never) => {
            handleChangeName(event), setErrorAuth(false)
          }}
          onBlur={handleErrorName}
          fullWidth
          size="medium"
          sx={{ marginBottom: '20px' }}
          error={inputErrorName && (!name.length || name.length < 3)}
          helperText={
            inputErrorName && !name.length
              ? 'Обязательное поле'
              : inputErrorName && name.length < 3
              ? 'Имя пользователя не менее 3-х символов'
              : ' '
          }
        />
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
          sx={{ marginBottom: '20px' }}
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
              ? 'Длина пароля не менее 6 символов'
              : ' '
          }
        />
        <TextField
          label="Повторите пароль"
          type={showPassword ? 'text' : 'password'}
          value={passwordAgain}
          onChange={handleChangePasswordAgain}
          fullWidth
          size="medium"
          sx={{ marginBottom: '20px' }}
          error={inputErrorPasswordAgain}
          helperText={inputErrorPasswordAgain ? 'Пароли не совпадают' : ' '}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <Typography variant="h6">Зарегистрироваться с помощью:</Typography>
          <IconButton
            onClick={() => {
              handleSubmitGoogle(), setSubmit(true)
            }}
            color="info"
            style={{ margin: '0 7px 0 5px' }}
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <FormControlLabel
            sx={{ marginRight: '6px' }}
            control={
              <Checkbox
                checked={check}
                onChange={() => setCheck((prev) => !prev)}
                icon={<DoneIcon style={{ width: '30px', height: '30px' }} />}
                checkedIcon={
                  <DoneAllIcon
                    color="info"
                    style={{ width: '30px', height: '30px' }}
                  />
                }
              />
            }
            label="Я согласен(на) с "
          />
          <Link
            target="_blank"
            rel="noopener noreferrer"
            to="https://apps.who.int/iris/bitstream/handle/10665/260442/WHO-RHR-17.03-rus.pdf;jsessionid=9726A654112AA0D0BDA8F83C2EEE8DB1?sequence=1"
          >
            Правилами
          </Link>
        </div>
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
            sx={{ textTransform: 'none', padding: '5px 10px' }}
            disabled={submit || !check}
            onClick={() => {
              handleSubmit(), setSubmit(true)
            }}
          >
            Зарегистрироваться
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
          <Typography variant="body1">Уже есть аккаунт?</Typography>
          <Button
            variant="text"
            sx={{
              textTransform: 'none',
              fontSize: '18px',
              padding: '0 10px',
            }}
            onClick={() => navigate('/login')}
          >
            Войти
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}
