import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function RootLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onCollapsedChange={setSidebarCollapsed} />
      <div className="flex min-h-screen">
        <div className={cn(
          "hidden lg:block shrink-0 transition-all duration-300",
          sidebarCollapsed ? "w-[60px]" : "w-[240px]"
        )}>
          {/* 占位符，与侧边栏宽度相同 */}
        </div>
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 