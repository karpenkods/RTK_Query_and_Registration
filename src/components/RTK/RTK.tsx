import { FC, useEffect } from 'react'

import {
  pushDangerNotification,
  useGetPostsQuery,
  useGetUsersQuery,
} from '../../common/redux'
import { Posts } from '../Posts/Posts'
import { useAppDispatch, useAppSelector, useDebounce } from '../../common/hooks'

export const RTK: FC = () => {
  const dispatch = useAppDispatch()
  const limit = useAppSelector((store) => store.posts.limit)

  const debounceLimit = useDebounce(limit)

  const {
    data: posts,
    isLoading: loadingPosts,
    isError: errorPosts,
  } = useGetPostsQuery(debounceLimit)

  const { data: users, isError: errorUsers } = useGetUsersQuery('')

  useEffect(() => {
    if (errorPosts || errorUsers) {
      dispatch(pushDangerNotification('Ошибка, проверьте подключение к сети'))
    }
  }, [dispatch, errorPosts, errorUsers])

  return (
    <Posts
      posts={posts}
      isLoading={loadingPosts}
      errorPosts={errorPosts}
      errorUsers={errorUsers}
      users={users}
    />
  )
}
