/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-explicit-generics/require-explicit-generics */
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import { useCallback, useEffect, useMemo } from 'react'
import { Calendar, DateLocalizer, dayjsLocalizer, Event, EventPropGetter, Formats } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import { taskPriorityColorMap } from '@/constants/task.const'
import { useTasks } from '@/hooks/useTasks'
import { Task } from '@/types/task.type'

import { CalendarEvent, useCalendarEvents } from './hooks/useCalendarEvents'

const DragAndDropCalendar = withDragAndDrop(Calendar)

interface DragnDropCalendarProps {
  localizer?: DateLocalizer
}

dayjs.extend(timezone)
const djLocalizer = dayjsLocalizer(dayjs)

const DragnDropCalendar = ({ localizer }: DragnDropCalendarProps): JSX.Element => {
  const { setEvents, events, moveEvent, resizeEvent, onDropFromOutside, draggedEvent } = useCalendarEvents()
  const { data: tasks } = useTasks()
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

  const defaultDate = useMemo<Date>(() => new Date(), [])
  // Calendar formats
  const formats = useMemo<Formats>(
    () => ({
      eventTimeRangeFormat: (): string => '', // Hide time range in event title
      timeGutterFormat: 'HH:mm',
      dayHeaderFormat: 'ddd DD/MM'
    }),
    []
  )
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

  const dragFromOutsideItem = useCallback(() => {
    if (draggedEvent) {
      return (_event: Event): Date => new Date(draggedEvent.start)
    }
    return (_event: Event): Date => new Date()
  }, [draggedEvent])
  // Handle drag-n-drop props

  const customOnDragOverFromOutside = useCallback(
    (dragEvent: any) => {
      if (draggedEvent !== null) {
        dragEvent.preventDefault()
      }
    },
    [draggedEvent]
  )
  const dragAndDropProps = {
    onEventDrop: moveEvent,
    onEventResize: resizeEvent,
    onDropFromOutside: onDropFromOutside,
    onDragOverFromOutside: customOnDragOverFromOutside,
    dragFromOutsideItem: dragFromOutsideItem,
    resizable: true
  }

  return (
    <DragAndDropCalendar
      {...dragAndDropProps}
      selectable
      popup
      events={events}
      localizer={localizer ?? djLocalizer}
      defaultView='week'
      defaultDate={defaultDate}
      formats={formats}
      eventPropGetter={eventPropGetter as EventPropGetter<object>}
      className='w-full h-full'
      step={30}
      views={['week', 'day', 'month']}
    />
  )
}

export default DragnDropCalendar
