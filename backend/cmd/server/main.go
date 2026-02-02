package main

import (
	"hospital-system/internal/api"
	"hospital-system/internal/api/middleware"
	"hospital-system/internal/database"
	"hospital-system/internal/model"

	"github.com/gin-gonic/gin"
)

func main() {
	// 1. 初始化数据库
	database.InitDB("./storage/db/hospital.db")

	// --- 自动迁移数据库结构 (重要！为了让新增的表生效) ---
	database.DB.AutoMigrate(
		&model.User{},
		&model.Medicine{},
		&model.Patient{},
		&model.Booking{},
		&model.MedicalRecord{},
		&model.Order{},
	)

	// 2. 初始化 Gin 路由
	r := gin.Default()

	// 基础心跳测试
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	// ==========================================
	// 权限分组与路由配置 (根据架构图实现)
	// ==========================================

	// 1. 公开接口 (Public)
	// 对应图中: /login, /register
	auth := r.Group("/api/v1")
	{
		auth.POST("/login", api.LoginHandler)       // 登录获取 Token
		auth.POST("/register", api.RegisterHandler) // 用户注册 (仅供演示或初始管理员用)
	}

	// 2. 受保护接口组 (Dashboard)
	// 所有 /api/v1/dashboard 下的请求都需要 JWT 认证
	dash := r.Group("/api/v1/dashboard")
	dash.Use(middleware.AuthMiddleware())
	{
		// [Group 1] 挂号业务 (/bookings)
		// 权限: 挂号员 (registrar), 管理员 (admin)
		// 对应图中: /bookings -> 预约就诊相关
		booking := dash.Group("/bookings")
		booking.Use(middleware.RoleMiddleware("registrar", "admin"))
		{
			booking.GET("/", api.GetBookings)    // 列表：显示所有挂号
			booking.POST("/", api.CreateBooking) // 操作：新增挂号
		}

		// [Group 2] 缴费业务 (/payment)
		// 权限: 财务 (cashier), 管理员 (admin)
		// 对应图中: /payment -> 缴费入口
		payment := dash.Group("/payment")
		payment.Use(middleware.RoleMiddleware("cashier", "admin"))
		{
			payment.GET("/", api.GetUnpaidOrders) // 列表：显示所有 Unpaid 订单
			payment.POST("/", api.ConfirmPayment) // 操作：点击“确认收费”
		}

		// [Group 3] 医生工作台 (/doctor)
		// 权限: 医生 (doctor), 管理员 (admin)
		// 对应图中: /doctor -> 医生专用面板
		doctor := dash.Group("/doctor")
		doctor.Use(middleware.RoleMiddleware("doctor", "admin"))
		{
			doctor.GET("/patients", api.GetPendingPatients)  // 左侧：候诊列表 (Status=Pending)
			doctor.POST("/records", api.SubmitMedicalRecord) // 右侧：提交诊断 -> 生成订单
		}

		// [Group 4] 历史病历 (/record)
		// 权限: 医生, 挂号员, 财务 (不同角色视角不同，此处简化为都有权查看)
		// 对应图中: /record -> 展示问诊记录
		record := dash.Group("/record")
		record.Use(middleware.RoleMiddleware("doctor", "registrar", "cashier", "admin"))
		{
			// 这里复用 GetBookings 或单独写查询逻辑，MVP暂复用
			record.GET("/", api.GetBookings)
		}

		// [Group 5] 物资/库房 (/storehouse)
		// 权限: 库管 (storekeeper), 管理员 (admin)
		// 对应图中: /storehouse -> 物资管理
		store := dash.Group("/storehouse")
		{
			// 医生只能看库存，不能改
			store.GET("/", middleware.RoleMiddleware("doctor", "storekeeper", "admin"), api.GetInventory)
			// 只有库管和管理员能进货
			store.POST("/", middleware.RoleMiddleware("storekeeper", "admin"), api.AddMedicine)
		}

		// [Group 6] 用户管理 (/users)
		// 权限: 仅限超级管理员 (admin)
		// 对应图中: /users -> 统一管理账号
		admin := dash.Group("/users")
		admin.Use(middleware.RoleMiddleware("admin"))
		{
			admin.GET("/", api.ManageUserStatus)
		}
	}

	r.Run(":8080")
}
