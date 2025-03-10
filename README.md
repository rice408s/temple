# Go Gin + React TypeScript + Tailwind CSS 项目

这是一个使用 Go Gin 作为后端，React TypeScript 和 Tailwind CSS 作为前端的全栈应用示例。

## 项目结构

```
.
├── backend/                     # Go Gin 后端
│   ├── config/                  # 配置文件
│   │   ├── config.yaml          # 主配置文件
│   │   └── config.default.yaml  # 默认配置文件
│   ├── internal/                # 内部包
│   │   ├── config/              # 配置加载器
│   │   ├── domain/              # 领域模型（包含请求和响应结构）
│   │   ├── repository/          # 数据访问层
│   │   ├── service/             # 业务逻辑层
│   │   ├── handler/             # HTTP 处理器层
│   │   ├── middleware/          # 中间件
│   │   └── logger/              # 日志工具
│   └── main.go                  # 主入口文件
└── frontend/                    # React TypeScript 前端
    ├── src/                     # 源代码
    │   ├── components/          # React 组件
    │   ├── hooks/               # 自定义 Hooks
    │   ├── services/            # API 服务
    │   └── types/               # TypeScript 类型定义
    ├── public/                  # 静态资源
    └── ...                      # 其他配置文件
```

## 后端架构

后端采用清晰的分层架构：

1. **Domain Layer（领域层）**：定义业务实体、请求和响应结构
2. **Repository Layer（仓库层）**：负责数据访问和持久化
3. **Service Layer（服务层）**：包含业务逻辑
4. **Handler Layer（处理器层）**：处理 HTTP 请求和响应
5. **Config Layer（配置层）**：使用 Viper 管理应用配置
6. **Logger Layer（日志层）**：使用 Zap 提供结构化日志

这种架构遵循依赖规则：外层可以依赖内层，但内层不应该知道外层的存在。

## 配置管理

项目使用 [Viper](https://github.com/spf13/viper) 进行配置管理，支持以下特性：

- YAML 配置文件
- 环境变量覆盖（使用 `APP_` 前缀）
- 默认配置文件作为备份

主要配置项包括：

- 服务器设置（端口、主机、模式）
- CORS 设置（允许的源、方法、头部）
- 数据库设置（目前使用内存存储）
- 日志设置（级别、编码、输出路径）

## 日志系统

项目使用 [Zap](https://github.com/uber-go/zap) 进行日志记录，具有以下特点：

- 高性能结构化日志
- 支持多种日志级别（debug、info、warn、error 等）
- 支持多种输出格式（console、json）
- 支持多个输出目标（控制台、文件）
- 提供了简洁的 API（Sugar）和高性能 API

日志配置可以在 `config.yaml` 中自定义，包括日志级别、编码方式、输出路径等。

## 后端 (Go Gin)

### 安装依赖

```bash
cd backend
go mod tidy
```

### 运行后端

```bash
cd backend
go run main.go
```

后端服务将在配置文件中指定的地址上运行（默认为 http://localhost:8080）。

## 前端 (React TypeScript + Tailwind CSS)

### 安装依赖

```bash
cd frontend
pnpm install
```

### 运行前端开发服务器

```bash
cd frontend
pnpm dev
```

前端开发服务器将在 http://localhost:5173 上运行。

## API 端点

- `GET /api/todos` - 获取所有待办事项
- `GET /api/todos/:id` - 获取特定待办事项
- `POST /api/todos` - 添加新的待办事项
- `PUT /api/todos/:id` - 更新待办事项
- `PUT /api/todos/:id/toggle` - 切换待办事项的完成状态
- `DELETE /api/todos/:id` - 删除待办事项

## 技术栈

- **后端**：Go, Gin, Viper, Zap
- **前端**：React, TypeScript, Vite, Tailwind CSS
- **包管理**：Go Modules, pnpm 