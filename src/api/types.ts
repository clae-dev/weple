// 백엔드 스키마와 대응. 운영에서는 openapi-typescript로 자동 생성 권장(4.2절).

export type TaskStatus =
  | 'OPEN'
  | 'ASSIGNED'
  | 'CLAIMED'
  | 'IN_PROGRESS'
  | 'DONE'
  | 'BLOCKED'

export interface Staff {
  id: number
  code: string
  name: string
  role: 'STAFF' | 'MANAGER'
}

export interface Task {
  id: number
  type: string
  item: string | null
  location: string | null
  urgency: string
  status: TaskStatus
  assignee_id: number | null
  raw_text: string | null
  block_reason: string | null
  input_channel: string
  confidence?: number | null
  created_at: string
  updated_at: string
}

export interface LoginResponse {
  token: string
  staff: Staff
}

export interface DailyReport {
  date: string
  total: number
  by_status: Record<string, number>
  by_hour: Record<string, number>
  voluntary_vs_assigned: { voluntary: number; assigned: number }
  block_rate: number
}

export interface WsMessage {
  event: string
  payload: any
}
