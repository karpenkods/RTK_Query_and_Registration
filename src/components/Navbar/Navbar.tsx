import { FC, useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

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
// import LightModeIcon from '@mui/icons-material/LightMode'
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
import { AppBar, CostumButton, Drawer, DrawerHeader } from '../../common'
import '../../assets/fonts/fonts.scss'

export const Navbar: FC = () => {
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [showAvatar, setShowAvatar] = useState(false)

  const auth = getAuth()

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
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <IconButton
              onClick={handleDrawerShow}
              sx={{
                margin: '8px 20px 8px 0px',
                ...(open && { display: 'none' }),
              }}
            >
              {show ? (
                <CloseIcon style={{ width: '30px', height: '30px' }} />
              ) : (
                <MenuIcon style={{ width: '30px', height: '30px' }} />
              )}
            </IconButton>
            <Typography
              variant="h3"
              sx={{ fontFamily: 'marckScript !important' }}
            >
              QUERIES
            </Typography>
          </Stack>
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
          <MenuUser />
        </Toolbar>
      </AppBar>
      {(show || open) && (
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <CostumButton
              style={{ marginTop: 15, color: 'inherit', fontSize: 18 }}
              onClick={() => {
                handleDrawerOpen()
                handleDrawerShow()
              }}
            >
              <CloseIcon style={{ marginRight: 10 }} />
              Закрыть
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
                      color: grey[800],
                    }}
                  >
                    Главная
                  </ListItemText>
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <Link href="/rtk-query" sx={{ textDecoration: 'none' }}>
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
                    <PagesIcon />
                  </ListItemIcon>
                  <ListItemText
                    sx={{
                      opacity: open ? 1 : 0,
                      color: grey[800],
                    }}
                  >
                    RTK Query
                  </ListItemText>
                </ListItemButton>
              </Link>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <Link href="*" sx={{ textDecoration: 'none' }}>
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
                    }}
                  >
                    <img src={ukImage} width={40} height={25} />
                  </ListItemIcon>
                  <ListItemText
                    sx={{
                      opacity: open ? 1 : 0,
                      color: grey[800],
                    }}
                  >
                    Язык
                  </ListItemText>
                </ListItemButton>
              </Link>
              {/* <Link
                    href={router.asPath}
                    locale="ru"
                    className={styles.navbar__link}
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
                        <Image
                          src="/ru.png"
                          alt="Eng"
                          width={40}
                          height={25}
                          className={styles.flagRu}
                        />
                      </ListItemIcon>
                      <ListItemText
                        sx={{
                          opacity: open ? 1 : 0,
                          color:
                            cookies[0].theme_preference === 'dark'
                              ? purple.A700
                              : grey[800],
                        }}
                      >
                        {t('language')}
                      </ListItemText>
                    </ListItemButton>
                  </Link> */}
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }}>
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
                  <DarkModeIcon />
                </ListItemIcon>
                <ListItemText
                  sx={{
                    opacity: open ? 1 : 0,
                    color: grey[800],
                  }}
                >
                  Тёмная тема
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
                      color: grey[800],
                    }}
                  >
                    GitHub автора
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
                  {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </ListItemIcon>
                <ListItemText
                  sx={{
                    opacity: open ? 1 : 0,
                    color: grey[800],
                  }}
                >
                  Скрыть меню
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      )}
    </Stack>
  )
}
