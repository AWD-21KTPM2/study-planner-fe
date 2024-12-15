import { zodResolver } from '@hookform/resolvers/zod'
import type { SelectProps } from 'antd'
import { Form, Input, InputNumber, message, Modal, Select, Tag } from 'antd'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FormItem } from 'react-hook-form-antd'
import * as zod from 'zod'

import {
  TaskPriority,
  taskPriorityColorMap,
  TaskPriorityOptions,
  TaskStatus,
  taskStatusColorMap,
  TaskStatusOptions
} from '@/constants/task.const'
import { createTask } from '@/utils/apis/task-apis.util'

type LabelRender = SelectProps['labelRender']

interface NewTaskModalProps {
  isOpen: boolean
  onClose: () => void
}

interface NewTaskFormData {
  name: string
  description: string
  priority: string
  estimatedTime: number
  status: string
}

const taskPriorityLabelRender: LabelRender = (props) => (
  <Tag color={taskPriorityColorMap[props.value as TaskPriority]}>{props.value}</Tag>
)

const taskStatusLabelRender: LabelRender = (props) => (
  <Tag color={taskStatusColorMap[props.value as TaskStatus]}>{props.value}</Tag>
)

const newTaskSchema = zod.object({
  name: zod.string().min(1, { message: 'Title is required' }),
  description: zod.string().optional(),
  priority: zod.string().min(1, { message: 'Priority is required' }),
  estimatedTime: zod.number().min(1, { message: 'Estimated time is required' }),
  status: zod.string().min(1, { message: 'Status is required' })
})

const NewTaskModal = ({ isOpen, onClose }: NewTaskModalProps): JSX.Element => {
  const { reset, control, handleSubmit } = useForm<NewTaskFormData>({
    resolver: zodResolver(newTaskSchema),
    defaultValues: {
      name: '',
      description: '',
      priority: TaskPriority.LOW,
      estimatedTime: 10,
      status: TaskStatus.TODO
    }
  })

  const onSubmit: SubmitHandler<NewTaskFormData> = (data) => {
    console.log('Creating task with data:', data)
    // if (!userInformation?.id) {
    //   message.error('User not found')
    //   return
    // }
    createTask(data)
      .then(() => {
        message.success('Task created successfully')
      })
      .catch((error) => {
        console.error(error)
        message.error('Failed to create task')
      })
  }

  const handleCancel = (): void => {
    reset()
    onClose()
  }

  return (
    <Modal open={isOpen} onCancel={handleCancel} title='New Task' onOk={handleSubmit(onSubmit)}>
      <Form layout='vertical'>
        <FormItem control={control} label='Title' name='name'>
          <Input placeholder='eg. Laundry' />
        </FormItem>
        <FormItem control={control} label='Description' name='description'>
          <Input.TextArea rows={4} placeholder='eg. Do the laundry' />
        </FormItem>
        <FormItem control={control} label='Priority' name='priority'>
          <Select options={TaskPriorityOptions} labelRender={taskPriorityLabelRender} />
        </FormItem>
        <FormItem control={control} label='Estimated Time' name='estimatedTime'>
          <InputNumber addonAfter='minutes' />
        </FormItem>
        <FormItem control={control} label='Status' name='status'>
          <Select options={TaskStatusOptions} labelRender={taskStatusLabelRender} />
        </FormItem>
      </Form>
    </Modal>
  )
}

export default NewTaskModal
