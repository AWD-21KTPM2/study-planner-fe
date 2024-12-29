import { FC } from 'react'

interface TaskSectionHeaderProps {
  title: string
  count: number
  color: 'red' | 'green'
}

export const TaskSectionHeader: FC<TaskSectionHeaderProps> = ({ title, count, color }) => (
  <div className='flex justify-between items-center mb-4'>
    <span className={`font-medium text-lg text-${color}-600`}>{title}</span>
    <span className='font-semibold text-gray-500 text-xs'>{count}</span>
  </div>
)
