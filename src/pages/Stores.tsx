import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Screen from '../components/Screen'
import PinIcon from '../components/PinIcon'
import { STORES } from '../data/mock'
import { listContainer, listItem } from '../ui/motion'

export default function Stores() {
  const [sel, setSel] = useState<number>(1)
  const nav = useNavigate()

  const pick = (id: number) => {
    setSel(id)
    setTimeout(() => nav('/invite'), 220)
  }

  return (
    <Screen>
      {/* 검색바 */}
      <div className="search-bar">
        <button className="sb-back" onClick={() => nav(-1)} aria-label="뒤로">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.4">
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <input placeholder="주소 검색" />
        <svg className="sb-mic" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M6 11a6 6 0 0012 0M12 17v4" strokeLinecap="round" />
        </svg>
      </div>

      <motion.ul
        className="store-list"
        variants={listContainer}
        initial="initial"
        animate="animate"
        style={{ margin: 'auto 0' }}
      >
        {STORES.map((s) => {
          const on = sel === s.id
          return (
            <motion.li
              key={s.id}
              className={`store-item ${on ? 'on' : ''}`}
              variants={listItem}
              onClick={() => pick(s.id)}
              whileTap={{ scale: 0.98 }}
            >
              <div className="pin-avatar">
                <PinIcon size={30} color={on ? '#8a8a90' : '#fff'} />
              </div>
              <div className="store-main">
                <div className="store-name">{s.name}</div>
                <div className="store-addr">{s.address}</div>
              </div>
            </motion.li>
          )
        })}
      </motion.ul>
    </Screen>
  )
}
