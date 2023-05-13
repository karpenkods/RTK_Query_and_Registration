/* eslint-disable react-hooks/exhaustive-deps */
import { FC, forwardRef, ReactElement, Ref, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getAuth } from 'firebase/auth'
import { FormikProvider, useFormik } from 'formik'

import {
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'

import {
  CostumButton,
  createCommentSchema,
  openCreateCommentReducer,
  pushDangerNotification,
  pushSuccessNotification,
  useAppDispatch,
  useAppSelector,
  useCreateCommentMutation,
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

export const CreateCommentModal: FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const user = getAuth().currentUser
  const openCreateComment = useAppSelector(
    (store) => store.menu.openCreateComment,
  )
  const userComment = useAppSelector((store) => store.user.user)
  const postId = useAppSelector((store) => store.posts.postId)
  const focus = useFocus(openCreateComment)

  const [createComment, { isSuccess, isError }] = useCreateCommentMutation()

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    validationSchema: createCommentSchema(t),
    onSubmit: async (values) => {
      createComment({
        message: values.message,
        owner: userComment.id ?? '',
        post: postId,
      })
    },
  })

  useEffect(() => {
    if (isSuccess) {
      dispatch(openCreateCommentReducer(false)), formik.resetForm()
      dispatch(pushSuccessNotification(`${t('commentCreated')}`))
    }

    if (isError) {
      dispatch(pushDangerNotification(`${t('errorServerNotResponding')}`))
    }
  }, [isError, isSuccess])

  return (
    <FormikProvider value={formik}>
      <Dialog
        open={openCreateComment}
        TransitionComponent={Transition}
        keepMounted
      >
        <DialogTitle alignSelf="center" fontSize="24px" mb="10px">
          {t('comment')}
        </DialogTitle>
        <DialogContent
          sx={{ padding: '0 20px', textAlign: 'center', width: '500px' }}
        >
          <Stack direction="column" alignItems="center" mb="50px">
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
            sx={{ marginBottom: '10px' }}
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
              dispatch(openCreateCommentReducer(false)), formik.resetForm()
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
      </Dialog>
    </FormikProvider>
  )
}
