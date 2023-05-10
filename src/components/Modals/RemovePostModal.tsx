import { FC, forwardRef, ReactElement, Ref, useEffect } from 'react'

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
      dispatch(pushSuccessNotification('Пост удалён'))
      dispatch(openRemovePostReducer(false))
    }

    if (isError) dispatch(pushDangerNotification('Ошибка, сервер не отвечает'))
  }, [dispatch, isError, isSuccess])

  return (
    <Dialog open={openRemovePost} TransitionComponent={Transition} keepMounted>
      <DialogTitle padding="20px 0" alignSelf="center" fontSize="24px">
        {isLoading ? 'Подождите...' : 'Удалить пост?'}
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
          Отмена
        </CostumButton>
        <CostumButton
          onClick={handleDeletePost}
          variant="contained"
          color="error"
          size="large"
          disabled={isLoading}
          sx={{ fontSize: '18px', color: 'white' }}
        >
          Удалить
        </CostumButton>
      </DialogActions>
    </Dialog>
  )
}
