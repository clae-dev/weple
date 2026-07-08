import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Screen from '../components/Screen'
import TaskHeader from '../components/TaskHeader'
import { AUDIT, HISTORY } from '../data/mock'
import { useWorkspace } from '../store/workspace'
import { listContainer, listItem } from '../ui/motion'

export default function TaskHistory() {
  const { id } = useParams()
  const { state } = useWorkspace()
  const task = state.tasks.find((t) => String(t.id) === id)
  return (
    <Screen>
      <TaskHeader title="테스크 할당" task={task} />

      <h2 className="hist-title">처리 이력</h2>

      <motion.div className="hist" variants={listContainer} initial="initial" animate="animate">
        {HISTORY.map((h, i) => (
          <motion.div key={i} className="hist-item" variants={listItem}>
            <span className={`hist-dot ${h.color}`} />
            <span className="hist-text" dangerouslySetInnerHTML={{ __html: boldName(h.text) }} />
            {h.time && <span className="hist-time">{h.time}</span>}
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="audit-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="cap">처리 이력 — 감사추적</div>
        {AUDIT.map((a, i) => (
          <div key={i} className="audit-row">
            <span className={`d ${a.color}`} />
            <span dangerouslySetInnerHTML={{ __html: boldName(a.text) }} />
            {a.time && <span className="at">{a.time}</span>}
          </div>
        ))}
      </motion.div>
    </Screen>
  )
}

// "김홍중 스탭이 ..." 에서 앞 이름+스탭 볼드 처리
function boldName(text: string): string {
  return text.replace(/^([가-힣]+ ?스탭)/, '<b>$1</b>')
}
