import { Link } from 'react-router-dom'
import { FileText, ShieldCheck, Lock, ArrowLeft } from 'lucide-react'
import { Button, SectionHeader } from '../components/ui'

function LegalShell({ title, icon: Icon, children }: { title: string; icon: typeof FileText; children: React.ReactNode }) {
  return (
    <div className="page container" style={{ maxWidth: 860 }}>
      <Link to="/"><Button variant="ghost" size="sm" style={{ marginBottom: 18 }}><ArrowLeft size={15} /> Voltar</Button></Link>
      <div className="card" style={{ padding: '36px 32px' }}>
        <div className="row" style={{ gap: 14, marginBottom: 22 }}>
          <span style={{ width: 50, height: 50, borderRadius: 15, background: 'var(--neon-soft)', color: 'var(--neon)', display: 'grid', placeItems: 'center' }}>
            <Icon size={24} />
          </span>
          <div>
            <h1 className="text-2xl">{title}</h1>
            <p className="text-xs text-muted">Última atualização: agosto de 2026</p>
          </div>
        </div>
        <div className="stack" style={{ gap: 18, color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.75 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export function TermsPage() {
  return (
    <LegalShell title="Termos de uso" icon={FileText}>
      <h2 className="text-lg text-dim">1. Natureza da plataforma</h2>
      <p>O StakeZone é um protótipo de interface para demonstração. Todos os saldos, apostas, odds, bônus, produtos e transações são fictícios. Nenhuma aposta real é processada e nenhum valor monetário é movimentado ou pode ser resgatado.</p>
      <h2 className="text-lg text-dim">2. Elegibilidade</h2>
      <p>A plataforma é destinada exclusivamente a maiores de 18 anos. Ao criar uma conta você declara ter a idade legal em sua jurisdição e estar em conformidade com as leis locais. Não oferecemos mecanismos para burlar restrições de idade, localização ou regulamentação.</p>
      <h2 className="text-lg text-dim">3. Conta e segurança</h2>
      <p>Você é responsável por manter suas credenciais em segurança e por toda a atividade na sua conta. Recomendamos a ativação da autenticação em dois fatores.</p>
      <h2 className="text-lg text-dim">4. Apostas e loja</h2>
      <p>As apostas e compras realizadas na plataforma de demonstração não possuem efeito legal ou financeiro. Odds e valores exibidos são simulados apenas para ilustrar a experiência do usuário.</p>
      <h2 className="text-lg text-dim">5. Limitação de responsabilidade</h2>
      <p>O StakeZone não se responsabiliza por decisões tomadas com base na plataforma de demonstração. A prática de apostas envolve riscos; jogue com moderação.</p>
    </LegalShell>
  )
}

export function PrivacyPage() {
  return (
    <LegalShell title="Política de privacidade" icon={ShieldCheck}>
      <h2 className="text-lg text-dim">1. Dados coletados</h2>
      <p>Em um ambiente real, coletaríamos apenas dados necessários para a operação (nome, e-mail, preferências). Neste protótipo, todos os dados são fictícios e armazenados localmente no seu navegador.</p>
      <h2 className="text-lg text-dim">2. Uso dos dados</h2>
      <p>Os dados são usados exclusivamente para fornecer a experiência demonstrada nesta interface. Não vendemos nem compartilhamos dados com terceiros.</p>
      <h2 className="text-lg text-dim">3. Segurança</h2>
      <p>Utilizamos boas práticas de segurança de dados e recomendamos senhas fortes e autenticação em dois fatores.</p>
      <h2 className="text-lg text-dim">4. Seus direitos</h2>
      <p>Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento através do suporte.</p>
    </LegalShell>
  )
}

export function ResponsibleGamingPage() {
  return (
    <LegalShell title="Jogo responsável" icon={Lock}>
      <h2 className="text-lg text-dim">Nosso compromisso</h2>
      <p>O StakeZone é uma plataforma de demonstração e promove o jogo responsável. A prática de apostas deve ser sempre uma forma de entretenimento, nunca uma solução para problemas financeiros.</p>
      <h2 className="text-lg text-dim">Verificação de idade</h2>
      <p>Somos proibidos e nos recusamos a oferecer serviços a menores de 18 anos. Não criamos mecanismos para burlar verificação de idade ou restrições de localização.</p>
      <h2 className="text-lg text-dim">Sinais de alerta</h2>
      <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <li>Pensar constantemente em apostas ou gastar além do planejado.</li>
        <li>Perseguir perdas para "recuperar" o prejuízo.</li>
        <li>Mentir sobre quanto tempo ou dinheiro é gasto.</li>
        <li>Sentir ansiedade, culpa ou estresse relacionados ao jogo.</li>
      </ul>
      <h2 className="text-lg text-dim">Onde buscar ajuda</h2>
      <p>Se o jogo deixou de ser diversão, procure ajuda profissional. No Brasil, instituições como o Instituto Jogo Responsável oferecem apoio gratuito. Linhas de apoio: 0800-000-0000 (demonstração).</p>
      <div className="responsible-badge" style={{ marginTop: 6 }}>Somos contra o jogo de menores de 18 anos e o jogo problemático. Jogue com responsabilidade.</div>
    </LegalShell>
  )
}
