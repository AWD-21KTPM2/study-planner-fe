export enum TaskPriority {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export enum TaskStatus {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  EXPIRED = 'Expired'
}

export const TaskPriorityOptions = [
  { value: TaskPriority.LOW, label: 'Low' },
  { value: TaskPriority.MEDIUM, label: 'Medium' },
  { value: TaskPriority.HIGH, label: 'High' },
  { value: TaskPriority.CRITICAL, label: 'Critical' }
]

export const TaskStatusOptions = [
  { value: TaskStatus.TODO, label: 'To Do' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
  { value: TaskStatus.COMPLETED, label: 'Completed' },
  { value: TaskStatus.EXPIRED, label: 'Expired' }
]

export const taskPriorityColorMap = {
  [TaskPriority.LOW]: 'blue',
  [TaskPriority.MEDIUM]: 'orange',
  [TaskPriority.HIGH]: 'red',
  [TaskPriority.CRITICAL]: 'purple'
}

export const taskStatusColorMap = {
  [TaskStatus.TODO]: 'blue',
  [TaskStatus.IN_PROGRESS]: 'orange',
  [TaskStatus.COMPLETED]: 'green',
  [TaskStatus.EXPIRED]: 'red'
}

export const TASK_STYLES = {
  SCHEDULED: {
    backgroundColor: 'bg-gray-50',
    hoverBackground: 'hover:bg-gray-100',
    border: ''
  },
  UNSCHEDULED: {
    backgroundColor: 'bg-gray-50',
    hoverBackground: 'hover:bg-gray-100',
    border: 'border-l-4 border-l-warning',
    opacity: 'opacity-50'
  }
} as const

export const TASK_LIST_DEFAULTS = {
  DEFAULT_LIMIT: 5
} as const
