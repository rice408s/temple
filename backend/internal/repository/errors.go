package repository

import "errors"

// 仓库层错误定义
var (
	ErrTodoNotFound = errors.New("todo not found")
)
