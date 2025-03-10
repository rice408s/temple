import { AuthResponse, User } from '../types/auth';
import { supabase, mapSupabaseUser } from '../lib/supabase';

export const authApi = {
  // Google 登录
  async signInWithGoogle(code: string, redirectUri: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Google 登录失败:', error);
        throw error;
      }
      
      if (!data.session) {
        throw new Error('登录成功但未返回会话信息');
      }
      
      const user = mapSupabaseUser(data.user);
      
      if (!user) {
        throw new Error('登录成功但未能获取用户信息');
      }
      
      return {
        user,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      };
    } catch (error) {
      console.error('Google 登录失败:', error);
      throw error;
    }
  },

  // 刷新令牌
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });
      
      if (error) {
        console.error('刷新令牌失败:', error);
        throw error;
      }
      
      if (!data.session) {
        throw new Error('刷新成功但未返回会话信息');
      }
      
      const user = mapSupabaseUser(data.user);
      
      if (!user) {
        throw new Error('刷新成功但未能获取用户信息');
      }
      
      return {
        user,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      };
    } catch (error) {
      console.error('刷新令牌失败:', error);
      throw error;
    }
  },

  // 获取用户信息
  async getUser(accessToken: string): Promise<User> {
    try {
      // 设置访问令牌
      const { data: { user }, error } = await supabase.auth.getUser(accessToken);
      
      if (error) {
        console.error('获取用户信息失败:', error);
        throw error;
      }
      
      const mappedUser = mapSupabaseUser(user);
      
      if (!mappedUser) {
        throw new Error('获取用户信息失败: 无法解析用户数据');
      }
      
      return mappedUser;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  },
}; 