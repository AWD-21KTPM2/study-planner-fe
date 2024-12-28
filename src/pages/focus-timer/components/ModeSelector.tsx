import { Button } from 'antd'
import React from 'react'

import { TimerMode } from '../types'

interface ModeSelectorProps {
  modes: TimerMode[]
  selectedMode: string
  onModeSelect: (modeId: string) => void
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ modes, selectedMode, onModeSelect }) => (
  <div className='flex gap-4 mt-4'>
    {modes.map((mode) => (
      <Button
        key={mode.id}
        className={`px-6 py-3 rounded-lg text-sm transition-all duration-300 shadow-sm hover:!border-emerald-600 focus:!border-emerald-600 active:border-emerald-600 hover:!text-emerald-600 focus:!text-emerald-600 active:!text-emerald-600 focus:!outline-emerald-600
          ${
            selectedMode === mode.id
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
        onClick={() => onModeSelect(mode.id)}
      >
        {mode.label}
      </Button>
    ))}
  </div>
)

export default ModeSelector
