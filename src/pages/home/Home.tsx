import '@/pages/home/home.scss'

import {
  ContactsOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Avatar, Button, Card, Col, Dropdown, Layout, Menu, Row, Typography } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTE } from '@/constants/route.const'
import useAuth from '@/hooks/useAuth'

const { Header, Content, Footer } = Layout
const { Title, Paragraph } = Typography

const Home = (): React.ReactNode => {
  const { clearAuthSession } = useAuth()
  const navigate = useNavigate()

  const profileMenu = (
    <Menu>
      <Menu.Item key='1' icon={<UserOutlined />} onClick={() => navigate(ROUTE.PROFILE)}>
        Profile
      </Menu.Item>
      <Menu.Item key='2' icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Item key='3' icon={<LogoutOutlined />} onClick={clearAuthSession}>
        Logout
      </Menu.Item>
    </Menu>
  )
  return (
    <Layout className='min-h-screen'>
      <Header className='flex items-center justify-between'>
        <div className='flex items-center'>
          <div className='text-white text-2xl font-bold mr-4'>My Company</div>
          <Menu theme='dark' mode='horizontal' defaultSelectedKeys={['1']}>
            <Menu.Item key='1' icon={<HomeOutlined />}>
              Home
            </Menu.Item>
            <Menu.Item key='2' icon={<InfoCircleOutlined />}>
              About
            </Menu.Item>
            <Menu.Item key='3' icon={<TeamOutlined />}>
              Services
            </Menu.Item>
            <Menu.Item key='4' icon={<ContactsOutlined />}>
              Contact
            </Menu.Item>
          </Menu>
        </div>
        <Dropdown overlay={profileMenu} placement='bottomRight' arrow>
          <Avatar size='large' icon={<UserOutlined />} className='cursor-pointer' />
        </Dropdown>
      </Header>

      <Content className='p-8'>
        <div className='text-center mb-16'>
          <Title>Welcome to My Company</Title>
          <Paragraph className='text-lg mb-8'>We provide innovative solutions for your business needs.</Paragraph>
          <Button type='primary' size='large'>
            Learn More
          </Button>
        </div>

        <Row gutter={[16, 16]} className='mb-16'>
          {[
            { title: 'Quality Service', content: 'We deliver top-notch services to our clients.' },
            { title: 'Expert Team', content: 'Our team consists of industry experts and professionals.' },
            { title: 'Innovative Solutions', content: 'We offer cutting-edge solutions for modern problems.' },
            { title: 'Customer Satisfaction', content: 'Your satisfaction is our top priority.' }
          ].map((feature, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card title={feature.title} className='h-full'>
                <p>{feature.content}</p>
              </Card>
            </Col>
          ))}
        </Row>

        <div className='text-center'>
          <Title level={2}>Ready to get started?</Title>
          <Paragraph className='mb-8'>Contact us today to learn how we can help your business grow.</Paragraph>
          <Button type='primary' size='large'>
            Contact Us
          </Button>
        </div>
      </Content>

      <Footer className='text-center'>© {new Date().getFullYear()} My Company. All rights reserved.</Footer>
    </Layout>
  )
}

export default Home
