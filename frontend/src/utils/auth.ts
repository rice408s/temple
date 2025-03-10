import useAuthStore from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173'
const CALLBACK_URL = `${SITE_URL}/auth/callback`

// 生成随机字符串作为 state
export function generateState(): string {
  const array = new Uint32Array(8);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec => ('0' + dec.toString(16)).slice(-2)).join('');
}

// 保存 state 到 sessionStorage
export function saveState(state: string): void {
  try {
    sessionStorage.setItem('oauth_state', state);
    console.log('State saved:', state);
  } catch (error) {
    console.error('Failed to save state:', error);
  }
}

// 验证 state
export function validateState(state: string | null): boolean {
  try {
    const savedState = sessionStorage.getItem('oauth_state');
    console.log('State validation:', { received: state, stored: savedState });
    sessionStorage.removeItem('oauth_state'); // 使用后立即删除
    return state === savedState;
  } catch (error) {
    console.error('Failed to validate state:', error);
    return false;
  }
}

// 构建 Google OAuth URL
export async function buildGoogleOAuthURL(): Promise<string> {
  console.log('开始构建 OAuth URL...')
  console.log('使用回调 URL:', CALLBACK_URL)
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: CALLBACK_URL,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  });

  if (error) {
    console.error('生成 OAuth URL 失败:', error);
    throw error;
  }

  if (!data.url) {
    throw new Error('未能生成 OAuth URL');
  }

  return data.url;
}

// 处理 OAuth 回调
export async function handleOAuthCallback(): Promise<void> {
  console.log('开始处理 OAuth 回调...')
  console.log('当前 URL:', window.location.href)
  
  try {
    // Supabase 使用 URL 哈希片段（#）而不是查询参数（?）
    // 检查 URL 是否包含 access_token
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    
    console.log('从 URL 哈希中提取的令牌:', {
      hasAccessToken: !!accessToken,
      accessTokenLength: accessToken?.length,
      hasRefreshToken: !!refreshToken,
      refreshTokenLength: refreshToken?.length
    });
    
    if (!accessToken || !refreshToken) {
      console.error('未在 URL 中找到令牌信息');
      throw new Error('未在 URL 中找到令牌信息');
    }
    
    // 直接设置令牌，而不是通过 signIn 方法
    const store = useAuthStore.getState();
    console.log('Auth Store 状态 (设置令牌前):', {
      hasUser: !!store.user,
      hasAccessToken: !!store.accessToken,
      hasRefreshToken: !!store.refreshToken,
      isAuthenticated: store.isAuthenticated
    });
    
    // 获取用户信息
    console.log('开始获取用户信息...');
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.error('获取用户信息失败:', error);
      throw error || new Error('获取用户信息失败');
    }
    
    console.log('获取用户信息成功:', {
      id: user.id,
      email: user.email,
      metadata: user.user_metadata
    });
    
    // 设置认证状态
    store.setTokens(accessToken, refreshToken);
    
    // 从 Supabase 用户创建应用用户
    const appUser = {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.full_name || 
            user.user_metadata?.name || 
            (user.email ? user.email.split('@')[0] : 'User'),
      avatar_url: user.user_metadata?.avatar_url || 
                 user.user_metadata?.picture || '',
    };
    
    store.setUser(appUser);
    store.setIsAuthenticated(true);
    
    console.log('Auth Store 状态 (设置令牌后):', {
      hasUser: !!store.user,
      hasAccessToken: !!store.accessToken,
      hasRefreshToken: !!store.refreshToken,
      isAuthenticated: store.isAuthenticated
    });
    
    console.log('认证成功，会话详情:', {
      user: appUser.email,
      expiresAt: new Date(Date.now() + 3600 * 1000).toLocaleString()
    });
  } catch (error) {
    console.error('处理 OAuth 回调时出错:', error);
    throw error;
  }
} 