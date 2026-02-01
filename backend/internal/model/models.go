package model

import (
	"time"

	"gorm.io/gorm"
)

// User 用户表
type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Username  string         `gorm:"unique;not null" json:"username"`
	Password  string         `gorm:"not null" json:"-"`    // 不参与 JSON 序列化
	Role      string         `gorm:"not null" json:"role"` // admin, doctor, cashier
	OrgID     uint           `json:"org_id"`               // 所属机构ID
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// Medicine 药品表 (物资管理核心)
type Medicine struct {
	ID    uint    `gorm:"primaryKey" json:"id"`
	Name  string  `gorm:"not null" json:"name"`
	Price float64 `json:"price"`
	Stock int     `json:"stock"`
	OrgID uint    `json:"org_id"`
}
