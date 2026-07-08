import type { Variants } from 'framer-motion'

// 페이지 전환: 오른쪽에서 슬라이드 + 페이드
export const pageVariants: Variants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
}
export const pageTransition = { type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.32 } as const

// 리스트 스태거
export const listContainer: Variants = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}
export const listItem: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 30 } },
}

// 탭 시 눌리는 효과
export const tap = { scale: 0.96 }
