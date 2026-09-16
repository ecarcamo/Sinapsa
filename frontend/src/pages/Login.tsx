import { useState, useRef, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { requestOTP, verifyOTP } from "../lib/api"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const nav = useNavigate()
  const { login, user } = useAuth()
  const [step, setStep] = useState<"email" | "code">("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [devHint, setDevHint] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)
  const codeRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (user) nav("/app", { replace: true })
  }, [user, nav])

  useEffect(() => {
    if (cooldown <= 0) return
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [cooldown])

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null); setMsg(null); setDevHint(null)
    if (!email.trim()) { setErr("Ingresa tu correo"); return }
    setLoading(true)
    try {
      const data = await requestOTP(email.trim())
      setMsg(data.message || "Código enviado. Revisa tu correo (y spam).")
      if (data.devHint) setDevHint(data.devHint)
      setStep("code")
      setCooldown(30)
      // auto focus first code box
      setTimeout(() => codeRefs.current[0]?.focus(), 100)
    } catch (e: any) {
      setErr(e.message)
    } finally { setLoading(false) }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    if (code.length !== 6) { setErr("El código debe tener 6 dígitos"); return }
    setLoading(true)
    try {
      const data = await verifyOTP(email.trim(), code.trim())
      login(data.token, data.user)
      nav("/app")
    } catch (e: any) {
      setErr(e.message)
    } finally { setLoading(false) }
  }

  const handleCodeChange = (idx: number, val: string) => {
    const v = val.replace(/\D/g, "").slice(0, 1)
    const next = code.split("")
    // pad
    while (next.length < 6) next.push("")
    next[idx] = v
    const joined = next.join("").slice(0, 6)
    setCode(joined)
    if (v && idx < 5) codeRefs.current[idx + 1]?.focus()
    if (!v && idx > 0) {
      // handled by keydown
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (t.length === 6) {
      e.preventDefault()
      setCode(t)
      codeRefs.current[5]?.focus()
    }
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      codeRefs.current[idx - 1]?.focus()
    }
  }

  // Si el usuario pegó código en el input hidden, también soportamos single input fallback
  const codeDigits = code.padEnd(6, "").split("").slice(0, 6)

  return (
    <div className="min-h-screen bg-bg font-jakarta flex flex-col">
      {/* Header simple */}
      <header className="h-[64px] border-b border-line bg-white/80 backdrop-blur-xl sticky top-0 z-30">
        <nav className="max-w-[1180px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="grid place-items-center w-7 h-7 rounded-lg bg-teal-600 text-white font-extrabold text-sm">S</span>
            <span className="font-extrabold text-[19px] tracking-tighter">sinapsa</span>
            <span className="hidden sm:inline-flex text-[11px] font-bold tracking-widest uppercase text-teal-600 bg-teal-50 border border-[#ccfbf1] px-2 py-1 rounded-full">SaaS médico</span>
          </Link>
          <Link to="/" className="text-sm font-bold text-ink-600 hover:text-ink-900">← Volver a la landing</Link>
        </nav>
      </header>

      <main className="flex-1 grid lg:grid-cols-[1.05fr_0.95fr] max-w-[1180px] mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 gap-8 items-center">
        {/* Izquierda: copy */}
        <div className="order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 bg-white border border-line rounded-full px-3 py-1.5 shadow-soft text-xs font-bold text-ink-600 mb-4">
            <span className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_0_6px_rgba(20,184,166,.16)]" />
            Acceso solo por invitación · Sin contraseñas
          </div>
          <h1 className="text-[28px] sm:text-[36px] font-extrabold tracking-tighter leading-[1] text-ink-900">
            Entra a Sinapsa <br />
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">con tu correo y un código.</span>
          </h1>
          <p className="mt-3 text-[15px] leading-6 text-ink-600 max-w-[520px]">
            Esta plataforma funciona <strong className="text-ink-900">solo con correos invitados</strong>. Si tu correo está dado de alta, te enviamos un <strong className="text-ink-900">código OTP de 6 dígitos</strong> que expira en 10 minutos. Sin contraseñas, más seguro y sin fricción.
          </p>
          <ul className="mt-5 grid gap-2 text-sm font-semibold text-ink-700">
            <li className="flex gap-2"><span className="w-6 h-6 grid place-items-center bg-teal-50 text-teal-600 rounded-full text-xs border border-[#ccfbf1]">✓</span> El admin <span className="font-mono bg-bg-muted px-1.5 py-0.5 rounded text-xs">estebancarcamou@gmail.com</span> ya tiene acceso sin invitación</li>
            <li className="flex gap-2"><span className="w-6 h-6 grid place-items-center bg-teal-50 text-teal-600 rounded-full text-xs border border-[#ccfbf1]">✓</span> Si no estás invitado verás un mensaje y debes contactar al admin</li>
            <li className="flex gap-2"><span className="w-6 h-6 grid place-items-center bg-teal-50 text-teal-600 rounded-full text-xs border border-[#ccfbf1]">✓</span> Cada código solo sirve una vez y expira en 10 min</li>
          </ul>
          <div className="mt-6 bg-white border border-line rounded-2xl p-4 text-sm text-ink-600 leading-5">
            <strong className="text-ink-900">¿No te llega el código?</strong> Revisa spam / promociones, añade <code className="bg-bg-muted px-1 py-0.5 rounded text-xs">noreply@resend.dev</code> a contactos y solicita reenvío tras 30s.
          </div>
        </div>

        {/* Derecha: card login */}
        <div className="order-1 lg:order-2 w-full max-w-[480px] mx-auto lg:mx-0 lg:ml-auto">
          <div className="bg-white border border-line rounded-[20px] shadow-card p-6 sm:p-7">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-10 grid place-items-center bg-teal-600 text-white rounded-xl font-extrabold">S</span>
              <div>
                <h2 className="font-extrabold tracking-tight leading-none">Iniciar sesión</h2>
                <p className="text-xs font-semibold text-ink-400">Solo correos invitados · OTP por email</p>
              </div>
              <span className={`ml-auto text-[11px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full border ${step === "email" ? "bg-bg-soft border-line text-ink-600" : "bg-teal-50 text-teal-600 border-[#ccfbf1]"}`}>
                {step === "email" ? "Paso 1/2" : "Paso 2/2"}
              </span>
            </div>

            {err && (
              <div className="mb-4 bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] px-3.5 py-3 rounded-xl text-sm font-semibold leading-5">
                {err}
              </div>
            )}
            {msg && (
              <div className="mb-4 bg-teal-50 border border-[#99f6e4] text-teal-900 px-3.5 py-3 rounded-xl text-sm font-semibold leading-5">
                {msg}
              </div>
            )}
            {devHint && (
              <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-3 rounded-xl text-xs font-mono">
                {devHint} — visible solo en APP_ENV=development
              </div>
            )}

            {step === "email" ? (
              <form onSubmit={handleRequest} className="grid gap-4">
                <label className="grid gap-1.5">
                  <span className="text-sm font-bold text-ink-800">Correo electrónico</span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="tu@clinica.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] font-medium placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition"
                  />
                  <span className="text-xs font-semibold text-ink-400">Usa el correo con el que fuiste invitado. El admin es estebancarcamou@gmail.com</span>
                </label>
                <button
                  disabled={loading}
                  className="inline-flex justify-center items-center rounded-full bg-teal-600 text-white px-6 py-3.5 font-bold shadow-[0_8px_20px_rgba(15,118,110,.28)] hover:bg-teal-900 disabled:opacity-60 disabled:cursor-not-allowed transition min-h-[48px]"
                >
                  {loading ? "Enviando…" : "Enviar código →"}
                </button>
                <p className="text-xs font-semibold text-ink-400 text-center leading-5">
                  Al continuar aceptas los Términos y la Política de Privacidad.
                </p>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="grid gap-4" onPaste={handlePaste}>
                <div className="grid gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-ink-800">Código de 6 dígitos</span>
                    <span className="text-xs font-bold text-ink-500">enviado a <span className="text-ink-900">{email}</span></span>
                  </div>
                  <div className="flex gap-2 justify-between">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <input
                        key={i}
                        ref={(el) => { codeRefs.current[i] = el }}
                        inputMode="numeric"
                        maxLength={1}
                        value={codeDigits[i] || ""}
                        onChange={(e) => handleCodeChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        className="w-[52px] h-[56px] sm:w-[60px] sm:h-[60px] text-center text-xl font-extrabold tracking-widest rounded-xl border border-line bg-bg-soft focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-ink-400">Expira en 10 minutos. Revisa spam si no lo ves.</span>
                </div>

                {/* Fallback input invisible for autofill (some browsers) */}
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="sr-only"
                  aria-hidden
                  tabIndex={-1}
                />

                <button
                  disabled={loading || code.length !== 6}
                  className="inline-flex justify-center items-center rounded-full bg-ink-900 text-white px-6 py-3.5 font-bold hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition min-h-[48px]"
                >
                  {loading ? "Verificando…" : "Verificar y entrar"}
                </button>

                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <button type="button" onClick={() => { setStep("email"); setCode(""); setErr(null) }} className="font-bold text-ink-600 hover:text-ink-900">
                    ← Cambiar correo
                  </button>
                  <button
                    type="button"
                    disabled={cooldown > 0 || loading}
                    onClick={handleRequest}
                    className="font-bold text-teal-600 hover:text-teal-800 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {cooldown > 0 ? `Reenviar en ${cooldown}s` : "Reenviar código"}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-5 pt-5 border-t border-line flex items-center justify-between text-xs font-bold text-ink-400">
              <span>🔒 Sin contraseñas · Código por Resend</span>
              <span className="hidden sm:inline">Soporte: hola@sinapsa.health</span>
            </div>
          </div>

          <p className="text-center text-xs font-semibold text-ink-400 mt-3">
            Solo correos invitados pueden entrar. Si necesitas acceso, pide al admin que te invite desde la plataforma.
          </p>
        </div>
      </main>
    </div>
  )
}
