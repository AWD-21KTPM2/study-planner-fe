import '@/pages/home/home.scss'

import { CheckSquareOutlined, LoadingOutlined, RobotOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, Card, Col, Collapse, type CollapseProps, Empty, Row, Spin, Typography } from 'antd'
import { useEffect, useRef, useState } from 'react'

import DragAndDropCalendar from '@/components/calendar/DragAndDropCalendar'
import { default as AiAnalyzeModal, default as GenerateFeedbackModal } from '@/components/modal/CommonModal'
import { useTasks } from '@/hooks/useTasks'
import type { DataProps } from '@/pages/ai-generate/TaskAnalysisTable'
import TaskAnalysisTable from '@/pages/ai-generate/TaskAnalysisTable'
import UserProgress from '@/pages/user-progress/UserProgress'
import type { AnalyzeTaskDTO } from '@/types/ai-generate.type'
import type { IModalMethods } from '@/types/modal.type'
import { analyzeTaskByAI, generateFeedback } from '@/utils/apis/ai-generate-apis.util'
import type { TimerProgressResponse } from '@/utils/apis/insights-apis.util'
import { getTimeProgress } from '@/utils/apis/insights-apis.util'
import { formatAIGenerateFeedback } from '@/utils/common.util'

import ActionCard from './ActionCard'
import NewTaskModal from './NewTaskModal'
import TaskList from './TaskList'

const Home = (): React.ReactNode => {
  const [taskAnalysis, setTaskAnalysis] = useState<DataProps[]>()
  const refAnalyzeModal = useRef<IModalMethods | null>(null)
  const refFeedbackModal = useRef<IModalMethods | null>(null)
  const [isLoadingAnalyzes, setIsLoadingAnalyzes] = useState<boolean>(false)
  const [isLoadingFeedback, setIsLoadingFeedback] = useState<boolean>(false)
  const [isNewTaskOpen, setIsNewTaskOpen] = useState<boolean>(false)
  const {
    data: userProgressData,
    isLoading: userProgressLoading,
    refetch: fetchTimeProgress
  } = useQuery({
    queryKey: ['timeProgress'],
    queryFn: async () => {
      const response = await getTimeProgress()
      return response.data
    }
  })
  const [generateFeedbackData, setGenerateFeedbackData] = useState<string>('')

  const { isLoading, data: tasks, error } = useTasks()

  const analyzeTaskHandler = async (): Promise<void> => {
    setIsLoadingAnalyzes(true)
    setTaskAnalysis([])
    refAnalyzeModal?.current?.showModal()

    const AIResponse: AnalyzeTaskDTO[] = await analyzeTaskByAI()
    const pipeAIResponse: DataProps[] = AIResponse.map(({ no: key, ...rest }) => ({ key, ...rest }) as DataProps)
    setTaskAnalysis(pipeAIResponse)
    setIsLoadingAnalyzes(false)
  }

  const generateFeedbackHandler = async (): Promise<void> => {
    setIsLoadingFeedback(true)
    refFeedbackModal?.current?.showModal()
    const res: string = await generateFeedback()
    console.log(res)
    setGenerateFeedbackData(res)
    setIsLoadingFeedback(false)
  }

  const analyzeTaskCancel = (): void => {
    setTaskAnalysis([])
  }

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <div className='relative'>
          <b className='text-base'>Task Insights</b>
          <Button
            className='right-0 absolute'
            onClick={(e) => {
              e.stopPropagation()
              fetchTimeProgress()
            }}
            style={{ top: '-20%' }}
          >
            <i className='fa-arrows-rotate fa-solid' />
          </Button>
        </div>
      ),
      children: userProgressLoading ? (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
      ) : (
        <UserProgress dataSource={userProgressData} />
      )
    }
  ]

  return (
    <div className='mx-auto --home-section'>
      {isLoading && <Spin fullscreen />}
      {/* Quick Actions */}
      <Row gutter={[16, 16]} className='mb-6'>
        <Col xs={24} md={8}>
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
        <Col xs={24} md={8}>
          <ActionCard
            title='Analyze Schedule'
            description='Analyze your study schedule with AI'
            className='bg-orange-50 hover:bg-orange-200 shadow-md'
            icon={<RobotOutlined className='text-2xl text-orange-600' />}
            action={analyzeTaskHandler}
          />
        </Col>
        <Col xs={24} md={8}>
          <ActionCard
            title='AI feedback'
            description='Give feedback about my tasks'
            className='bg-blue-50 hover:bg-blue-200 shadow-md'
            icon={<RobotOutlined className='text-2xl text-blue-600' />}
            action={generateFeedbackHandler}
          />
        </Col>
      </Row>

      {/* Collapse for insights */}
      <Collapse items={items} defaultActiveKey={['1']} className='mb-5' />

      {/* Calendar and Tasks */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={18}>
          <Card title='Schedule'>
            <div className='flex justify-center items-center rounded min-w-full --calendar-section'>
              <DragAndDropCalendar className='min-w-full' />
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
              <div className='--calendar-section'>
                <TaskList task_list={tasks} limit={tasks.length} />
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* AI Analyze Modal */}
      <AiAnalyzeModal title='AI Analysis' width={1000} ref={refAnalyzeModal} handleCancel={analyzeTaskCancel}>
        {isLoadingAnalyzes ? (
          <div className='flex justify-center w-full'>
            <Spin tip='Loading' size='large' />
          </div>
        ) : (
          <TaskAnalysisTable dataSource={taskAnalysis} />
        )}
      </AiAnalyzeModal>

      {/* AI Feedback Modal */}
      <GenerateFeedbackModal title='AI Feedback' width={1000} ref={refFeedbackModal}>
        <div className='flex justify-center w-full'>
          {isLoadingFeedback ? (
            <div className='flex justify-center w-full'>
              <Spin tip='Loading' size='large' />
            </div>
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: formatAIGenerateFeedback(generateFeedbackData)
              }}
              style={{ fontSize: 15 }}
            />
          )}
        </div>
      </GenerateFeedbackModal>

      <NewTaskModal isOpen={isNewTaskOpen} onClose={() => setIsNewTaskOpen(false)} />
    </div>
  )
}

export default Home
