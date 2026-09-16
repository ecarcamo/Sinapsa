import { useEffect, useRef, useState } from "react"
import "./App.css"

// — helpers —
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

export default function App() {
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
    <div ref={rootRef} className="page">
      {/* HEADER */}
      <header className="nav-wrap">
        <nav className="nav">
          <a className="brand" href="#" aria-label="Sinapsa inicio">
            <span className="brand-mark" aria-hidden>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="8" fill="#0F766E" />
                <path d="M14 7c-1.2 2.2-3.6 3.1-5.5 2.6 1.1 1.6 1 3.8-.4 5.3 1.9-.5 3.9.2 5 1.8 1.1-1.6 3.1-2.3 5-1.8-1.4-1.5-1.5-3.7-.4-5.3-1.9.5-4.3-.4-5.5-2.6Z" fill="white" fillOpacity="0.95" />
                <circle cx="14" cy="14" r="2.2" fill="white" />
              </svg>
            </span>
            <span className="brand-name">sinapsa</span>
            <span className="brand-badge">SaaS médico</span>
          </a>

          <div className="nav-links" data-open={mobileNav}>
            <a href="#producto" onClick={() => setMobileNav(false)}>Producto</a>
            <a href="#soluciones" onClick={() => setMobileNav(false)}>Soluciones</a>
            <a href="#precios" onClick={() => setMobileNav(false)}>Precios</a>
            <a href="#testimonios" onClick={() => setMobileNav(false)}>Casos</a>
            <a href="#faq" onClick={() => setMobileNav(false)}>FAQ</a>
            <div className="nav-cta-mobile">
              <a className="btn btn-ghost" href="#demo" onClick={() => setMobileNav(false)}>Iniciar sesión</a>
              <a className="btn btn-primary" href="#precios" onClick={() => setMobileNav(false)}>Probar 14 días gratis</a>
            </div>
          </div>

          <div className="nav-actions">
            <a className="btn btn-ghost hide-mobile" href="#demo">Iniciar sesión</a>
            <a className="btn btn-primary hide-mobile" href="#precios">Probar 14 días gratis</a>
            <button className="burger" aria-label="Abrir menú" aria-expanded={mobileNav} onClick={() => setMobileNav(!mobileNav)}>
              <span /><span /><span />
            </button>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" aria-hidden />
        <div className="container hero-grid">
          <div className="hero-copy reveal">
            <div className="pill">
              <span className="pill-dot" />
              Nuevo · Módulos por especialidad — activa solo lo que usas
              <span className="pill-arrow">→</span>
            </div>
            <h1>
              El sistema operativo <span className="accent">para tu centro médico.</span>
            </h1>
            <p className="lead">
              Sinapsa gestiona todo el ciclo del paciente — <strong>citas, expediente clínico, recetas, auditoría y facturación</strong> — con módulos por especialidad para que cada doctor trabaje como necesita, sin pagar de más.
            </p>

            <div className="hero-cta">
              <a href="#precios" className="btn btn-primary btn-xl">Empezar gratis — 14 días</a>
              <a href="#demo" className="btn btn-white btn-xl">
                <span className="play">▶</span> Ver demo en 2 min
              </a>
            </div>
            <div className="hero-bullets">
              <span><i>✓</i> Sin permanencia</span>
              <span><i>✓</i> Migración gratuita</span>
              <span><i>✓</i> Soporte en Guatemala</span>
            </div>
          </div>

          <div className="hero-visual reveal reveal-delay-1">
            <div className="browser">
              <div className="browser-bar">
                <span className="dots"><i /><i /><i /></span>
                <span className="bar-url">app.sinapsa.health · Agenda de hoy</span>
                <span className="bar-live"><span className="live-dot" /> En vivo</span>
              </div>
              <div className="browser-body">
                <div className="mini-stats">
                  <div className="mini-stat">
                    <small>Pacientes hoy</small><strong>28</strong><em>+6 vs ayer</em>
                  </div>
                  <div className="mini-stat">
                    <small>Ingresos mes</small><strong>Q 18,420</strong><em style={{ color: "#0F766E" }}>+12%</em>
                  </div>
                  <div className="mini-stat">
                    <small>No-shows</small><strong>3,2%</strong><em>↓ 41%</em>
                  </div>
                </div>

                <div className="agenda">
                  <div className="agenda-head">
                    <strong>Agenda — Dr. Martín · 15 sep</strong>
                    <span className="agenda-filter">Día ▾</span>
                  </div>
                  <div className="agenda-list">
                    {[
                      { h: "09:00", n: "Lucía Ferrer", t: "Revisión · Box 2", s: "confirmada", c: "#0F766E" },
                      { h: "09:30", n: "Marcos Ruiz", t: "Telemedicina", s: "en curso", c: "#2563EB" },
                      { h: "10:15", n: "Ana Beltrán", t: "1ª visita · Cardiología", s: "confirmada", c: "#0F766E" },
                      { h: "11:00", n: "Bloque quirófano", t: "Reservado", s: "bloqueado", c: "#94A3B8" },
                    ].map((r) => (
                      <div key={r.h} className="agenda-row">
                        <span className="agenda-time">{r.h}</span>
                        <span className="agenda-dot" style={{ background: r.c }} />
                        <div className="agenda-info">
                          <strong>{r.n}</strong><span>{r.t}</span>
                        </div>
                        <span className={`badge badge-${r.s}`}>{r.s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="whatsapp-card">
                  <div className="wa-head">
                    <span className="wa-icon">💬</span>
                    <div>
                      <strong>Recordatorio enviado</strong>
                      <small>WhatsApp · hace 4 min · Entregado ✓✓</small>
                    </div>
                    <span className="wa-check">✓✓</span>
                  </div>
                  <p>“Hola Lucía, te esperamos mañana 09:00 en Sinapsa Clínica. Responde SÍ para confirmar.”</p>
                </div>
              </div>
            </div>

            <div className="float-card float-1">
              <span className="float-icon">⚡</span>
              <div><strong>-41% no-shows</strong><small>con recordatorios automáticos</small></div>
            </div>
            <div className="float-card float-2">
              <span className="float-icon blue">◈</span>
              <div><strong>Auditoría + Módulos</strong><small>Trazabilidad total por especialidad</small></div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="trust-bar reveal">
            <small>Pensado para Guatemala</small>
            <div className="trust-logos">
              <span>Clínicas privadas</span><span>Consultorios</span><span>Policlínicas</span><span>Centros de especialidades</span><span>Redes médicas</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA / SOLUCION */}
      <section className="section section-problem">
        <div className="container">
          <div className="split reveal">
            <div className="problem-card">
              <h3>Sin Sinapsa</h3>
              <ul className="bad-list">
                <li>Agenda en papeles, Excel y chats perdidos</li>
                <li>Expedientes y recetas sin trazabilidad</li>
                <li>Auditoría imposible: nadie sabe quién editó qué</li>
                <li>Cobros manuales y reportes que toman días</li>
              </ul>
            </div>
            <div className="solution-card">
              <div className="solution-badge">Con Sinapsa</div>
              <h3>Gestión completa. Auditoría total.</h3>
              <p>Un solo lugar para <strong>citas, expediente, recetas, órdenes, auditoría y facturación</strong>. Cada acción queda registrada y cada especialidad tiene su módulo.</p>
              <div className="solution-metrics">
                <div><strong>360°</strong><span>paciente: citas · expediente · recetas</span></div>
                <div><strong>100%</strong><span>trazable: auditoría por usuario y fecha</span></div>
                <div><strong>+Módulos</strong><span>por especialidad, activa a demanda</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="producto" className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Producto</span>
            <h2>Gestión total del paciente. <br />Auditable y por especialidad.</h2>
            <p>De la cita a la receta y la factura, todo queda registrado. Activa solo los módulos que tu centro o consultorio necesita.</p>
          </div>

          <div className="features reveal">
            <article className="feature feature-wide">
              <div className="feature-copy">
                <span className="feature-icon teal">▦</span>
                <h3>Citas y agenda sin fricción</h3>
                <p>Agenda multi-doctor, multi-sede y por boxes. Lista de espera inteligente y reprogramación en un clic.</p>
                <ul><li>Recordatorios WhatsApp / SMS / email</li><li>Check-in con QR y sala de espera virtual</li><li>Sincroniza con Google Calendar</li></ul>
              </div>
              <div className="feature-visual">
                <div className="cal-grid">
                  <div className="cal-head"><span>Lun 15</span><span>Mar 16</span><span>Mié 17</span><span>Jue 18</span></div>
                  <div className="cal-cells">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <span key={i} className={i === 2 || i === 5 ? "cal-busy" : i === 7 ? "cal-free" : ""} />
                    ))}
                  </div>
                </div>
              </div>
            </article>

            {[
              { icon: "◈", color: "blue", title: "Expediente clínico 360°", desc: "Historia por episodios, signos vitales, alergias, antecedentes y evolución. Todo en un timeline claro.", bullets: ["Plantillas y formularios por especialidad", "CIE-10, adjuntos, imágenes y PACS", "Notas por voz con IA y transcripción"] },
              { icon: "✎", color: "violet", title: "Recetas y órdenes", desc: "Recetas electrónicas, órdenes de laboratorio e interconsultas con firma y trazabilidad completa.", bullets: ["Recetario con vademécum y dosis", "Envío por WhatsApp / PDF con QR", "Control de vigencia y duplicados"] },
              { icon: "◎", color: "teal", title: "Pacientes y comunicación", desc: "Ficha única, consentimientos informados y portal del paciente. Comunicación sin perder trazabilidad.", bullets: ["Portal marca blanca + recordatorios", "Consentimientos con firma biométrica", "Historial de contacto centralizado"] },
              { icon: "⬣", color: "ink", title: "Auditoría completa", desc: "Cada creación, edición y acceso queda registrado: quién, cuándo y qué cambió. Listo para auditoría interna o externa.", bullets: ["Log inmutable por usuario y fecha", "Control de accesos por rol y sede", "Exportable para inspección"] },
              { icon: "⬢", color: "amber", title: "Facturación y analítica", desc: "Presupuestos, facturas, cobros con tarjeta y reportes por doctor, servicio y sede. Sin Excel.", bullets: ["Cuentas por cobrar y conciliación", "Reportes de ocupación e ingresos en Q", "Exportación contable"] },
            ].map((f) => (
              <article key={f.title} className="feature">
                <span className={`feature-icon ${f.color}`}>{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <ul>{f.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
              </article>
            ))}
          </div>

          <div className="integrations reveal">
            <small>Se conecta con lo que ya usas</small>
            <div className="integration-pills">
              <span>WhatsApp</span><span>Google Calendar</span><span>Facturación GT</span><span>Stripe</span><span>Laboratorios</span><span>Zapier</span><span>API REST</span>
            </div>
          </div>
        </div>
      </section>

      {/* MÓDULOS POR ESPECIALIDAD */}
      <section className="section section-modulos">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Módulos por especialidad</span>
            <h2>Tu centro, tus especialidades.<br/>Activa solo lo que atiendes.</h2>
            <p>Cada módulo trae plantillas, formularios, escalas y flujos propios. Paga solo por los que usas. Un mismo paciente, expediente unificado.</p>
          </div>

          <div className="modulos-grid reveal">
            {[
              { icon: "◍", name: "Medicina General", desc: "Consulta integral, control de crónicos y preventivos", tags: ["SOAP", "Signos vitales", "Receta general"] },
              { icon: "♥", name: "Pediatría", desc: "Curvas OMS, vacunas y desarrollo", tags: ["Percentiles", "Carnet vacunación", "Crecimiento"] },
              { icon: "◉", name: "Ginecología", desc: "Control prenatal, colposcopía y plan familiar", tags: ["Prenatal", "PAP", "Eco obstétrico"] },
              { icon: "♡", name: "Cardiología", desc: "Riesgo CV, ECG y seguimiento", tags: ["Framingham", "ECG", "MAPA/Holter"] },
              { icon: "⬢", name: "Traumatología", desc: "Lesión, cirugía y rehabilitación", tags: ["Dolor EVA", "Órdenes Rx/RM", "Fisioterapia"] },
              { icon: "✦", name: "Dermatología", desc: "Mapa corporal y seguimiento fotográfico", tags: ["Fotoderma", "Biopsia", "Tratamientos"] },
              { icon: "◎", name: "Odontología", desc: "Odontograma, endodoncia y presupuestos", tags: ["Odontograma", "Plan tratamiento", "Prótesis"] },
              { icon: "⬔", name: "Psicología", desc: "Sesiones, escalas y notas privadas", tags: ["PHQ-9 / GAD-7", "Sesión", "Plan terapéutico"] },
            ].map((m) => (
              <div key={m.name} className="modulo-card">
                <span className="modulo-icon">{m.icon}</span>
                <h4>{m.name}</h4>
                <p>{m.desc}</p>
                <div className="modulo-tags">{m.tags.map((t) => <span key={t}>{t}</span>)}</div>
              </div>
            ))}
          </div>

          <div className="modulos-foot reveal">
            <div className="modulos-foot-card">
              <strong>¿Otra especialidad?</strong>
              <p>Oftalmología, ORL, Urología, Neurología y más. Crea tu plantilla en minutos o te la configuramos.</p>
            </div>
            <div className="modulos-foot-list">
              <span>✓ Un expediente, múltiples especialidades</span>
              <span>✓ Activa/desactiva por doctor y sede</span>
              <span>✓ Todo auditable: quién atendió y qué registró</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEGMENTOS */}
      <section id="soluciones" className="section section-soft">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Soluciones</span>
            <h2>Hecho para quien atiende pacientes. <br />Escala con quien dirige centros.</h2>
          </div>
          <div className="segments reveal">
            <div className="segment">
              <div className="segment-head">
                <span className="segment-icon">◆</span>
                <h3>Para doctores</h3>
                <small>1 – 3 profesionales</small>
              </div>
              <p>Empieza en minutos. Lleva tu agenda y pacientes a un lugar seguro y profesional.</p>
              <ul><li>Agenda y pacientes ilimitados</li><li>Historia clínica + recetas</li><li>Recordatorios y cobro online</li></ul>
              <a href="#precios" className="segment-link">Ver plan Esencial →</a>
            </div>
            <div className="segment segment-accent">
              <div className="popular">Más elegido</div>
              <div className="segment-head">
                <span className="segment-icon teal">⬔</span>
                <h3>Para clínicas</h3>
                <small>4 – 20 profesionales</small>
              </div>
              <p>Coordina equipo, boxes y facturación sin añadir personal administrativo.</p>
              <ul><li>Multi-agenda y gestión de boxes</li><li>Roles, permisos y turnos</li><li>Informes de rentabilidad por doctor</li></ul>
              <a href="#precios" className="segment-link">Ver plan Profesional →</a>
            </div>
            <div className="segment">
              <div className="segment-head">
                <span className="segment-icon">⬢</span>
                <h3>Para grupos y redes</h3>
                <small>20+ · multi-sede</small>
              </div>
              <p>Gobernanza, interoperabilidad y datos centralizados para crecer con orden.</p>
              <ul><li>Consolidado multi-centro</li><li>SSO, HL7/FHIR, API</li><li>Soporte dedicado + SLA</li></ul>
              <a href="#precios" className="segment-link">Hablar con ventas →</a>
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="section">
        <div className="container">
          <div className="steps reveal">
            <div className="steps-head">
              <span className="eyebrow">Implementación</span>
              <h2>De tu sistema actual a Sinapsa en 48 horas.</h2>
              <p>Nosotros migramos tus datos. Tú sigues atendiendo.</p>
            </div>
            <div className="steps-grid">
              {[
                { n: "01", t: "Importamos todo", d: "Pacientes, citas e historial desde Excel, Clinic Cloud, Doctoralia o tu software actual. Sin plantillas infernales." },
                { n: "02", t: "Configuramos tu centro", d: "Agenda, boxes, servicios, tarifas y recordatorios. Te dejamos una formación de 45 min por videollamada." },
                { n: "03", t: "Empiezas a cobrar mejor", d: "Recordatorios automáticos, pagos online y facturas que salen solas. Métricas desde el día uno." },
              ].map((s) => (
                <div key={s.n} className="step">
                  <span className="step-n">{s.n}</span>
                  <h4>{s.t}</h4>
                  <p>{s.d}</p>
                </div>
              ))}
            </div>
            <div className="steps-foot">
              <span>⏱ Migración media: 1,8 días</span>
              <span>🛡️ Copia de seguridad diaria · Datos en UE</span>
              <span>🤝 Onboarding 1:1 incluido en todos los planes</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="precios" className="section section-pricing">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Precios</span>
            <h2>Precios claros. Sin sorpresas.</h2>
            <p>Empieza gratis 14 días. Sin tarjeta. Cancela cuando quieras.</p>

            <div className="billing-toggle" role="group" aria-label="Facturación">
              <button className={!annual ? "active" : ""} onClick={() => setAnnual(false)}>Mensual</button>
              <button className={annual ? "active" : ""} onClick={() => setAnnual(true)}>Anual <span className="save">−20%</span></button>
            </div>
            <small className="billing-note">En anual, 2 meses gratis. Impuestos no incluidos.</small>
          </div>

          <div className="pricing-grid reveal">
            {/* Esencial */}
            <div className="price-card">
              <div className="price-head">
                <h3>Esencial</h3>
                <p>Para el profesional que quiere orden total.</p>
                <div className="price">
                  <span className="currency">Q</span>
                  <span className="amount">{price(299).toLocaleString("es-GT")}</span>
                  <span className="per">/ mes por profesional</span>
                </div>
                {annual && <small className="price-note">Q299 en mensual · facturado anual</small>}
              </div>
              <ul className="price-list">
                <li>Citas, pacientes y expediente ilimitados</li>
                <li>Recetas y órdenes electrónicas</li>
                <li>1 módulo de especialidad incluido</li>
                <li>Recordatorios WhatsApp/SMS (500/mes)</li>
                <li>Auditoría básica + portal del paciente</li>
              </ul>
              <button className="btn btn-white btn-block" onClick={() => showToast("¡Plan Esencial seleccionado! Te llevamos al checkout.")}>Probar 14 días gratis</button>
              <small className="price-foot">Sin tarjeta · Migración incluida</small>
            </div>

            {/* Profesional */}
            <div className="price-card price-featured">
              <div className="price-badge">Más popular</div>
              <div className="price-head">
                <h3>Profesional</h3>
                <p>Para clínicas con varias especialidades.</p>
                <div className="price">
                  <span className="currency">Q</span>
                  <span className="amount">{price(599).toLocaleString("es-GT")}</span>
                  <span className="per">/ mes por profesional</span>
                </div>
                {annual && <small className="price-note">Q599 en mensual · facturado anual</small>}
              </div>
              <ul className="price-list">
                <li><strong>Todo lo de Esencial, más:</strong></li>
                <li>3 módulos de especialidad incluidos</li>
                <li>Facturación, presupuestos y cobros en Q</li>
                <li>Recordatorios ilimitados + campañas</li>
                <li>Gestión de boxes, turnos y auditoría completa</li>
                <li>Reportes por doctor / especialidad</li>
              </ul>
              <button className="btn btn-primary btn-block" onClick={() => showToast("¡Plan Profesional seleccionado! Redirigiendo a checkout…")}>Elegir Profesional</button>
              <small className="price-foot">Onboarding 1:1 incluido · Setup en 48h</small>
            </div>

            {/* Centro */}
            <div className="price-card">
              <div className="price-head">
                <h3>Centro</h3>
                <p>Para centros y policlínicas multi-sede.</p>
                <div className="price">
                  <span className="currency">Q</span>
                  <span className="amount">{price(1290).toLocaleString("es-GT")}</span>
                  <span className="per">/ mes · hasta 10 prof.</span>
                </div>
                {annual && <small className="price-note">Incluye 10 profesionales · +Q129 / extra</small>}
              </div>
              <ul className="price-list">
                <li>Módulos ilimitados por especialidad</li>
                <li>Multi-sede y consolidado</li>
                <li>Roles granulares + auditoría inmutable</li>
                <li>Stock, compras y comisiones</li>
                <li>API, webhooks, HL7/FHIR</li>
                <li>Gestor de cuenta dedicado</li>
              </ul>
              <button className="btn btn-white btn-block" onClick={() => showToast("Hablemos de tu centro → equipo comercial notificado.")}>Hablar con ventas</button>
              <small className="price-foot">SLA 99,9% · Contrato y DPA</small>
            </div>
          </div>

          <div className="pricing-enterprise reveal">
            <div>
              <h4>¿Red o grupo con varias sedes?</h4>
              <p>Módulos ilimitados, SSO, interoperabilidad y facturación centralizada. Despliegue asistido.</p>
            </div>
            <div className="enterprise-cta">
              <a href="#demo" className="btn btn-ink">Solicitar propuesta</a>
              <small>Respuesta en &lt; 4h laborables</small>
            </div>
          </div>

          <div className="guarantee reveal">
            <span className="guarantee-icon">🛡️</span>
            <div>
              <strong>Garantía Sinapsa 30 días</strong>
              <p>Si no ahorras tiempo en el primer mes, te devolvemos el importe. Sin preguntas.</p>
            </div>
            <div className="guarantee-badges">
              <span>Auditoría total</span><span>Datos en GT</span><span>ISO 27001</span><span>Cifrado AES-256</span>
            </div>
          </div>

          <div className="compare reveal">
            <h4>Comparativa rápida</h4>
            <div className="compare-table-wrap">
              <table className="compare-table">
                <thead><tr><th></th><th>Esencial</th><th>Profesional</th><th>Centro</th></tr></thead>
                <tbody>
                  <tr><td>Citas · Expediente · Recetas</td><td>●</td><td>●</td><td>●</td></tr>
                  <tr><td>Módulos por especialidad</td><td>1 incluido</td><td>3 incluidos</td><td>Ilimitados</td></tr>
                  <tr><td>Auditoría trazable</td><td>Básica</td><td>Completa</td><td>Inmutable</td></tr>
                  <tr><td>Recordatorios WhatsApp</td><td>500/mes</td><td>Ilimitados</td><td>Ilimitados</td></tr>
                  <tr><td>Facturación y cobros en Q</td><td>—</td><td>●</td><td>●</td></tr>
                  <tr><td>Multi-sede · API · HL7</td><td>—</td><td>—</td><td>●</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section id="testimonios" className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Casos reales</span>
            <h2>De “no damos abasto” a agenda llena y cobrada.</h2>
          </div>
          <div className="testimonials reveal">
            <figure className="quote">
              <div className="quote-head">
                <img src="https://i.pravatar.cc/100?img=32" alt="" />
                <div><strong>Dra. Elena Morell</strong><span>Cardiología · Clínica Levante · 6 doctores</span></div>
                <span className="quote-stars">★★★★★</span>
              </div>
              <blockquote>“Pasamos de un 18% de ausencias a un 3%. Solo con los recordatorios pagamos Sinapsa 4 veces. Y la historia clínica por fin es usable.”</blockquote>
              <figcaption><strong>+41%</strong> asistencia · <strong>−19h</strong> admin/mes</figcaption>
            </figure>
            <figure className="quote">
              <div className="quote-head">
                <img src="https://i.pravatar.cc/100?img=15" alt="" />
                <div><strong>Dr. Javier Coves</strong><span>Traumatología · Centro Arco · 12 profesionales</span></div>
                <span className="quote-stars">★★★★★</span>
              </div>
              <blockquote>“La migración fue en un día. Ahora facturamos al momento desde el box, con el TPV integrado. Cobramos un 23% más rápido.”</blockquote>
              <figcaption><strong>2,4×</strong> velocidad de cobro · <strong>4,8/5</strong> satisfacción paciente</figcaption>
            </figure>
            <figure className="quote">
              <div className="quote-head">
                <img src="https://i.pravatar.cc/100?img=26" alt="" />
                <div><strong>Dirección · Grupo Vital</strong><span>4 sedes · 34 profesionales</span></div>
                <span className="quote-stars">★★★★★</span>
              </div>
              <blockquote>“Por fin vemos la rentabilidad por sede y doctor. Detectamos una fuga del 12% y la corregimos en dos semanas.”</blockquote>
              <figcaption><strong>12%</strong> fuga detectada · <strong>ROI 6×</strong> en 90 días</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section section-soft">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">FAQ</span>
            <h2>Preguntas frecuentes</h2>
          </div>
          <div className="faq reveal">
            {[
              { q: "¿Necesito tarjeta para probar?", a: "No. 14 días gratis sin tarjeta. Si decides quedarte, eliges plan en quetzales (GTQ) y pagas. Si no, tus datos se borran automáticamente." },
              { q: "¿Migran mis datos de mi software actual?", a: "Sí, gratis. Importamos pacientes, citas, expedientes y recetas desde Excel, Google Sheets, Clinic Cloud, Doctoralia u otro software. Te entregamos todo auditado." },
              { q: "¿Es seguro y auditable?", a: "Sí. Cifrado AES-256, copias diarias, control por roles y auditoría inmutable: cada acción queda registrada con usuario, fecha y cambio realizado. Cumple buenas prácticas de protección de datos." },
              { q: "¿Cómo funcionan los módulos por especialidad?", a: "Activas solo lo que atiendes: pediatría, ginecología, cardiología, derma, odonto, etc. Cada módulo trae sus plantillas y flujos. Puedes añadir o quitar módulos por doctor o sede y el expediente sigue unificado." },
              { q: "¿Qué pasa si cancelo?", a: "Exportas todo (citas, expedientes, recetas, auditoría) en CSV/PDF en un clic. Sin permanencia." },
              { q: "¿Facturación en quetzales?", a: "Sí. Presupuestos, facturas, recibos y cobros en GTQ, con control de cuentas por cobrar, caja y reportes por doctor y especialidad. Exportación contable incluida." },
            ].map((f, i) => (
              <div key={f.q} className={`faq-item ${openFaq === i ? "open" : ""}`}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                  <span>{f.q}</span><span className="faq-chev">▾</span>
                </button>
                <div className="faq-a"><p>{f.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="demo" className="cta-final reveal">
        <div className="container">
          <div className="cta-box">
            <div className="cta-copy">
              <h2>Haz que tu centro funcione como un reloj.</h2>
              <p>Prueba Sinapsa 14 días gratis. Con datos reales, con tu equipo, sin compromiso.</p>
              <div className="cta-actions">
                <a href="#precios" className="btn btn-primary btn-xl" onClick={() => showToast("¡Vamos! Elige tu plan para empezar.")}>Empezar gratis ahora</a>
                <a href="mailto:hola@sinapsa.health" className="btn btn-white btn-xl">Hablar con una persona</a>
              </div>
              <small>✓ Setup en 48h · ✓ Migración incluida · ✓ Cancela cuando quieras</small>
            </div>
            <div className="cta-visual" aria-hidden>
              <div className="cta-card">
                <div className="cta-card-head"><span>✔ Cita confirmada</span><span>09:42</span></div>
                <div className="cta-card-body">
                  <strong>Lucía Ferrer — Revisión</strong>
                  <span>Dr. Martín · Box 2 · 15 sep 09:00</span>
                  <div className="cta-progress"><span style={{ width: "78%" }} /></div>
                </div>
              </div>
              <div className="cta-card cta-card-2">
                <div className="cta-card-head"><span>Factura #2841</span><span>Pagada</span></div>
                <div className="cta-card-body">
                  <strong>Q 420.00</strong>
                  <span>Efectivo / Tarjeta •• 4242</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#" className="brand">
                <span className="brand-mark small"><svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="8" fill="#0F766E" /><path d="M14 7c-1.2 2.2-3.6 3.1-5.5 2.6 1.1 1.6 1 3.8-.4 5.3 1.9-.5 3.9.2 5 1.8 1.1-1.6 3.1-2.3 5-1.8-1.4-1.5-1.5-3.7-.4-5.3-1.9.5-4.3-.4-5.5-2.6Z" fill="white" /></svg></span>
                <span className="brand-name">sinapsa</span>
              </a>
              <p>Sistema operativo para centros médicos y doctores. Citas, expediente, recetas, auditoría y facturación — con módulos por especialidad.</p>
              <small>Hecho con ♥ para Guatemala · Soporte local</small>
            </div>
            <div>
              <strong>Producto</strong>
              <a href="#producto">Funcionalidades</a><a href="#precios">Precios</a><a href="#testimonios">Casos</a><a href="#faq">FAQ</a>
            </div>
            <div>
              <strong>Legal</strong>
              <a href="#" onClick={(e) => { e.preventDefault(); showToast("Página legal — pendiente de contenido.") }}>Privacidad</a><a href="#" onClick={(e) => { e.preventDefault(); showToast("Página legal — pendiente de contenido.") }}>Términos</a><a href="#" onClick={(e) => { e.preventDefault(); showToast("Página legal — pendiente de contenido.") }}>Cookies</a><a href="#" onClick={(e) => { e.preventDefault(); showToast("Página legal — pendiente de contenido.") }}>DPA</a>
            </div>
            <div>
              <strong>Contacto</strong>
              <a href="mailto:hola@sinapsa.health">hola@sinapsa.health</a><a href="tel:+50200000000">+502 0000 0000</a><span className="footer-muted">L–V 8:00–18:00 GT</span>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Sinapsa Health. Todos los derechos reservados.</span>
            <span className="footer-badges"><span>Auditoría</span><span>Q · GTQ</span><span>HL7 FHIR</span><span>Módulos</span></span>
          </div>
        </div>
      </footer>

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}
