import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, signOut } from 'firebase/auth'

import {
  Divider,
  ListItemIcon,
  MenuItem,
  Menu,
  Typography,
} from '@mui/material'
import { Logout } from '@mui/icons-material'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'

import { useAppDispatch, useAppSelector } from '../../common/hooks'
import {
  openReducer,
  pushDangerNotification,
  pushInfoNotification,
} from '../../common/redux'
import { AvatarUser } from '../Avatar/Avatar'
import { SettingsUser } from '../SettingsUser/SettingsUser'

export const MenuUser: FC = () => {
  const [successSingOut, setSuccessSingOut] = useState(false)
  const [openSettings, setOpenSettings] = useState(false)
  const navigate = useNavigate()
  const auth = getAuth()
  const currentUser = auth.currentUser
  const dispatch = useAppDispatch()
  const open = useAppSelector((store) => store.menu.open)

  const handleClose = () => {
    dispatch(openReducer(false))
  }

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(pushInfoNotification('Вы вышли из аккаунта'))
        setSuccessSingOut(true)
        dispatch(openReducer(false))
        navigate('/')
      })
      .catch(() => {
        dispatch(pushDangerNotification('Ошибка сети, попробуйте позднее'))
      })
  }

  useEffect(() => {
    if (successSingOut) {
      setTimeout(() => location.reload(), 1500)
    }
  }, [successSingOut])

  return (
    <>
      <Menu
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 1,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            '& .MuiAvatar-root': {
              width: 120,
              height: 120,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 66 }}
      >
        <div
          style={{
            width: '300px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            paddingTop: '5px',
          }}
        >
          <AvatarUser fontSize={'450%'} />
          {currentUser && (
            <>
              <Typography
                variant="h6"
                color="grey"
                sx={{
                  textAlign: 'center',
                  margin: '10px 0 10px 0',
                  lineHeight: 1.2,
                }}
              >
                {currentUser.displayName
                  ? currentUser.displayName
                  : 'Анонимный пользователь'}
              </Typography>
              <Typography variant="body1" color="grey">
                {currentUser.email}
              </Typography>
            </>
          )}
        </div>
        <Divider sx={{ margin: '10px 0 8px 0' }} />
        <MenuItem
          sx={{ height: '50px' }}
          disabled={currentUser?.isAnonymous}
          onClick={() => {
            setOpenSettings(true), handleClose()
          }}
        >
          <ListItemIcon>
            <ManageAccountsIcon fontSize="medium" />
          </ListItemIcon>
          Настройки
        </MenuItem>
        <MenuItem
          sx={{ height: '50px' }}
          onClick={() => {
            navigate('/login')
          }}
        >
          <ListItemIcon>
            <ChangeCircleIcon fontSize="medium" />
          </ListItemIcon>
          Сменить тип аккаунта
        </MenuItem>
        <MenuItem sx={{ height: '50px' }} onClick={handleSignOut}>
          <ListItemIcon>
            <Logout fontSize="medium" />
          </ListItemIcon>
          Выйти из аккаунта
        </MenuItem>
      </Menu>
      <SettingsUser openSettings={openSettings} onChange={setOpenSettings} />
    </>
  )
}
