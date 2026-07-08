import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Screen from '../components/Screen'
import TabBar from '../components/TabBar'
import { DAILY_REPORT } from '../data/mock'
import { listContainer, listItem } from '../ui/motion'

export default function Report() {
  const nav = useNavigate()
  const r = DAILY_REPORT
  const max = Math.max(...r.byType.map((t) => t.count))

  return (
    <Screen tabbar>
      <button className="back-btn" onClick={() => nav(-1)} aria-label="뒤로">
        <svg width="30" height="22" viewBox="0 0 30 22" fill="none" stroke="#1b1b1d" strokeWidth="2.4">
          <path d="M11 3L3 11l8 8M3 11h24" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <p className="rp-date">{r.date}</p>
      <p className="rp-rev-label">일일 총 매출</p>
      <motion.p className="rp-rev" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {r.revenue.toLocaleString()}
      </motion.p>

      <motion.div className="rp-stats" variants={listContainer} initial="initial" animate="animate">
        {r.stats.map((s) => (
          <motion.div key={s.label} className="rp-stat" variants={listItem}>
            <div className="rp-stat-v">{s.value}</div>
            <div className="rp-stat-l">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <div className="rp-card">
        <div className="rp-card-head">
          <h3>유형별 발생</h3>
          <span className="rp-top">{r.topItem}</span>
        </div>
        <div className="rp-bars">
          {r.byType.map((t, i) => (
            <div key={t.name} className="rp-bar-row">
              <span className="rp-bar-label">{t.name}</span>
              <div className="rp-bar-track">
                <motion.div
                  className="rp-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${(t.count / max) * 100}%` }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <span className="rp-bar-val">{t.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rp-card">
        <h3 className="solo">개인별 처리 실적</h3>
        <table className="rp-table">
          <thead>
            <tr>
              <th>스탭</th>
              <th>완료</th>
              <th>평균 소요</th>
              <th>자발/ 지정</th>
            </tr>
          </thead>
          <tbody>
            {r.byStaff.map((s) => (
              <tr key={s.name}>
                <td>{s.name}</td>
                <td>{s.done}</td>
                <td>{s.avg}</td>
                <td>{s.ratio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TabBar />
    </Screen>
  )
}
