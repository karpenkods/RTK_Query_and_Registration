/* eslint-disable react-hooks/exhaustive-deps */
import { FC, MouseEvent, useEffect } from 'react'
import clsx from 'clsx'

import Button from '@mui/material/Button'

import {
  pushDangerNotification,
  pushWarningNotification,
  useDeletePostMutation,
  useDeleteUserMutation,
} from '../../common/redux'
import { IPostCardProps } from '../../common/models'
import { useAppDispatch } from '../../common/hooks'

import './posts.scss'

export const CardPost: FC<IPostCardProps> = ({ post, userId }) => {
  const dispatch = useAppDispatch()

  const [
    deletePostMutation,
    { isSuccess: successDeletePost, isError: errorDeletePost },
  ] = useDeletePostMutation()

  const [
    deleteUserMutation,
    { isSuccess: successDeleteUser, isError: errorDeleteUser },
  ] = useDeleteUserMutation()

  const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (post?.id) {
      deletePostMutation(post.id)
      deleteUserMutation(userId ?? 0)
    }
  }

  useEffect(() => {
    if (successDeletePost && successDeleteUser) {
      dispatch(pushWarningNotification(`Пост №_${post?.id} удалён`))
    } else if (errorDeletePost || errorDeleteUser) {
      dispatch(
        pushDangerNotification('Ошибка при удалении, попробуйте позднее'),
      )
    }
  }, [
    dispatch,
    errorDeletePost,
    errorDeleteUser,
    successDeletePost,
    successDeleteUser,
  ])

  return (
    <div className="posts">
      <div>
        <h5 className="posts__title">{post?.id}</h5>
        <h5 className={clsx('posts__title', 'posts__title_card')}>
          {post?.title}
        </h5>
      </div>
      <Button
        onClick={handleDelete}
        variant="contained"
        color="error"
        sx={{
          alignSelf: 'flex-end',
          marginTop: '15px',
          width: 'fit-content',
          textTransform: 'none',
        }}
      >
        Удалить
      </Button>
    </div>
  )
}
