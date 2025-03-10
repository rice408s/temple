package middleware

import (
	"github.com/Brower/backend/internal/config"
	"github.com/gin-gonic/gin"
)

// CORS 中间件处理跨域请求
func CORS(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		// 设置允许的源
		origin := c.Request.Header.Get("Origin")
		if origin != "" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		} else {
			c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		}

		// 设置允许的方法
		c.Writer.Header().Set("Access-Control-Allow-Methods", joinStrings(cfg.CORS.AllowedMethods))
		
		// 设置允许的头部
		c.Writer.Header().Set("Access-Control-Allow-Headers", joinStrings(cfg.CORS.AllowedHeaders))
		
		// 允许携带凭证
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		// 处理预检请求
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

// joinStrings 将字符串数组连接为逗号分隔的字符串
func joinStrings(strs []string) string {
	if len(strs) == 0 {
		return ""
	}
	
	result := strs[0]
	for i := 1; i < len(strs); i++ {
		result += ", " + strs[i]
	}
	return result
}
