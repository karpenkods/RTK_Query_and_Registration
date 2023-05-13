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
  owner?: OwnerPost | any
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
  onClickChip?: (value: string) => void
  onShow?: (value: boolean) => void
  searchText?: string
}

export interface IPostCardProps {
  post?: IPost
  userId?: number
}

export interface IPostPageProps {
  getNumber?: (value: number) => void
}
