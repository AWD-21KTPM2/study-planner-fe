import { jwtDecode } from 'jwt-decode'
import { useEffect } from 'react'

import useAuthStore, { AuthState } from '@/stores/auth.store'
import { DecodedJwtToken, JwtRefreshDTO } from '@/types/user.type'
import { refreshToken } from '@/utils/apis/auth-apis.util'

interface AuthHookProps extends AuthState {
  isLoggedIn: boolean
}

const useAuth = (): AuthHookProps => {
  const authSession = useAuthStore((state) => state.authSession)
  const userInformation = useAuthStore((state) => state.userInformation)
  const setAuthSession = useAuthStore((state) => state.setAuthSession)
  const clearAuthSession = useAuthStore((state) => state.clearAuthSession)

  // Decode the JWT token and extract the expiration time
  const getTokenExpiration = (): Date | null => {
    if (!authSession) return null

    try {
      const decoded: DecodedJwtToken = jwtDecode(authSession)
      return decoded?.exp ? new Date(decoded.exp * 1000) : null // Convert `exp` to a Date object
    } catch (error) {
      console.error('Invalid JWT token', error)
      return null
    }
  }

  // Check if the token is expired
  const isTokenExpired = (): boolean => {
    const expiration = getTokenExpiration()
    return expiration ? new Date() > expiration : true // Return true if expired or invalid
  }

  useEffect(() => {
    const expiration = getTokenExpiration()
    if (!expiration) return

    const now = new Date()
    const timeUntilRefresh = expiration.getTime() - now.getTime() - 60000 // Refresh 1 minute before expiration

    if (timeUntilRefresh > 0) {
      const timeoutId = setTimeout(async () => {
        const refreshTokenData: JwtRefreshDTO = await refreshToken(authSession)
        setAuthSession(refreshTokenData.accessToken, userInformation)
      }, timeUntilRefresh)

      return (): void => clearTimeout(timeoutId) // Cleanup timeout on component unmount or token change
    }

    return undefined
  }, [authSession])

  return {
    authSession,
    userInformation,
    setAuthSession,
    clearAuthSession,
    isLoggedIn: Boolean(authSession) && !isTokenExpired() // Boolean indicating if the user is logged in
  }
}

export default useAuth
