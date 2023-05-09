import { FC, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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

import { MenuUser } from '../MenuUser/MenuUser'
import { AvatarUser } from '../AvatarUser/AvatarUser'
import ukImage from '../../assets/uk.png'
import ruImage from '../../assets/ru.png'
import {
  AppBar,
  CostumButton,
  Drawer,
  DrawerHeader,
  themeReducer,
  useAppDispatch,
  useAppSelector,
} from '../../common'
import '../../assets/fonts/fonts.scss'

export const Navbar: FC = () => {
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [showAvatar, setShowAvatar] = useState(false)

  const auth = getAuth()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const darkTheme = useAppSelector((store) => store.theme.theme) === 'dark'
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
            sx={{ fontFamily: 'marckScript !important', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            QUERIES
          </Typography>
          <Typography
            variant="h2"
            color="tomato"
            sx={{ alignSelf: 'center', fontFamily: 'marckScript !important' }}
          >
            {location.pathname.includes('posts')
              ? 'Посты'
              : location.pathname.includes('post')
              ? 'Пост_'
              : 'Карпенко Д.С.'}
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
              <AvatarUser fontSize={'150%'} />
            )}
            <IconButton
              onClick={handleDrawerShow}
              sx={{
                margin: '8px 0px 8px 15px',
                ...(open && { display: 'none' }),
              }}
            >
              {show ? (
                <CloseIcon style={{ width: '30px', height: '30px' }} />
              ) : (
                <MenuIcon style={{ width: '30px', height: '30px' }} />
              )}
            </IconButton>
            <MenuUser />
          </Stack>
        </Toolbar>
      </AppBar>
      {(show || open) && (
        <Drawer variant="permanent" anchor="right" open={open}>
          <DrawerHeader>
            <CostumButton
              style={{
                margin: '10px 0 0 -6px',
                color: color,
                fontSize: 18,
              }}
              onClick={() => {
                handleDrawerOpen()
                handleDrawerShow()
              }}
            >
              <CloseIcon style={{ marginRight: 10 }} />
              {t('close')}
            </CostumButton>
          </DrawerHeader>
          <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <Link href="/" sx={{ textDecoration: 'none' }}>
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
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText
                    sx={{
                      opacity: open ? 1 : 0,
                      color: color,
                    }}
                  >
                    {t('homePage')}
                  </ListItemText>
                </ListItemButton>
              </Link>
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
                  <PagesIcon />
                </ListItemIcon>
                <ListItemText
                  sx={{
                    opacity: open ? 1 : 0,
                    color: color,
                  }}
                >
                  {t('posts')}
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
