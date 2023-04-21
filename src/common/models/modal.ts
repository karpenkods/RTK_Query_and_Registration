import { IPost } from './posts'
import { IUser } from './user'

export interface IPropsModal {
  posts?: IPost[] | any
  users?: IUser[] | any
  openModal: boolean
  onOpen: (value: boolean) => void
}

export interface IPropsNewPasswordModal {
  openNewPassword: boolean
  onOpen: (value: boolean) => void
}

export interface IPropsCropperModal {
  src: string | null
  modalOpen: boolean
  setModalOpen: (e: boolean) => void
}
