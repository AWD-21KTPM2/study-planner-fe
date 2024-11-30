import useAuthStore, { AuthState } from '@/stores/auth.store'

interface AuthHookProps extends AuthState {
  isLoggedIn: boolean
}

const useAuth = (): AuthHookProps => {
  const authSession = useAuthStore((state) => state.authSession)
  const userInformation = useAuthStore((state) => state.userInformation)
  const setAuthSession = useAuthStore((state) => state.setAuthSession)
  const clearAuthSession = useAuthStore((state) => state.clearAuthSession)

  return {
    authSession,
    userInformation,
    setAuthSession,
    clearAuthSession,
    isLoggedIn: Boolean(authSession) // Boolean indicating if the user is logged in
  }
}

export default useAuth
