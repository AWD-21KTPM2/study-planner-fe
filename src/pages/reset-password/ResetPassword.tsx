// import axios from 'axios'
// import React from 'react'
// import { useForm } from 'react-hook-form'
// import { useParams } from 'react-router-dom'

// const ResetPassword: React.FC = () => {
//   const { token } = useParams<{ token: string }>()
//   const { register, handleSubmit } = useForm<{ newPassword: string }>()

//   const onSubmit = async (data: { newPassword: string }): Promise<void> => {
//     try {
//       await axios.post('http://localhost:3000/user/reset-password', { token, ...data })
//       alert('Password has been reset successfully!')
//     } catch {
//       alert('Error resetting password')
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <h2>Reset Password</h2>
//       <input type='password' {...register('newPassword')} placeholder='Enter your new password' required />
//       <button type='submit'>Reset Password</button>
//     </form>
//   )
// }

// export default ResetPassword

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
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Reset Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label htmlFor='newPassword' className='block text-sm font-medium text-gray-700'>
              New Password
            </label>
            <input
              type='password'
              id='newPassword'
              {...register('newPassword')}
              placeholder='Enter your new password'
              required
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            />
          </div>
          <button
            type='submit'
            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
