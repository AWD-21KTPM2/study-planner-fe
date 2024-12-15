import { HomeOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, Button, Card, Form, Input, Layout, message, Select, Spin, Typography } from 'antd'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FormItem } from 'react-hook-form-antd'
import { useNavigate } from 'react-router-dom'
import * as zod from 'zod'

import { ROUTE } from '@/constants/route.const'
import { useProfile } from '@/hooks/useAuth'
import { UserInformation } from '@/types/user.type'

const { Header, Content } = Layout
const { Title, Text } = Typography
const { Option } = Select

const profileSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required' }),
  email: zod.string().email({ message: 'Invalid email address' }),
  phone: zod.string().min(1, { message: 'Phone number is required' }),
  country: zod.string().min(1, { message: 'Country is required' }),
  bio: zod.string().max(200, { message: 'Bio should not exceed 200 characters' })
})

const Profile = (): React.ReactNode => {
  const { data: userInformation, isLoading } = useProfile()
  const navigate = useNavigate()
  const { reset, control, handleSubmit } = useForm<UserInformation>({
    resolver: zodResolver(profileSchema),
    defaultValues: userInformation
  })

  useEffect(() => {
    // update default values
    reset(userInformation)
  }, [userInformation])

  const onUpdateProfile = (): void => {
    // setProfile(values)
    message.info('Will be implemented soon')
  }

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
        <Spin spinning={isLoading} size='large' fullscreen />
        <Card className='shadow-lg mx-auto rounded-lg max-w-xl overflow-hidden' styles={{ body: { padding: '2rem' } }}>
          <div className='flex flex-col items-center mb-8'>
            <Avatar size={128} icon={<UserOutlined />} className='bg-blue-500 mb-4' />
            <Title level={2} className='text-center text-gray-800'>
              {userInformation?.name}
            </Title>
            <Text className='text-gray-500'>{userInformation?.bio}</Text>
          </div>
          <Form layout='vertical' onFinish={handleSubmit(onUpdateProfile)}>
            <FormItem control={control} name='name' label='Name'>
              <Input prefix={<UserOutlined />} placeholder='eg. John Doe' />
            </FormItem>
            <FormItem control={control} name='email' label='Email'>
              <Input prefix={<MailOutlined />} placeholder='eg. example@gmail.com' disabled className='font-semibold' />
            </FormItem>
            <FormItem control={control} name='phone' label='Phone'>
              <Input prefix={<PhoneOutlined />} placeholder='eg. +66 812345678' />
            </FormItem>
            <FormItem control={control} name='country' label='Country'>
              <Select placeholder='eg. Thailand'>
                <Option value='TH'>Thailand</Option>
                <Option value='UK'>United Kingdom</Option>
                <Option value='Canada'>Canada</Option>
                <Option value='Australia'>Australia</Option>
              </Select>
            </FormItem>
            <FormItem control={control} name='bio' label='Bio'>
              <Input.TextArea rows={4} placeholder='eg. I am a software engineer' />
            </FormItem>
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
