import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { Spin } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import { Calendar, DateLocalizer, dayjsLocalizer, Views } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import { useTasks } from '@/hooks/useTasks'
import EditTaskModal from '@/pages/tasks/EditTaskModal'

import { useCalendarEvents } from './hooks/useCalendarEvents'
import { useCalendarHandlers } from './hooks/useCalendarHandlers'
import { useEventStyles } from './hooks/useEventStyles'

// Initialize dayjs timezone
dayjs.extend(timezone)
const djLocalizer = dayjsLocalizer(dayjs)

const DragAndDropCalendarBase = withDragAndDrop(Calendar)

interface DragAndDropCalendarProps {
  /** Custom date localizer for the calendar */
  localizer?: DateLocalizer
  /** Custom class name for the calendar container */
  className?: string
}

/**
 * DragAndDropCalendar component provides a calendar view with drag and drop functionality
 * for managing tasks and events.
 */
const DragAndDropCalendar = ({
  localizer = djLocalizer,
  className = 'w-full h-full'
}: DragAndDropCalendarProps): JSX.Element => {
  const { data: tasks } = useTasks()
  const { events, moveEvent, resizeEvent, onDropFromOutside, draggedEvent, isPending } = useCalendarEvents()

  const { eventPropGetter } = useEventStyles(tasks)
  const { handleSelectEvent, handleCloseEditModal, isEditModalOpen, selectedTaskId, dragAndDropProps } =
    useCalendarHandlers({ draggedEvent, moveEvent, resizeEvent, onDropFromOutside })

  // Default calendar configuration
  const calendarConfig = {
    defaultView: 'week' as const,
    defaultDate: new Date(),
    step: 15,
    timeslots: 2,
    views: [Views.MONTH, Views.WEEK, Views.DAY],
    showMultiDayTimes: true
  }

  return (
    <>
      <Spin spinning={isPending} tip='Loading...' fullscreen={true} />
      <DragAndDropCalendarBase
        {...calendarConfig}
        {...dragAndDropProps}
        selectable
        popup
        events={events}
        localizer={localizer}
        eventPropGetter={eventPropGetter}
        onSelectEvent={handleSelectEvent}
        className={className}
      />
      <EditTaskModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} taskId={selectedTaskId ?? ''} />
    </>
  )
}

export default DragAndDropCalendar
