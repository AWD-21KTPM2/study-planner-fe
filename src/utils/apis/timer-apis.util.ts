import { Timer } from '@/types/timer.type'
import axiosClient from '@/utils/axios-client.util'

export const startTimer = async ({ taskId, flag }: { taskId: string; flag: boolean }): Promise<Timer> => {
  const response = await axiosClient.post(`/timer/start`, { taskId, flag })
  return response.data
}

export const stopTimer = async ({ taskId, flag }: { taskId: string; flag: boolean }): Promise<Timer> => {
  const response = await axiosClient.post(`/timer/stop`, { taskId, flag })
  return response.data
}
