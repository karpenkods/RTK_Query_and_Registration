import { FC, Fragment } from 'react'
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
  IPropsMenuUser,
  openLoginReducer,
  openSettingsUserReducer,
  pushDangerNotification,
  pushInfoNotification,
  refreshReducer,
  useAppDispatch,
  useAppSelector,
} from '../../common'
import { AvatarUser } from '../AvatarUser'
import { SettingsUser } from '../SettingsUser'

export const MenuUser: FC<IPropsMenuUser> = ({ anchorEl, changeAnchorEl }) => {
  const auth = getAuth()
  const currentUser = auth.currentUser
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const openMenu = Boolean(anchorEl)
  const darkTheme = useAppSelector((store) => store.theme.theme) === 'dark'
  const color = darkTheme ? grey[100] : grey[800]
  const { t } = useTranslation()

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(pushInfoNotification(`${t('loggedOut')}`))
        dispatch(refreshReducer(false))
        navigate('/home')
      })
      .catch(() => {
        dispatch(pushDangerNotification(`${t('errorTryLater')}`))
      })
  }

  return (
    <Fragment>
      <Menu
        id="account-menu"
        open={openMenu}
        anchorEl={anchorEl}
        onClose={() => changeAnchorEl(null)}
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
        anchorOrigin={{ horizontal: 85, vertical: 70 }}
      >
        {currentUser && (
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            width="300px"
            pt="5px"
          >
            <Fragment>
              <AvatarUser fontSize={'450%'} />
              <Typography
                variant="h6"
                textAlign="center"
                margin="10px 0 10px 0"
                color={color}
                lineHeight={1.2}
              >
                {currentUser.displayName
                  ? currentUser.displayName
                  : `${t('anonymousUser')}`}
              </Typography>
              <Typography variant="body1" color={color}>
                {currentUser.email}
              </Typography>
            </Fragment>
            <Divider sx={{ margin: '10px 0 8px 0', width: '100%' }} />
            <Stack direction="column" alignItems="flex-start" width="100%">
              <MenuItem
                sx={{ height: '50px', width: '100%', color: color }}
                disabled={currentUser?.isAnonymous}
                onClick={() => {
                  changeAnchorEl(null), dispatch(openSettingsUserReducer(true))
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
                  dispatch(openLoginReducer(true)), changeAnchorEl(null)
                }}
              >
                <ListItemIcon>
                  <ChangeCircleIcon fontSize="medium" />
                </ListItemIcon>
                {t('changeAccountType')}
              </MenuItem>
              <MenuItem
                sx={{ height: '50px', width: '100%', color: color }}
                onClick={() => {
                  handleSignOut(), changeAnchorEl(null)
                }}
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
      <SettingsUser />
    </Fragment>
  )
}
