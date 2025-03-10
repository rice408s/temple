import { create } from 'zustand';
import { todoApi } from '@/services/api/todo';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '@/types/todo';

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: Error | null;

  // 获取所有待办事项
  fetchTodos: () => Promise<void>;
  
  // 获取单个待办事项
  fetchTodo: (id: string) => Promise<Todo | undefined>;
  
  // 创建待办事项
  createTodo: (data: CreateTodoRequest) => Promise<Todo>;
  
  // 更新待办事项
  updateTodo: (id: string, data: UpdateTodoRequest) => Promise<Todo>;
  
  // 切换待办事项状态
  toggleTodo: (id: string) => Promise<Todo>;
  
  // 删除待办事项
  deleteTodo: (id: string) => Promise<void>;
}

const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  loading: false,
  error: null,

  fetchTodos: async () => {
    set({ loading: true, error: null });
    try {
      const todos = await todoApi.list();
      set({ todos, loading: false });
    } catch (error) {
      set({ error: error as Error, loading: false });
    }
  },

  fetchTodo: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const todo = await todoApi.get(id);
      return todo;
    } catch (error) {
      set({ error: error as Error, loading: false });
    } finally {
      set({ loading: false });
    }
  },

  createTodo: async (data: CreateTodoRequest) => {
    set({ loading: true, error: null });
    try {
      const newTodo = await todoApi.create(data);
      set((state) => ({ 
        todos: [...state.todos, newTodo],
        loading: false 
      }));
      return newTodo;
    } catch (error) {
      set({ error: error as Error, loading: false });
      throw error;
    }
  },

  updateTodo: async (id: string, data: UpdateTodoRequest) => {
    set({ loading: true, error: null });
    try {
      const updatedTodo = await todoApi.update(id, data);
      set((state) => ({
        todos: state.todos.map((todo) => 
          todo.id === id ? updatedTodo : todo
        ),
        loading: false
      }));
      return updatedTodo;
    } catch (error) {
      set({ error: error as Error, loading: false });
      throw error;
    }
  },

  toggleTodo: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const updatedTodo = await todoApi.toggle(id);
      set((state) => ({
        todos: state.todos.map((todo) => 
          todo.id === id ? updatedTodo : todo
        ),
        loading: false
      }));
      return updatedTodo;
    } catch (error) {
      set({ error: error as Error, loading: false });
      throw error;
    }
  },

  deleteTodo: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await todoApi.delete(id);
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
}));

export default useTodoStore; 