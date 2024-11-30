import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { ROUTE } from '@/constants/route.const'
import useAuth from '@/hooks/useAuth'

type Props = { children: React.ReactNode }

const PublicRoute = ({ children }: Props): React.ReactNode => {
  const location = useLocation()
  const { authSession } = useAuth()
  const isAdmin = authSession || false
  //TODO enhance navigation
  const previousLocation = location.state?.from || ROUTE.HOME

  return isAdmin ? <Navigate to={previousLocation} replace /> : <>{children}</>
}

export default PublicRoute
