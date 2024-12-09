import { RouterProvider } from 'react-router-dom'

import { router } from './routers/router'

const App = (): React.ReactElement => {
  console.log('App4')
  return <RouterProvider router={router} />
}

export default App
