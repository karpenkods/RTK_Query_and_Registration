import { FC, useState, MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  openReducer,
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
  const { t } = useTranslation()

  const providerGoogle = new GoogleAuthProvider()
  const providerGitHub = new GithubAuthProvider()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema(t),
    onSubmit: async (values) => {
      handleSubmit(values)
    },
  })

  const goodAuth = () => {
    setSuccessAuth(true)
    dispatch(refreshReducer(false))
    dispatch(openReducer(false))
    setTimeout(() => navigate('/'), 1000)
  }

  const handleSubmitGoogle = () => {
    setDisabledGit(true)
    signInWithPopup(auth, providerGoogle)
      .then(() => {
        goodAuth()
        dispatch(pushInfoNotification(`${t('signedInGoogle')}`))
      })
      .catch(() => {
        setErrortGit(true)
        setDisabledGit(false)
        dispatch(pushDangerNotification(`${t('chooseSignInMethod')}`))
      })
  }

  const handleSubmitGitHub = () => {
    setDisabledGit(true)
    signInWithPopup(auth, providerGitHub)
      .then(() => {
        goodAuth()
        dispatch(pushInfoNotification(`${t('signedInGitHub')}`))
      })
      .catch(() => {
        setErrortGit(true)
        setDisabledGit(false)
        dispatch(pushDangerNotification(`${t('chooseSignInMethod')}`))
      })
  }

  const handleSubmit = (values: ILoginValues) => {
    setDisabledGit(true)
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(() => {
        goodAuth()
        dispatch(pushSuccessNotification(`${t('signedIn')}`))
      })
      .catch(() => {
        setDisabledGit(false)
        setErrorAuth(true)
        dispatch(pushDangerNotification(`${t('invalidEmail')}`))
      })
  }

  const handleSubmitAnonymous = () => {
    setDisabledGit(true)
    signInAnonymously(auth)
      .then(() => {
        goodAuth()
        dispatch(pushSuccessNotification(`${t('loggedAnonymousUser')}`))
      })
      .catch(() => {
        setDisabledGit(false)
        setErrortGit(true)
        dispatch(pushDangerNotification(`${t('checkNetworkConnection')}`))
      })
  }

  const handleClose = () => {
    setOpen(false)
    dispatch(openReducer(false))
    navigate('/')
  }

  const handleClickShowPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setShowPassword((show) => !show)
  }

  return (
    <>
      <Dialog open={open} keepMounted>
        <DialogTitle
          sx={{ padding: '20px 24px 0 24px', textAlign: 'center' }}
          variant="h6"
        >
          {successAuth ? (
            <Typography color="green">{t('signedIn')}</Typography>
          ) : errorAuth ? (
            <Typography color="error">{t('invalidEmail')}</Typography>
          ) : errorGit ? (
            <Typography color="error">{t('chooseSignInMethod')}</Typography>
          ) : (
            `${t('signIn')}`
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
              label={t('password')}
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
            <Typography variant="h6">{t('loginWith')}</Typography>
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
          <Tooltip title={t('featuresLimited')} placement="right">
            <CostumButton
              variant="contained"
              color="warning"
              sx={{ marginBottom: '20px', color: 'white' }}
              disabled={
                disabledGit ||
                formik.isSubmitting ||
                auth.currentUser?.isAnonymous
              }
              onClick={() => {
                handleSubmitAnonymous()
              }}
            >
              {t('loginAnonymous')}
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
              {t('cancel')}
            </CostumButton>
            <CostumButton
              variant="contained"
              color="success"
              disabled={formik.isSubmitting || !formik.dirty || disabledGit}
              onClick={() => formik.handleSubmit()}
            >
              {t('signIn')}
            </CostumButton>
          </Stack>
          <Stack direction="row" alignItems="center" alignSelf="flex-start">
            <Typography variant="body1">{t('notAccount')}</Typography>
            <CostumButton
              variant="text"
              onClick={() => navigate('/registration')}
              disabled={disabledGit || formik.isSubmitting}
              sx={{ fontSize: '16px' }}
            >
              {t('logIn')}
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
            sx={{
              fontSize: '16px',
              padding: 0,
              alignSelf: 'flex-start',
            }}
            onClick={() => {
              setOpenNewPassword(true), setOpen(false)
            }}
          >
            {t('forgotPassword')}
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
