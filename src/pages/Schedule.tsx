import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Screen from '../components/Screen'
import TabBar from '../components/TabBar'

const calContainer: Variants = { animate: { transition: { staggerChildren: 0.014 } } }
const calCell: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 500, damping: 30 } },
}

const DOW = ['일', '월', '화', '수', '목', '금', '토']
const TODAY = 12
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)

export default function Schedule() {
  const nav = useNavigate()

  return (
    <Screen tabbar>
      <button className="back-btn" onClick={() => nav(-1)} aria-label="뒤로">
        <svg width="30" height="22" viewBox="0 0 30 22" fill="none" stroke="#1b1b1d" strokeWidth="2.4">
          <path d="M11 3L3 11l8 8M3 11h24" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h1 className="page-title" style={{ marginBottom: 10 }}>일정 관리</h1>
      <p className="cal-month">
        2026. 07 <span className="muted">▾</span>
      </p>

      <div className="cal-grid">
        {DOW.map((d) => (
          <div key={d} className="dow">{d}</div>
        ))}
      </div>

      <motion.div className="cal-grid" variants={calContainer} initial="initial" animate="animate">
        {DAYS.map((n) => (
          <motion.div key={n} className="cal-cell" variants={calCell}>
            {n === TODAY && <span className="cal-today">오늘</span>}
            <span className={`num ${n === TODAY ? 'today-num' : ''}`}>{n}</span>
            <span className={`dot ${n === TODAY ? 'orange' : n <= 12 ? '' : 'hidden'}`} />
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        className="btn-primary btn-bottom"
        whileTap={{ scale: 0.97 }}
        onClick={() => nav('/report')}
      >
        리포트 확인하기
      </motion.button>

      <TabBar />
    </Screen>
  )
}
