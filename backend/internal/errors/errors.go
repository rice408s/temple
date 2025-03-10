package errors

import (
	"fmt"
	"net/http"
)

// ErrorCode 定义错误码类型
type ErrorCode int

const (
	// 系统级错误码 (1000-1999)
	ErrInternal ErrorCode = 1000 + iota
	ErrInvalidParams
	ErrUnauthorized
	ErrForbidden
	ErrNotFound
	ErrTimeout
	ErrTooManyRequests
	
	// 业务级错误码 (2000-2999)
	ErrTodoNotFound ErrorCode = 2000 + iota
	ErrTodoAlreadyExists
	ErrInvalidTodoStatus
)

// Error 自定义错误类型
type Error struct {
	Code    ErrorCode   `json:"code"`    // 错误码
	Message string      `json:"message"` // 错误消息
	Err     error      `json:"-"`       // 原始错误
	Data    any        `json:"data,omitempty"` // 附加数据
}

// 错误码与HTTP状态码的映射
var errorHTTPStatusMap = map[ErrorCode]int{
	ErrInternal:         http.StatusInternalServerError,
	ErrInvalidParams:    http.StatusBadRequest,
	ErrUnauthorized:     http.StatusUnauthorized,
	ErrForbidden:        http.StatusForbidden,
	ErrNotFound:         http.StatusNotFound,
	ErrTimeout:          http.StatusGatewayTimeout,
	ErrTooManyRequests:  http.StatusTooManyRequests,
	ErrTodoNotFound:     http.StatusNotFound,
	ErrTodoAlreadyExists: http.StatusConflict,
	ErrInvalidTodoStatus: http.StatusBadRequest,
}

// 错误码消息映射
var errorMessageMap = map[ErrorCode]string{
	ErrInternal:         "内部服务器错误",
	ErrInvalidParams:    "无效的参数",
	ErrUnauthorized:     "未授权",
	ErrForbidden:        "禁止访问",
	ErrNotFound:         "资源未找到",
	ErrTimeout:          "请求超时",
	ErrTooManyRequests:  "请求过于频繁",
	ErrTodoNotFound:     "待办事项未找到",
	ErrTodoAlreadyExists: "待办事项已存在",
	ErrInvalidTodoStatus: "无效的待办事项状态",
}

func (e *Error) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("错误码: %d, 消息: %s, 原因: %s", e.Code, e.Message, e.Err.Error())
	}
	return fmt.Sprintf("错误码: %d, 消息: %s", e.Code, e.Message)
}

// New 创建新的错误
func New(code ErrorCode, err error) *Error {
	return &Error{
		Code:    code,
		Message: errorMessageMap[code],
		Err:     err,
	}
}

// NewWithMessage 创建带自定义消息的错误
func NewWithMessage(code ErrorCode, message string) *Error {
	return &Error{
		Code:    code,
		Message: message,
	}
}

// NewWithData 创建带附加数据的错误
func NewWithData(code ErrorCode, data any) *Error {
	return &Error{
		Code:    code,
		Message: errorMessageMap[code],
		Data:    data,
	}
}

// GetHTTPStatus 获取对应的HTTP状态码
func (e *Error) GetHTTPStatus() int {
	if status, ok := errorHTTPStatusMap[e.Code]; ok {
		return status
	}
	return http.StatusInternalServerError
}

// IsNotFound 判断是否为未找到错误
func IsNotFound(err error) bool {
	if e, ok := err.(*Error); ok {
		return e.Code == ErrNotFound || e.Code == ErrTodoNotFound
	}
	return false
}

// IsInvalidParams 判断是否为参数无效错误
func IsInvalidParams(err error) bool {
	if e, ok := err.(*Error); ok {
		return e.Code == ErrInvalidParams
	}
	return false
} 