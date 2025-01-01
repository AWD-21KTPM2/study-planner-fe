import { JwtRefreshDTO } from '@/types/user.type'

import axiosClient from '../axios-client.util'

export const refreshTokenApi = async (refreshToken: string | null): Promise<JwtRefreshDTO> => {
  try {
    const response = await axiosClient.post('user/refresh-token', { refreshToken })
    return response.data.data
  } catch (error) {
    throw new Error(`Error while getting new access token: ${error}`)
  }
}
