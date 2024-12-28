import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { message } from 'antd'

import { Timer } from '@/types/timer.type'
import { startTimer, stopTimer } from '@/utils/apis/timer-apis.util'

export type TimerMutation = {
  taskId: string
  flag: boolean // true for study, false for break
}

export type TimerHook = {
  useStartTimer: () => UseMutationResult<Timer | undefined, Error, Timer>
  useStopTimer: () => UseMutationResult<Timer | undefined, Error, Timer>
}

export const useStartTimer = (): UseMutationResult<Timer, Error, TimerMutation> => {
  return useMutation({
    mutationFn: async (data: TimerMutation) => await startTimer(data),
    onSuccess: () => {
      message.success({
        content: 'Timer started successfully',
        key: 'start-timer',
        duration: 2
      })
    },
    onError: (error: Error) => {
      message.error('Failed to start timer. Please try again.')
      console.error('Start timer error:', error.message)
    }
  })
}

export const useStopTimer = (): UseMutationResult<Timer | undefined, Error, TimerMutation> => {
  return useMutation({
    mutationFn: async (data: TimerMutation) => await stopTimer(data),
    onSuccess: () => {
      message.success({
        content: 'Timer stopped successfully',
        key: 'stop-timer',
        duration: 2
      })
    },
    onError: (error: Error) => {
      message.error('Failed to stop timer. Please try again.')
      console.error('Stop timer error:', error.message)
    }
  })
}
