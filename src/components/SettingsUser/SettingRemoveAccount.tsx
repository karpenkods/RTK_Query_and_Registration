import { FC, useState, MouseEvent } from 'react'
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

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
    },
    validationSchema: settingsRemoveSchema,
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
              dispatch(pushSuccessNotification('Аккаунт удалён'))
              dispatch(refreshReducer(false))
              navigate('/')
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
        variant="h5"
        color="primary"
        sx={{
          margin: '15px 0',
        }}
      >
        Удаление аккаунта
      </Typography>
      <Typography variant="body1" color="error">
        Регистрация(авторизация) с посмощью Email и пароля:
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: '30px' }}>
        Аккаунт будет удалён навсегда, его нельзя будет восстановить.
      </Typography>
      <Typography variant="body1" color="error" sx={{ marginBottom: '30px' }}>
        Удалить аккаунты Google или GitHub с помощью этого сервиса нельзя.
      </Typography>

      {!showInput && (
        <CostumButton
          onClick={() => setShowInput(true)}
          variant="contained"
          color="error"
          startIcon={<PersonRemoveIcon sx={{ color: 'white' }} />}
          disabled={close}
        >
          Удалить аккаунт
        </CostumButton>
      )}
      {showInput && (
        <Stack direction="column" gap={'30px'} sx={{ width: '100%' }}>
          <TextField
            label="Введите текущий пароль"
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
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ width: '100%' }}
          >
            <CostumButton
              onClick={() => {
                setShowInput(false), setShowPassword(false)
                formik.resetForm()
              }}
              variant="contained"
              disabled={formik.isSubmitting}
              color="error"
            >
              Отмена
            </CostumButton>
            <CostumButton
              onClick={() => formik.handleSubmit()}
              variant="contained"
              color="primary"
              disabled={formik.isSubmitting || !formik.dirty}
            >
              Удалить
            </CostumButton>
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}
