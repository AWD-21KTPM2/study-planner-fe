import type { FC } from 'react'

interface TaskSectionHeaderProps {
  title: string
  count: number
  color: 'red' | 'green'
}

export const TaskSectionHeader: FC<TaskSectionHeaderProps> = ({ title, count, color }) => (
  <div className='flex justify-between items-center mb-4'>
    <span className={`font-medium xl:text-lg text-${color}-600 text-xs`}>{title}</span>
    <span className='mr-4 font-semibold text-gray-500 text-xs'>Total: {count}</span>
  </div>
)
