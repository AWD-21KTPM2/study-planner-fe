import axios from 'axios'

import { ROUTE } from '@/constants/route.const'
import { JwtRefreshDTO, UserInformation } from '@/types/user.type'

import { refreshTokenApi } from './apis/auth-apis.util'

let retryFlag = false

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
  async (error) => {
    if (error.response?.status === 401) {
      // Check if this is the retry attempt
      const originalRequest = error.config

      if (retryFlag) {
        // If already retried, reject the promise
        localStorage.removeItem('auth-data')
        window.location.href = ROUTE.LOGIN
        retryFlag = false
        return Promise.reject(error)
      }

      // Mark the request as retried
      retryFlag = true

      console.log('originalRequest._retry', originalRequest._retry)

      try {
        // Fetch refresh token
        const authData = localStorage.getItem('auth-data')
        if (!authData) {
          // No refresh token, redirect to login
          window.location.href = ROUTE.LOGIN
          retryFlag = false
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
        retryFlag = false
        return axiosClient(originalRequest)
        // return axiosClient.request(originalRequest)
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
