import { FC } from 'react'

import { Task } from '@/types/task.type'

import { TaskSectionHeader } from './TaskSectionHeader'

interface TaskSectionProps {
  title: string
  tasks: Task[]
  color: 'red' | 'green'
  renderTasks: (tasks: Task[]) => React.ReactNode
}

export const TaskSection: FC<TaskSectionProps> = ({ title, tasks, color, renderTasks }) => {
  if (tasks.length === 0) return null

  return (
    <section className='h-[25rem] overflow-y-auto'>
      <TaskSectionHeader title={title} count={tasks.length} color={color} />
      {renderTasks(tasks)}
    </section>
  )
}
