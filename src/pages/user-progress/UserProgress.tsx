import type { ProgressProps } from 'antd'
import { Flex, Progress, Tag } from 'antd'
import React, { useState } from 'react'

import { roundDecimalPercent } from '@/utils/common.util'

const twoColors: ProgressProps['strokeColor'] = {
  '0%': '#108ee9',
  '100%': '#87d068'
}

const UserProgress: React.FC = () => {
  const [actualTime, _setActualTime] = useState<number>(1)
  const [estimateTime, _setEstimateTime] = useState<number>(2)

  const [totalTasks, _setTotalTasks] = useState<number>(10)
  const [completedTasks, _setCompletedTasks] = useState<number>(2)
  const [inProgressTasks, _setInProgressTasks] = useState<number>(3)
  const [expiredTasks, _setExpiredTasks] = useState<number>(4)
  const [todoTasks, _setTodoTasks] = useState<number>(6)

  return (
    <Flex vertical gap='middle'>
      <Progress
        percent={roundDecimalPercent(actualTime, estimateTime)}
        format={(percent) => `${percent}% (Actual time/ Estimate time)`}
        strokeColor={twoColors}
        status={roundDecimalPercent(actualTime, estimateTime) === 100 ? 'success' : 'active'}
      />

      <Flex gap='middle' justify='center'>
        <Flex gap='small' vertical>
          <Progress
            type='circle'
            percent={roundDecimalPercent(todoTasks, totalTasks)}
            format={() => `${todoTasks}/${totalTasks}`}
          />
          <Tag color='default' className='text-base me-0 text-center'>
            To-do tasks
          </Tag>
        </Flex>

        <Flex gap='small' vertical>
          <Progress
            type='circle'
            percent={roundDecimalPercent(inProgressTasks, totalTasks)}
            format={() => `${inProgressTasks}/${totalTasks}`}
          />
          <Tag color='processing' className='text-base me-0 text-center'>
            In-progress tasks
          </Tag>
        </Flex>

        <Flex gap='small' vertical>
          <Progress
            type='circle'
            percent={roundDecimalPercent(completedTasks, totalTasks)}
            format={() => `${completedTasks}/${totalTasks}`}
          />
          <Tag color='success' className='text-base me-0 text-center'>
            Completed tasks
          </Tag>
        </Flex>

        <Flex gap='small' vertical>
          <Progress
            type='circle'
            percent={roundDecimalPercent(expiredTasks, totalTasks)}
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
