import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../api/client'
import type { DailyReport, Task } from '../../api/types'
import { useWebSocket } from '../../ws/useWebSocket'

type View = 'open' | 'mine' | 'closed'

export function useTasks(view: View) {
  const qc = useQueryClient()

  // WS 이벤트 수신 시 캐시 무효화 → 폴링 없이 서버 상태 일관성
  useWebSocket((msg) => {
    if (msg.event.startsWith('task.') || msg.event.startsWith('erp.')) {
      qc.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  return useQuery<Task[]>({
    queryKey: ['tasks', view],
    queryFn: () => api<Task[]>(`/tasks?view=${view}`),
    // WS 불가 환경 폴백: 15초 폴링(3.4절)
    refetchInterval: 15000,
  })
}

export function useTaskAction() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['tasks'] })

  return {
    claim: useMutation({
      mutationFn: (id: number) => api(`/tasks/${id}/claim`, { method: 'POST' }),
      onSuccess: invalidate,
    }),
    start: useMutation({
      mutationFn: (id: number) => api(`/tasks/${id}/start`, { method: 'POST' }),
      onSuccess: invalidate,
    }),
    done: useMutation({
      mutationFn: (id: number) => api(`/tasks/${id}/done`, { method: 'POST' }),
      onSuccess: invalidate,
    }),
    block: useMutation({
      mutationFn: ({ id, reason }: { id: number; reason: string }) =>
        api(`/tasks/${id}/block`, { method: 'POST', body: JSON.stringify({ reason }) }),
      onSuccess: invalidate,
    }),
  }
}

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Partial<Task>) =>
      api('/tasks', { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export function useDailyReport() {
  return useQuery<DailyReport>({
    queryKey: ['report', 'daily'],
    queryFn: () => api<DailyReport>('/reports/daily'),
  })
}
