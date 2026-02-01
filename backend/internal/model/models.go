package model

import (
	"time"

	"golang.org/x/crypto/bcrypt"
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

// GeneratePassword 给密码加密
func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

// CheckPassword 验证密码
func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}
