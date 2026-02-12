package database

import (
	"hospital-system/internal/model"
	"log"
	"os"
	"path/filepath"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB(dbPath string) {
	// 1. 确保数据库目录存在 (实现存算分离)
	dir := filepath.Dir(dbPath)
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		os.MkdirAll(dir, 0755)
	}

	// 2. 连接数据库
	var err error
	DB, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		log.Fatalf("无法连接数据库: %v", err)
	}

	// 3. 开启 WAL 模式，提升并发性能
	DB.Exec("PRAGMA journal_mode=WAL;")

	// 4. 自动迁移表结构 (自动在 SQLite 里建表)
	err = DB.AutoMigrate(
		&model.User{},
		&model.InventoryItem{},
		&model.Patient{},
		&model.Booking{},
		&model.MedicalRecord{},
		&model.Order{},
	)
	if err != nil {
		log.Printf("自动迁移失败: %v", err)
	}

	log.Println("数据库初始化成功，WAL模式已开启")
}
