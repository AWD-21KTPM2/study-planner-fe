import { HomeOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Form, Input, Layout, message, Select, Typography } from 'antd'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTE } from '@/constants/route.const'
import useAuth from '@/hooks/useAuth'

const { Header, Content } = Layout
const { Title, Text } = Typography
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
    <Layout className='min-h-screen bg-gray-100'>
      <Header className='bg-white shadow-md flex justify-between items-center p-4'>
        <Button type='primary' icon={<HomeOutlined />} onClick={() => navigate(ROUTE.HOME)}>
          Back to Home
        </Button>
        <Title level={3} className='m-0'>
          User Profile
        </Title>
      </Header>
      <Content className='p-6'>
        <Card className='max-w-xl mx-auto shadow-lg rounded-lg overflow-hidden' bodyStyle={{ padding: '2rem' }}>
          <div className='flex flex-col items-center mb-8'>
            <Avatar size={128} icon={<UserOutlined />} className='mb-4 bg-blue-500' />
            <Title level={2} className='text-center text-gray-800'>
              {profile.name}
            </Title>
            <Text className='text-gray-500'>{profile.bio}</Text>
          </div>
          <Form form={form} layout='vertical' initialValues={profile} onFinish={onFinish}>
            <Form.Item name='name' label='Name' rules={[{ required: true, message: 'Name is required' }]}>
              <Input prefix={<UserOutlined />} placeholder='Enter your name' disabled />
            </Form.Item>
            <Form.Item
              name='email'
              label='Email'
              rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}
            >
              <Input prefix={<MailOutlined />} placeholder='Enter your email' />
            </Form.Item>
            <Form.Item name='phone' label='Phone' rules={[{ required: true, message: 'Phone number is required' }]}>
              <Input prefix={<PhoneOutlined />} placeholder='Enter your phone number' disabled />
            </Form.Item>
            <Form.Item name='country' label='Country'>
              <Select placeholder='Select your country' disabled>
                <Option value='USA'>United States</Option>
                <Option value='UK'>United Kingdom</Option>
                <Option value='Canada'>Canada</Option>
                <Option value='Australia'>Australia</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name='bio'
              label='Bio'
              rules={[
                {
                  max: 200,
                  message: 'Bio should not exceed 200 characters'
                }
              ]}
            >
              <Input.TextArea rows={4} placeholder='Tell us a little about yourself' disabled />
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
