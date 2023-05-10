import { FC, Fragment, useEffect, useState, MouseEvent } from 'react'
import moment from 'moment'

import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import FavoriteIcon from '@mui/icons-material/Favorite'

import {
  IPostProps,
  disLikeReducer,
  likeReducer,
  openChangePostReducer,
  openRemovePostReducer,
  postIdReducer,
  pushDangerNotification,
  useAppDispatch,
  useAppSelector,
  useUpdatePostMutation,
} from '../../common'

export const PostCard: FC<IPostProps> = ({
  post,
  getNumber,
  onClickChip,
  onShow,
  searchText,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const openMenu = Boolean(anchorEl)
  const dispatch = useAppDispatch()
  const like = useAppSelector((store) => store.like.like)

  const [updateLikes, { isLoading: loadingLikes, isError: errorLikes }] =
    useUpdatePostMutation()

  const handleLike = (value: string) => {
    if (post?.likes) {
      updateLikes({
        id: post?.id,
        likes: value === 'likePlus' ? post?.likes + 1 : post?.likes - 1,
      })
    }
  }

  const handleOpenMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (post?.id && getNumber) getNumber(post?.id as unknown as number)
    if (errorLikes)
      dispatch(pushDangerNotification('Ошибка, сервер не отвечает'))
  }, [dispatch, errorLikes, getNumber, post])

  return (
    <Fragment>
      <Card sx={{ borderRadius: 3 }}>
        <CardHeader
          avatar={
            <Avatar
              src={post?.owner?.picture}
              style={{ width: 50, height: 50 }}
            />
          }
          action={
            <IconButton onClick={handleOpenMenu}>
              <MoreVertIcon />
            </IconButton>
          }
          title={`${post?.owner?.firstName}${' '}${post?.owner?.lastName}`}
          subheader={moment(post?.publishDate).format('D.MM.YYYY')}
          sx={{
            '.MuiCardHeader-title': {
              fontSize: 16,
              fontWeight: 'bold',
            },
          }}
        />
        <CardMedia
          component="img"
          height={300}
          image={post?.image}
          alt="photo"
        />
        <CardContent sx={{ height: 80 }}>
          <Typography variant="body2" color="text.secondary">
            {post?.text}
          </Typography>
        </CardContent>
        <CardActions>
          <IconButton
            disabled={loadingLikes}
            onClick={() =>
              post?.id && like.includes(post.id)
                ? (dispatch(disLikeReducer(post?.id)), handleLike('likeMinus'))
                : (dispatch(likeReducer(post?.id)), handleLike('likePlus'))
            }
          >
            <FavoriteIcon
              style={{
                color:
                  post?.id && like.includes(post.id) ? '#f44336' : '#1976d2',
              }}
            />
          </IconButton>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'marckScript !important',
                fontSize: 22,
                marginRight: 2,
              }}
            >
              {loadingLikes ? (
                <CircularProgress size={15} color="info" />
              ) : (
                post?.likes
              )}
            </Typography>
            <Stack direction="row" gap={1.5} mr={1}>
              {post?.tags?.map((tag) => (
                <Chip
                  label={tag}
                  key={tag}
                  color="success"
                  disabled={!!searchText?.length}
                  sx={{
                    '.MuiChip-label': {
                      color: 'white',
                    },
                  }}
                  size="medium"
                  onClick={() => {
                    onClickChip && onClickChip(tag), onShow && onShow(true)
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </CardActions>
      </Card>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 50 }}
      >
        <MenuItem
          onClick={() => {
            handleCloseMenu(), dispatch(openChangePostReducer(true))
          }}
          sx={{ color: '#1976d2' }}
        >
          Изменить пост
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenu(),
              dispatch(postIdReducer(post?.id)),
              dispatch(openRemovePostReducer(true))
          }}
          sx={{ color: '#f44336' }}
        >
          Удалить
        </MenuItem>
      </Menu>
    </Fragment>
  )
}
