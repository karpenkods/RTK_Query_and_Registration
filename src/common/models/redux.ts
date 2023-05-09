import { VariantType } from 'notistack'
import { IPost } from './posts'
import { IUser } from './user'

export interface IPostsState {
  post: IPost
  createPost: boolean
  deletePost: boolean
  postId: number
  limit: number
}

export interface IUsersState {
  user: IUser
  userId: number
}

export interface ISnackbar {
  id: string | number
  kind: VariantType
  message: string
  isDismissed?: boolean
}

export interface IMenuState {
  open: boolean
  refresh: boolean
  pathName: string
}
export interface IThemeState {
  theme: string
}
export interface ILikeState {
  like: string[]
}
