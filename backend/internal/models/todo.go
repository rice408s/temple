package models

import "time"

// Todo 表示一个待办事项
type Todo struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Title     string    `json:"title" binding:"required"`
	Completed bool      `json:"completed"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// TodoList 表示待办事项列表
type TodoList struct {
	Items []Todo `json:"items"`
}

// CreateTodoRequest 创建待办事项请求
type CreateTodoRequest struct {
	Title     string `json:"title" binding:"required"`
	Completed bool   `json:"completed"`
}

// UpdateTodoRequest 更新待办事项请求
type UpdateTodoRequest struct {
	Title     *string `json:"title"`
	Completed *bool   `json:"completed"`
}

// TodoResponse 待办事项响应
type TodoResponse struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	Completed bool      `json:"completed"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// TodosResponse 多个待办事项的响应
type TodosResponse struct {
	Todos []Todo `json:"todos"`
	Total int    `json:"total"`
}

// ErrorResponse 错误响应
type ErrorResponse struct {
	Error string `json:"error" example:"待办事项不存在"`
}

// NewTodosResponse 创建一个包含多个待办事项的响应
func NewTodosResponse(todos []Todo) TodosResponse {
	return TodosResponse{
		Todos: todos,
		Total: len(todos),
	}
}

// ToResponse 将 Todo 转换为 TodoResponse
func (t *Todo) ToResponse() TodoResponse {
	return TodoResponse{
		ID:        t.ID,
		Title:     t.Title,
		Completed: t.Completed,
		CreatedAt: t.CreatedAt,
		UpdatedAt: t.UpdatedAt,
	}
}

// ToResponseList 将 Todo 列表转换为 TodoResponse 列表
func ToResponseList(todos []Todo) []TodoResponse {
	result := make([]TodoResponse, len(todos))
	for i, todo := range todos {
		result[i] = todo.ToResponse()
	}
	return result
}

// ToTodo 将创建请求转换为 Todo 实体
func (req CreateTodoRequest) ToTodo(id string) Todo {
	return Todo{
		ID:        id,
		Title:     req.Title,
		Completed: req.Completed,
	}
}

// ToTodo 将更新请求转换为 Todo 实体
func (req UpdateTodoRequest) ToTodo(id string) Todo {
	return Todo{
		ID:        id,
		Title:     *req.Title,
		Completed: *req.Completed,
	}
}
