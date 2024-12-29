import axiosClient from '@/utils/axios-client.util'

import { ResponseData } from './task-apis.util'
import axios from 'axios'

export interface TimerProgressResponse {
  totalProductivity: string
  countTodoTasks: number
  countInProgressTasks: number
  countCompletedTasks: number
  countExpiredTasks: number
  totalTasks: number
}

// export const getTimeProgress = async (authSession: string | null): Promise<ResponseData<TimerProgressResponse>> => {
//   try {
//     const response = await axios.get<ResponseData<TimerProgressResponse>>(
//       'http://localhost:3000/insights/time-progress',
//       {
//         headers: {
//           Authorization: `Bearer ${authSession}`
//         }
//       }
//     )
//     console.log('response', authSession, response)
//     return response.data
//   } catch (error: any) {
//     console.error('Error fetching time progress:', error)
//     throw new Error(error.response?.data?.message || 'Error fetching time progress')
//   }
// }

export const getTimeProgress = async (): Promise<ResponseData<TimerProgressResponse>> => {
  try {
    const response = await axiosClient.get('insights/time-progress')
    console.log('response', response)
    return response.data
  } catch (error) {
    throw new Error(`Error while logging in with Google: ${error}`)
  }
}
