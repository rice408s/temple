package supabase

import (
	"fmt"
	"net/http"
	"time"

	"github.com/Brower/backend/internal/config"
	"github.com/supabase-community/postgrest-go"
)

type Client struct {
	db        *postgrest.Client
	projectID string
	apiKey    string
	httpClient *http.Client
}

func NewClient(cfg *config.SupabaseConfig) (*Client, error) {
	// Supabase REST URL 格式：https://<project_id>.supabase.co/rest/v1
	restUrl := fmt.Sprintf("https://%s.supabase.co/rest/v1", cfg.ProjectID)
	
	// 创建自定义的 HTTP 客户端
	httpClient := &http.Client{
		Timeout: time.Second * 10,
	}

	// 创建 Postgrest 客户端
	client := postgrest.NewClient(restUrl, "", map[string]string{
		"apikey": cfg.ServiceRoleKey,
		"Authorization": "Bearer " + cfg.ServiceRoleKey,
	})

	return &Client{
		db:         client,
		projectID:  cfg.ProjectID,
		apiKey:     cfg.ServiceRoleKey,
		httpClient: httpClient,
	}, nil
}

func (c *Client) DB() *postgrest.Client {
	return c.db
}

// GetAuthURL 返回 Supabase Auth API 的基础 URL
func (c *Client) GetAuthURL() string {
	return fmt.Sprintf("https://%s.supabase.co/auth/v1", c.projectID)
}

// GetAPIKey 返回 API Key
func (c *Client) GetAPIKey() string {
	return c.apiKey
}

// GetHTTPClient 返回 HTTP 客户端
func (c *Client) GetHTTPClient() *http.Client {
	return c.httpClient
} 