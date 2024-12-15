import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'

import useAuthStore, { AuthState } from '@/stores/auth.store'
import { LoginResponse, UserDTO, UserInformation } from '@/types/user.type'
import { getUserProfile, login } from '@/utils/apis/user-apis.util'
import queryClient from '@/utils/query-client.util'

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
  // const userInformation = useAuthStore((state) => state.userInformation)
  const { setAuthSession, clearAuthSession } = useAuthStore()

  const {
    data: userInformation,
    isLoading,
    error
  } = useQuery({
    queryKey: authKeys.profile,
    queryFn: async () => {
      const response = await getUserProfile()
      return response
    },
    enabled: Boolean(authSession || localStorage.getItem('auth-data')),
    retry: 1
  })

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      localStorage.setItem('auth-data', JSON.stringify(response))
      setAuthSession(response.data.accessToken, { email: response.data.email, id: response.data.id })
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

  return {
    authSession,
    setAuthSession,
    clearAuthSession,
    userInformation: userInformation || null,
    isLoggedIn: Boolean(authSession),
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,
    error: (error as Error) || loginMutation.error || logoutMutation.error
  }
}

export const useProfile = (): UseQueryResult<UserInformation, Error> => {
  return useQuery({
    queryKey: authKeys.profile,
    queryFn: async () => {
      const response = await getUserProfile()
      return response
    },
    enabled: Boolean(localStorage.getItem('auth-data'))
  })
}

export const useLogin = (): UseMutationResult<LoginResponse, Error, UserDTO> => {
  const { setAuthSession } = useAuthStore()
  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      localStorage.setItem('auth-data', JSON.stringify(response))
      setAuthSession(response.data.accessToken, { email: response.data.email, id: response.data.id })
      queryClient.invalidateQueries({ queryKey: authKeys.profile })
    }
  })
}
