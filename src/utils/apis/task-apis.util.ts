import { Task } from '@/types/task.type'
import axiosClient from '@/utils/axios-client.util'

type ResponseData<T> = {
  messages: string
  data: T
}

type TaskResponse = {
  total_items: number
  tasks: Task[]
}

export const createTask = async (data: Task): Promise<Task> => {
  const response = await axiosClient.post<Task>('task', data)
  return response.data
}

export const getTasksByUserId = async (): Promise<ResponseData<TaskResponse>> => {
  const response = await axiosClient.get<ResponseData<TaskResponse>>(`task`)
  return response.data
}

export const updateTask = async (taskId: string, data: Task): Promise<Task> => {
  const response = await axiosClient.put<Task>(`task/${taskId}`, data)
  return response.data
}

export const deleteTask = async (taskId: string): Promise<void> => {
  await axiosClient.delete(`task/${taskId}`)
}
