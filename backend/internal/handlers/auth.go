package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"regexp"
	"strings"
	"time"

	"sinapsa/backend/internal/config"
	"sinapsa/backend/internal/database"
	"sinapsa/backend/internal/middleware"
	"sinapsa/backend/internal/models"
	"sinapsa/backend/internal/services"
)

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)

type AuthHandler struct {
	cfg      *config.Config
	db       *database.DB
	jwt      *services.JWTService
	email    *services.EmailService
}

func NewAuthHandler(cfg *config.Config, db *database.DB, jwt *services.JWTService, email *services.EmailService) *AuthHandler {
	return &AuthHandler{cfg: cfg, db: db, jwt: jwt, email: email}
}

func normalizeEmail(e string) string {
	return strings.ToLower(strings.TrimSpace(e))
}

func isValidEmail(e string) bool {
	return emailRegex.MatchString(e)
}

// POST /api/auth/request-otp  {email}
func (h *AuthHandler) RequestOTP(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(204)
		return
	}
	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"method not allowed"}`, 405)
		return
	}
	var body struct {
		Email string `json:"email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error":"email requerido"}`, 400)
		return
	}
	email := normalizeEmail(body.Email)
	if email == "" || !isValidEmail(email) {
		http.Error(w, `{"error":"correo no válido"}`, 400)
		return
	}

	// ¿Usuario existe e invitado?
	var user models.User
	if err := h.db.Where("email = ?", email).First(&user).Error; err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(403)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Este correo no tiene invitación. Solicita acceso al administrador.",
		})
		return
	}
	if !user.IsActive {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(403)
		json.NewEncoder(w).Encode(map[string]string{"error": "Cuenta desactivada. Contacta al administrador."})
		return
	}

	// Rate limit: max 5 OTPs en última hora
	var count int64
	h.db.Model(&models.OTPCode{}).Where("email = ? AND created_at > ?", email, time.Now().Add(-1*time.Hour)).Count(&count)
	if count >= 5 {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(429)
		json.NewEncoder(w).Encode(map[string]string{"error": "Demasiadas solicitudes. Intenta de nuevo en una hora."})
		return
	}

	// Generar OTP
	code, err := services.GenerateOTP()
	if err != nil {
		log.Printf("[auth] error generando OTP: %v", err)
		http.Error(w, `{"error":"error interno"}`, 500)
		return
	}
	hash := services.HashOTP(code)
	otp := models.OTPCode{
		Email:     email,
		CodeHash:  hash,
		ExpiresAt: time.Now().Add(time.Duration(h.cfg.OTPExpiryMin) * time.Minute),
	}
	if err := h.db.Create(&otp).Error; err != nil {
		log.Printf("[auth] error guardando OTP: %v", err)
		http.Error(w, `{"error":"error guardando código"}`, 500)
		return
	}

	// Enviar por Resend (si no hay key, solo log — no falla)
	if err := h.email.SendOTP(email, code); err != nil {
		log.Printf("[auth] error enviando OTP a %s: %v", email, err)
		// No exponemos si falló Resend como error duro si es config; pero sí avisamos
		// Si estamos en dev sin API key, ya se logueó y no entró aquí
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(502)
		json.NewEncoder(w).Encode(map[string]string{"error": "No se pudo enviar el correo. Verifica la configuración de Resend."})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Código enviado a tu correo. Revisa tu bandeja (y spam).",
		"expiresIn": h.cfg.OTPExpiryMin * 60,
		// En development, devolvemos pista para probar sin correo
		"devHint": devHint(code, h.cfg.AppEnv),
	})
}

func devHint(code, env string) string {
	if env == "development" {
		return "DEV: código " + code
	}
	return ""
}

// POST /api/auth/verify-otp {email, code}
func (h *AuthHandler) VerifyOTP(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(204)
		return
	}
	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"method not allowed"}`, 405)
		return
	}
	var body struct {
		Email string `json:"email"`
		Code  string `json:"code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error":"datos inválidos"}`, 400)
		return
	}
	email := normalizeEmail(body.Email)
	code := strings.TrimSpace(body.Code)
	if email == "" || code == "" {
		http.Error(w, `{"error":"email y código requeridos"}`, 400)
		return
	}

	var user models.User
	if err := h.db.Where("email = ?", email).First(&user).Error; err != nil {
		http.Error(w, `{"error":"correo no autorizado"}`, 403)
		return
	}

	// Buscar último OTP vigente no usado
	var otp models.OTPCode
	err := h.db.Where("email = ? AND used_at IS NULL AND expires_at > ?", email, time.Now()).
		Order("created_at DESC").First(&otp).Error
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(401)
		json.NewEncoder(w).Encode(map[string]string{"error": "Código inválido o expirado. Solicita uno nuevo."})
		return
	}

	if otp.Attempts >= 5 {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(429)
		json.NewEncoder(w).Encode(map[string]string{"error": "Demasiados intentos. Solicita un nuevo código."})
		return
	}

	if services.HashOTP(code) != otp.CodeHash {
		h.db.Model(&otp).Update("attempts", otp.Attempts+1)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(401)
		json.NewEncoder(w).Encode(map[string]string{"error": "Código incorrecto."})
		return
	}

	// Marcar usado
	now := time.Now()
	h.db.Model(&otp).Update("used_at", &now)

	// Generar JWT
	token, err := h.jwt.Generate(&user)
	if err != nil {
		log.Printf("[auth] error generando jwt: %v", err)
		http.Error(w, `{"error":"error generando sesión"}`, 500)
		return
	}

	// Cookie httpOnly (para uso con credenciales) + JSON
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    token,
		Path:     "/",
		Expires:  time.Now().Add(7 * 24 * time.Hour),
		HttpOnly: true,
		Secure:   h.cfg.AppEnv == "production",
		SameSite: http.SameSiteLaxMode,
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Autenticado correctamente",
		"token":   token,
		"user": map[string]interface{}{
			"id":    user.ID,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}

// GET /api/auth/me — requiere auth
func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetClaims(r)
	if !ok {
		http.Error(w, `{"error":"no autenticado"}`, 401)
		return
	}
	var user models.User
	if err := h.db.Where("email = ?", claims.Email).First(&user).Error; err != nil {
		http.Error(w, `{"error":"usuario no encontrado"}`, 404)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"user": map[string]interface{}{
			"id":    user.ID,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}

// POST /api/auth/invite {email} — solo admin
func (h *AuthHandler) Invite(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(204)
		return
	}
	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"method not allowed"}`, 405)
		return
	}
	claims, ok := middleware.GetClaims(r)
	if !ok {
		http.Error(w, `{"error":"no autenticado"}`, 401)
		return
	}
	if claims.Role != "admin" {
		http.Error(w, `{"error":"solo administradores pueden invitar"}`, 403)
		return
	}
	var body struct {
		Email string `json:"email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error":"email requerido"}`, 400)
		return
	}
	email := normalizeEmail(body.Email)
	if !isValidEmail(email) {
		http.Error(w, `{"error":"correo no válido"}`, 400)
		return
	}
	var existing models.User
	if err := h.db.Where("email = ?", email).First(&existing).Error; err == nil {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "El correo ya estaba invitado", "email": email})
		return
	}
	now := time.Now()
	invitedBy := claims.UserID
	u := models.User{Email: email, Role: "user", IsActive: true, InvitedAt: &now, InvitedBy: &invitedBy}
	if err := h.db.Create(&u).Error; err != nil {
		http.Error(w, `{"error":"no se pudo crear invitación"}`, 500)
		return
	}
	_ = h.email.SendInvite(email) // best effort
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"message": "Invitación creada", "user": u})
}

// POST /api/auth/logout
func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{Name: "token", Value: "", Path: "/", Expires: time.Unix(0, 0), HttpOnly: true})
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Sesión cerrada"})
}

// GET /api/auth/users — lista invitados (solo admin)
func (h *AuthHandler) ListUsers(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetClaims(r)
	if !ok || claims.Role != "admin" {
		http.Error(w, `{"error":"no autorizado"}`, 403)
		return
	}
	var users []models.User
	h.db.Order("created_at DESC").Find(&users)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"users": users})
}
