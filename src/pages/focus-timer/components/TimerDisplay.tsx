import React from 'react'

interface TimerDisplayProps {
  minutes: number
  seconds: number
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ minutes, seconds }) => (
  <div className='drop-shadow-[0_0_10px_rgba(78,216,160,0.3)] font-bold font-mono text-8xl text-center text-gray-800'>
    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
  </div>
)

export default TimerDisplay
