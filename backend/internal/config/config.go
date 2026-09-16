package config

import (
	"net/url"
	"os"
	"strconv"
	"strings"
)

type Config struct {
	Port         string
	AppEnv       string
	DBHost       string
	DBPort       string
	DBUser       string
	DBPassword   string
	DBName       string
	DBSSLMode    string
	JWTSecret    string
	ResendAPIKey string
	ResendFrom   string
	OTPExpiryMin int
	FrontendURL  string
}

func Load() *Config {
	otpMin, _ := strconv.Atoi(getEnv("OTP_EXPIRY_MINUTES", "10"))
	if otpMin <= 0 {
		otpMin = 10
	}
	cfg := &Config{
		Port:         getEnv("PORT", "8080"),
		AppEnv:       getEnv("APP_ENV", "development"),
		DBHost:       getEnv("DB_HOST", "localhost"),
		DBPort:       getEnv("DB_PORT", "5432"),
		DBUser:       getEnv("DB_USER", "postgres"),
		DBPassword:   getEnv("DB_PASSWORD", "postgres"),
		DBName:       getEnv("DB_NAME", "sinapsa_db"),
		DBSSLMode:    getEnv("DB_SSLMODE", "disable"),
		JWTSecret:    getEnv("JWT_SECRET", "dev-super-secret-change-in-production-32chars!"),
		ResendAPIKey: getEnv("RESEND_API_KEY", ""),
		ResendFrom:   getEnv("RESEND_FROM_EMAIL", "Sinapsa <onboarding@resend.dev>"),
		OTPExpiryMin: otpMin,
		FrontendURL:  getEnv("FRONTEND_URL", "http://localhost:5173"),
	}
	// Render y otros PaaS entregan DATABASE_URL — si existe, la parseamos y sobreescribe DB_*
	if dbURL := os.Getenv("DATABASE_URL"); dbURL != "" {
		if u, err := url.Parse(dbURL); err == nil {
			cfg.DBHost = u.Hostname()
			if p := u.Port(); p != "" {
				cfg.DBPort = p
			}
			if u.User != nil {
				cfg.DBUser = u.User.Username()
				if pw, ok := u.User.Password(); ok {
					cfg.DBPassword = pw
				}
			}
			cfg.DBName = strings.TrimPrefix(u.Path, "/")
			if q := u.Query().Get("sslmode"); q != "" {
				cfg.DBSSLMode = q
			} else {
				cfg.DBSSLMode = "require"
			}
		}
	}
	return cfg
}

func getEnv(k, fallback string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return fallback
}
