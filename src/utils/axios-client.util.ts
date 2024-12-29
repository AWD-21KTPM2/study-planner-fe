import axios from 'axios'

import { ROUTE } from '@/constants/route.const'

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
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('auth-data')
      window.location.href = ROUTE.LOGIN
    }
    return Promise.reject(error)
  }
)

export default axiosClient
