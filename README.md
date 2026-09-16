# Sinapsa 🧠

Estructura base para un **monolito modular y moderno**, preparado para desarrollo ágil y listo para escalar a producción.

- **Backend**: Go 1.24+ con enrutador nativo, pooling de conexiones y graceful shutdown.
- **Base de Datos**: PostgreSQL 16 Alpine, con inicialización de conexión, auto-migraciones de esquema y seed de datos gestionados directamente en **código Go** (usando GORM).
- **Frontend**: React 19 + TypeScript + Vite, estilizado con CSS moderno (tema oscuro, glassmorphism, métricas en vivo y panel interactivo CRUD).
- **Infraestructura**: Docker & Docker Compose con builds multi-stage optimizados (Alpine minimalista para Go y Nginx Alpine para React).

---

## 📁 Estructura del Proyecto

```text
Sinapsa/
├── backend/                      # Servidor Go y lógica de base de datos
│   ├── cmd/
│   │   └── server/
│   │       └── main.go           # Punto de entrada HTTP y middlewares
│   ├── internal/
│   │   ├── config/               # Lectura de variables de entorno
│   │   │   └── config.go
│   │   ├── database/             # Conexión PostgreSQL y Go Auto-Migraciones
│   │   │   └── db.go
│   │   ├── handlers/             # Controladores de la API REST (/api/health, /api/items)
│   │   │   ├── health.go
│   │   │   └── item.go
│   │   └── models/               # Modelos y entidades de base de datos
│   │       └── item.go
│   ├── Dockerfile                # Multi-stage build para Go (binario estático en Alpine)
│   ├── go.mod
│   └── go.sum
├── frontend/                     # Aplicación web React + TypeScript
│   ├── src/
│   │   ├── App.tsx               # Dashboard con monitor de estado y CRUD en tiempo real
│   │   ├── App.css
│   │   ├── index.css             # Tokens de diseño, tipografía y estilos globales
│   │   └── main.tsx
│   ├── nginx.conf                # Nginx para producción (SPA fallback + proxy inverso a /api)
│   ├── Dockerfile                # Multi-stage build (Node build -> Nginx Alpine)
│   ├── Dockerfile.dev            # Dockerfile para desarrollo con HMR
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts            # Vite configurado con proxy a Go Backend
├── docker-compose.yml            # Orquestación de DB, Backend y Frontend
├── .env.example                  # Plantilla de variables de entorno
├── .env                          # Configuración local por defecto
├── Makefile                      # Comandos rápidos de ejecución
└── README.md                     # Esta guía
```

---

## 🚀 Cómo Arrancar los Servicios

Tienes dos formas de ejecutar el proyecto: **con Docker** (recomendado para entorno de producción o despliegue completo) o **en local** (recomendado para desarrollo con hot-reloading).

### Opción 1: Todo con Docker (Producción / Entorno Completo)

Esta opción compila los contenedores multi-etapa y levanta la base de datos, el backend y el frontend con Nginx.

1. **Levantar todos los contenedores**:
   ```bash
   make up
   # o bien:
   docker compose up -d --build
   ```

2. **Ver logs de los servicios en tiempo real**:
   ```bash
   make logs
   # o bien:
   docker compose logs -f
   ```

3. **Acceder a la aplicación**:
   - **Frontend Web**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8080](http://localhost:8080)
   - **Healthcheck & DB status**: [http://localhost:8080/api/health](http://localhost:8080/api/health)
   - **PostgreSQL**: `localhost:5432` (Usuario: `postgres`, Password: `postgres`, BD: `sinapsa_db`)

4. **Detener los servicios**:
   ```bash
   make down
   # o bien:
   docker compose down
   ```

---

### Opción 2: Desarrollo Local (Paso a Paso)

Si prefieres editar código con recarga rápida instantánea (HMR en React y ejecución directa en Go):

#### 1. Iniciar la Base de Datos (PostgreSQL en Docker)
```bash
make dev-db
# o bien:
docker compose up -d db
```

#### 2. Iniciar el Backend en Go
En una terminal:
```bash
make dev-backend
# o bien:
cd backend
go run ./cmd/server
```
> Al arrancar, Go se conectará automáticamente a PostgreSQL, ejecutará las migraciones creando las tablas necesarias y cargará datos de prueba iniciales si la tabla está vacía.

#### 3. Iniciar el Frontend en React
En otra terminal:
```bash
make dev-frontend
# o bien:
cd frontend
npm run dev
```
> Abre tu navegador en [http://localhost:5173](http://localhost:5173). Las peticiones a `/api/*` serán redirigidas automáticamente por Vite al backend de Go en el puerto `8080`.

---

## 🗄️ Gestión de la Base de Datos desde Go

El proyecto está diseñado para que **Go sea el responsable único de la base de datos**:

1. **Definición de Modelos**:
   Se encuentran en [`backend/internal/models/item.go`](backend/internal/models/item.go). Puedes añadir campos o nuevos modelos definiendo structs de Go con tags de GORM:
   ```go
   type Item struct {
       ID          uint      `gorm:"primaryKey" json:"id"`
       Title       string    `gorm:"size:255;not null" json:"title"`
       Description string    `gorm:"type:text" json:"description"`
       Status      string    `gorm:"size:50;default:'active'" json:"status"`
       CreatedAt   time.Time `json:"createdAt"`
       UpdatedAt   time.Time `json:"updatedAt"`
   }
   ```

2. **Auto-Migraciones**:
   En [`backend/internal/database/db.go`](backend/internal/database/db.go), la función `Migrate()` ejecuta:
   ```go
   d.DB.AutoMigrate(&models.Item{})
   ```
   Cada vez que arrancas el backend, Go crea las tablas que falten y actualiza columnas e índices sin pérdida de datos.

3. **Retry y Resiliencia**:
   El conector en Go incluye reintentos automáticos (espera a que PostgreSQL esté completamente listo) y optimización del connection pool (máximo de conexiones abiertas e inactivas).

---

## 📡 Endpoints de la API REST

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/health` | Estado del backend, conexión con PostgreSQL, uptime y ambiente |
| `GET` | `/api/items` | Lista todos los elementos ordenados de forma descendente |
| `POST` | `/api/items` | Inserta un nuevo elemento en PostgreSQL (`{ "title": "...", "description": "..." }`) |
| `DELETE` | `/api/items/{id}` | Elimina un registro por ID de la base de datos |

---

## 🛠️ Atajos del Makefile

| Comando | Acción |
|---|---|
| `make up` | Compila y levanta todos los contenedores en segundo plano |
| `make down` | Detiene y remueve los contenedores |
| `make logs` | Muestra los logs en vivo de todos los servicios |
| `make build` | Recompila las imágenes de Docker |
| `make restart` | Reinicia todos los contenedores |
| `make dev-db` | Inicia únicamente la base de datos PostgreSQL |
| `make dev-backend` | Ejecuta el backend de Go localmente |
| `make dev-frontend` | Ejecuta el frontend de React localmente con Vite |
| `make test` | Valida la compilación de Go y React |
| `make clean` | Limpia binarios y carpetas `dist` temporales |