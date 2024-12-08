import React from 'react'

interface CommonButtonProps {
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

const CommonButton: React.FC<CommonButtonProps> = ({
  type = 'button',
  onClick,
  children,
  className = '',
  disabled = false
}) => {
  return (
    <button
      type={type || 'button'}
      onClick={onClick}
      className={`whitespace-nowrap rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-cyan-300 sm:rounded-xl lg:px-5 lg:py-2.5 ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default CommonButton
