import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { DragFromOutsideItemArgs } from 'react-big-calendar/lib/addons/dragAndDrop'

import { useUpdateTask } from '@/hooks/useTasks'

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
} => {
  const [events, setEvents] = useState<CalendarEvent[]>()
  const { mutateAsync: updateTask } = useUpdateTask()
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null)

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

  const updateEvent = useCallback<(eventId: string, updates: Partial<CalendarEvent>) => void>(
    async (eventId, updates) => {
      try {
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
      }
    },
    [updateTask]
  )

  const moveEvent = useCallback<(args: EventInteractionArgs<object>) => void>(
    async ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const typedEvent = event as CalendarEvent
      const newAllDay = droppedOnAllDaySlot

      try {
        const startDate = new Date(start)
        const endDate = new Date(end)
        const status = determineTaskStatus(startDate, endDate)

        await updateTask({
          id: typedEvent.id,
          task: {
            startDate,
            endDate,
            status
          }
        })

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
      } catch (error) {
        console.error('Failed to move task:', error)
      }
    },
    [updateTask]
  )

  const resizeEvent = useCallback<(args: EventInteractionArgs<object>) => void>(
    async ({ event, start, end }) => {
      const typedEvent = event as CalendarEvent

      try {
        const startDate = new Date(start)
        const endDate = new Date(end)
        const status = determineTaskStatus(startDate, endDate)

        await updateTask({
          id: typedEvent.id,
          task: {
            startDate,
            endDate,
            status
          }
        })

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
      } catch (error) {
        console.error('Failed to resize task:', error)
      }
    },
    [updateTask]
  )

  const onDropFromOutside = useCallback<(args: DragFromOutsideItemArgs) => void>(
    async ({ start, end, allDay }) => {
      try {
        const draggedTask = JSON.parse(localStorage.getItem('draggedTask') || '{}')
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
    onDropFromOutside
  }
}
