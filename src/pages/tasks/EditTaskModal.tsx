import { zodResolver } from '@hookform/resolvers/zod'
import type { SelectProps } from 'antd'
import { DatePicker, Form, Input, InputNumber, message, Modal, Select, Tag } from 'antd'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as zod from 'zod'

import {
  TaskPriority,
  taskPriorityColorMap,
  TaskPriorityOptions,
  TaskStatus,
  taskStatusColorMap,
  TaskStatusOptions
} from '@/constants/task.const'
import { useTask, useUpdateTask } from '@/hooks/useTasks'
import { Task } from '@/types/task.type'
dayjs.extend(utc)

type LabelRender = SelectProps['labelRender']

interface EditTaskModalProps {
  isOpen: boolean
  onClose: () => void
  taskId: string
}

// Move this to types/task.type.ts if reused elsewhere
export type EditTaskFormData = Pick<
  Task,
  'name' | 'description' | 'priority' | 'estimatedTime' | 'status' | 'startDate' | 'endDate'
>

const taskPriorityLabelRender: LabelRender = (props) => (
  <Tag color={taskPriorityColorMap[props.value as TaskPriority]}>{props.value}</Tag>
)

const taskStatusLabelRender: LabelRender = (props) => (
  <Tag color={taskStatusColorMap[props.value as TaskStatus]}>{props.value}</Tag>
)

const newTaskSchema = zod.object({
  name: zod.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: zod.string().max(500, 'Description is too long').optional(),
  priority: zod.nativeEnum(TaskPriority, { required_error: 'Priority is required' }),
  estimatedTime: zod
    .number()
    .min(1, 'Estimated time must be at least 1 minute')
    .max(480, 'Estimated time cannot exceed 8 hours'),
  startDate: zod.date().optional(),
  endDate: zod.date().optional(),
  status: zod.nativeEnum(TaskStatus, { required_error: 'Status is required' })
})

const EditTaskModal = ({ isOpen, onClose, taskId }: EditTaskModalProps): JSX.Element => {
  const { mutate: updateTask, isPending, reset: resetUpdateTask, isSuccess } = useUpdateTask()
  const { data: task } = useTask(taskId)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<EditTaskFormData>({
    resolver: zodResolver(newTaskSchema),
    defaultValues: {
      name: task?.name,
      description: task?.description,
      priority: task?.priority,
      estimatedTime: task?.estimatedTime,
      status: task?.status,
      startDate: task?.startDate,
      endDate: task?.endDate
    }
  })

  useEffect(() => {
    if (task) {
      reset(task)
    }
  }, [task])

  const onSubmit: SubmitHandler<EditTaskFormData> = async (data) => {
    if (!taskId) {
      message.error('Task ID is required')
      return
    }
    updateTask({ id: taskId, task: data })
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

  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      title='New Task'
      onOk={handleSubmit(onSubmit)}
      confirmLoading={isPending}
      destroyOnClose
    >
      <Form layout='vertical' className='space-y-4'>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <Form.Item label='Title' validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
              <Input {...field} placeholder='eg. Laundry' />
            </Form.Item>
          )}
        />

        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <Form.Item
              label='Description'
              validateStatus={errors.description ? 'error' : ''}
              help={errors.description?.message}
            >
              <Input.TextArea {...field} rows={4} placeholder='eg. Do the laundry' />
            </Form.Item>
          )}
        />

        <Controller
          name='priority'
          control={control}
          render={({ field }) => (
            <Form.Item label='Priority' validateStatus={errors.priority ? 'error' : ''} help={errors.priority?.message}>
              <Select {...field} options={TaskPriorityOptions} labelRender={taskPriorityLabelRender} />
            </Form.Item>
          )}
        />

        <div className='flex justify-between gap-4'>
          <Controller
            name='startDate'
            control={control}
            render={({ field }) => (
              <Form.Item
                label='Start Date'
                validateStatus={errors.startDate ? 'error' : ''}
                help={errors.startDate?.message}
                className='flex-1'
              >
                <DatePicker
                  format='DD/MM/YYYY HH:mm'
                  {...field}
                  value={field.value ? dayjs(field.value) : undefined}
                  onChange={(value) => {
                    field.onChange(value?.toDate())
                  }}
                  showTime={{ format: 'HH:mm' }}
                  className='w-full'
                />
              </Form.Item>
            )}
          />

          <Controller
            name='endDate'
            control={control}
            render={({ field }) => (
              <Form.Item
                label='End Date'
                validateStatus={errors.endDate ? 'error' : ''}
                help={errors.endDate?.message}
                className='flex-1'
              >
                <DatePicker
                  format='DD/MM/YYYY HH:mm'
                  {...field}
                  value={field.value ? dayjs(field.value) : undefined}
                  onChange={(value) => {
                    field.onChange(value?.toDate())
                  }}
                  showTime={{ format: 'HH:mm' }}
                  className='w-full'
                />
              </Form.Item>
            )}
          />
        </div>

        <Controller
          name='estimatedTime'
          control={control}
          render={({ field }) => (
            <Form.Item
              label='Estimated Time'
              validateStatus={errors.estimatedTime ? 'error' : ''}
              help={errors.estimatedTime?.message}
            >
              <InputNumber {...field} addonAfter='minutes' min={1} max={480} />
            </Form.Item>
          )}
        />

        <Controller
          name='status'
          control={control}
          render={({ field }) => (
            <Form.Item label='Status' validateStatus={errors.status ? 'error' : ''} help={errors.status?.message}>
              <Select {...field} options={TaskStatusOptions} labelRender={taskStatusLabelRender} />
            </Form.Item>
          )}
        />
      </Form>
    </Modal>
  )
}

export default EditTaskModal
