import { TokenResponse, useGoogleLogin } from '@react-oauth/google'
import { Button, Form, Input, message, Spin } from 'antd'
import Link from 'antd/es/typography/Link'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTE } from '@/constants/route.const'
import useAuth from '@/hooks/useAuth'
import { UserDTO } from '@/types/user.type'
import { googleLogin, login } from '@/utils/apis/user-apis.util'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { setAuthSession } = useAuth()
  const [_loading, setLoading] = useState<boolean>(false)

  const onGoogleSuccess = (response: Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'>): void => {
    googleLogin(response.access_token)
      .then((response) => {
        const { accessToken, id, email } = response.data

        setAuthSession(accessToken, { id, email })
        message.success(response.message)
        navigate(ROUTE.HOME)
      })
      .catch((error) => {
        if (axios.isAxiosError(error) && error.response) {
          message.error(error.response.data.message)
        } else {
          message.error('An unexpected error occurred')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const loginByGoogle = useGoogleLogin({
    onSuccess: onGoogleSuccess,
    onError: (error) => {
      console.error('Google login error:', error)
      message.error('An unexpected error occurred')
    }
  })

  const onFinish = async (data: UserDTO): Promise<void> => {
    try {
      setLoading(true)
      const loginResponse = await login(data)

      const { accessToken, id, email } = loginResponse.data

      setAuthSession(accessToken, { id, email })
      message.success(loginResponse.message)
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
    <div className='flex justify-center items-center bg-gray-100 min-h-screen'>
      <Spin spinning={_loading} size='large' fullscreen />
      <div className='bg-white shadow-lg p-6 rounded-lg w-full max-w-md'>
        <h2 className='mb-6 font-semibold text-2xl text-center text-gray-800'>Login</h2>
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
              className='px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 w-full focus:outline-none'
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
              className='px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 w-full focus:outline-none'
            />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              block
              className='bg-blue-500 hover:bg-blue-600 py-2 w-full text-white'
            >
              Login
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              block
              className='bg-red-500 hover:!bg-red-600 py-2 hover:border-none hover:!ring-red-600 w-full text-white'
              onClick={() => loginByGoogle()}
            >
              Login with Google
            </Button>
          </Form.Item>

          <div className='text-center'>
            <span className='text-gray-600'>Don&apos;t have an account? </span>
            <Link href='/register' className='text-blue-500 hover:underline'>
              Register
            </Link>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Login
