import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Screen from '../components/Screen'
import TabBar from '../components/TabBar'
import { useWorkspace } from '../store/workspace'
import { listContainer, listItem } from '../ui/motion'

export default function Staff() {
  const nav = useNavigate()
  const { state, addStaff, resetToSample, clearAll } = useWorkspace()

  const [adding, setAdding] = useState(false)
  const [f, setF] = useState({ name: '', role: '' })
  const save = () => {
    addStaff({ name: f.name || '신규', role: f.role || '재고 관리' })
    setF({ name: '', role: '' })
    setAdding(false)
  }

  return (
    <Screen tabbar>
      <button className="back-btn" onClick={() => nav(-1)} aria-label="뒤로">
        <svg width="30" height="22" viewBox="0 0 30 22" fill="none" stroke="#1b1b1d" strokeWidth="2.4">
          <path d="M11 3L3 11l8 8M3 11h24" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h1 className="page-title">직원 관리</h1>

      <div className="staff-head">
        <h2>스텝 목록</h2>
        <span className="staff-total">
          총 <b>{state.staff.length}명</b>
        </span>
      </div>

      <button className="add-btn" style={{ marginBottom: 12 }} onClick={() => setAdding((v) => !v)}>
        ＋ 직원 추가
      </button>
      {adding && (
        <div className="mini-form">
          <input placeholder="이름 (예: 김홍중)" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <input placeholder="담당 (예: 1층 A2구역 재고 관리)" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} />
          <div className="mini-actions">
            <button className="cancel" onClick={() => setAdding(false)}>취소</button>
            <button className="save" onClick={save}>추가</button>
          </div>
        </div>
      )}

      <motion.ul variants={listContainer} initial="initial" animate="animate">
        {state.staff.map((m) => (
          <motion.li
            key={m.id}
            className="staff-card"
            variants={listItem}
            whileTap={{ scale: 0.98 }}
            onClick={() => nav(`/staff/${m.id}`)}
          >
            <div className="avatar">{m.name.charAt(0)}</div>
            <div className="row-main">
              <div className="staff-name">{m.name} /</div>
              <div className="staff-role">{m.role}</div>
            </div>
            <span className="radio" />
          </motion.li>
        ))}
      </motion.ul>

      <div className="demo-tools">
        <button onClick={resetToSample}>샘플 데이터 불러오기</button>
        <button onClick={clearAll}>전체 비우기</button>
      </div>

      <TabBar />
    </Screen>
  )
}
