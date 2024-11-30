import { Button, Result } from 'antd'
import React from 'react'

import { ROUTE } from '@/constants/route.const'

const NotFound: React.FC = () => {
  const goBackHome = (): void => {
    window.location.href = ROUTE.HOME
  }
  return (
    <Result
      status='404'
      title='404'
      subTitle='Not found. Sorry, the page you visited does not exist.'
      extra={
        <Button type='primary' onClick={goBackHome}>
          Về trang chủ
        </Button>
      }
    />
  )
}

export default NotFound
