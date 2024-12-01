import { Button, Form, Input, message } from 'antd'
import Link from 'antd/es/typography/Link'
import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTE } from '@/constants/route.const'
import { UserDTO } from '@/types/user.type'

const Register: React.FC = () => {
  const navigate = useNavigate()

  const onFinish = async (data: UserDTO): Promise<void> => {
    try {
      const response = await axios.post<{ message: string }>(`${import.meta.env.VITE_API_URL}/user/register`, data)
      message.success(response.data.message)
      navigate(ROUTE.HOME)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message)
      } else {
        message.error('An unexpected error occurred')
      }
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-lg'>
        <h2 className='mb-6 text-2xl font-semibold text-center text-gray-800'>Register</h2>
        <Form layout='vertical' onFinish={onFinish} className='space-y-4'>
          <Form.Item
            label='Email'
            name='email'
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Enter a valid email' }
            ]}
          >
            <Input
              placeholder='Enter your email'
              className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </Form.Item>

          <Form.Item
            label='Password'
            name='password'
            rules={[
              { required: true, message: 'Password is required' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password
              placeholder='Enter your password'
              className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              block
              className='w-full py-2 text-white bg-blue-500 hover:bg-blue-600'
            >
              Register
            </Button>
          </Form.Item>

          <div className='text-center'>
            <span className='text-gray-600'>Already have an account? </span>
            <Link href='/login' className='text-blue-500 hover:underline'>
              Login
            </Link>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Register
