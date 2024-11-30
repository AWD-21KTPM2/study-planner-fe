import './register.scss'

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
      console.log('message', response.data.message)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message)
      } else {
        message.error('An unexpected error occurred')
      }
    }
  }

  return (
    <div style={{ width: 400, margin: 'auto', padding: '50px' }}>
      <h2>Register</h2>
      <Form layout='vertical' onFinish={onFinish}>
        <Form.Item
          label='Email'
          name='email'
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Enter a valid email' }
          ]}
        >
          <Input placeholder='Enter your email' />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[
            { required: true, message: 'Password is required' },
            { min: 6, message: 'Password must be at least 6 characters' }
          ]}
        >
          <Input.Password placeholder='Enter your password' />
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' block>
            Register
          </Button>
        </Form.Item>

        <Link href='/login'>Login</Link>
      </Form>
    </div>
  )
}

export default Register
