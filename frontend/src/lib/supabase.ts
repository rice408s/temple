import { createClient } from '@supabase/supabase-js';
import type { User } from '@/types/auth';

// 从环境变量获取 Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 将 Supabase 用户转换为应用用户模型
export const mapSupabaseUser = (supabaseUser: any): User | null => {
  if (!supabaseUser) return null;

  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: supabaseUser.user_metadata?.full_name || 
          supabaseUser.user_metadata?.name || 
          getEmailUsername(supabaseUser.email),
    avatar_url: supabaseUser.user_metadata?.avatar_url || 
               supabaseUser.user_metadata?.picture || '',
  };
};

// 辅助函数：从邮箱中获取用户名
function getEmailUsername(email: string): string {
  if (!email) return 'User';
  
  const atIndex = email.indexOf('@');
  if (atIndex !== -1) {
    return email.substring(0, atIndex);
  }
  return 'User';
} 