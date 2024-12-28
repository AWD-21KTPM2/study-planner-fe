import { SettingOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React, { useEffect, useState } from 'react'

import { TaskStatus } from '@/constants/task.const'
import { useTask } from '@/hooks/useTasks'

import ModeSelector from './components/ModeSelector'
import SettingsModal from './components/SettingsModal'
import TaskHeader from './components/TaskHeader'
import TimerControls from './components/TimerControls'
import TimerDisplay from './components/TimerDisplay'
import { DEFAULT_MODES, TimerMode } from './types'

const FocusTimer: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<string>('study')
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_MODES[0].duration * 60)
  const [modes, setModes] = useState<TimerMode[]>(DEFAULT_MODES)
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)

  // get selected task from local storage
  const selectedTaskId = localStorage.getItem('taskId')
  const { data: selectedTask } = useTask(selectedTaskId as string)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    }

    return (): void => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isRunning, timeLeft])

  const handleStart = (): void => {
    setIsRunning(!isRunning)
  }

  const handleReset = (): void => {
    const currentMode = modes.find((mode) => mode.id === selectedMode)
    setIsRunning(false)
    setTimeLeft(currentMode ? currentMode.duration * 60 : 0)
  }

  const handleSkip = (): void => {
    handleReset()
  }

  const handleModeSelect = (modeId: string): void => {
    setSelectedMode(modeId)
    const selectedModeData = modes.find((mode) => mode.id === modeId)
    setIsRunning(false)
    setTimeLeft(selectedModeData ? selectedModeData.duration * 60 : 0)
  }

  const handleModesChange = (newModes: TimerMode[]): void => {
    setModes(newModes)
    // Update current timer if the selected mode duration changed
    const currentMode = newModes.find((mode) => mode.id === selectedMode)
    if (currentMode) {
      setTimeLeft(currentMode.duration * 60)
    }
  }

  const handleTaskChange = (taskId: string): void => {
    localStorage.setItem('taskId', taskId)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className='relative flex flex-col flex-1 justify-center items-center gap-8 bg-white p-8 min-h-full'>
      {/* Settings Button */}
      <Button
        icon={<SettingOutlined />}
        onClick={() => setIsSettingsOpen(true)}
        className='top-4 right-4 absolute hover:!border-emerald-600 focus:!border-emerald-600'
      />

      <TaskHeader task={selectedTask} />
      <TimerDisplay minutes={minutes} seconds={seconds} />
      <TimerControls
        isRunning={isRunning}
        onStart={handleStart}
        onReset={handleReset}
        onSkip={handleSkip}
        enable={selectedTask?.status !== TaskStatus.COMPLETED}
      />
      <ModeSelector modes={modes} selectedMode={selectedMode} onModeSelect={handleModeSelect} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedTask={selectedTask}
        modes={modes}
        onModesChange={handleModesChange}
        onTaskChange={handleTaskChange}
      />
    </div>
  )
}

export default FocusTimer
