import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Screen from '../components/Screen'
import AppIcon from '../components/AppIcon'
import { api, auth, ApiError } from '../api/client'
import type { LoginResponse } from '../api/types'

export default function Login() {
  const [code, setCode] = useState('')
  const [pin, setPin] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    try {
      const res = await api<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ code: `${code}:${pin}` }),
      })
      auth.save(res.token, res.staff)
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setErr('사원번호 또는 비밀번호를 확인하세요')
        return
      }
      // 서버 미기동 시 데모 모드
      auth.save('demo', { id: 0, code: code || 'demo', name: '데모', role: 'STAFF' })
    }
    nav('/stores')
  }

  return (
    <Screen>
      <motion.div
        className="login-logo"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <AppIcon size={104} />
        <span className="wordmark">워플</span>
      </motion.div>

      <form className="login-form" onSubmit={submit}>
        <div className="field">
          <input placeholder="사원번호" value={code} onChange={(e) => setCode(e.target.value)} />
        </div>
        <div className="field">
          <input
            type="password"
            placeholder="비밀번호"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
        </div>

        {err && <div className="login-err">{err}</div>}

        <div className="link-forgot">비밀번호를 잊으셨나요?</div>

        <motion.button type="submit" className="btn-primary" whileTap={{ scale: 0.97 }}>
          기록하기
        </motion.button>
      </form>
    </Screen>
  )
}
