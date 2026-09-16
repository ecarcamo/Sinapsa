import React, { useState, useEffect, useCallback } from 'react'
import './App.css'

interface HealthData {
  status: string
  database: string
  environment: string
  timestamp: string
  uptime: string
}

interface Item {
  id: number
  title: string
  description: string
  status: string
  createdAt: string
  updatedAt: string
}

export const App: React.FC = () => {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [healthLoading, setHealthLoading] = useState<boolean>(true)
  const [healthError, setHealthError] = useState<string | null>(null)
  const [latency, setLatency] = useState<number | null>(null)

  const [items, setItems] = useState<Item[]>([])
  const [itemsLoading, setItemsLoading] = useState<boolean>(true)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [creating, setCreating] = useState(false)

  // Fetch health check
  const checkHealth = useCallback(async () => {
    setHealthLoading(true)
    const startTime = performance.now()
    try {
      const res = await fetch('/api/health')
      const endTime = performance.now()
      setLatency(Math.round(endTime - startTime))

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const data: HealthData = await res.json()
      setHealth(data)
      setHealthError(null)
    } catch (err: unknown) {
      setHealth(null)
      setHealthError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setHealthLoading(false)
    }
  }, [])

  // Fetch items from Go backend
  const fetchItems = useCallback(async () => {
    setItemsLoading(true)
    try {
      const res = await fetch('/api/items')
      if (res.ok) {
        const data: Item[] = await res.json()
        setItems(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Error cargando items:', err)
    } finally {
      setItemsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkHealth()
    fetchItems()

    // Poll health status every 10 seconds
    const interval = setInterval(checkHealth, 10000)
    return () => clearInterval(interval)
  }, [checkHealth, fetchItems])

  // Create Item handler
  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    setCreating(true)
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim(),
          status: 'active',
        }),
      })

      if (res.ok) {
        setNewTitle('')
        setNewDescription('')
        await fetchItems()
      }
    } catch (err) {
      console.error('Error al crear item:', err)
    } finally {
      setCreating(false)
    }
  }

  // Delete Item handler
  const handleDeleteItem = async (id: number) => {
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id))
      }
    } catch (err) {
      console.error('Error al borrar item:', err)
    }
  }

  const isBackendOnline = health?.status === 'ok'
  const isDbConnected = health?.database === 'connected'

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-title-row">
            <span className="brand-logo gradient-text">SINAPSA</span>
            <span className="badge badge-info">Monolito v1.0</span>
          </div>
          <p className="brand-subtitle">
            Arquitectura Monolítica Modular: Go Backend + React TypeScript + PostgreSQL + Docker
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => {
              checkHealth()
              fetchItems()
            }}
            disabled={healthLoading}
          >
            🔄 {healthLoading ? 'Comprobando...' : 'Actualizar Estado'}
          </button>
        </div>
      </header>

      {/* Metrics & Health Status Cards */}
      <section className="metrics-grid">
        {/* Backend Card */}
        <div className="glass-panel metric-card">
          <div className="metric-header">
            <div className="metric-title-group">
              <span className="metric-icon">🚀</span>
              <span className="metric-name">Go Backend</span>
            </div>
            <span className={`badge ${isBackendOnline ? 'badge-success' : 'badge-error'}`}>
              <span className={`pulse-dot ${isBackendOnline ? 'online' : 'offline'}`}></span>
              {isBackendOnline ? 'En línea' : 'Desconectado'}
            </span>
          </div>
          <div className="metric-body">
            <div className="metric-stat-row">
              <span className="metric-stat-label">Endpoint:</span>
              <span className="code-pill">/api/health</span>
            </div>
            <div className="metric-stat-row">
              <span className="metric-stat-label">Latencia:</span>
              <span className="metric-stat-value">{latency !== null ? `${latency} ms` : '--'}</span>
            </div>
            <div className="metric-stat-row">
              <span className="metric-stat-label">Uptime Servidor:</span>
              <span className="metric-stat-value">{health?.uptime || '--'}</span>
            </div>
            <div className="metric-stat-row">
              <span className="metric-stat-label">Ambiente:</span>
              <span className="metric-stat-value">{health?.environment || (healthError ? 'Error: ' + healthError : 'Iniciando...')}</span>
            </div>
          </div>
        </div>

        {/* Database Card */}
        <div className="glass-panel metric-card">
          <div className="metric-header">
            <div className="metric-title-group">
              <span className="metric-icon">🐘</span>
              <span className="metric-name">PostgreSQL</span>
            </div>
            <span className={`badge ${isDbConnected ? 'badge-success' : 'badge-error'}`}>
              <span className={`pulse-dot ${isDbConnected ? 'online' : 'offline'}`}></span>
              {isDbConnected ? 'Conectada' : 'Sin Conexión'}
            </span>
          </div>
          <div className="metric-body">
            <div className="metric-stat-row">
              <span className="metric-stat-label">Gestión de Esquema:</span>
              <span className="badge badge-info">Go Auto-Migrate</span>
            </div>
            <div className="metric-stat-row">
              <span className="metric-stat-label">ORM / Driver:</span>
              <span className="code-pill">GORM + pgx</span>
            </div>
            <div className="metric-stat-row">
              <span className="metric-stat-label">Entidades Almacenadas:</span>
              <span className="metric-stat-value">{items.length} registros</span>
            </div>
            <div className="metric-stat-row">
              <span className="metric-stat-label">Persistencia:</span>
              <span className="metric-stat-value">Docker Volume (pgdata)</span>
            </div>
          </div>
        </div>

        {/* Frontend Card */}
        <div className="glass-panel metric-card">
          <div className="metric-header">
            <div className="metric-title-group">
              <span className="metric-icon">⚛️</span>
              <span className="metric-name">React + TS</span>
            </div>
            <span className="badge badge-success">
              <span className="pulse-dot online"></span>
              Activo
            </span>
          </div>
          <div className="metric-body">
            <div className="metric-stat-row">
              <span className="metric-stat-label">Framework / Bundler:</span>
              <span className="code-pill">Vite 6 + React 19</span>
            </div>
            <div className="metric-stat-row">
              <span className="metric-stat-label">Lenguaje:</span>
              <span className="metric-stat-value">TypeScript</span>
            </div>
            <div className="metric-stat-row">
              <span className="metric-stat-label">Producción Web Server:</span>
              <span className="code-pill">Nginx Alpine (Proxy /api)</span>
            </div>
            <div className="metric-stat-row">
              <span className="metric-stat-label">Contenedor:</span>
              <span className="metric-stat-value">Multi-stage build</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Database Explorer & Quick Guide */}
      <div className="content-grid">
        {/* DB CRUD Explorer */}
        <section className="glass-panel section-panel">
          <div className="section-title-row">
            <h2 className="section-title">📦 Explorador de Datos en PostgreSQL</h2>
            <span className="badge badge-info">{items.length} elementos</span>
          </div>

          {/* Form to insert item into DB */}
          <form className="item-form" onSubmit={handleCreateItem}>
            <div className="form-row">
              <input
                className="input-field"
                type="text"
                placeholder="Título del elemento..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
              <input
                className="input-field"
                type="text"
                placeholder="Descripción (opcional)..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={creating || !newTitle.trim() || !isDbConnected}
            >
              ➕ {creating ? 'Guardando en BD...' : 'Crear Registro en Base de Datos'}
            </button>
          </form>

          {/* List of items */}
          {itemsLoading ? (
            <div className="empty-state">Cargando registros desde PostgreSQL...</div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              No hay registros en la base de datos aún. Crea el primero arriba.
            </div>
          ) : (
            <div className="items-list">
              {items.map((item) => (
                <div key={item.id} className="item-card">
                  <div className="item-info">
                    <div className="item-title-row">
                      <span className="item-title">{item.title}</span>
                      <span className="badge badge-info">#{item.id}</span>
                      <span className="badge badge-success">{item.status}</span>
                    </div>
                    {item.description && (
                      <p className="item-desc">{item.description}</p>
                    )}
                    <span className="item-date">
                      Creado: {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteItem(item.id)}
                    title="Eliminar de la BD"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Guide & Architecture */}
        <section className="glass-panel section-panel guide-card">
          <h2 className="section-title">🛠️ Comandos de Inicio Rápido</h2>

          <div className="guide-step">
            <div className="guide-step-title">
              <span>🐳</span> Arrancar Todo con Docker (Recomendado)
            </div>
            <div className="terminal-box">
              <span className="terminal-comment"># Levantar DB, Backend y Frontend</span>
              <br />
              docker compose up -d --build
              <br />
              <span className="terminal-comment"># Ver logs en vivo</span>
              <br />
              docker compose logs -f
            </div>
          </div>

          <div className="guide-step">
            <div className="guide-step-title">
              <span>💻</span> Desarrollo Local (Sin Docker)
            </div>
            <div className="terminal-box">
              <span className="terminal-comment"># 1. Base de datos (Postgres local o Docker)</span>
              <br />
              docker compose up -d db
              <br />
              <br />
              <span className="terminal-comment"># 2. Backend Go</span>
              <br />
              cd backend && go run ./cmd/server
              <br />
              <br />
              <span className="terminal-comment"># 3. Frontend React</span>
              <br />
              cd frontend && npm run dev
            </div>
          </div>

          <div className="guide-step">
            <div className="guide-step-title">
              <span>⚡</span> Atajos con Makefile
            </div>
            <div className="terminal-box">
              make up &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="terminal-comment"># Levanta todo con Docker</span>
              <br />
              make down &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="terminal-comment"># Detiene los contenedores</span>
              <br />
              make logs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="terminal-comment"># Muestra logs en vivo</span>
              <br />
              make test &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="terminal-comment"># Compila y valida backend/frontend</span>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        Sinapsa Monolith • Go + PostgreSQL + React + Docker • Listo para Producción
      </footer>
    </div>
  )
}

export default App
