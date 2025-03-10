import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '../types/auth';
import { authApi } from '../services/auth';

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user: User | null) => set({ user }),
      setTokens: (accessToken: string | null, refreshToken: string | null) =>
        set({ accessToken, refreshToken }),
      setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
      setIsLoading: (isLoading: boolean) => set({ isLoading }),

      signIn: async (code: string, redirectUri: string) => {
        try {
          const response = await authApi.signInWithGoogle(code, redirectUri);
          set({
            user: response.user,
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            isAuthenticated: true,
          });
          return response;
        } catch (error) {
          console.error('登录失败:', error);
          throw error;
        }
      },

      refreshAuth: async () => {
        try {
          const state = useAuthStore.getState();
          if (!state.refreshToken) {
            throw new Error('没有刷新令牌');
          }

          const response = await authApi.refreshToken(state.refreshToken);
          set({
            user: response.user,
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            isAuthenticated: true,
          });
          return response;
        } catch (error) {
          console.error('刷新令牌失败:', error);
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      signOut: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      initialize: async () => {
        try {
          set({ isLoading: true });
          const state = useAuthStore.getState();
          
          console.log('初始化认证状态 - 开始:', {
            state,
            hasAccessToken: !!state.accessToken,
            hasRefreshToken: !!state.refreshToken,
            hasUser: !!state.user
          });

          // 如果已经有用户数据，直接恢复状态
          if (state.user && state.accessToken) {
            console.log('发现已存储的用户数据，恢复状态');
            set({
              isAuthenticated: true,
              isLoading: false
            });
            return;
          }

          if (!state.accessToken) {
            if (state.refreshToken) {
              console.log('尝试使用刷新令牌恢复会话');
              await state.refreshAuth();
            } else {
              console.log('没有可用的令牌，初始化完成');
              set({ isLoading: false });
              return;
            }
          }

          console.log('使用访问令牌获取用户信息');
          const user = await authApi.getUser(state.accessToken!);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          console.log('初始化认证状态 - 完成:', {
            user,
            isAuthenticated: true
          });
        } catch (error) {
          console.error('初始化认证状态失败:', error);
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

export default useAuthStore; 