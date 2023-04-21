/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  CircularProgress,
  Button,
  TextareaAutosize,
  Typography,
} from '@mui/material'
import ReplyAllIcon from '@mui/icons-material/ReplyAll'

import { useAppDispatch } from '../../common/hooks'
import {
  pushDangerNotification,
  pushSuccessNotification,
  useGetPostQuery,
  useGetUsersQuery,
  usePutPostMutation,
} from '../../common/redux'

import './posts.scss'

export const Post: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const {
    data: post,
    isLoading: postLoading,
    isError: postError,
  } = useGetPostQuery(id as unknown as number)

  const { data: users, isError: usersError } = useGetUsersQuery('')

  const [
    updatePost,
    { isSuccess: successUpdatePost, isError: errorUpdatePost },
  ] = usePutPostMutation()

  const [editPost, setEditPost] = useState<boolean>(false)
  const [message, setMessage] = useState(post ? post.body : '')

  const handleChangeMessage = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value)
  }

  const handleUpdatePost = () => {
    updatePost({
      id: post?.id,
      userId: post?.userId,
      title: post?.title,
      body: message,
    })
    setEditPost(false)
  }

  useEffect(() => {
    if (successUpdatePost) {
      dispatch(pushSuccessNotification(`Пост №_${post?.id} обновлён`))
    } else if (errorUpdatePost) {
      dispatch(
        pushDangerNotification('Ошибка при обновлении, попробуйте позднее'),
      )
    } else if (postError || usersError) {
      dispatch(pushDangerNotification('Ошибка, проверьте подключение к сети'))
    }
  }, [dispatch, errorUpdatePost, postError, successUpdatePost, usersError])

  const userName = users?.find((el) => el.id === post?.userId)?.name
  const userNickName = users?.find((el) => el.id === post?.userId)?.username

  if (postError || usersError) {
    return (
      <Typography variant="h3" color="error">
        Ошибка получения данных с сервера
      </Typography>
    )
  }

  return (
    <div className="post">
      <h2 className="post__heading">{`Пост №${id}`}</h2>
      {postLoading ? (
        <div className="post__loading">
          <CircularProgress color="success" />
        </div>
      ) : (
        <>
          <p className="post__user">{`Пользователь: ${userName} (${userNickName})`}</p>
          <div className="post__textBlock">
            <p className="post__title">{post?.title}</p>
            {editPost ? (
              <TextareaAutosize
                placeholder="Редактирование"
                defaultValue={post?.body}
                onChange={handleChangeMessage}
                className="post__text"
                style={{
                  maxWidth: '770px',
                  padding: '5px',
                  overflow: 'auto',
                  border: 'none',
                  backgroundColor: 'inherit',
                  color: 'blue',
                }}
              />
            ) : (
              <p className="post__text">{post?.body}</p>
            )}
          </div>
          <div className="post__blockBtn">
            <Button
              onClick={() => navigate(-1)}
              variant="contained"
              color="secondary"
              startIcon={<ReplyAllIcon sx={{ color: '#fff ' }} />}
              sx={{ textTransform: 'none' }}
            >
              Назад
            </Button>
            {!editPost ? (
              <Button
                onClick={() => setEditPost(true)}
                variant="contained"
                color="primary"
                sx={{ textTransform: 'none' }}
              >
                Редактировать пост
              </Button>
            ) : (
              <div>
                <Button
                  onClick={() => setEditPost(false)}
                  variant="contained"
                  color="error"
                  sx={{ textTransform: 'none', marginRight: '20px' }}
                >
                  Отменить
                </Button>
                <Button
                  onClick={handleUpdatePost}
                  variant="contained"
                  color="success"
                  sx={{ textTransform: 'none' }}
                >
                  Отправить
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
