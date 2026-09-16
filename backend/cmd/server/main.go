package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"sinapsa/backend/internal/config"
	"sinapsa/backend/internal/database"
	"sinapsa/backend/internal/handlers"
)

// corsMiddleware adds standard CORS headers for development and production
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// loggingMiddleware prints incoming HTTP requests
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		log.Printf("[%s] %s - %s", r.Method, r.URL.Path, time.Since(start))
	})
}

func main() {
	log.Println("--- Iniciando Sinapsa Backend ---")

	// 1. Cargar configuración desde variables de entorno
	cfg := config.LoadConfig()
	log.Printf("Ambiente: %s | Puerto: %s", cfg.AppEnv, cfg.Port)

	// 2. Conectar a PostgreSQL y ejecutar migraciones Go automáticas
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("Error fatal al inicializar la base de datos: %v", err)
	}

	// 3. Registrar rutas HTTP (Mux de Go 1.22+)
	mux := http.NewServeMux()
	itemHandler := handlers.NewItemHandler(db)

	// Health check
	mux.HandleFunc("GET /api/health", handlers.HealthHandler(cfg, db))

	// Items CRUD
	mux.HandleFunc("GET /api/items", itemHandler.ListItems)
	mux.HandleFunc("POST /api/items", itemHandler.CreateItem)
	mux.HandleFunc("DELETE /api/items/{id}", itemHandler.DeleteItem)

	// Envolver con Middlewares
	handlerWithMiddlewares := loggingMiddleware(corsMiddleware(mux))

	server := &http.Server{
		Addr:         fmt.Sprintf(":%s", cfg.Port),
		Handler:      handlerWithMiddlewares,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// 4. Iniciar servidor en goroutine para permitir Graceful Shutdown
	go func() {
		log.Printf("Servidor escuchando en http://0.0.0.0:%s", cfg.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Error en el servidor HTTP: %v", err)
		}
	}()

	// 5. Capturar señales de terminación del sistema operativo
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Cerrando servidor ordenadamente (Graceful Shutdown)...")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Forzando cierre del servidor: %v", err)
	}

	log.Println("Servidor finalizado con éxito.")
}
