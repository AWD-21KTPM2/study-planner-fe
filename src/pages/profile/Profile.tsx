import { HomeOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Form, Input, Layout, message, Select, Spin, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTE } from '@/constants/route.const'
import useAuth from '@/hooks/useAuth'
import { UserInformation } from '@/types/user.type'
import { getUserProfile } from '@/utils/apis/user-apis.util'

const { Header, Content } = Layout
const { Title, Text } = Typography
const { Option } = Select

const Profile = (): React.ReactNode => {
  const { userInformation, authSession } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [profile, setProfile] = useState<UserInformation>()
  const [form] = Form.useForm<UserInformation>()

  const onUpdateProfile = (): void => {
    // setProfile(values)
    message.info('Will be implemented soon')
  }

  useEffect(() => {
    const fetchUserProfile = async (): Promise<void> => {
      try {
        if (!userInformation) return
        setLoading(true)
        const userProfile = await getUserProfile(authSession)

        setProfile(userProfile)
        form.setFieldsValue(userProfile)
      } finally {
        setLoading(false)
      }
    }

    if (userInformation) {
      fetchUserProfile()
    } else {
      navigate(ROUTE.LOGIN)
    }
  }, [userInformation])

  return (
    <Layout className='bg-gray-100 min-h-screen'>
      <Header className='flex justify-between items-center bg-white shadow-md p-4'>
        <Button type='primary' icon={<HomeOutlined />} onClick={() => navigate(ROUTE.HOME)}>
          Back to Home
        </Button>
        <Title level={3} className='m-0'>
          User Profile
        </Title>
      </Header>
      <Content className='p-6'>
        <Spin spinning={loading} size='large' fullscreen />
        <Card className='shadow-lg mx-auto rounded-lg max-w-xl overflow-hidden' styles={{ body: { padding: '2rem' } }}>
          <div className='flex flex-col items-center mb-8'>
            <Avatar size={128} icon={<UserOutlined />} className='bg-blue-500 mb-4' />
            <Title level={2} className='text-center text-gray-800'>
              {profile?.name}
            </Title>
            <Text className='text-gray-500'>{profile?.bio}</Text>
          </div>
          <Form form={form} layout='vertical' initialValues={profile} onFinish={onUpdateProfile}>
            <Form.Item name='name' label='Name' rules={[{ required: true, message: 'Name is required' }]}>
              <Input prefix={<UserOutlined />} placeholder='Enter your name' />
            </Form.Item>
            <Form.Item
              name='email'
              label='Email'
              rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}
              initialValue={profile?.email}
            >
              <Input prefix={<MailOutlined />} placeholder='Enter your email' disabled className='font-semibold' />
            </Form.Item>
            <Form.Item name='phone' label='Phone' rules={[{ required: true, message: 'Phone number is required' }]}>
              <Input prefix={<PhoneOutlined />} placeholder='Enter your phone number' />
            </Form.Item>
            <Form.Item name='country' label='Country' className='text-left'>
              <Select placeholder='Select your country'>
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
              <Input.TextArea rows={4} placeholder='Tell us a little about yourself' />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit' className='w-full'>
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
