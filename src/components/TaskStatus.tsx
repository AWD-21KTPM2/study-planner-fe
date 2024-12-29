import { Tooltip } from 'antd'
import { FC, PropsWithChildren } from 'react'

interface TaskStatusProps extends PropsWithChildren {
  hasStartDate: boolean
}

export const TaskStatus: FC<TaskStatusProps> = ({ hasStartDate, children }) => {
  return <Tooltip title={hasStartDate ? '' : 'Unscheduled'}>{children}</Tooltip>
}
