import { useCallback } from 'react'
import { EventPropGetter } from 'react-big-calendar'

import { taskPriorityColorMap } from '@/constants/task.const'
import { Task } from '@/types/task.type'

import { CalendarEvent } from './useCalendarEvents'

export const useEventStyles = (tasks?: Task[]): { eventPropGetter: EventPropGetter<CalendarEvent> } => {
  const eventPropGetter = useCallback<EventPropGetter<CalendarEvent>>(
    (event) => {
      const task = tasks?.find((t) => t._id === event.id)
      if (!task) return {}

      return {
        className: `isDraggable ${task.status.toLowerCase().replace(' ', '-')}`,
        style: {
          backgroundColor: taskPriorityColorMap[task.priority as keyof typeof taskPriorityColorMap],
          borderColor: taskPriorityColorMap[task.priority as keyof typeof taskPriorityColorMap],
          opacity: task.status === 'Completed' ? 0.7 : 1
        }
      }
    },
    [tasks]
  )

  return { eventPropGetter }
}
