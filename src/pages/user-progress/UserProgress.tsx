import type { ProgressProps } from 'antd'
import { Flex, Progress, Tag } from 'antd'
import React, { useEffect, useState } from 'react'

import { TimerProgressResponse } from '@/utils/apis/insights-apis.util'
import { roundPercentForUserProgress } from '@/utils/common.util'

const twoColors: ProgressProps['strokeColor'] = {
  '0%': '#108ee9',
  '100%': '#87d068'
}

export interface IUserProgressProps {
  dataSource: TimerProgressResponse | undefined
}

const UserProgress: React.FC<IUserProgressProps> = ({ dataSource: _dataSource }) => {
  const [timeRate, setTimeRate] = useState<number>(1) // actual time / estimate time

  const [totalTasks, setTotalTasks] = useState<number>(10)
  const [completedTasks, setCompletedTasks] = useState<number>(1)
  const [inProgressTasks, setInProgressTasks] = useState<number>(1)
  const [expiredTasks, setExpiredTasks] = useState<number>(1)
  const [todoTasks, setTodoTasks] = useState<number>(1)

  useEffect(() => {
    if (_dataSource) {
      setTimeRate(parseFloat(_dataSource.totalProductivity))
      setTotalTasks(_dataSource.totalTasks)
      setCompletedTasks(_dataSource.countCompletedTasks)
      setInProgressTasks(_dataSource.countInProgressTasks)
      setExpiredTasks(_dataSource.countExpiredTasks)
      setTodoTasks(_dataSource.countTodoTasks)
    }
  }, [_dataSource])

  return (
    <Flex vertical gap='middle'>
      <Progress
        percent={timeRate}
        format={(percent) => `${percent}% (Actual time/ Estimate time)`}
        strokeColor={twoColors}
        status={timeRate === 100 ? 'success' : 'active'}
      />

      <Flex gap='middle' justify='center'>
        <Flex gap='small' vertical>
          <Progress
            type='circle'
            percent={roundPercentForUserProgress(todoTasks, totalTasks)}
            format={() => `${todoTasks}/${totalTasks}`}
          />
          <Tag color='default' className='text-base me-0 text-center'>
            To-do tasks
          </Tag>
        </Flex>

        <Flex gap='small' vertical>
          <Progress
            type='circle'
            percent={roundPercentForUserProgress(inProgressTasks, totalTasks)}
            format={() => `${inProgressTasks}/${totalTasks}`}
          />
          <Tag color='processing' className='text-base me-0 text-center'>
            In-progress tasks
          </Tag>
        </Flex>

        <Flex gap='small' vertical>
          <Progress
            type='circle'
            percent={roundPercentForUserProgress(completedTasks, totalTasks)}
            format={() => `${completedTasks}/${totalTasks}`}
          />
          <Tag color='success' className='text-base me-0 text-center'>
            Completed tasks
          </Tag>
        </Flex>

        <Flex gap='small' vertical>
          <Progress
            type='circle'
            percent={roundPercentForUserProgress(expiredTasks, totalTasks)}
            format={() => `${expiredTasks}/${totalTasks}`}
          />
          <Tag color='error' className='text-base me-0 text-center'>
            Expired tasks
          </Tag>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default UserProgress
