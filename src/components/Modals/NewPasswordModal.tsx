import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  refreshReducer,
  useAppDispatch,
  useFocus,
} from '../../common'

export const NewPasswordModal: FC<IPropsNewPasswordModal> = ({
  openNewPassword,
  onOpen,
  onOpenLoginModal,
}) => {
  const [showContent, setShowContent] = useState(false)
  const [diasbledButton, setDisabledButton] = useState(false)

  const auth = getAuth()
  const focus = useFocus(showContent)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const formik = useFormik({
    initialValues: {
      email: auth.currentUser?.email ?? '',
      message: `${t('resetPassword')}`,
    },
    validationSchema: newPasswordSchema(t),
    onSubmit: async (values: INewPasswordValues) => {
      onSendEmail(values)
    },
  })

  const goodAuth = () => {
    dispatch(refreshReducer(false))
    setTimeout(() => navigate('/'), 1000)
  }

  const handleSubmitAnonymous = () => {
    setDisabledButton(true)
    signInAnonymously(auth)
      .then(() => {
        goodAuth()
        dispatch(pushSuccessNotification(`${t('loggedAnonymousUser')}`))
      })
      .catch(() => {
        setDisabledButton(false)
        dispatch(pushDangerNotification(`${t('checkNetworkConnection')}`))
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
          goodAuth()
          dispatch(pushInfoNotification(`${t('messageSent')}`))
        })
        .catch(() => {
          dispatch(pushDangerNotification(`${t('errorTryLater')}`))
        })
    } else {
      dispatch(pushDangerNotification(`${t('enterEmail')}`))
    }
  }

  const handleClose = () => {
    onOpen(false)
    onOpenLoginModal(true)
    setShowContent(false)
    formik.resetForm()
  }

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
        {t('passwordReset')}
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
        <Typography variant="body1" sx={{ marginBottom: '20px' }}>
          {t('instructionsToChangePassword')}
        </Typography>
        {showContent && (
          <Stack direction="column" gap={'15px'} sx={{ marginTop: '10px' }}>
            <TextField
              label="Email"
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
                  ? `${t('enterEmail')}`
                  : ' '
              }
            />
            <TextField
              label={`${t('messageToAdministrator')}`}
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
                {t('notWant')}
              </CostumButton>
              <CostumButton
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting}
                onClick={() => formik.handleSubmit()}
              >
                {t('send')}
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
          '&.MuiDialogActions-root>:not(:first-of-type)': {
            marginLeft: 0,
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: '100%', marginBottom: '20px' }}
        >
          <CostumButton
            onClick={() => navigate('/registration')}
            disabled={showContent || diasbledButton}
            variant="contained"
            color="info"
            sx={{ color: 'white' }}
          >
            {t('logIn')}
          </CostumButton>
          <CostumButton
            variant="contained"
            color="success"
            disabled={showContent || diasbledButton}
            onClick={() => {
              setShowContent(true)
            }}
          >
            {t('messageToAdministrator')}
          </CostumButton>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: '100%', margin: '0 0 10px 0' }}
        >
          <CostumButton
            onClick={handleClose}
            disabled={formik.isSubmitting || diasbledButton}
            variant="contained"
            color="error"
          >
            {t('back')}
          </CostumButton>
          <CostumButton
            variant="contained"
            color="warning"
            disabled={showContent || diasbledButton}
            onClick={handleSubmitAnonymous}
          >
            {t('loginAnonymous')}
          </CostumButton>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
