package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"sinapsa/backend/internal/config"
	"sinapsa/backend/internal/database"
)

var startedAt = time.Now()

func HealthHandler(cfg *config.Config, db *database.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")

		dbStatus := "ok"
		if db != nil {
			if sqlDB, err := db.DB.DB(); err == nil {
				if err := sqlDB.Ping(); err != nil {
					dbStatus = "error: " + err.Error()
				}
			}
		} else {
			dbStatus = "not configured"
		}

		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":      "ok",
			"message":     "Sinapsa backend is running",
			"environment": cfg.AppEnv,
			"uptime":      time.Since(startedAt).String(),
			"database":    dbStatus,
			"time":        time.Now().Format(time.RFC3339),
		})
	}
}
