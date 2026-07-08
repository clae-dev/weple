import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Screen from '../components/Screen'
import TabBar from '../components/TabBar'
import { ITEM_OPTIONS, LOCATION_OPTIONS, type Category, type Urgency } from '../data/mock'
import { useWorkspace } from '../store/workspace'

const TYPES: Category[] = ['재고부족', '현장이슈', '대기열', '기타']
const URGENCIES: { key: Urgency; cls: string }[] = [
  { key: '양호', cls: 'green' },
  { key: '보통', cls: 'yellow' },
  { key: '긴급', cls: 'red' },
]

export default function CreateTask() {
  const [type, setType] = useState<Category>('재고부족')
  const [item, setItem] = useState('')
  const [loc, setLoc] = useState('')
  const [memo, setMemo] = useState('')
  const [urgency, setUrgency] = useState<Urgency>('보통')
  const nav = useNavigate()
  const { addTask } = useWorkspace()

  const submit = () => {
    addTask({
      category: type,
      urgency: showUrgency ? urgency : null,
      item: showItem ? item || undefined : undefined,
      location: showLocation ? loc || undefined : undefined,
      memo: showMemo ? memo || undefined : undefined,
    })
    nav('/board')
  }

  // 유형별 노출 필드 (목업 4-1~4-4)
  const showItem = type === '재고부족'
  const showMemo = type !== '재고부족'
  const showLocation = type !== '대기열'
  const showUrgency = type !== '대기열'

  return (
    <Screen tabbar>
      <div className="create-head">
        <button className="back-btn" onClick={() => nav(-1)} aria-label="뒤로">
          <svg width="30" height="22" viewBox="0 0 30 22" fill="none" stroke="#1b1b1d" strokeWidth="2.4">
            <path d="M11 3L3 11l8 8M3 11h24" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="store-title">
          포켓몬 POP-UP in 성수 <span className="cd">▾</span>
        </h1>
      </div>

      <div className="type-grid">
        {TYPES.map((t) => (
          <motion.button
            key={t}
            className={`type-btn ${type === t ? 'on' : ''}`}
            onClick={() => setType(t)}
            whileTap={{ scale: 0.96 }}
          >
            {t}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={type}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {showItem && (
            <>
              <p className="form-label">품목</p>
              <div className="select">
                <select value={item} onChange={(e) => setItem(e.target.value)}>
                  <option value="">선택하세요</option>
                  {ITEM_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
                <span className="caret">▼</span>
              </div>
            </>
          )}

          {showMemo && (
            <>
              <p className="form-label">메모</p>
              <textarea
                className="memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="상황을 입력하세요"
              />
            </>
          )}

          {showLocation && (
            <>
              <p className="form-label">위치</p>
              <div className="select">
                <select value={loc} onChange={(e) => setLoc(e.target.value)}>
                  <option value="">선택하세요</option>
                  {LOCATION_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
                <span className="caret">▼</span>
              </div>
            </>
          )}

          {showUrgency && (
            <>
              <p className="form-label">긴급도</p>
              <div className="urgency-row">
                {URGENCIES.map((u) => (
                  <motion.button
                    key={u.key}
                    className={`u ${u.cls} ${urgency === u.key ? 'on' : ''}`}
                    onClick={() => setUrgency(u.key)}
                    whileTap={{ scale: 0.92 }}
                  >
                    {urgency === u.key && <span className="u-check">✓</span>}
                    {u.key}
                  </motion.button>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <motion.button className="btn-primary btn-bottom" whileTap={{ scale: 0.97 }} onClick={submit}>
        기록하기
      </motion.button>

      <TabBar />
    </Screen>
  )
}
