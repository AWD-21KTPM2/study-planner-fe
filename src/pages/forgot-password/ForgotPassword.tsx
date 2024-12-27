import axios from 'axios'
import React from 'react'
import { useForm } from 'react-hook-form'

const ForgotPassword: React.FC = () => {
  const { register, handleSubmit } = useForm<{ email: string }>()

  const onSubmit = async (data: { email: string }): Promise<void> => {
    try {
      await axios.post('http://localhost:3000/user/forgot-password', data)
      alert('Password reset email sent!')
    } catch {
      alert('Error sending password reset email')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Forgot Password</h2>
      <input type='email' {...register('email')} placeholder='Enter your email' required />
      <button type='submit'>Send Reset Email</button>
    </form>
  )
}

export default ForgotPassword
