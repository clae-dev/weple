import { NavLink, useLocation } from 'react-router-dom'

type IconProps = { active?: boolean }

function IconHome({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? 'var(--orange)' : 'none'} stroke="currentColor" strokeWidth="1.8">
      <path d="M3 11l9-7 9 7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M5 10v9a1 1 0 001 1h12a1 1 0 001-1v-9" strokeLinejoin="round" fill={active ? 'var(--orange)' : 'none'} />
    </svg>
  )
}
function IconTask(_: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h3" strokeLinecap="round" />
    </svg>
  )
}
function IconStock(_: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 5h2l2 11h9l2-8H7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
    </svg>
  )
}
function IconReport(_: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3.2A1.2 1.2 0 0110.2 2h3.6A1.2 1.2 0 0115 3.2V4" strokeLinejoin="round" />
      <path d="M8.5 13l2.2 2.2L15 11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconStaff(_: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" strokeLinecap="round" />
    </svg>
  )
}

const TABS: { to: string; label: string; Icon: (p: IconProps) => React.JSX.Element; match?: string[] }[] = [
  { to: '/create', label: '홈', Icon: IconHome },
  { to: '/board', label: '테스크', Icon: IconTask },
  { to: '/stock', label: '재고', Icon: IconStock },
  { to: '/schedule', label: '리포트', Icon: IconReport, match: ['/schedule', '/report'] },
  { to: '/staff', label: '직원관리', Icon: IconStaff },
]

export default function TabBar() {
  const { pathname } = useLocation()
  return (
    <nav className="tabbar">
      {TABS.map(({ to, label, Icon, match }) => {
        const active = match ? match.includes(pathname) : pathname === to
        return (
          <NavLink key={to} to={to} className={active ? 'on' : ''}>
            <Icon active={active} />
            <span>{label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
