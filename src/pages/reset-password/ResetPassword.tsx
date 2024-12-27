import axios from 'axios'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>()
  const { register, handleSubmit } = useForm<{ newPassword: string }>()

  const onSubmit = async (data: { newPassword: string }): Promise<void> => {
    try {
      await axios.post('http://localhost:3000/user/reset-password', { token, ...data })
      alert('Password has been reset successfully!')
    } catch {
      alert('Error resetting password')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Reset Password</h2>
      <input type='password' {...register('newPassword')} placeholder='Enter your new password' required />
      <button type='submit'>Reset Password</button>
    </form>
  )
}

export default ResetPassword
