import { FC, forwardRef, ReactElement, Ref } from 'react'
import { useNavigate } from 'react-router-dom'
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

  const handleDeleteUser = () => {
    if (currentUser) {
      deleteUser(currentUser)
        .then(() => {
          dispatch(refreshReducer(false))
          navigate('/')
          dispatch(pushInfoNotification('Пользователь удалён'))
        })
        .catch(() => {
          dispatch(pushDangerNotification('Ошибка'))
          return
        })
    }
  }

  return (
    <Dialog open={true} TransitionComponent={Transition} keepMounted>
      <DialogTitle
        sx={{ padding: '20px 0', alignSelf: 'center', fontSize: '24px' }}
      >
        Подтвердите свой email
      </DialogTitle>
      <DialogContent sx={{ padding: '0 20px', textAlign: 'center' }}>
        <Typography variant="h6">
          На почту{' '}
          <span style={{ color: 'green' }}>{`${currentUser?.email}`}</span>{' '}
          выслано подтверждение. Пожалуйста, перейдите по ссылке в письме. Иначе
          пользователь будет удалён.
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
          Не хочу!
        </CostumButton>
        <CostumButton
          onClick={() => {
            dispatch(refreshReducer(false))
            navigate('/')
          }}
          variant="contained"
          color="success"
          size="large"
          sx={{ fontSize: '20px' }}
        >
          Подтвердить
        </CostumButton>
      </DialogActions>
    </Dialog>
  )
}
