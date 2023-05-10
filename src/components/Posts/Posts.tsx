import {
  ChangeEvent,
  FC,
  Fragment,
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  Grid,
  Stack,
  TextField,
  InputAdornment,
  AppBar,
  IconButton,
  Pagination,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'

import {
  CostumBackground,
  CostumButton,
  IPost,
  SkeletonCardPosts,
  limitReducer,
  pushDangerNotification,
  useAppDispatch,
  useAppSelector,
  useDebounce,
  useGetPostsQuery,
  useLazyGetPostsTagsQuery,
} from '../../common'
import { PostCard } from './PostCard'
import { RemovePostModal } from '../Modals'

export const Posts: FC = () => {
  const [searchPost, setSearchPost] = useState('')
  const [searchText, setSearchText] = useState('')
  const [postsAll, setPostsAll] = useState<IPost[]>([])
  const [postsAllSearchText, setPostsAllSearchText] = useState<IPost[]>([])
  const [show, setShow] = useState(false)
  const [page, setPage] = useState(1)

  const dispatch = useAppDispatch()
  const limit = useAppSelector((store) => store.posts.limit)

  const debounceLimitNumber = useDebounce<number>(limit)
  const debounceLimitString = useDebounce<string>(searchPost)

  const {
    data: posts,
    isLoading: loadingPosts,
    isError: errorPosts,
  } = useGetPostsQuery({ page, debounceLimitNumber })

  const [
    getPostsTags,
    { data: postsTags, isLoading: loadingPostsTags, isError: errorPostsTags },
  ] = useLazyGetPostsTagsQuery()

  const handleLimit = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if ((event.target.value as unknown as number) <= 50) {
        dispatch(limitReducer(event.target.value as unknown as number))
        setPage(1)
      }
    },
    [dispatch],
  )

  useEffect(() => {
    if (debounceLimitNumber < 5)
      setTimeout(() => dispatch(limitReducer(5)), 500)
  }, [debounceLimitNumber, dispatch])

  useEffect(() => {
    if (searchText.length && posts?.data)
      setPostsAllSearchText(
        posts?.data.filter((el) =>
          el.text
            ? el.text.toLowerCase().includes(searchText.toLowerCase())
            : false,
        ),
      )
  }, [posts?.data, searchText])

  useEffect(() => {
    if (debounceLimitString.length) {
      getPostsTags({
        tagId: debounceLimitString,
        page,
        debounceLimitNumber,
      })
      setPostsAll(postsTags?.data ?? [])
    } else setPostsAll(posts?.data ?? [])

    if (errorPosts || errorPostsTags)
      dispatch(pushDangerNotification('Ошибка, сервер не отвечает'))
  }, [
    debounceLimitNumber,
    debounceLimitString,
    dispatch,
    errorPosts,
    errorPostsTags,
    getPostsTags,
    page,
    posts?.data,
    postsTags?.data,
  ])

  if (loadingPosts || loadingPostsTags) return <SkeletonCardPosts />

  return (
    <Fragment>
      <Stack direction="column">
        <AppBar position="fixed">
          {show ? (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              margin="95px 30px 10px 30px"
            >
              <IconButton
                onClick={() => {
                  setShow(false),
                    setSearchPost(''),
                    dispatch(limitReducer(12)),
                    setSearchText('')
                }}
                sx={{ padding: 0 }}
              >
                <CloseIcon style={{ width: 35, height: 35 }} />
              </IconButton>
              <CostumButton variant="contained" color="success">
                Создать пост
              </CostumButton>
              <TextField
                id="search"
                placeholder="Найти пост по тегу"
                variant="standard"
                type="text"
                value={searchPost}
                sx={{ width: 300 }}
                helperText="Поиск по всем постам"
                disabled={!!searchText.length}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setSearchPost(event.target.value)
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchPost.length > 0 ? (
                        <IconButton
                          onClick={() => setSearchPost('')}
                          sx={{ padding: 0 }}
                        >
                          <CloseIcon />
                        </IconButton>
                      ) : null}
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                id="limit"
                placeholder="Количество постов"
                variant="standard"
                type="number"
                value={limit === 12 ? '' : limit}
                onChange={handleLimit}
                helperText="Диапазон: 5-50 постов на странице"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CostumButton
                        variant="text"
                        onClick={() => dispatch(limitReducer(12))}
                        sx={{ padding: 0 }}
                      >
                        Сбросить
                      </CostumButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                id="search"
                placeholder="Найти пост по тексту"
                variant="standard"
                type="text"
                value={searchText}
                disabled={!!searchPost.length}
                helperText="Поиск по каждой странице"
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setSearchText(event.target.value)
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchText.length > 0 ? (
                        <IconButton
                          onClick={() => setSearchText('')}
                          sx={{ padding: 0 }}
                        >
                          <CloseIcon />
                        </IconButton>
                      ) : null}
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          ) : (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              margin="80px 30px 5px 30px"
            >
              <IconButton
                onClick={() => setShow(true)}
                sx={{ width: 'fit-content', padding: 0 }}
              >
                <MenuOpenIcon style={{ width: 35, height: 35 }} />
              </IconButton>
              <Typography variant="body2" color="primary">
                Особенность сервера: после применения фильтров, сервер не всегда
                корректно отдаёт количество постов или страниц
              </Typography>
            </Stack>
          )}
          <CostumBackground />
        </AppBar>
        {errorPosts ||
        errorPostsTags ||
        !postsAll.length ||
        (!!searchText.length && !postsAllSearchText.length) ? (
          <Typography
            variant="h1"
            color="tomato"
            sx={{ fontFamily: 'marckScript !important' }}
          >
            Постов нет
          </Typography>
        ) : (
          <Fragment>
            <Grid
              container
              justifyContent="center"
              spacing={4}
              mt="50px"
              mb="50px"
              width={
                postsAll.length < 4 ||
                (!!searchText.length && postsAllSearchText.length < 4)
                  ? '90vw'
                  : undefined
              }
            >
              {searchText.length
                ? postsAllSearchText.map((post) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={post.id}>
                      <PostCard
                        post={post}
                        onClickChip={setSearchPost}
                        onShow={setShow}
                        searchText={searchText}
                      />
                    </Grid>
                  ))
                : postsAll.map((post) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={post.id}>
                      <PostCard
                        post={post}
                        onClickChip={setSearchPost}
                        onShow={setShow}
                        searchText={searchText}
                      />
                    </Grid>
                  ))}
            </Grid>
            <Stack alignSelf="center" mb={10}>
              <Pagination
                count={
                  postsTags?.data
                    ? Math.trunc(
                        (postsTags?.total ?? 0) /
                          (debounceLimitNumber < 5 ? 5 : debounceLimitNumber),
                      )
                    : Math.trunc(
                        (posts?.total ?? 0) /
                          (debounceLimitNumber < 5 ? 5 : debounceLimitNumber),
                      )
                }
                page={page}
                onChange={(event: ChangeEvent<unknown>, value: number) =>
                  setPage(value)
                }
                showFirstButton
                showLastButton
                sx={{
                  '.MuiPaginationItem-root': {
                    fontSize: 18,
                    margin: '0 5px',
                  },
                }}
              />
            </Stack>
          </Fragment>
        )}
      </Stack>
      <RemovePostModal />
    </Fragment>
  )
}
