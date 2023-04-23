import { FC, forwardRef, ReactElement, Ref } from 'react'
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

import { CostumButton } from '../../common'

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

  const handleDeleteUser = () => {
    if (currentUser) {
      deleteUser(currentUser)
        .then(() => {
          location.reload()
        })
        .catch(() => {
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
          onClick={() => location.reload()}
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
