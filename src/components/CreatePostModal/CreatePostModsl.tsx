/* eslint-disable react-hooks/exhaustive-deps */
import {
  ChangeEvent,
  FC,
  forwardRef,
  ReactElement,
  Ref,
  useEffect,
  useState,
} from 'react'

import {
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import CloseIcon from '@mui/icons-material/Close'

import { IPropsModal } from '../../common/models'
import { useAppDispatch } from '../../common/hooks'
import {
  pushDangerNotification,
  pushSuccessNotification,
  useCreatePostMutation,
  useCreateUsersMutation,
} from '../../common/redux'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export const CreatePostModal: FC<IPropsModal> = ({
  posts,
  users,
  openModal,
  onOpen,
}) => {
  const dispatch = useAppDispatch()

  const [title, setTitle] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [userName, setUserName] = useState('')
  const [inputError, setInputError] = useState(false)

  const [
    createPostMutation,
    { isSuccess: successCreatePost, isError: errorCreatePost },
  ] = useCreatePostMutation()

  const [
    createUserMutation,
    { isSuccess: successCreateUser, isError: errorCreateUser },
  ] = useCreateUsersMutation()

  const handleCreate = () => {
    if (
      !name.length ||
      !userName.length ||
      !title.length ||
      !description.length
    ) {
      setInputError(true)
      return
    }
    createPostMutation({
      userId: users.at(-1).id + 1,
      id: posts.at(-1).id + 1,
      title: title,
      body: description,
    })
    createUserMutation({
      id: users.at(-1).id + 1,
      name: name,
      username: userName,
    })
    onOpen(false)
    clearInputs()
  }

  useEffect(() => {
    if (successCreateUser && successCreatePost) {
      dispatch(pushSuccessNotification(`Пост №_${posts.at(-1).id + 1} создан`))
    }
    if (errorCreatePost || errorCreateUser) {
      dispatch(
        pushDangerNotification('Ошибка при создании поста, попробуйте позднее'),
      )
    }
  }, [
    dispatch,
    errorCreatePost,
    errorCreateUser,
    successCreatePost,
    successCreateUser,
  ])

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }
  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  const handleChangeDescription = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value)
  }
  const handleChangeUserName = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value)
  }

  const clearInputs = () => {
    setTitle('')
    setDescription('')
    setName('')
    setUserName('')
    setInputError(false)
  }

  const handleClose = () => {
    onOpen(false)
    clearInputs()
  }

  return (
    <div>
      <Dialog open={openModal} TransitionComponent={Transition} keepMounted>
        <IconButton
          color="error"
          onClick={handleClose}
          sx={{ alignSelf: 'flex-end' }}
        >
          <CloseIcon style={{ width: '30px', height: '30px' }} />
        </IconButton>
        <DialogTitle sx={{ padding: '0 24px', alignSelf: 'center' }}>
          Пост
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '15px 0 5px 0',
              width: '500px',
            }}
          >
            <TextField
              label="Имя пользователя"
              type="text"
              value={name}
              onChange={handleChangeName}
              sx={{ width: '300px', marginRight: '20px' }}
              error={inputError && !name.length}
              helperText={inputError && !name.length ? 'Обязательное поле' : ''}
            />
            <TextField
              label="Имя в системе"
              type="text"
              value={userName}
              onChange={handleChangeUserName}
              error={inputError && !userName.length}
              helperText={
                inputError && !userName.length ? 'Обязательное поле' : ''
              }
            />
          </div>
          <TextField
            label="Заголовок"
            type="text"
            multiline
            value={title}
            onChange={handleChangeTitle}
            sx={{ margin: '15px 0 20px 0', width: '500px' }}
            error={inputError && !title.length}
            helperText={inputError && !title.length ? 'Обязательное поле' : ''}
          />
          <TextField
            label="Сообщение"
            type="text"
            multiline
            rows={2}
            value={description}
            onChange={handleChangeDescription}
            sx={{ width: '500px' }}
            error={inputError && !description.length}
            helperText={
              inputError && !description.length ? 'Обязательное поле' : ''
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="contained"
            color="error"
            sx={{ textTransform: 'none', marginRight: '20px' }}
          >
            Отмена
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none' }}
          >
            Создать пост
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
