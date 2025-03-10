# 数据库迁移文件

这个目录包含了所有的数据库迁移文件，用于在 Supabase 中创建和更新数据库结构。

## 文件说明

1. `001_create_todos_table.sql`
   - 创建 todos 表
   - 设置自动更新时间戳
   - 添加基础索引
   - 创建示例数据
   - 设置 RLS 策略

2. `002_add_indexes.sql`
   - 添加全文搜索支持
   - 创建复合索引
   - 优化查询性能

## 如何使用

1. 登录 Supabase 控制台
2. 进入 SQL 编辑器
3. 按顺序执行这些 SQL 文件
4. 检查执行结果确保无错误

## 数据库结构

### todos 表

| 列名 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键，自动生成 |
| title | TEXT | 待办事项标题 |
| completed | BOOLEAN | 是否完成 |
| created_at | TIMESTAMPTZ | 创建时间 |
| updated_at | TIMESTAMPTZ | 更新时间 |

### 索引

- `idx_todos_completed`: 按完成状态查询
- `idx_todos_created_at`: 按创建时间查询
- `idx_todos_title_trgm`: 标题全文搜索
- `idx_todos_completed_created_at`: 完成状态和创建时间复合索引

### 触发器

- `update_todos_updated_at`: 自动更新 updated_at 时间戳

### RLS 策略

- 允许匿名访问：允许所有用户进行 CRUD 操作 