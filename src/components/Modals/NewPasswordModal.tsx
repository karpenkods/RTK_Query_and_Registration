import { FC, useState, useEffect, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { send } from 'emailjs-com'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'

import {
  IPropsNewPasswordModal,
  pushDangerNotification,
  pushInfoNotification,
  pushSuccessNotification,
  useAppDispatch,
  useEmail,
} from '../../common'

export const NewPasswordModal: FC<IPropsNewPasswordModal> = ({
  openNewPassword,
  onOpen,
}) => {
  const [successAuth, setSuccessAuth] = useState(false)
  const [submit, setSubmit] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('Сбросить пароль в приложении Queries')
  const [inputErrorEmail, setInputErrorEmail] = useState(false)
  const [inputErrorMessage, setInputErrorMessage] = useState(false)

  const auth = getAuth()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const correctEmail = useEmail(email)

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setSubmit(false)
  }
  const handleChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
    setSubmit(false)
  }

  const handleErrorEmail = () => {
    if (!email.length || correctEmail === false) {
      setInputErrorEmail(true)
    } else setInputErrorEmail(false)
  }
  const handleErrorMessage = () => {
    if (!message.length || message.length < 3) {
      setInputErrorMessage(true)
    } else setInputErrorMessage(false)
  }

  const handleSubmit = () => {
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

  const onSendEmail = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!email.length || correctEmail === false) {
      setInputErrorEmail(true)
      return
    } else if (!message.length || message.length < 10) {
      setInputErrorMessage(true)
      return
    } else {
      setInputErrorMessage(false),
        setInputErrorEmail(false),
        send(
          process.env.REACT_APP_SERVICE_ID ?? '',
          process.env.REACT_APP_TEMPLATE_ID ?? '',
          {
            message: message,
            email: email,
          },
          process.env.REACT_APP_USER_ID,
        )
          .then(() => {
            onOpen(false)
            setSuccessAuth(true)
            dispatch(
              pushInfoNotification(
                'Сообщение отправлено. На Вашу почту придёт письмо с инструкцией по смене пароля',
              ),
            )
          })
          .catch(() => {
            setSubmit(false)
            dispatch(pushDangerNotification('Ошибка, попробуйте позднее'))
          })
    }
  }

  const handleClose = () => {
    onOpen(false)
    navigate('/')
  }

  useEffect(() => {
    if (successAuth) {
      setTimeout(() => navigate('/'), 1500)
    }
  }, [navigate, successAuth])

  return (
    <Dialog open={openNewPassword} keepMounted>
      <DialogTitle sx={{ padding: '20px 24px 0 24px', alignSelf: 'center' }}>
        Сброс пароля
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '450px',
          padding: '20px 20px 10px 20px',
          '&.MuiDialogContent-root': {
            paddingTop: '20px',
          },
        }}
      >
        <Typography
          variant="body1"
          color="initial"
          sx={{ marginBottom: '20px' }}
        >
          Если Вы не помните пароль, отправьте сообщение администратору. На Вашу
          почту придёт письмо с инструкцией по смене пароля. Вы можете временно
          войти в приложение как анонимный пользователь (некоторые функции будут
          ограничены) или зарегистрироваться.
        </Typography>
        {showContent && (
          <>
            <TextField
              label="Почта"
              type="email"
              value={email}
              onChange={handleChangeEmail}
              onBlur={handleErrorEmail}
              fullWidth
              size="medium"
              sx={{ marginBottom: '20px' }}
              error={
                inputErrorEmail && (!email.length || correctEmail === false)
              }
              helperText={
                inputErrorEmail && !email.length
                  ? 'Обязательное поле'
                  : inputErrorEmail && correctEmail === false
                  ? 'Введите корректный email'
                  : ' '
              }
            />
            <TextField
              label="Сообщение администратору"
              type="text"
              value={message}
              onChange={handleChangeMessage}
              onBlur={handleErrorMessage}
              fullWidth
              size="medium"
              sx={{ marginBottom: '10px' }}
              error={
                inputErrorMessage && (!message.length || message.length < 10)
              }
              helperText={
                inputErrorMessage && !message.length
                  ? 'Обязательное поле'
                  : inputErrorMessage && message.length < 10
                  ? 'Сообщение должно быть не менее 10 символов'
                  : ' '
              }
            />
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <Button
                onClick={() => {
                  setShowContent(false),
                    setSubmit(false),
                    setEmail(''),
                    setMessage('Сбросить пароль в приложении Queries')
                }}
                variant="contained"
                color="error"
                sx={{ textTransform: 'none', padding: '5px 10px' }}
              >
                Не хочу
              </Button>
              <Button
                onClick={(e) => {
                  onSendEmail(e), setSubmit(true)
                }}
                variant="contained"
                color="primary"
                disabled={submit}
                sx={{ textTransform: 'none', padding: '5px 10px' }}
              >
                Отправить
              </Button>
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 20px 10px 20px',
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
            onClick={() => navigate('/registration')}
            variant="contained"
            color="info"
            sx={{ textTransform: 'none', padding: '5px 10px' }}
          >
            Регистрация
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ textTransform: 'none', padding: '5px 10px' }}
            disabled={submit || showContent}
            onClick={() => {
              setShowContent(true)
            }}
          >
            Сообщение администратору
          </Button>
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            marginLeft: 0,
            marginBottom: '10px',
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
            color="warning"
            sx={{ textTransform: 'none', padding: '5px 10px' }}
            disabled={submit || showContent}
            onClick={() => {
              handleSubmit(), setSubmit(true)
            }}
          >
            Войти как анонимный пользователь
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}
