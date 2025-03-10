export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // 方法
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  signIn: (code: string, redirectUri: string) => Promise<AuthResponse>;
  refreshAuth: () => Promise<AuthResponse>;
  signOut: () => void;
  initialize: () => Promise<void>;
} 