package main

import (
	"hospital-system/internal/api"
	"hospital-system/internal/api/middleware"
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

	// 1. 公开接口：登录
	r.POST("/api/v1/login", api.LoginHandler)

	// 2. 受保护接口组 (必须携带有效 JWT)
	dash := r.Group("/api/v1/dashboard")
	dash.Use(middleware.AuthMiddleware()) // 先全局验证 Token
	{
		// --- 挂号员 & 管理员 专属 ---
		booking := dash.Group("/bookings")
		booking.Use(middleware.RoleMiddleware("registrar", "admin"))
		{
			booking.GET("/", api.GetBookings)
			booking.POST("/", api.CreateBooking)
		}

		// --- 财务 & 管理员 专属 ---
		finance := dash.Group("/finance")
		finance.Use(middleware.RoleMiddleware("cashier", "admin"))
		{
			finance.GET("/orders", api.GetUnpaidOrders)
			finance.POST("/pay", api.ConfirmPayment)
		}

		// --- 医生 & 管理员 专属 ---
		doctor := dash.Group("/doctor")
		doctor.Use(middleware.RoleMiddleware("doctor", "admin"))
		{
			doctor.GET("/patients", api.GetPendingPatients)
			doctor.POST("/records", api.SubmitMedicalRecord)
		}

		// --- 物资管理 (分级控制) ---
		store := dash.Group("/storehouse")
		{
			// 只有仓库和管理员能录入，医生只能看
			store.GET("/", middleware.RoleMiddleware("doctor", "storekeeper", "admin"), api.GetInventory)
			store.POST("/", middleware.RoleMiddleware("storekeeper", "admin"), api.AddMedicine)
		}

		// --- 系统管理 (仅限管理员) ---
		admin := dash.Group("/users")
		admin.Use(middleware.RoleMiddleware("admin"))
		{
			admin.POST("/manage", api.ManageUserStatus)
		}
	}
	r.Run(":8080")
}
