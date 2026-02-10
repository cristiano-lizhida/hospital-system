package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var JwtKey []byte

func InitAuth(secret string) {
	JwtKey = []byte(secret)
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "未登录"})
			c.Abort()
			return
		}

		tokenString := authHeader[7:]
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return JwtKey, nil
		})

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			// 1. 处理 user_id (从 float64 转为 uint)
			if uid, ok := claims["user_id"].(float64); ok {
				c.Set("user_id", uint(uid))
			}

			// 2. 处理 role (必须转为 string，否则后续 string 比对会失败)
			if role, ok := claims["role"].(string); ok {
				c.Set("role", role)
			}

			// 3. 处理 org_id (从 float64 转为 uint)
			if oid, ok := claims["org_id"].(float64); ok {
				c.Set("org_id", uint(oid))
			}

			c.Next()
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "无效的Token: " + err.Error()})
			c.Abort()
		}
	}
}
