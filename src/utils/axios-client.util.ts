import axios from 'axios'

import { ROUTE } from '@/constants/route.const'
import { JwtRefreshDTO, UserInformation } from '@/types/user.type'

import { refreshTokenApi } from './apis/auth-apis.util'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Send cookies when cross-origin requests
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosClient.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('auth-data')
    if (!authData) return config
    const token = JSON.parse(authData).state.authSession
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosClient.interceptors.response.use(
  (response) => {
    return response
  },
  // async (error) => {
  //   if (error.response.status === 401) {
  //     localStorage.removeItem('auth-data')
  //     const authData = localStorage.getItem('auth-data')
  //     if (!authData) return Promise.reject(error)
  //     const refreshToken = JSON.parse(authData).state.refreshToken
  //     const tokenResponse: JwtRefreshDTO = await refreshTokenApi(refreshToken)

  //     window.location.href = ROUTE.LOGIN
  //   }
  //   return Promise.reject(error)
  // }
  // async (error) => {
  //   if (error.response?.status === 401) {
  //     try {
  //       // Remove old auth data
  //       const authData = localStorage.getItem('auth-data')
  //       if (!authData) {
  //         // No refresh token available, redirect to login
  //         window.location.href = ROUTE.LOGIN
  //         return Promise.reject(error)
  //       }

  //       const { refreshToken } = JSON.parse(authData).state

  //       // Attempt to refresh the token
  //       const response: JwtRefreshDTO = await refreshTokenApi(refreshToken)

  //       // Update the auth data in localStorage
  //       localStorage.setItem(
  //         'auth-data',
  //         JSON.stringify({
  //           authSession: response.accessToken,
  //           refreshToken: response.refreshToken,
  //           userInformation: {
  //             id: response.id,
  //             email: response.email
  //           } as UserInformation
  //         })
  //       )

  //       // Retry the failed request with the new token
  //       error.config.headers['Authorization'] = `Bearer ${response.accessToken}`
  //       return axiosClient.request(error.config)
  //     } catch (refreshError) {
  //       // Refresh token failed, redirect to login
  //       localStorage.removeItem('auth-data')
  //       window.location.href = ROUTE.LOGIN
  //       return Promise.reject(refreshError)
  //     }
  //   }

  //   // Pass other errors to the next handler
  //   return Promise.reject(error)
  // }
  async (error) => {
    if (error.response?.status === 401) {
      // Check if this is the retry attempt
      const originalRequest = error.config

      if (originalRequest._retry) {
        // If already retried, reject the promise
        localStorage.removeItem('auth-data')
        window.location.href = ROUTE.LOGIN
        return Promise.reject(error)
      }

      // Mark the request as retried
      originalRequest._retry = true

      try {
        // Fetch refresh token
        const authData = localStorage.getItem('auth-data')
        if (!authData) {
          // No refresh token, redirect to login
          window.location.href = ROUTE.LOGIN
          return Promise.reject(error)
        }

        const { refreshToken } = JSON.parse(authData).state

        // Refresh the token
        const response: JwtRefreshDTO = await refreshTokenApi(refreshToken)

        localStorage.setItem(
          'auth-data',
          JSON.stringify({
            authSession: response.accessToken,
            refreshToken: response.refreshToken,
            userInformation: {
              id: response.id,
              email: response.email
            } as UserInformation
          })
        )

        // Update the authorization header with the new token
        originalRequest.headers['Authorization'] = `Bearer ${response.accessToken}`

        // Retry the original request
        return axiosClient.request(originalRequest)
      } catch (refreshError) {
        // Refresh token failed, clear auth data and redirect to login
        localStorage.removeItem('auth-data')
        window.location.href = ROUTE.LOGIN
        return Promise.reject(refreshError)
      }
    }

    // Pass other errors to the next handler
    return Promise.reject(error)
  }
)

export default axiosClient
