package middleware

import (
	"context"
	"net/http"
	"strings"

	"sinapsa/backend/internal/services"
)

type contextKey string

const UserClaimsKey contextKey = "claims"

func AuthMiddleware(jwtSvc *JWTServiceAdapter) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			token := extractToken(r)
			if token == "" {
				http.Error(w, `{"error":"no autenticado"}`, http.StatusUnauthorized)
				return
			}
			claims, err := jwtSvc.Parse(token)
			if err != nil {
				http.Error(w, `{"error":"token inválido o expirado"}`, http.StatusUnauthorized)
				return
			}
			ctx := context.WithValue(r.Context(), UserClaimsKey, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// adapter para evitar import circular (jwt service ya definido)
type JWTServiceAdapter = services.JWTService

func extractToken(r *http.Request) string {
	// 1) Authorization Bearer
	if h := r.Header.Get("Authorization"); h != "" {
		if strings.HasPrefix(h, "Bearer ") {
			return strings.TrimPrefix(h, "Bearer ")
		}
		return h
	}
	// 2) Cookie
	if c, err := r.Cookie("token"); err == nil {
		return c.Value
	}
	return ""
}

func GetClaims(r *http.Request) (*services.Claims, bool) {
	v := r.Context().Value(UserClaimsKey)
	if v == nil {
		return nil, false
	}
	c, ok := v.(*services.Claims)
	return c, ok
}
