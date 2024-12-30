import { SettingOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React, { useEffect, useState } from 'react'

import { TaskStatus } from '@/constants/task.const'
import { useTask, useUpdateTask } from '@/hooks/useTasks'

import ModeSelector from './components/ModeSelector'
import SettingsModal from './components/SettingsModal'
import TaskHeader from './components/TaskHeader'
import TimerControls from './components/TimerControls'
import TimerDisplay from './components/TimerDisplay'
import { useTimer } from './hooks/useTimer'
import { DEFAULT_MODES, TimerMode } from './types'

const FocusTimer: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<string>('study')
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_MODES[0].duration * 60)
  const [modes, setModes] = useState<TimerMode[]>(DEFAULT_MODES)
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)

  const { startTimer, stopTimer, isStarting, isStopping } = useTimer()
  const { mutate: updateTask } = useUpdateTask()

  // get selected task from local storage
  const selectedTaskId = localStorage.getItem('taskId')
  const { data: selectedTask } = useTask(selectedTaskId as string)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (isRunning && timeLeft === 0) {
      // When timer completes, switch to the next mode
      const nextMode = selectedMode.toLowerCase() === DEFAULT_MODES[0].id ? DEFAULT_MODES[1].id : DEFAULT_MODES[0].id
      handleModeSelect(modes.find((mode) => mode.id === nextMode)?.id as string)

      // Stop the current timer
      stopTimer(
        { taskId: selectedTaskId as string, flag: getFlag() },
        {
          onSuccess: () => {
            setIsRunning(false)
          }
        }
      )
    }

    return (): void => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isRunning, timeLeft, modes, selectedMode, selectedTaskId, stopTimer])

  const getFlag = (): boolean => modes.find((mode) => mode.id === selectedMode)?.id === 'study'

  const handleStart = async (): Promise<void> => {
    if (isStarting || isStopping) return

    if (!selectedTaskId || !selectedTask || selectedTask.status === TaskStatus.COMPLETED) {
      return
    }
    // get focus status of the window
    const isFocus = document.hasFocus()

    const payload = {
      taskId: selectedTaskId,
      flag: getFlag()
    }

    // only start timer if the window is focused
    if (!isRunning && isFocus) {
      // set status of task to in progress
      if (selectedTask.status === TaskStatus.TODO) {
        updateTask({ id: selectedTaskId, task: { status: TaskStatus.IN_PROGRESS } })
      }

      startTimer(payload, {
        onSuccess: () => setIsRunning(true)
      })
    } else if (isRunning) {
      stopTimer(payload, {
        onSuccess: () => setIsRunning(false)
      })
    }
  }

  const handleReset = (): void => {
    const currentMode = modes.find((mode) => mode.id === selectedMode)
    setIsRunning(false)
    setTimeLeft(currentMode ? currentMode.duration * 60 : 0)
  }

  const handleSkip = async (): Promise<void> => {
    if (isStarting || isStopping) return

    stopTimer(
      { taskId: selectedTaskId as string, flag: getFlag() },
      {
        onSuccess: () => {
          handleReset()
          setIsRunning(false)
        }
      }
    )
  }

  const handleModeSelect = (modeId: string): void => {
    setSelectedMode(modeId)
    const selectedModeData = modes.find((mode) => mode.id === modeId)
    setIsRunning(false)
    setTimeLeft(selectedModeData ? selectedModeData.duration * 60 : 0)
    // Optional: Play a sound or show notification when mode changes
    if (timeLeft === 0) {
      new Audio('/notification-sound.wav').play().catch(() => {
        // Handle audio play error silently
        console.error('Failed to play audio')
      })
    }
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

    // Reset timer
    setIsRunning(false)
    handleReset()
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  useEffect(() => {
    const onBeforeunload = (e: BeforeUnloadEvent): string | undefined => {
      e.preventDefault()
      const confirmationMessage = 'Are you sure you want to leave?'
      e.returnValue = confirmationMessage
      return confirmationMessage
    }

    const onUnload = async (e: Event): Promise<boolean | undefined> => {
      e.preventDefault()
      console.log('unload')
      if (isRunning) {
        console.log('stop timer')
        // wait for the timer to stop before closing the tab
        stopTimer(
          { taskId: selectedTaskId as string, flag: getFlag() },
          {
            onSuccess: () => {
              console.log('timer stopped')
              setIsRunning(false)
            }
          }
        )
      }
      e.returnValue = true
      return true
    }

    // register tab close event
    window.addEventListener('beforeunload', onBeforeunload)
    window.addEventListener('unload', onUnload)
    return (): void => {
      window.removeEventListener('beforeunload', onBeforeunload)
      window.removeEventListener('unload', onUnload)
    }
  }, [isRunning, selectedTaskId, stopTimer])

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
        loading={isStarting || isStopping}
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
