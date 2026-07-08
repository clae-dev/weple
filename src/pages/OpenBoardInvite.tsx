import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Screen from '../components/Screen'
import PinIcon from '../components/PinIcon'
import { STORES } from '../data/mock'
import { useWorkspace } from '../store/workspace'
import { listContainer, listItem } from '../ui/motion'

export default function OpenBoardInvite() {
  const nav = useNavigate()
  const { state } = useWorkspace()

  return (
    <Screen>
      <motion.h1
        className="greeting"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        안녕하세요, <span className="hi-name">{state.managerName}</span>님
        <br />
        좋은 하루입니다!
      </motion.h1>

      <motion.ul
        className="store-list"
        variants={listContainer}
        initial="initial"
        animate="animate"
        style={{ marginTop: '8%' }}
      >
        {STORES.map((s) => (
          <motion.li key={s.id} className="store-item invite-card" variants={listItem}>
            <div className="pin-avatar light">
              <PinIcon size={30} color="#fb4c00" />
            </div>
            <div className="store-main">
              <div className="store-name">{s.name}</div>
              <div className="store-addr">{s.address}</div>
            </div>
            <div className="store-count">{s.count}명</div>
          </motion.li>
        ))}
      </motion.ul>

      <motion.button
        className="btn-primary btn-bottom"
        whileTap={{ scale: 0.97 }}
        onClick={() => nav('/create')}
      >
        오픈 보드 생성
      </motion.button>
    </Screen>
  )
}
