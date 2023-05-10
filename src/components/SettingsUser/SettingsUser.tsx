import { FC, ReactElement, Ref, forwardRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  ListItemIcon,
  MenuItem,
  Slide,
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'

import { SettingAvatarAndName } from './SettingAvatarAndName'
import { SettingEmailAndPassword } from './SettingEmailAndPassword'
import { SettingRemoveAccount } from './SettingRemoveAccount'
import {
  CostumButton,
  openSettingsUserReducer,
  refreshReducer,
  useAppDispatch,
  useAppSelector,
} from '../../common'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />
})

export const SettingsUser: FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const openSettings = useAppSelector((store) => store.menu.openSettingsUser)
  const pathName = useAppSelector((store) => store.menu.pathName)

  const handleMenuItemClick = (index: number) => {
    setSelectedIndex(index)
  }

  const items = [
    {
      icon: <AccountBoxIcon sx={{ width: '50px', height: '50px' }} />,
    },
    {
      icon: <AlternateEmailIcon sx={{ width: '50px', height: '50px' }} />,
    },
    {
      icon: <PersonRemoveIcon sx={{ width: '50px', height: '50px' }} />,
    },
  ]

  return (
    <Dialog open={openSettings} TransitionComponent={Transition} keepMounted>
      <DialogTitle padding="20px 0" alignSelf="center" fontSize="28px">
        {t('accountSettings')}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', padding: 0 }}>
        <Box mt="20px">
          {items.map((item, index) => (
            <MenuItem
              key={index}
              sx={{
                marginBottom: '10px',
                fontSize: '18px',
                borderTopRightRadius: '100px',
                borderBottomRightRadius: '100px',
                '&.Mui-selected': {
                  backgroundColor: '#1976D2',
                },
              }}
              selected={index === selectedIndex}
              onClick={() => handleMenuItemClick(index)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
            </MenuItem>
          ))}
        </Box>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ margin: '0 0 0 15px' }}
        />
        <Box width="60vw" height="60vh" padding="20px">
          {selectedIndex === 0 && <SettingAvatarAndName />}
          {selectedIndex === 1 && <SettingEmailAndPassword />}
          {selectedIndex === 2 && <SettingRemoveAccount />}
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          padding: '20px',
        }}
      >
        <CostumButton
          onClick={() => {
            dispatch(openSettingsUserReducer(false)),
              navigate(pathName),
              dispatch(refreshReducer(false))
          }}
          variant="contained"
          color="error"
        >
          {t('close')}
        </CostumButton>
      </DialogActions>
    </Dialog>
  )
}
