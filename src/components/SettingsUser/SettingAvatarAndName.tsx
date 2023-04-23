/* eslint-disable react-hooks/exhaustive-deps */
import { FC, Fragment, useState } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { useFormik } from 'formik'

import { Avatar, Typography, TextField, Stack, Button } from '@mui/material'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import CreateIcon from '@mui/icons-material/Create'

import { CropperModal } from '../Modals/CropperModal'
import {
  CostumButton,
  costumAvatar,
  pushDangerNotification,
  pushSuccessNotification,
  settingsNameSchema,
  useAppDispatch,
  useFocus,
} from '../../common'

export const SettingAvatarAndName: FC = () => {
  const [showInput, setShowInput] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [src, setSrc] = useState<string | null>(null)

  const user = getAuth().currentUser
  const avatar = costumAvatar(user?.displayName ? user.displayName : 'А П')
  const focus = useFocus(showInput)
  const dispatch = useAppDispatch()

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: settingsNameSchema,
    enableReinitialize: true,
    onSubmit: () => {
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
          dispatch(pushSuccessNotification('Аватар удалён'))
        })
        .catch(() => {
          setDisabled(false)
          setShowDelete(false)
          dispatch(pushDangerNotification('Ошибка, попробуйте позднее'))
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
          formik.setSubmitting(false)
          formik.setFieldValue('name', '')
          formik.setTouched({}, false)
          dispatch(pushSuccessNotification('Имя пользователя успешно изменено'))
        })
        .catch(() => {
          formik.setSubmitting(false)
          formik.setFieldValue('name', '')
          formik.setTouched({}, false)
          dispatch(pushDangerNotification('Ошибка, попробуйте позднее'))
        })
    }
  }

  const handleImageUpload = (e: any) => {
    if (e.target.files.length !== 0) {
      setSrc(URL.createObjectURL(e.target.files[0]))
      setModalOpen(true)
    }
  }

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
        <Typography
          variant="h5"
          color="initial"
          sx={{ margin: '20px 0 30px 0', textAlign: 'center' }}
        >
          {user?.displayName}
        </Typography>
        {showInput && (
          <>
            <TextField
              label="Новое имя"
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur('name')}
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
              sx={{ width: '100%', marginBottom: '20px' }}
            >
              <CostumButton
                onClick={() => {
                  setShowInput(false),
                    formik.setFieldValue('name', ''),
                    formik.setTouched({}, false)
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
                Сохранить
              </CostumButton>
            </Stack>
          </>
        )}
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: '100%', marginBottom: '25px' }}
        >
          <Button
            variant="contained"
            component="label"
            startIcon={<SupervisorAccountIcon sx={{ color: 'white' }} />}
            disabled={showInput || disabled || showDelete}
            sx={{
              textTransform: 'none',
              padding: '5px 15px',
            }}
            color="success"
          >
            Изменить аватар
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
            Изменить имя
          </CostumButton>
        </Stack>
        {!modalOpen && (
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
            Удалить аватар
          </CostumButton>
        )}
        {showDelete && (
          <Fragment>
            <Stack
              direction="column"
              alignItems="center"
              sx={{ marginBottom: '20px' }}
            >
              <Typography variant="h5" color="error">
                Вы уверены?
              </Typography>
              <Typography variant="body1" color="error">
                Это действие необратимо
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-evenly"
              sx={{ width: '100%' }}
            >
              <CostumButton
                onClick={() => setShowDelete(false)}
                variant="contained"
                disabled={disabled}
                color="error"
              >
                Отмена
              </CostumButton>
              <CostumButton
                onClick={handleImageDelete}
                variant="contained"
                color="success"
                disabled={disabled}
              >
                Удалить
              </CostumButton>
            </Stack>
          </Fragment>
        )}
      </Stack>
      <CropperModal
        src={src}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </Fragment>
  )
}
