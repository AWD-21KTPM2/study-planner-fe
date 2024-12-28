/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from 'react'
import { Event } from 'react-big-calendar'

import { CalendarEvent } from './useCalendarEvents'

interface CalendarHandlerProps {
  draggedEvent: CalendarEvent | null
  moveEvent: (arg: any) => void
  resizeEvent: (arg: any) => void
  onDropFromOutside: (arg: any) => void
}

interface CalendarHandlers {
  handleSelectEvent: (event: CalendarEvent) => void
  handleCloseEditModal: () => void
  isEditModalOpen: boolean
  selectedTaskId: string | null
  dragAndDropProps: any
}

type DragFromOutsideItem = () => (event: Event) => Date
type DragOverFromOutside = (dragEvent: any) => void

export const useCalendarHandlers = ({
  draggedEvent,
  moveEvent,
  resizeEvent,
  onDropFromOutside
}: CalendarHandlerProps): CalendarHandlers => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  const handleSelectEvent = (event: CalendarEvent): void => {
    setSelectedTaskId(event.id)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = (): void => {
    setIsEditModalOpen(false)
    setSelectedTaskId(null)
  }

  const dragFromOutsideItem = useCallback<DragFromOutsideItem>(() => {
    return draggedEvent ? (_event: Event): Date => new Date(draggedEvent.start) : (_event: Event): Date => new Date()
  }, [draggedEvent])

  const handleDragOverFromOutside = useCallback<DragOverFromOutside>(
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
    onDragOverFromOutside: handleDragOverFromOutside,
    dragFromOutsideItem: dragFromOutsideItem,
    resizable: true
  }

  return {
    handleSelectEvent,
    handleCloseEditModal,
    isEditModalOpen,
    selectedTaskId,
    dragAndDropProps
  }
}
