import { FC, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { useFormik } from 'formik'
import { send } from 'emailjs-com'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import {
  CostumButton,
  INewPasswordValues,
  IPropsNewPasswordModal,
  newPasswordSchema,
  pushDangerNotification,
  pushInfoNotification,
  pushSuccessNotification,
  useAppDispatch,
  useFocus,
} from '../../common'

export const NewPasswordModal: FC<IPropsNewPasswordModal> = ({
  openNewPassword,
  onOpen,
  onOpenLoginModal,
}) => {
  const [successAuth, setSuccessAuth] = useState(false)
  const [showContent, setShowContent] = useState(false)

  const auth = getAuth()
  const focus = useFocus(showContent)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const formik = useFormik({
    initialValues: {
      email: auth.currentUser?.email ?? '',
      message: 'Сбросить пароль в приложении Queries',
    },
    validationSchema: newPasswordSchema,
    onSubmit: async (values: INewPasswordValues) => {
      onSendEmail(values)
    },
  })

  const handleSubmitAnonymous = () => {
    signInAnonymously(auth)
      .then(() => {
        setSuccessAuth(true)
        dispatch(pushSuccessNotification('Вы вошли как анонимный пользователь'))
      })
      .catch(() => {
        dispatch(pushDangerNotification('Ошибка, проверьте подключение к сети'))
      })
  }

  const onSendEmail = (values: INewPasswordValues) => {
    if (values.email === auth.currentUser?.email) {
      send(
        process.env.REACT_APP_SERVICE_ID ?? '',
        process.env.REACT_APP_TEMPLATE_ID ?? '',
        {
          message: values.message,
          email: values.email,
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
          dispatch(pushDangerNotification('Ошибка, попробуйте позднее'))
        })
    } else {
      dispatch(pushDangerNotification('Введите свой Email'))
    }
  }

  const handleClose = () => {
    onOpen(false)
    onOpenLoginModal(true)
    setShowContent(false)
    formik.resetForm()
  }

  useEffect(() => {
    if (successAuth) {
      setTimeout(() => navigate('/'), 1500)
    }
  }, [navigate, successAuth])

  return (
    <Dialog open={openNewPassword} keepMounted>
      <IconButton
        color="error"
        onClick={handleClose}
        sx={{ alignSelf: 'flex-end' }}
      >
        <CloseIcon style={{ width: '30px', height: '30px' }} />
      </IconButton>
      <DialogTitle sx={{ padding: '0 24px 0 24px', alignSelf: 'center' }}>
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
          <Stack direction="column" gap={'15px'} sx={{ marginTop: '10px' }}>
            <TextField
              label="Почта"
              type="email"
              name="email"
              fullWidth
              size="medium"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur('email')}
              disabled={formik.isSubmitting}
              inputRef={focus}
              error={
                (Boolean(formik.errors.email) && formik.touched.email) ||
                formik.values.email !== auth.currentUser?.email
              }
              helperText={
                formik.errors.email && formik.touched.email
                  ? formik.errors.email
                  : formik.values.email !== auth.currentUser?.email
                  ? 'Введите свой Email'
                  : ' '
              }
            />
            <TextField
              label="Сообщение администратору"
              type="text"
              name="message"
              fullWidth
              size="medium"
              multiline
              maxRows={3}
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur('message')}
              disabled={formik.isSubmitting}
              error={Boolean(formik.errors.message) && formik.touched.message}
              helperText={
                formik.errors.message && formik.touched.message
                  ? formik.errors.message
                  : ' '
              }
            />
            <Stack direction="row" justifyContent="space-evenly">
              <CostumButton
                onClick={() => {
                  setShowContent(false), formik.resetForm()
                }}
                disabled={formik.isSubmitting}
                variant="contained"
                color="error"
              >
                Не хочу
              </CostumButton>
              <CostumButton
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting}
                onClick={() => formik.handleSubmit()}
              >
                Отправить
              </CostumButton>
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 20px 10px 20px',
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: '100%', marginBottom: '20px' }}
        >
          <CostumButton
            onClick={() => navigate('/registration')}
            disabled={showContent}
            variant="contained"
            color="info"
          >
            Регистрация
          </CostumButton>
          <CostumButton
            variant="contained"
            color="success"
            disabled={showContent}
            onClick={() => {
              setShowContent(true)
            }}
          >
            Сообщение администратору
          </CostumButton>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: '100%', margin: '0 0 10px 0' }}
        >
          <CostumButton
            onClick={handleClose}
            disabled={formik.isSubmitting}
            variant="contained"
            color="error"
          >
            Назад
          </CostumButton>
          <CostumButton
            variant="contained"
            color="warning"
            disabled={showContent}
            onClick={handleSubmitAnonymous}
          >
            Войти как анонимный пользователь
          </CostumButton>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
