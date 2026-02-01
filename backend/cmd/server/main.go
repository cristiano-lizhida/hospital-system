package main

import (
	"hospital-system/internal/database"

	"github.com/gin-gonic/gin"
)

func main() {
	// 1. 初始化数据库 (指向你架构图中规划的 storage 目录)
	database.InitDB("./storage/db/hospital.db")

	// 2. 初始化 Gin 路由
	r := gin.Default()

	// 最小可行性测试接口
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	r.Run(":8080") // 运行在 8080 端口
}
