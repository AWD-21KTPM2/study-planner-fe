import React from 'react'

import { ROUTE } from '@/constants/route.const'
import useAuth from '@/hooks/useAuth'
import ProtectedRoute from '@/routers/ProtectedRoute'

import CommonLayout from './Layout'

const RenderMain: React.FC = () => {
  const { authSession } = useAuth()
  return (
    <ProtectedRoute isAllowed={!!authSession} redirectTo={ROUTE.LOGIN}>
      <CommonLayout />
    </ProtectedRoute>
  )
}

export default RenderMain
