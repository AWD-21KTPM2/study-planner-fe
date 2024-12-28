/**
 * Timer type
 * @typedef {Object} Timer
 * @property {string} _id - Timer ID
 * @property {string} taskId - Task ID
 * @property {Date} sessionStart - Timer session start time
 * @property {Date} sessionEnd - Timer session end time
 * @property {boolean} flag - Timer flag, true if timer for study session, false if timer for break session
 * @property {string} userId - User ID
 * @property {Date} createdAt - Timer created date
 * @property {Date} updatedAt - Timer updated date
 * @example
 * {
 *  _id: '60f7b1b3b3f3b40015f1b1b3',
 * taskId: '60f7b1b3b3f3b40015f1b1b3',
 * sessionStart: '2021-07-21T07:00:00.000Z',
 * flag: true,
 * userId: '60f7b1b3b3f3b40015f1b1b3',
 * createdAt: '2021-07-21T07:00:00.000Z',
 * updatedAt: '2021-07-21T07:00:00.000Z'
 * }
 */
export type Timer = {
  _id?: string
  taskId: string
  sessionStart: Date
  sessionEnd?: Date
  flag: boolean
  userId: string
  createdAt?: Date
  updatedAt?: Date
}
