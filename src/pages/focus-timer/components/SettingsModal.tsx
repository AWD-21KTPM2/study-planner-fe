import { Button, Form, InputNumber, Modal, Select, Space } from 'antd'
import React, { useEffect } from 'react'

import { useTasks, useUpdateTask } from '@/hooks/useTasks'
import { Task } from '@/types/task.type'

import { TimerMode } from '../types'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  selectedTask?: Task
  modes: TimerMode[]
  onModesChange: (modes: TimerMode[]) => void
  onTaskChange?: (taskId: string) => void
}

interface TimerSettings {
  studyTime: number
  shortBreak: number
  longBreak: number
  selectedTaskId?: string
  taskStatus?: string
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  selectedTask,
  modes,
  onModesChange,
  onTaskChange
}) => {
  const [form] = Form.useForm<TimerSettings>()
  const { data: tasks } = useTasks()
  const updateTask = useUpdateTask()

  useEffect(() => {
    // Set initial form values
    const studyMode = modes.find((mode) => mode.id === 'study')
    const shortBreakMode = modes.find((mode) => mode.id === 'short-break')
    const longBreakMode = modes.find((mode) => mode.id === 'long-break')

    form.setFieldsValue({
      studyTime: studyMode?.duration ?? 25,
      shortBreak: shortBreakMode?.duration ?? 5,
      longBreak: longBreakMode?.duration ?? 15,
      selectedTaskId: selectedTask?._id,
      taskStatus: selectedTask?.status
    })
  }, [modes, selectedTask, form])

  const handleSubmit = (values: TimerSettings): void => {
    // Update timer modes
    const updatedModes: TimerMode[] = [
      { id: 'study', label: 'Study Time', duration: values.studyTime },
      { id: 'short-break', label: 'Short Break', duration: values.shortBreak },
      { id: 'long-break', label: 'Long Break', duration: values.longBreak }
    ]
    onModesChange(updatedModes)

    // Update selected task if changed
    if (values.selectedTaskId && onTaskChange) {
      onTaskChange(values.selectedTaskId)

      // Update task status if changed
      if (selectedTask && values.taskStatus) {
        updateTask.mutate({
          id: values.selectedTaskId,
          task: { status: values.taskStatus }
        })
      }
    }

    onClose()
  }

  return (
    <Modal title='Timer Settings' open={isOpen} onCancel={onClose} footer={null} width={500}>
      <Form form={form} layout='vertical' onFinish={handleSubmit} className='mt-4'>
        <div className='space-y-6'>
          {/* Timer Settings */}
          <div className='space-y-4 bg-gray-50 p-4 rounded-lg'>
            <h3 className='font-medium text-gray-700'>Timer Durations</h3>
            <Space className='w-full' size='large'>
              <Form.Item
                name='studyTime'
                label='Study Time'
                rules={[{ required: true, message: 'Please set study time' }]}
              >
                <InputNumber min={1} max={120} addonAfter='min' className='w-32' />
              </Form.Item>
              <Form.Item
                name='shortBreak'
                label='Short Break'
                rules={[{ required: true, message: 'Please set short break time' }]}
              >
                <InputNumber min={1} max={30} addonAfter='min' className='w-32' />
              </Form.Item>
              <Form.Item
                name='longBreak'
                label='Long Break'
                rules={[{ required: true, message: 'Please set long break time' }]}
              >
                <InputNumber min={5} max={60} addonAfter='min' className='w-32' />
              </Form.Item>
            </Space>
          </div>

          {/* Task Selection */}
          {tasks && tasks.length > 0 && (
            <div className='space-y-4 bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-medium text-gray-700'>Task Management</h3>
              <Space className='w-full' direction='vertical'>
                <Form.Item name='selectedTaskId' label='Current Task'>
                  <Select
                    placeholder='Select a task'
                    allowClear
                    className='w-full'
                    options={tasks.map((task) => ({
                      value: task._id,
                      label: task.name
                    }))}
                  />
                </Form.Item>
              </Space>
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex justify-end gap-2'>
            <Button onClick={onClose}>Cancel</Button>
            <Button type='primary' htmlType='submit' className='bg-emerald-500'>
              Save Changes
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  )
}

export default SettingsModal
