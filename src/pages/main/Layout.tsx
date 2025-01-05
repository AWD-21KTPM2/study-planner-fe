import '@/pages/home/home.scss'

import { BookOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, Layout, type MenuProps } from 'antd'
import { Link, Outlet } from 'react-router-dom'

import { ROUTE } from '@/constants/route.const'
import { useAuth } from '@/hooks/useAuth'

const { Header, Content } = Layout

const CommonLayout = (): React.ReactNode => {
  const { logout } = useAuth()

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

  return (
    <Layout className='min-h-screen'>
      <Header className='flex justify-between items-center bg-white px-4 border-b'>
        <div className='flex items-center'>
          <BookOutlined className='text-2xl text-blue-600' />
          <Link className='ml-2 font-semibold text-xl' to={ROUTE.ROOT}>
            Study Planner
          </Link>
        </div>
        <div className='flex items-center gap-4'>
          <Dropdown menu={{ items: profileMenu }} trigger={['click']}>
            <Avatar icon={<UserOutlined />} className='bg-blue-600 cursor-pointer' />
          </Dropdown>
        </div>
      </Header>

      <Content className='flex bg-gray-50 p-4 md:p-6 lg:p-8'>
        <Outlet />
      </Content>
    </Layout>
  )
}

export default CommonLayout
