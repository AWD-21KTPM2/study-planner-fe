import { zodResolver } from '@hookform/resolvers/zod'
import type { SelectProps } from 'antd'
import { Form, Input, InputNumber, message, Modal, Select, Tag } from 'antd'
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
import { useCreateTask } from '@/hooks/useTasks'
import { Task } from '@/types/task.type'

type LabelRender = SelectProps['labelRender']

interface NewTaskModalProps {
  isOpen: boolean
  onClose: () => void
}

// Move this to types/task.type.ts if reused elsewhere
export type NewTaskFormData = Pick<Task, 'name' | 'description' | 'priority' | 'estimatedTime' | 'status'>

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
  status: zod.nativeEnum(TaskStatus, { required_error: 'Status is required' })
})

const NewTaskModal = ({ isOpen, onClose }: NewTaskModalProps): JSX.Element => {
  const { mutate: createTask, isPending, isSuccess, error } = useCreateTask()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<NewTaskFormData>({
    resolver: zodResolver(newTaskSchema),
    defaultValues: {
      name: '',
      description: '',
      priority: TaskPriority.LOW,
      estimatedTime: 10,
      status: TaskStatus.TODO
    }
  })

  const onSubmit: SubmitHandler<NewTaskFormData> = async (data) => {
    createTask(data)
  }

  const handleCancel = (): void => {
    reset()
    onClose()
  }

  useEffect(() => {
    if (isSuccess) {
      message.success('Task created successfully')
      reset()
      onClose()
    }
  }, [isSuccess, reset, onClose])

  useEffect(() => {
    if (error) {
      message.error(error instanceof Error ? error.message : 'Failed to create task')
    }
  }, [error])

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

export default NewTaskModal
