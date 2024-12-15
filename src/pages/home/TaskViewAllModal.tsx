import { Empty, Modal, Typography } from 'antd'
import { FC } from 'react'

import { Task } from '@/types/task.type'

import TaskList from './TaskList'

interface TaskViewAllModalProps {
  task_list: Task[]
  isOpen: boolean
  onClose: () => void
}

const TaskViewAllModal: FC<TaskViewAllModalProps> = ({ isOpen, onClose, task_list }) => {
  return (
    <Modal open={isOpen} onClose={onClose} title='Tasks'>
      {task_list.length > 0 ? (
        <div className='flex flex-col gap-4 max-h-[50vh] overflow-y-auto'>
          <TaskList task_list={task_list} limit={100} />
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Typography.Text>Task not found</Typography.Text>} />
      )}
    </Modal>
  )
}

export default TaskViewAllModal
