/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useRef, useState } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { useFormik } from 'formik'

import { Avatar, Typography, Button, TextField } from '@mui/material'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import CreateIcon from '@mui/icons-material/Create'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'

import { useAppDispatch, useAvatar } from '../../common/hooks'
import {
  pushDangerNotification,
  pushSuccessNotification,
} from '../../common/redux'
import { CropperModal } from '../CrooperModal/CropperModal'
import { settingsUserSchema } from '../../common/validations/validationSchema'

export const SettingAvatar: FC = () => {
  const [showInput, setShowInput] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const [src, setSrc] = useState<string | null>(null)

  const auth = getAuth()
  const user = auth.currentUser
  const avatar = useAvatar(user?.displayName ? user.displayName : 'А П')
  const refFocus = useRef<HTMLInputElement>(null)
  const dispatch = useAppDispatch()

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: settingsUserSchema,
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
          dispatch(pushSuccessNotification('Аватар удалён'))
        })
        .catch(() => {
          setDisabled(false)
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

  useEffect(() => {
    if (showInput) refFocus?.current?.focus()
  }, [showInput])

  const handleImageUpload = (e: any) => {
    if (e.target.files.length !== 0) {
      setSrc(URL.createObjectURL(e.target.files[0]))
      setModalOpen(true)
    }
  }

  return (
    <>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
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
              required
              type="text"
              name="name"
              value={formik.values.name ?? ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur('name')}
              inputRef={refFocus}
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
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <Button
                onClick={() => {
                  setShowInput(false),
                    formik.setFieldValue('name', ''),
                    formik.setTouched({}, false)
                }}
                variant="contained"
                disabled={formik.isSubmitting}
                color="error"
                sx={{
                  textTransform: 'none',
                  padding: '5px 20px',
                }}
              >
                Отмена
              </Button>
              <Button
                onClick={() => formik.handleSubmit()}
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting || !formik.dirty}
                sx={{
                  textTransform: 'none',
                  padding: '5px 20px',
                }}
              >
                Сохранить
              </Button>
            </div>
          </>
        )}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '25px',
          }}
        >
          <Button
            variant="contained"
            component="label"
            startIcon={<SupervisorAccountIcon sx={{ color: 'white' }} />}
            disabled={showInput || disabled}
            color="success"
            sx={{
              textTransform: 'none',
              padding: '5px 10px',
            }}
          >
            Изменить аватар
            <input
              onChange={handleImageUpload}
              hidden
              accept="image/*"
              type="file"
            />
          </Button>
          <Button
            onClick={() => {
              setShowInput(true)
            }}
            variant="contained"
            color="primary"
            startIcon={<CreateIcon sx={{ color: 'white' }} />}
            disabled={showInput || disabled}
            sx={{
              textTransform: 'none',
              padding: '5px 10px',
            }}
          >
            Изменить имя
          </Button>
        </div>
        {!modalOpen && (
          <Button
            variant="contained"
            component="label"
            startIcon={<RemoveCircleOutlineIcon sx={{ color: 'white' }} />}
            disabled={showInput || !user?.photoURL?.length || disabled}
            onClick={handleImageDelete}
            color="error"
            sx={{
              alignSelf: 'flex-start',
              textTransform: 'none',
              padding: '5px 10px',
            }}
          >
            Удалить аватар
          </Button>
        )}
      </div>
      <main className="container">
        <CropperModal
          src={src}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      </main>
    </>
  )
}
