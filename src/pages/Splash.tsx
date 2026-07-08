import { motion, useReducedMotion } from 'framer-motion'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// 로고 경계(주황의 왼쪽 경계) — 수직 일직선. viewBox 390 x 844. 글자 사이(x=175)에서 분할.
const BOUNDARY = 'L175,844'
const ORANGE_PATH = `M175,0 ${BOUNDARY} L390,844 L390,0 Z` // 주황(오른쪽) 영역
const WHITE_PATH = `M175,0 ${BOUNDARY} L0,844 L0,0 Z` // 흰(왼쪽) 영역
const ORANGE = '#fb4c00'

export default function Splash() {
  const nav = useNavigate()
  const reduce = useReducedMotion()

  useEffect(() => {
    const t = setTimeout(() => nav('/login', { replace: true }), reduce ? 1500 : 4200)
    return () => clearTimeout(t)
  }, [nav, reduce])

  const wordProps = {
    x: 172,
    y: 440,
    textAnchor: 'middle' as const,
    fontFamily: 'LaundryGothicOTF, sans-serif',
    fontSize: 118,
    fontWeight: 400,
  }

  return (
    <div className="splash">
      <svg className="splash-blob" viewBox="0 0 390 844" preserveAspectRatio="xMidYMin slice">
        <defs>
          <clipPath id="wiple-reveal">
            {/* 위→아래로 자라며 주황을 드러냄 */}
            <motion.rect
              x={0}
              y={0}
              width={390}
              initial={{ height: reduce ? 844 : 0 }}
              animate={{ height: 844 }}
              transition={{ duration: 2.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            />
          </clipPath>
          {/* 글자 색 자동 분할용 클립 */}
          <clipPath id="orange-region">
            <path d={ORANGE_PATH} />
          </clipPath>
          <clipPath id="white-region">
            <path d={WHITE_PATH} />
          </clipPath>
        </defs>

        {/* 주황 곡선 (위→아래 리빌) */}
        <path fill={ORANGE} clipPath="url(#wiple-reveal)" d={ORANGE_PATH} />

        {/* 워플 — 3초에 등장. 곡선 기울기 따라 살짝 회전.
            같은 글자를 두 번 겹쳐, 흰 영역=주황글자 / 주황 영역=흰글자 로 자동 분할 */}
        <motion.g
          initial={{ opacity: reduce ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 3, duration: 0.5, ease: 'easeOut' }}
        >
          <g transform="rotate(-6 172 425)">
            <text {...wordProps} fill={ORANGE} clipPath="url(#white-region)">
              워플
            </text>
            <text {...wordProps} fill="#fff" clipPath="url(#orange-region)">
              워플
            </text>
          </g>
        </motion.g>
      </svg>
    </div>
  )
}
