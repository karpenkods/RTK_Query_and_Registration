import { User } from 'firebase/auth'

export function closeFunction(user: User | null) {
  const close = user?.providerData.length
    ? user?.providerData[0].providerId.includes('github') ||
      user?.providerData[0].providerId.includes('google')
    : false

  return close
}
