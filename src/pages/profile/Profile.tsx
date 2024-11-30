import { HomeOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Form, Input, Layout, message, Select, Typography } from 'antd'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTE } from '@/constants/route.const'
import useAuth from '@/hooks/useAuth'

const { Header, Content } = Layout
const { Title } = Typography
const { Option } = Select

interface UserProfile {
  name: string
  email: string
  phone: string
  country: string
  bio: string
}

const Profile = (): React.ReactNode => {
  const { userInformation } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: userInformation?.email || '',
    phone: '+1 234 567 8900',
    country: 'USA',
    bio: 'Software developer with a passion for creating user-friendly applications.'
  })

  const [form] = Form.useForm<UserProfile>()

  const onFinish = (values: UserProfile): void => {
    setProfile(values)
    message.success('Profile updated successfully!')
  }

  return (
    <Layout className='min-h-screen'>
      <Header className='bg-white shadow-md'>
        <Button
          type='primary'
          icon={<HomeOutlined />}
          onClick={() => navigate(ROUTE.HOME)}
          className={`absolute left-0 top ml-4 mt-4`}
        >
          Back to Home
        </Button>
        <Title level={3} className='text-center py-4'>
          User Profile
        </Title>
      </Header>
      <Content className='p-6'>
        <Card className='max-w-xl mx-auto'>
          <div className='flex flex-col items-center mb-8'>
            <Avatar size={128} icon={<UserOutlined />} className='mb-4' />
            <Title level={2}>{profile.name}</Title>
          </div>
          <Form form={form} layout='vertical' initialValues={profile} onFinish={onFinish}>
            <Form.Item name='name' label='Name' rules={[{ required: true }]}>
              <Input prefix={<UserOutlined />} disabled />
            </Form.Item>
            <Form.Item name='email' label='Email' rules={[{ required: true, type: 'email' }]}>
              <Input prefix={<MailOutlined />} />
            </Form.Item>
            <Form.Item name='phone' label='Phone'>
              <Input prefix={<PhoneOutlined />} disabled />
            </Form.Item>

            <Form.Item name='country' label='Country'>
              <Select disabled>
                <Option value='USA'>United States</Option>
                <Option value='UK'>United Kingdom</Option>
                <Option value='Canada'>Canada</Option>
                <Option value='Australia'>Australia</Option>
              </Select>
            </Form.Item>
            <Form.Item name='bio' label='Bio'>
              <Input.TextArea rows={4} disabled />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit' className='w-full' disabled>
                Update Profile
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  )
}

export default Profile
