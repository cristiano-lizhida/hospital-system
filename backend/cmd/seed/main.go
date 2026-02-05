// 仅用来生成测试账号！！！
package main

import (
	"hospital-system/internal/database"
	"hospital-system/internal/model"
	"log"
)

func main() {
	// 1. 初始化数据库 (确保路径与 config.yaml 一致)
	database.InitDB("./storage/db/hospital.db")

	// 2. 创建测试账号列表
	users := []model.User{
		{Username: "admin", Password: "admin123", Role: "global_admin", OrgID: 1},
		{Username: "doc001", Password: "password123", Role: "doctor", OrgID: 1},
		{Username: "money", Password: "password123", Role: "finance", OrgID: 1},
	}

	for _, u := range users {
		// BeforeCreate 会自动处理密码加密
		if err := database.DB.Create(&u).Error; err != nil {
			log.Printf("用户 %s 已存在或创建失败: %v", u.Username, err)
		} else {
			log.Printf("成功创建用户: %s (角色: %s)", u.Username, u.Role)
		}
	}
}
