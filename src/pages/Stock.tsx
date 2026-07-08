import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Screen from '../components/Screen'
import TabBar from '../components/TabBar'
import { useWorkspace } from '../store/workspace'
import { listContainer, listItem } from '../ui/motion'

function levelClass(n: number) {
  return n <= 15 ? 'lv-low' : n <= 40 ? 'lv-mid' : 'lv-high'
}

const IMG_OPTS = [
  { label: '꼬부기', src: '/products/squirtle.png' },
  { label: '이상해씨', src: '/products/bulbasaur.png' },
  { label: '파이리', src: '/products/charmander.png' },
  { label: '피카츄', src: '/products/pikachu.png' },
]

export default function Stock() {
  const [q, setQ] = useState('키링')
  const nav = useNavigate()
  const { state, addStock, updateStock, removeStock, addTask } = useWorkspace()
  const items = useMemo(
    () => state.stock.filter((s) => s.name.includes(q) || s.code.includes(q)),
    [state.stock, q],
  )

  // 재고부족 기록용 선택
  const [sel, setSel] = useState<Set<number>>(new Set())
  const toggle = (id: number) =>
    setSel((s) => {
      const n = new Set(s)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })

  // 상품 추가/편집 폼: null | 'new' | id
  const [editing, setEditing] = useState<null | 'new' | number>(null)
  const cur = typeof editing === 'number' ? state.stock.find((s) => s.id === editing) : null
  const [f, setF] = useState({ name: '', code: '', remain: '', img: IMG_OPTS[0].src })

  const openNew = () => {
    setF({ name: '', code: '', remain: '', img: IMG_OPTS[0].src })
    setEditing('new')
  }
  const openEdit = (id: number) => {
    const it = state.stock.find((s) => s.id === id)!
    setF({ name: it.name, code: it.code, remain: String(it.remain), img: it.img })
    setEditing(id)
  }
  const save = () => {
    const payload = { name: f.name || '상품', code: f.code || '000000', remain: Number(f.remain) || 0, img: f.img }
    if (editing === 'new') addStock(payload)
    else if (typeof editing === 'number') updateStock(editing, payload)
    setEditing(null)
  }

  // 기록하기: 선택 상품마다 재고부족 태스크 생성 → 보드
  const record = () => {
    if (sel.size === 0) return
    state.stock.filter((s) => sel.has(s.id)).forEach((s) => addTask({ category: '재고부족', urgency: '긴급', item: s.name }))
    nav('/board')
  }

  return (
    <Screen tabbar>
      <button className="back-btn" onClick={() => nav(-1)} aria-label="뒤로">
        <svg width="30" height="22" viewBox="0 0 30 22" fill="none" stroke="#1b1b1d" strokeWidth="2.4">
          <path d="M11 3L3 11l8 8M3 11h24" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h1 className="page-title">재고</h1>

      <p className="stock-label">상품명 / 품번 검색</p>
      <div className="stock-search">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="키링" />
        <svg className="s-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fb4c00" strokeWidth="2.4">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.5-4.5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="stock-divider" />

      <div className="count" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>총 <b>{state.stock.length}개</b></span>
        <button className="add-btn" onClick={openNew}>＋ 상품 추가</button>
      </div>

      {editing !== null && (
        <div className="mini-form">
          <input placeholder="상품명 (예: 꼬부기 키링)" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <div className="row">
            <input placeholder="품번" value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} />
            <input placeholder="잔여 수량" type="number" value={f.remain} onChange={(e) => setF({ ...f, remain: e.target.value })} />
          </div>
          <select value={f.img} onChange={(e) => setF({ ...f, img: e.target.value })}>
            {IMG_OPTS.map((o) => <option key={o.src} value={o.src}>{o.label} 이미지</option>)}
          </select>
          <div className="mini-actions">
            <button className="cancel" onClick={() => setEditing(null)}>취소</button>
            {cur && <button className="cancel" onClick={() => { removeStock(cur.id); setEditing(null) }}>삭제</button>}
            <button className="save" onClick={save}>저장</button>
          </div>
        </div>
      )}

      <motion.ul className="stock-list" variants={listContainer} initial="initial" animate="animate">
        {items.map((s) => (
          <motion.li
            key={s.id}
            className={`stock-item2 ${sel.has(s.id) ? 'on' : ''}`}
            variants={listItem}
            onClick={() => toggle(s.id)}
            whileTap={{ scale: 0.99 }}
          >
            <div className="stock-img">
              <img src={s.img} alt={s.name} />
            </div>
            <div className="stock-main">
              <div className="stock-name">{s.name}</div>
              <div className="stock-meta">
                <div>품번: {s.code}</div>
                <div>
                  현장 잔여 재고: <span className={levelClass(s.remain)}>{s.remain}개</span>
                </div>
              </div>
            </div>
            <button
              className="stock-edit"
              aria-label="수정"
              onClick={(e) => { e.stopPropagation(); openEdit(s.id) }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9a9a9f" strokeWidth="2">
                <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className={`radio ${sel.has(s.id) ? 'filled' : ''}`} />
          </motion.li>
        ))}
      </motion.ul>

      <motion.button className="stock-record" whileTap={{ scale: 0.97 }} onClick={record} disabled={sel.size === 0}>
        기록하기{sel.size > 0 ? ` (${sel.size})` : ''}
      </motion.button>

      <TabBar />
    </Screen>
  )
}
