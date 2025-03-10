import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, ListTodo, Sun, Moon, Home, Languages, ChevronLeft, ChevronRight } from "lucide-react"
import { useTheme } from "@/components/theme/theme-provider"
import { useTranslation } from 'react-i18next'
import UserInfo from '../common/UserInfo'
import { useState, useEffect } from 'react'

interface SidebarProps {
  className?: string
  onCollapsedChange?: (collapsed: boolean) => void
}

export function Sidebar({ className, onCollapsedChange }: SidebarProps) {
  const { theme, setTheme } = useTheme()
  const { t, i18n } = useTranslation()
  const [collapsed, setCollapsed] = useState(false)
  
  // 当折叠状态改变时通知父组件
  useEffect(() => {
    onCollapsedChange?.(collapsed);
  }, [collapsed, onCollapsedChange]);
  
  const navItems = [
    {
      title: t('nav.all'),
      icon: ListTodo,
      href: '/'
    },
    {
      title: t('nav.active'),
      icon: Home,
      href: '/active'
    },
    {
      title: t('nav.completed'),
      icon: ListTodo,
      href: '/completed'
    }
  ]

  const ThemeToggle = () => {
    const toggleTheme = () => {
      setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleTheme}
        className={cn(
          "flex items-center h-10 rounded-lg text-sm font-medium",
          collapsed 
            ? "w-10 justify-center p-0" 
            : "w-full px-3",
          "bg-transparent hover:bg-accent hover:text-accent-foreground",
          "dark:bg-accent/50 dark:text-muted-foreground dark:hover:text-foreground",
          "transition-colors duration-200",
          "border border-transparent hover:border-border/50"
        )}
      >
        <div className="relative w-4 h-4 flex-shrink-0">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute top-0 h-4 w-4 rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100" />
        </div>
        {!collapsed && (
          <span className="ml-3 truncate">
            {theme === "dark" 
              ? t('settings.theme.light') 
              : t('settings.theme.dark')
            }
          </span>
        )}
      </Button>
    )
  }

  const LanguageToggle = () => {
    const toggleLanguage = () => {
      const nextLang = i18n.language === 'zh' ? 'en' : 'zh'
      i18n.changeLanguage(nextLang)
    }

    return (
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleLanguage}
        className={cn(
          "flex items-center h-10 rounded-lg text-sm font-medium",
          collapsed 
            ? "w-10 justify-center p-0" 
            : "w-full px-3",
          "bg-transparent hover:bg-accent hover:text-accent-foreground",
          "dark:bg-accent/50 dark:text-muted-foreground dark:hover:text-foreground",
          "transition-colors duration-200",
          "border border-transparent hover:border-border/50"
        )}
      >
        <Languages className="h-4 w-4 flex-shrink-0" />
        {!collapsed && <span className="ml-3 truncate">{i18n.language === 'zh' ? 'English' : '中文'}</span>}
      </Button>
    )
  }

  const SidebarContent = () => (
    <div className={cn(
      "flex flex-col h-full transition-all duration-300",
      collapsed ? "w-[60px]" : "w-[240px]"
    )}>
      <div className={cn(
        "flex h-14 items-center border-b px-3",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <h2 className="text-xl font-semibold tracking-tight truncate">
            {t('app.name')}
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            collapsed ? "w-10 justify-center" : "w-10",
            "h-10",
            "hover:bg-accent hover:text-accent-foreground",
            "dark:bg-accent/50 dark:text-muted-foreground dark:hover:text-foreground",
            "transition-colors duration-200",
            "border border-transparent hover:border-border/50"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center h-10 rounded-lg text-sm font-medium",
                  collapsed 
                    ? "w-10 justify-center" 
                    : "w-full px-3",
                  "transition-all duration-200 ease-in-out",
                  "hover:bg-accent hover:text-accent-foreground",
                  "dark:bg-accent/50 dark:text-muted-foreground dark:hover:text-foreground",
                  "border border-transparent hover:border-border/50",
                  isActive 
                    ? "bg-accent/70 text-accent-foreground dark:bg-accent/60 dark:text-foreground shadow-sm" 
                    : "text-muted-foreground"
                )
              }
              title={collapsed ? item.title : undefined}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span className="ml-3 truncate">{item.title}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto px-3 py-4 space-y-1">
        <ThemeToggle />
        <LanguageToggle />
        <UserInfo collapsed={collapsed} />
      </div>
    </div>
  )

  return (
    <>
      {/* 桌面端侧边栏 */}
      <aside className={cn(
        "fixed left-0 top-0 z-30 hidden h-screen border-r bg-background lg:block",
        className
      )}>
        <SidebarContent />
      </aside>

      {/* 移动端抽屉式侧边栏 */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">{t('nav.menu')}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
} 