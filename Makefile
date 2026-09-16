.PHONY: help up down build logs restart dev-db dev-backend dev-frontend test clean

help: ## Muestra este mensaje de ayuda
	@echo "Comandos disponibles en Sinapsa:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

up: ## Levanta todos los servicios con Docker en segundo plano
	docker compose up -d --build

down: ## Detiene y remueve los contenedores
	docker compose down

build: ## Compila las imágenes de Docker
	docker compose build

logs: ## Muestra los logs en vivo de todos los servicios
	docker compose logs -f

restart: ## Reinicia todos los contenedores
	docker compose restart

dev-db: ## Inicia solo la base de datos PostgreSQL en Docker para desarrollo local
	docker compose up -d db

dev-backend: ## Inicia el servidor Backend en Go localmente
	cd backend && go run ./cmd/server

dev-frontend: ## Inicia el servidor Frontend en React (Vite) localmente
	cd frontend && npm run dev

test: ## Valida compilación de backend y frontend
	@echo "==> Verificando compilación de Go Backend..."
	cd backend && go build -v ./cmd/server && rm -f server
	@echo "==> Verificando compilación de React Frontend..."
	cd frontend && npm run build
	@echo "==> Todo compila correctamente!"

clean: ## Limpia dependencias temporales y dist
	rm -rf frontend/dist backend/server
