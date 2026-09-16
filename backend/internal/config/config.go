package config

import (
	"os"
	"strconv"
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
	return &Config{
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
}

func getEnv(k, fallback string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return fallback
}
