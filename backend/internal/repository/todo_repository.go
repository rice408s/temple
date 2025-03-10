package repository

import "github.com/Brower/backend/internal/models"

// TodoRepository 定义了待办事项仓库的接口
type TodoRepository interface {
	// List 获取指定用户的所有待办事项
	List(userID string) ([]models.Todo, error)

	// Get 获取指定用户的单个待办事项
	Get(userID, id string) (*models.Todo, error)

	// Create 创建一个新的待办事项
	Create(userID string, todo *models.Todo) error

	// Update 更新待办事项
	Update(userID string, todo *models.Todo) error

	// Toggle 切换待办事项的完成状态
	Toggle(userID, id string) error

	// Delete 删除待办事项
	Delete(userID, id string) error
}

// InMemoryTodoRepository 是一个内存实现的 TodoRepository
type InMemoryTodoRepository struct {
	todos []models.Todo
}

// NewInMemoryTodoRepository 创建一个新的内存 TodoRepository
func NewInMemoryTodoRepository() *InMemoryTodoRepository {
	return &InMemoryTodoRepository{
		todos: []models.Todo{},
	}
}

// List 获取指定用户的所有待办事项
func (r *InMemoryTodoRepository) List(userID string) ([]models.Todo, error) {
	var result []models.Todo
	for _, todo := range r.todos {
		if todo.UserID == userID {
			result = append(result, todo)
		}
	}
	return result, nil
}

// Get 获取指定用户的单个待办事项
func (r *InMemoryTodoRepository) Get(userID, id string) (*models.Todo, error) {
	for _, todo := range r.todos {
		if todo.ID == id && todo.UserID == userID {
			return &todo, nil
		}
	}
	return nil, ErrTodoNotFound
}

// Create 创建一个新的待办事项
func (r *InMemoryTodoRepository) Create(userID string, todo *models.Todo) error {
	todo.UserID = userID
	r.todos = append(r.todos, *todo)
	return nil
}

// Update 更新待办事项
func (r *InMemoryTodoRepository) Update(userID string, todo *models.Todo) error {
	for i, t := range r.todos {
		if t.ID == todo.ID && t.UserID == userID {
			r.todos[i] = *todo
			return nil
		}
	}
	return ErrTodoNotFound
}

// Toggle 切换待办事项的完成状态
func (r *InMemoryTodoRepository) Toggle(userID, id string) error {
	for i, todo := range r.todos {
		if todo.ID == id && todo.UserID == userID {
			r.todos[i].Completed = !r.todos[i].Completed
			return nil
		}
	}
	return ErrTodoNotFound
}

// Delete 删除待办事项
func (r *InMemoryTodoRepository) Delete(userID, id string) error {
	for i, todo := range r.todos {
		if todo.ID == id && todo.UserID == userID {
			r.todos = append(r.todos[:i], r.todos[i+1:]...)
			return nil
		}
	}
	return ErrTodoNotFound
}
