import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleOAuthCallback } from '@/utils/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Callback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation('auth');

  const handleAuth = useCallback(async () => {
    console.log('开始处理认证回调...');
    
    try {
      // 如果 URL 中没有 hash，说明可能是直接访问此页面
      if (!window.location.hash) {
        console.log('未找到认证信息，重定向到登录页');
        navigate('/login', { replace: true });
        return;
      }

      await handleOAuthCallback();
      console.log('认证成功，准备跳转到首页...');
      
      // 使用 setTimeout 确保状态更新后再跳转
      setTimeout(() => {
        console.log('执行跳转操作...');
        navigate('/', { replace: true });
      }, 100);
      
    } catch (error: unknown) {
      console.error('登录失败，错误详情:', error);
      setError(error instanceof Error ? error.message : t('login.error'));
    }
  }, [navigate, t]);

  useEffect(() => {
    handleAuth();
    return () => {
      console.log('Callback 组件卸载');
    };
  }, [handleAuth]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {t('login.back')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-semibold">{t('login.processing')}</h2>
        <p className="text-gray-600">{t('login.verifying')}</p>
      </div>
    </div>
  );
} 