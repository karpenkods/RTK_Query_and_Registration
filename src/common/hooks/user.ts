import { useState } from 'react'
import { User, getAuth, onAuthStateChanged } from 'firebase/auth'

export function useUser() {
  const [user, setUser] = useState<User>()
  const auth = getAuth()

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user)
    }
  })

  return user
}
