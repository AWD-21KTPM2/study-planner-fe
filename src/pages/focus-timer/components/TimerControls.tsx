import { PauseCircleOutlined, PlayCircleOutlined, StepForwardFilled, UndoOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'

interface TimerControlsProps {
  isRunning: boolean
  onStart: () => void
  onReset: () => void
  onSkip: () => void
  enable: boolean
}

const TimerControls: React.FC<TimerControlsProps> = ({ isRunning, onStart, onReset, onSkip, enable }) => (
  <div className='flex items-center gap-6'>
    <Button
      icon={<UndoOutlined />}
      onClick={onReset}
      size='large'
      className='hover:!border-emerald-600 focus:!border-emerald-600 active:border-emerald-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-lg hover:!text-emerald-600 focus:!text-emerald-600 transition-all duration-300 focus:!outline-emerald-600'
      disabled={!enable}
    />
    <Button
      icon={isRunning ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
      onClick={onStart}
      size='large'
      className='hover:!border-emerald-600 bg-emerald-500 focus:!bg-emerald-600 shadow-sm px-8 py-3 rounded-lg font-bold text-lg text-white hover:!text-emerald-600 focus:!text-white transition-all duration-300 hover:scale-105 focus:!outline-emerald-600'
      disabled={!enable}
    >
      {isRunning ? 'PAUSE' : 'START'}
    </Button>
    <Button
      icon={<StepForwardFilled />}
      onClick={onSkip}
      size='large'
      className='hover:!border-emerald-600 focus:!border-emerald-600 active:border-emerald-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-lg hover:!text-emerald-600 focus:!text-emerald-600 transition-all duration-300 focus:!outline-emerald-600'
      disabled={!enable}
    />
  </div>
)

export default TimerControls
