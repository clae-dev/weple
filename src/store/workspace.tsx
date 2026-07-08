import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  MANAGER_NAME,
  STOCK,
  STORES,
  type BoardTab,
  type Category,
  type StockItem,
  type Urgency,
} from '../data/mock'

// ---- 통합 태스크 모델 ----
export type AssignType = '자발' | '지정'
export interface Task {
  id: number
  category: Category | null // 내 업무(개인) 태스크는 null
  title: string
  urgency: Urgency | null
  status: BoardTab // '열림' | '내 업무' | '완료'
  assignees: string[] // 직원 이름
  time: string // HH:MM
  ago: string // '7분전' (완료는 '')
  createdAt: number // 등록 시각(ms) — 평균 소요 계산
  completedAt?: number // 완료 시각(ms)
  assignType?: AssignType // 자발/지정 (어사인 시 지정)
  item?: string
  location?: string
  memo?: string
}

// 경과시간 표시: 60초 미만은 초, 아니면 분
function fmtDuration(ms: number): string {
  const sec = Math.round(ms / 1000)
  if (sec < 60) return `${sec}초`
  return `${Math.round(sec / 60)}분`
}
export interface Staff {
  id: number
  name: string
  role: string
}
export interface State {
  tasks: Task[]
  staff: Staff[]
  stock: StockItem[]
  revenue: number
  reportDate: string
  storeName: string
  managerName: string
}

export const initial = (name: string) => name.charAt(0)

function flat<T>(pairs: [number, T][]): T[] {
  const a: T[] = []
  pairs.forEach(([n, v]) => {
    for (let i = 0; i < n; i++) a.push(v)
  })
  return a
}

function doneTitle(cat: Category, i: number): string {
  const items = ['메타몽 쿠션', '피카츄 키링', '꼬부기 키링', '파이리 키링']
  const zones = ['1층 A1', '2층 A1', '2층 B3', '3층 C1', '1층 A2', '2층 B4']
  if (cat === '재고부족') return `${items[i % items.length]} 재고 채우기 · ${zones[i % zones.length]}구역`
  if (cat === '현장이슈') return ['포토존 조명 점검', '동선 안내', '에어컨 점검', '안내판 교체', '바닥 청소'][i % 5]
  if (cat === '대기열') return ['대기열 정리', '입장 안내', '줄서기 안내', '대기 시간 공지'][i % 4]
  return ['매대 정리', '1층 고객 응대'][i % 2]
}

const STAFF_ROSTER: Staff[] = [
  { id: 1, name: '김홍중', role: '1층 A2구역 재고 관리' },
  { id: 2, name: '박종성', role: '2층 B3구역 재고 관리' },
  { id: 3, name: '이소희', role: '3층 C1구역 재고 관리' },
  { id: 4, name: '박지훈', role: '1층 A1구역 재고 관리' },
  { id: 5, name: '김철수', role: '2층 B4구역 재고 관리' },
  { id: 6, name: '정윤호', role: '3층 C2구역 재고 관리' },
]

// 빈 시작 상태(직접 데이터 입력 시연) — 직원 로스터·재고는 유지, 태스크 0·매출 0
export function emptyState(): State {
  return {
    tasks: [],
    staff: STAFF_ROSTER.map((s) => ({ ...s })),
    stock: STOCK.map((s) => ({ ...s })),
    revenue: 0,
    reportDate: '2026. 07. 12 (목)',
    storeName: STORES[0].name,
    managerName: MANAGER_NAME,
  }
}

// 채워진 샘플(완료 28 + 합성 소요시간·자발/지정) — "샘플 데이터 불러오기"
export function populatedSample(): State {
  const doneStaff = flat<string>([[11, '김홍중'], [9, '이소희'], [8, '박종성']]) // 28
  const doneCats = flat<Category>([[17, '재고부족'], [5, '현장이슈'], [4, '대기열'], [2, '기타']]) // 28
  const urg: (Urgency | null)[] = ['긴급', '양호', '보통', null]
  const base = Date.now()
  const done: Task[] = doneStaff.map((nm, i) => {
    const durMs = (5 + (i % 4)) * 60000 // 5~8분
    const createdAt = base - durMs - i * 60000
    return {
      id: 100 + i,
      category: doneCats[i],
      title: doneTitle(doneCats[i], i),
      urgency: urg[i % 4],
      status: '완료' as BoardTab,
      assignees: [nm],
      time: `1${1 + (i % 3)}:${String((i * 7) % 60).padStart(2, '0')}`,
      ago: '',
      createdAt,
      completedAt: createdAt + durMs,
      assignType: (i % 3 === 0 ? '자발' : '지정') as AssignType,
    }
  })
  return { ...emptyState(), tasks: done, revenue: 7350000 }
}

const KEY = 'wiple-demo-v3'
function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as State
  } catch {
    /* ignore */
  }
  return emptyState()
}

// ---- Context ----
interface Ctx {
  state: State
  addTask: (t: {
    category: Category | null
    urgency: Urgency | null
    item?: string
    location?: string
    memo?: string
  }) => void
  claimTask: (id: number) => void
  completeTask: (id: number) => void
  assignTask: (id: number, names: string[], type?: AssignType) => void
  addStaff: (s: Omit<Staff, 'id'>) => void
  updateStaff: (id: number, patch: Partial<Staff>) => void
  removeStaff: (id: number) => void
  addStock: (s: Omit<StockItem, 'id'>) => void
  updateStock: (id: number, patch: Partial<StockItem>) => void
  removeStock: (id: number) => void
  setRevenue: (n: number) => void
  setReportDate: (d: string) => void
  resetToSample: () => void
  clearAll: () => void
  // 파생 선택자
  tasksByTab: (tab: BoardTab) => Task[]
  tabCounts: () => Record<BoardTab, number>
  reportStats: () => { total: number; done: number; pending: number; claims: number }
  byType: () => { name: string; count: number }[]
  byStaff: () => { name: string; done: number; avg: string; ratio: string }[]
}

const WorkspaceCtx = createContext<Ctx | null>(null)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  const nextId = useCallback((arr: { id: number }[]) => (arr.length ? Math.max(...arr.map((x) => x.id)) + 1 : 1), [])

  const addTask: Ctx['addTask'] = useCallback(
    (t) => {
      const now = new Date()
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const title = t.item ? `${t.item} 재고 채우기${t.location ? ` · ${t.location}` : ''}` : t.memo || t.category || '기타'
      setState((s) => ({
        ...s,
        tasks: [
          { id: nextId(s.tasks), category: t.category, title, urgency: t.urgency, status: '열림', assignees: [], time, ago: '방금', createdAt: Date.now(), item: t.item, location: t.location, memo: t.memo },
          ...s.tasks,
        ],
      }))
    },
    [nextId],
  )
  const setTask = (id: number, patch: Partial<Task>) =>
    setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }))
  const claimTask = useCallback((id: number) => setTask(id, { status: '내 업무', assignType: '자발' }), [])
  const completeTask = useCallback((id: number) => setTask(id, { status: '완료', ago: '', completedAt: Date.now() }), [])
  const assignTask = useCallback(
    (id: number, names: string[], type: AssignType = '지정') => setTask(id, { assignees: names, status: '내 업무', assignType: type }),
    [],
  )

  const addStaff: Ctx['addStaff'] = useCallback((sf) => setState((s) => ({ ...s, staff: [...s.staff, { ...sf, id: nextId(s.staff) }] })), [nextId])
  const updateStaff: Ctx['updateStaff'] = useCallback((id, patch) => setState((s) => ({ ...s, staff: s.staff.map((x) => (x.id === id ? { ...x, ...patch } : x)) })), [])
  const removeStaff: Ctx['removeStaff'] = useCallback((id) => setState((s) => ({ ...s, staff: s.staff.filter((x) => x.id !== id) })), [])

  const addStock: Ctx['addStock'] = useCallback((it) => setState((s) => ({ ...s, stock: [...s.stock, { ...it, id: nextId(s.stock) }] })), [nextId])
  const updateStock: Ctx['updateStock'] = useCallback((id, patch) => setState((s) => ({ ...s, stock: s.stock.map((x) => (x.id === id ? { ...x, ...patch } : x)) })), [])
  const removeStock: Ctx['removeStock'] = useCallback((id) => setState((s) => ({ ...s, stock: s.stock.filter((x) => x.id !== id) })), [])

  const setRevenue = useCallback((n: number) => setState((s) => ({ ...s, revenue: n })), [])
  const setReportDate = useCallback((d: string) => setState((s) => ({ ...s, reportDate: d })), [])
  const resetToSample = useCallback(() => setState(populatedSample()), [])
  // 모든 태스크 제거(완료 포함) + 매출 0, 직원·재고는 유지
  const clearAll = useCallback(() => setState((s) => ({ ...s, tasks: [], revenue: 0 })), [])

  const tasksByTab = useCallback((tab: BoardTab) => state.tasks.filter((t) => t.status === tab), [state.tasks])
  const tabCounts = useCallback(
    () => ({
      열림: state.tasks.filter((t) => t.status === '열림').length,
      '내 업무': state.tasks.filter((t) => t.status === '내 업무').length,
      완료: state.tasks.filter((t) => t.status === '완료').length,
    }),
    [state.tasks],
  )
  const reportStats = useCallback(() => {
    const done = state.tasks.filter((t) => t.status === '완료').length
    const claims = state.tasks.filter((t) => t.status === '내 업무').length
    return { total: state.tasks.length, done, pending: state.tasks.length - done, claims }
  }, [state.tasks])
  const byType = useCallback(() => {
    const label: Record<Category, string> = { 재고부족: '재고 부족', 현장이슈: '현장이슈', 대기열: '대기열', 기타: '기타' }
    const order: Category[] = ['재고부족', '현장이슈', '대기열', '기타']
    return order.map((c) => ({ name: label[c], count: state.tasks.filter((t) => t.category === c).length }))
  }, [state.tasks])
  const byStaff = useCallback(
    () =>
      state.staff
        .map((sf) => {
          const mine = state.tasks.filter((t) => t.status === '완료' && t.assignees.includes(sf.name))
          const durs = mine.filter((t) => t.completedAt && t.createdAt).map((t) => t.completedAt! - t.createdAt!)
          const avg = durs.length ? fmtDuration(durs.reduce((a, b) => a + b, 0) / durs.length) : '—'
          const self = mine.filter((t) => t.assignType === '자발').length
          const given = mine.filter((t) => t.assignType === '지정').length
          return { name: sf.name, done: mine.length, avg, ratio: `${self} / ${given}` }
        })
        .filter((r) => r.done > 0)
        .sort((a, b) => b.done - a.done),
    [state.tasks, state.staff],
  )

  const value = useMemo<Ctx>(
    () => ({
      state, addTask, claimTask, completeTask, assignTask,
      addStaff, updateStaff, removeStaff, addStock, updateStock, removeStock,
      setRevenue, setReportDate, resetToSample, clearAll,
      tasksByTab, tabCounts, reportStats, byType, byStaff,
    }),
    [state, addTask, claimTask, completeTask, assignTask, addStaff, updateStaff, removeStaff, addStock, updateStock, removeStock, setRevenue, setReportDate, resetToSample, clearAll, tasksByTab, tabCounts, reportStats, byType, byStaff],
  )

  return <WorkspaceCtx.Provider value={value}>{children}</WorkspaceCtx.Provider>
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceCtx)
  if (!ctx) throw new Error('useWorkspace must be used within WorkspaceProvider')
  return ctx
}
