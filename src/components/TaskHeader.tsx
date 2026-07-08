import { useNavigate } from 'react-router-dom'
import { CURRENT_TASK, type Urgency } from '../data/mock'
import type { Task } from '../store/workspace'

const pillClass: Record<Urgency, string> = {
  긴급: 'pill solid-red',
  보통: 'pill solid-yellow',
  양호: 'pill solid-green',
}

// 테스크 할당 / 처리이력 공용 헤더. task 주면 그 태스크로, 없으면 샘플 헤더.
export default function TaskHeader({ title, task }: { title: string; task?: Task }) {
  const nav = useNavigate()
  const category = task?.category ?? CURRENT_TASK.category
  const time = task?.time ?? CURRENT_TASK.time
  const urgency = task?.urgency ?? CURRENT_TASK.urgency
  const lines = task ? [task.title] : CURRENT_TASK.titleLines

  return (
    <>
      <button className="back-btn" onClick={() => nav(-1)} aria-label="뒤로">
        <svg width="30" height="22" viewBox="0 0 30 22" fill="none" stroke="#1b1b1d" strokeWidth="2.4">
          <path d="M11 3L3 11l8 8M3 11h24" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h1 className="page-title" style={{ marginBottom: 14 }}>{title}</h1>
      <div className="task-head-row">
        <div className="col">
          <div className="task-meta-line">
            {category && <span className="cat">{category}</span>}
            <span>{time}</span>
          </div>
          <h2 className="task-big-title" style={{ margin: 0 }}>
            {lines.map((l, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {l}
              </span>
            ))}
          </h2>
        </div>
        {urgency && <span className={pillClass[urgency]}>{urgency}</span>}
      </div>
      <div className="hairline" />
    </>
  )
}
