package config

import (
	"os"

	"gopkg.in/yaml.v3"
)

// Config 对应 config.yaml 的结构
type Config struct {
	Server struct {
		Port int `yaml:"port"`
	} `yaml:"server"`

	Database struct {
		Path string `yaml:"path"`
	} `yaml:"database"`

	Auth struct {
		JwtSecret      string `yaml:"jwt_secret"`
		JwtExpireHours int    `yaml:"jwt_expire_hours"`
	} `yaml:"auth"`
}

var AppConfig *Config

// LoadConfig 读取配置文件
// configPath: 相对路径，例如 "../config.yaml"
func LoadConfig(configPath string) error {
	file, err := os.ReadFile(configPath)
	if err != nil {
		return err
	}

	config := &Config{}
	err = yaml.Unmarshal(file, config)
	if err != nil {
		return err
	}

	AppConfig = config
	return nil
}
