import { InfoCircleOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import type { SelectProps } from 'antd'
import { Button, DatePicker, Form, Input, InputNumber, message, Modal, Select, Tag, Tooltip } from 'antd'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useCallback, useEffect, useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FormItem } from 'react-hook-form-antd'
import { useNavigate } from 'react-router-dom'
import * as zod from 'zod'

import { ROUTE } from '@/constants/route.const'
import {
  TaskPriority,
  taskPriorityColorMap,
  TaskPriorityOptions,
  TaskStatus,
  taskStatusColorMap,
  TaskStatusOptions
} from '@/constants/task.const'
import { useTask, useUpdateTask } from '@/hooks/useTasks'
dayjs.extend(utc)

type LabelRender = SelectProps['labelRender']
type LabelInValueType = Parameters<NonNullable<LabelRender>>[0]

interface EditTaskModalProps {
  isOpen: boolean
  onClose: () => void
  taskId: string
}

export type EditTaskFormData = {
  name: string
  description: string
  priority: TaskPriority
  estimatedTime: number
  status: TaskStatus
  startDate: Date | null
  endDate: Date | null
}

// Moved schema outside component to prevent recreation
const newTaskSchema = zod
  .object({
    name: zod.string().min(1, 'Title is required').max(100, 'Title is too long'),
    description: zod.string().max(500, 'Description is too long').optional(),
    priority: zod.nativeEnum(TaskPriority, { required_error: 'Priority is required' }),
    estimatedTime: zod
      .number()
      .min(1, 'Estimated time must be at least 1 minute')
      .max(480, 'Estimated time cannot exceed 8 hours'),
    startDate: zod.date().nullable(),
    endDate: zod.date().nullable(),
    status: zod.nativeEnum(TaskStatus, { required_error: 'Status is required' })
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate > data.startDate
      }
      return true
    },
    {
      message: 'End date must be after start date',
      path: ['endDate']
    }
  )

const priorityTooltips = {
  [TaskPriority.CRITICAL]: 'Urgent tasks that need immediate attention',
  [TaskPriority.HIGH]: 'Important tasks to be completed soon',
  [TaskPriority.MEDIUM]: 'Regular priority tasks',
  [TaskPriority.LOW]: 'Tasks that can be done when time permits'
}

const statusTooltips = {
  [TaskStatus.TODO]: 'Tasks yet to be started',
  [TaskStatus.IN_PROGRESS]: 'Tasks currently being worked on',
  [TaskStatus.COMPLETED]: 'Tasks that have been finished',
  [TaskStatus.EXPIRED]: 'Tasks that have passed their deadline'
}

const EditTaskModal = ({ isOpen, onClose, taskId }: EditTaskModalProps): JSX.Element => {
  const { mutate: updateTask, isPending, reset: resetUpdateTask, isSuccess } = useUpdateTask()
  const { data: task } = useTask(taskId)
  const navigate = useNavigate()

  // Memoized label renderers
  const taskPriorityLabelRender = useCallback<(props: LabelInValueType) => JSX.Element>(
    (props) => (
      <Tooltip title={priorityTooltips[props.value as TaskPriority]}>
        <Tag color={taskPriorityColorMap[props.value as TaskPriority]}>{props.value}</Tag>
      </Tooltip>
    ),
    []
  )

  const taskStatusLabelRender = useCallback<(props: LabelInValueType) => JSX.Element>(
    (props) => (
      <Tooltip title={statusTooltips[props.value as TaskStatus]}>
        <Tag color={taskStatusColorMap[props.value as TaskStatus]}>{props.value}</Tag>
      </Tooltip>
    ),
    []
  )

  // Memoized default values
  const defaultValues = useMemo<EditTaskFormData>(
    () => ({
      name: task?.name ?? '',
      description: task?.description ?? '',
      priority: (task?.priority as TaskPriority) ?? TaskPriority.MEDIUM,
      estimatedTime: task?.estimatedTime ?? 30,
      status: (task?.status as TaskStatus) ?? TaskStatus.TODO,
      startDate: task?.startDate ? new Date(task.startDate) : null,
      endDate: task?.endDate ? new Date(task.endDate) : null
    }),
    [task]
  )

  const { control, handleSubmit, reset } = useForm<EditTaskFormData>({
    resolver: zodResolver(newTaskSchema),
    defaultValues
  })

  useEffect(() => {
    if (task) {
      reset({
        name: task.name,
        description: task.description,
        priority: task.priority as TaskPriority,
        estimatedTime: task.estimatedTime,
        status: task.status as TaskStatus,
        startDate: task.startDate ? new Date(task.startDate) : null,
        endDate: task.endDate ? new Date(task.endDate) : null
      })
    }
  }, [task])

  const onSubmit: SubmitHandler<EditTaskFormData> = async (data) => {
    if (!taskId) {
      message.error('Task ID is required')
      return
    }
    // Convert null dates to undefined for the API
    const formattedData = {
      name: data.name,
      description: data.description,
      priority: data.priority,
      estimatedTime: data.estimatedTime,
      status: data.status,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined
    }
    updateTask({ id: taskId, task: formattedData })
  }

  const handleCancel = (): void => {
    reset()
    resetUpdateTask()
    onClose()
  }

  useEffect(() => {
    if (isSuccess) {
      reset()
      resetUpdateTask()
      onClose()
    }
  }, [isSuccess])

  function handleStartTimer(): void {
    // store the task id in local storage
    localStorage.setItem('taskId', taskId)
    navigate(ROUTE.FOCUS_TIMER)
  }

  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      title='Edit Task'
      onOk={handleSubmit(onSubmit)}
      confirmLoading={isPending}
      destroyOnClose
      width={600}
    >
      <Form layout='vertical' className='space-y-6'>
        <div className='space-y-4'>
          <FormItem control={control} name='name' label='Title' required>
            <Input placeholder='eg. Complete project documentation' />
          </FormItem>

          <FormItem control={control} name='description' label='Description'>
            <Input.TextArea rows={4} placeholder='Describe the task in detail...' />
          </FormItem>
        </div>

        <div className='space-y-4'>
          <FormItem
            control={control}
            name='priority'
            label={
              <span>
                Priority
                <Tooltip title='Set the importance level of the task'>
                  <InfoCircleOutlined className='ml-1' />
                </Tooltip>
              </span>
            }
            required
          >
            <Select
              options={TaskPriorityOptions}
              labelRender={taskPriorityLabelRender}
              placeholder='Select priority level'
            />
          </FormItem>

          <div className='flex justify-between gap-4'>
            <FormItem
              control={control}
              name='startDate'
              label='Start Date'
              className='flex-1'
              getValueProps={(value) => ({
                value: value ? dayjs(value) : undefined
              })}
              normalize={(value) => value?.toDate()}
            >
              <DatePicker
                format='DD/MM/YYYY HH:mm'
                showTime={{ format: 'HH:mm' }}
                className='w-full'
                placeholder='Select start date'
              />
            </FormItem>

            <FormItem
              control={control}
              name='endDate'
              label='End Date'
              className='flex-1'
              getValueProps={(value) => ({
                value: value ? dayjs(value) : undefined
              })}
              normalize={(value) => value?.toDate()}
            >
              <DatePicker
                format='DD/MM/YYYY HH:mm'
                showTime={{ format: 'HH:mm' }}
                className='w-full'
                placeholder='Select end date'
              />
            </FormItem>
          </div>
        </div>

        <div className='space-y-4'>
          <FormItem
            control={control}
            name='estimatedTime'
            label={
              <span>
                Estimated Time
                <Tooltip title='Estimated time to complete the task in minutes'>
                  <InfoCircleOutlined className='ml-1' />
                </Tooltip>
              </span>
            }
            required
          >
            <InputNumber addonAfter='minutes' min={1} max={480} placeholder='Enter estimated time' />
          </FormItem>

          <FormItem
            control={control}
            name='status'
            label={
              <span>
                Status
                <Tooltip title='Current state of the task'>
                  <InfoCircleOutlined className='ml-1' />
                </Tooltip>
              </span>
            }
            required
          >
            <Select options={TaskStatusOptions} labelRender={taskStatusLabelRender} placeholder='Select task status' />
          </FormItem>

          {/* Start Timer */}
          <Button type='primary' onClick={handleStartTimer}>
            Start Timer
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default EditTaskModal
