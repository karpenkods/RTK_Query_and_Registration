export interface IRegistrationValues {
  name: string
  email: string
  password: string
  confirmPassword?: string
}

export interface ILoginValues {
  email: string
  password: string
}

export interface INewPasswordValues {
  email: string
  message: string
}

export interface IChangeEmailValues {
  email: string
  oldPassword: string
}

export interface IChangePasswordValues {
  oldPassword: string
  password: string
  confirmPassword?: string
}
