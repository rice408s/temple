import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  Sheet,
  SheetContent,

  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, ListTodo, Sun, Moon, Home } from "lucide-react"
import { useTheme } from "@/components/theme/theme-provider"
import UserInfo from '../common/UserInfo'

interface SidebarProps {
  className?: string
}

const navItems = [
  {
    title: '全部待办',
    icon: ListTodo,
    href: '/'
  },
  {
    title: '进行中',
    icon: Home,
    href: '/active'
  },
  {
    title: '已完成',
    icon: ListTodo,
    href: '/completed'
  }
]

export function Sidebar({ className }: SidebarProps) {
  const { theme, setTheme } = useTheme()
  
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
          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
          "bg-transparent hover:bg-accent/50 hover:text-accent-foreground",
          "text-muted-foreground transition-colors duration-200",
          "border border-transparent hover:border-border/50"
        )}
      >
        <div className="relative w-4 h-4">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute top-0 h-4 w-4 rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100" />
        </div>
        <span>{theme === "dark" ? "浅色模式" : "深色模式"}</span>
      </Button>
    )
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <div className="flex h-14 items-center border-b px-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Todo App
          </h2>
        </div>
        
        <div className="px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                    "transition-all duration-200 ease-in-out",
                    "hover:bg-accent/50 hover:text-accent-foreground",
                    "border border-transparent hover:border-border/50",
                    isActive 
                      ? "bg-accent/70 text-accent-foreground shadow-sm" 
                      : "text-muted-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t">
        <div className="px-3 py-2">
          <ThemeToggle />
        </div>
        <div className="px-3">
          <UserInfo />
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* 移动端侧边栏 */}
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="fixed left-4 top-4 z-40 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">打开菜单</span>
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className="w-72 p-0"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* 桌面端侧边栏 */}
      <div
        className={cn(
          "fixed left-0 top-0 z-30 hidden h-screen w-72 border-r bg-background",
          "md:block",
          className
        )}
      >
        <SidebarContent />
      </div>
    </>
  )
} 