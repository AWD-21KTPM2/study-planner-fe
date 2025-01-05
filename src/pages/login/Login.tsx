import { zodResolver } from '@hookform/resolvers/zod'
import { TokenResponse, useGoogleLogin } from '@react-oauth/google'
import { Alert, Button, Checkbox, Form, Input, message, Spin } from 'antd'
import Link from 'antd/es/typography/Link'
import axios, { AxiosError } from 'axios'
import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FormItem } from 'react-hook-form-antd'
import { useNavigate } from 'react-router-dom'
import * as z from 'zod'

import { ROUTE } from '@/constants/route.const'
import { useAuth } from '@/hooks/useAuth'
import { googleLogin } from '@/utils/apis/user-apis.util'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional()
})

type LoginFormData = z.infer<typeof loginSchema>

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login, isLoading, error, setAuthSession } = useAuth()

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  })

  useEffect(() => {
    const email = localStorage.getItem('email')
    const password = localStorage.getItem('password')
    if (email && password) {
      setValue('email', email)
      setValue('password', password)
      setValue('rememberMe', true)
    }
  }, [setValue])

  const onGoogleSuccess = (response: Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'>): void => {
    googleLogin(response.access_token)
      .then((response) => {
        const { accessToken, refreshToken, id, email } = response.data
        setAuthSession(accessToken, refreshToken, { id, email })
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
  }

  const loginByGoogle = useGoogleLogin({
    onSuccess: onGoogleSuccess,
    onError: (error) => {
      console.error('Google login error:', error)
      message.error('An unexpected error occurred')
    }
  })

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      if (data.rememberMe) {
        localStorage.setItem('email', data.email)
        localStorage.setItem('password', data.password)
      } else {
        localStorage.removeItem('email')
        localStorage.removeItem('password')
      }

      await login(data)
      message.success('Login successful')
      navigate(ROUTE.HOME)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.message)
        message.error(error.message)
      } else if (error instanceof Error) {
        message.error(error.message)
      } else {
        console.log('An unexpected error occurred')
      }
    }
  }

  return (
    <div className='flex justify-center items-center bg-gray-100 min-h-screen'>
      <Spin spinning={isLoading} size='large' fullscreen />
      <div className='bg-white shadow-lg p-6 rounded-lg w-full max-w-md'>
        <h2 className='mb-6 font-semibold text-2xl text-center text-gray-800'>Login</h2>

        <Form layout='vertical' onFinish={handleSubmit(onSubmit)} className='space-y-4'>
          <FormItem name='email' control={control} label='Email'>
            <Input
              placeholder='Enter your email'
              className='px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 w-full focus:outline-none'
              status={errors.email ? 'error' : ''}
            />
          </FormItem>

          <FormItem name='password' control={control} label='Password'>
            <Input.Password
              placeholder='Enter your password'
              className='px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 w-full focus:outline-none'
              status={errors.password ? 'error' : ''}
            />
          </FormItem>

          {/* <div className='text-right'>
            <Button type='link' onClick={() => navigate('/forgot-password')} className='text-blue-500 hover:underline'>
              Forgot Password?
            </Button>
          </div>

          <FormItem name='rememberMe' control={control} className='flex justify-start'>
            <Checkbox>Remember me</Checkbox>
          </FormItem> */}

          <div className='flex justify-between'>
            <FormItem name='rememberMe' control={control} className='flex justify-start'>
              <Checkbox>Remember me</Checkbox>
            </FormItem>
            <Button
              type='link'
              onClick={() => navigate('/forgot-password')}
              className='text-blue-500 hover:underline border-none'
            >
              Forgot Password?
            </Button>
          </div>

          <Button
            type='primary'
            htmlType='submit'
            block
            className='bg-blue-500 hover:bg-blue-600 py-2 w-full text-white'
          >
            Login
          </Button>

          <Button
            type='primary'
            block
            className='bg-red-500 hover:!bg-red-600 py-2 hover:border-none hover:!ring-red-600 w-full text-white'
            onClick={() => loginByGoogle()}
          >
            Login with Google
          </Button>

          <div className='text-center'>
            <span className='text-gray-600'>Don&apos;t have an account? </span>
            <Link href='/register' className='text-blue-500 hover:underline'>
              Register
            </Link>
          </div>
          <div className='text-center'>
            <span className='text-gray-600'>Or </span>
          </div>
          <div className='text-center'>
            <span className='text-gray-600'>Continue to explore as </span>
            <Link href='/guest' className='text-blue-500 hover:underline'>
              Guest
            </Link>
          </div>
        </Form>
      </div>

      {error && <Alert message={error.message} type='error' className='right-0 bottom-0 left-0 absolute text-center' />}
    </div>
  )
}

export default Login
