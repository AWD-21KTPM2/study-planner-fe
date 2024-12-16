import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Empty, Input, message, Select, Space, Spin, Table, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import { FC, ReactNode, useState } from 'react'

import { TaskPriority, taskPriorityColorMap, TaskStatus, taskStatusColorMap } from '@/constants/task.const'
import { useDeleteTask, useTasks } from '@/hooks/useTasks'
import { Task } from '@/types/task.type'

import NewTaskModal from '../home/NewTaskModal'
import EditTaskModal from './EditTaskModal'

const { Option } = Select

const TaskPage: FC = () => {
  const { data: tasks, isLoading } = useTasks()

  const [isNewTaskOpen, setIsNewTaskOpen] = useState<boolean>(false)
  const [isEditTaskOpen, setIsEditTaskOpen] = useState<boolean>(false)
  const [editTaskId, setEditTaskId] = useState<string | null>(null)
  const { mutate: deleteTask } = useDeleteTask()
  const [searchQuery, setSearchQuery] = useState<string>('') // State for search input
  const [filterStatus, setFilterStatus] = useState<TaskStatus | null>(null) // State for status filter
  const [filterPriority, setFilterPriority] = useState<TaskPriority | null>(null) // State for priority filter

  // Filter tasks based on search, status, and priority
  const filteredTasks = tasks?.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus ? task.status === filterStatus : true
    const matchesPriority = filterPriority ? task.priority === filterPriority : true
    return matchesSearch && matchesStatus && matchesPriority
  })

  // const columns = [
  //   {
  //     title: 'Title',
  //     dataIndex: 'name',
  //     key: 'name',
  //     width: 100,
  //     render: (name: string): ReactNode => <Typography.Text>{name}</Typography.Text>
  //   },
  //   {
  //     title: 'Description',
  //     dataIndex: 'description',
  //     key: 'description',
  //     width: 200
  //   },
  //   {
  //     title: 'Start Date',
  //     dataIndex: 'startDate',
  //     key: 'startDate',
  //     width: 100,
  //     render: (startDate: Date): ReactNode => (
  //       <Typography.Text>{startDate ? dayjs(startDate).format('DD/MM/YYYY HH:mm') : ''}</Typography.Text>
  //     )
  //   },
  //   {
  //     title: 'End Date',
  //     dataIndex: 'endDate',
  //     key: 'endDate',
  //     width: 100,
  //     render: (endDate: Date): ReactNode => (
  //       <Typography.Text>{endDate ? dayjs(endDate).format('DD/MM/YYYY HH:mm') : ''}</Typography.Text>
  //     )
  //   },
  //   {
  //     title: 'Estimated Time',
  //     dataIndex: 'estimatedTime',
  //     key: 'estimatedTime',
  //     width: 100,
  //     render: (estimatedTime: number): ReactNode => <Typography.Text>{estimatedTime} minutes</Typography.Text>
  //   },
  //   {
  //     title: 'Status',
  //     dataIndex: 'status',
  //     key: 'status',
  //     width: 100,
  //     render: (status: TaskStatus): ReactNode => <Tag color={taskStatusColorMap[status]}>{status}</Tag>
  //   },
  //   {
  //     title: 'Priority',
  //     dataIndex: 'priority',
  //     key: 'priority',
  //     width: 100,
  //     render: (priority: TaskPriority): ReactNode => <Tag color={taskPriorityColorMap[priority]}>{priority}</Tag>
  //   },
  //   {
  //     title: 'Actions',
  //     key: 'actions',
  //     width: 100,
  //     render: (_: unknown, record: Task): ReactNode => (
  //       <Space>
  //         <Button
  //           type='text'
  //           icon={<EditOutlined />}
  //           onClick={() => {
  //             if (!record._id) {
  //               message.error('Task ID is required')
  //               return
  //             }
  //             setIsEditTaskOpen(true)
  //             setEditTaskId(record._id)
  //           }}
  //         />
  //         <Button
  //           className='hover:!border-0 hover:ring-1 hover:ring-red-500'
  //           type='text'
  //           danger
  //           icon={<DeleteOutlined />}
  //           onClick={() => deleteTask(record._id ?? '')}
  //         />
  //       </Space>
  //     )
  //   }
  // ]

  const priorityRank: { [key in TaskPriority]: number } = {
    Low: 1,
    Medium: 2,
    High: 3,
    Critical: 4
  }

  const statusRank: { [key in TaskStatus]: number } = {
    Todo: 1,
    'In Progress': 2,
    Completed: 3,
    Expired: 4
  }

  const columns = [
    {
      title: 'Title',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      render: (name: string): ReactNode => <Typography.Text>{name}</Typography.Text>
      // sorter: (a: Task, b: Task) => a.name.localeCompare(b.name)
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
      ),
      sorter: (a: Task, b: Task): number => new Date(a.startDate ?? 0).getTime() - new Date(b.startDate ?? 0).getTime()
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 100,
      render: (endDate: Date): ReactNode => (
        <Typography.Text>{endDate ? dayjs(endDate).format('DD/MM/YYYY HH:mm') : ''}</Typography.Text>
      ),
      sorter: (a: Task, b: Task): number => new Date(a.endDate ?? 0).getTime() - new Date(b.endDate ?? 0).getTime()
    },
    {
      title: 'Estimated Time',
      dataIndex: 'estimatedTime',
      key: 'estimatedTime',
      width: 100,
      render: (estimatedTime: number): ReactNode => <Typography.Text>{estimatedTime} minutes</Typography.Text>,
      sorter: (a: Task, b: Task): number => a.estimatedTime - b.estimatedTime
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: TaskStatus): ReactNode => <Tag color={taskStatusColorMap[status]}>{status}</Tag>,
      sorter: (a: Task, b: Task): number => statusRank[a.status as TaskStatus] - statusRank[b.status as TaskStatus]
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: TaskPriority): ReactNode => <Tag color={taskPriorityColorMap[priority]}>{priority}</Tag>,
      sorter: (a: Task, b: Task): number =>
        priorityRank[a.priority as TaskPriority] - priorityRank[b.priority as TaskPriority]
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
        <div className='flex justify-between mb-4'>
          <div className='flex gap-4'>
            <Input
              placeholder='Search tasks by title or description'
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ maxWidth: '300px' }}
            />
            <Select
              placeholder='Filter by Status'
              value={filterStatus}
              onChange={(value) => setFilterStatus(value)}
              allowClear
              style={{ width: '150px' }}
            >
              {Object.values(TaskStatus).map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
            <Select
              placeholder='Filter by Priority'
              value={filterPriority}
              onChange={(value) => setFilterPriority(value)}
              allowClear
              style={{ width: '150px' }}
            >
              {Object.values(TaskPriority).map((priority) => (
                <Option key={priority} value={priority}>
                  {priority}
                </Option>
              ))}
            </Select>
          </div>
          <Button type='primary' onClick={() => setIsNewTaskOpen(true)}>
            <PlusOutlined /> Add Task
          </Button>
        </div>
        {isLoading && <Spin fullscreen />}
        {filteredTasks && filteredTasks.length > 0 ? (
          <Table
            bordered
            dataSource={filteredTasks}
            columns={columns}
            rowKey='_id'
            scroll={{ y: '80vh' }}
            pagination={{
              total: filteredTasks.length,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`
            }}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Typography.Text>No tasks found</Typography.Text>} />
        )}
      </div>

      <NewTaskModal isOpen={isNewTaskOpen} onClose={() => setIsNewTaskOpen(false)} />
      <EditTaskModal isOpen={isEditTaskOpen} onClose={() => setIsEditTaskOpen(false)} taskId={editTaskId ?? ''} />
    </>
  )
}

export default TaskPage
