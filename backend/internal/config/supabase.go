package config

// SupabaseConfig Supabase 配置
type SupabaseConfig struct {
	ProjectID      string `mapstructure:"project_id"`       // 项目 ID
	BaseURL        string `mapstructure:"base_url"`         // 项目 URL（不包含协议）
	ServiceRoleKey string `mapstructure:"service_role_key"` // 服务角色密钥
	AnonKey        string `mapstructure:"anon_key"`         // 匿名密钥
	JWTSecret      string `mapstructure:"jwt_secret"`       // JWT 密钥
}

func (c *Config) GetSupabaseConfig() *SupabaseConfig {
	return &c.Supabase
}
