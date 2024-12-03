import axios from 'axios'

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Send cookies when cross-origin requests
  headers: {
    'Content-Type': 'application/json'
  }
})
