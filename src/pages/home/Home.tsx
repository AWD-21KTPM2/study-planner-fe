import '@/pages/home/home.scss'

import {
  BarChartOutlined,
  BookOutlined,
  CheckSquareOutlined,
  ClockCircleOutlined,
  ContactsOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Avatar, Button, Card, Col, Dropdown, Layout, Menu, MenuProps, Row, Tag } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTE } from '@/constants/route.const'
import useAuth from '@/hooks/useAuth'

import { ContinuousCalendar } from '../../components/calendar/ContinuousCalendar'
import ActionCard from './ActionCard'

const { Header, Content } = Layout

const menuList = [
  { title: 'Home', icon: <HomeOutlined />, path: ROUTE.HOME },
  { title: 'About', icon: <InfoCircleOutlined />, path: ROUTE.NOT_FOUND },
  { title: 'Services', icon: <TeamOutlined />, path: ROUTE.NOT_FOUND },
  { title: 'Contact', icon: <ContactsOutlined />, path: ROUTE.NOT_FOUND }
]

const Home = (): React.ReactNode => {
  const { clearAuthSession } = useAuth()
  const navigate = useNavigate()
  const _monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const _onClickHandler = (_day: number, _month: number, _year: number): void => {
    // const snackMessage = `Clicked on ${monthNames[month]} ${day}, ${year}`
    // createSnack(snackMessage, 'success')
  }

  const profileMenu: MenuProps['items'] = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: <a href={ROUTE.PROFILE}>Profile</a>
    },
    {
      key: '2',
      icon: <SettingOutlined />,
      label: 'Settings'
    },
    {
      key: '3',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: clearAuthSession
    }
  ]
  return (
    <Layout className='min-h-screen'>
      <Header className='flex justify-between items-center bg-white px-4 border-b'>
        <div className='flex items-center'>
          <BookOutlined className='text-2xl text-blue-600' />
          <span className='ml-2 font-semibold text-xl'>Study Planner</span>
        </div>
        <div className='flex items-center gap-4'>
          <Menu theme='light' mode='horizontal' defaultSelectedKeys={['1']}>
            {menuList.map((menu, index) => (
              <Menu.Item key={index + 1} icon={menu.icon} onClick={() => navigate(menu.path)}>
                {menu.title}
              </Menu.Item>
            ))}
          </Menu>
          <Dropdown menu={{ items: profileMenu }} trigger={['click']}>
            <Avatar icon={<UserOutlined />} className='bg-blue-600' />
          </Dropdown>
        </div>
      </Header>

      <Content className='bg-gray-50 p-4 md:p-6 lg:p-8'>
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
                action={() => {}}
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
        </div>
      </Content>
    </Layout>
  )
}

export default Home
