// import axios from 'axios'
// import React from 'react'
// import { useForm } from 'react-hook-form'

// const ForgotPassword: React.FC = () => {
//   const { register, handleSubmit } = useForm<{ email: string }>()

//   const onSubmit = async (data: { email: string }): Promise<void> => {
//     try {
//       await axios.post('http://localhost:3000/user/forgot-password', data)
//       alert('Password reset email sent!')
//     } catch {
//       alert('Error sending password reset email')
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <h2>Forgot Password</h2>
//       <input type='email' {...register('email')} placeholder='Enter your email' required />
//       <button type='submit'>Send Reset Email</button>
//     </form>
//   )
// }

// export default ForgotPassword

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
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Forgot Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
              Email address
            </label>
            <input
              type='email'
              id='email'
              {...register('email')}
              placeholder='Enter your email'
              required
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            />
          </div>
          <button
            type='submit'
            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Send Reset Email
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
