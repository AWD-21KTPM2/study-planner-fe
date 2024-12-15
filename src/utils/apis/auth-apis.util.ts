import { JwtRefreshDTO } from '@/types/user.type'

import axiosClient from '../axios-client.util'

export const refreshToken = async (authSession: string | null): Promise<JwtRefreshDTO> => {
  try {
    const response = await axiosClient.get('user/refresh-token', {
      headers: {
        Authorization: `Bearer ${authSession}`
      }
    })
    return response.data
  } catch (error) {
    throw new Error(`Error while logging in with Google: ${error}`)
  }
}
