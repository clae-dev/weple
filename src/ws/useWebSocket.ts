import { useEffect, useRef } from 'react'
import { auth } from '../api/client'
import type { WsMessage } from '../api/types'

// FR-16 — 매장 채널 WebSocket. 지수 백오프 재연결(1→2→4→8, 최대 30초).
// 폴백: 연결 실패 시 호출부의 TanStack Query 폴링이 유지된다.
export function useWebSocket(onMessage: (msg: WsMessage) => void) {
  const cbRef = useRef(onMessage)
  cbRef.current = onMessage

  useEffect(() => {
    if (!auth.token) return
    let ws: WebSocket | null = null
    let closed = false
    let delay = 1000
    let timer: ReturnType<typeof setTimeout>

    const connect = () => {
      const proto = location.protocol === 'https:' ? 'wss' : 'ws'
      ws = new WebSocket(`${proto}://${location.host}/ws?token=${auth.token}`)
      ws.onopen = () => {
        delay = 1000
      }
      ws.onmessage = (e) => {
        try {
          cbRef.current(JSON.parse(e.data))
        } catch {
          /* ignore */
        }
      }
      ws.onclose = () => {
        if (closed) return
        timer = setTimeout(connect, delay)
        delay = Math.min(delay * 2, 30000)
      }
      ws.onerror = () => ws?.close()
    }
    connect()

    return () => {
      closed = true
      clearTimeout(timer)
      ws?.close()
    }
  }, [])
}
