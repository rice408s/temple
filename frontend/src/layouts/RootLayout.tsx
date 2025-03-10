import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-h-screen">
        <div className="hidden md:block w-72 shrink-0">
          {/* 占位符，与侧边栏宽度相同 */}
        </div>
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 