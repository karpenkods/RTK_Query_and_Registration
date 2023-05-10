/* eslint-disable react-hooks/exhaustive-deps */
import { FC, Fragment, useEffect, useState } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'

import { Avatar, Typography, TextField, Stack, Button } from '@mui/material'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import CreateIcon from '@mui/icons-material/Create'

import { CropperModal } from '../Modals/CropperModal'
import {
  CostumButton,
  costumAvatar,
  openCropperReducer,
  pushDangerNotification,
  pushSuccessNotification,
  settingsNameSchema,
  useAppDispatch,
  useAppSelector,
  useFocus,
} from '../../common'

export const SettingAvatarAndName: FC = () => {
  const [showInput, setShowInput] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [src, setSrc] = useState<string | null>(null)

  const user = getAuth().currentUser
  const avatar = costumAvatar(user?.displayName ? user.displayName : 'А П')
  const refresh = useAppSelector((store) => store.menu.refresh)
  const focus = useFocus(showInput)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: settingsNameSchema(t),
    onSubmit: async () => {
      handleChangeName()
    },
  })

  const handleImageDelete = () => {
    if (user) {
      setDisabled(true)
      updateProfile(user, {
        displayName: user.displayName,
        photoURL: '',
      })
        .then(() => {
          setDisabled(false)
          setShowDelete(false)
          dispatch(pushSuccessNotification(`${t('avatarRemoved')}`))
        })
        .catch(() => {
          setDisabled(false)
          setShowDelete(false)
          dispatch(pushDangerNotification(`${t('errorTryLater')}`))
        })
    }
  }

  const handleChangeName = () => {
    if (user) {
      updateProfile(user, {
        displayName: formik.values.name.length
          ? formik.values.name
          : user.displayName,
        photoURL: user.photoURL,
      })
        .then(() => {
          setShowInput(false)
          formik.resetForm()
          dispatch(
            pushSuccessNotification(`${t('usernameChangedSuccessfully')}`),
          )
        })
        .catch(() => {
          dispatch(pushDangerNotification(`${t('errorTryLater')}`))
        })
    }
  }

  const handleImageUpload = (e: any) => {
    if (e.target.files.length !== 0) {
      setSrc(URL.createObjectURL(e.target.files[0]))
      dispatch(openCropperReducer(true))
    }
  }

  useEffect(() => {
    if (refresh === false) {
      setShowInput(false)
      setShowDelete(false)
      formik.resetForm()
    }
  }, [refresh])

  return (
    <Fragment>
      <Stack direction="column" alignItems="center" sx={{ width: '100%' }}>
        {user?.photoURL ? (
          <Avatar
            alt="avatar"
            src={user?.photoURL}
            sx={{
              width: '150px',
              height: '150px',
            }}
          />
        ) : (
          <Avatar
            {...avatar}
            sx={{
              width: '150px',
              height: '150px',
              fontSize: '600%',
            }}
          />
        )}
        <Typography variant="h5" margin="20px 0 30px 0" textAlign="center">
          {user?.displayName}
        </Typography>
        {showInput && (
          <Fragment>
            <TextField
              label={t('newName')}
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur('name')}
              disabled={formik.isSubmitting}
              inputRef={focus}
              fullWidth
              size="medium"
              sx={{ marginBottom: '20px' }}
              error={Boolean(formik.errors.name) && formik.touched.name}
              helperText={
                formik.errors.name && formik.touched.name
                  ? formik.errors.name
                  : ' '
              }
            />
            <Stack
              direction="row"
              justifyContent="space-between"
              width="100%"
              mb="20px"
            >
              <CostumButton
                onClick={() => {
                  setShowInput(false), formik.resetForm()
                }}
                variant="contained"
                disabled={formik.isSubmitting}
                color="error"
              >
                {t('cancel')}
              </CostumButton>
              <CostumButton
                onClick={() => formik.handleSubmit()}
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting || !formik.dirty}
              >
                {t('save')}
              </CostumButton>
            </Stack>
          </Fragment>
        )}
        <Stack
          direction="row"
          justifyContent="space-between"
          width="100%"
          mb="25px"
        >
          <Button
            variant="contained"
            component="label"
            startIcon={<SupervisorAccountIcon sx={{ color: 'white' }} />}
            disabled={showInput || disabled || showDelete}
            sx={{
              textTransform: 'none',
              padding: '5px 15px',
              color: 'white',
            }}
            color="success"
          >
            {t('changeAvatar')}
            <input
              onChange={handleImageUpload}
              hidden
              accept="image/*"
              type="file"
            />
          </Button>
          <CostumButton
            onClick={() => {
              setShowInput(true)
            }}
            variant="contained"
            color="primary"
            startIcon={<CreateIcon sx={{ color: 'white' }} />}
            disabled={showInput || disabled || showDelete}
          >
            {t('changeName')}
          </CostumButton>
        </Stack>
        <CostumButton
          variant="contained"
          startIcon={<RemoveCircleOutlineIcon sx={{ color: 'white' }} />}
          disabled={
            showInput || !user?.photoURL?.length || disabled || showDelete
          }
          onClick={() => setShowDelete(true)}
          color="error"
          sx={{ alignSelf: 'flex-start', marginBottom: '30px' }}
        >
          {t('removeAvatar')}
        </CostumButton>
        {showDelete && (
          <Fragment>
            <Stack direction="column" alignItems="center" mb="20px">
              <Typography variant="h5" color="error">
                {t('areYouSure')}
              </Typography>
              <Typography variant="body1" color="error">
                {t('actionIsIrreversible')}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-evenly" width="100%">
              <CostumButton
                onClick={() => setShowDelete(false)}
                variant="contained"
                disabled={disabled}
                color="error"
              >
                {t('cancel')}
              </CostumButton>
              <CostumButton
                onClick={handleImageDelete}
                variant="contained"
                color="success"
                disabled={disabled}
              >
                {t('remove')}
              </CostumButton>
            </Stack>
          </Fragment>
        )}
      </Stack>
      <CropperModal src={src} />
    </Fragment>
  )
}
