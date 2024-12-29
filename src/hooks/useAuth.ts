import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { useEffect } from 'react'

import useAuthStore, { AuthState } from '@/stores/auth.store'
import { DecodedJwtToken, JwtRefreshDTO } from '@/types/user.type'
import { LoginResponse, UserDTO, UserInformation } from '@/types/user.type'
import { refreshTokenApi } from '@/utils/apis/auth-apis.util'
import { getUserProfile, login } from '@/utils/apis/user-apis.util'

interface AuthHookProps extends AuthState {
  isLoggedIn: boolean
  login: (credential: { email: string; password: string }) => Promise<LoginResponse>
  logout: () => void
  isLoading: boolean
  error: Error | null
}

export const authKeys = {
  all: ['auth'] as const,
  profile: ['auth', 'profile'] as const,
  session: ['auth', 'session'] as const
}

export const useAuth = (): AuthHookProps => {
  const queryClient = useQueryClient()
  const authSession = useAuthStore((state) => state.authSession)
  const refreshToken = useAuthStore((state) => state.refreshToken)
  // const userInformation = useAuthStore((state) => state.userInformation)
  const { setAuthSession, clearAuthSession } = useAuthStore()

  const {
    data: userInformation,
    isLoading,
    error
  } = useQuery({
    queryKey: authKeys.profile,
    queryFn: async () => {
      const response = await getUserProfile(authSession)
      return response
    },
    enabled: Boolean(authSession || localStorage.getItem('auth-data')),
    retry: 1
  })

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      localStorage.setItem('auth-data', JSON.stringify(response))
      setAuthSession(response.data.accessToken, response.data.refreshToken, {
        email: response.data.email,
        id: response.data.id
      })
      queryClient.invalidateQueries({ queryKey: authKeys.profile })
    }
  })
  const logoutMutation = useMutation({
    mutationFn: async () => {
      clearAuthSession()
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile })
    }
  })

  // Decode the JWT token and extract the expiration time
  const getTokenExpiration = (token: string | null): Date | null => {
    if (!token) return null

    try {
      const decoded: DecodedJwtToken = jwtDecode(token)
      return decoded?.exp ? new Date(decoded.exp * 1000) : null // Convert `exp` to a Date object
    } catch (error) {
      console.error('Invalid JWT token', error)
      return null
    }
  }

  // Check if the token is expired
  const isTokenExpired = (token: string | null): boolean => {
    const expiration = getTokenExpiration(token)
    return expiration ? new Date() > expiration : true // Return true if expired or invalid
  }

  const refreshTokenHandler = async (): Promise<void> => {
    const tokenResponse: JwtRefreshDTO = await refreshTokenApi(authSession, refreshToken)

    setAuthSession(tokenResponse.accessToken, refreshToken, {
      email: tokenResponse?.email,
      id: tokenResponse?.id
    })
    console.log('triggered refresh token')
  }

  useEffect(() => {
    if (refreshToken && isTokenExpired(refreshToken)) {
      clearAuthSession()
      return
    }

    const expiration = getTokenExpiration(authSession)
    if (!expiration) return

    const periodTimeToRefresh = 60000 // 1 minute before expiration
    const now = new Date()
    const timeUntilRefresh = expiration.getTime() - now.getTime() - periodTimeToRefresh

    console.log('Time until refresh:', timeUntilRefresh)

    let timeoutId: NodeJS.Timeout

    if (timeUntilRefresh > 0) {
      timeoutId = setTimeout(refreshTokenHandler, timeUntilRefresh)
    } else {
      refreshTokenHandler()
    }

    return (): void => {
      if (timeoutId) clearTimeout(timeoutId) // Cleanup timeout
    }
  }, [authSession])

  return {
    authSession,
    refreshToken,
    setAuthSession,
    clearAuthSession,
    isLoggedIn: Boolean(authSession) && !isTokenExpired(authSession), // Boolean indicating if the user is logged in
    userInformation: userInformation || null,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,
    error: (error as Error) || loginMutation.error || logoutMutation.error
  }
}

export const useProfile = (): UseQueryResult<UserInformation, Error> => {
  const { authSession } = useAuthStore()

  return useQuery({
    queryKey: authKeys.profile,
    queryFn: async () => {
      const response = await getUserProfile(authSession)
      return response
    },
    enabled: Boolean(localStorage.getItem('auth-data'))
  })
}

export const useLogin = (): UseMutationResult<LoginResponse, Error, UserDTO> => {
  const { setAuthSession } = useAuthStore()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      localStorage.setItem('auth-data', JSON.stringify(response))
      setAuthSession(response.data.accessToken, response.data.refreshToken, {
        email: response.data.email,
        id: response.data.id
      })
      queryClient.invalidateQueries({ queryKey: authKeys.profile })
    }
  })
}
