import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import TodoListPage from '@/pages/todo/TodoList';
import ActiveTodoList from '@/pages/todo/ActiveTodoList';
import CompletedTodoList from '@/pages/todo/CompletedTodoList';
import Login from '@/pages/auth/Login';
import Callback from '@/pages/auth/Callback';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <TodoListPage />,
      },
      {
        path: 'todos',
        element: <Navigate to="/" replace />,
      },
      {
        path: 'active',
        element: <ActiveTodoList />,
      },
      {
        path: 'completed',
        element: <CompletedTodoList />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/auth/callback',
    element: <Callback />,
  },
]); 