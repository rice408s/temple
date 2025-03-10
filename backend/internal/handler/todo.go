package handler

import (
	"net/http"

	"github.com/Brower/backend/internal/logger"
	"github.com/Brower/backend/internal/models"
	"github.com/Brower/backend/internal/service"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// TodoService 定义了Todo服务的接口
type TodoService interface {
	GetAll() ([]models.Todo, error)
	GetByID(id string) (*models.Todo, error)
	Create(req models.CreateTodoRequest) (*models.Todo, error)
	Update(id string, req models.UpdateTodoRequest) (*models.Todo, error)
	Toggle(id string) (*models.Todo, error)
	Delete(id string) error
}

// TodoHandler 处理Todo相关的HTTP请求
type TodoHandler struct {
	service service.TodoService
}

// Response 统一的响应结构
type Response struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

func NewTodoHandler(service service.TodoService) *TodoHandler {
	return &TodoHandler{
		service: service,
	}
}

// RegisterRoutes 注册路由
func (h *TodoHandler) RegisterRoutes(r gin.IRouter) {
	todos := r.Group("/todos")
	{
		todos.POST("/list", h.List)
		todos.POST("/get/:id", h.Get)
		todos.POST("/create", h.Create)
		todos.POST("/update/:id", h.Update)
		todos.POST("/toggle/:id", h.Toggle)
		todos.POST("/delete/:id", h.Delete)
	}
}

// getUserID 从上下文中获取用户 ID
func (h *TodoHandler) getUserID(c *gin.Context) (string, bool) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "未授权访问"})
		return "", false
	}

	userIDStr, ok := userID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "用户 ID 类型错误"})
		return "", false
	}

	return userIDStr, true
}

// List 获取所有待办事项
func (h *TodoHandler) List(c *gin.Context) {
	userID, ok := h.getUserID(c)
	if !ok {
		return
	}

	todos, err := h.service.List(userID)
	if err != nil {
		logger.Error("获取待办事项列表失败", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": todos})
}

// Get 获取单个待办事项
func (h *TodoHandler) Get(c *gin.Context) {
	userID, ok := h.getUserID(c)
	if !ok {
		return
	}

	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "缺少 ID 参数"})
		return
	}

	todo, err := h.service.Get(userID, id)
	if err != nil {
		logger.Error("获取待办事项失败", zap.String("id", id), zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, todo)
}

// Create 创建待办事项
func (h *TodoHandler) Create(c *gin.Context) {
	userID, ok := h.getUserID(c)
	if !ok {
		return
	}

	var req models.CreateTodoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求参数"})
		return
	}

	todo, err := h.service.Create(userID, req)
	if err != nil {
		logger.Error("创建待办事项失败", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, todo)
}

// Update 更新待办事项
func (h *TodoHandler) Update(c *gin.Context) {
	userID, ok := h.getUserID(c)
	if !ok {
		return
	}

	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "缺少 ID 参数"})
		return
	}

	var req models.UpdateTodoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求参数"})
		return
	}

	todo, err := h.service.Update(userID, id, req)
	if err != nil {
		logger.Error("更新待办事项失败", zap.String("id", id), zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, todo)
}

// Toggle 切换待办事项状态
func (h *TodoHandler) Toggle(c *gin.Context) {
	userID, ok := h.getUserID(c)
	if !ok {
		return
	}

	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "缺少 ID 参数"})
		return
	}

	todo, err := h.service.Toggle(userID, id)
	if err != nil {
		logger.Error("切换待办事项状态失败", zap.String("id", id), zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, todo)
}

// Delete 删除待办事项
func (h *TodoHandler) Delete(c *gin.Context) {
	userID, ok := h.getUserID(c)
	if !ok {
		return
	}

	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "缺少 ID 参数"})
		return
	}

	err := h.service.Delete(userID, id)
	if err != nil {
		logger.Error("删除待办事项失败", zap.String("id", id), zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
}
