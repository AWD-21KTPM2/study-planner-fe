import { useMutation, UseMutationResult, useQuery, UseQueryResult } from '@tanstack/react-query'

import { Task } from '@/types/task.type'
import { createTask, getTasksByUserId } from '@/utils/apis/task-apis.util'
import queryClient from '@/utils/query-client.util'

export const taskKeys = {
  all: ['tasks'] as const,
  detail: (id: string) => [...taskKeys.all, 'detail', id] as const
}

export const useTasks = (): UseQueryResult<Task[], Error> => {
  return useQuery({
    queryKey: taskKeys.all,
    queryFn: async () => {
      try {
        const response = await getTasksByUserId()
        return response.data.tasks
      } catch (error) {
        console.error(error)
        throw error
      }
    }
  })
}

export const useCreateTask = (): UseMutationResult<Task, Error, Task> => {
  return useMutation({
    mutationFn: async (task: Task) => {
      const response = await createTask(task)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    }
  })
}
