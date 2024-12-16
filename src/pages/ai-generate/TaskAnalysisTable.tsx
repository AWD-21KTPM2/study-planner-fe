import './task-analysis-table.scss'

import { Table, Tag } from 'antd'
import React from 'react'

import { TaskPriority, TaskStatus } from '@/constants/task.const'

const { Column } = Table

export interface IAnalyzeTaskProps {
  dataSource: DataProps[] | undefined
}

export interface DataProps {
  key: React.Key
  taskName: string
  startDate: string
  endDate: string
  priority: string
  status: string
  orderToDo: number
  overlapWith: string | null
  overlappedPeriod: string | null
}

const TaskAnalysisTable: React.FC<IAnalyzeTaskProps> = ({ dataSource }) => (
  <Table<DataProps> dataSource={dataSource} pagination={false} className='overflow-auto'>
    <Column title='Task Name' dataIndex='taskName' key='taskName' />
    <Column title='Start Date' dataIndex='startDate' key='startDate' />
    <Column title='End Date' dataIndex='endDate' key='endDate' />
    <Column
      title='Priority'
      dataIndex='priority'
      key='priority'
      render={(priority: TaskPriority) => {
        let color = priority === TaskPriority.CRITICAL ? 'red' : 'gold'
        if (priority === TaskPriority.HIGH) {
          color = 'volcano'
        } else if (priority === TaskPriority.MEDIUM) {
          color = 'geekblue'
        }

        return (
          <Tag color={color} key={priority}>
            {priority.toUpperCase()}
          </Tag>
        )
      }}
    />
    <Column
      title='Status'
      dataIndex='status'
      key='status'
      render={(status: string) => (
        <Tag color={status === TaskStatus.IN_PROGRESS ? 'geekblue' : 'volcano'} key={status}>
          {status.toUpperCase()}
        </Tag>
      )}
    />
    <Column title='Order To Do' dataIndex='orderToDo' key='orderToDo' />
    <Column title='Overlap With' dataIndex='overlapWith' key='overlapWith' />
    <Column title='Overlapped Period' dataIndex='overlappedPeriod' key='overlappedPeriod' />
  </Table>
)

export default TaskAnalysisTable
