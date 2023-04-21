import { FC, forwardRef, ReactElement, Ref } from 'react'
import { deleteUser, getAuth } from 'firebase/auth'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />
})

export const EmailModal: FC = () => {
  const auth = getAuth()
  const currentUser = auth.currentUser

  const handleDeleteAuth = () => {
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
          выслано подтверждение. Пожалуйста, перейдите по ссылке в письме.
          Иначе, пользователь будет удалён.
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
        <Button
          onClick={handleDeleteAuth}
          variant="contained"
          color="error"
          size="large"
          sx={{
            textTransform: 'none',
            fontSize: '20px',
            padding: '5px 10px',
          }}
        >
          Не хочу!
        </Button>
        <Button
          onClick={() => location.reload()}
          variant="contained"
          color="success"
          size="large"
          sx={{
            textTransform: 'none',
            fontSize: '20px',
            padding: '5px 10px',
          }}
        >
          Подтвердить
        </Button>
      </DialogActions>
    </Dialog>
  )
}
