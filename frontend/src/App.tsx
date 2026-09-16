import React, { useState, useEffect } from 'react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_URL || ''

export const App: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<string>('Verificando...')
  const [isOnline, setIsOnline] = useState<boolean>(false)

  useEffect(() => {
    fetch(`${API_BASE}/api/health`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          setIsOnline(true)
          setSystemStatus('Sistema en línea')
        } else {
          setIsOnline(false)
          setSystemStatus('Sistema degradado')
        }
      })
      .catch(() => {
        setIsOnline(false)
        setSystemStatus('Sin conexión')
      })
  }, [])

  return (
    <div className="saas-layout">
      {/* Sidebar */}
      <aside className="saas-sidebar">
        <div className="sidebar-header">
          <div className="brand-group">
            <span className="brand-title gradient-text">SINAPSA</span>
            <span className="brand-badge">SaaS Médico</span>
          </div>
        </div>

        {/* Espacio vacío para navegación de módulos médicos */}
        <div className="sidebar-nav">
          {/* Aquí empezaremos a agregar los menús: Pacientes, Citas, Médicos, etc. */}
        </div>

        {/* Pie de Sidebar con estado del sistema */}
        <div className="sidebar-footer">
          <div className="system-pill">
            <span className={`status-indicator-dot ${isOnline ? 'online' : 'offline'}`}></span>
            <span className="system-status-text">{systemStatus}</span>
          </div>
        </div>
      </aside>

      {/* Área Principal */}
      <div className="saas-main">
        {/* Barra superior */}
        <header className="topbar">
          <div className="topbar-left">
            <span className="view-title">Espacio de Trabajo</span>
          </div>
          <div className="topbar-right">
            {/* Espacio para acciones o perfil */}
          </div>
        </header>

        {/* Pantalla principal vacía */}
        <main className="content-viewport">
          <div className="empty-workspace-canvas">
            <div className="canvas-content">
              <span className="canvas-icon">🏥</span>
              <h2>Centro Médico</h2>
              <p>Espacio principal vacío listo para diseñar el primer módulo.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
