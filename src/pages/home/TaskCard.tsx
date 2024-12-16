import { Card, CardProps, Tag } from 'antd'
import { FC } from 'react'

import { taskPriorityColorMap } from '@/constants/task.const'
import { Task } from '@/types/task.type'

interface TaskCardProps extends Omit<CardProps, 'onDragStart'> {
  task: Task
  onDragStart?: (task: Task) => void
}

const TaskCard: FC<TaskCardProps> = ({ task, onDragStart, ...props }) => {
  const handleDragStart = (e: React.DragEvent): void => {
    e.dataTransfer.setData('task', JSON.stringify(task))
    e.dataTransfer.effectAllowed = 'move'
    onDragStart?.(task)
  }

  return (
    <Card
      {...props}
      draggable
      onDragStart={handleDragStart}
      size='small'
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
  )
}

export default TaskCard
