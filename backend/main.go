package main

import (
	"github.com/Brower/backend/internal/config"
	"github.com/Brower/backend/internal/handler"
	"github.com/Brower/backend/internal/logger"
	"github.com/Brower/backend/internal/middleware"
	"github.com/Brower/backend/internal/repository"
	"github.com/Brower/backend/internal/service"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func main() {
	// 加载配置
	cfg, err := config.LoadConfig("./config")
	if err != nil {
		panic("无法加载配置: " + err.Error())
	}

	// 初始化日志
	if err := logger.InitLogger(cfg); err != nil {
		panic("无法初始化日志: " + err.Error())
	}
	defer logger.Log.Sync()

	logger.Info("应用启动", zap.String("环境", cfg.Server.Mode))

	// 设置 Gin 模式
	gin.SetMode(cfg.Server.Mode)

	// 初始化 Gin 引擎
	r := gin.New()

	// 添加中间件
	r.Use(gin.Recovery())            // 恢复中间件
	r.Use(middleware.ErrorHandler()) // 错误处理中间件
	r.Use(middleware.CORS(cfg))      // CORS 中间件

	// 添加健康检查路由，不需要认证
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "服务器正常运行",
		})
	})

	// 初始化仓储层
	todoRepo, err := repository.NewSupabaseTodoRepository(cfg)
	if err != nil {
		logger.Fatal("无法初始化 Todo 仓储层", zap.Error(err))
	}

	// 初始化服务层
	todoService := service.NewTodoService(todoRepo)

	// 初始化处理器
	todoHandler := handler.NewTodoHandler(todoService)

	// 创建 API 路由组，应用认证中间件
	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware(cfg)) // 添加认证中间件

	// 注册路由
	todoHandler.RegisterRoutes(api)

	// 启动服务器
	logger.Infof("服务器启动在 %s", cfg.GetServerAddress())
	if err := r.Run(cfg.GetServerAddress()); err != nil {
		logger.Fatal("服务器启动失败", zap.Error(err))
	}
}
