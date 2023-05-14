/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import {
  Avatar,
  CircularProgress,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import {
  CostumButton,
  IPostPageProps,
  openCreateCommentReducer,
  pushDangerNotification,
  useAppDispatch,
  useAppSelector,
  useGetPostQuery,
  useLazyGetCommentsByPostQuery,
  useLazyGetUserQuery,
} from '../../common'
import { CreateCommentModal } from '../Modals'

export const Post: FC<IPostPageProps> = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const postId = useAppSelector((store) => store.posts.postId)
  const userAnonymous = useAppSelector((store) => store.user.anonymous)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down(600))
  const isTablet = useMediaQuery(theme.breakpoints.down(960))

  const {
    data: post,
    isLoading: loadingPost,
    isError: errorPost,
  } = useGetPostQuery(postId)
  const [getUser, { data: user }] = useLazyGetUserQuery()
  const [
    getComments,
    { data: comments, isLoading: loadingComment, isError: errorComment },
  ] = useLazyGetCommentsByPostQuery()

  useEffect(() => {
    if (!!post && post.id) {
      getUser(post.owner.id)
      getComments(post?.id)
    }
  }, [getComments, getUser, post])

  useEffect(() => {
    if (errorComment || errorPost) {
      navigate('/posts')
      dispatch(pushDangerNotification(`${t('errorServerNotResponding')}`))
    }
  }, [errorComment, errorPost])

  return (
    <Stack direction={isTablet ? 'column' : 'row'} width="100%" mb="100px">
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        flexBasis="50%"
      >
        <Link
          to="/posts"
          style={{
            alignSelf: 'flex-start',
            margin: '0 0 30px 150px',
          }}
        >
          <CostumButton
            variant="contained"
            color="success"
            sx={{
              color: 'white',
            }}
          >
            {t('postList')}
          </CostumButton>
        </Link>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          width={isMobile ? '100%' : '500px'}
          padding="30px"
          borderRadius="10px"
          mb="50px"
          sx={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(100px)',
          }}
        >
          <Avatar
            src={user?.picture}
            sx={{
              width: isMobile ? '80px' : '120px',
              height: isMobile ? '80px' : '120px',
            }}
          />
          <Stack>
            <Stack direction="row" mb="20px">
              <Typography mr="10px" variant="h5">
                {user?.firstName}
              </Typography>
              <Typography variant="h5">{user?.lastName}</Typography>
            </Stack>
            <Stack>
              {!isMobile && (
                <Typography variant="subtitle1">{user?.email}</Typography>
              )}
              <Typography variant="subtitle1">{user?.phone}</Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack maxWidth="600px">
          <Stack justifyContent="center" alignItems="center">
            {loadingPost ? (
              <Skeleton
                animation="wave"
                variant="rounded"
                width={600}
                height={400}
              />
            ) : (
              <img
                src={post?.image}
                width="100%"
                height="100%"
                alt="img"
                style={{
                  marginBottom: 20,
                  objectFit: 'cover',
                  borderRadius: 5,
                }}
              />
            )}

            <Typography variant="h6" alignSelf="flex-start">
              {post?.text}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="column" alignItems="center" flexBasis="50%">
        <Typography
          variant="h3"
          color="tomato"
          fontFamily="marckScript !important"
          mb="20px"
          mt={isTablet ? '50px' : 0}
        >
          {t('comments')}
        </Typography>
        {loadingComment || !post ? (
          <CircularProgress
            size={80}
            color="success"
            sx={{ marginTop: '100px' }}
          />
        ) : comments?.data.length ? (
          <Stack width="80%" gap="30px">
            {comments.data.map((comment, i) => (
              <Stack
                key={comment.id}
                padding="10px 20px 20px 20px"
                borderRadius="10px"
                alignSelf={i % 2 === 0 ? 'flex-start' : 'flex-end'}
                width="90%"
                sx={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(100px)',
                }}
              >
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="primary">
                    {moment(comment.publishDate).format('DD.MM.YYYY')}
                  </Typography>
                  <Stack direction="row" mb="20px">
                    <Typography mr="10px" variant="body2" color="primary">
                      {comment.owner.firstName}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {comment.owner.lastName}
                    </Typography>
                  </Stack>
                </Stack>
                <Typography ml="20px" variant="body1">
                  {comment.message}
                </Typography>
              </Stack>
            ))}
          </Stack>
        ) : (
          <Typography mt="100px" variant="h5">
            {t('noComments')}
          </Typography>
        )}
        {!loadingComment && post && (
          <CostumButton
            onClick={() => dispatch(openCreateCommentReducer(true))}
            variant="contained"
            disabled={userAnonymous}
            color="primary"
            sx={{
              alignSelf: 'flex-end',
              color: 'white',
              margin: '30px 100px 0 0',
            }}
          >
            {t('addComment')}
          </CostumButton>
        )}
        <CreateCommentModal />
      </Stack>
    </Stack>
  )
}
