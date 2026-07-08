import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Screen from '../components/Screen'
import TabBar from '../components/TabBar'
import { type Urgency } from '../data/mock'
import { useWorkspace } from '../store/workspace'
import { listContainer, listItem } from '../ui/motion'

const solidPill: Record<Urgency, string> = {
  긴급: 'pill solid-red',
  보통: 'pill solid-yellow',
  양호: 'pill solid-green',
}

export default function StaffDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { state } = useWorkspace()
  const staff = state.staff.find((s) => String(s.id) === id) ?? state.staff[0]
  const history = state.tasks.filter((t) => t.status === '완료' && t.assignees.includes(staff.name))

  return (
    <Screen tabbar>
      <button className="back-btn" onClick={() => nav(-1)} aria-label="뒤로">
        <svg width="30" height="22" viewBox="0 0 30 22" fill="none" stroke="#1b1b1d" strokeWidth="2.4">
          <path d="M11 3L3 11l8 8M3 11h24" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h1 className="page-title">직원 관리</h1>

      <h2 className="hist-title">스텝 목록</h2>
      <div className="staff-card" style={{ marginBottom: 0 }}>
        <div className="avatar">{staff.name.charAt(0)}</div>
        <div className="row-main">
          <div className="staff-name">{staff.name} /</div>
          <div className="staff-role">{staff.role}</div>
        </div>
        <span className="radio" />
      </div>

      <h2 className="hist-title" style={{ marginTop: 30 }}>처리 이력</h2>
      {history.length === 0 && <p className="muted" style={{ paddingLeft: 4 }}>완료한 태스크가 없습니다.</p>}
      <motion.ul className="timeline orange" variants={listContainer} initial="initial" animate="animate">
        {history.map((t) => (
          <motion.li key={t.id} className="tl-item" variants={listItem}>
            <span className="tl-dot" />
            {t.category && <div className="tl-cat">{t.category}</div>}
            <div className="tl-title">{t.title}</div>
            <div className="tl-row2">
              <div className="tl-pills">
                {t.urgency && <span className={solidPill[t.urgency]}>{t.urgency}</span>}
                <span className="tl-time">{t.time}</span>
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ul>

      <TabBar />
    </Screen>
  )
}
