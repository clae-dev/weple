// 얇은 fetch 래퍼 — JWT 자동 첨부, 표준 오류 처리.

const TOKEN_KEY = 'report_token'
const STAFF_KEY = 'report_staff'

export const auth = {
  get token() {
    return localStorage.getItem(TOKEN_KEY)
  },
  get staff() {
    const s = localStorage.getItem(STAFF_KEY)
    return s ? JSON.parse(s) : null
  },
  save(token: string, staff: unknown) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(STAFF_KEY, JSON.stringify(staff))
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(STAFF_KEY)
  },
}

export class ApiError extends Error {
  status: number
  code: string
  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

export async function api<T = unknown>(
  path: string,
  opts: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string>),
  }
  if (auth.token) headers.Authorization = `Bearer ${auth.token}`

  const res = await fetch(`/api${path}`, { ...opts, headers })
  if (res.status === 204) return undefined as T
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const detail = body.detail ?? {}
    throw new ApiError(res.status, detail.code ?? 'ERROR', detail.message ?? res.statusText)
  }
  return body as T
}
