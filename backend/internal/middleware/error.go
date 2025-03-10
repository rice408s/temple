package middleware

import (
	"github.com/Brower/backend/internal/errors"
	"github.com/Brower/backend/internal/logger"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"net/http"
)

// ErrorResponse 定义统一的错误响应结构
type ErrorResponse struct {
	Code    int         `json:"code"`    // 错误码
	Message string      `json:"message"` // 错误消息
	Data    any        `json:"data,omitempty"` // 附加数据
}

// ErrorHandler 统一错误处理中间件
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 处理请求
		c.Next()

		// 检查是否有错误
		if len(c.Errors) > 0 {
			// 获取最后一个错误
			err := c.Errors.Last()
			
			// 转换为自定义错误类型
			var response ErrorResponse
			if customErr, ok := err.Err.(*errors.Error); ok {
				response = ErrorResponse{
					Code:    int(customErr.Code),
					Message: customErr.Message,
					Data:    customErr.Data,
				}
				// 设置HTTP状态码
				c.Status(customErr.GetHTTPStatus())
			} else {
				// 处理非自定义错误
				response = ErrorResponse{
					Code:    int(errors.ErrInternal),
					Message: "内部服务器错误",
				}
				c.Status(http.StatusInternalServerError)
			}

			// 记录错误日志
			logger.Error("请求处理错误",
				zap.String("path", c.Request.URL.Path),
				zap.String("method", c.Request.Method),
				zap.Int("code", response.Code),
				zap.String("message", response.Message),
				zap.Error(err.Err),
			)

			c.JSON(c.Writer.Status(), response)
			c.Abort()
		}
	}
} 