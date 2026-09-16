package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

type EmailService struct {
	APIKey string
	From   string
	AppEnv string
}

func NewEmailService(apiKey, from, appEnv string) *EmailService {
	return &EmailService{APIKey: apiKey, From: from, AppEnv: appEnv}
}

// SendOTP envía el código por Resend. Si no hay API key, hace log (modo dev) y no falla.
func (s *EmailService) SendOTP(toEmail, code string) error {
	if s.APIKey == "" {
		log.Printf("[email] [MOCK] RESEND_API_KEY no configurada — codigo OTP para %s: %s (expira en 10 min)", toEmail, code)
		log.Printf("[email] Para producción configura RESEND_API_KEY en .env o variables de entorno")
		return nil
	}

	subject := fmt.Sprintf("Tu código de acceso Sinapsa: %s", code)
	html := fmt.Sprintf(`
<div style="font-family: Plus Jakarta Sans, system-ui, sans-serif; max-width:520px; margin:0 auto; padding:32px 24px;">
  <div style="text-align:center; margin-bottom:24px;">
    <div style="display:inline-block; background:#0F766E; color:white; width:48px; height:48px; line-height:48px; border-radius:12px; font-weight:800; font-size:20px;">S</div>
    <h1 style="margin:12px 0 0; font-size:22px; color:#0f172a;">Tu código para entrar a Sinapsa</h1>
  </div>
  <p style="color:#475569; font-size:15px; line-height:1.6;">Hola,</p>
  <p style="color:#475569; font-size:15px; line-height:1.6;">Usa este código para iniciar sesión. <strong>Expira en 10 minutos</strong> y solo puede usarse una vez:</p>
  <div style="text-align:center; margin:24px 0;">
    <span style="display:inline-block; letter-spacing:0.28em; font-size:32px; font-weight:800; color:#0f172a; background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding:14px 28px;">%s</span>
  </div>
  <p style="color:#94a3b8; font-size:13px; text-align:center;">Si no solicitaste este código, ignora este correo. Nunca compartas tu código con nadie.</p>
  <hr style="border:none; border-top:1px solid #e2e8f0; margin:24px 0;" />
  <p style="color:#94a3b8; font-size:12px; text-align:center;">Sinapsa · Sistema operativo para centros médicos<br/>Enviado a %s</p>
</div>`, code, toEmail)

	payload := map[string]interface{}{
		"from":    s.From,
		"to":      []string{toEmail},
		"subject": subject,
		"html":    html,
	}
	body, _ := json.Marshal(payload)

	req, err := http.NewRequest("POST", "https://api.resend.com/emails", bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+s.APIKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("[email] error enviando con Resend: %v", err)
		return fmt.Errorf("error conectando con Resend: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		log.Printf("[email] OTP enviado a %s (Resend status %d)", toEmail, resp.StatusCode)
		return nil
	}
	var resBody bytes.Buffer
	resBody.ReadFrom(resp.Body)
	log.Printf("[email] Resend error %d: %s", resp.StatusCode, resBody.String())
	return fmt.Errorf("Resend respondió %d: %s", resp.StatusCode, resBody.String())
}

// SendInvite notifica invitación (opcional)
func (s *EmailService) SendInvite(toEmail string) error {
	if s.APIKey == "" {
		log.Printf("[email] [MOCK] invitación para %s — sin API key, solo log", toEmail)
		return nil
	}
	subject := "Has sido invitado a Sinapsa"
	html := fmt.Sprintf(`
<div style="font-family: system-ui, sans-serif; max-width:520px; margin:0 auto; padding:32px 24px;">
  <h1 style="color:#0f172a;">¡Bienvenido a Sinapsa!</h1>
  <p style="color:#475569;">Has sido invitado a acceder a la plataforma Sinapsa.</p>
  <p style="color:#475569;">Ya puedes iniciar sesión en <strong>app.sinapsa</strong> usando tu correo <strong>%s</strong> — te enviaremos un código OTP cada vez que quieras entrar. Sin contraseñas.</p>
  <p style="color:#94a3b8; font-size:13px;">Si no esperabas esta invitación, ignora este correo.</p>
</div>`, toEmail)
	payload := map[string]interface{}{"from": s.From, "to": []string{toEmail}, "subject": subject, "html": html}
	body, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", "https://api.resend.com/emails", bytes.NewReader(body))
	req.Header.Set("Authorization", "Bearer "+s.APIKey)
	req.Header.Set("Content-Type", "application/json")
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		return nil
	}
	var b bytes.Buffer
	b.ReadFrom(resp.Body)
	return fmt.Errorf("Resend invite %d: %s", resp.StatusCode, b.String())
}
