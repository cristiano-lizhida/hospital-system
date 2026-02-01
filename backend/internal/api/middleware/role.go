package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RoleMiddleware(requiredRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, _ := c.Get("role")

		isAuthorized := false
		for _, r := range requiredRoles {
			if role == r {
				isAuthorized = true
				break
			}
		}

		if !isAuthorized {
			c.JSON(http.StatusForbidden, gin.H{"error": "权限不足"})
			c.Abort()
			return
		}
		c.Next()
	}
}
