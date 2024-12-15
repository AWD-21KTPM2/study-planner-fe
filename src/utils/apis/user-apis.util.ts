import message from 'antd/es/message'
import { AxiosError } from 'axios'

import { ErrorType } from '@/types/error.type'
import { LoginResponse, UserDTO, UserInformation } from '@/types/user.type'

import axiosClient from '../axios-client.util'

export const login = async (data: UserDTO): Promise<LoginResponse> => {
  try {
    const response = await axiosClient.post<LoginResponse>('user/login', data)
    return response.data
  } catch (error) {
    throw new Error(`Error while logging in: ${error}`)
  }
}

export const googleLogin = async (token: string): Promise<LoginResponse> => {
  try {
    const response = await axiosClient.post<LoginResponse>('user/google-login', { token })
    return response.data
  } catch (error) {
    throw new Error(`Error while logging in with Google: ${error}`)
  }
}

export const getUserProfile = async (): Promise<UserInformation> => {
  try {
    const response = await axiosClient.get(`user/profile`)
    return response.data
  } catch (error) {
    const errorData = (error as AxiosError<ErrorType>).response?.data.detail
    message.error(errorData)
    throw new Error(errorData)
  }
}
