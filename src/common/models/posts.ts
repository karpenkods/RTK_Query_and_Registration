export interface IPosts {
  data?: IPost[]
  limit?: number
  page?: number
  total?: number
}
export interface IPost {
  id?: string
  image?: string
  likes?: number
  tags?: string[]
  text?: string
  publishDate?: string
  owner?: OwnerPost
}

interface OwnerPost {
  id: string
  title: string
  firstName: string
  lastName: string
  picture: string
}

export interface IPostProps {
  post?: IPost
  getNumber?: (value: number) => void
  onClickChip?: (value: string) => void
  onShow?: (value: boolean) => void
  searchText?: string
}

export interface IPostCardProps {
  post?: IPost
  userId?: number
}
