import React from 'react'
import { Outlet } from 'react-router-dom'

import { ROUTE } from '@/constants/route.const'
import useAuth from '@/hooks/useAuth'
import ProtectedRoute from '@/routers/ProtectedRoute'

const RenderMain: React.FC = () => {
  const { authSession } = useAuth()
  return (
    <ProtectedRoute isAllowed={!!authSession} redirectTo={ROUTE.LOGIN}>
      <Outlet />
    </ProtectedRoute>
  )
}

export default RenderMain
