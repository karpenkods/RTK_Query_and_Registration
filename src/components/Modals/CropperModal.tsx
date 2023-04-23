/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useRef, useState } from 'react'
import AvatarEditor from 'react-avatar-editor'
import { getAuth, updateProfile } from 'firebase/auth'
import { getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage'

import {
  CircularProgress,
  IconButton,
  Modal,
  Slider,
  Stack,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak'

import {
  CostumButton,
  IPropsCropperModal,
  pushDangerNotification,
  pushSuccessNotification,
  useAppDispatch,
} from '../../common'

export const CropperModal: FC<IPropsCropperModal> = ({
  src,
  modalOpen,
  setModalOpen,
}) => {
  const [slideValue, setSlideValue] = useState(10)
  const [loadingImage, setLoadingImage] = useState(false)
  const [file, setFile] = useState(null)

  const user = getAuth().currentUser
  const storage = getStorage()
  const cropRef = useRef<any>(null)
  const dispatch = useAppDispatch()

  const handleSave = () => {
    if (cropRef.current) {
      setLoadingImage(true)
      const dataUrl = cropRef.current.getImageScaledToCanvas().toDataURL()
      setFile(dataUrl)
      setSlideValue(10)
    }
  }

  useEffect(() => {
    if (file) {
      const path = file ? `avatars/${user?.email}` : ''
      const imagesRef = ref(storage, path)
      uploadString(imagesRef, file, 'data_url').then(() => {
        getDownloadURL(imagesRef).then((url) => {
          if (user) {
            updateProfile(user, {
              displayName: user.displayName,
              photoURL: url,
            })
              .then(() => {
                setLoadingImage(false)
                setModalOpen(false)
                dispatch(pushSuccessNotification('Аватар изменён'))
              })
              .catch(() => {
                setLoadingImage(false)
                dispatch(
                  pushDangerNotification('Ошибка загрузки, попробуйте позднее'),
                )
              })
          }
        })
      })
    }
  }, [file])

  return (
    <Modal
      open={modalOpen}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {loadingImage ? (
        <CircularProgress
          color="success"
          style={{ width: '80px', height: '80px' }}
        />
      ) : (
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{
            position: 'relative',
            width: '350px',
            height: '350px',
          }}
        >
          <AvatarEditor
            ref={cropRef}
            image={src ?? ''}
            style={{ width: '100%', height: '100%' }}
            border={50}
            borderRadius={150}
            color={[0, 0, 0, 0.72]}
            scale={slideValue / 10}
            rotate={0}
          />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ margin: '30px 0 20px 0' }}
          >
            <IconButton
              onClick={() => setSlideValue(slideValue === 10 ? 50 : 10)}
              sx={{ margin: 0, padding: 0, marginRight: '30px' }}
            >
              <CenterFocusWeakIcon
                sx={{
                  width: '35px',
                  height: '35px',
                  color: '#1976D2',
                }}
              />
            </IconButton>
            <Slider
              min={10}
              max={50}
              sx={{
                width: '285px',
                color: '#1976D2',
              }}
              size="medium"
              defaultValue={slideValue}
              value={slideValue}
              onChange={(event: Event, newValue: number | number[]) =>
                setSlideValue(newValue as number)
              }
            />
          </Stack>
          <IconButton
            onClick={() => {
              setModalOpen(false), setFile(null), setSlideValue(10)
            }}
            sx={{
              position: 'absolute',
              top: '-17%',
              left: '87%',
            }}
          >
            <CloseIcon
              sx={{
                color: 'white',
                width: '30px',
                height: '30px',
              }}
            />
          </IconButton>
          <CostumButton
            color="primary"
            variant="contained"
            onClick={handleSave}
            sx={{ alignSelf: 'flex-end' }}
          >
            Сохранить
          </CostumButton>
        </Stack>
      )}
    </Modal>
  )
}
