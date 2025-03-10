import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import useAuthStore from '@/stores/auth';

// 创建 axios 实例
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 秒超时
});

// 请求拦截器 - 添加认证令牌
http.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // 从 Zustand store 获取当前的访问令牌
    const { accessToken, isAuthenticated } = useAuthStore.getState();

    console.log('HTTP 请求拦截器:', {
      url: config.url,
      method: config.method,
      hasAccessToken: !!accessToken,
      isAuthenticated
    });

    // 如果有访问令牌，添加到请求头
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log('已添加认证令牌到请求头');
    } else {
      console.warn('没有访问令牌可用');
    }

    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理令牌过期
http.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 如果是 401 错误（未授权）且没有重试过
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('收到 401 错误，尝试刷新令牌');
      
      try {
        // 尝试刷新令牌
        const { refreshAuth } = useAuthStore.getState();
        await refreshAuth();
        console.log('令牌刷新成功');
        
        // 获取新的访问令牌
        const { accessToken } = useAuthStore.getState();
        
        // 使用新令牌重新发送请求
        if (accessToken) {
          console.log('使用新令牌重新发送请求');
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return http(originalRequest);
        }
      } catch (refreshError) {
        // 刷新令牌失败，可能需要重新登录
        console.error('刷新令牌失败，需要重新登录', refreshError);
        
        // 清除认证状态
        const { signOut } = useAuthStore.getState();
        signOut();
        
        // 重定向到登录页
        window.location.href = '/login';
      }
    }
    
    // 打印详细错误信息
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
      },
    });
    
    return Promise.reject(error);
  }
);

export default http; 