import { ChangeEvent, FC, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button, CircularProgress, TextField, Typography } from '@mui/material'

import { IPost, IPostsProps } from '../../common/models'
import { useAppDispatch, useAppSelector } from '../../common/hooks'
import { CardPost } from './CardPost'
import { CreatePostModal } from '../CreatePostModal/CreatePostModsl'
import { limitReducer } from '../../common/redux'

import './posts.scss'

export const Posts: FC<IPostsProps> = ({
  isLoading,
  posts,
  errorPosts,
  errorUsers,
  users,
}) => {
  const [searchPost, setSearchPost] = useState('')
  const [openModal, setOpenModal] = useState(false)

  const dispatch = useAppDispatch()

  const limit = useAppSelector((store) => store.posts.limit)

  const searchPosts = posts?.filter((el) =>
    el.title?.includes(searchPost.toLowerCase() || searchPost.toUpperCase()),
  )

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchPost(event.target.value)
  }

  const handleLimit = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(limitReducer(event.target.value as unknown as number))
  }

  const handleUpdate = () => {
    dispatch(limitReducer(100))
  }

  const user = users?.map((el) => el.name)

  if (errorPosts || errorUsers) {
    return (
      <Typography variant="h3" color="error">
        Постов нет
      </Typography>
    )
  }

  return (
    <div className="posts">
      <h2 className="posts__title">RTK Query</h2>
      <div className="posts__count">
        <h5 className="posts__title">
          Количество постов: {searchPosts?.length}
        </h5>
        <h5 className="posts__title">Юзеров: {new Set(user).size}</h5>
      </div>
      {posts?.length !== 0 && (
        <Button
          onClick={() => setOpenModal(true)}
          variant="contained"
          color="success"
          sx={{
            alignSelf: 'flex-start',
            margin: '20px 0 0 0',
            textTransform: 'none',
          }}
        >
          Создать пост
        </Button>
      )}
      <div className="posts__inputs">
        <TextField
          id="limit"
          label="Количество постов"
          type="number"
          value={limit === 100 ? '' : limit}
          onChange={handleLimit}
          className="posts__input"
        />
        <TextField
          id="search"
          label="Поиск комментария..."
          type="text"
          value={searchPost}
          onChange={handleSearch}
          className="posts__input"
        />
      </div>
      {isLoading ? (
        <div className="posts__loading">
          <CircularProgress color="success" />
        </div>
      ) : posts?.length === 0 ? (
        <div className="posts__notPosts">
          <h1>Постов нет</h1>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            sx={{ marginTop: '30px', textTransform: 'none', fontSize: 18 }}
          >
            Обновить запрос
          </Button>
        </div>
      ) : (
        searchPosts?.reverse().map((post: IPost | undefined) => (
          <div key={post?.id} className="posts__block">
            <Link to={`/user/${post?.userId}`} className="posts__link_user">
              {users?.find((el) => el.id === post?.userId)?.name}
              {' ('}
              {users?.find((el) => el.id === post?.userId)?.username}
              {')'}
            </Link>
            <div className="posts__post">
              <Link to={`/post/${post?.id}`} className="posts__link">
                <CardPost
                  post={post}
                  userId={users?.find((el) => el.id === post?.userId)?.id}
                />
              </Link>
            </div>
          </div>
        ))
      )}
      <CreatePostModal
        posts={posts}
        users={users}
        openModal={openModal}
        onOpen={setOpenModal}
      />
    </div>
  )
}
