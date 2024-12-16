import { JwtRefreshDTO } from '@/types/user.type'

import axiosClient from '../axios-client.util'

export const refreshTokenApi = async (
  accessToken: string | null,
  refreshToken: string | null
): Promise<JwtRefreshDTO> => {
  try {
    const response = await axiosClient.post(
      'user/refresh-token',
      { refreshToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
    return response.data.data
  } catch (error) {
    throw new Error(`Error while getting new access token: ${error}`)
  }
}
