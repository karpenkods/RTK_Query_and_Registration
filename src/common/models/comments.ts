export interface IComments {
  data: IComment[]
  page: number
  total: number
}

export interface IComment {
  id: string
  message: string
  owner: OwnerComment
  post: string
  publishDate: string
}
export interface ICommentCreate {
  message: string
  owner: string
  post: string
}

interface OwnerComment {
  id: string
  title: string
  firstName: string
  lastName: string
  picture: string
}
