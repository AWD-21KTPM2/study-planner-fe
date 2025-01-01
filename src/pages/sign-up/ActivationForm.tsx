import axios from 'axios'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const ActivationPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || ''

  const [otp, setOtp] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleActivate = async (): Promise<void> => {
    setLoading(true)
    setMessage('')

    try {
      const response = await axios.post('http://localhost:3000/user/activate', { email, otp })
      setMessage(response.data.message || 'Account activated successfully!')
      if (response.data.message.includes('successfully')) {
        setTimeout(() => {
          navigate('/login')
        }, 1000)
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Activation failed. Please try again.')
      } else {
        setMessage('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-6 bg-white rounded shadow-md'>
        <h2 className='text-2xl font-bold text-center mb-4'>Activate Your Account</h2>

        <p className='text-sm text-gray-600 mb-4'>Email: {email}</p>

        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700' htmlFor='otp'>
            OTP
          </label>
          <input
            id='otp'
            type='text'
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder='Enter the OTP sent to your email'
            className='w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300'
          />
        </div>

        <button
          onClick={handleActivate}
          disabled={loading}
          className={`w-full px-4 py-2 text-white rounded ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Activating...' : 'Activate'}
        </button>

        {message && (
          <div
            className={`mt-4 p-2 text-center rounded ${
              message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivationPage
