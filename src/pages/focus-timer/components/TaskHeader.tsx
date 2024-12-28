import { CheckCircleOutlined, ClockCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { Button, Select, Space } from 'antd'
import React from 'react'

import { TaskStatus, TaskStatusOptions } from '@/constants/task.const'
import { useUpdateTask } from '@/hooks/useTasks'
import { Task } from '@/types/task.type'

import { formatTime } from '../utils'

interface TaskHeaderProps {
  task: Task | undefined
}

interface StatusLabelProps {
  label: string
  status: string
}

const getStatusIcon = (status: string): React.ReactNode => {
  switch (status) {
    case TaskStatus.TODO:
      return <ClockCircleOutlined className='text-gray-400' />
    case TaskStatus.IN_PROGRESS:
      return <LoadingOutlined className='text-blue-500' />
    case TaskStatus.COMPLETED:
      return <CheckCircleOutlined className='text-emerald-500' />
    default:
      return null
  }
}

export const StatusLabel: React.FC<StatusLabelProps> = ({ label, status }) => {
  return (
    <div className='flex items-center gap-2'>
      <span>{getStatusIcon(status)}</span>
      <span>{label}</span>
    </div>
  )
}

const TaskHeader: React.FC<TaskHeaderProps> = ({ task }) => {
  const updateTask = useUpdateTask()

  if (!task) {
    return (
      <div className='flex flex-col items-center gap-4'>
        <h1 className='font-bold text-2xl'>No task selected</h1>
        <p className='text-gray-500 text-sm'>Please select a task to start the timer</p>
      </div>
    )
  }

  const handleStatusChange = (status: string): void => {
    updateTask.mutate({
      id: task._id as string,
      task: { status }
    })
  }

  return (
    <div className='flex flex-col items-center gap-4 w-full max-w-lg text-center'>
      <h1 className='font-bold text-2xl text-gray-800'>{task.name}</h1>
      {task.description && <p className='text-gray-500 text-sm'>{task.description}</p>}

      <Space className='justify-center w-full' size='large'>
        <div className='flex items-center gap-2 text-sm'>
          <span className='font-medium text-gray-700'>Estimated Time:</span>
          <span className='text-emerald-600'>{formatTime(task.estimatedTime)}</span>
        </div>

        <div className='flex items-center gap-2'>
          <span className='font-medium text-gray-700 text-sm'>Status:</span>
          <Select
            value={task.status}
            onChange={handleStatusChange}
            className='w-32'
            labelRender={(props) => <StatusLabel label={props.label as string} status={task.status} />}
            options={TaskStatusOptions.filter((option) => option.value !== TaskStatus.EXPIRED)}
          />
        </div>
      </Space>

      {task.status === TaskStatus.IN_PROGRESS && (
        <Button
          type='primary'
          icon={<CheckCircleOutlined />}
          onClick={() => handleStatusChange(TaskStatus.COMPLETED)}
          className='bg-emerald-500 hover:!bg-emerald-600 mt-2'
        >
          Mark as Complete
        </Button>
      )}
    </div>
  )
}

export default TaskHeader
