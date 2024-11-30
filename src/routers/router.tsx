import { createBrowserRouter, Navigate } from 'react-router-dom'

import { ROUTE } from '@/constants/route.const'
import Home from '@/pages/home/Home'
import Login from '@/pages/login/Login'
import RenderMain from '@/pages/main/RenderMain'
import NotFound from '@/pages/not-found/NotFound'
import Profile from '@/pages/profile/Profile'
import Register from '@/pages/sign-up/Register'

import PublicRoute from './PublicRoute'

export const router = createBrowserRouter([
  {
    path: ROUTE.ROOT,
    children: [
      {
        path: ROUTE.LOGIN,
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        )
      },
      {
        path: ROUTE.REGISTER,
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        )
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
            element: <Home />
          },
          {
            path: ROUTE.PROFILE,
            element: <Profile />
          }
        ]
      },
      { path: '*', element: <NotFound /> }
    ]
  }
])
