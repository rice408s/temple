import http from '@/services/http';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '@/types/todo';

export const todoApi = {
  // 获取所有待办事项
  async list(): Promise<Todo[]> {
    try {
      const response = await http.post<{ items: Todo[] }>('/api/todos/list');
      return response.data.items;
    } catch (error) {
      console.error('获取待办事项列表失败:', error);
      throw error;
    }
  },

  // 获取单个待办事项
  async get(id: string): Promise<Todo> {
    try {
      const response = await http.post<Todo>(`/api/todos/get/${id}`);
      return response.data;
    } catch (error) {
      console.error(`获取待办事项 ${id} 失败:`, error);
      throw error;
    }
  },

  // 创建待办事项
  async create(data: CreateTodoRequest): Promise<Todo> {
    try {
      const response = await http.post<Todo>('/api/todos/create', data);
      return response.data;
    } catch (error) {
      console.error('创建待办事项失败:', error);
      throw error;
    }
  },

  // 更新待办事项
  async update(id: string, data: UpdateTodoRequest): Promise<Todo> {
    try {
      const response = await http.post<Todo>(`/api/todos/update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`更新待办事项 ${id} 失败:`, error);
      throw error;
    }
  },

  // 切换待办事项状态
  async toggle(id: string): Promise<Todo> {
    try {
      const response = await http.post<Todo>(`/api/todos/toggle/${id}`);
      return response.data;
    } catch (error) {
      console.error(`切换待办事项 ${id} 状态失败:`, error);
      throw error;
    }
  },

  // 删除待办事项
  async delete(id: string): Promise<void> {
    try {
      await http.post(`/api/todos/delete/${id}`);
    } catch (error) {
      console.error(`删除待办事项 ${id} 失败:`, error);
      throw error;
    }
  },
}; 