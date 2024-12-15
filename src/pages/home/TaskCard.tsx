import { Card, CardProps, Tag } from 'antd'
import { FC } from 'react'

import { taskPriorityColorMap } from '@/constants/task.const'
import { Task } from '@/types/task.type'

interface TaskCardProps extends CardProps {
  task: Task
}

const TaskCard: FC<TaskCardProps> = ({ task, ...props }) => {
  return (
    <Card {...props}>
      <div className='flex justify-between items-center'>
        <div className='flex flex-col justify-center items-start gap-1'>
          <div className='font-medium'>{task.name}</div>
          <div className='text-gray-500 text-sm'>{`${task.estimatedTime} hours estimated`}</div>
        </div>
        <Tag color={taskPriorityColorMap[task.priority as keyof typeof taskPriorityColorMap]}>{task.priority}</Tag>
      </div>
    </Card>
  )
}

export default TaskCard
