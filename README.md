# Go Gin + React TypeScript + Tailwind CSS 项目

这是一个使用 Go Gin 作为后端，React TypeScript 和 Tailwind CSS 作为前端的全栈应用示例。

## 项目结构

```
.
├── backend/                     # Go Gin 后端
│   ├── cmd/                     # 主要的应用程序入口
│   ├── config/                  # 配置文件
│   │   ├── config.yaml          # 主配置文件
│   │   └── config.default.yaml  # 默认配置文件
│   ├── internal/                # 内部包
│   │   ├── config/              # 配置加载器
│   │   ├── errors/              # 错误定义和处理
│   │   ├── models/              # 数据模型定义
│   │   ├── repository/          # 数据访问层
│   │   ├── service/             # 业务逻辑层
│   │   ├── handler/             # HTTP 处理器层
│   │   ├── middleware/          # 中间件
│   │   └── logger/              # 日志工具
│   └── pkg/                     # 可以被外部应用程序使用的库代码
└── frontend/                    # React TypeScript 前端
    ├── src/                     # 源代码
    │   ├── assets/             # 静态资源文件
    │   ├── components/         # React 组件
    │   │   ├── ui/            # 基础UI组件
    │   │   └── common/        # 业务通用组件
    │   ├── hooks/             # 自定义 Hooks
    │   ├── config/            # 配置文件
    │   ├── layouts/           # 布局组件
    │   ├── routes/            # 路由配置
    │   ├── services/          # API 服务层
    │   │   ├── api/          # API 接口定义
    │   │   ├── http/         # HTTP 客户端配置
    │   │   └── types/        # 接口类型定义
    │   ├── stores/           # 状态管理 (Zustand)
    │   ├── types/            # 全局类型定义
    │   ├── utils/            # 工具函数
    │   ├── locales/          # 国际化资源文件
    │   │   ├── zh/          # 中文翻译
    │   │   └── en/          # 英文翻译
    │   └── pages/            # 页面组件
    ├── public/                # 静态资源
    └── tests/                # 测试文件
```

## 后端架构

后端采用清晰的三层架构：

1. **Handler Layer（处理器层）**：
   - 处理 HTTP 请求和响应
   - 参数验证和绑定
   - 统一的错误处理和响应格式
   - 路由注册和中间件配置

2. **Service Layer（服务层）**：
   - 实现核心业务逻辑
   - 事务管理
   - 数据验证和转换
   - 调用一个或多个 Repository

3. **Repository Layer（仓库层）**：
   - 数据访问和持久化
   - 实现数据库操作
   - 缓存管理
   - 数据映射

同时包含以下支持层：

4. **Config Layer（配置层）**：使用 Viper 管理应用配置
5. **Logger Layer（日志层）**：使用 Zap 提供结构化日志
6. **Error Layer（错误层）**：统一的错误定义和处理机制

这种架构遵循依赖规则：外层可以依赖内层，但内层不应该知道外层的存在。

## 前端架构

前端采用清晰的分层架构和单向数据流模式：

1. **Pages Layer（页面层）**：
   - 路由级别的组件
   - 负责数据聚合和状态管理
   - 调用 Hooks 和 Services

2. **Components Layer（组件层）**：
   - UI 组件：纯展示，无业务逻辑
   - 容器组件：包含业务逻辑和状态
   - 布局组件：页面布局结构

3. **Hooks Layer（钩子层）**：
   - 状态管理逻辑
   - 副作用处理
   - 业务逻辑复用

4. **Services Layer（服务层）**：
   - API 接口封装
   - HTTP 客户端配置
   - 数据转换和处理

5. **Stores Layer（状态层）**：
   - 使用 Zustand 进行状态管理
   - 处理全局共享状态
   - 异步操作和数据缓存

6. **I18n Layer（国际化层）**：
   - 使用 i18next 进行国际化
   - 支持多语言切换
   - 翻译资源管理
   - 语言检测和回退

## 配置管理

项目使用 [Viper](https://github.com/spf13/viper) 进行配置管理，支持以下特性：

- YAML 配置文件
- 环境变量覆盖（使用 `APP_` 前缀）
- 默认配置文件作为备份

主要配置项包括：

- 服务器设置（端口、主机、模式）
- CORS 设置（允许的源、方法、头部）
- 数据库设置（Supabase 配置）
- 日志设置（级别、编码、输出路径）
- 国际化设置（默认语言、支持的语言等）

## 日志系统

项目使用 [Zap](https://github.com/uber-go/zap) 进行日志记录，具有以下特点：

- 高性能结构化日志
- 支持多种日志级别（debug、info、warn、error 等）
- 支持多种输出格式（console、json）
- 支持多个输出目标（控制台、文件）
- 提供了简洁的 API（Sugar）和高性能 API

日志配置可以在 `config.yaml` 中自定义，包括日志级别、编码方式、输出路径等。

## 国际化支持

项目使用 [i18next](https://www.i18next.com/) 实现国际化，支持以下特性：

- 多语言支持（默认支持中文和英文）
- 命名空间分离（按功能模块划分翻译资源）
- 语言检测（自动检测用户语言）
- 语言切换（动态切换界面语言）
- 翻译缺失处理（使用备选语言）
- 插值和格式化（支持变量替换和数字/日期格式化）

### 翻译资源组织

```
src/locales/
├── zh/                 # 中文翻译
│   ├── common.json     # 通用翻译
│   ├── auth.json      # 认证相关
│   └── todos.json     # 待办事项相关
└── en/                 # 英文翻译
    ├── common.json     # 通用翻译
    ├── auth.json      # 认证相关
    └── todos.json     # 待办事项相关
```

### 使用示例

```tsx
// 在组件中使用
import { useTranslation } from 'react-i18next';

function TodoList() {
  const { t } = useTranslation('todos');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

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

所有请求统一使用 POST 方法：

- `POST /api/todos/list` - 获取所有待办事项
- `POST /api/todos/get/:id` - 获取特定待办事项
- `POST /api/todos/create` - 添加新的待办事项
- `POST /api/todos/update/:id` - 更新待办事项
- `POST /api/todos/toggle/:id` - 切换待办事项的完成状态
- `POST /api/todos/delete/:id` - 删除待办事项

## 技术栈

### 后端
- **框架**：Go, Gin
- **配置管理**：Viper
- **日志**：Zap
- **数据库**：Supabase

### 前端
- **框架**：React 18
- **语言**：TypeScript
- **构建工具**：Vite
- **样式**：Tailwind CSS
- **状态管理**：Zustand
- **路由**：React Router v6
- **HTTP 客户端**：Axios
- **国际化**：i18next, react-i18next

### 开发工具
- **包管理**：Go Modules (后端), pnpm (前端)
- **测试**：Go testing (后端), Jest + Testing Library (前端)
- **代码规范**：golangci-lint (后端), ESLint + Prettier (前端) 