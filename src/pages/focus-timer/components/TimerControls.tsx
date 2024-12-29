import { PauseCircleOutlined, PlayCircleOutlined, StepForwardFilled, UndoOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'

interface TimerControlsProps {
  isRunning: boolean
  onStart: () => void
  onReset: () => void
  onSkip: () => void
  enable: boolean
  loading?: boolean
}

const TimerControls: React.FC<TimerControlsProps> = ({ isRunning, onStart, onReset, onSkip, enable, loading }) => {
  return (
    <div className='flex gap-4'>
      <Button onClick={onReset} disabled={!enable || loading} icon={<UndoOutlined />}>
        Reset
      </Button>
      <Button
        type='primary'
        onClick={onStart}
        disabled={!enable || loading}
        loading={loading}
        className='bg-emerald-600 hover:!bg-emerald-700'
        icon={isRunning ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
      >
        {isRunning ? 'Pause' : 'Start'}
      </Button>
      <Button onClick={onSkip} disabled={!enable || loading} icon={<StepForwardFilled />}>
        Skip
      </Button>
    </div>
  )
}

export default TimerControls
