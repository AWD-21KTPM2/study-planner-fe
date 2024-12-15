import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Empty, message, Space, Spin, Table, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import { FC, ReactNode, useState } from 'react'

import { TaskPriority, taskPriorityColorMap, TaskStatus, taskStatusColorMap } from '@/constants/task.const'
import { useDeleteTask, useTasks } from '@/hooks/useTasks'
import { Task } from '@/types/task.type'

import NewTaskModal from '../home/NewTaskModal'
import EditTaskModal from './EditTaskModal'

const TaskPage: FC = () => {
  const { data: tasks, isLoading } = useTasks()

  const [isNewTaskOpen, setIsNewTaskOpen] = useState<boolean>(false)
  const [isEditTaskOpen, setIsEditTaskOpen] = useState<boolean>(false)
  const [editTaskId, setEditTaskId] = useState<string | null>(null)
  const { mutate: deleteTask } = useDeleteTask()
  const columns = [
    {
      title: 'Title',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      render: (name: string): ReactNode => <Typography.Text>{name}</Typography.Text>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 100,
      render: (startDate: Date): ReactNode => (
        <Typography.Text>{startDate ? dayjs(startDate).format('DD/MM/YYYY HH:mm') : ''}</Typography.Text>
      )
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 100,
      render: (endDate: Date): ReactNode => (
        <Typography.Text>{endDate ? dayjs(endDate).format('DD/MM/YYYY HH:mm') : ''}</Typography.Text>
      )
    },
    {
      title: 'Estimated Time',
      dataIndex: 'estimatedTime',
      key: 'estimatedTime',
      width: 100,
      render: (estimatedTime: number): ReactNode => <Typography.Text>{estimatedTime} minutes</Typography.Text>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: TaskStatus): ReactNode => <Tag color={taskStatusColorMap[status]}>{status}</Tag>
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: TaskPriority): ReactNode => <Tag color={taskPriorityColorMap[priority]}>{priority}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_: unknown, record: Task): ReactNode => (
        <Space>
          <Button
            type='text'
            icon={<EditOutlined />}
            onClick={() => {
              if (!record._id) {
                message.error('Task ID is required')
                return
              }
              setIsEditTaskOpen(true)
              setEditTaskId(record._id)
            }}
          />
          <Button
            className='hover:!border-0 hover:ring-1 hover:ring-red-500'
            type='text'
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteTask(record._id ?? '')}
          />
        </Space>
      )
    }
  ]

  return (
    <>
      <div className='mx-auto container'>
        <div className='flex justify-end'>
          <Button type='primary' onClick={() => setIsNewTaskOpen(true)} className='mb-4 ml-auto'>
            <PlusOutlined /> Add Task
          </Button>
        </div>
        {isLoading && <Spin fullscreen />}
        {tasks && tasks.length > 0 ? (
          <Table
            key={tasks.length}
            bordered
            dataSource={tasks}
            columns={columns}
            rowKey='_id'
            scroll={{ y: '80vh' }}
            pagination={{
              total: tasks.length,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`
            }}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Typography.Text>Task not found</Typography.Text>} />
        )}
      </div>

      <NewTaskModal isOpen={isNewTaskOpen} onClose={() => setIsNewTaskOpen(false)} />
      <EditTaskModal isOpen={isEditTaskOpen} onClose={() => setIsEditTaskOpen(false)} taskId={editTaskId ?? ''} />
    </>
  )
}

export default TaskPage
