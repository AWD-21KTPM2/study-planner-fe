import { Card, type CardProps, Tag } from 'antd'
import { type FC, useState } from 'react'

import { taskPriorityColorMap } from '@/constants/task.const'
import type { Task } from '@/types/task.type'

import EditTaskModal from '../tasks/EditTaskModal'

interface TaskCardProps extends Omit<CardProps, 'onDragStart'> {
  task: Task
  onDragStart?: (task: Task) => void
}

const TaskCard: FC<TaskCardProps> = ({ task, onDragStart, ...props }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleDragStart = (e: React.DragEvent): void => {
    e.dataTransfer.setData('task', JSON.stringify(task))
    e.dataTransfer.effectAllowed = 'move'
    onDragStart?.(task)
  }

  const onClose = (): void => setIsOpen(false)

  return (
    <>
      <Card
        {...props}
        draggable
        onDragStart={handleDragStart}
        onClick={() => setIsOpen(true)}
        size='small'
        className='hover:cursor-pointer'
        title={
          <div className='flex justify-between items-center'>
            <div className='font-medium'>{task.name}</div>
            <Tag
              color={taskPriorityColorMap[task.priority as keyof typeof taskPriorityColorMap]}
              className='m-0 text-xs uppercase'
            >
              {task.priority}
            </Tag>
          </div>
        }
      >
        <p className='text-gray-600 text-sm'>{task.description}</p>
        <div className='flex justify-between items-center mt-2'>
          <Tag color='blue'>{task.status}</Tag>
          {task.estimatedTime && <span className='text-gray-500 text-xs'>Est: {task.estimatedTime}h</span>}
        </div>
      </Card>

      <EditTaskModal isOpen={isOpen} onClose={onClose} taskId={task._id as string} />
    </>
  )
}

export default TaskCard
