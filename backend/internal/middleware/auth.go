package middleware

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"github.com/Brower/backend/internal/config"
	"github.com/Brower/backend/internal/logger"
	"go.uber.org/zap"
)

// AuthMiddleware 创建一个认证中间件，验证 Supabase JWT 令牌
func AuthMiddleware(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		logger.Info("开始处理认证请求")

		// 打印完整的配置信息
		logger.Info("当前配置信息",
			zap.String("project_id", cfg.Supabase.ProjectID),
			zap.Int("jwt_secret_length", len(cfg.Supabase.JWTSecret)),
			zap.String("jwt_secret_preview", cfg.Supabase.JWTSecret[:10]+"..."),
		)

		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			logger.Error("未提供认证头")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		logger.Info("收到认证头", zap.String("auth_header", authHeader))

		bearerToken := strings.Split(authHeader, " ")
		if len(bearerToken) != 2 || strings.ToLower(bearerToken[0]) != "bearer" {
			logger.Error("认证头格式错误", zap.Strings("token_parts", bearerToken))
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
			c.Abort()
			return
		}

		tokenString := bearerToken[1]
		logger.Info("开始验证令牌",
			zap.String("token_preview", tokenString[:10]+"..."),
			zap.Int("token_length", len(tokenString)),
		)

		// 解析但不验证令牌以检查头部
		token, _, err := jwt.NewParser().ParseUnverified(tokenString, jwt.MapClaims{})
		if err != nil {
			logger.Error("令牌解析失败", zap.Error(err))
			c.JSON(http.StatusUnauthorized, gin.H{"error": fmt.Sprintf("Failed to parse token: %v", err)})
			c.Abort()
			return
		}

		// 打印令牌头部信息
		logger.Info("令牌头部信息",
			zap.Any("alg", token.Header["alg"]),
			zap.Any("typ", token.Header["typ"]),
			zap.Any("kid", token.Header["kid"]),
		)

		// 验证令牌
		validToken, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				logger.Error("意外的签名方法", zap.String("alg", fmt.Sprintf("%v", token.Header["alg"])))
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			logger.Info("使用 JWT Secret 验证令牌",
				zap.String("secret_length", fmt.Sprintf("%d", len(cfg.Supabase.JWTSecret))),
				zap.String("secret_preview", cfg.Supabase.JWTSecret[:10]+"..."),
			)
			return []byte(cfg.Supabase.JWTSecret), nil
		})

		if err != nil {
			logger.Error("令牌验证失败",
				zap.Error(err),
				zap.String("error_type", fmt.Sprintf("%T", err)),
			)
			c.JSON(http.StatusUnauthorized, gin.H{"error": fmt.Sprintf("Invalid token: %v", err)})
			c.Abort()
			return
		}

		if claims, ok := validToken.Claims.(jwt.MapClaims); ok && validToken.Valid {
			logger.Info("令牌验证成功，检查 claims",
				zap.Any("iss", claims["iss"]),
				zap.Any("sub", claims["sub"]),
				zap.Any("aud", claims["aud"]),
				zap.Any("exp", claims["exp"]),
			)
			if sub, ok := claims["sub"].(string); ok {
				logger.Info("成功提取用户 ID", zap.String("user_id", sub))
				c.Set("user_id", sub)
				c.Next()
				return
			}
		}

		logger.Error("无效的令牌声明")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		c.Abort()
	}
}
