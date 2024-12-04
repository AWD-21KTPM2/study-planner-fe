import { Card, Typography } from 'antd'
import React from 'react'

const { Title, Paragraph } = Typography

interface ActionCardProps {
  className?: string
  title: string
  description: string
  icon?: React.ReactNode
  action: () => void
}

const ActionCard = ({ className, title, description, icon, action }: ActionCardProps): React.ReactNode => {
  return (
    <Card hoverable onClick={action} className={className}>
      <div className='flex justify-start items-center gap-4'>
        {icon}
        <div className='flex flex-col justify-start items-start gap-1'>
          <Title level={5} className='!m-0'>
            {title}
          </Title>
          <Paragraph className='!m-0'>{description}</Paragraph>
        </div>
      </div>
    </Card>
  )
}

export default ActionCard
