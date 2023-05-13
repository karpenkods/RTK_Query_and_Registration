/* eslint-disable react-hooks/exhaustive-deps */
import { FC, forwardRef, Fragment, ReactElement, Ref, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'

import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
  TextField,
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'

import {
  changePostSchema,
  CostumButton,
  openChangePostReducer,
  pushDangerNotification,
  pushSuccessNotification,
  useAppDispatch,
  useAppSelector,
  useLazyGetPostQuery,
  useUpdatePostMutation,
} from '../../common'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />
})

export const ChangePostModal: FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const openChangePost = useAppSelector((store) => store.menu.openChangePost)
  const postId = useAppSelector((store) => store.posts.postId)

  const [getPost, { data: post, isLoading: loadingPost, isError: errorPost }] =
    useLazyGetPostQuery()

  useEffect(() => {
    if (postId) getPost(postId)
  }, [getPost, postId])

  const [
    updatePost,
    { isError: errorChangePost, isSuccess: successChangePost },
  ] = useUpdatePostMutation()

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    validationSchema: changePostSchema(t),
    onSubmit: async (values) => {
      updatePost({
        id: post?.id,
        text: values.message,
      })
    },
  })

  useEffect(() => {
    if (successChangePost) {
      dispatch(openChangePostReducer(false)),
        dispatch(pushSuccessNotification(`${t('postEdited')}`))
    }

    if (errorPost) {
      dispatch(openChangePostReducer(false)),
        dispatch(pushDangerNotification(`${t('errorServerNotResponding')}`))
    }

    if (errorChangePost)
      dispatch(pushDangerNotification(`${t('errorServerNotResponding')}`))
  }, [dispatch, errorChangePost, errorPost, successChangePost])

  return (
    <Dialog open={openChangePost} TransitionComponent={Transition} keepMounted>
      <DialogTitle padding="20px 0" alignSelf="center" fontSize="24px">
        {t('postEditing')}
      </DialogTitle>
      {loadingPost ? (
        <Stack
          justifyContent="center"
          alignItems="center"
          width="330px"
          height="250px"
        >
          <CircularProgress size={50} color="success" />
        </Stack>
      ) : (
        <Fragment>
          <DialogContent
            sx={{ padding: '0 20px', textAlign: 'center', width: '500px' }}
          >
            <TextField
              variant="standard"
              type="text"
              name="message"
              fullWidth
              size="medium"
              multiline
              maxRows={10}
              value={
                !formik.values.message.length
                  ? post?.text
                  : formik.values.message
              }
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
                dispatch(openChangePostReducer(false)), formik.resetForm()
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
              {t('save')}
            </CostumButton>
          </DialogActions>
        </Fragment>
      )}
    </Dialog>
  )
}
