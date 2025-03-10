import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleOAuthCallback } from '@/utils/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        await handleOAuthCallback();
        navigate('/', { replace: true });
      } catch (err) {
        console.error('认证回调处理失败:', err);
        setError(err instanceof Error ? err.message : '认证失败，请重试');
      }
    };

    processCallback();
  }, [navigate]);

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
            返回登录页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-xl font-semibold">正在处理登录...</h2>
        <p className="mt-2 text-gray-600">请稍候，正在完成认证流程</p>
      </div>
    </div>
  );
} 