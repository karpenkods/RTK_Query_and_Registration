import { VariantType } from 'notistack'
import { IUser } from './user'

export interface IPostsState {
  postId: string
  limit: number
}

export interface IUserState {
  user: IUser
  anonymous: boolean
}

export interface ISnackbar {
  id: string | number
  kind: VariantType
  message: string
  isDismissed?: boolean
}

export interface IMenuState {
  openLogin: boolean
  openRegistration: boolean
  openNewPassword: boolean
  openSettingsUser: boolean
  openCropper: boolean
  openRemovePost: boolean
  openChangePost: boolean
  openCreatePost: boolean
  openCreateComment: boolean
  refresh: boolean
  pathName: string
}
export interface IThemeState {
  theme: string
}
export interface ILikeState {
  like: string[]
}
