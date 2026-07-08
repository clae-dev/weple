// 목업 화면과 동일한 콘텐츠. 실제 백엔드 연동 지점은 주석으로 표시.

export interface Store {
  id: number
  name: string
  address: string
  count: number // 배정 인원(스탭 초대 화면)
}

export const STORES: Store[] = [
  { id: 1, name: '포켓몬 POP-UP in 성수', address: '서울 성동구 연무장길 27', count: 32 },
  { id: 2, name: '나이키 코리아 팝업스토어', address: '서울 성동구 연무장 3길 8-9', count: 12 },
  { id: 3, name: '카카오프렌즈 팝업', address: '서울 성동구 뚝섬로9길 16(성수동 2가)', count: 51 },
]

export const MANAGER_NAME = '김희정 관리자'

export type Urgency = '긴급' | '보통' | '양호'
export type Category = '재고부족' | '현장이슈' | '대기열' | '기타'
export type BoardTab = '열림' | '내 업무' | '완료'

export interface BoardTask {
  id: number
  category: Category | null // 내 업무 탭은 카테고리 없음
  title: string
  urgency: Urgency | null
  time: string
  ago: string // 완료 탭은 '' (분전 표기 없음)
  assignees: string[]
  tab: BoardTab
}

export const BOARD_TASKS: BoardTask[] = [
  // 열림
  { id: 1, category: '재고부족', title: '메타몽 쿠션 재고 채우기 · 2층 A1구역', urgency: '긴급', time: '10:27', ago: '7분전', assignees: ['김', '박'], tab: '열림' },
  { id: 2, category: '현장이슈', title: '포토존 조명 깜빡임', urgency: '긴급', time: '10:25', ago: '9분전', assignees: ['이', '한', '조'], tab: '열림' },
  { id: 3, category: '현장이슈', title: '3회차 입장 마감', urgency: null, time: '10:22', ago: '12분전', assignees: ['김'], tab: '열림' },
  { id: 4, category: '기타', title: '매대 정리', urgency: '양호', time: '10:19', ago: '3분전', assignees: ['정'], tab: '열림' },
  // 내 업무 (카테고리 없음)
  { id: 5, category: null, title: '메타몽 쿠션 30개 추가 발주', urgency: '긴급', time: '10:27', ago: '7분전', assignees: ['김', '박'], tab: '내 업무' },
  { id: 6, category: null, title: '월말 실적 보고', urgency: '긴급', time: '10:25', ago: '9분전', assignees: ['이', '한', '조'], tab: '내 업무' },
  // 완료 (분전 없음)
  { id: 7, category: '재고부족', title: '메타몽 쿠션 재고 채우기 · 2층 A1구역', urgency: '긴급', time: '10:27', ago: '', assignees: ['김', '박'], tab: '완료' },
  { id: 8, category: '현장이슈', title: '포토존 조명 깜빡임', urgency: '긴급', time: '10:25', ago: '', assignees: ['이', '한', '조'], tab: '완료' },
  { id: 9, category: '현장이슈', title: '3회차 입장 마감', urgency: null, time: '10:22', ago: '', assignees: ['김'], tab: '완료' },
  { id: 10, category: '기타', title: '매대 정리', urgency: '양호', time: '10:19', ago: '', assignees: ['정'], tab: '완료' },
]

export interface StaffMember {
  id: number
  name: string
  role: string
}

export const STAFF: StaffMember[] = [
  { id: 1, name: '김홍중', role: '1층 A2구역 재고 관리' },
  { id: 2, name: '박종성', role: '2층 B3구역 재고 관리' },
  { id: 3, name: '이소희', role: '3층 C1구역 재고 관리' },
  { id: 4, name: '박지훈', role: '1층 A1구역 재고 관리' },
  { id: 5, name: '김철수', role: '2층 B4구역 재고 관리' },
  { id: 6, name: '정윤호', role: '3층 C2구역 재고 관리' },
]

// 현재 태스크(테스크 할당/처리이력 공용 헤더)
export const CURRENT_TASK = {
  category: '재고부족' as Category,
  time: '14:03',
  titleLines: ['메타몽 쿠션 재고 채우기', '2층 A1/A2구역'],
  urgency: '긴급' as Urgency,
}

export interface HistoryEntry {
  color: 'red' | 'blue' | 'green'
  text: string
  time?: string
}

// 처리 이력 (현장 진행)
export const HISTORY: HistoryEntry[] = [
  { color: 'red', text: '김홍중 스탭이 A1 구역 완료', time: '14:27:04' },
  { color: 'blue', text: '박지훈 스탭이 A2 구역 완료', time: '14:30:43' },
  { color: 'green', text: '김홍중 스탭이 진행 중' },
]

// 직원 상세 — 개인 처리 이력 (직원관리 상세 화면)
export interface StaffTask {
  category: Category
  title: string
  urgency: Urgency
  time: string
}

export const STAFF_HISTORY: StaffTask[] = [
  { category: '재고부족', title: '메타몽 쿠션 재고 채우기 · 2층 A1구역', urgency: '긴급', time: '10:27' },
  { category: '기타', title: '매대 정리', urgency: '양호', time: '11:31' },
  { category: '재고부족', title: '파이리 아크릴 키링 재고 채우기 · 1층 A2구역', urgency: '양호', time: '11:35' },
  { category: '기타', title: '1층 고객 응대', urgency: '양호', time: '12:00' },
]

// 감사추적 (상태 전이 원자 기록)
export const AUDIT: HistoryEntry[] = [
  { color: 'red', text: '김스탭이 기록', time: '11:20:04' },
  { color: 'blue', text: '이스탭이 클레임 — 자발 처리', time: '11:21:11' },
  { color: 'green', text: '이스탭이 완료 · 소요 5분', time: '11:26:02' },
]

export interface StockItem {
  id: number
  name: string
  code: string
  remain: number
  img: string
}

export const STOCK: StockItem[] = [
  { id: 1, name: '꼬부기 키링', code: '1060995', remain: 4, img: '/products/squirtle.png' },
  { id: 2, name: '이상해씨 키링', code: '1060820', remain: 30, img: '/products/bulbasaur.png' },
  { id: 3, name: '파이리 키링', code: '1192094', remain: 42, img: '/products/charmander.png' },
  { id: 4, name: '피카츄 키링', code: '1235422', remain: 11, img: '/products/pikachu.png' },
]

export interface ReportSlot {
  time: string
  open?: boolean
  cards: number
}

export const REPORT = {
  date: '2026. 07. 12 (목)',
  amount: 7350000,
  slots: [
    { time: '13:00', open: true, cards: 1 },
    { time: '14:00', open: true, cards: 1 },
    { time: '15:00', open: false, cards: 0 },
  ] as ReportSlot[],
}

// 일일 리포트 (리포트-업무 화면)
export const DAILY_REPORT = {
  date: '2026. 07. 12 (목)',
  revenue: 7350000,
  stats: [
    { value: 34, label: '총 태스크' },
    { value: 28, label: '완료' },
    { value: 4, label: '미결' },
    { value: 3, label: '클레임 수' },
  ],
  topItem: '재고 부족 최다 품목: 메타몽 쿠션 2호',
  byType: [
    { name: '재고 부족', count: 18 },
    { name: '현장이슈', count: 8 },
    { name: '대기열', count: 6 },
    { name: '기타', count: 2 },
  ],
  byStaff: [
    { name: '김홍중', done: '11건', avg: '6분', ratio: '11 / 0' },
    { name: '이소희', done: '9건', avg: '8분', ratio: '8 / 1' },
    { name: '박종성', done: '8건', avg: '7분', ratio: '8 / 0' },
  ],
}

// 유형별 아이템/위치 옵션 (오픈보드 생성 폼)
export const ITEM_OPTIONS = ['메타몽 쿠션', '피카츄 키링', '꼬부기 키링', '파이리 키링']
export const LOCATION_OPTIONS = ['1층 A1구역', '2층 A1구역', '2층 B3구역', '3층 C1구역']
