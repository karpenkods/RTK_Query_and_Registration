import { FC, useState, MouseEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useFormik } from 'formik'
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth'

import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import DoneIcon from '@mui/icons-material/Done'
import DoneAllIcon from '@mui/icons-material/DoneAll'

import {
  CostumButton,
  IRegistrationValues,
  pushDangerNotification,
  pushSuccessNotification,
  refreshReducer,
  registrationSchema,
  useAppDispatch,
  useAutoFocus,
} from '../../common'

export const Registration: FC = () => {
  const [open, setOpen] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [successAuth, setSuccessAuth] = useState(false)
  const [errorAuth, setErrorAuth] = useState(false)
  const [check, setCheck] = useState(true)

  const auth = getAuth()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const focus = useAutoFocus()

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registrationSchema,
    onSubmit: async (values) => {
      handleSubmit(values)
    },
  })

  const handleSubmit = (values: IRegistrationValues) => {
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(({ user }) => {
        updateProfile(user, {
          displayName: values.name,
        })
        sendEmailVerification(user)
        setSuccessAuth(true)
        dispatch(refreshReducer(false))
        setTimeout(() => navigate('/'), 1000)
        dispatch(pushSuccessNotification('Вы успешно зарегистрировались'))
      })
      .catch(() => {
        setErrorAuth(true)
        dispatch(pushDangerNotification('Такой email уже существует'))
      })
  }

  const handleClose = () => {
    setOpen(false)
    navigate('/')
  }

  const handleClickShowPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setShowPassword((show: any) => !show)
  }

  return (
    <Dialog open={open} keepMounted>
      <DialogTitle sx={{ padding: '20px 24px 0 24px', textAlign: 'center' }}>
        {successAuth ? (
          <Typography variant="h6" color="green">
            Вы успешно зарегистрировались
          </Typography>
        ) : errorAuth ? (
          <Typography variant="h6" color="error">
            Такой email уже существует
          </Typography>
        ) : (
          'Новый аккаунт'
        )}
      </DialogTitle>
      <DialogContent
        sx={{
          width: '500px',
          padding: '20px 20px 0px 20px',
          '&.MuiDialogContent-root': {
            paddingTop: '20px',
          },
        }}
      >
        <Stack direction="column" gap={'15px'} sx={{ marginBottom: '10px' }}>
          <TextField
            label="Ваше имя"
            type="text"
            name="name"
            fullWidth
            size="medium"
            inputRef={focus}
            value={formik.values.name}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            onBlur={formik.handleBlur('name')}
            error={Boolean(formik.errors.name) && formik.touched.name}
            helperText={
              formik.errors.name && formik.touched.name
                ? formik.errors.name
                : ' '
            }
          />
          <TextField
            label="Email"
            type="email"
            name="email"
            size="medium"
            fullWidth
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur('email')}
            disabled={formik.isSubmitting}
            error={Boolean(formik.errors.email) && formik.touched.email}
            helperText={
              formik.errors.email && formik.touched.email
                ? formik.errors.email
                : ' '
            }
          />
          <TextField
            label="Пароль"
            type={showPassword ? 'text' : 'password'}
            name="password"
            fullWidth
            size="medium"
            value={formik.values.password}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
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
          <TextField
            label="Повторите пароль"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            size="medium"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur('confirmPassword')}
            disabled={formik.isSubmitting}
            error={
              Boolean(formik.errors.confirmPassword) &&
              formik.touched.confirmPassword
            }
            helperText={
              formik.errors.confirmPassword && formik.touched.confirmPassword
                ? formik.errors.confirmPassword
                : ' '
            }
          />
        </Stack>
        <Stack direction="row" alignItems="center">
          <FormControlLabel
            sx={{ marginRight: '6px' }}
            control={
              <Checkbox
                checked={check}
                disabled={formik.isSubmitting}
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
        </Stack>
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
            marginBottom: '20px',
          }}
        >
          <CostumButton
            onClick={handleClose}
            variant="contained"
            color="error"
            disabled={formik.isSubmitting}
          >
            Отмена
          </CostumButton>
          <CostumButton
            variant="contained"
            color="success"
            disabled={formik.isSubmitting || !formik.dirty || !check}
            onClick={() => formik.handleSubmit()}
          >
            Зарегистрироваться
          </CostumButton>
        </Stack>
        <Stack direction="row" alignItems="center" alignSelf="flex-start">
          <Typography variant="body1">Уже есть аккаунт?</Typography>
          <CostumButton
            variant="text"
            onClick={() => navigate('/login')}
            disabled={formik.isSubmitting}
            sx={{ fontSize: '16px' }}
          >
            Войти
          </CostumButton>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
