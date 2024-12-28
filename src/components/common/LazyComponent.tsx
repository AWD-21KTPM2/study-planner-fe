import { Spin } from 'antd'
import { ReactNode, Suspense } from 'react'

interface LazyComponentProps {
  children: ReactNode
}

const LazyComponent = ({ children }: LazyComponentProps): JSX.Element => {
  return <Suspense fallback={<Spin fullscreen />}>{children}</Suspense>
}

export default LazyComponent
