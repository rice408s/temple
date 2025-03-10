import { LogOut } from 'lucide-react'
import useAuthStore from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface UserInfoProps {
  collapsed?: boolean;
}

export default function UserInfo({ collapsed }: UserInfoProps) {
  const { user, signOut } = useAuthStore()
  const { t } = useTranslation('common')
  const [imageError, setImageError] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (mounted) {
      console.log('UserInfo - 用户数据更新:', {
        user,
        mounted,
        store: useAuthStore.getState()
      })
    }
  }, [user, mounted])

  if (!mounted) return null
  if (!user) return null

  console.log('UserInfo - 渲染:', {
    user,
    imageError,
    'avatar_url 存在': !!user.avatar_url,
    'avatar_url 长度': user.avatar_url?.length,
    'store 状态': useAuthStore.getState()
  })

  const handleSignOut = () => {
    signOut()
  }

  const handleImageError = () => {
    console.log('头像加载失败:', user.avatar_url)
    setImageError(true)
  }

  if (collapsed) {
    return (
      <div className="flex justify-center">
        <Avatar className="h-10 w-10 ring-1 ring-border">
          {user.avatar_url && !imageError ? (
            <AvatarImage 
              src={user.avatar_url} 
              alt={user.name}
              onError={handleImageError}
              onLoad={() => console.log('头像加载成功:', user.avatar_url)}
            />
          ) : null}
          <AvatarFallback className="bg-muted text-muted-foreground">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <div className="flex items-center gap-2 min-w-0">
        <Avatar className="h-8 w-8 ring-1 ring-border">
          {user.avatar_url && !imageError ? (
            <AvatarImage 
              src={user.avatar_url} 
              alt={user.name}
              onError={handleImageError}
              onLoad={() => console.log('头像加载成功:', user.avatar_url)}
            />
          ) : null}
          <AvatarFallback className="bg-muted text-muted-foreground">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="font-medium truncate text-sm text-foreground">{user.name}</span>
          <span className="text-xs text-muted-foreground truncate">{user.email}</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSignOut}
        className={cn(
          "h-8 w-8",
          "hover:bg-destructive/10 hover:text-destructive",
          "dark:bg-accent/50 dark:text-muted-foreground dark:hover:bg-destructive/20 dark:hover:text-destructive",
          "transition-colors duration-200"
        )}
        title={t('auth.signout')}
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
} 