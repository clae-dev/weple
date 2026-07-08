import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

interface History {
  id: number
  from_status: string | null
  to_status: string
  reason: string | null
  created_at: string
}

export default function Detail() {
  const { id } = useParams()
  const { data } = useQuery<History[]>({
    queryKey: ['history', id],
    queryFn: () => api<History[]>(`/tasks/${id}/history`),
  })

  return (
    <div className="page">
      <h2>태스크 #{id} 이력</h2>
      <div className="timeline">
        {(data ?? []).map((h) => (
          <div key={h.id} className="timeline-item">
            <div className="dot" />
            <div>
              <b>{h.from_status ? `${h.from_status} → ${h.to_status}` : h.to_status}</b>
              {h.reason && <div className="muted">{h.reason}</div>}
              <div className="ts">{new Date(h.created_at).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
