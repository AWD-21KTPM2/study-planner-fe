import '@/pages/home/home.scss'

import { BarChartOutlined, CheckSquareOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row } from 'antd'
import React, { useState } from 'react'

import DragnDropCalendar from '@/components/calendar/DragnDropCalendar'

import ActionCard from './ActionCard'
import NewTaskModal from './NewTaskModal'
import TaskList from './TaskList'

const Home = (): React.ReactNode => {
  const _onClickHandler = (_day: number, _month: number, _year: number): void => {
    // const snackMessage = `Clicked on ${MONTH_NAMES[month]} ${day}, ${year}`
    // createSnack(snackMessage, 'success')
  }

  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div className='mx-auto --home-section'>
      {/* Quick Actions */}
      <Row gutter={[16, 16]} className='mb-6'>
        <Col xs={24} md={8}>
          <ActionCard
            title='Start Focus Timer'
            description='Begin a focused session'
            className='bg-blue-50 hover:bg-blue-200 shadow-md'
            icon={<ClockCircleOutlined className='text-2xl text-blue-600' />}
            action={() => {}}
          />
        </Col>
        <Col xs={24} md={8}>
          <ActionCard
            title='Add New Task'
            description='Create a study task'
            className='bg-green-50 hover:bg-green-200 shadow-md'
            icon={<CheckSquareOutlined className='text-2xl text-green-600' />}
            action={() => {
              setIsOpen(true)
            }}
          />
        </Col>
        <Col xs={24} md={8}>
          <ActionCard
            title='View Progress'
            description='Check your study progress'
            className='bg-purple-50 hover:bg-purple-200 shadow-md'
            icon={<BarChartOutlined className='text-2xl text-purple-600' />}
            action={() => {}}
          />
        </Col>
      </Row>

      {/* Calendar and Tasks */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={18}>
          <Card title='Schedule' extra={<Button type='link'>Analyze Schedule </Button>}>
            <div className='flex justify-center items-center bg-gray-100 rounded min-w-full h-96 --calendar-section'>
              <DragnDropCalendar />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={6}>
          <Card title='Tasks' extra={<Button type='link'>View All</Button>}>
            <TaskList />
          </Card>
        </Col>
      </Row>

      <NewTaskModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  )
}

export default Home
