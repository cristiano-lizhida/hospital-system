package api

import (
	"hospital-system/internal/api/middleware"
	"hospital-system/internal/database"
	"hospital-system/internal/model"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func LoginHandler(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误"})
		return
	}

	var user model.User
	// 从数据库查找用户
	if err := database.DB.Where("username = ?", req.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "用户不存在"})
		return
	}

	// 验证密码 (使用之前在模型里写的 CheckPassword)
	if !user.CheckPassword(req.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "密码错误"})
		return
	}

	// 签发 JWT Token
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
		"user":  gin.H{"username": user.Username, "role": user.Role},
	})
}

// --- 挂号业务 (Bookings) ---
func GetBookings(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"msg": "预约列表"})
}
func CreateBooking(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"msg": "挂号成功"})
}

// --- 财务业务 ---
func GetUnpaidOrders(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"msg": "未支付订单"})
}
func ConfirmPayment(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"msg": "支付确认成功，库存已更新"})
}

// --- 医生业务 ---
func GetPendingPatients(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"msg": "待诊列表"})
}
func SubmitMedicalRecord(c *gin.Context) {
	// 这里未来会实现：保存病历 -> 生成订单(Unpaid)
	c.JSON(http.StatusOK, gin.H{"msg": "诊断完成，已生成缴费单"})
}

// --- 库房业务 ---
func GetInventory(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"msg": "当前库存"})
}

func AddMedicine(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"msg": "添加药品"})
}

// --- 用户管理 ---
func ManageUserStatus(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"msg": "账号状态已更新"})
}
