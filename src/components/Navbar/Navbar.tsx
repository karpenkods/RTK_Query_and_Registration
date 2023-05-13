import { FC, Fragment, useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useTranslation } from 'react-i18next'

import {
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  Skeleton,
} from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import GitHubIcon from '@mui/icons-material/GitHub'
import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import PagesIcon from '@mui/icons-material/Pages'
import { grey } from '@mui/material/colors'

import ukImage from '../../assets/uk.png'
import ruImage from '../../assets/ru.png'
import '../../assets/fonts/fonts.scss'
import {
  AppBar,
  CostumButton,
  Drawer,
  DrawerHeader,
  themeReducer,
  useAppDispatch,
  useAppSelector,
} from '../../common'
import { AvatarUser } from '../AvatarUser/AvatarUser'
import { MenuUser } from '../MenuUser'

export const Navbar: FC = () => {
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [showAvatar, setShowAvatar] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const auth = getAuth()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const darkTheme = useAppSelector((store) => store.theme.theme) === 'dark'
  const postId = useAppSelector((store) => store.posts.postId).slice(-5)
  const color = darkTheme ? grey[100] : grey[800]

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language)
  }

  const handleDrawerShow = () => {
    setShow((prevShow) => !prevShow)
  }

  const handleDrawerOpen = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  useEffect(() => {
    onAuthStateChanged(auth, () => {
      setShowAvatar(true)
    })
  }, [auth])

  return (
    <Stack direction="row">
      <AppBar position="fixed" open={open} color="inherit">
        <Toolbar
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h3"
            fontFamily="marckScript !important"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            QUERIES
          </Typography>
          <Typography
            variant="h2"
            color="tomato"
            alignSelf="center"
            fontFamily="marckScript !important"
          >
            {location.pathname.includes('posts')
              ? `${t('posts')}`
              : location.pathname.includes('post')
              ? `${t('post_1')}${postId}`
              : `${t('nameA')}`}
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {!showAvatar ? (
              <Skeleton
                animation="wave"
                variant="circular"
                width={55}
                height={55}
              />
            ) : (
              <Fragment>
                <AvatarUser fontSize={'150%'} changeAnchorEl={setAnchorEl} />
                <MenuUser anchorEl={anchorEl} changeAnchorEl={setAnchorEl} />
              </Fragment>
            )}
            <IconButton
              onClick={handleDrawerShow}
              sx={{
                margin: '8px 0px 8px 15px',
                ...(open && { display: 'none' }),
              }}
            >
              {show ? (
                <CloseIcon sx={{ width: '30px', height: '30px' }} />
              ) : (
                <MenuIcon sx={{ width: '30px', height: '30px' }} />
              )}
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      {(show || open) && (
        <Drawer variant="permanent" anchor="right" open={open}>
          <DrawerHeader>
            <CostumButton
              sx={{
                margin: '10px 0 0 -6px',
                color: color,
                fontSize: 18,
              }}
              onClick={() => {
                handleDrawerOpen()
                handleDrawerShow()
              }}
            >
              <CloseIcon sx={{ marginRight: '10px' }} />
              {t('close')}
            </CostumButton>
          </DrawerHeader>
          <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => navigate('/')}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <HomeIcon
                    sx={{
                      color: location.pathname === '/' ? '#1976d2' : 'inherit',
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  sx={{
                    opacity: open ? 1 : 0,
                    color: color,
                  }}
                >
                  <NavLink
                    to="/"
                    style={({ isActive }) => {
                      return {
                        textDecoration: 'none',
                        color: isActive ? '#1976d2' : 'inherit',
                      }
                    }}
                  >
                    {t('homePage')}
                  </NavLink>
                </ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                disabled={!auth.currentUser}
                onClick={() => navigate('/posts')}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <PagesIcon
                    sx={{
                      color:
                        location.pathname === '/posts' ? '#1976d2' : 'inherit',
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  sx={{
                    opacity: open ? 1 : 0,
                    color: color,
                  }}
                >
                  <NavLink
                    to="/posts"
                    style={({ isActive }) => {
                      return {
                        textDecoration: 'none',
                        color: isActive ? '#1976d2' : 'inherit',
                      }
                    }}
                  >
                    {t('posts')}
                  </NavLink>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() =>
                  changeLanguage(i18n.language === 'ru' ? 'en' : 'ru')
                }
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={i18n.language === 'ru' ? ukImage : ruImage}
                    width={40}
                    height={25}
                  />
                </ListItemIcon>
                <ListItemText
                  sx={{
                    opacity: open ? 1 : 0,
                    color: color,
                  }}
                >
                  {t('language')}
                </ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() =>
                  dispatch(themeReducer(darkTheme ? 'light' : 'dark'))
                }
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {darkTheme ? <LightModeIcon /> : <DarkModeIcon />}
                </ListItemIcon>
                <ListItemText
                  sx={{
                    opacity: open ? 1 : 0,
                    color: color,
                  }}
                >
                  {darkTheme ? `${t('lightTheme')}` : `${t('darkTheme')}`}
                </ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <Link
                href="https://github.com/karpenkods?tab=repositories"
                sx={{ textDecoration: 'none' }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <GitHubIcon />
                  </ListItemIcon>
                  <ListItemText
                    sx={{
                      opacity: open ? 1 : 0,
                      color: color,
                    }}
                  >
                    {t('git')}
                  </ListItemText>
                </ListItemButton>
              </Link>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={handleDrawerOpen}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </ListItemIcon>
                <ListItemText
                  sx={{
                    opacity: open ? 1 : 0,
                    color: color,
                  }}
                >
                  {t('hideMenu')}
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      )}
    </Stack>
  )
}
