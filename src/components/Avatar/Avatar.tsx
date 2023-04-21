import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { Avatar, Button, IconButton } from '@mui/material'

import { useAppDispatch, useAvatar, useUser } from '../../common/hooks'
import { openReducer } from '../../common/redux'
import { IAvatarProps } from '../../common/models'

export const AvatarUser: FC<IAvatarProps> = ({ fontSize }) => {
  const user = useUser()
  const avatar = useAvatar(user?.displayName ? user.displayName : 'А П')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleClick = () => {
    dispatch(openReducer(true))
  }

  return user ? (
    user.photoURL ? (
      <IconButton size="small" onClick={handleClick}>
        <Avatar
          alt="avatar"
          src={user?.photoURL}
          sx={{
            width: 55,
            height: 55,
          }}
        />
      </IconButton>
    ) : (
      <IconButton size="small" onClick={handleClick}>
        <Avatar
          {...avatar}
          sx={{
            width: 55,
            height: 55,
            fontSize: { fontSize },
          }}
        />
      </IconButton>
    )
  ) : (
    <Button
      variant="contained"
      color="error"
      onClick={() => navigate('/login')}
      sx={{ padding: '2px 10px', textTransform: 'none', fontSize: '18px' }}
    >
      Войти
    </Button>
  )
}
