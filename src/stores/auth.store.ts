import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { UserInformation } from '@/types/user.type'

import { localStorageAdapter } from './adapter/local-storage.adapter'

export interface AuthState {
  authSession: string | null // Store the JWT token
  userInformation: UserInformation | null
  setAuthSession: (token: string, userInformation: UserInformation) => void
  clearAuthSession: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      authSession: null,
      userInformation: null,
      setAuthSession: (token: string, userInformation: UserInformation): void =>
        set({ authSession: token, userInformation }),
      clearAuthSession: (): void => set({ authSession: null, userInformation: null })
    }),
    {
      name: 'auth-data',
      storage: localStorageAdapter<AuthState>()
    }
  )
)

export default useAuthStore
