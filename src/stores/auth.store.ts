import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { UserInformation } from '@/types/user.type'

import { localStorageAdapter } from './adapter/local-storage.adapter'

export interface AuthState {
  authSession: string | null // Store the JWT token
  refreshToken: string | null // Store the refresh token
  userInformation: UserInformation | null | undefined
  setAuthSession: (
    token: string,
    refreshToken: string | null,
    userInformation: UserInformation | null | undefined
  ) => void
  clearAuthSession: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      authSession: null,
      refreshToken: null,
      userInformation: null,
      setAuthSession: (
        token: string,
        refreshToken: string | null,
        userInformation: UserInformation | null | undefined
      ): void => set({ authSession: token, refreshToken, userInformation }),
      clearAuthSession: (): void => set({ authSession: null, refreshToken: null, userInformation: null })
    }),
    {
      name: 'auth-data',
      storage: localStorageAdapter<AuthState>()
    }
  )
)

export default useAuthStore
