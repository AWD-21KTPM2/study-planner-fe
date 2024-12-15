export type Task = {
  _id?: string
  name: string
  description: string
  priority: string
  estimatedTime: number
  startDate?: Date
  endDate?: Date
  status: string
}
