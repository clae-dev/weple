import { useDailyReport } from '../features/tasks/hooks'

const STATUS_LABEL: Record<string, string> = {
  OPEN: '대기', ASSIGNED: '배정', CLAIMED: '처리중',
  IN_PROGRESS: '진행중', DONE: '완료', BLOCKED: '차단',
}

export default function Dashboard() {
  const { data, isLoading } = useDailyReport()
  if (isLoading || !data) return <div className="page"><p className="muted">불러오는 중…</p></div>

  const maxHour = Math.max(1, ...Object.values(data.by_hour))

  return (
    <div className="page">
      <h2>일일 운영 리포트 · {data.date}</h2>
      <div className="stat-row">
        <div className="stat"><div className="stat-num">{data.total}</div><div className="stat-label">총 기록</div></div>
        <div className="stat"><div className="stat-num">{Math.round(data.block_rate * 100)}%</div><div className="stat-label">차단율</div></div>
        <div className="stat"><div className="stat-num">{data.voluntary_vs_assigned.voluntary}</div><div className="stat-label">자발</div></div>
        <div className="stat"><div className="stat-num">{data.voluntary_vs_assigned.assigned}</div><div className="stat-label">지정</div></div>
      </div>

      <div className="card">
        <h3>상태별</h3>
        <div className="bars">
          {Object.entries(data.by_status).map(([k, v]) => (
            <div key={k} className="bar-row">
              <span className="bar-label">{STATUS_LABEL[k] ?? k}</span>
              <div className="bar" style={{ width: `${(v / data.total) * 100}%` }} />
              <span className="bar-val">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>시간대별 발생 추이</h3>
        <div className="hours">
          {Object.entries(data.by_hour).sort().map(([h, v]) => (
            <div key={h} className="hour-col">
              <div className="hour-bar" style={{ height: `${(v / maxHour) * 100}%` }} />
              <span className="hour-label">{h}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
