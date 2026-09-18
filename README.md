# 워플 (Weple)

오프라인 매장 운영 로깅 PWA. 매장 업무를 지시·수행·기록 단위로 남기고, 재고와 근무를 같은 화면에서 확인한다.

React 19 + TypeScript + Vite 8로 만든 프론트엔드이며, REST(`/api`)와 WebSocket(`/ws`)으로 백엔드와 통신한다.

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| 프레임워크 | React 19, TypeScript, Vite 8 |
| 라우팅 | React Router 7 |
| 서버 상태 | TanStack Query 5 |
| 애니메이션 | Framer Motion 12 |
| PWA | vite-plugin-pwa |
| 린트 | Oxlint |

## 실행

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 타입 체크 + 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
npm run lint     # Oxlint
```

개발 서버는 `/api`와 `/ws`를 백엔드로 프록시한다(`vite.config.ts` 참고). 백엔드가 따로 떠 있어야 로그인 이후 화면이 동작한다.

## 화면 구성

| 경로 | 화면 | 설명 |
| --- | --- | --- |
| `/` | Splash | 진입 · 세션 확인 |
| `/login` | Login | 직원 로그인 |
| `/stores` | Stores | 매장 선택 |
| `/invite` | OpenBoardInvite | 초대 링크로 보드 참여 |
| `/board` | Board | 업무 보드 |
| `/create` | CreateTask | 업무 생성 |
| `/tasks/:id/assign` | AssignTask | 업무 배정 |
| `/tasks/:id/history` | TaskHistory | 업무 수행 이력 |
| `/stock` | Stock | 재고 |
| `/staff` · `/staff/:id` | Staff · StaffDetail | 직원 목록 · 상세 |
| `/schedule` | Schedule | 근무 일정 |
| `/report` | Report | 리포트 |

## 디렉터리

```
src/
├─ api/          fetch 래퍼(JWT 자동 첨부, ApiError 표준화)와 타입
├─ components/   공용 UI (Screen, TabBar, TaskHeader, 아이콘)
├─ data/         목업 데이터
├─ features/     도메인 단위 모듈 (tasks)
├─ pages/        라우트 단위 화면
├─ store/        워크스페이스 전역 상태
├─ ui/           Framer Motion 프리셋
└─ ws/           매장 채널 WebSocket 훅
```

## 인증

로그인 성공 시 JWT와 직원 정보를 `localStorage`에 저장하고(`report_token`, `report_staff`), 이후 모든 요청의 `Authorization: Bearer` 헤더에 자동으로 실린다. WebSocket은 쿼리스트링으로 같은 토큰을 전달한다.

## 실시간 동기화

`useWebSocket` 훅이 매장 채널에 붙어 업무 변경을 수신한다. 연결이 끊기면 1 → 2 → 4 → 8초 지수 백오프로 재연결하며(최대 30초), 연결이 계속 실패해도 TanStack Query의 폴링이 화면을 갱신하므로 기능이 멈추지는 않는다.

## 배포

- **Vercel** — `vercel.json`이 모든 경로를 `index.html`로 rewrite 하는 SPA 설정을 담고 있다.
- **Docker** — 멀티스테이지 빌드(`node:22-alpine` → `nginx:alpine`). nginx가 정적 파일을 서빙하면서 `/api/`와 `/ws`를 `http://api:8000`으로 프록시한다.

```bash
docker build -t weple .
docker run -p 80:80 weple
```
