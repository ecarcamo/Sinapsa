import React, { useState, useEffect, useCallback } from 'react'
import './App.css'

interface HealthData {
  status: string
  database: string
  environment: string
  timestamp: string
  uptime: string
}

const API_BASE = import.meta.env.VITE_API_URL || ''

export const App: React.FC = () => {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [healthLoading, setHealthLoading] = useState<boolean>(true)
  const [healthError, setHealthError] = useState<string | null>(null)
  const [latency, setLatency] = useState<number | null>(null)

  const checkHealth = useCallback(async () => {
    setHealthLoading(true)
    const startTime = performance.now()
    try {
      const res = await fetch(`${API_BASE}/api/health`)
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

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 15000)
    return () => clearInterval(interval)
  }, [checkHealth])

  const isBackendOnline = health?.status === 'ok'
  const isDbConnected = health?.database === 'connected'

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-title-row">
            <span className="brand-logo gradient-text">SINAPSA</span>
            <span className="badge badge-info">Base v0.1</span>
          </div>
          <p className="brand-subtitle">
            Plataforma Modular en Producción &bull; Go + React TypeScript + PostgreSQL
          </p>
        </div>

        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={checkHealth}
            disabled={healthLoading}
          >
            <span className={`pulse-dot ${isBackendOnline ? 'online' : 'offline'}`}></span>
            {healthLoading ? 'Verificando...' : isBackendOnline ? 'En línea' : 'Desconectado'}
          </button>
        </div>
      </header>

      {/* Hero Welcome */}
      <main className="hero-section">
        <div className="hero-card glass-panel">
          <div className="hero-badge-row">
            <span className="badge badge-success">CI/CD Activo</span>
            <span className="badge badge-info">{health?.environment || 'production'}</span>
          </div>
          <h1 className="hero-title">
            Infraestructura lista para <span className="gradient-text">Sinapsa</span>
          </h1>
          <p className="hero-description">
            El entorno de producción, base de datos en Neon, backend en Render, frontend en Vercel
            y canalización continua en GitHub Actions se encuentran operacionales. 
            El lienzo está limpio para comenzar a desarrollar los módulos de la aplicación.
          </p>
        </div>

        {/* Status Grid */}
        <div className="status-grid">
          <div className="status-card glass-panel">
            <div className="status-card-header">
              <span className="status-icon">🚀</span>
              <span className="status-name">Backend (Go)</span>
              <span className={`badge ${isBackendOnline ? 'badge-success' : 'badge-error'}`}>
                {isBackendOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="status-card-body">
              <div className="status-item">
                <span className="status-label">Latencia</span>
                <span className="status-value">{latency !== null ? `${latency} ms` : '—'}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Uptime</span>
                <span className="status-value">{health?.uptime || '—'}</span>
              </div>
            </div>
          </div>

          <div className="status-card glass-panel">
            <div className="status-card-header">
              <span className="status-icon">🐘</span>
              <span className="status-name">PostgreSQL (Neon)</span>
              <span className={`badge ${isDbConnected ? 'badge-success' : 'badge-error'}`}>
                {isDbConnected ? 'Conectada' : 'Sin conexión'}
              </span>
            </div>
            <div className="status-card-body">
              <div className="status-item">
                <span className="status-label">Driver</span>
                <span className="status-value">GORM + pgx</span>
              </div>
              <div className="status-item">
                <span className="status-label">Modo</span>
                <span className="status-value">Serverless SSL</span>
              </div>
            </div>
          </div>

          <div className="status-card glass-panel">
            <div className="status-card-header">
              <span className="status-icon">⚛️</span>
              <span className="status-name">Frontend (React)</span>
              <span className="badge badge-success">Activo</span>
            </div>
            <div className="status-card-body">
              <div className="status-item">
                <span className="status-label">Stack</span>
                <span className="status-value">Vite + React 19</span>
              </div>
              <div className="status-item">
                <span className="status-label">Hosting</span>
                <span className="status-value">Vercel Edge</span>
              </div>
            </div>
          </div>

          <div className="status-card glass-panel">
            <div className="status-card-header">
              <span className="status-icon">🔄</span>
              <span className="status-name">Pipeline CI/CD</span>
              <span className="badge badge-info">Automatizado</span>
            </div>
            <div className="status-card-body">
              <div className="status-item">
                <span className="status-label">Trigger</span>
                <span className="status-value">git push origin main</span>
              </div>
              <div className="status-item">
                <span className="status-label">Acciones</span>
                <span className="status-value">Go Vet + Vite Build</span>
              </div>
            </div>
          </div>
        </div>

        {/* Development Placeholder */}
        <div className="canvas-card glass-panel">
          <div className="canvas-icon">✨</div>
          <h2 className="canvas-title">Espacio Base Inicial</h2>
          <p className="canvas-subtitle">
            Crea tu primer módulo o componente cuando estés listo.
          </p>
          {healthError && (
            <div className="error-banner">
              ⚠️ Nota de conexión: {healthError}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Sinapsa &bull; Infraestructura de Producción 100% Gratuita</p>
      </footer>
    </div>
  )
}

export default App
