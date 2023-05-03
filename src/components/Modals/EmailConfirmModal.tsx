import { FC, forwardRef, ReactElement, Ref } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { deleteUser, getAuth } from 'firebase/auth'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'

import {
  CostumButton,
  pushDangerNotification,
  pushInfoNotification,
  refreshReducer,
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
  const auth = getAuth()
  const currentUser = auth.currentUser
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleDeleteUser = () => {
    if (currentUser) {
      deleteUser(currentUser)
        .then(() => {
          dispatch(refreshReducer(false))
          navigate('/')
          dispatch(pushInfoNotification(`${t('userDeleted')}`))
        })
        .catch(() => {
          dispatch(pushDangerNotification(`${t('error')}`))
          return
        })
    }
  }

  return (
    <Dialog open={true} TransitionComponent={Transition} keepMounted>
      <DialogTitle
        sx={{ padding: '20px 0', alignSelf: 'center', fontSize: '24px' }}
      >
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
          sx={{ fontSize: '20px' }}
        >
          {t('notWant')}
        </CostumButton>
        <CostumButton
          onClick={() => {
            dispatch(refreshReducer(false))
            navigate('/')
          }}
          variant="contained"
          color="success"
          size="large"
          sx={{ fontSize: '20px', color: 'white' }}
        >
          {t('confirm')}
        </CostumButton>
      </DialogActions>
    </Dialog>
  )
}
