package api

import (
	"hospital-system/internal/api/middleware"
	"hospital-system/internal/database"
	"hospital-system/internal/model"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// --- 认证模块 ---

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type RegisterRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Role     string `json:"role" binding:"required"` // registrar, doctor, cashier
}

func LoginHandler(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误"})
		return
	}

	var user model.User
	if err := database.DB.Where("username = ?", req.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "用户不存在"})
		return
	}

	if !user.CheckPassword(req.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "密码错误"})
		return
	}

	// 签发 Token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"org_id":  user.OrgID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(middleware.JwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Token生成失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": tokenString,
		"user":  gin.H{"username": user.Username, "role": user.Role, "id": user.ID},
	})
}

func RegisterHandler(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误"})
		return
	}
	// 创建用户
	user := model.User{
		Username: req.Username,
		Password: req.Password, // BeforeCreate 会自动加密
		Role:     req.Role,
		OrgID:    1, // MVP 默认机构1
	}
	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "注册失败，用户名可能已存在"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"msg": "注册成功"})
}

// --- 挂号业务 (Bookings) ---
// 对应页面：/bookings

type BookingRequest struct {
	PatientName  string `json:"patient_name"`
	PatientPhone string `json:"patient_phone"`
	DoctorID     uint   `json:"doctor_id"`
}

func GetBookings(c *gin.Context) {
	var bookings []model.Booking
	// 简单的连表查询逻辑，这里先返回纯列表
	database.DB.Find(&bookings)
	c.JSON(http.StatusOK, gin.H{"data": bookings})
}

func CreateBooking(c *gin.Context) {
	var req BookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误"})
		return
	}

	// 1. 先简单创建一个患者 (MVP简化逻辑：如果不存在则创建，存在则查找)
	var patient model.Patient
	database.DB.FirstOrCreate(&patient, model.Patient{Name: req.PatientName, Phone: req.PatientPhone})

	// 2. 创建挂号单
	booking := model.Booking{
		PatientID: patient.ID,
		DoctorID:  req.DoctorID,
		Status:    "pending",
	}
	database.DB.Create(&booking)

	c.JSON(http.StatusOK, gin.H{"msg": "挂号成功", "booking_id": booking.ID})
}

// --- 财务业务 (Finance/Payment) ---
// 对应页面：/payment

func GetUnpaidOrders(c *gin.Context) {
	var orders []model.Order
	// 查找所有状态为 Unpaid 的订单
	database.DB.Where("status = ?", "Unpaid").Find(&orders)
	c.JSON(http.StatusOK, gin.H{"data": orders})
}

type PaymentRequest struct {
	OrderID uint `json:"order_id"`
}

func ConfirmPayment(c *gin.Context) {
	var req PaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误"})
		return
	}

	tx := database.DB.Begin() // 开启事务

	// 1. 查找订单
	var order model.Order
	if err := tx.First(&order, req.OrderID).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "订单不存在"})
		return
	}

	if order.Status == "Paid" {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "订单已支付"})
		return
	}

	// 2. 更新订单状态
	if err := tx.Model(&order).Update("status", "Paid").Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新订单失败"})
		return
	}

	// 3. 扣减库存 (如果订单关联了药品)
	if order.MedicineID != 0 {
		var med model.Medicine
		if err := tx.First(&med, order.MedicineID).Error; err == nil {
			if med.Stock >= order.Quantity {
				tx.Model(&med).Update("stock", med.Stock-order.Quantity)
			} else {
				tx.Rollback()
				c.JSON(http.StatusBadRequest, gin.H{"error": "库存不足"})
				return
			}
		}
	}

	tx.Commit()
	c.JSON(http.StatusOK, gin.H{"msg": "支付成功，库存已更新"})
}

// --- 医生业务 (Doctor) ---
// 对应页面：/doctor

func GetPendingPatients(c *gin.Context) {
	var bookings []model.Booking
	// 获取所有“待诊”的挂号
	database.DB.Where("status = ?", "pending").Find(&bookings)
	c.JSON(http.StatusOK, gin.H{"data": bookings})
}

type RecordRequest struct {
	BookingID  uint   `json:"booking_id"`
	Diagnosis  string `json:"diagnosis"`
	MedicineID uint   `json:"medicine_id"` // 开什么药
	Quantity   int    `json:"quantity"`    // 开多少
}

func SubmitMedicalRecord(c *gin.Context) {
	var req RecordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误"})
		return
	}

	tx := database.DB.Begin()

	// 1. 保存病历
	record := model.MedicalRecord{
		BookingID:    req.BookingID,
		Diagnosis:    req.Diagnosis,
		Prescription: "Rx: Medicine " + strconv.Itoa(int(req.MedicineID)),
	}
	tx.Create(&record)

	// 2. 更新挂号状态为已诊
	tx.Model(&model.Booking{}).Where("id = ?", req.BookingID).Update("status", "completed")

	// 3. 计算金额并生成缴费单 (Unpaid)
	var med model.Medicine
	var totalAmount float64 = 0
	if err := tx.First(&med, req.MedicineID).Error; err == nil {
		totalAmount = med.Price * float64(req.Quantity)
	}

	order := model.Order{
		BookingID:   req.BookingID,
		TotalAmount: totalAmount,
		Status:      "Unpaid",
		MedicineID:  req.MedicineID,
		Quantity:    req.Quantity,
	}
	tx.Create(&order)

	tx.Commit()
	c.JSON(http.StatusOK, gin.H{"msg": "诊断完成，已生成缴费单", "order_id": order.ID})
}

// --- 库房业务 (Storehouse) ---
// 对应页面：/storehouse

func GetInventory(c *gin.Context) {
	var meds []model.Medicine
	database.DB.Find(&meds)
	c.JSON(http.StatusOK, gin.H{"data": meds})
}

func AddMedicine(c *gin.Context) {
	var med model.Medicine
	if err := c.ShouldBindJSON(&med); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误"})
		return
	}
	database.DB.Create(&med)
	c.JSON(http.StatusOK, gin.H{"msg": "添加药品成功", "data": med})
}

// --- 用户管理 (Users) ---
// 对应页面：/users

func ManageUserStatus(c *gin.Context) {
	// 简单实现：列出所有用户
	var users []model.User
	database.DB.Find(&users)
	c.JSON(http.StatusOK, gin.H{"data": users})
}
