import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { inviteUser, listUsers, logoutReq } from "../lib/api"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteMsg, setInviteMsg] = useState<string | null>(null)
  const [inviteErr, setInviteErr] = useState<string | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  const isAdmin = user?.role === "admin"

  const fetchUsers = async () => {
    if (!isAdmin) return
    setLoadingUsers(true)
    try {
      const data = await listUsers()
      setUsers(data.users || [])
    } catch {}
    setLoadingUsers(false)
  }

  useEffect(() => { fetchUsers() }, [isAdmin])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviteErr(null); setInviteMsg(null)
    if (!inviteEmail.trim()) { setInviteErr("Ingresa un correo"); return }
    try {
      const data = await inviteUser(inviteEmail.trim())
      setInviteMsg(data.message || `Invitado ${inviteEmail}`)
      setInviteEmail("")
      fetchUsers()
    } catch (e: any) {
      setInviteErr(e.message)
    }
  }

  const handleLogout = async () => {
    try { await logoutReq() } catch {}
    logout()
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-bg font-jakarta">
      <header className="h-[64px] border-b border-line bg-white sticky top-0 z-30">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="w-7 h-7 grid place-items-center bg-teal-600 text-white rounded-lg font-extrabold text-sm">S</span>
            <span className="font-extrabold tracking-tighter text-lg">sinapsa</span>
            <span className="hidden sm:inline-flex text-[11px] font-bold tracking-widest uppercase bg-teal-50 text-teal-600 border border-[#ccfbf1] px-2 py-1 rounded-full">plataforma</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right leading-tight">
              <div className="text-sm font-bold text-ink-900">{user?.email}</div>
              <div className="text-xs font-bold tracking-widest uppercase text-ink-400">{user?.role}</div>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold border ${isAdmin ? "bg-ink-900 text-white border-ink-900" : "bg-white border-line text-ink-600"}`}>
              {isAdmin ? "ADMIN" : "USER"}
            </span>
            <button onClick={handleLogout} className="rounded-full bg-white border border-line px-4 py-2 text-sm font-bold hover:bg-bg-muted transition">Cerrar sesión</button>
          </div>
        </div>
      </header>

      <main className="max-w-[1180px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Hello World */}
        <div className="bg-white border border-line rounded-[20px] shadow-soft p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-60 h-60 rounded-full opacity-20" style={{ background: "radial-gradient(300px 200px at 50% 50%, #14b8a6, transparent 70%)" }} />
          <h1 className="text-[28px] sm:text-[36px] font-extrabold tracking-tighter leading-none relative">
            Hello World <span className="inline-block animate-[pulseSoft_1.6s_infinite]">👋</span>
          </h1>
          <p className="text-ink-600 mt-2 max-w-[640px] leading-6 relative">
            Bienvenido a la plataforma Sinapsa. Has entrado con <strong className="text-ink-900">OTP sin contraseña</strong> vía Resend. Este es el punto de partida — desde aquí construiremos citas, expediente, recetas y auditoría.
          </p>
          <div className="mt-4 inline-flex flex-wrap gap-2 relative">
            <span className="bg-teal-50 border border-[#ccfbf1] text-teal-700 px-3 py-1.5 rounded-full text-xs font-bold">✓ Autenticado con OTP</span>
            <span className="bg-bg-soft border border-line px-3 py-1.5 rounded-full text-xs font-bold text-ink-600">JWT válido 7 días</span>
            <span className="bg-bg-soft border border-line px-3 py-1.5 rounded-full text-xs font-bold text-ink-600">Resend operativo</span>
          </div>
          <div className="mt-6 grid sm:grid-cols-3 gap-3 relative">
            <div className="bg-bg-soft border border-line rounded-2xl p-4">
              <small className="text-[11px] font-extrabold tracking-widest uppercase text-ink-400">Usuario</small>
              <div className="font-bold text-ink-900 mt-1 break-all">{user?.email}</div>
              <div className="text-xs font-semibold text-ink-500 mt-1">ID: {user?.id}</div>
            </div>
            <div className="bg-bg-soft border border-line rounded-2xl p-4">
              <small className="text-[11px] font-extrabold tracking-widest uppercase text-ink-400">Rol</small>
              <div className="font-bold text-ink-900 mt-1 capitalize">{user?.role}</div>
              <div className="text-xs font-semibold text-ink-500 mt-1">{isAdmin ? "Puede invitar correos" : "Acceso por invitación"}</div>
            </div>
            <div className="bg-teal-600 text-white rounded-2xl p-4">
              <small className="text-[11px] font-extrabold tracking-widest uppercase text-white/70">Estado</small>
              <div className="font-bold mt-1">Sesión activa ✅</div>
              <div className="text-xs font-semibold text-white/80 mt-1">Plataforma lista para construir</div>
            </div>
          </div>
        </div>

        {/* Admin: invitaciones */}
        {isAdmin ? (
          <div className="mt-6 grid lg:grid-cols-[0.95fr_1.15fr] gap-6">
            <div className="bg-white border border-line rounded-2xl shadow-soft p-6">
              <h2 className="font-bold tracking-tight text-lg">Invitar por correo</h2>
              <p className="text-sm text-ink-600 mt-1 leading-5">Solo el admin puede dar de alta correos. El invitado podrá entrar con OTP en <span className="font-mono text-xs bg-bg-muted px-1 py-0.5 rounded">/login</span> sin contraseña.</p>
              <form onSubmit={handleInvite} className="mt-4 grid gap-3">
                <label className="grid gap-1.5">
                  <span className="text-sm font-bold text-ink-800">Correo a invitar</span>
                  <input
                    type="email"
                    required
                    placeholder="doctor@clinica.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full rounded-xl border border-line px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                </label>
                {inviteErr && <div className="bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] px-3 py-2.5 rounded-xl text-sm font-semibold">{inviteErr}</div>}
                {inviteMsg && <div className="bg-teal-50 border border-[#99f6e4] text-teal-900 px-3 py-2.5 rounded-xl text-sm font-semibold">{inviteMsg}</div>}
                <button className="rounded-full bg-teal-600 text-white px-5 py-3 font-bold shadow hover:bg-teal-900 transition">Invitar correo →</button>
              </form>
              <p className="text-xs font-semibold text-ink-400 mt-3 leading-4">Se envía email vía Resend si está configurado (si no, solo se da de alta y el log muestra el estado).</p>
            </div>

            <div className="bg-white border border-line rounded-2xl shadow-soft p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold tracking-tight">Correos con acceso</h3>
                <button onClick={fetchUsers} className="text-xs font-bold text-teal-600 hover:text-teal-800">↻ Actualizar</button>
              </div>
              {loadingUsers ? (
                <div className="mt-4 text-sm text-ink-500">Cargando…</div>
              ) : users.length === 0 ? (
                <div className="mt-4 text-sm text-ink-500">Sin usuarios.</div>
              ) : (
                <div className="mt-4 grid gap-2 max-h-[320px] overflow-auto pr-1">
                  {users.map((u: any) => (
                    <div key={u.id} className="flex items-center gap-3 bg-bg-soft border border-line rounded-xl px-3.5 py-3">
                      <span className={`w-8 h-8 grid place-items-center rounded-full text-xs font-extrabold shrink-0 ${u.role === "admin" ? "bg-ink-900 text-white" : "bg-white border border-line text-ink-600"}`}>{u.email[0]?.toUpperCase()}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold truncate">{u.email}</div>
                        <div className="text-xs font-semibold text-ink-400">{u.role} · {new Date(u.createdAt).toLocaleDateString("es-GT")}</div>
                      </div>
                      <span className={`text-[11px] font-extrabold tracking-widest uppercase px-2 py-1 rounded-full border shrink-0 ${u.isActive ? "bg-teal-50 text-teal-600 border-[#ccfbf1]" : "bg-[#fef2f2] text-[#dc2626] border-[#fecaca]"}`}>{u.isActive ? "activo" : "inactivo"}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs font-semibold text-amber-900 leading-5">
                💡 Tip: el admin pre-seedeado es <span className="font-mono">estebancarcamou@gmail.com</span>. Ese correo entra sin invitación y puede invitar al resto.
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 bg-white border border-line rounded-2xl p-6 text-sm text-ink-600 leading-6">
            <strong className="text-ink-900">¿Necesitas invitar a alguien?</strong> Solo el administrador (<span className="font-mono bg-bg-muted px-1 py-0.5 rounded text-xs">estebancarcamou@gmail.com</span>) puede dar de alta nuevos correos desde esta plataforma.
          </div>
        )}

        <div className="mt-8 text-center text-xs font-semibold text-ink-400">
          Sinapsa · Plataforma en construcción · <Link to="/" className="underline hover:text-ink-600">Ver landing</Link>
        </div>
      </main>
    </div>
  )
}
