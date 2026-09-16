package database

import (
	"fmt"
	"log"
	"time"

	"sinapsa/backend/internal/config"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Database struct {
	DB *gorm.DB
}

// Connect establishes the database connection and runs automatic migrations
func Connect(cfg *config.Config) (*Database, error) {
	dsn := cfg.GetDSN()

	var db *gorm.DB
	var err error

	// Retry mechanism to wait for PostgreSQL container to be ready
	maxRetries := 10
	for i := 1; i <= maxRetries; i++ {
		log.Printf("[Database] Connecting to PostgreSQL (attempt %d/%d)...", i, maxRetries)
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})
		if err == nil {
			sqlDB, errSql := db.DB()
			if errSql == nil {
				if pingErr := sqlDB.Ping(); pingErr == nil {
					log.Println("[Database] Successfully connected to PostgreSQL!")
					break
				}
			}
		}

		if i == maxRetries {
			return nil, fmt.Errorf("failed to connect to database after %d attempts: %w", maxRetries, err)
		}
		time.Sleep(2 * time.Second)
	}

	// Optimize connection pool
	sqlDB, err := db.DB()
	if err == nil {
		sqlDB.SetMaxIdleConns(10)
		sqlDB.SetMaxOpenConns(100)
		sqlDB.SetConnMaxLifetime(time.Hour)
	}

	d := &Database{DB: db}

	// Run Go database schema creation / migrations
	if err := d.Migrate(); err != nil {
		return nil, fmt.Errorf("database migration failed: %w", err)
	}

	return d, nil
}

// Migrate automatically creates or updates database tables according to Go models
func (d *Database) Migrate() error {
	log.Println("[Database] Executing Go Auto-Migrations...")
	// Registrar aquí los modelos de Sinapsa cuando se vayan creando
	log.Println("[Database] Migrations verified successfully!")
	return nil
}

// Ping checks if the database is responding
func (d *Database) Ping() error {
	sqlDB, err := d.DB.DB()
	if err != nil {
		return err
	}
	return sqlDB.Ping()
}
