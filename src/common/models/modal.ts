import { ReactNode } from 'react'
import { IPost } from './posts'
import { IUser } from './user'

export interface IPropsModal {
  posts?: IPost[] | any
  users?: IUser[] | any
  openModal: boolean
  onOpen: (value: boolean) => void
}

export interface IPropsCropperModal {
  src: string | null
}

export interface IFileUploadProps {
  setFile: Function
  setUrl: Function
  accept: string
  children: ReactNode
}
