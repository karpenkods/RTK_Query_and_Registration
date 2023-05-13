/* eslint-disable react-hooks/exhaustive-deps */
import { FC, forwardRef, ReactElement, Ref, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog, DialogActions, DialogTitle, Slide } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'

import {
  CostumButton,
  openRemovePostReducer,
  pushDangerNotification,
  pushSuccessNotification,
  useAppDispatch,
  useAppSelector,
  useRemovePostMutation,
} from '../../common'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />
})

export const RemovePostModal: FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const openRemovePost = useAppSelector((store) => store.menu.openRemovePost)
  const postId = useAppSelector((store) => store.posts.postId)

  const [removePost, { isLoading, isError, isSuccess }] =
    useRemovePostMutation()

  const handleDeletePost = () => {
    removePost(postId)
  }

  useEffect(() => {
    if (isSuccess) {
      dispatch(pushSuccessNotification(`${t('postDeleted')}`))
      dispatch(openRemovePostReducer(false))
    }

    if (isError)
      dispatch(pushDangerNotification(`${t('errorServerNotResponding')}`))
  }, [dispatch, isError, isSuccess])

  return (
    <Dialog open={openRemovePost} TransitionComponent={Transition} keepMounted>
      <DialogTitle padding="20px 0" alignSelf="center" fontSize="24px">
        {isLoading ? `${t('wait')}` : `${t('deletePost')}`}
      </DialogTitle>
      <DialogActions
        sx={{
          width: '100%',
          padding: '20px',
          alignSelf: 'center',
          justifyContent: 'space-between',
          gap: '50px',
        }}
      >
        <CostumButton
          onClick={() => dispatch(openRemovePostReducer(false))}
          variant="contained"
          color="primary"
          size="large"
          disabled={isLoading}
          sx={{ fontSize: '18px', color: 'white' }}
        >
          {t('cancel')}
        </CostumButton>
        <CostumButton
          onClick={handleDeletePost}
          variant="contained"
          color="error"
          size="large"
          disabled={isLoading}
          sx={{ fontSize: '18px', color: 'white' }}
        >
          {t('delete')}
        </CostumButton>
      </DialogActions>
    </Dialog>
  )
}
