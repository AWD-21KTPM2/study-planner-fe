import { FC, useMemo } from 'react'

import { TASK_LIST_DEFAULTS } from '@/constants/task.const'
import { Task } from '@/types/task.type'

import { TaskListRenderer } from './components/TaskListRenderer'
import { TaskSection } from './components/TaskSection'

interface TaskListProps {
  task_list: Task[]
  limit?: number
}

const TaskList: FC<TaskListProps> = ({ task_list, limit = TASK_LIST_DEFAULTS.DEFAULT_LIMIT }) => {
  const handleDragStart = (task: Task): void => {
    localStorage.setItem('draggedTask', JSON.stringify(task))
  }

  const { scheduledTasks, unscheduledTasks } = useMemo<{ scheduledTasks: Task[]; unscheduledTasks: Task[] }>(() => {
    const scheduled: Task[] = []
    const unscheduled: Task[] = []

    task_list.forEach((task) => {
      if (task.startDate) scheduled.push(task)
      else unscheduled.push(task)
    })

    return {
      scheduledTasks: scheduled.slice(0, limit),
      unscheduledTasks: unscheduled.slice(0, limit)
    }
  }, [task_list, limit])

  return (
    <div className='flex flex-col gap-6'>
      <TaskSection
        title='Unscheduled Tasks'
        tasks={unscheduledTasks}
        color='red'
        renderTasks={(tasks) => <TaskListRenderer tasks={tasks} hasStartDate={false} onDragStart={handleDragStart} />}
      />
      <TaskSection
        title='Scheduled Tasks'
        tasks={scheduledTasks}
        color='green'
        renderTasks={(tasks) => <TaskListRenderer tasks={tasks} hasStartDate={true} onDragStart={handleDragStart} />}
      />
    </div>
  )
}

export default TaskList
