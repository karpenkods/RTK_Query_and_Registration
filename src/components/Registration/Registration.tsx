import { FC, useState, MouseEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  openReducer,
  pushDangerNotification,
  pushSuccessNotification,
  refreshReducer,
  registrationSchema,
  useAppDispatch,
  useAppSelector,
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
  const { t } = useTranslation()
  const pathName = useAppSelector((store) => store.menu.pathName)

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registrationSchema(t),
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
        sendEmailVerification(user, {
          handleCodeInApp: true,
          url: 'http://localhost:3000/',
        })
        setSuccessAuth(true)
        dispatch(refreshReducer(false))
        dispatch(openReducer(false))
        setTimeout(() => navigate('/'), 1000)
        dispatch(pushSuccessNotification(`${t('successfullyLoggedIn')}`))
      })
      .catch(() => {
        setErrorAuth(true)
        dispatch(pushDangerNotification(`${t('emailExists')}`))
      })
  }

  const handleClose = () => {
    setOpen(false)
    dispatch(openReducer(false))
    navigate(pathName)
  }

  const handleClickShowPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setShowPassword((show: any) => !show)
  }

  return (
    <Dialog open={open} keepMounted>
      <DialogTitle
        sx={{ padding: '20px 24px 0 24px', textAlign: 'center' }}
        variant="h6"
      >
        {successAuth ? (
          <Typography color="green">{t('successfullyLoggedIn')}</Typography>
        ) : errorAuth ? (
          <Typography color="error">{t('emailExists')}</Typography>
        ) : (
          `${t('newAccount')}`
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
            label={t('yourName')}
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
            label={t('password')}
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
            label={t('repeatPassword')}
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
            label={t('iAgree')}
          />
          <CostumButton sx={{ fontSize: '16px', padding: '0 0 0 5px' }}>
            <Link
              style={{ color: '#1976D2' }}
              target="_blank"
              rel="noopener noreferrer"
              to="https://apps.who.int/iris/bitstream/handle/10665/260442/WHO-RHR-17.03-rus.pdf;jsessionid=9726A654112AA0D0BDA8F83C2EEE8DB1?sequence=1"
            >
              {t('rules')}
            </Link>
          </CostumButton>
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
            {t('cancel')}
          </CostumButton>
          <CostumButton
            variant="contained"
            color="success"
            disabled={formik.isSubmitting || !formik.dirty || !check}
            onClick={() => formik.handleSubmit()}
          >
            {t('logIn')}
          </CostumButton>
        </Stack>
        <Stack direction="row" alignItems="center" alignSelf="flex-start">
          <Typography variant="body1">{t('alreadyAccount')}</Typography>
          <CostumButton
            variant="text"
            onClick={() => navigate('/login')}
            disabled={formik.isSubmitting}
            sx={{ fontSize: '16px' }}
          >
            {t('signIn')}
          </CostumButton>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
