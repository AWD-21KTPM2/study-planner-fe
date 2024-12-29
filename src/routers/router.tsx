import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import LazyComponent from '@/components/common/LazyComponent'
import { ROUTE } from '@/constants/route.const'

import PublicRoute from './PublicRoute'

const FocusTimer = lazy(() => import('@/pages/focus-timer/FocusTimer'))
const Home = lazy(() => import('@/pages/home/Home'))
const Login = lazy(() => import('@/pages/login/Login'))
const LandingPage = lazy(() => import('@/pages/home/LandingPage'))
const RenderMain = lazy(() => import('@/pages/main/RenderMain'))
const NotFound = lazy(() => import('@/pages/not-found/NotFound'))
const Profile = lazy(() => import('@/pages/profile/Profile'))
const Register = lazy(() => import('@/pages/sign-up/Register'))
const Tasks = lazy(() => import('@/pages/tasks'))
const ForgotPassword = lazy(() => import('@/pages/forgot-password/ForgotPassword'))
const ResetPassword = lazy(() => import('@/pages/reset-password/ResetPassword'))

const wrapWithLazy = (Component: React.ComponentType, isPublic = false): JSX.Element => {
  const wrapped = (
    <LazyComponent>
      <Component />
    </LazyComponent>
  )
  return isPublic ? <PublicRoute>{wrapped}</PublicRoute> : wrapped
}

export const router = createBrowserRouter([
  {
    path: ROUTE.ROOT,
    children: [
      {
        path: ROUTE.LOGIN,
        element: wrapWithLazy(Login, true)
      },
      {
        path: ROUTE.GUEST,
        element: (
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        )
      },
      {
        path: ROUTE.REGISTER,
        element: wrapWithLazy(Register, true)
      },
      {
        path: ROUTE.FORGOTPASSWORD,
        element: wrapWithLazy(ForgotPassword, true)
      },
      {
        path: ROUTE.RESETPASSWORD,
        element: wrapWithLazy(ResetPassword, true)
      },
      {
        path: ROUTE.ROOT,
        element: <RenderMain />,
        children: [
          {
            path: '',
            element: <Navigate to={ROUTE.HOME} />
          },
          {
            path: ROUTE.HOME,
            element: wrapWithLazy(Home)
          },
          {
            path: ROUTE.TASKS,
            element: wrapWithLazy(Tasks)
          },
          {
            path: ROUTE.PROFILE,
            element: wrapWithLazy(Profile)
          },
          {
            path: ROUTE.FOCUS_TIMER,
            element: wrapWithLazy(FocusTimer)
          }
        ]
      },
      {
        path: '*',
        element: wrapWithLazy(NotFound)
      }
    ]
  }
])
