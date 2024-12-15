import { useCallback, useState } from 'react'

import mockEvents from '../mockEvents'

interface CalendarEvent {
  id: number
  title: string
  start: Date
  end: Date
  allDay?: boolean
}

type EventInteractionArgs<T> = {
  event: T
  start: Date | string
  end: Date | string
  isAllDay?: boolean
}

export const useCalendarEvents = (): {
  events: CalendarEvent[]
  setEvents: (events: CalendarEvent[]) => void
  updateEvent: (eventId: number, updates: Partial<CalendarEvent>) => void
  moveEvent: (args: EventInteractionArgs<object>) => void
  resizeEvent: (args: EventInteractionArgs<object>) => void
} => {
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents)

  const updateEvent = useCallback<(eventId: number, updates: Partial<CalendarEvent>) => void>((eventId, updates) => {
    setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, ...updates } : event)))
  }, [])

  const moveEvent = useCallback<(args: EventInteractionArgs<object>) => void>(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const typedEvent = event as CalendarEvent
      const { allDay } = typedEvent
      if (!allDay && droppedOnAllDaySlot) {
        typedEvent.allDay = true
      }
      if (allDay && !droppedOnAllDaySlot) {
        typedEvent.allDay = false
      }

      setEvents((prev) => {
        const existing = prev.find((ev) => ev.id === typedEvent.id) ?? {}
        const filtered = prev.filter((ev) => ev.id !== typedEvent.id)
        return [...filtered, { ...existing, start, end, allDay: typedEvent.allDay } as CalendarEvent]
      })
    },
    [setEvents]
  )

  const resizeEvent = useCallback<(args: EventInteractionArgs<object>) => void>(
    ({ event, start, end }) => {
      const typedEvent = event as CalendarEvent
      setEvents((prev) => {
        const existing = prev.find((ev) => ev.id === typedEvent.id) ?? {}
        const filtered = prev.filter((ev) => ev.id !== typedEvent.id)
        return [...filtered, { ...existing, start, end } as CalendarEvent]
      })
    },
    [setEvents]
  )

  return { events, setEvents, updateEvent, moveEvent, resizeEvent }
}
