import { LogOut } from 'lucide-react'
import useAuthStore from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useState, useEffect } from 'react'

export default function UserInfo() {
  const { user, signOut } = useAuthStore()
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

  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <div className="flex items-center gap-2 min-w-0">
        <Avatar className="h-8 w-8">
          {user.avatar_url && !imageError ? (
            <AvatarImage 
              src={user.avatar_url} 
              alt={user.name}
              onError={handleImageError}
              onLoad={() => console.log('头像加载成功:', user.avatar_url)}
            />
          ) : null}
          <AvatarFallback>
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="font-medium truncate text-sm">{user.name}</span>
          <span className="text-xs text-muted-foreground truncate">{user.email}</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSignOut}
        className="h-8 w-8"
        title="退出登录"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
} 