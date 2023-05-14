import { FC, forwardRef, ReactElement, Ref, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { deleteUser, getAuth } from 'firebase/auth'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'

import {
  CostumButton,
  pushDangerNotification,
  pushInfoNotification,
  useAppDispatch,
} from '../../common'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />
})

export const EmailConfirmModal: FC = () => {
  const [openModal, setOpenModal] = useState(true)
  const auth = getAuth()
  const currentUser = auth.currentUser
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down(768))

  const handleDeleteUser = () => {
    if (currentUser) {
      deleteUser(currentUser)
        .then(() => {
          dispatch(pushInfoNotification(`${t('userDeleted')}`))
        })
        .catch(() => {
          dispatch(pushDangerNotification(`${t('error')}`))
          return
        })
    }
  }

  const handleConfirmUser = () => {
    if (currentUser?.emailVerified) {
      dispatch(pushInfoNotification(`${t('confirmUser')}`))
      setOpenModal(false)
    } else dispatch(pushDangerNotification(`${t('confirmNotUser')}`))
  }

  return (
    <Dialog open={openModal} TransitionComponent={Transition} keepMounted>
      <DialogTitle padding="20px 0" textAlign="center" fontSize="24px">
        {t('confirmEmail')}
      </DialogTitle>
      <DialogContent sx={{ padding: '0 20px', textAlign: 'center' }}>
        <Typography variant="h6">
          {t('confirmationSent_1')}{' '}
          <span style={{ color: 'green' }}>{`${currentUser?.email}`}</span>{' '}
          {t('confirmationSent_2')}
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          width: '100%',
          padding: '20px',
          alignSelf: 'center',
          justifyContent: 'space-between',
        }}
      >
        <CostumButton
          onClick={handleDeleteUser}
          variant="contained"
          color="error"
          size="large"
          sx={{ fontSize: isMobile ? '16px' : '20px', color: 'white' }}
        >
          {t('notWant')}
        </CostumButton>
        <CostumButton
          onClick={handleConfirmUser}
          variant="contained"
          color="success"
          size="large"
          sx={{ fontSize: isMobile ? '16px' : '20px', color: 'white' }}
        >
          {t('confirm')}
        </CostumButton>
      </DialogActions>
    </Dialog>
  )
}
