package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"sinapsa/backend/internal/config"
	"sinapsa/backend/internal/database"
)

type HealthResponse struct {
	Status    string    `json:"status"`
	Database  string    `json:"database"`
	Env       string    `json:"environment"`
	Timestamp time.Time `json:"timestamp"`
	Uptime    string    `json:"uptime"`
}

var startTime = time.Now()

func HealthHandler(cfg *config.Config, db *database.Database) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		dbStatus := "connected"
		status := "ok"

		if err := db.Ping(); err != nil {
			dbStatus = "disconnected"
			status = "degraded"
		}

		resp := HealthResponse{
			Status:    status,
			Database:  dbStatus,
			Env:       cfg.AppEnv,
			Timestamp: time.Now().UTC(),
			Uptime:    time.Since(startTime).Truncate(time.Second).String(),
		}

		w.Header().Set("Content-Type", "application/json")
		if status != "ok" {
			w.WriteHeader(http.StatusServiceUnavailable)
		} else {
			w.WriteHeader(http.StatusOK)
		}

		json.NewEncoder(w).Encode(resp)
	}
}
