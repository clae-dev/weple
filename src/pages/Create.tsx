import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useCreateTask } from '../features/tasks/hooks'
import type { Task } from '../api/types'

const TEMPLATES = ['재고부족', '청소', '고객요청', '시설']

export default function Create() {
  const [mode, setMode] = useState<'template' | 'text'>('template')
  const [type, setType] = useState('재고부족')
  const [item, setItem] = useState('')
  const [location, setLocation] = useState('')
  const [urgency, setUrgency] = useState('보통')
  const [text, setText] = useState('')
  const [draft, setDraft] = useState<Partial<Task> | null>(null)
  const create = useCreateTask()
  const nav = useNavigate()

  // FR-17 — 자연어 → 구조화 초안(확인 카드)
  const analyze = async () => {
    if (!text.trim()) return
    const d = await api<any>('/intake/text', {
      method: 'POST',
      body: JSON.stringify({ text }),
    })
    setDraft(d)
  }

  const submit = async (body: Partial<Task>) => {
    await create.mutateAsync(body)
    nav('/')
  }

  return (
    <div className="page">
      <div className="tabs">
        <button className={mode === 'template' ? 'tab active' : 'tab'} onClick={() => setMode('template')}>템플릿</button>
        <button className={mode === 'text' ? 'tab active' : 'tab'} onClick={() => setMode('text')}>자연어 (LLM)</button>
      </div>

      {mode === 'template' && (
        <div className="card form">
          <label>유형</label>
          <div className="chips">
            {TEMPLATES.map((t) => (
              <button key={t} className={type === t ? 'chip active' : 'chip'} onClick={() => setType(t)}>{t}</button>
            ))}
          </div>
          <label>품목</label>
          <input value={item} onChange={(e) => setItem(e.target.value)} placeholder="예: 립밤" />
          <label>위치</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="예: 3번 매대" />
          <label>긴급도</label>
          <div className="chips">
            {['긴급', '보통', '낮음'].map((u) => (
              <button key={u} className={urgency === u ? 'chip active' : 'chip'} onClick={() => setUrgency(u)}>{u}</button>
            ))}
          </div>
          <button onClick={() => submit({ type, item, location, urgency, input_channel: 'template' })}>
            기록 생성
          </button>
        </div>
      )}

      {mode === 'text' && (
        <div className="card form">
          <label>상황을 자유롭게 입력하세요</label>
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="예: 3번 매대 립밤 재고 2개 남았어요"
          />
          <button onClick={analyze}>분석</button>

          {draft && (
            <div className="card draft">
              <div className="draft-title">확인 카드 (수정 가능)</div>
              <div className="draft-row"><span>유형</span><b>{draft.type}</b></div>
              <div className="draft-row"><span>긴급도</span><b>{draft.urgency}</b></div>
              <div className="draft-row">
                <span>신뢰도</span>
                <b>{Math.round(((draft as any).confidence ?? 0) * 100)}%</b>
              </div>
              {((draft as any).confidence ?? 0) < 0.7 && (
                <div className="error">신뢰도 낮음 — 내용을 확인하세요</div>
              )}
              <button
                onClick={() =>
                  submit({
                    type: draft.type!,
                    urgency: draft.urgency,
                    raw_text: text,
                    input_channel: 'text',
                    confidence: (draft as any).confidence,
                  })
                }
              >
                확정 저장
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
