import { FC } from 'react'
import { useEffect, useState } from 'react'

import { Task } from '@/types/task.type'
import { getTasksByUserId } from '@/utils/apis/task-apis.util'

import TaskCard from './TaskCard'

const TaskList: FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const fetchTasks = async (): Promise<void> => {
      const response = await getTasksByUserId()
      setTasks(response.data.tasks)
    }
    fetchTasks()
  }, [])

  return (
    <div className='flex flex-col gap-4'>
      {tasks.slice(0, 5).map((task) => (
        <TaskCard key={task._id} task={task} className='bg-gray-50 hover:bg-gray-100' />
      ))}
    </div>
  )
}

export default TaskList
