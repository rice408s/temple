package repository

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/Brower/backend/internal/config"
	"github.com/Brower/backend/internal/logger"
	"github.com/Brower/backend/internal/models"
	"github.com/supabase-community/postgrest-go"
	"go.uber.org/zap"
)

const (
	maxRetries = 3
	retryDelay = 100 * time.Millisecond
)

// SupabaseTodoRepository 是一个使用 Supabase 实现的 TodoRepository
type SupabaseTodoRepository struct {
	client *postgrest.Client
	logger *zap.Logger
}

// NewSupabaseTodoRepository 创建一个新的 SupabaseTodoRepository
func NewSupabaseTodoRepository(cfg *config.Config) (*SupabaseTodoRepository, error) {
	baseURL := fmt.Sprintf("https://%s/rest/v1", cfg.Supabase.BaseURL)
	client := postgrest.NewClient(
		baseURL,
		cfg.Supabase.ServiceRoleKey,
		map[string]string{
			"apikey":          cfg.Supabase.ServiceRoleKey,
			"Authorization":   "Bearer " + cfg.Supabase.ServiceRoleKey,
			"Content-Type":    "application/json",
			"Accept":          "application/json",
			"Accept-Profile":  "public",
			"Content-Profile": "public",
			"Prefer":          "return=representation",
		},
	)

	logger.Info("初始化 Supabase Todo Repository",
		zap.String("baseURL", baseURL),
		zap.String("projectID", cfg.Supabase.ProjectID))

	return &SupabaseTodoRepository{
		client: client,
		logger: logger.Log.With(zap.String("component", "SupabaseTodoRepository")),
	}, nil
}

// withRetry 包装一个操作，添加重试机制
func (r *SupabaseTodoRepository) withRetry(operation string, fn func() error) error {
	var lastErr error
	for i := 0; i < maxRetries; i++ {
		if i > 0 {
			logger.Warn("操作重试",
				zap.String("operation", operation),
				zap.Int("attempt", i+1),
				zap.Error(lastErr),
			)
			time.Sleep(retryDelay * time.Duration(i))
		}

		err := fn()
		if err == nil {
			return nil
		}
		lastErr = err
	}
	return fmt.Errorf("%s: 重试%d次后失败: %w", operation, maxRetries, lastErr)
}

// List 获取指定用户的所有待办事项
func (r *SupabaseTodoRepository) List(userID string) ([]models.Todo, error) {
	r.logger.Info("获取待办事项列表", zap.String("userID", userID))

	var todos []*models.Todo
	data, _, err := r.client.From("todos").
		Select("*", "", false).
		Filter("user_id", "eq", userID).
		Order("created_at", &postgrest.OrderOpts{Ascending: false}).
		Execute()
	if err != nil {
		return nil, fmt.Errorf("获取待办事项列表失败: %w", err)
	}

	if err := json.Unmarshal(data, &todos); err != nil {
		return nil, fmt.Errorf("解析待办事项列表失败: %w", err)
	}

	// 转换为非指针切片
	result := make([]models.Todo, len(todos))
	for i, todo := range todos {
		result[i] = *todo
	}

	return result, nil
}

// Get 获取指定用户的单个待办事项
func (r *SupabaseTodoRepository) Get(userID string, id string) (*models.Todo, error) {
	r.logger.Info("获取待办事项",
		zap.String("userID", userID),
		zap.String("id", id))

	var todos []*models.Todo
	data, _, err := r.client.From("todos").
		Select("*", "", false).
		Filter("id", "eq", id).
		Filter("user_id", "eq", userID).
		Execute()
	if err != nil {
		return nil, fmt.Errorf("获取待办事项失败: %w", err)
	}

	if err := json.Unmarshal(data, &todos); err != nil {
		return nil, fmt.Errorf("解析待办事项失败: %w", err)
	}

	if len(todos) == 0 {
		return nil, fmt.Errorf("待办事项不存在")
	}

	return todos[0], nil
}

// Create 创建一个新的待办事项
func (r *SupabaseTodoRepository) Create(userID string, todo *models.Todo) error {
	r.logger.Info("创建待办事项",
		zap.String("userID", userID),
		zap.String("title", todo.Title))

	todo.UserID = userID

	// 使用下划线命名的时间字段
	now := time.Now()
	todoData := map[string]interface{}{
		"user_id":    todo.UserID,
		"title":      todo.Title,
		"completed":  todo.Completed,
		"created_at": now,
		"updated_at": now,
	}

	data, _, err := r.client.From("todos").
		Insert(todoData, false, "", "", "").
		Execute()
	if err != nil {
		return fmt.Errorf("创建待办事项失败: %w", err)
	}

	var created []*models.Todo
	if err := json.Unmarshal(data, &created); err != nil {
		return fmt.Errorf("解析创建结果失败: %w", err)
	}

	if len(created) > 0 {
		*todo = *created[0]
	}

	return nil
}

// Update 更新待办事项
func (r *SupabaseTodoRepository) Update(userID string, todo *models.Todo) error {
	r.logger.Info("更新待办事项",
		zap.String("userID", userID),
		zap.String("id", todo.ID),
		zap.String("title", todo.Title))

	todoData := map[string]interface{}{
		"title":      todo.Title,
		"completed":  todo.Completed,
		"updated_at": time.Now(),
	}

	data, _, err := r.client.From("todos").
		Update(todoData, "", "").
		Filter("id", "eq", todo.ID).
		Filter("user_id", "eq", userID).
		Execute()
	if err != nil {
		return fmt.Errorf("更新待办事项失败: %w", err)
	}

	var updated []*models.Todo
	if err := json.Unmarshal(data, &updated); err != nil {
		return fmt.Errorf("解析更新结果失败: %w", err)
	}

	if len(updated) == 0 {
		return fmt.Errorf("待办事项不存在或无权限更新")
	}

	*todo = *updated[0]
	return nil
}

// Toggle 切换待办事项的完成状态
func (r *SupabaseTodoRepository) Toggle(userID string, id string) error {
	r.logger.Info("切换待办事项状态",
		zap.String("userID", userID),
		zap.String("id", id))

	var todos []*models.Todo
	data, _, err := r.client.From("todos").
		Select("*", "", false).
		Filter("id", "eq", id).
		Filter("user_id", "eq", userID).
		Execute()
	if err != nil {
		return fmt.Errorf("获取待办事项失败: %w", err)
	}

	if err := json.Unmarshal(data, &todos); err != nil {
		return fmt.Errorf("解析待办事项失败: %w", err)
	}

	if len(todos) == 0 {
		return fmt.Errorf("待办事项不存在或无权限更新")
	}

	todo := todos[0]
	todoData := map[string]interface{}{
		"completed":  !todo.Completed,
		"updated_at": time.Now(),
	}

	data, _, err = r.client.From("todos").
		Update(todoData, "", "").
		Filter("id", "eq", id).
		Filter("user_id", "eq", userID).
		Execute()
	if err != nil {
		return fmt.Errorf("更新待办事项状态失败: %w", err)
	}

	return nil
}

// Delete 删除待办事项
func (r *SupabaseTodoRepository) Delete(userID string, id string) error {
	r.logger.Info("删除待办事项",
		zap.String("userID", userID),
		zap.String("id", id))

	data, _, err := r.client.From("todos").
		Delete("", "").
		Filter("id", "eq", id).
		Filter("user_id", "eq", userID).
		Execute()
	if err != nil {
		return fmt.Errorf("删除待办事项失败: %w", err)
	}

	var deleted []*models.Todo
	if err := json.Unmarshal(data, &deleted); err != nil {
		return fmt.Errorf("解析删除结果失败: %w", err)
	}

	if len(deleted) == 0 {
		return fmt.Errorf("待办事项不存在或无权限删除")
	}

	return nil
}
