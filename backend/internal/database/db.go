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

	// Seed sample data if empty
	d.Seed()

	return d, nil
}

// Migrate automatically creates or updates database tables according to Go models
func (d *Database) Migrate() error {
	log.Println("[Database] Executing Go Auto-Migrations...")
	err := d.DB.AutoMigrate(
		&models.Item{},
	)
	if err != nil {
		return err
	}
	log.Println("[Database] Migrations applied successfully!")
	return nil
}

// Seed populates initial demo data if the tables are empty
func (d *Database) Seed() {
	var count int64
	d.DB.Model(&models.Item{}).Count(&count)
	if count == 0 {
		log.Println("[Database] Seeding initial demo data...")
		demoItems := []models.Item{
			{
				Title:       "Bienvenido a Sinapsa",
				Description: "Tu estructura monolítica base en Go y React está lista.",
				Status:      "active",
			},
			{
				Title:       "Conexión a PostgreSQL",
				Description: "La base de datos fue inicializada y migrada directamente desde código Go.",
				Status:      "completed",
			},
			{
				Title:       "Despliegue con Docker",
				Description: "Entornos de desarrollo y producción unificados con Docker Compose.",
				Status:      "active",
			},
		}
		for _, item := range demoItems {
			d.DB.Create(&item)
		}
		log.Println("[Database] Demo data seeded successfully.")
	}
}

// Ping checks if the database is responding
func (d *Database) Ping() error {
	sqlDB, err := d.DB.DB()
	if err != nil {
		return err
	}
	return sqlDB.Ping()
}
