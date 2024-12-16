import { FC } from 'react'

import { Task } from '@/types/task.type'

import TaskCard from './TaskCard'

interface TaskListProps {
  task_list: Task[]
  limit?: number
}

const TaskList: FC<TaskListProps> = ({ task_list, limit = 5 }) => {
  const handleDragStart = (task: Task): void => {
    localStorage.setItem('draggedTask', JSON.stringify(task))
  }

  return (
    <div className='flex flex-col gap-4'>
      {task_list.slice(0, limit).map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onDragStart={handleDragStart}
          className='bg-gray-50 hover:bg-gray-100 transition-colors'
        />
      ))}
    </div>
  )
}

export default TaskList
