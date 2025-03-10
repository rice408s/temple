-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 删除现有表（如果存在）
DROP TABLE IF EXISTS todos;

-- 创建 todos 表
CREATE TABLE IF NOT EXISTS todos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_todos_updated_at
    BEFORE UPDATE ON todos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);

-- 重置 RLS 策略
ALTER TABLE todos DISABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 删除现有策略（如果存在）
DROP POLICY IF EXISTS "用户可以查看自己的待办事项" ON todos;
DROP POLICY IF EXISTS "用户可以创建自己的待办事项" ON todos;
DROP POLICY IF EXISTS "用户可以更新自己的待办事项" ON todos;
DROP POLICY IF EXISTS "用户可以删除自己的待办事项" ON todos;

-- 创建 RLS 策略
CREATE POLICY "用户可以查看自己的待办事项"
ON todos FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "用户可以创建自己的待办事项"
ON todos FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的待办事项"
ON todos FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的待办事项"
ON todos FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 授予权限
GRANT ALL ON todos TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 添加一些示例数据（可选）
INSERT INTO todos (user_id, title, completed) VALUES
    ('00000000-0000-0000-0000-000000000000', '学习 Go 语言基础', true),
    ('00000000-0000-0000-0000-000000000000', '实现 Todo 应用后端', true),
    ('00000000-0000-0000-0000-000000000000', '实现 Todo 应用前端', false),
    ('00000000-0000-0000-0000-000000000000', '学习 Supabase', false),
    ('00000000-0000-0000-0000-000000000000', '部署应用', false);

-- 创建评论
COMMENT ON TABLE todos IS 'Todo 应用的待办事项表';
COMMENT ON COLUMN todos.id IS '待办事项的唯一标识符';
COMMENT ON COLUMN todos.user_id IS '待办事项所属的用户 ID';
COMMENT ON COLUMN todos.title IS '待办事项的标题';
COMMENT ON COLUMN todos.completed IS '待办事项是否已完成';
COMMENT ON COLUMN todos.created_at IS '创建时间';
COMMENT ON COLUMN todos.updated_at IS '最后更新时间'; 