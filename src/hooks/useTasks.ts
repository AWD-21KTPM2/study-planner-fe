import { useMutation, UseMutationResult, useQuery, UseQueryResult } from '@tanstack/react-query'
import { message } from 'antd'

import { Task } from '@/types/task.type'
import { createTask, deleteTask, getTaskById, getTasksByUserId, updateTask } from '@/utils/apis/task-apis.util'
import queryClient from '@/utils/query-client.util'

export const taskKeys = {
  all: ['tasks'] as const,
  detail: (id: string) => [...taskKeys.all, 'detail', id] as const
}

export const useTasks = (): UseQueryResult<Task[], Error> => {
  return useQuery({
    queryKey: taskKeys.all,
    refetchInterval: 1000 * 30, // 30 seconds
    queryFn: async () => {
      try {
        const response = await getTasksByUserId()
        return response.data?.tasks
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    // Add these options to ensure updates are visible
    refetchOnReconnect: true,
    retry: true,
    // This ensures the data is always fresh when the component mounts
    initialDataUpdatedAt: 0
  })
}
export const useCreateTask = (): UseMutationResult<Task | undefined, Error, Task> => {
  return useMutation({
    mutationFn: async (task: Task) => {
      const response = await createTask(task)
      return response.data
    },
    onSuccess: async (newTask) => {
      // Get current tasks from cache
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.all) || []
      // Update the cache with the new task
      if (newTask) {
        queryClient.setQueryData<Task[]>(taskKeys.all, [...previousTasks, newTask])
      }

      // Then invalidate to ensure fresh data
      await queryClient.invalidateQueries({
        queryKey: taskKeys.all,
        exact: true
      })

      message.success({
        content: 'Task created successfully',
        key: 'create-task',
        duration: 2
      })
    },
    retry: 3,
    retryDelay: 1000
  })
}
export const useUpdateTask = (): UseMutationResult<Task | undefined, Error, { id: string; task: Partial<Task> }> => {
  return useMutation({
    mutationFn: async ({ id, task }) => {
      const response = await updateTask(id, task)
      return response.data
    },
    onSuccess: (_, variables) => {
      // Invalidate both the specific task and the task list
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.all })

      message.success({
        content: 'Task updated successfully',
        key: 'update-task',
        duration: 2
      })
    },
    // Optional: Add optimistic update
    onMutate: async ({ id, task }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: taskKeys.detail(id) })
      await queryClient.cancelQueries({ queryKey: taskKeys.all })

      // Snapshot the previous value
      const previousTask = queryClient.getQueryData<Task>(taskKeys.detail(id))
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.all)

      // Optimistically update the cache
      if (previousTask) {
        queryClient.setQueryData<Task>(taskKeys.detail(id), {
          ...previousTask,
          ...task
        })
      }

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          taskKeys.all,
          previousTasks.map((t) => (t._id === id ? { ...t, ...task } : t))
        )
      }

      return { previousTask, previousTasks }
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousTask) {
        queryClient.setQueryData(taskKeys.detail(id), context.previousTask)
      }
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.all, context.previousTasks)
      }
    }
  })
}

export const useDeleteTask = (): UseMutationResult<void, Error, string> => {
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteTask(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })

      message.success({
        content: 'Task deleted successfully',
        key: 'delete-task',
        duration: 2
      })
    },
    // Optional: Add optimistic update
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all })

      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.all)

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          taskKeys.all,
          previousTasks.filter((task) => task._id !== id)
        )
      }

      return { previousTasks }
    },
    onError: (_, __, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.all, context.previousTasks)
      }
    }
  })
}

export const useTask = (id: string): UseQueryResult<Task | undefined, Error> => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: async () => {
      const response = await getTaskById(id)
      return response.data?.tasks[0]
    }
  })
}
