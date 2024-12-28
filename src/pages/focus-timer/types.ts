export interface TimerMode {
  id: string
  label: string
  duration: number // in minutes
}

export const DEFAULT_MODES: TimerMode[] = [
  { id: 'study', label: 'Study Time', duration: 25 },
  { id: 'short-break', label: 'Short Break', duration: 5 },
  { id: 'long-break', label: 'Long Break', duration: 15 }
]
