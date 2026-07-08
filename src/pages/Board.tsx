import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Screen from '../components/Screen'
import TabBar from '../components/TabBar'
import { type BoardTab, type Urgency } from '../data/mock'
import { useWorkspace, type Task } from '../store/workspace'
import { listContainer, listItem } from '../ui/motion'

const solidPill: Record<Urgency, string> = {
  긴급: 'pill solid-red',
  보통: 'pill solid-yellow',
  양호: 'pill solid-green',
}

export default function Board() {
  const [tab, setTab] = useState<BoardTab>('열림')
  const nav = useNavigate()
  const { tasksByTab, tabCounts, completeTask } = useWorkspace()
  const counts = tabCounts()
  const tasks = tasksByTab(tab)

  const TABS: { key: BoardTab; dot?: boolean }[] = [
    { key: '열림' },
    { key: '내 업무', dot: counts['내 업무'] > 0 },
    { key: '완료' },
  ]

  const onTap = (t: Task) => {
    if (t.status === '열림') nav(`/tasks/${t.id}/assign`)
    else if (t.status === '내 업무') completeTask(t.id) // 완료 처리 → 리포트 자동 반영
  }

  return (
    <Screen tabbar>
      <button className="back-btn" onClick={() => nav(-1)} aria-label="뒤로">
        <svg width="30" height="22" viewBox="0 0 30 22" fill="none" stroke="#1b1b1d" strokeWidth="2.4">
          <path d="M11 3L3 11l8 8M3 11h24" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h1 className="page-title">테스크 보드</h1>

      <div className="board-seg">
        {TABS.map((t) => (
          <button key={t.key} className={tab === t.key ? 'on' : ''} onClick={() => setTab(t.key)}>
            {t.key} {counts[t.key]}
            {t.dot && <span className="seg-dot" />}
          </button>
        ))}
      </div>
      <div className="board-divider" />

      <AnimatePresence mode="wait">
        <motion.ul
          key={tab}
          className="timeline orange"
          variants={listContainer}
          initial="initial"
          animate="animate"
          exit={{ opacity: 0 }}
        >
          {tasks.length === 0 && <li className="muted" style={{ paddingLeft: 4 }}>항목이 없습니다.</li>}
          {tasks.map((t) => (
            <motion.li
              key={t.id}
              className="tl-item"
              variants={listItem}
              onClick={() => onTap(t)}
              whileTap={{ scale: 0.99 }}
            >
              <span className="tl-dot" />
              {t.category && <div className="tl-cat">{t.category}</div>}
              <div className="tl-titlerow">
                <span className="tl-title">{t.title}</span>
                {t.ago && <span className="tl-ago">{t.ago}</span>}
              </div>
              <div className="tl-row2">
                <div className="tl-pills">
                  {t.urgency && <span className={solidPill[t.urgency]}>{t.urgency}</span>}
                  <span className="tl-time">{t.time}</span>
                </div>
                <div className="tl-avatars">
                  {t.assignees.map((a, i) => (
                    <span key={i} className="tl-av">{a.charAt(0)}</span>
                  ))}
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>

      <TabBar />
    </Screen>
  )
}
