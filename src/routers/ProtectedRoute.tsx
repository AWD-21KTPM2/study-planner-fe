import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { ROUTE } from '@/constants/route.const'

type RouteProps = {
  isAllowed: boolean
  redirectTo?: string
  children?: React.ReactNode
}
export default function ProtectedRoute({ isAllowed, redirectTo = ROUTE.LOGIN, children }: RouteProps): React.ReactNode {
  if (!isAllowed) {
    return <Navigate to={redirectTo} />
  }
  return children ? children : <Outlet />
}
