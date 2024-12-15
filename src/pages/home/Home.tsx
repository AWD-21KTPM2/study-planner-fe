import '@/pages/home/home.scss'

import { BarChartOutlined, CheckSquareOutlined, ClockCircleOutlined, RobotOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Tag } from 'antd'
import React, { useRef, useState } from 'react'

import CommonModal from '@/components/modal/CommonModal'
import useAuth from '@/hooks/useAuth'
import { IModalMethods } from '@/types/modal.type'
import { analyzeTaskByAI } from '@/utils/apis/ai-generate-apis.util'

import { ContinuousCalendar } from '../../components/calendar/ContinuousCalendar'
import ActionCard from './ActionCard'

const Home = (): React.ReactNode => {
  const { authSession } = useAuth()
  const [htmlAnalysis, setHtmlAnalysis] = useState<string>()
  const refAnalyzeModal = useRef<IModalMethods | null>(null)

  const _onClickHandler = (_day: number, _month: number, _year: number): void => {
    // const snackMessage = `Clicked on ${MONTH_NAMES[month]} ${day}, ${year}`
    // createSnack(snackMessage, 'success')
  }

  const analyzeTaskHandler = async (): Promise<void> => {
    refAnalyzeModal?.current?.showModal()

    const AIResponse = await analyzeTaskByAI(authSession)
    console.log('AIResponse', AIResponse)
    setHtmlAnalysis(AIResponse)
  }

  return (
    <div className='mx-auto --home-section'>
      {/* Quick Actions */}
      <Row gutter={[16, 16]} className='mb-6'>
        <Col xs={24} md={6}>
          <ActionCard
            title='Start Focus Timer'
            description='Begin a focused session'
            className='bg-blue-50 hover:bg-blue-200 shadow-md'
            icon={<ClockCircleOutlined className='text-2xl text-blue-600' />}
            action={() => {}}
          />
        </Col>
        <Col xs={24} md={6}>
          <ActionCard
            title='Add New Task'
            description='Create a study task'
            className='bg-green-50 hover:bg-green-200 shadow-md'
            icon={<CheckSquareOutlined className='text-2xl text-green-600' />}
            action={() => {}}
          />
        </Col>
        <Col xs={24} md={6}>
          <ActionCard
            title='View Progress'
            description='Check your study progress'
            className='bg-purple-50 hover:bg-purple-200 shadow-md'
            icon={<BarChartOutlined className='text-2xl text-purple-600' />}
            action={() => {}}
          />
        </Col>
        <Col xs={24} md={6}>
          <ActionCard
            title='Analyze Schedule'
            description='Analyze your study schedule with AI'
            className='bg-orange-50 hover:bg-orange-200 shadow-md'
            icon={<RobotOutlined className='text-2xl text-orange-600' />}
            action={analyzeTaskHandler}
          />
        </Col>
      </Row>

      {/* Calendar and Tasks */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={18}>
          <Card title='Schedule' extra={<Button type='link'>Analyze Schedule </Button>}>
            <div className='flex justify-center items-center bg-gray-100 rounded h-96 --calendar-section'>
              {/* <CalendarOutlined className='text-4xl text-gray-400' /> */}
              <ContinuousCalendar onClick={_onClickHandler} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={6}>
          <Card title='Tasks' extra={<Button type='link'>View All</Button>}>
            {[
              { title: 'Study Mathematics', time: '2 hours', priority: 'High' },
              { title: 'Review Notes', time: '1 hour', priority: 'Medium' },
              { title: 'Practice Problems', time: '1.5 hours', priority: 'Low' }
            ].map((task, index) => (
              <Card key={index} size='small' className='mb-3 last:mb-0'>
                <div className='flex justify-between items-center'>
                  <div>
                    <div className='font-medium'>{task.title}</div>
                    <div className='text-gray-500 text-sm'>{task.time} estimated</div>
                  </div>
                  <Tag color={task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'gold' : 'green'}>
                    {task.priority}
                  </Tag>
                </div>
              </Card>
            ))}
          </Card>
        </Col>
      </Row>

      <CommonModal title='AI Analysis' content={htmlAnalysis} ref={refAnalyzeModal}></CommonModal>
    </div>
  )
}

export default Home
