import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { message } from 'antd'
import dayjs from 'dayjs'

import { Task } from '@/types/task.type'
import { createTask, deleteTask, getTaskById, getTasksByUserId, updateTask } from '@/utils/apis/task-apis.util'

// Centralized query keys for better type safety and reusability
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  detail: (id: string) => [...taskKeys.all, 'detail', id] as const
}

export const useTasks = (): UseQueryResult<Task[], Error> => {
  return useQuery({
    queryKey: taskKeys.lists(),
    queryFn: async () => {
      const response = await getTasksByUserId()
      return response.data?.tasks ?? []
    },
    refetchInterval: 1000 * 30, // 30 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0 // Consider data stale immediately
  })
}

export const useCreateTask = (): UseMutationResult<Task | undefined, Error, Task> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (task: Task) => {
      task.endDate = dayjs(task.startDate).add(task.estimatedTime, 'minute').toDate()
      const response = await createTask(task)
      return response.data
    },
    onSuccess: async (newTask) => {
      if (newTask) {
        // Optimistic update for immediate UI feedback
        const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.lists()) || []
        queryClient.setQueryData<Task[]>(taskKeys.lists(), [...previousTasks, newTask])

        // Invalidate and refetch
        await queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      }

      message.success({
        content: 'Task created successfully',
        key: 'create-task',
        duration: 2
      })
    },
    onError: (error: Error) => {
      message.error('Failed to create task. Please try again.')
      console.error('Create task error:', error)
    }
  })
}

export const useUpdateTask = (): UseMutationResult<Task | undefined, Error, { id: string; task: Partial<Task> }> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, task }) => {
      if (task.startDate && task.endDate) {
        task.estimatedTime = dayjs(task.endDate).diff(dayjs(task.startDate), 'minute')
      }

      if (task.estimatedTime) {
        task.endDate = dayjs(task.startDate).add(task.estimatedTime, 'minute').toDate()
      }

      const response = await updateTask(id, task)
      return response.data
    },
    onMutate: async ({ id, task }) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() })
      await queryClient.cancelQueries({ queryKey: taskKeys.detail(id) })

      // Snapshot current state
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.lists())

      // Optimistically update the cache
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          taskKeys.lists(),
          previousTasks.map((t) => (t._id === id ? { ...t, ...task } : t))
        )
      }

      return { previousTasks }
    },
    onSettled: async (_, error, variables) => {
      // Invalidate both queries to trigger refetch
      await queryClient.invalidateQueries({
        queryKey: taskKeys.lists(),
        refetchType: 'all'
      })

      await queryClient.invalidateQueries({
        queryKey: taskKeys.detail(variables?.id),
        refetchType: 'all'
      })
    },
    onSuccess: async () => {
      message.success({
        content: 'Task updated successfully',
        key: 'update-task',
        duration: 2
      })
    },
    onError: (error: Error, _, context) => {
      // Revert optimistic update on error
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.lists(), context.previousTasks)
      }
      message.error('Failed to update task. Please try again.')
      console.error('Update task error:', error)
    }
  })
}

export const useDeleteTask = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteTask(id)
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() })
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.lists())

      // Optimistic delete
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          taskKeys.lists(),
          previousTasks.filter((task) => task._id !== id)
        )
      }

      return { previousTasks }
    },
    onSuccess: async () => {
      // Invalidate to trigger refetch
      await queryClient.invalidateQueries({
        queryKey: taskKeys.lists(),
        refetchType: 'all'
      })

      message.success({
        content: 'Task deleted successfully',
        key: 'delete-task',
        duration: 2
      })
    },
    onError: (error: Error, _, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.lists(), context.previousTasks)
      }
      message.error('Failed to delete task. Please try again.')
      console.error('Delete task error:', error)
    }
  })
}

export const useTask = (id: string): UseQueryResult<Task | undefined, Error> => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: async () => {
      const response = await getTaskById(id)
      return response.data?.tasks[0]
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0 // Consider data stale immediately
  })
}
