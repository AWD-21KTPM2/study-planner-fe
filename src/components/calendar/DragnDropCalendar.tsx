import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import { useMemo } from 'react'
import { Calendar, DateLocalizer, dayjsLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import { useCalendarEvents } from './hooks/useCalendarEvents'

const DragAndDropCalendar = withDragAndDrop(Calendar)

interface DragnDropCalendarProps {
  localizer?: DateLocalizer
}

dayjs.extend(timezone)
const djLocalizer = dayjsLocalizer(dayjs)

const DragnDropCalendar = ({ localizer }: DragnDropCalendarProps): JSX.Element => {
  const { events, moveEvent, resizeEvent } = useCalendarEvents()

  const defaultDate = useMemo<Date>(() => new Date(), [])
  return (
    <DragAndDropCalendar
      selectable
      popup
      resizable
      events={events}
      localizer={localizer ?? djLocalizer}
      onEventDrop={moveEvent}
      onEventResize={resizeEvent}
      defaultView='week'
      defaultDate={defaultDate}
      className='w-full h-full'
    />
  )
}

export default DragnDropCalendar
