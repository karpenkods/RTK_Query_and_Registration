import { IUser } from './user'

export interface IPost {
  userId?: number
  id?: number
  title?: string
  body?: string
}

export interface IPostsProps {
  isLoading: boolean
  posts?: IPost[]
  users?: IUser[]
  errorPosts?: boolean
  errorUsers?: boolean
}
export interface IPostProps {
  getNumber: (value: number) => void
}

export interface IPostCardProps {
  post?: IPost
  userId?: number
}
