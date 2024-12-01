import { Button, Form, Input, message } from 'antd'
import Link from 'antd/es/typography/Link'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTE } from '@/constants/route.const'
import useAuth from '@/hooks/useAuth'
import { LoginResponse, UserDTO } from '@/types/user.type'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { setAuthSession } = useAuth()
  const [_loading, setLoading] = useState<boolean>(false)

  const onFinish = async (data: UserDTO): Promise<void> => {
    try {
      const response = await axios.post<LoginResponse>(`${import.meta.env.VITE_API_URL}/user/login`, data)

      const { accessToken, id, email } = response.data.data

      setAuthSession(accessToken, { id, email })
      message.success(response.data.message)
      navigate(ROUTE.HOME)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message)
      } else {
        message.error('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: 400, margin: 'auto', padding: '50px' }}>
      <h2>Login</h2>
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
            Login
          </Button>
        </Form.Item>

        <Link href='/register'>Register</Link>
      </Form>
    </div>
  )
}

export default Login
