export interface IComment {
  id: string
  message: string
  owner: OwnerComment
  post: string
  publishDate: string
}

interface OwnerComment {
  id: string
  title: string
  firstName: string
  lastName: string
  picture: string
}
