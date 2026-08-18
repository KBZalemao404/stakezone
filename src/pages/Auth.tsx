import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Zap, ShieldCheck, Gift, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Button, Logo } from '../components/ui'

export function AuthPage() {
  const [params] = useSearchParams()
  const mode = params.get('mode') === 'login' ? 'login' : 'register'
  const [showPw, setShowPw] = useState(false)
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [name, setName] = useState('')
  const [agree, setAgree] = useState(false)
  const [age, setAge] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => { window.scrollTo(0, 0) }, [mode])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'register') {
      if (!agree) { toast('Aceite os termos', 'É necessário concordar com os termos e condições.', 'error'); return }
      if (!age) { toast('Verificação de idade', 'É necessário confirmar que você tem 18 anos ou mais.', 'error'); return }
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    login()
    toast(mode === 'login' ? 'Bem-vindo de volta!' : 'Conta criada com sucesso!', mode === 'register' ? 'Seu bônus de R$ 100 já está disponível.' : 'Você está conectado.')
    navigate('/')
  }

  return (
    <div className="page" style={{ minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 0, minHeight: 'calc(100vh - 200px)' }}>
          {/* Left panel */}
          <div className="anim-fade-up" style={{ padding: '60px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Link to="/"><Logo /></Link>
            <h1 className="text-2xl" style={{ marginTop: 34, letterSpacing: '-0.02em' }}>
              {mode === 'login' ? 'Que bom te ver de volta.' : 'Sua próxima aposta começa aqui.'}
            </h1>
            <p className="text-muted" style={{ marginTop: 10 }}>
              {mode === 'login'
                ? 'Acesse sua conta para apostar e comprar na loja.'
                : 'Crie sua conta em segundos e aproveite o bônus de boas-vindas.'}
            </p>

            <div className="stack" style={{ gap: 14, marginTop: 30 }}>
              <div className="row" style={{ gap: 12 }}><span className="step-number"><Zap size={15} /></span><span className="text-sm text-dim">Bônus de boas-vindas de 100% até R$ 1.000</span></div>
              <div className="row" style={{ gap: 12 }}><span className="step-number"><Gift size={15} /></span><span className="text-sm text-dim">20% de desconto na primeira compra na loja</span></div>
              <div className="row" style={{ gap: 12 }}><span className="step-number"><ShieldCheck size={15} /></span><span className="text-sm text-dim">Ambiente 100% seguro e de demonstração</span></div>
            </div>
          </div>

          {/* Form panel */}
          <div className="anim-fade-up" style={{ animationDelay: '0.1s', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px 0' }}>
            <form className="glass" onSubmit={submit} style={{ width: '100%', maxWidth: 420, borderRadius: 24, padding: '30px 28px' }}>
              <div className="row" style={{ gap: 8, background: 'var(--surface-2)', borderRadius: 12, padding: 4, marginBottom: 24 }}>
                <button type="button" className="btn btn-sm" style={{ flex: 1, background: mode === 'login' ? 'var(--grad-neon)' : 'transparent', color: mode === 'login' ? '#04140b' : 'var(--muted)' }} onClick={() => navigate('/auth?mode=login')}>Entrar</button>
                <button type="button" className="btn btn-sm" style={{ flex: 1, background: mode === 'register' ? 'var(--grad-neon)' : 'transparent', color: mode === 'register' ? '#04140b' : 'var(--muted)' }} onClick={() => navigate('/auth?mode=register')}>Criar conta</button>
              </div>

              {mode === 'register' && (
                <div style={{ marginBottom: 14 }}>
                  <label className="field-label">Nome completo</label>
                  <input className="input" required placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              )}
              <div style={{ marginBottom: 14 }}>
                <label className="field-label">E-mail</label>
                <input className="input" type="email" required placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label className="field-label">Senha</label>
                <div style={{ position: 'relative' }}>
                  <input className="input" type={showPw ? 'text' : 'password'} required placeholder="••••••••" value={pw} onChange={(e) => setPw(e.target.value)} />
                  <button type="button" className="btn btn-ghost" style={{ position: 'absolute', right: 8, top: 8, padding: 5 }} onClick={() => setShowPw((v) => !v)} aria-label="Mostrar senha">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {mode === 'register' && (
                <div className="stack" style={{ gap: 10, marginBottom: 18 }}>
                  <label className="row" style={{ gap: 10, cursor: 'pointer' }}>
                    <input type="checkbox" checked={age} onChange={(e) => setAge(e.target.checked)} style={{ accentColor: 'var(--neon)', width: 16, height: 16 }} />
                    <span className="text-sm text-dim">Tenho 18 anos ou mais e entendo que esta é uma plataforma de demonstração.</span>
                  </label>
                  <label className="row" style={{ gap: 10, cursor: 'pointer' }}>
                    <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ accentColor: 'var(--neon)', width: 16, height: 16 }} />
                    <span className="text-sm text-dim">Concordo com os <Link to="/termos" className="text-neon">termos de uso</Link> e a <Link to="/privacidade" className="text-neon">política de privacidade</Link>.</span>
                  </label>
                </div>
              )}

              <Button type="submit" block size="lg" disabled={loading}>
                {loading ? 'Processando...' : mode === 'login' ? 'Entrar' : 'Criar conta grátis'}
              </Button>

              {mode === 'login' && (
                <button type="button" className="btn btn-ghost btn-block text-sm" style={{ marginTop: 12 }} onClick={() => { login(); toast('Demo: login rápido', 'Você entrou como Rafael (demo).') }}>
                  Entrar com conta demo
                </button>
              )}

              <p className="text-xs text-muted" style={{ marginTop: 18, textAlign: 'center', lineHeight: 1.5 }}>
                Ao continuar você concorda em respeitar os termos. <CheckCircle2 size={11} style={{ display: 'inline' }} /> Ambiente fictício, sem dinheiro real.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
