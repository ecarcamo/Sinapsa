
package main

import (
	"log"
	"net/http"
	"os"

	"sinapsa/backend/internal/config"
	"sinapsa/backend/internal/database"
	"sinapsa/backend/internal/handlers"
	"sinapsa/backend/internal/middleware"
	"sinapsa/backend/internal/services"

	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()
	_ = godotenv.Load("../.env")
	_ = godotenv.Load("../../.env")

	cfg := config.Load()

	// Conexión DB
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("[fatal] db: %v", err)
	}
	if err := db.Migrate(); err != nil {
		log.Fatalf("[fatal] migrate: %v", err)
	}
	if err := db.SeedAdmin(); err != nil {
		log.Printf("[warn] seed admin: %v", err)
	}
	db.CleanupExpiredOTPs()

	jwtSvc := services.NewJWTService(cfg.JWTSecret)
	emailSvc := services.NewEmailService(cfg.ResendAPIKey, cfg.ResendFrom, cfg.AppEnv)
	authH := handlers.NewAuthHandler(cfg, db, jwtSvc, emailSvc)

	mux := http.NewServeMux()

	// CORS helper
	cors := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")
			// En dev permitimos localhost:* ; en prod reflejamos FRONTEND_URL o *
			allowed := cfg.FrontendURL
			if cfg.AppEnv == "development" {
				w.Header().Set("Access-Control-Allow-Origin", originOrStar(origin))
				w.Header().Set("Access-Control-Allow-Credentials", "true")
			} else {
				if origin == allowed || allowed == "*" {
					w.Header().Set("Access-Control-Allow-Origin", origin)
					w.Header().Set("Access-Control-Allow-Credentials", "true")
				} else if origin != "" {
					// permitimos igual para health, pero bloqueamos creds si no coincide
					w.Header().Set("Access-Control-Allow-Origin", allowed)
				} else {
					w.Header().Set("Access-Control-Allow-Origin", allowed)
				}
			}
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			if r.Method == http.MethodOptions {
				w.WriteHeader(204)
				return
			}
			next.ServeHTTP(w, r)
		})
	}

	// Públicas
	mux.HandleFunc("/api/health", handlers.HealthHandler(cfg, db))
	mux.HandleFunc("/api/auth/request-otp", authH.RequestOTP)
	mux.HandleFunc("/api/auth/verify-otp", authH.VerifyOTP)
	mux.HandleFunc("/api/auth/logout", authH.Logout)
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"service":"sinapsa-backend","status":"ok"}`))
	})

	// Protegidas
	mux.Handle("/api/auth/me", middleware.AuthMiddleware(jwtSvc)(http.HandlerFunc(authH.Me)))
	mux.Handle("/api/auth/invite", middleware.AuthMiddleware(jwtSvc)(http.HandlerFunc(authH.Invite)))
	mux.Handle("/api/auth/users", middleware.AuthMiddleware(jwtSvc)(http.HandlerFunc(authH.ListUsers)))

	handler := cors(mux)
	// Logging
	handler = logMiddleware(handler)

	port := cfg.Port
	if port == "" {
		port = os.Getenv("PORT")
		if port == "" {
			port = "8080"
		}
	}
	log.Printf("[server] Sinapsa backend en :%s (env=%s, db=%s, resend=%v)", port, cfg.AppEnv, cfg.DBHost, cfg.ResendAPIKey != "")
	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatalf("[fatal] listen: %v", err)
	}
}

func originOrStar(origin string) string {
	if origin == "" {
		return "*"
	}
	return origin
}

func logMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s %s", r.Method, r.URL.Path, r.RemoteAddr)
		next.ServeHTTP(w, r)
	})
}
