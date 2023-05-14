/* eslint-disable react-hooks/exhaustive-deps */
import { FC, forwardRef, ReactElement, Ref, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getAuth } from 'firebase/auth'
import { FormikProvider, useFormik } from 'formik'

import {
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

import {
  CostumButton,
  createPostSchema,
  FileUpload,
  openCreatePostReducer,
  PostTags,
  pushDangerNotification,
  pushSuccessNotification,
  useAppDispatch,
  useAppSelector,
  useCreatePostMutation,
  useFocus,
} from '../../common'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />
})

export const CreatePostModal: FC = () => {
  const [picture, setPicture] = useState<any>()
  const [urlPicture, setUrlPicture] = useState<null | string>()

  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const user = getAuth().currentUser
  const openCreatePost = useAppSelector((store) => store.menu.openCreatePost)
  const userPost = useAppSelector((store) => store.user.user)
  const focus = useFocus(openCreatePost)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down(600))

  const [createPost, { isSuccess, isError }] = useCreatePostMutation()

  const formik = useFormik({
    initialValues: {
      message: '',
      tags: [],
      imageUrl:
        urlPicture ??
        'https://mobimg.b-cdn.net/v3/fetch/74/74739e1770f31cdbfdde99cc0b2925d3.jpeg?w=1470&r=0.5625',
    },
    validationSchema: createPostSchema(t),
    onSubmit: async (values) => {
      createPost({
        text: values.message,
        image: values.imageUrl,
        tags: values.tags,
        owner: userPost.id,
      })
    },
  })

  useEffect(() => {
    if (isSuccess) {
      dispatch(openCreatePostReducer(false)), formik.resetForm()
      dispatch(pushSuccessNotification(`${t('postCreated')}`))
    }

    if (isError) {
      dispatch(pushDangerNotification(`${t('errorServerNotResponding')}`))
    }
  }, [isError, isSuccess])

  const deletePicture = () => {
    setUrlPicture(null)
  }

  return (
    <FormikProvider value={formik}>
      <Dialog
        open={openCreatePost}
        TransitionComponent={Transition}
        keepMounted
      >
        <DialogTitle alignSelf="center" fontSize="24px" mb="10px">
          {t('newPost')}
        </DialogTitle>
        <DialogContent
          sx={{
            padding: '0 20px',
            textAlign: 'center',
            width: isMobile ? '100%' : '500px',
          }}
        >
          <Stack direction="column" alignItems="center" mb="20px">
            <Avatar
              alt="avatar"
              src={user?.photoURL ? user?.photoURL : ''}
              sx={{
                marginBottom: '10px',
                width: '120px',
                height: '120px',
              }}
            />
            <Typography
              variant="h6"
              textAlign="center"
              margin="10px 0 10px 0"
              lineHeight={1.2}
            >
              {user?.displayName}
            </Typography>
            <Typography variant="body1">{user?.email}</Typography>
          </Stack>
          <Stack mt={isMobile ? '40px' : 0}>
            <TextField
              variant="standard"
              type="text"
              name="message"
              fullWidth
              size="medium"
              multiline
              placeholder={`${t('message')}`}
              inputRef={focus}
              maxRows={10}
              sx={{ marginBottom: isMobile ? '20px' : '10px' }}
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
            <PostTags disabled={formik.isSubmitting} />
            {urlPicture ? (
              <Stack
                direction="column"
                alignItems="center"
                mt={isMobile ? '20px' : 0}
              >
                <img
                  src={urlPicture}
                  width={250}
                  height={150}
                  alt="Cover"
                  style={{ marginBottom: 10, objectFit: 'contain' }}
                />
                <Stack direction="row" alignItems="center">
                  <Typography variant="body2" color="primary" mr="20px">
                    {picture?.name}
                  </Typography>
                  <IconButton
                    aria-label="delete"
                    color="info"
                    onClick={deletePicture}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Stack>
              </Stack>
            ) : (
              <Stack
                direction="column"
                alignItems="center"
                mt={isMobile ? '20px' : 0}
              >
                <img
                  src="https://mobimg.b-cdn.net/v3/fetch/74/74739e1770f31cdbfdde99cc0b2925d3.jpeg?w=1470&r=0.5625"
                  width={250}
                  height={150}
                  alt="Cover"
                  style={{ marginBottom: 10 }}
                />
                <FileUpload
                  setFile={setPicture}
                  accept="image/*"
                  setUrl={setUrlPicture}
                >
                  <CostumButton
                    variant="text"
                    color="primary"
                    sx={{ height: '40px' }}
                  >
                    {t('chooseImage')}
                  </CostumButton>
                </FileUpload>
              </Stack>
            )}
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            width: '100%',
            padding: '20px',
            alignSelf: 'center',
            justifyContent: 'space-between',
          }}
        >
          <CostumButton
            onClick={() => {
              dispatch(openCreatePostReducer(false)), formik.resetForm()
            }}
            variant="contained"
            color="error"
            size="large"
            disabled={formik.isSubmitting}
            sx={{ fontSize: '18px', color: 'white' }}
          >
            {t('cancel')}
          </CostumButton>
          <CostumButton
            onClick={() => formik.handleSubmit()}
            variant="contained"
            color="primary"
            size="large"
            disabled={formik.isSubmitting || !formik.dirty}
            sx={{ fontSize: '18px', color: 'white' }}
          >
            {t('create')}
          </CostumButton>
        </DialogActions>
        <Typography
          variant="caption"
          margin="0 20px 20px 20px"
          textAlign="center"
          maxWidth="450px"
        >
          {t('testServer')}
        </Typography>
      </Dialog>
    </FormikProvider>
  )
}
