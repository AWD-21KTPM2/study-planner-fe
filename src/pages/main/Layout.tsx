import '@/pages/home/home.scss'

import {
  BookOutlined,
  ContactsOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Avatar, Dropdown, Layout, Menu, MenuProps } from 'antd'
import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { ROUTE } from '@/constants/route.const'
import { useAuth } from '@/hooks/useAuth'

const { Header, Content } = Layout

const menuList = [
  { title: 'Home', icon: <HomeOutlined />, path: ROUTE.HOME },
  { title: 'About', icon: <InfoCircleOutlined />, path: ROUTE.NOT_FOUND },
  { title: 'Services', icon: <TeamOutlined />, path: ROUTE.NOT_FOUND },
  { title: 'Contact', icon: <ContactsOutlined />, path: ROUTE.NOT_FOUND }
]

const CommonLayout = (): React.ReactNode => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const profileMenu: MenuProps['items'] = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: <a href={ROUTE.PROFILE}>Profile</a>
    },
    {
      key: '2',
      icon: <SettingOutlined />,
      label: 'Settings'
    },
    {
      key: '3',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: logout
    }
  ]
  const menuItems = menuList.map((menu, index) => ({
    key: index + 1,
    icon: menu.icon,
    label: menu.title,
    onClick: (): void => navigate(menu.path)
  }))

  return (
    <Layout className='min-h-screen'>
      <Header className='flex justify-between items-center bg-white px-4 border-b'>
        <div className='flex items-center'>
          <BookOutlined className='text-2xl text-blue-600' />
          <span className='ml-2 font-semibold text-xl'>Study Planner</span>
        </div>
        <div className='flex items-center gap-4'>
          <Menu theme='light' mode='horizontal' defaultSelectedKeys={['1']} items={menuItems} />
          <Dropdown menu={{ items: profileMenu }} trigger={['click']}>
            <Avatar icon={<UserOutlined />} className='bg-blue-600 cursor-pointer' />
          </Dropdown>
        </div>
      </Header>

      <Content className='bg-gray-50 p-4 md:p-6 lg:p-8'>
        <Outlet />
      </Content>
    </Layout>
  )
}

export default CommonLayout
