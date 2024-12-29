import { UseMutateFunction, useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'

import { Timer } from '@/types/timer.type'
import { startTimer, stopTimer } from '@/utils/apis/timer-apis.util'

export type TimerMutation = {
  taskId: string
  flag: boolean // true for study, false for break
}

export type TimerHook = {
  startTimer: UseMutateFunction<Timer, Error, TimerMutation, { previousTimer: Timer[] | undefined }>
  stopTimer: UseMutateFunction<Timer, Error, TimerMutation, { previousTimers: Timer[] | undefined }>
  isStarting: boolean
  isStopping: boolean
  startError: unknown
  stopError: unknown
}

export const useTimer = (): TimerHook => {
  const queryClient = useQueryClient()

  const startTimerMutation = useMutation({
    mutationFn: async ({ taskId, flag }: TimerMutation) => await startTimer({ taskId, flag }),
    onMutate: async ({ taskId, flag }: TimerMutation) => {
      await queryClient.cancelQueries({ queryKey: 'timer' })
      const previousTimer = queryClient.getQueryData<Timer[]>(['timer'])
      queryClient.setQueryData(['timer'], (old: Timer[] = []) => {
        const optimisticTimer: Timer = {
          _id: `optimistic-${Date.now()}`,
          taskId,
          sessionStart: new Date(),
          flag,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'optimistic'
        }
        return [...old, optimisticTimer]
      })
      return { previousTimer }
    },
    onError: (err, variables, context) => {
      if (context?.previousTimer) {
        queryClient.setQueryData(['timer'], context.previousTimer)
      }
      message.error({
        content: 'Failed to start timer',
        duration: 1,
        key: 'startTimer'
      })
      console.error(err)
    },
    onSuccess: (newTimer) => {
      queryClient.setQueryData(['timers'], (old: Timer[] = []) => {
        const filteredTimers = old.filter((t) => !t._id?.startsWith('optimistic-'))
        return [...filteredTimers, newTimer]
      })
      message.success({
        content: `Timer started for ${newTimer.flag ? 'work' : 'break'} session`,
        duration: 1,
        key: 'startTimer'
      })
    }
  })

  const stopTimerMutation = useMutation({
    mutationFn: async ({ taskId, flag }: TimerMutation) => await stopTimer({ taskId, flag }),
    onMutate: async ({ taskId, flag }) => {
      await queryClient.cancelQueries({ queryKey: ['timers'] })
      const previousTimers = queryClient.getQueryData<Timer[]>(['timers'])

      queryClient.setQueryData(['timers'], (old: Timer[] = []) => {
        return old.map((timer) => {
          if (timer.taskId === taskId && timer.flag === flag && !timer.sessionEnd) {
            return {
              ...timer,
              sessionEnd: new Date(),
              updatedAt: new Date()
            }
          }
          return timer
        })
      })

      return { previousTimers }
    },
    onError: (err, variables, context) => {
      if (context?.previousTimers) {
        queryClient.setQueryData(['timers'], context.previousTimers)
      }

      message.error({
        content: 'Failed to stop timer',
        duration: 1,
        key: 'stopTimer'
      })
      console.error(err)
    },
    onSuccess: (updatedTimer) => {
      queryClient.setQueryData(['timers'], (old: Timer[] = []) => {
        return old.map((timer) => (timer._id === updatedTimer._id ? updatedTimer : timer))
      })
      message.success({
        content: `Timer stopped for ${updatedTimer.flag ? 'work' : 'break'} session`,
        duration: 1,
        key: 'stopTimer'
      })
    }
  })

  return {
    startTimer: startTimerMutation.mutate,
    stopTimer: stopTimerMutation.mutate,
    isStarting: startTimerMutation.isPending,
    isStopping: stopTimerMutation.isPending,
    startError: startTimerMutation.error,
    stopError: stopTimerMutation.error
  }
}
