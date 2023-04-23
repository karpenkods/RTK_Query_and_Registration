import { FC, useEffect } from 'react'

import {
  pushDangerNotification,
  useAppDispatch,
  useAppSelector,
  useDebounce,
  useGetPostsQuery,
  useGetUsersQuery,
} from '../../common'
import { Posts } from '../Posts'

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
