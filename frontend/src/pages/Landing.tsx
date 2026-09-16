import { useEffect, useRef, useState } from "react"

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 }
    )
    el.querySelectorAll(".reveal").forEach((n) => obs.observe(n))
    return () => obs.disconnect()
  }, [])
  return ref
}

export default function Landing() {
  const rootRef = useReveal()
  const [annual, setAnnual] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [mobileNav, setMobileNav] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2800)
  }
  const price = (m: number) => (annual ? Math.round(m * 0.8) : m)

  return (
    <div ref={rootRef} className="min-h-screen bg-bg font-jakarta text-ink-900 antialiased overflow-x-hidden">
      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/85 border-b border-line">
        <nav className="max-w-[1180px] mx-auto px-4 sm:px-6 h-[64px] sm:h-[72px] flex items-center justify-between gap-3 sm:gap-6">
          <a href="#" className="inline-flex items-center gap-2 sm:gap-2.5 shrink-0" aria-label="Sinapsa inicio">
            <span className="grid place-items-center">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="8" fill="#0F766E" />
                <path d="M14 7c-1.2 2.2-3.6 3.1-5.5 2.6 1.1 1.6 1 3.8-.4 5.3 1.9-.5 3.9.2 5 1.8 1.1-1.6 3.1-2.3 5-1.8-1.4-1.5-1.5-3.7-.4-5.3-1.9.5-4.3-.4-5.5-2.6Z" fill="white" fillOpacity="0.95" />
                <circle cx="14" cy="14" r="2.2" fill="white" />
              </svg>
            </span>
            <span className="font-extrabold text-[19px] sm:text-[21px] tracking-tighter text-ink-900">sinapsa</span>
            <span className="hidden sm:inline-flex text-[11px] font-bold tracking-widest uppercase text-teal-600 bg-teal-50 border border-[#ccfbf1] px-2 py-1 rounded-full">SaaS médico</span>
          </a>

          <div className="hidden lg:flex items-center gap-[22px] text-sm font-semibold text-ink-600">
            <a href="#producto" className="hover:text-ink-900 transition-colors">Producto</a>
            <a href="#soluciones" className="hover:text-ink-900 transition-colors">Soluciones</a>
            <a href="#precios" className="hover:text-ink-900 transition-colors">Precios</a>
            <a href="#testimonios" className="hover:text-ink-900 transition-colors">Casos</a>
            <a href="#faq" className="hover:text-ink-900 transition-colors">FAQ</a>
          </div>

          {mobileNav && <button aria-hidden onClick={() => setMobileNav(false)} className="lg:hidden fixed inset-0 top-[64px] bg-ink-900/20 backdrop-blur-[2px] z-30" />}
          <div className={`${mobileNav ? "flex" : "hidden"} lg:hidden absolute inset-x-0 top-[64px] sm:top-[72px] flex-col gap-1 bg-white border-t border-line p-4 shadow-card z-40 max-h-[calc(100dvh-64px)] overflow-y-auto`}>
            <a href="#producto" onClick={() => setMobileNav(false)} className="px-3 py-3.5 rounded-xl hover:bg-bg-soft font-semibold text-ink-600 text-[15px]">Producto</a>
            <a href="#soluciones" onClick={() => setMobileNav(false)} className="px-3 py-3.5 rounded-xl hover:bg-bg-soft font-semibold text-ink-600 text-[15px]">Soluciones</a>
            <a href="#precios" onClick={() => setMobileNav(false)} className="px-3 py-3.5 rounded-xl hover:bg-bg-soft font-semibold text-ink-600 text-[15px]">Precios</a>
            <a href="#faq" onClick={() => setMobileNav(false)} className="px-3 py-3.5 rounded-xl hover:bg-bg-soft font-semibold text-ink-600 text-[15px]">FAQ</a>
            <div className="grid gap-2.5 mt-2 pt-3 border-t border-line">
              <a href="/login" onClick={() => setMobileNav(false)} className="inline-flex justify-center rounded-full border border-line bg-white px-5 py-3.5 font-bold min-h-11">Iniciar sesión</a>
              <a href="#precios" onClick={() => setMobileNav(false)} className="inline-flex justify-center rounded-full bg-teal-600 text-white px-5 py-3.5 font-bold shadow-soft min-h-11">Probar 14 días gratis</a>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <a href="/login" className="hidden lg:inline-flex items-center justify-center rounded-full px-[18px] py-2.5 text-sm font-bold text-ink-600 hover:bg-bg-muted transition-colors">Iniciar sesión</a>
            <a href="#precios" className="hidden lg:inline-flex items-center justify-center rounded-full bg-teal-600 text-white px-[18px] py-2.5 text-sm font-bold shadow-[0_8px_20px_rgba(15,118,110,.28)] hover:bg-teal-900 hover:-translate-y-px transition-all">Probar 14 días gratis</a>
            <button aria-label="Abrir menú" aria-expanded={mobileNav} onClick={() => setMobileNav(!mobileNav)} className="lg:hidden w-11 h-11 rounded-xl border border-line bg-white grid place-items-center shrink-0">
              <span className="flex flex-col gap-[5px]"><i className={`block w-[18px] h-0.5 bg-ink-800 rounded-full transition ${mobileNav ? "translate-y-[7px] rotate-45" : ""}`} /><i className={`block w-[18px] h-0.5 bg-ink-800 rounded-full transition ${mobileNav ? "opacity-0" : ""}`} /><i className={`block w-[18px] h-0.5 bg-ink-800 rounded-full transition ${mobileNav ? "-translate-y-[7px] -rotate-45" : ""}`} /></span>
            </button>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 h-[720px] sm:h-[640px] pointer-events-none" style={{ background: "radial-gradient(700px 400px at 18% 8%, rgba(20,184,166,.14), transparent 60%), radial-gradient(800px 500px at 88% 0%, rgba(59,130,246,.10), transparent 55%), radial-gradient(900px 600px at 50% 55%, rgba(15,118,110,.05), transparent 60%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)" }} aria-hidden />
        <div className="relative max-w-[1180px] mx-auto px-4 sm:px-6 grid lg:grid-cols-[1.05fr_0.95fr] gap-8 sm:gap-10 lg:gap-12 items-start lg:items-center lg:min-h-[540px] py-6 sm:py-10">
          <div className="flex flex-col justify-center reveal order-1">
            <div className="inline-flex items-center gap-2 bg-white border border-line rounded-full pl-2.5 pr-1.5 py-1 sm:py-1.5 shadow-soft text-[11px] sm:text-[13px] font-semibold text-ink-600 w-fit max-w-full">
              <span className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_0_6px_rgba(20,184,166,.16)] shrink-0" />
              <span className="truncate">Nuevo · Módulos por especialidad — activa solo lo que usas</span>
              <span className="hidden xs:grid place-items-center w-6 h-6 rounded-full bg-ink-900 text-white text-xs ml-1 shrink-0">→</span>
            </div>
            <h1 className="mt-3 sm:mt-4 text-[30px] xs:text-[32px] sm:text-[clamp(36px,5vw,54px)] leading-[0.96] tracking-tighter font-extrabold text-ink-900">
              El sistema operativo <span className="bg-gradient-to-r from-teal-600 via-[#0e7490] to-blue-600 bg-clip-text text-transparent">para tu centro médico.</span>
            </h1>
            <p className="mt-3 sm:mt-3.5 text-[15px] sm:text-[17px] leading-[1.6] text-ink-600 max-w-[560px]">
              Sinapsa gestiona todo el ciclo del paciente — <strong className="text-ink-900">citas, expediente clínico, recetas, auditoría y facturación</strong> — con módulos por especialidad para que cada doctor trabaje como necesita, sin pagar de más.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-5 sm:mt-6">
              <a href="#precios" className="inline-flex items-center justify-center rounded-full bg-teal-600 text-white px-6 py-3.5 sm:py-3.5 text-[15px] font-bold shadow-[0_8px_20px_rgba(15,118,110,.28)] hover:bg-teal-900 active:scale-[0.98] transition-all min-h-[48px] w-full sm:w-auto">Empezar gratis — 14 días</a>
              <a href="/login" className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-ink-900 border border-line px-6 py-3.5 text-[15px] font-bold shadow-soft hover:border-line-strong active:scale-[0.98] transition-all min-h-[48px] w-full sm:w-auto"><span className="grid place-items-center w-[22px] h-[22px] rounded-full bg-ink-900 text-white text-[10px]">▶</span> Ver demo en 2 min</a>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-[12px] sm:text-[13px] font-semibold text-ink-600">
              <span><i className="not-italic text-teal-600 font-extrabold mr-1">✓</i> Sin permanencia</span>
              <span><i className="not-italic text-teal-600 font-extrabold mr-1">✓</i> Migración gratuita</span>
              <span><i className="not-italic text-teal-600 font-extrabold mr-1">✓</i> Soporte en Guatemala</span>
            </div>
          </div>

          <div className="relative reveal reveal-delay-1 w-full max-w-[640px] mx-auto lg:mx-0 order-2">
            <div className="bg-white border border-line rounded-[16px] sm:rounded-[20px] overflow-hidden shadow-[0_12px_32px_rgba(15,23,42,.10),0_4px_12px_rgba(15,23,42,.06)] sm:shadow-[0_24px_64px_rgba(15,23,42,.12),0_8px_24px_rgba(15,23,42,.08)] sm:animate-[float_6s_ease-in-out_infinite]">
              <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-3.5 py-2.5 sm:py-3 bg-bg-soft border-b border-line text-[11px] sm:text-xs font-semibold text-ink-400">
                <span className="hidden xs:flex gap-1.5"><i className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#fca5a5] block" /><i className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#fde68a] block" /><i className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#86efac] block" /></span>
                <span className="flex-1 text-center font-semibold text-ink-600 truncate text-[11px] sm:text-xs">app.sinapsa.health · Agenda de hoy</span>
                <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-[#dcfce7] text-[#166534] px-1.5 sm:px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-bold shrink-0"><span className="w-[6px] sm:w-[7px] h-[6px] sm:h-[7px] rounded-full bg-[#16a34a] animate-[pulseSoft_1.6s_infinite]" /> En vivo</span>
              </div>
              <div className="p-3 sm:p-4 bg-gradient-to-b from-white to-bg-soft">
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 mb-3">
                  <div className="bg-white border border-line rounded-lg sm:rounded-xl p-2 sm:p-3"><small className="block text-[9px] sm:text-[11px] font-bold tracking-widest uppercase text-ink-400 leading-none">Pacientes hoy</small><strong className="block text-[15px] sm:text-lg tracking-tighter mt-1">28</strong><em className="not-italic text-[10px] sm:text-xs font-bold text-teal-600 bg-teal-50 px-1 sm:px-1.5 py-0.5 rounded-full inline-block mt-0.5">+6 vs ayer</em></div>
                  <div className="bg-white border border-line rounded-lg sm:rounded-xl p-2 sm:p-3"><small className="block text-[9px] sm:text-[11px] font-bold tracking-widest uppercase text-ink-400 leading-none">Ingresos mes</small><strong className="block text-[15px] sm:text-lg tracking-tighter mt-1">Q 18,420</strong><em className="not-italic text-[10px] sm:text-xs font-bold text-teal-600 bg-teal-50 px-1 sm:px-1.5 py-0.5 rounded-full inline-block mt-0.5">+12%</em></div>
                  <div className="bg-white border border-line rounded-lg sm:rounded-xl p-2 sm:p-3"><small className="block text-[9px] sm:text-[11px] font-bold tracking-widest uppercase text-ink-400 leading-none">No-shows</small><strong className="block text-[15px] sm:text-lg tracking-tighter mt-1">3,2%</strong><em className="not-italic text-[10px] sm:text-xs font-bold text-teal-600 bg-teal-50 px-1 sm:px-1.5 py-0.5 rounded-full inline-block mt-0.5">↓ 41%</em></div>
                </div>
                <div className="bg-white border border-line rounded-xl sm:rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-3 sm:px-3.5 py-2.5 sm:py-3 border-b border-line text-[12px] sm:text-[13px]"><strong className="truncate pr-2">Agenda — Dr. Martín · 15 sep</strong><span className="font-bold text-ink-600 bg-bg-muted px-2 sm:px-2.5 py-1 rounded-full text-xs shrink-0">Día ▾</span></div>
                  <div className="p-1.5 sm:p-2 grid gap-1 sm:gap-1.5">
                    {[
                      { h: "09:00", n: "Lucía Ferrer", t: "Revisión · Box 2", s: "confirmada", c: "#0F766E" },
                      { h: "09:30", n: "Marcos Ruiz", t: "Telemedicina", s: "en curso", c: "#2563EB" },
                      { h: "10:15", n: "Ana Beltrán", t: "1ª visita · Cardiología", s: "confirmada", c: "#0F766E" },
                      { h: "11:00", n: "Bloque quirófano", t: "Reservado", s: "bloqueado", c: "#94A3B8" },
                    ].map((r) => (
                      <div key={r.h} className="flex items-center gap-2 sm:gap-2.5 px-2 sm:px-2.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl hover:bg-bg-soft transition-colors">
                        <span className="text-[11px] sm:text-[13px] font-bold text-ink-600 min-w-[38px] sm:min-w-11">{r.h}</span>
                        <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full shrink-0" style={{ background: r.c }} />
                        <div className="flex-1 leading-tight min-w-0"><strong className="block text-[12px] sm:text-[13px] truncate">{r.n}</strong><span className="text-[11px] sm:text-xs text-ink-400 truncate block">{r.t}</span></div>
                        <span className={`hidden xs:inline-flex text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase px-1.5 sm:px-2 py-1 rounded-full border shrink-0 ${r.s === "confirmada" ? "bg-teal-50 text-teal-600 border-[#ccfbf1]" : r.s === "en curso" ? "bg-blue-50 text-blue-600 border-[#dbeafe]" : "bg-bg-muted text-ink-400 border-line"}`}>{r.s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-2.5 sm:mt-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-2.5 sm:p-3">
                  <div className="flex gap-2 sm:gap-2.5 items-center"><span className="w-8 h-8 sm:w-9 sm:h-9 grid place-items-center bg-[#16a34a] text-white rounded-full text-sm sm:text-base shrink-0">💬</span><div className="min-w-0"><strong className="block text-[12px] sm:text-[13px]">Recordatorio enviado</strong><small className="text-[11px] sm:text-xs text-[#15803d] truncate block">WhatsApp · hace 4 min · Entregado ✓✓</small></div><span className="ml-auto text-[#16a34a] font-extrabold hidden sm:block">✓✓</span></div>
                  <p className="mt-2 text-[12px] sm:text-[13px] text-[#14532d] bg-white p-2 sm:p-2.5 rounded-xl border border-[#dcfce7] leading-snug">“Hola Lucía, te esperamos mañana 09:00 en Sinapsa Clínica. Responde SÍ para confirmar.”</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex absolute -left-2.5 bottom-[62px] items-center gap-2.5 bg-white border border-line rounded-2xl p-3 shadow-card text-[13px] leading-tight animate-[float_5.5s_ease-in-out_infinite]"><span className="w-9 h-9 grid place-items-center bg-teal-50 text-teal-600 rounded-[10px] font-extrabold">⚡</span><div><strong className="block text-sm tracking-tight">-41% no-shows</strong><small className="text-ink-400 text-xs">con recordatorios automáticos</small></div></div>
            <div className="hidden lg:flex absolute -right-1.5 -bottom-1.5 items-center gap-2.5 bg-white border border-line rounded-2xl p-3 shadow-card text-[13px] leading-tight animate-[float_6.2s_ease-in-out_infinite_reverse]"><span className="w-9 h-9 grid place-items-center bg-blue-50 text-blue-600 rounded-[10px] font-extrabold">◈</span><div><strong className="block text-sm tracking-tight">Auditoría + Módulos</strong><small className="text-ink-400 text-xs">Trazabilidad total por especialidad</small></div></div>
          </div>
        </div>
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="mt-3 sm:mt-4 bg-white border border-line rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 p-3 sm:p-4 shadow-soft reveal">
            <small className="text-[11px] sm:text-xs font-extrabold tracking-widest uppercase text-ink-400 whitespace-nowrap">Pensado para Guatemala</small>
            <div className="flex flex-wrap gap-2 sm:gap-4 font-extrabold tracking-tight text-[#94a3b8] text-[11px] sm:text-[13px]">
              <span>Clínicas privadas</span><span>Consultorios</span><span>Policlínicas</span><span className="hidden xs:inline">Centros de especialidades</span><span className="hidden sm:inline">Redes médicas</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA / SOLUCIÓN */}
      <section className="py-8 sm:py-12 lg:py-[72px]">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-3 sm:gap-4 reveal">
            <div className="bg-[#fff7ed] border border-[#ffedd5] rounded-[16px] sm:rounded-[20px] p-4 sm:p-6">
              <h3 className="text-[15px] sm:text-lg font-bold mb-2.5 sm:mb-3">Sin Sinapsa</h3>
              <ul className="grid gap-2 sm:gap-2.5">
                {["Agenda en papeles, Excel y chats perdidos","Expedientes y recetas sin trazabilidad","Auditoría imposible: nadie sabe quién editó qué","Cobros manuales y reportes que toman días"].map((t)=>(
                  <li key={t} className="flex gap-2 sm:gap-2.5 text-[13px] sm:text-sm font-semibold text-[#7c2d12] leading-snug"><span className="w-5 h-5 sm:w-6 sm:h-6 grid place-items-center bg-white border border-[#fed7aa] rounded-full text-[#ea580c] text-[10px] sm:text-[11px] shrink-0 mt-0.5">✕</span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="bg-ink-900 text-white rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 relative overflow-hidden">
              <span className="inline-block bg-teal-500 text-white text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full mb-2.5 sm:mb-3">Con Sinapsa</span>
              <h3 className="text-[18px] sm:text-[22px] leading-none tracking-tighter font-bold">Gestión completa. Auditoría total.</h3>
              <p className="text-[#cbd5e1] text-[13px] sm:text-sm mt-2 sm:mt-2.5 mb-3 sm:mb-4 leading-relaxed">Un solo lugar para <strong className="text-white">citas, expediente, recetas, órdenes, auditoría y facturación</strong>. Cada acción queda registrada y cada especialidad tiene su módulo.</p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 border-t border-white/10 pt-3 sm:pt-3.5">
                <div><strong className="block text-[18px] sm:text-xl tracking-tight text-[#5eead4]">360°</strong><span className="text-[11px] sm:text-xs text-ink-400 leading-tight block mt-0.5">paciente: citas · expediente · recetas</span></div>
                <div><strong className="block text-[18px] sm:text-xl tracking-tight text-[#5eead4]">100%</strong><span className="text-[11px] sm:text-xs text-ink-400 leading-tight block mt-0.5">trazable: auditoría por usuario y fecha</span></div>
                <div><strong className="block text-[18px] sm:text-xl tracking-tight text-[#5eead4]">+Módulos</strong><span className="text-[11px] sm:text-xs text-ink-400 leading-tight block mt-0.5">por especialidad, activa a demanda</span></div>
              </div>
              <div className="pointer-events-none absolute -right-10 -bottom-10 w-60 h-60 rounded-full opacity-60 hidden sm:block" style={{ background: "radial-gradient(300px 200px at 50% 50%, rgba(20,184,166,.35), transparent 70%)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTO */}
      <section id="producto" className="py-8 sm:py-12 lg:py-[72px]">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-[720px] mx-auto mb-6 sm:mb-9 reveal">
            <span className="inline-block text-[11px] sm:text-xs font-extrabold tracking-widest uppercase text-teal-600 bg-teal-50 border border-[#ccfbf1] px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full mb-2.5 sm:mb-3">Producto</span>
            <h2 className="text-[24px] sm:text-[clamp(28px,3.6vw,40px)] leading-[0.98] tracking-tighter font-extrabold">Gestión total del paciente. <br className="hidden sm:block"/>Auditable y por especialidad.</h2>
            <p className="text-ink-600 text-[14px] sm:text-base mt-2 sm:mt-3 max-w-[620px] mx-auto leading-relaxed">De la cita a la receta y la factura, todo queda registrado. Activa solo los módulos que tu centro o consultorio necesita.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 reveal">
            <article className="md:col-span-2 lg:col-span-3 grid lg:grid-cols-[1.1fr_0.9fr] gap-4 sm:gap-6 items-center bg-white border border-line rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 shadow-soft">
              <div>
                <span className="w-8 h-8 sm:w-9 sm:h-9 grid place-items-center rounded-xl bg-teal-50 text-teal-600 border border-[#ccfbf1] font-extrabold mb-2.5 sm:mb-3 text-sm">▦</span>
                <h3 className="text-[15px] sm:text-[17px] font-bold tracking-tight mb-1.5 sm:mb-2">Citas y agenda sin fricción</h3>
                <p className="text-[13px] sm:text-sm text-ink-600 leading-5 mb-2.5 sm:mb-3">Agenda multi-doctor, multi-sede y por boxes. Lista de espera inteligente y reprogramación en un clic.</p>
                <ul className="grid gap-1 sm:gap-1.5">{["Recordatorios WhatsApp / SMS / email","Check-in con QR y sala de espera virtual","Sincroniza con Google Calendar"].map((b)=><li key={b} className="flex gap-2 items-start text-[12px] sm:text-[13px] font-semibold text-ink-800 leading-snug"><span className="w-[18px] h-[18px] grid place-items-center bg-teal-50 text-teal-600 border border-[#ccfbf1] rounded-full text-[10px] shrink-0 mt-0.5">✓</span>{b}</li>)}</ul>
              </div>
              <div className="bg-bg-soft border border-line rounded-xl sm:rounded-2xl p-3 sm:p-3.5">
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase text-ink-400 mb-2 sm:mb-2.5"><span>Lun 15</span><span>Mar 16</span><span>Mié 17</span><span>Jue 18</span></div>
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">{Array.from({length:12}).map((_,i)=><span key={i} className={`h-[32px] sm:h-[42px] rounded-lg sm:rounded-xl border ${i===2||i===5 ? "bg-ink-900 border-ink-900 grid place-items-center text-[#5eead4] text-sm after:content-['●']" : i===7 ? "bg-teal-50 border-[#99f6e4] border-dashed" : "bg-white border-line"}`} />)}</div>
              </div>
            </article>

            {[
              { icon:"◈", color:"bg-blue-50 text-blue-600 border-[#dbeafe]", title:"Expediente clínico 360°", desc:"Historia por episodios, signos vitales, alergias, antecedentes y evolución. Todo en un timeline claro.", bullets:["Plantillas y formularios por especialidad","CIE-10, adjuntos, imágenes y PACS","Notas por voz con IA y transcripción"]},
              { icon:"✎", color:"bg-[#f5f3ff] text-violet-600 border-[#ede9fe]", title:"Recetas y órdenes", desc:"Recetas electrónicas, órdenes de laboratorio e interconsultas con firma y trazabilidad completa.", bullets:["Recetario con vademécum y dosis","Envío por WhatsApp / PDF con QR","Control de vigencia y duplicados"]},
              { icon:"◎", color:"bg-teal-50 text-teal-600 border-[#ccfbf1]", title:"Pacientes y comunicación", desc:"Ficha única, consentimientos informados y portal del paciente. Comunicación sin perder trazabilidad.", bullets:["Portal marca blanca + recordatorios","Consentimientos con firma biométrica","Historial de contacto centralizado"]},
              { icon:"⬣", color:"bg-[#f1f5f9] text-ink-800 border-line", title:"Auditoría completa", desc:"Cada creación, edición y acceso queda registrado: quién, cuándo y qué cambió. Listo para auditoría interna o externa.", bullets:["Log inmutable por usuario y fecha","Control de accesos por rol y sede","Exportable para inspección"]},
              { icon:"⬢", color:"bg-[#fffbeb] text-[#d97706] border-[#fde68a]", title:"Facturación y analítica", desc:"Presupuestos, facturas, cobros con tarjeta y reportes por doctor, servicio y sede. Sin Excel.", bullets:["Cuentas por cobrar y conciliación","Reportes de ocupación e ingresos en Q","Exportación contable"]},
            ].map((f)=>(
              <article key={f.title} className="bg-white border border-line rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 shadow-soft hover:shadow-card hover:border-[#cbd5e1] transition-all">
                <span className={`w-8 h-8 sm:w-9 sm:h-9 grid place-items-center rounded-xl border font-extrabold mb-2.5 sm:mb-3 text-sm ${f.color}`}>{f.icon}</span>
                <h3 className="text-[14px] sm:text-[17px] font-bold tracking-tight leading-tight mb-1.5 sm:mb-2">{f.title}</h3>
                <p className="text-[13px] sm:text-sm text-ink-600 leading-5 mb-2.5 sm:mb-3">{f.desc}</p>
                <ul className="grid gap-1 sm:gap-1.5">{f.bullets.map((b)=><li key={b} className="flex gap-2 items-start text-[12px] sm:text-[13px] font-semibold text-ink-800 leading-snug"><span className="w-[18px] h-[18px] grid place-items-center bg-teal-50 text-teal-600 border border-[#ccfbf1] rounded-full text-[10px] shrink-0 mt-0.5">✓</span>{b}</li>)}</ul>
              </article>
            ))}
          </div>

          <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-2 sm:gap-3 reveal text-center">
            <small className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-ink-400">Se conecta con lo que ya usas</small>
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">{["WhatsApp","Google Calendar","Facturación GT","Stripe","Laboratorios","Zapier","API REST"].map((s)=><span key={s} className="bg-white border border-line px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-[13px] font-bold text-ink-600">{s}</span>)}</div>
          </div>
        </div>
      </section>

      {/* MÓDULOS */}
      <section className="py-8 sm:py-12 lg:py-[72px] bg-white border-y border-line">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-[720px] mx-auto mb-6 sm:mb-9 reveal">
            <span className="inline-block text-[11px] sm:text-xs font-extrabold tracking-widest uppercase text-teal-600 bg-teal-50 border border-[#ccfbf1] px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full mb-2.5 sm:mb-3">Módulos por especialidad</span>
            <h2 className="text-[24px] sm:text-[clamp(28px,3.6vw,40px)] leading-[0.98] tracking-tighter font-extrabold">Tu centro, tus especialidades.<br/>Activa solo lo que atiendes.</h2>
            <p className="text-ink-600 text-[14px] sm:text-base mt-2 sm:mt-3 max-w-[620px] mx-auto leading-relaxed">Cada módulo trae plantillas, formularios, escalas y flujos propios. Paga solo por los que usas. Un mismo paciente, expediente unificado.</p>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 reveal">
            {[
              { icon:"◍", name:"Medicina General", desc:"Consulta integral, control de crónicos y preventivos", tags:["SOAP","Signos vitales","Receta general"]},
              { icon:"♥", name:"Pediatría", desc:"Curvas OMS, vacunas y desarrollo", tags:["Percentiles","Carnet vacunación","Crecimiento"]},
              { icon:"◉", name:"Ginecología", desc:"Control prenatal, colposcopía y plan familiar", tags:["Prenatal","PAP","Eco obstétrico"]},
              { icon:"♡", name:"Cardiología", desc:"Riesgo CV, ECG y seguimiento", tags:["Framingham","ECG","MAPA/Holter"]},
              { icon:"⬢", name:"Traumatología", desc:"Lesión, cirugía y rehabilitación", tags:["Dolor EVA","Órdenes Rx/RM","Fisioterapia"]},
              { icon:"✦", name:"Dermatología", desc:"Mapa corporal y seguimiento fotográfico", tags:["Fotoderma","Biopsia","Tratamientos"]},
              { icon:"◎", name:"Odontología", desc:"Odontograma, endodoncia y presupuestos", tags:["Odontograma","Plan tratamiento","Prótesis"]},
              { icon:"⬔", name:"Psicología", desc:"Sesiones, escalas y notas privadas", tags:["PHQ-9 / GAD-7","Sesión","Plan terapéutico"]},
            ].map((m)=>(
              <div key={m.name} className="bg-bg-soft border border-line rounded-xl sm:rounded-2xl p-3.5 sm:p-4 hover:bg-white hover:shadow-soft transition-all">
                <span className="w-8 h-8 sm:w-9 sm:h-9 grid place-items-center bg-white border border-line rounded-[10px] font-extrabold text-teal-600 mb-2 sm:mb-2.5 text-sm">{m.icon}</span>
                <h4 className="text-[13px] sm:text-sm font-bold tracking-tight leading-tight">{m.name}</h4>
                <p className="text-[12px] sm:text-[13px] text-ink-600 leading-5 mt-1 mb-2 sm:mb-2.5">{m.desc}</p>
                <div className="flex flex-wrap gap-1 sm:gap-1.5">{m.tags.map((t)=><span key={t} className="bg-white border border-line px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-ink-600">{t}</span>)}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 sm:mt-4 grid lg:grid-cols-[1.1fr_0.9fr] gap-2.5 sm:gap-3.5 reveal">
            <div className="bg-ink-900 text-white rounded-xl sm:rounded-2xl p-4 sm:p-5 relative overflow-hidden">
              <strong className="block text-[13px] sm:text-sm mb-1 sm:mb-1.5 relative">¿Otra especialidad?</strong>
              <p className="text-[12px] sm:text-[13px] text-[#cbd5e1] leading-5 relative">Oftalmología, ORL, Urología, Neurología y más. Crea tu plantilla en minutos o te la configuramos.</p>
              <div className="pointer-events-none absolute -right-5 -bottom-5 w-40 h-40 rounded-full opacity-60 hidden sm:block" style={{ background:"radial-gradient(140px 100px at 50% 50%, rgba(20,184,166,.24), transparent 70%)"}}/>
            </div>
            <div className="bg-teal-50 border border-[#ccfbf1] rounded-xl sm:rounded-2xl p-3.5 sm:p-4 grid gap-2 sm:gap-2.5 content-center">
              <span className="text-[12px] sm:text-[13px] font-bold text-ink-800">✓ Un expediente, múltiples especialidades</span>
              <span className="text-[12px] sm:text-[13px] font-bold text-ink-800">✓ Activa/desactiva por doctor y sede</span>
              <span className="text-[12px] sm:text-[13px] font-bold text-ink-800">✓ Todo auditable: quién atendió y qué registró</span>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUCIONES */}
      <section id="soluciones" className="py-8 sm:py-12 lg:py-[72px] bg-bg-soft border-y border-line">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-[720px] mx-auto mb-6 sm:mb-9 reveal">
            <span className="inline-block text-[11px] sm:text-xs font-extrabold tracking-widest uppercase text-teal-600 bg-teal-50 border border-[#ccfbf1] px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full mb-2.5 sm:mb-3">Soluciones</span>
            <h2 className="text-[24px] sm:text-[clamp(28px,3.6vw,40px)] leading-[0.98] tracking-tighter font-extrabold">Hecho para quien atiende pacientes. <br className="hidden sm:block"/>Escala con quien dirige centros.</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 reveal">
            <div className="bg-white border border-line rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 shadow-soft flex flex-col">
              <div className="flex flex-col gap-1 sm:gap-1.5 mb-2 sm:mb-2.5"><span className="w-8 h-8 sm:w-9 sm:h-9 grid place-items-center bg-bg-muted border border-line rounded-[10px] font-extrabold text-sm">◆</span><h3 className="text-[16px] sm:text-lg font-bold tracking-tight">Para doctores</h3><small className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-ink-400">1 – 3 profesionales</small></div>
              <p className="text-[13px] sm:text-sm text-ink-600 leading-5 mb-3 sm:mb-3.5">Empieza en minutos. Lleva tu agenda y pacientes a un lugar seguro y profesional.</p>
              <ul className="grid gap-1.5 sm:gap-2 mb-3 sm:mb-4">{["Agenda y pacientes ilimitados","Historia clínica + recetas","Recordatorios y cobro online"].map((b)=><li key={b} className="flex gap-2 items-start text-[12px] sm:text-[13px] font-semibold leading-snug"><span className="w-[18px] h-[18px] grid place-items-center bg-teal-50 text-teal-600 border border-[#ccfbf1] rounded-full text-[10px] shrink-0 mt-0.5">✓</span>{b}</li>)}</ul>
              <a href="#precios" className="mt-auto font-extrabold text-[13px] sm:text-sm text-teal-600 py-1">Ver plan Esencial →</a>
            </div>
            <div className="bg-ink-900 border border-ink-900 rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 shadow-soft flex flex-col relative overflow-hidden text-white">
              <span className="absolute top-3 sm:top-3.5 right-3 sm:right-3.5 bg-teal-500 text-white text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full">Más elegido</span>
              <div className="flex flex-col gap-1 sm:gap-1.5 mb-2 sm:mb-2.5"><span className="w-8 h-8 sm:w-9 sm:h-9 grid place-items-center bg-teal-500 text-white rounded-[10px] font-extrabold text-sm">⬔</span><h3 className="text-[16px] sm:text-lg font-bold tracking-tight">Para clínicas</h3><small className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-[#94a3b8]">4 – 20 profesionales</small></div>
              <p className="text-[13px] sm:text-sm text-[#cbd5e1] leading-5 mb-3 sm:mb-3.5">Coordina equipo, boxes y facturación sin añadir personal administrativo.</p>
              <ul className="grid gap-1.5 sm:gap-2 mb-3 sm:mb-4">{["Multi-agenda y gestión de boxes","Roles, permisos y turnos","Informes de rentabilidad por doctor"].map((b)=><li key={b} className="flex gap-2 items-start text-[12px] sm:text-[13px] font-semibold leading-snug"><span className="w-[18px] h-[18px] grid place-items-center bg-white/10 text-[#5eead4] border border-white/10 rounded-full text-[10px] shrink-0 mt-0.5">✓</span>{b}</li>)}</ul>
              <a href="#precios" className="mt-auto font-extrabold text-[13px] sm:text-sm text-[#5eead4] py-1">Ver plan Profesional →</a>
              <div className="pointer-events-none absolute -right-7 -bottom-7 w-56 h-56 rounded-full opacity-60 hidden sm:block" style={{ background:"radial-gradient(220px 150px at 50% 50%, rgba(20,184,166,.28), transparent 70%)"}}/>
            </div>
            <div className="bg-white border border-line rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 shadow-soft flex flex-col">
              <div className="flex flex-col gap-1 sm:gap-1.5 mb-2 sm:mb-2.5"><span className="w-8 h-8 sm:w-9 sm:h-9 grid place-items-center bg-bg-muted border border-line rounded-[10px] font-extrabold text-sm">⬢</span><h3 className="text-[16px] sm:text-lg font-bold tracking-tight">Para grupos y redes</h3><small className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-ink-400">20+ · multi-sede</small></div>
              <p className="text-[13px] sm:text-sm text-ink-600 leading-5 mb-3 sm:mb-3.5">Gobernanza, interoperabilidad y datos centralizados para crecer con orden.</p>
              <ul className="grid gap-1.5 sm:gap-2 mb-3 sm:mb-4">{["Consolidado multi-centro","SSO, HL7/FHIR, API","Soporte dedicado + SLA"].map((b)=><li key={b} className="flex gap-2 items-start text-[12px] sm:text-[13px] font-semibold leading-snug"><span className="w-[18px] h-[18px] grid place-items-center bg-teal-50 text-teal-600 border border-[#ccfbf1] rounded-full text-[10px] shrink-0 mt-0.5">✓</span>{b}</li>)}</ul>
              <a href="#precios" className="mt-auto font-extrabold text-[13px] sm:text-sm text-teal-600 py-1">Hablar con ventas →</a>
            </div>
          </div>
        </div>
      </section>

      {/* PASOS */}
      <section className="py-8 sm:py-12 lg:py-[72px]">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="bg-white border border-line rounded-[16px] sm:rounded-3xl p-4 sm:p-7 shadow-soft reveal">
            <div className="text-center max-w-[680px] mx-auto mb-5 sm:mb-6">
              <span className="inline-block text-[11px] sm:text-xs font-extrabold tracking-widest uppercase text-teal-600 bg-teal-50 border border-[#ccfbf1] px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full mb-2">Implementación</span>
              <h2 className="text-[22px] sm:text-[clamp(26px,3.2vw,34px)] leading-none tracking-tighter font-extrabold">De tu sistema actual a Sinapsa en 48 horas.</h2>
              <p className="text-ink-600 mt-2 text-[14px] sm:text-base">Nosotros migramos tus datos. Tú sigues atendiendo.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
              {[
                { n:"01", t:"Importamos todo", d:"Pacientes, citas e historial desde Excel, Clinic Cloud, Doctoralia o tu software actual. Sin plantillas infernales."},
                { n:"02", t:"Configuramos tu centro", d:"Agenda, boxes, servicios, tarifas y recordatorios. Te dejamos una formación de 45 min por videollamada."},
                { n:"03", t:"Empiezas a cobrar mejor", d:"Recordatorios automáticos, pagos online y facturas que salen solas. Métricas desde el día uno."},
              ].map((s)=>(
                <div key={s.n} className="bg-bg-soft border border-line rounded-xl sm:rounded-2xl p-4 sm:p-5">
                  <span className="inline-block text-[11px] sm:text-xs font-extrabold tracking-widest text-teal-600 bg-teal-50 border border-[#ccfbf1] px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full mb-2 sm:mb-2.5">{s.n}</span>
                  <h4 className="text-[15px] sm:text-base font-bold tracking-tight mb-1 sm:mb-1.5">{s.t}</h4>
                  <p className="text-[12px] sm:text-[13px] text-ink-600 leading-5">{s.d}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 mt-4 text-[12px] sm:text-[13px] font-bold text-ink-600">
              <span className="bg-bg-soft border border-line px-3 py-2.5 sm:py-2 rounded-full text-center">⏱ Migración media: 1,8 días</span>
              <span className="bg-bg-soft border border-line px-3 py-2.5 sm:py-2 rounded-full text-center">🛡️ Copia de seguridad diaria · Datos en GT</span>
              <span className="bg-bg-soft border border-line px-3 py-2.5 sm:py-2 rounded-full text-center">🤝 Onboarding 1:1 incluido en todos los planes</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRECIOS */}
      <section id="precios" className="py-8 sm:py-12 lg:py-[72px] bg-gradient-to-b from-bg-soft to-white border-t border-line">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-[720px] mx-auto mb-6 reveal">
            <span className="inline-block text-[11px] sm:text-xs font-extrabold tracking-widest uppercase text-teal-600 bg-teal-50 border border-[#ccfbf1] px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full mb-2.5 sm:mb-3">Precios</span>
            <h2 className="text-[24px] sm:text-[clamp(28px,3.6vw,40px)] leading-none tracking-tighter font-extrabold">Precios claros. Sin sorpresas.</h2>
            <p className="text-ink-600 text-[14px] sm:text-base mt-2">Empieza gratis 14 días. Sin tarjeta. Cancela cuando quieras.</p>
            <div className="inline-flex bg-white border border-line rounded-full p-1 gap-1 mt-4 shadow-soft" role="group">
              <button onClick={()=>setAnnual(false)} className={`px-4 sm:px-4 py-2 rounded-full text-sm font-extrabold transition min-h-9 ${!annual ? "bg-ink-900 text-white shadow" : "text-ink-600"}`}>Mensual</button>
              <button onClick={()=>setAnnual(true)} className={`px-4 sm:px-4 py-2 rounded-full text-sm font-extrabold transition min-h-9 ${annual ? "bg-ink-900 text-white shadow" : "text-ink-600"}`}>Anual <span className="bg-[#fef08a] text-[#854d0e] px-1.5 py-0.5 rounded-full text-[11px] ml-1">−20%</span></button>
            </div>
            <small className="block mt-2.5 text-ink-400 font-semibold text-xs">En anual, 2 meses gratis. Impuestos no incluidos.</small>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-4 items-stretch reveal">
            <div className="bg-white border border-line rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 shadow-soft flex flex-col relative order-2 lg:order-1">
              <h3 className="text-[16px] sm:text-lg font-bold tracking-tight">Esencial</h3>
              <p className="text-[12px] sm:text-[13px] text-ink-600 mt-1 mb-2.5 sm:mb-3">Para el profesional que quiere orden total.</p>
              <div className="flex items-baseline gap-1 flex-wrap"><span className="text-[16px] sm:text-lg font-extrabold text-ink-400">Q</span><span className="text-[32px] sm:text-[42px] font-extrabold tracking-tighter leading-none">{price(299).toLocaleString("es-GT")}</span><span className="text-[12px] sm:text-[13px] font-semibold text-ink-400">/ mes por profesional</span></div>
              {annual && <small className="text-teal-600 font-bold text-xs mt-1 block">Q299 en mensual · facturado anual</small>}
              <ul className="grid gap-1.5 sm:gap-2 mt-3 sm:mt-3.5 mb-4 flex-1">{["Citas, pacientes y expediente ilimitados","Recetas y órdenes electrónicas","1 módulo de especialidad incluido","Recordatorios WhatsApp/SMS (500/mes)","Auditoría básica + portal del paciente"].map((b)=><li key={b} className="flex gap-2 items-start text-[12px] sm:text-[13px] font-semibold text-ink-800 leading-snug"><span className="w-[18px] h-[18px] grid place-items-center bg-teal-50 text-teal-600 border border-[#ccfbf1] rounded-full text-[10px] shrink-0 mt-0.5">✓</span>{b}</li>)}</ul>
              <button onClick={()=>showToast("¡Plan Esencial seleccionado! Te llevamos al checkout.")} className="w-full inline-flex justify-center rounded-full bg-white border border-line px-5 py-3 sm:py-3 font-bold hover:border-line-strong transition-colors min-h-[48px]">Probar 14 días gratis</button>
              <small className="block text-center mt-2 text-ink-400 text-xs font-semibold">Sin tarjeta · Migración incluida</small>
            </div>

            <div className="bg-white border border-teal-600 rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 shadow-[0_12px_32px_rgba(15,118,110,.18),0_4px_12px_rgba(15,23,42,.08)] sm:shadow-[0_20px_60px_rgba(15,118,110,.18),0_8px_24px_rgba(15,23,42,.08)] flex flex-col relative order-1 lg:order-2 lg:-translate-y-1">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-xs font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full whitespace-nowrap">Más popular</span>
              <h3 className="text-[16px] sm:text-lg font-bold tracking-tight mt-2 sm:mt-0">Profesional</h3>
              <p className="text-[12px] sm:text-[13px] text-ink-600 mt-1 mb-2.5 sm:mb-3">Para clínicas con varias especialidades.</p>
              <div className="flex items-baseline gap-1 flex-wrap"><span className="text-[16px] sm:text-lg font-extrabold text-ink-400">Q</span><span className="text-[32px] sm:text-[42px] font-extrabold tracking-tighter leading-none">{price(599).toLocaleString("es-GT")}</span><span className="text-[12px] sm:text-[13px] font-semibold text-ink-400">/ mes por profesional</span></div>
              {annual && <small className="text-teal-600 font-bold text-xs mt-1 block">Q599 en mensual · facturado anual</small>}
              <ul className="grid gap-1.5 sm:gap-2 mt-3 sm:mt-3.5 mb-4 flex-1">
                <li className="text-[12px] sm:text-[13px] font-bold text-ink-800">Todo lo de Esencial, más:</li>
                {["3 módulos de especialidad incluidos","Facturación, presupuestos y cobros en Q","Recordatorios ilimitados + campañas","Gestión de boxes, turnos y auditoría completa","Reportes por doctor / especialidad"].map((b)=><li key={b} className="flex gap-2 items-start text-[12px] sm:text-[13px] font-semibold text-ink-800 leading-snug"><span className="w-[18px] h-[18px] grid place-items-center bg-teal-50 text-teal-600 border border-[#ccfbf1] rounded-full text-[10px] shrink-0 mt-0.5">✓</span>{b}</li>)}
              </ul>
              <button onClick={()=>showToast("¡Plan Profesional seleccionado! Redirigiendo a checkout…")} className="w-full inline-flex justify-center rounded-full bg-teal-600 text-white px-5 py-3 sm:py-3 font-bold shadow-[0_8px_20px_rgba(15,118,110,.28)] hover:bg-teal-900 active:scale-[0.98] transition-all min-h-[48px]">Elegir Profesional</button>
              <small className="block text-center mt-2 text-ink-400 text-xs font-semibold">Onboarding 1:1 incluido · Setup en 48h</small>
            </div>

            <div className="bg-white border border-line rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 shadow-soft flex flex-col relative order-3">
              <h3 className="text-[16px] sm:text-lg font-bold tracking-tight">Centro</h3>
              <p className="text-[12px] sm:text-[13px] text-ink-600 mt-1 mb-2.5 sm:mb-3">Para centros y policlínicas multi-sede.</p>
              <div className="flex items-baseline gap-1 flex-wrap"><span className="text-[16px] sm:text-lg font-extrabold text-ink-400">Q</span><span className="text-[32px] sm:text-[42px] font-extrabold tracking-tighter leading-none">{price(1290).toLocaleString("es-GT")}</span><span className="text-[12px] sm:text-[13px] font-semibold text-ink-400">/ mes · hasta 10 prof.</span></div>
              {annual && <small className="text-teal-600 font-bold text-xs mt-1 block">Incluye 10 profesionales · +Q129 / extra</small>}
              <ul className="grid gap-1.5 sm:gap-2 mt-3 sm:mt-3.5 mb-4 flex-1">{["Módulos ilimitados por especialidad","Multi-sede y consolidado","Roles granulares + auditoría inmutable","Stock, compras y comisiones","API, webhooks, HL7/FHIR","Gestor de cuenta dedicado"].map((b)=><li key={b} className="flex gap-2 items-start text-[12px] sm:text-[13px] font-semibold text-ink-800 leading-snug"><span className="w-[18px] h-[18px] grid place-items-center bg-teal-50 text-teal-600 border border-[#ccfbf1] rounded-full text-[10px] shrink-0 mt-0.5">✓</span>{b}</li>)}</ul>
              <button onClick={()=>showToast("Hablemos de tu centro → equipo comercial notificado.")} className="w-full inline-flex justify-center rounded-full bg-white border border-line px-5 py-3 sm:py-3 font-bold hover:border-line-strong transition-colors min-h-[48px]">Hablar con ventas</button>
              <small className="block text-center mt-2 text-ink-400 text-xs font-semibold">SLA 99,9% · Contrato y DPA</small>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 bg-ink-900 text-white rounded-xl sm:rounded-2xl p-4 sm:p-5 reveal">
            <div><h4 className="text-[15px] sm:text-base font-bold">¿Red o grupo con varias sedes?</h4><p className="text-[12px] sm:text-[13px] text-[#cbd5e1] mt-1 leading-relaxed">Módulos ilimitados, SSO, interoperabilidad y facturación centralizada. Despliegue asistido.</p></div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 shrink-0"><a href="/login" className="inline-flex items-center justify-center rounded-full bg-white text-ink-900 px-5 py-3 font-bold min-h-[44px] text-[14px]">Solicitar propuesta</a><small className="text-[#94a3b8] font-semibold text-xs text-center sm:text-left">Respuesta en &lt; 4h laborables</small></div>
          </div>

          <div className="mt-3 sm:mt-3.5 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-3.5 bg-white border border-line rounded-xl sm:rounded-2xl p-3 sm:p-3.5 reveal">
            <span className="w-9 h-9 sm:w-10 sm:h-10 grid place-items-center bg-teal-50 border border-[#ccfbf1] rounded-xl shrink-0 text-base">🛡️</span>
            <div className="flex-1 min-w-0"><strong className="block text-[13px] sm:text-sm">Garantía Sinapsa 30 días</strong><p className="text-[12px] sm:text-[13px] text-ink-600 mt-0.5 leading-relaxed">Si no ahorras tiempo en el primer mes, te devolvemos el importe. Sin preguntas.</p></div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto sm:ml-auto">{["Auditoría total","Datos en GT","ISO 27001","Cifrado AES-256"].map((b)=><span key={b} className="bg-bg-soft border border-line px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-extrabold tracking-widest text-ink-600">{b}</span>)}</div>
          </div>

          <div className="mt-3 sm:mt-4 bg-white border border-line rounded-xl sm:rounded-2xl p-3 sm:p-4 reveal">
            <h4 className="text-[13px] sm:text-sm font-bold tracking-tight mb-2.5 sm:mb-3">Comparativa rápida</h4>
            <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
              <table className="w-full text-[12px] sm:text-[13px] border-collapse min-w-[520px]">
                <thead><tr className="border-b border-line"><th className="text-left py-2 sm:py-2.5 px-2 sm:px-3 text-[11px] sm:text-xs font-extrabold tracking-widest uppercase text-ink-400"></th><th className="text-left py-2 sm:py-2.5 px-2 sm:px-3 text-[11px] sm:text-xs font-extrabold tracking-widest uppercase text-ink-400">Esencial</th><th className="text-left py-2 sm:py-2.5 px-2 sm:px-3 text-[11px] sm:text-xs font-extrabold tracking-widest uppercase text-ink-400">Profesional</th><th className="text-left py-2 sm:py-2.5 px-2 sm:px-3 text-[11px] sm:text-xs font-extrabold tracking-widest uppercase text-ink-400">Centro</th></tr></thead>
                <tbody className="font-semibold text-ink-800">
                  <tr className="border-b border-line"><td className="py-2 sm:py-2.5 px-2 sm:px-3">Citas · Expediente · Recetas</td><td className="py-2 sm:py-2.5 px-2 sm:px-3">●</td><td className="py-2 sm:py-2.5 px-2 sm:px-3">●</td><td className="py-2 sm:py-2.5 px-2 sm:px-3">●</td></tr>
                  <tr className="border-b border-line"><td className="py-2 sm:py-2.5 px-2 sm:px-3">Módulos por especialidad</td><td className="py-2 sm:py-2.5 px-2 sm:px-3">1 incluido</td><td className="py-2 sm:py-2.5 px-2 sm:px-3">3 incluidos</td><td className="py-2 sm:py-2.5 px-2 sm:px-3">Ilimitados</td></tr>
                  <tr className="border-b border-line"><td className="py-2 sm:py-2.5 px-2 sm:px-3">Auditoría trazable</td><td className="py-2 sm:py-2.5 px-2 sm:px-3">Básica</td><td className="py-2 sm:py-2.5 px-2 sm:px-3">Completa</td><td className="py-2 sm:py-2.5 px-2 sm:px-3">Inmutable</td></tr>
                  <tr className="border-b border-line"><td className="py-2 sm:py-2.5 px-2 sm:px-3">Recordatorios WhatsApp</td><td className="py-2 sm:py-2.5 px-2 sm:px-3">500/mes</td><td className="py-2 sm:py-2.5 px-2 sm:px-3">Ilimitados</td><td className="py-2 sm:py-2.5 px-2 sm:px-3">Ilimitados</td></tr>
                  <tr className="border-b border-line"><td className="py-2 sm:py-2.5 px-2 sm:px-3">Facturación y cobros en Q</td><td className="py-2 sm:py-2.5 px-2 sm:px-3">—</td><td className="py-2 sm:py-2.5 px-2 sm:px-3">●</td><td className="py-2 sm:py-2.5 px-2 sm:px-3">●</td></tr>
                  <tr><td className="py-2 sm:py-2.5 px-2 sm:px-3">Multi-sede · API · HL7</td><td className="py-2 sm:py-2.5 px-2 sm:px-3">—</td><td className="py-2 sm:py-2.5 px-2 sm:px-3">—</td><td className="py-2 sm:py-2.5 px-2 sm:px-3">●</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section id="testimonios" className="py-8 sm:py-12 lg:py-[72px]">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-[720px] mx-auto mb-6 sm:mb-9 reveal">
            <span className="inline-block text-[11px] sm:text-xs font-extrabold tracking-widest uppercase text-teal-600 bg-teal-50 border border-[#ccfbf1] px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full mb-2.5 sm:mb-3">Casos reales</span>
            <h2 className="text-[22px] sm:text-[clamp(28px,3.6vw,40px)] leading-[0.98] tracking-tighter font-extrabold">De “no damos abasto” a agenda llena y cobrada.</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 reveal">
            <figure className="bg-white border border-line rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 shadow-soft flex flex-col">
              <div className="flex gap-2.5 items-center mb-2.5"><img src="https://i.pravatar.cc/100?img=32" alt="" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shrink-0"/><div className="min-w-0"><strong className="block text-[12px] sm:text-[13px] leading-tight truncate">Dra. Elena Morell</strong><span className="text-[11px] sm:text-xs text-ink-400 truncate block">Cardiología · Clínica Levante · 6 doctores</span></div><span className="ml-auto text-[#f59e0b] text-[11px] sm:text-xs shrink-0">★★★★★</span></div>
              <blockquote className="text-[13px] sm:text-sm leading-5 font-semibold text-ink-800">“Pasamos de un 18% de ausencias a un 3%. Solo con los recordatorios pagamos Sinapsa 4 veces. Y la historia clínica por fin es usable.”</blockquote>
              <figcaption className="mt-3 pt-3 border-t border-line text-[11px] sm:text-xs font-extrabold text-teal-600 flex flex-wrap gap-2 sm:gap-3"><span>+41% asistencia</span><span>−19h admin/mes</span></figcaption>
            </figure>
            <figure className="bg-white border border-line rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 shadow-soft flex flex-col">
              <div className="flex gap-2.5 items-center mb-2.5"><img src="https://i.pravatar.cc/100?img=15" alt="" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shrink-0"/><div className="min-w-0"><strong className="block text-[12px] sm:text-[13px] leading-tight truncate">Dr. Javier Coves</strong><span className="text-[11px] sm:text-xs text-ink-400 truncate block">Traumatología · Centro Arco · 12 profesionales</span></div><span className="ml-auto text-[#f59e0b] text-[11px] sm:text-xs shrink-0">★★★★★</span></div>
              <blockquote className="text-[13px] sm:text-sm leading-5 font-semibold text-ink-800">“La migración fue en un día. Ahora facturamos al momento desde el box, con el TPV integrado. Cobramos un 23% más rápido.”</blockquote>
              <figcaption className="mt-3 pt-3 border-t border-line text-[11px] sm:text-xs font-extrabold text-teal-600 flex flex-wrap gap-2 sm:gap-3"><span>2,4× velocidad de cobro</span><span>4,8/5 satisfacción</span></figcaption>
            </figure>
            <figure className="bg-white border border-line rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 shadow-soft flex flex-col">
              <div className="flex gap-2.5 items-center mb-2.5"><img src="https://i.pravatar.cc/100?img=26" alt="" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shrink-0"/><div className="min-w-0"><strong className="block text-[12px] sm:text-[13px] leading-tight truncate">Dirección · Grupo Vital</strong><span className="text-[11px] sm:text-xs text-ink-400 truncate block">4 sedes · 34 profesionales</span></div><span className="ml-auto text-[#f59e0b] text-[11px] sm:text-xs shrink-0">★★★★★</span></div>
              <blockquote className="text-[13px] sm:text-sm leading-5 font-semibold text-ink-800">“Por fin vemos la rentabilidad por sede y doctor. Detectamos una fuga del 12% y la corregimos en dos semanas.”</blockquote>
              <figcaption className="mt-3 pt-3 border-t border-line text-[11px] sm:text-xs font-extrabold text-teal-600 flex flex-wrap gap-2 sm:gap-3"><span>12% fuga detectada</span><span>ROI 6× en 90 días</span></figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-8 sm:py-12 lg:py-[72px] bg-bg-soft border-y border-line">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-[720px] mx-auto mb-6 sm:mb-9 reveal">
            <span className="inline-block text-[11px] sm:text-xs font-extrabold tracking-widest uppercase text-teal-600 bg-teal-50 border border-[#ccfbf1] px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full mb-2.5 sm:mb-3">FAQ</span>
            <h2 className="text-[22px] sm:text-[clamp(28px,3.6vw,40px)] leading-none tracking-tighter font-extrabold">Preguntas frecuentes</h2>
          </div>
          <div className="max-w-[820px] mx-auto grid gap-2 sm:gap-2.5 reveal">
            {[
              { q:"¿Necesito tarjeta para probar?", a:"No. 14 días gratis sin tarjeta. Si decides quedarte, eliges plan en quetzales (GTQ) y pagas. Si no, tus datos se borran automáticamente."},
              { q:"¿Migran mis datos de mi software actual?", a:"Sí, gratis. Importamos pacientes, citas, expedientes y recetas desde Excel, Google Sheets, Clinic Cloud, Doctoralia u otro software. Te entregamos todo auditado."},
              { q:"¿Es seguro y auditable?", a:"Sí. Cifrado AES-256, copias diarias, control por roles y auditoría inmutable: cada acción queda registrada con usuario, fecha y cambio realizado. Cumple buenas prácticas de protección de datos."},
              { q:"¿Cómo funcionan los módulos por especialidad?", a:"Activas solo lo que atiendes: pediatría, ginecología, cardiología, derma, odonto, etc. Cada módulo trae sus plantillas y flujos. Puedes añadir o quitar módulos por doctor o sede y el expediente sigue unificado."},
              { q:"¿Qué pasa si cancelo?", a:"Exportas todo (citas, expedientes, recetas, auditoría) en CSV/PDF en un clic. Sin permanencia."},
              { q:"¿Facturación en quetzales?", a:"Sí. Presupuestos, facturas, recibos y cobros en GTQ, con control de cuentas por cobrar, caja y reportes por doctor y especialidad. Exportación contable incluida."},
            ].map((f,i)=>(
              <div key={f.q} className="bg-white border border-line rounded-xl sm:rounded-2xl overflow-hidden shadow-soft">
                <button onClick={()=>setOpenFaq(openFaq===i?null:i)} aria-expanded={openFaq===i} className="w-full flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4 text-left font-extrabold text-[14px] sm:text-[15px] tracking-tight min-h-[56px]">
                  <span className="pr-2">{f.q}</span><span className={`w-7 h-7 sm:w-7 sm:h-7 grid place-items-center rounded-full border text-xs shrink-0 transition ${openFaq===i ? "bg-ink-900 text-white border-ink-900 rotate-180" : "bg-bg-soft border-line"}`}>▾</span>
                </button>
                <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${openFaq===i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}><p className={`overflow-hidden px-4 sm:px-5 text-[13px] sm:text-sm text-ink-600 leading-6 ${openFaq===i ? "pb-3 sm:pb-4" : "pb-0"}`}>{f.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="demo" className="py-6 sm:py-7 pb-6 sm:pb-9 reveal">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-7 grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center text-white relative overflow-hidden" style={{ background:"linear-gradient(135deg, #0f172a 0%, #0f766e 60%, #0e7490 100%)"}}>
            <div className="relative order-1">
              <h2 className="text-[24px] sm:text-[clamp(26px,3.4vw,36px)] leading-none tracking-tighter font-extrabold">Haz que tu centro funcione como un reloj.</h2>
              <p className="text-[#cbd5e1] text-[14px] sm:text-[15px] mt-2 sm:mt-2.5 leading-relaxed">Prueba Sinapsa 14 días gratis. Con datos reales, con tu equipo, sin compromiso.</p>
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-2.5 mt-4 sm:mt-5">
                <a href="#precios" onClick={()=>showToast("¡Vamos! Elige tu plan para empezar.")} className="inline-flex justify-center rounded-full bg-teal-600 sm:bg-teal-600 text-white px-6 py-3.5 font-bold shadow min-h-[48px] w-full sm:w-auto bg-white sm:bg-teal-600 text-ink-900 sm:text-white border border-white sm:border-teal-600">Empezar gratis ahora</a>
                <a href="mailto:hola@sinapsa.health" className="inline-flex justify-center rounded-full bg-white/10 sm:bg-white text-white sm:text-ink-900 border border-white/20 sm:border-line px-6 py-3.5 font-bold min-h-[48px] w-full sm:w-auto backdrop-blur">Hablar con una persona</a>
              </div>
              <small className="text-white/70 sm:text-[#94a3b8] font-semibold text-[11px] sm:text-xs block mt-3 text-center sm:text-left">✓ Setup en 48h · ✓ Migración incluida · ✓ Cancela cuando quieras</small>
            </div>
            <div className="relative h-[180px] sm:h-[220px] hidden sm:block order-2" aria-hidden>
              <div className="absolute top-0 left-0 bg-white text-ink-900 rounded-2xl p-3.5 shadow-float w-[280px]"><div className="flex justify-between text-[11px] font-extrabold tracking-widest uppercase text-ink-400 mb-2"><span>✔ Cita confirmada</span><span>09:42</span></div><div><strong className="block text-base tracking-tight">Lucía Ferrer — Revisión</strong><span className="text-xs text-ink-400">Dr. Martín · Box 2 · 15 sep 09:00</span><div className="mt-2.5 h-1.5 bg-bg-muted rounded-full overflow-hidden"><span className="block h-full bg-teal-500 rounded-full" style={{width:"78%"}} /></div></div></div>
              <div className="absolute bottom-2.5 right-0 bg-white text-ink-900 rounded-2xl p-3.5 shadow-float w-60 rotate-[1.2deg] hidden lg:block"><div className="flex justify-between text-[11px] font-extrabold tracking-widest uppercase text-ink-400 mb-2"><span>Factura #2841</span><span>Pagada</span></div><div><strong className="block text-base tracking-tight">Q 420.00</strong><span className="text-xs text-ink-400">Efectivo / Tarjeta •• 4242</span></div></div>
            </div>
            <div className="pointer-events-none absolute -right-10 -bottom-20 w-[420px] h-[420px] rounded-full opacity-40 sm:opacity-60" style={{ background:"radial-gradient(400px 300px at 50% 50%, rgba(94,234,212,.22), transparent 70%)"}}/>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-line bg-white py-6 sm:py-7">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-[1.6fr_.7fr_.7fr_.9fr] gap-6 sm:gap-6">
            <div className="col-span-2 lg:col-span-1">
              <a href="#" className="inline-flex items-center gap-2.5"><span className="grid place-items-center w-[22px] h-[22px] rounded-lg bg-teal-600 text-white text-xs">◆</span><span className="font-extrabold text-lg tracking-tighter">sinapsa</span></a>
              <p className="text-[12px] sm:text-[13px] text-ink-600 leading-5 mt-2 sm:mt-2.5 max-w-[360px]">Sistema operativo para centros médicos y doctores. Citas, expediente, recetas, auditoría y facturación — con módulos por especialidad.</p>
              <small className="text-ink-400 font-semibold text-xs block mt-2">Hecho con ♥ para Guatemala · Soporte local</small>
            </div>
            <div><strong className="block text-[13px] mb-2 sm:mb-2.5 tracking-tight">Producto</strong><a href="#producto" className="block text-[13px] font-semibold text-ink-600 py-1.5 sm:py-1 hover:text-ink-900">Funcionalidades</a><a href="#precios" className="block text-[13px] font-semibold text-ink-600 py-1.5 sm:py-1 hover:text-ink-900">Precios</a><a href="#testimonios" className="block text-[13px] font-semibold text-ink-600 py-1.5 sm:py-1 hover:text-ink-900">Casos</a><a href="#faq" className="block text-[13px] font-semibold text-ink-600 py-1.5 sm:py-1 hover:text-ink-900">FAQ</a></div>
            <div><strong className="block text-[13px] mb-2 sm:mb-2.5 tracking-tight">Legal</strong>{["Privacidad","Términos","Cookies","DPA"].map((t)=><a key={t} href="#" onClick={(e)=>{e.preventDefault();showToast("Página legal — pendiente de contenido.")}} className="block text-[13px] font-semibold text-ink-600 py-1.5 sm:py-1 hover:text-ink-900">{t}</a>)}</div>
            <div className="col-span-2 sm:col-span-1"><strong className="block text-[13px] mb-2 sm:mb-2.5 tracking-tight">Contacto</strong><a href="mailto:hola@sinapsa.health" className="block text-[13px] font-semibold text-ink-600 py-1.5 sm:py-1 hover:text-ink-900">hola@sinapsa.health</a><a href="tel:+50200000000" className="block text-[13px] font-semibold text-ink-600 py-1.5 sm:py-1 hover:text-ink-900">+502 0000 0000</a><span className="block text-[13px] font-semibold text-ink-600 py-1.5 sm:py-1">L–V 8:00–18:00 GT</span></div>
          </div>
          <div className="mt-5 sm:mt-5 pt-3.5 border-t border-line flex flex-col sm:flex-row sm:justify-between gap-3 text-xs font-semibold text-ink-400">
            <span className="order-2 sm:order-1 text-center sm:text-left">© {new Date().getFullYear()} Sinapsa Health. Todos los derechos reservados.</span>
            <span className="flex flex-wrap justify-center sm:justify-end gap-1.5 sm:gap-2 order-1 sm:order-2">{["Auditoría","Q · GTQ","HL7 FHIR","Módulos"].map((b)=><span key={b} className="bg-bg-soft border border-line px-2 py-1 rounded-full text-[11px] font-extrabold tracking-widest">{b}</span>)}</span>
          </div>
        </div>
      </footer>

      {toast && <div className="fixed left-1/2 -translate-x-1/2 bottom-4 sm:bottom-5 bg-ink-900 text-white px-4 py-3 rounded-full text-[13px] font-bold shadow-float z-50 animate-[scaleIn_.2s_ease] max-w-[90vw] text-center">{toast}</div>}
    </div>
  )
}
