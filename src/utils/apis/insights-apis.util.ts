import axiosClient from '@/utils/axios-client.util'

import { ResponseData } from './task-apis.util'

export interface TimerProgressResponse {
  totalProductivity: string
  countTodoTasks: number
  countInProgressTasks: number
  countCompletedTasks: number
  countExpiredTasks: number
  totalTasks: number
}

export const getTimeProgress = async (): Promise<ResponseData<TimerProgressResponse>> => {
  try {
    const response = await axiosClient.get('insights/time-progress')
    return response.data
  } catch (error) {
    throw new Error(`Error while logging in with Google: ${error}`)
  }
}
