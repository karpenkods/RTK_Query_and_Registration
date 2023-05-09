import { FC, Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getAuth, signOut } from 'firebase/auth'

import {
  Divider,
  ListItemIcon,
  MenuItem,
  Menu,
  Typography,
  Stack,
} from '@mui/material'
import { grey } from '@mui/material/colors'
import Logout from '@mui/icons-material/Logout'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'

import {
  openReducer,
  pushDangerNotification,
  pushInfoNotification,
  refreshReducer,
  useAppDispatch,
  useAppSelector,
} from '../../common'
import { AvatarUser } from '../AvatarUser'
import { SettingsUser } from '../SettingsUser'

export const MenuUser: FC = () => {
  const [openSettings, setOpenSettings] = useState(false)

  const navigate = useNavigate()
  const auth = getAuth()
  const currentUser = auth.currentUser
  const dispatch = useAppDispatch()
  const open = useAppSelector((store) => store.menu.open)
  const darkTheme = useAppSelector((store) => store.theme.theme) === 'dark'
  const color = darkTheme ? grey[100] : grey[800]
  const { t } = useTranslation()

  const handleClose = () => {
    dispatch(openReducer(false))
  }

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(pushInfoNotification(`${t('loggedOut')}`))
        dispatch(openReducer(false))
        dispatch(refreshReducer(false))
        navigate('/')
      })
      .catch(() => {
        dispatch(pushDangerNotification(`${t('errorTryLater')}`))
      })
  }

  return (
    <Fragment>
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
        anchorOrigin={{ horizontal: 'right', vertical: 68 }}
      >
        {currentUser && (
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{
              width: '300px',
              paddingTop: '5px',
            }}
          >
            <>
              <AvatarUser fontSize={'450%'} />
              <Typography
                variant="h6"
                sx={{
                  textAlign: 'center',
                  margin: '10px 0 10px 0',
                  color: color,
                  lineHeight: 1.2,
                }}
              >
                {currentUser.displayName
                  ? currentUser.displayName
                  : `${t('anonymousUser')}`}
              </Typography>
              <Typography variant="body1" sx={{ color: color }}>
                {currentUser.email}
              </Typography>
            </>
            <Divider sx={{ margin: '10px 0 8px 0', width: '100%' }} />
            <Stack
              direction="column"
              alignItems="flex-start"
              sx={{ width: '100%' }}
            >
              <MenuItem
                sx={{ height: '50px', width: '100%', color: color }}
                disabled={currentUser?.isAnonymous}
                onClick={() => {
                  setOpenSettings(true), handleClose()
                }}
              >
                <ListItemIcon>
                  <ManageAccountsIcon fontSize="medium" />
                </ListItemIcon>
                {t('settings')}
              </MenuItem>
              <MenuItem
                sx={{ height: '50px', width: '100%', color: color }}
                onClick={() => {
                  navigate('/login')
                }}
              >
                <ListItemIcon>
                  <ChangeCircleIcon fontSize="medium" />
                </ListItemIcon>
                {t('changeAccountType')}
              </MenuItem>
              <MenuItem
                sx={{ height: '50px', width: '100%', color: color }}
                onClick={handleSignOut}
              >
                <ListItemIcon>
                  <Logout fontSize="medium" />
                </ListItemIcon>
                {t('logOut')}
              </MenuItem>
            </Stack>
          </Stack>
        )}
      </Menu>
      <SettingsUser openSettings={openSettings} onChange={setOpenSettings} />
    </Fragment>
  )
}
