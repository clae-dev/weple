import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Screen from '../components/Screen'
import TaskHeader from '../components/TaskHeader'
import { useWorkspace, type AssignType } from '../store/workspace'
import { listContainer, listItem } from '../ui/motion'

export default function AssignTask() {
  const { id } = useParams()
  const nav = useNavigate()
  const { state, assignTask } = useWorkspace()
  const staff = state.staff
  const task = state.tasks.find((t) => String(t.id) === id)

  const [sel, setSel] = useState<Set<number>>(new Set())
  const [type, setType] = useState<AssignType>('지정')

  const toggle = (sid: number) =>
    setSel((s) => {
      const n = new Set(s)
      n.has(sid) ? n.delete(sid) : n.add(sid)
      return n
    })
  const all = () => setSel((s) => (s.size === staff.length ? new Set() : new Set(staff.map((x) => x.id))))

  const assign = () => {
    if (!task || sel.size === 0) return
    const names = staff.filter((m) => sel.has(m.id)).map((m) => m.name)
    assignTask(task.id, names, type)
    nav('/board')
  }

  return (
    <Screen>
      <TaskHeader title="테스크 할당" task={task} />

      <div className="atype-seg">
        {(['지정', '자발'] as AssignType[]).map((t) => (
          <button key={t} className={type === t ? 'on' : ''} onClick={() => setType(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="assign-head">
        <h2>스텝 목록</h2>
        <span className="frac">{sel.size}/{staff.length}</span>
        <button className="all" onClick={all}>전체선택</button>
      </div>

      <motion.ul variants={listContainer} initial="initial" animate="animate" style={{ paddingBottom: 12 }}>
        {staff.map((m) => {
          const on = sel.has(m.id)
          return (
            <motion.li
              key={m.id}
              className={`staff-card ${on ? 'on' : ''}`}
              variants={listItem}
              onClick={() => toggle(m.id)}
              whileTap={{ scale: 0.98 }}
            >
              <div className="avatar">{m.name.charAt(0)}</div>
              <div className="row-main">
                <div className="staff-name">{m.name} /</div>
                <div className="staff-role">{m.role}</div>
              </div>
              <span className={`radio ${on ? 'filled' : ''}`} />
            </motion.li>
          )
        })}
      </motion.ul>

      <motion.button
        className="assign-float"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        whileTap={{ scale: 0.97 }}
        onClick={assign}
        disabled={sel.size === 0}
      >
        {sel.size}명에게 할당하기
      </motion.button>
    </Screen>
  )
}
