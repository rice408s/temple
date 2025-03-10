import { useEffect } from 'react';
import useTodoStore from '../stores/todo';

export function useTodos() {
  const todos = useTodoStore(state => state.todos);
  const loading = useTodoStore(state => state.loading);
  const error = useTodoStore(state => state.error);
  const fetchTodos = useTodoStore(state => state.fetchTodos);
  const createTodo = useTodoStore(state => state.createTodo);
  const storeToogleTodo = useTodoStore(state => state.toggleTodo);
  const storeDeleteTodo = useTodoStore(state => state.deleteTodo);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // 为了保持与现有代码的兼容性，我们提供一个 addTodo 函数
  const addTodo = async (title: string) => {
    return await createTodo({ title });
  };

  // 包装 toggleTodo 函数，使其返回 Promise<void>
  const toggleTodo = async (id: string): Promise<void> => {
    await storeToogleTodo(id);
  };

  // 包装 deleteTodo 函数，确保返回 Promise<void>
  const deleteTodo = async (id: string): Promise<void> => {
    await storeDeleteTodo(id);
  };

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo
  };
} 