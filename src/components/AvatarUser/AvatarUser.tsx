import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth'

import { Avatar, IconButton } from '@mui/material'

import {
  useAppDispatch,
  costumAvatar,
  CostumButton,
  IAvatarProps,
  openReducer,
  refreshReducer,
} from '../../common'

export const AvatarUser: FC<IAvatarProps> = ({ fontSize }) => {
  const user = getAuth().currentUser
  const avatar = costumAvatar(user?.displayName ? user.displayName : 'А П')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleClick = () => {
    dispatch(openReducer(true))
    dispatch(refreshReducer(true))
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
    <CostumButton
      variant="contained"
      color="error"
      onClick={() => navigate('/login')}
    >
      Войти
    </CostumButton>
  )
}
