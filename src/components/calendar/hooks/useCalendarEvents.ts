import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { DragFromOutsideItemArgs } from 'react-big-calendar/lib/addons/dragAndDrop'

import { taskKeys, useTasks, useUpdateTask } from '@/hooks/useTasks'
import { Task } from '@/types/task.type'

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  allDay?: boolean
  isDraggable?: boolean
  taskStatus?: string
}

type EventInteractionArgs<T> = {
  event: T
  start: Date | string
  end: Date | string
  isAllDay?: boolean
}

export const useCalendarEvents = (): {
  events: CalendarEvent[]
  draggedEvent: CalendarEvent | null
  setEvents: (events: CalendarEvent[]) => void
  updateEvent: (eventId: number, updates: Partial<CalendarEvent>) => void
  moveEvent: (args: EventInteractionArgs<object>) => void
  resizeEvent: (args: EventInteractionArgs<object>) => void
  onDropFromOutside: (args: DragFromOutsideItemArgs) => void
  isPending: boolean
} => {
  const { data: tasks } = useTasks()
  const [events, setEvents] = useState<CalendarEvent[]>()
  const { mutateAsync: updateTask, isPending } = useUpdateTask()
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    const draggedTask = localStorage.getItem('draggedTask')
    setDraggedEvent(draggedTask ? JSON.parse(draggedTask) : null)
  }, [localStorage.getItem('draggedTask')])

  const determineTaskStatus = (start: Date, end: Date): string => {
    const now = dayjs()
    if (dayjs(end).isBefore(now)) return 'Expired'
    if (dayjs(start).isBefore(now) && dayjs(end).isAfter(now)) return 'In Progress'
    return 'Todo'
  }

  useEffect(() => {
    if (!tasks) return

    const convertTaskToEvent = (task: Task): CalendarEvent | null => {
      if (!task.startDate || !task.endDate || !task._id) return null

      return {
        id: task._id,
        title: task.name,
        start: dayjs(task.startDate).toDate(),
        end: dayjs(task.endDate).toDate(),
        isDraggable: task.status !== 'Completed',
        taskStatus: task.status
      }
    }

    const validEvents = tasks.map(convertTaskToEvent).filter((event): event is CalendarEvent => event !== null)

    setEvents(validEvents)
  }, [tasks, setEvents])

  const updateEvent = useCallback<(eventId: string, updates: Partial<CalendarEvent>) => void>(
    async (eventId, updates) => {
      try {
        setIsLoading(true)
        const start = updates.start ? new Date(updates.start) : undefined
        const end = updates.end ? new Date(updates.end) : undefined
        const status = start && end ? determineTaskStatus(start, end) : undefined
        // Update the task in the backend
        await updateTask({
          id: eventId,
          task: {
            startDate: start,
            endDate: end,
            status
          }
        })

        // Update local state
        setEvents((prev) =>
          prev?.map((event) => (event.id === eventId ? { ...event, ...updates, taskStatus: status } : event))
        )
      } catch (error) {
        console.error('Failed to update task:', error)
        // You might want to add error handling/notification here
      } finally {
        setIsLoading(false)
      }
    },
    [updateTask]
  )

  const moveEvent = useCallback<(args: EventInteractionArgs<object>) => void>(
    async ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const typedEvent = event as CalendarEvent
      const newAllDay = droppedOnAllDaySlot

      try {
        setIsLoading(true)
        const startDate = new Date(start)
        const endDate = new Date(end)
        const status = determineTaskStatus(startDate, endDate)

        // Optimistic update first
        setEvents((prev) => {
          const filtered = prev?.filter((ev) => ev.id !== typedEvent.id)
          return [
            ...(filtered || []),
            {
              ...typedEvent,
              start: startDate,
              end: endDate,
              allDay: newAllDay,
              taskStatus: status
            }
          ]
        })

        // Then update the backend
        await updateTask({
          id: typedEvent.id,
          task: {
            startDate,
            endDate,
            status
          }
        })

        // Force a refetch to ensure consistency
        await queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      } catch (error) {
        console.error('Failed to move task:', error)
        // Revert the optimistic update on error
        if (tasks) {
          const originalEvent = tasks.find((t) => t._id === typedEvent.id)
          if (originalEvent && originalEvent.startDate && originalEvent.endDate) {
            setEvents((prev) =>
              prev?.map((ev) =>
                ev.id === typedEvent.id
                  ? {
                      ...ev,
                      start: originalEvent.startDate ? new Date(originalEvent.startDate) : new Date(),
                      end: originalEvent.endDate ? new Date(originalEvent.endDate) : new Date(),
                      taskStatus: originalEvent.status
                    }
                  : ev
              )
            )
          }
        }
      } finally {
        setIsLoading(false)
      }
    },
    [updateTask, tasks]
  )

  const resizeEvent = useCallback<(args: EventInteractionArgs<object>) => void>(
    async ({ event, start, end }) => {
      const typedEvent = event as CalendarEvent

      try {
        setIsLoading(true)
        const startDate = new Date(start)
        const endDate = new Date(end)
        const status = determineTaskStatus(startDate, endDate)

        // Optimistic update first
        setEvents((prev) => {
          const filtered = prev?.filter((ev) => ev.id !== typedEvent.id)
          return [
            ...(filtered || []),
            {
              ...typedEvent,
              start: startDate,
              end: endDate,
              taskStatus: status
            }
          ]
        })

        // Then update the backend
        await updateTask({
          id: typedEvent.id,
          task: {
            startDate,
            endDate,
            status
          }
        })

        // Force a refetch to ensure consistency
        await queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      } catch (error) {
        console.error('Failed to resize task:', error)
        // Revert the optimistic update on error
        if (tasks) {
          const originalEvent = tasks.find((t) => t._id === typedEvent.id)
          if (originalEvent && originalEvent.startDate && originalEvent.endDate) {
            setEvents((prev) =>
              prev?.map((ev) =>
                ev.id === typedEvent.id
                  ? {
                      ...ev,
                      start: originalEvent.startDate ? new Date(originalEvent.startDate) : new Date(),
                      end: originalEvent.endDate ? new Date(originalEvent.endDate) : new Date(),
                      taskStatus: originalEvent.status
                    }
                  : ev
              )
            )
          }
        }
      } finally {
        setIsLoading(false)
      }
    },
    [updateTask, tasks]
  )

  const onDropFromOutside = useCallback<(args: DragFromOutsideItemArgs) => void>(
    async ({ start, end, allDay }) => {
      try {
        setIsLoading(true)
        const draggedTask = JSON.parse(localStorage.getItem('draggedTask') ?? '{}')
        if (!draggedTask._id) return

        const startDate = new Date(start)
        const endDate = new Date(end)
        const status = determineTaskStatus(startDate, endDate)
        setDraggedEvent({
          id: draggedTask._id,
          title: draggedTask.name,
          start: startDate,
          end: endDate,
          allDay,
          taskStatus: status
        })

        await updateTask({
          id: draggedTask._id,
          task: {
            startDate,
            endDate,
            status
          }
        })

        setEvents((prev) => [
          ...(prev || []),
          {
            id: draggedTask._id,
            title: draggedTask.name,
            start: startDate,
            end: endDate,
            allDay,
            taskStatus: status
          }
        ])

        setDraggedEvent(null)
        localStorage.removeItem('draggedTask')
      } catch (error) {
        console.error('Failed to handle drop:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [updateTask]
  )

  return {
    events: events ?? [],
    draggedEvent,
    setEvents,
    updateEvent: (eventId: number, updates) => updateEvent(String(eventId), updates),
    moveEvent,
    resizeEvent,
    onDropFromOutside,
    isPending: isLoading && isPending
  }
}
