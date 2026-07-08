import { motion } from 'framer-motion'
import { pageTransition, pageVariants } from '../ui/motion'

export default function Screen({
  children,
  tabbar = false,
  className = '',
}: {
  children: React.ReactNode
  tabbar?: boolean
  className?: string
}) {
  return (
    <motion.div
      className={`screen ${tabbar ? 'has-tabbar' : ''} ${className}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  )
}
