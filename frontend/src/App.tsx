import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { ThemeProvider } from './components/theme/theme-provider'
import './App.css'

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="todo-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
