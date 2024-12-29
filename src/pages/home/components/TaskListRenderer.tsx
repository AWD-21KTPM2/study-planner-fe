import { FC } from 'react'

import { TaskStatus } from '@/components/TaskStatus'
import { TASK_STYLES } from '@/constants/task.const'
import { Task } from '@/types/task.type'

import TaskCard from '../TaskCard'

interface TaskListRendererProps {
  tasks: Task[]
  hasStartDate: boolean
  onDragStart: (task: Task) => void
}

export const TaskListRenderer: FC<TaskListRendererProps> = ({ tasks, hasStartDate, onDragStart }) => {
  const getTaskStyles = (hasStartDate: boolean): string => {
    const styles = hasStartDate ? TASK_STYLES.SCHEDULED : TASK_STYLES.UNSCHEDULED
    return `${styles.backgroundColor} ${styles.hoverBackground} ${styles.border} transition-colors`
  }

  return (
    <div className='flex flex-col gap-4'>
      {tasks.map((task) => (
        <TaskStatus key={task._id} hasStartDate={hasStartDate}>
          <TaskCard task={task} onDragStart={onDragStart} className={getTaskStyles(hasStartDate)} />
        </TaskStatus>
      ))}
    </div>
  )
}
