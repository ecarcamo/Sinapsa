const BASE = (import.meta.env.VITE_BACKEND_URL as string | undefined) || ""

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem("sinapsa_token")
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string> | undefined),
  }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers,
    credentials: "include",
  })
  const text = await res.text()
  let data: any = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { raw: text }
  }
  if (!res.ok) {
    const msg = data?.error || data?.message || `Error ${res.status}`
    throw new Error(msg)
  }
  return data
}

export async function requestOTP(email: string) {
  return apiFetch("/api/auth/request-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

export async function verifyOTP(email: string, code: string) {
  return apiFetch("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  })
}

export async function getMe() {
  return apiFetch("/api/auth/me")
}

export async function inviteUser(email: string) {
  return apiFetch("/api/auth/invite", {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

export async function listUsers() {
  return apiFetch("/api/auth/users")
}

export async function logoutReq() {
  return apiFetch("/api/auth/logout", { method: "POST" })
}
