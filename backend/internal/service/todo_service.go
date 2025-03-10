package service

import (
	"github.com/Brower/backend/internal/models"
	"github.com/Brower/backend/internal/repository"
	"time"
	"github.com/google/uuid"
)

// TodoService 定义了待办事项服务的接口
type TodoService interface {
	// List 获取指定用户的所有待办事项
	List(userID string) ([]models.TodoResponse, error)

	// Get 获取指定用户的单个待办事项
	Get(userID, id string) (*models.TodoResponse, error)

	// Create 创建一个新的待办事项
	Create(userID string, req models.CreateTodoRequest) (*models.TodoResponse, error)

	// Update 更新待办事项
	Update(userID, id string, req models.UpdateTodoRequest) (*models.TodoResponse, error)

	// Toggle 切换待办事项的完成状态
	Toggle(userID, id string) (*models.TodoResponse, error)

	// Delete 删除待办事项
	Delete(userID, id string) error
}

type todoService struct {
	repo repository.TodoRepository
}

// NewTodoService 创建一个新的待办事项服务
func NewTodoService(repo repository.TodoRepository) TodoService {
	return &todoService{
		repo: repo,
	}
}

// List 获取指定用户的所有待办事项
func (s *todoService) List(userID string) ([]models.TodoResponse, error) {
	todos, err := s.repo.List(userID)
	if err != nil {
		return nil, err
	}
	return models.ToResponseList(todos), nil
}

// Get 获取指定用户的单个待办事项
func (s *todoService) Get(userID, id string) (*models.TodoResponse, error) {
	todo, err := s.repo.Get(userID, id)
	if err != nil {
		return nil, err
	}
	response := todo.ToResponse()
	return &response, nil
}

// Create 创建一个新的待办事项
func (s *todoService) Create(userID string, req models.CreateTodoRequest) (*models.TodoResponse, error) {
	now := time.Now()
	todo := &models.Todo{
		ID:        uuid.New().String(),
		UserID:    userID,
		Title:     req.Title,
		Completed: req.Completed,
		CreatedAt: now,
		UpdatedAt: now,
	}

	err := s.repo.Create(userID, todo)
	if err != nil {
		return nil, err
	}

	response := todo.ToResponse()
	return &response, nil
}

// Update 更新待办事项
func (s *todoService) Update(userID, id string, req models.UpdateTodoRequest) (*models.TodoResponse, error) {
	// 先获取现有的待办事项
	existingTodo, err := s.repo.Get(userID, id)
	if err != nil {
		return nil, err
	}

	// 更新字段
	if req.Title != nil {
		existingTodo.Title = *req.Title
	}
	if req.Completed != nil {
		existingTodo.Completed = *req.Completed
	}

	// 保存更新
	err = s.repo.Update(userID, existingTodo)
	if err != nil {
		return nil, err
	}

	response := existingTodo.ToResponse()
	return &response, nil
}

// Toggle 切换待办事项的完成状态
func (s *todoService) Toggle(userID, id string) (*models.TodoResponse, error) {
	// 先获取现有的待办事项
	todo, err := s.repo.Get(userID, id)
	if err != nil {
		return nil, err
	}

	// 切换状态
	todo.Completed = !todo.Completed

	// 保存更新
	err = s.repo.Update(userID, todo)
	if err != nil {
		return nil, err
	}

	response := todo.ToResponse()
	return &response, nil
}

// Delete 删除待办事项
func (s *todoService) Delete(userID, id string) error {
	return s.repo.Delete(userID, id)
}

// generateID 生成一个唯一 ID
func generateID() string {
	return "todo-" + randomString(8)
}

// randomString 生成指定长度的随机字符串
func randomString(n int) string {
	const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, n)
	for i := range b {
		b[i] = letters[i%len(letters)]
	}
	return string(b)
}
