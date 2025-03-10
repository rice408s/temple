-- 为标题添加全文搜索索引
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 创建标题的 GIN 索引用于全文搜索
CREATE INDEX IF NOT EXISTS idx_todos_title_trgm ON todos USING GIN (title gin_trgm_ops);

-- 创建复合索引
CREATE INDEX IF NOT EXISTS idx_todos_completed_created_at ON todos(completed, created_at DESC);

-- 添加表统计信息收集
ALTER TABLE todos ALTER COLUMN title SET STATISTICS 1000;
ANALYZE todos; 