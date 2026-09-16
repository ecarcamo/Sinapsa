package database

import (
	"fmt"
	"log"
	"time"

	"sinapsa/backend/internal/config"
	"sinapsa/backend/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type DB struct {
	*gorm.DB
}

func Connect(cfg *config.Config) (*DB, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBSSLMode,
	)

	var gormDB *gorm.DB
	var err error

	// Retry hasta 10 intentos (útil cuando Postgres aún arranca)
	for i := 1; i <= 10; i++ {
		gormDB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Silent),
		})
		if err == nil {
			sqlDB, e2 := gormDB.DB()
			if e2 == nil {
				if e2 = sqlDB.Ping(); e2 == nil {
					// Pool
					sqlDB.SetMaxOpenConns(20)
					sqlDB.SetMaxIdleConns(5)
					sqlDB.SetConnMaxLifetime(5 * time.Minute)
					break
				}
				err = e2
			}
		}
		log.Printf("[db] intento %d/10 falló: %v — reintentando en 2s...", i, err)
		time.Sleep(2 * time.Second)
	}
	if err != nil {
		return nil, fmt.Errorf("no se pudo conectar a postgres: %w", err)
	}

	log.Println("[db] conectado a PostgreSQL")
	return &DB{gormDB}, nil
}

func (d *DB) Migrate() error {
	if err := d.AutoMigrate(&models.User{}, &models.OTPCode{}); err != nil {
		return err
	}
	log.Println("[db] migraciones OK (User, OTPCode)")
	return nil
}

func (d *DB) SeedAdmin() error {
	const adminEmail = "estebancarcamou@gmail.com"
	var count int64
	if err := d.Model(&models.User{}).Where("email = ?", adminEmail).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		log.Printf("[db] admin ya existe: %s", adminEmail)
		return nil
	}
	now := time.Now()
	u := models.User{
		Email:     adminEmail,
		Role:      "admin",
		IsActive:  true,
		InvitedAt: &now,
	}
	if err := d.Create(&u).Error; err != nil {
		return err
	}
	log.Printf("[db] admin creado: %s (id=%d)", adminEmail, u.ID)
	return nil
}

// Limpieza opcional de OTPs expirados/usados viejos (llamar periódicamente o al arrancar)
func (d *DB) CleanupExpiredOTPs() {
	_ = d.Where("expires_at < ? OR used_at IS NOT NULL AND created_at < ?", time.Now(), time.Now().Add(-24*time.Hour)).Delete(&models.OTPCode{}).Error
}
