import { FC, MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth'

import { Avatar, IconButton } from '@mui/material'

import {
  useAppDispatch,
  costumAvatar,
  CostumButton,
  IAvatarProps,
  refreshReducer,
  pathNameReducer,
  openLoginReducer,
} from '../../common'

export const AvatarUser: FC<IAvatarProps> = ({ fontSize, changeAnchorEl }) => {
  const user = getAuth().currentUser
  const { t } = useTranslation()
  const avatar = costumAvatar(
    user?.displayName ? user.displayName : `${t('anonymousUserAvatar')}`,
  )
  const navigate = useNavigate()
  const loaction = useLocation()
  const dispatch = useAppDispatch()

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    changeAnchorEl && changeAnchorEl(event.currentTarget)
    dispatch(refreshReducer(true))
    dispatch(pathNameReducer(loaction.pathname))
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
      onClick={() => {
        navigate('/login'),
          dispatch(openLoginReducer(true)),
          dispatch(pathNameReducer('/home'))
      }}
    >
      {t('signIn')}
    </CostumButton>
  )
}
