package config

import (
	"fmt"
	"strings"

	"github.com/spf13/viper"
)

// Config 应用程序配置
type Config struct {
	Server   ServerConfig   `mapstructure:"server"`
	CORS     CORSConfig     `mapstructure:"cors"`
	Database DatabaseConfig `mapstructure:"database"`
	Supabase SupabaseConfig `mapstructure:"supabase"`
	Logger   LoggerConfig   `mapstructure:"logger"`
}

// ServerConfig 服务器配置
type ServerConfig struct {
	Port int    `mapstructure:"port"`
	Host string `mapstructure:"host"`
	Mode string `mapstructure:"mode"`
}

// CORSConfig CORS 配置
type CORSConfig struct {
	AllowedOrigins []string `mapstructure:"allowed_origins"`
	AllowedMethods []string `mapstructure:"allowed_methods"`
	AllowedHeaders []string `mapstructure:"allowed_headers"`
}

// DatabaseConfig 数据库配置
type DatabaseConfig struct {
	Driver   string `mapstructure:"driver"`
	Host     string `mapstructure:"host"`
	Port     int    `mapstructure:"port"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
	DBName   string `mapstructure:"dbname"`
}

// LoggerConfig 日志配置
type LoggerConfig struct {
	Level            string         `mapstructure:"level"`
	Encoding         string         `mapstructure:"encoding"`
	OutputPaths      []string       `mapstructure:"output_paths"`
	ErrorOutputPaths []string       `mapstructure:"error_output_paths"`
	EncodingConfig   EncodingConfig `mapstructure:"encoding_config"`
	File             string         `mapstructure:"file"`
}

// EncodingConfig 日志编码配置
type EncodingConfig struct {
	MessageKey      string `mapstructure:"message_key"`
	LevelKey        string `mapstructure:"level_key"`
	TimeKey         string `mapstructure:"time_key"`
	NameKey         string `mapstructure:"name_key"`
	CallerKey       string `mapstructure:"caller_key"`
	StacktraceKey   string `mapstructure:"stacktrace_key"`
	LineEnding      string `mapstructure:"line_ending"`
	TimeEncoder     string `mapstructure:"time_encoder"`
	DurationEncoder string `mapstructure:"duration_encoder"`
	CallerEncoder   string `mapstructure:"caller_encoder"`
}

// LoadConfig 加载配置
func LoadConfig(path string) (*Config, error) {
	v := viper.New()

	// 设置配置文件路径
	v.AddConfigPath(path)
	v.SetConfigName("config")
	v.SetConfigType("yaml")

	// 设置环境变量前缀
	v.SetEnvPrefix("APP")
	v.AutomaticEnv()
	v.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	// 读取配置文件
	if err := v.ReadInConfig(); err != nil {
		// 如果找不到配置文件，尝试加载默认配置
		v.SetConfigName("config.default")
		if err := v.ReadInConfig(); err != nil {
			return nil, fmt.Errorf("无法读取配置文件: %w", err)
		}
	}

	var config Config
	if err := v.Unmarshal(&config); err != nil {
		return nil, fmt.Errorf("无法解析配置: %w", err)
	}

	return &config, nil
}

// GetServerAddress 获取服务器地址
func (c *Config) GetServerAddress() string {
	return fmt.Sprintf("%s:%d", c.Server.Host, c.Server.Port)
}
