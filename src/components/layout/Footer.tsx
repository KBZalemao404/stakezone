import { Link } from 'react-router-dom'
import { ShieldCheck, PhoneCall, MessageCircle, Lock, Newspaper, Users } from 'lucide-react'
import { Logo } from '../ui'

const groups: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'Apostas',
    links: [
      { label: 'Esportes', to: '/esportes' },
      { label: 'Apostas ao vivo', to: '/ao-vivo' },
      { label: 'Promoções e bônus', to: '/promocoes' },
      { label: 'Como apostar', to: '/promocoes' },
    ],
  },
  {
    title: 'Loja Oficial',
    links: [
      { label: 'Camisetas', to: '/loja' },
      { label: 'Bonés', to: '/loja' },
      { label: 'Acessórios', to: '/loja' },
      { label: 'Meus pedidos', to: '/conta#pedidos' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Termos de uso', to: '/termos' },
      { label: 'Política de privacidade', to: '/privacidade' },
      { label: 'Jogo responsável', to: '/jogo-responsavel' },
      { label: 'Verificação de idade', to: '/jogo-responsavel' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 30 }}>
          <div>
            <Logo />
            <p className="text-sm text-muted" style={{ marginTop: 14, maxWidth: 260 }}>
              Plataforma demo de apostas esportivas e loja oficial. Projeto fictício para demonstração de interface —
              nenhuma aposta é processada e nenhum dinheiro real é movimentado.
            </p>
            <div className="row" style={{ gap: 8, marginTop: 16 }}>
              <ShieldCheck size={18} style={{ color: 'var(--neon)' }} />
              <span className="text-xs text-muted">Ambiente de demonstração</span>
            </div>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <h4 className="text-sm" style={{ marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-dim)' }}>
                {g.title}
              </h4>
              <div className="stack" style={{ gap: 9 }}>
                {g.links.map((l) => (
                  <Link key={l.label} to={l.to}>{l.label}</Link>
                ))}
              </div>
            </div>
          ))}

          <div>
            <h4 className="text-sm" style={{ marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-dim)' }}>
              Suporte 24/7
            </h4>
            <div className="stack" style={{ gap: 9 }}>
              <span className="row" style={{ gap: 8 }}><PhoneCall size={15} className="text-muted" /> 0800 123 4567</span>
              <span className="row" style={{ gap: 8 }}><MessageCircle size={15} className="text-muted" /> Chat ao vivo</span>
              <span className="row" style={{ gap: 8 }}><Newspaper size={15} className="text-muted" /> suporte@stakezone.com.br</span>
              <span className="row" style={{ gap: 8 }}><Users size={15} className="text-muted" /> Central de ajuda</span>
            </div>
          </div>
        </div>

        <div className="divider" />

        <div className="row between wrap" style={{ gap: 14, marginBottom: 16 }}>
          <div className="responsible-badge">
            <Lock size={18} />
            <div>
              <strong className="text-xs">Jogue com responsabilidade</strong>
              <div className="text-xs" style={{ opacity: 0.8 }}>Proibido para menores de 18 anos</div>
            </div>
          </div>
          <div className="row" style={{ gap: 14, flexWrap: 'wrap' }}>
            <Link to="/jogo-responsavel" className="badge badge-muted" style={{ textDecoration: 'none' }}>Jogo responsável</Link>
            <Link to="/termos" className="badge badge-muted" style={{ textDecoration: 'none' }}>Termos</Link>
            <Link to="/privacidade" className="badge badge-muted" style={{ textDecoration: 'none' }}>Privacidade</Link>
          </div>
        </div>

        <p className="text-xs text-muted" style={{ maxWidth: 900, lineHeight: 1.6 }}>
          STAKEZONE é uma plataforma fictícia criada exclusivamente para demonstração de interface. Todos os dados,
          saldos, apostas, odds, produtos e valores exibidos são fictícios e não possuem valor monetário real. Não
          aposte dinheiro real. A prática de apostas esportivas pode causar dependência e prejuízos financeiros.
          Jogue com moderação. Esteja você seja maior de 18 anos. Somente para maiores de 18 anos. Em caso de
          problemas relacionados ao jogo, procure apoio profissional.
        </p>
        <p className="text-xs text-muted" style={{ marginTop: 10 }}>© 2026 StakeZone · Todos os direitos reservados · CNPJ fictício 00.000.000/0001-00</p>
      </div>
    </footer>
  )
}
