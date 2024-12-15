import '@/pages/home/home.scss'

import { BarChartOutlined, CheckSquareOutlined, ClockCircleOutlined, RobotOutlined } from '@ant-design/icons'
import { Button, Card, Col, Empty, Row, Spin, Typography } from 'antd'
import React, { useRef, useState } from 'react'

import DragnDropCalendar from '@/components/calendar/DragnDropCalendar'
import CommonModal from '@/components/modal/CommonModal'
import { useAuth } from '@/hooks/useAuth'
import { useTasks } from '@/hooks/useTasks'
import { AnalyzeTaskDTO } from '@/types/ai-generate.type'
import { IModalMethods } from '@/types/modal.type'
import { analyzeTaskByAI } from '@/utils/apis/ai-generate-apis.util'

import TaskAnalysisTable, { DataProps } from '../ai-generate/TaskAnalysisTable'
import ActionCard from './ActionCard'
import NewTaskModal from './NewTaskModal'
import TaskList from './TaskList'

const Home = (): React.ReactNode => {
  const { authSession } = useAuth()
  const [taskAnalysis, setTaskAnalysis] = useState<DataProps[]>()
  const refAnalyzeModal = useRef<IModalMethods | null>(null)
  const [isLoadingAnalyzes, setIsLoadingAnalyzes] = useState<boolean>(false)

  const _onClickHandler = (_day: number, _month: number, _year: number): void => {
    // const snackMessage = `Clicked on ${MONTH_NAMES[month]} ${day}, ${year}`
    // createSnack(snackMessage, 'success')
  }
  const [isNewTaskOpen, setIsNewTaskOpen] = useState<boolean>(false)

  const { isLoading, data: tasks, error } = useTasks()

  const analyzeTaskHandler = async (): Promise<void> => {
    setIsLoadingAnalyzes(true)
    setTaskAnalysis([])
    refAnalyzeModal?.current?.showModal()

    const AIResponse: AnalyzeTaskDTO[] = await analyzeTaskByAI(authSession)
    const pipeAIResponse: DataProps[] = AIResponse.map(({ no: key, ...rest }) => ({ key, ...rest }) as DataProps)
    setTaskAnalysis(pipeAIResponse as DataProps[])
    setIsLoadingAnalyzes(false)
  }

  const analyzeTaskCancel = (): void => {
    setTaskAnalysis([])
  }

  return (
    <div className='mx-auto --home-section'>
      {isLoading && <Spin fullscreen />}

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
            action={() => {
              setIsNewTaskOpen(true)
            }}
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
            <div className='flex justify-center items-center bg-gray-100 rounded min-w-full h-96 --calendar-section'>
              <DragnDropCalendar />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={6}>
          <Card
            title='Tasks'
            loading={isLoading}
            extra={
              <Button type='link' href='/tasks'>
                View All
              </Button>
            }
          >
            {error || !tasks ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<Typography.Text>Task not found</Typography.Text>}
              />
            ) : (
              <div className='h-[43rem] overflow-y-auto'>
                <TaskList task_list={tasks} limit={tasks.length} />
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <CommonModal title='AI Analysis' width={1000} ref={refAnalyzeModal} handleCancel={analyzeTaskCancel}>
        {isLoadingAnalyzes ? (
          <div className='w-full flex justify-center'>
            <Spin tip='Loading' size='large' />
          </div>
        ) : (
          <TaskAnalysisTable dataSource={taskAnalysis} />
        )}
      </CommonModal>
      <NewTaskModal isOpen={isNewTaskOpen} onClose={() => setIsNewTaskOpen(false)} />
    </div>
  )
}

export default Home
