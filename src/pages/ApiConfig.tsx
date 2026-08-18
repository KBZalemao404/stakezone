import { useState } from 'react'
import { Key, ExternalLink, Check, X, Info, Globe, Shield } from 'lucide-react'
import { Button, Badge, SectionHeader } from '../components/ui'
import { getApiStatus } from '../services/api'
import { useToast } from '../context/ToastContext'

export function ApiConfigPage() {
  const status = getApiStatus()
  const { toast } = useToast()

  return (
    <div className="page container">
      <SectionHeader
        title="Configuração de APIs"
        subtitle="Conecte APIs oficiais para dados reais de apostas e jogos"
      />

      <div className="card" style={{ padding: 24, marginBottom: 20, background: 'linear-gradient(140deg, rgba(0,212,255,0.08), var(--surface))' }}>
        <div className="row" style={{ gap: 10, marginBottom: 12 }}>
          <Info size={18} style={{ color: 'var(--neon)' }} />
          <h3 style={{ fontSize: '1rem' }}>Como funciona?</h3>
        </div>
        <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>
          O StakeZone usa APIs oficiais para exibir odds reais de casas de apostas e dados de jogos ao vivo.
          Configure suas chaves de API abaixo para dados em tempo real. Sem chave, o site usa dados de demonstração.
        </p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 20 }}>
        <ApiKeyCard
          name="The Odds API"
          description="Odds reais de casas de apostas como Bet365, Betfair, William Hill e mais."
          docsUrl="https://the-odds-api.com"
          signupUrl="https://the-odds-api.com/#/get-access"
          freeTier="500 créditos/mês"
          features={['Odds de 70+ esportes', 'Dados de 50+ bookmakers', 'Atualizações a cada 15 min', 'Mercados H2H, spreads, totals']}
          configured={status.oddsApi.configured}
          keyValue={status.oddsApi.key}
          envVar="VITE_ODDS_API_KEY"
        />

        <ApiKeyCard
          name="API-Football"
          description="Dados completos de futebol: placares ao vivo, classificações, estatísticas de jogadores."
          docsUrl="https://www.api-football.com/documentation-v3"
          signupUrl="https://www.api-football.com/register"
          freeTier="100 requests/dia"
          features={['Placares ao vivo (15 seg)', '200+ ligas e copas', 'Classificações em tempo real', 'Estatísticas detalhadas']}
          configured={status.footballApi.configured}
          keyValue={status.footballApi.key}
          envVar="VITE_FOOTBALL_API_KEY"
        />
      </div>

      <div className="card" style={{ padding: 24, marginTop: 20 }}>
        <h3 style={{ marginBottom: 14 }}> Como configurar as chaves</h3>
        <div className="stack" style={{ gap: 12 }}>
          <Step number={1} text="Crie uma conta gratuita no site da API (links acima)" />
          <Step number={2} text="Copie sua chave de API (API Key)" />
          <Step number={3} text="Crie um arquivo .env na raiz do projeto com as chaves:" />
          <div className="code-block" style={{ 
            background: 'var(--surface-3)', 
            padding: '12px 16px', 
            borderRadius: 8, 
            fontFamily: 'monospace', 
            fontSize: '0.85rem',
            color: 'var(--neon)'
          }}>
            VITE_ODDS_API_KEY=sua_chave_aqui<br />
            VITE_FOOTBALL_API_KEY=sua_chave_aqui
          </div>
          <Step number={4} text="Reinicie o servidor de desenvolvimento (npm run dev)" />
        </div>
      </div>

      <div className="card" style={{ padding: 24, marginTop: 20, borderLeft: '3px solid var(--gold)' }}>
        <div className="row" style={{ gap: 10, marginBottom: 8 }}>
          <Shield size={18} style={{ color: 'var(--gold)' }} />
          <h3 style={{ fontSize: '1rem' }}>Aviso Legal</h3>
        </div>
        <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>
          Este projeto é um <strong>protótipo visual</strong> para fins educacionais. Não processa apostas reais, 
          não armazena dados financeiros e não se conecta a casas de apostas. As odds exibidas são apenas para 
          demonstração. O StakeZone não é um site de apostas e não oferece serviços de apostas.
        </p>
      </div>
    </div>
  )
}

function ApiKeyCard({ 
  name, description, docsUrl, signupUrl, freeTier, features, configured, keyValue, envVar 
}: {
  name: string
  description: string
  docsUrl: string
  signupUrl: string
  freeTier: string
  features: string[]
  configured: boolean
  keyValue: string
  envVar: string
}) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div className="row between" style={{ marginBottom: 12 }}>
        <div className="row" style={{ gap: 8, alignItems: 'center' }}>
          <Key size={18} style={{ color: configured ? 'var(--neon)' : 'var(--muted)' }} />
          <h3 style={{ fontSize: '1.05rem' }}>{name}</h3>
        </div>
        <Badge tone={configured ? 'neon' : 'muted'}>
          {configured ? <><Check size={12} /> Configurada</> : <><X size={12} /> Não configurada</>}
        </Badge>
      </div>

      <p className="text-sm text-muted" style={{ marginBottom: 14, lineHeight: 1.5 }}>{description}</p>

      <div className="row wrap" style={{ gap: 6, marginBottom: 14 }}>
        <Badge tone="blue">{freeTier}</Badge>
      </div>

      <div style={{ marginBottom: 14 }}>
        {features.map((f, i) => (
          <div key={i} className="row" style={{ gap: 6, marginBottom: 4 }}>
            <Check size={14} style={{ color: 'var(--neon)', marginTop: 2 }} />
            <span className="text-sm">{f}</span>
          </div>
        ))}
      </div>

      {configured && (
        <div className="card" style={{ padding: '10px 14px', marginBottom: 14, background: 'var(--surface-3)' }}>
          <span className="text-xs text-muted">Chave configurada:</span>
          <span className="text-sm font-bold" style={{ marginLeft: 8, fontFamily: 'monospace' }}>{keyValue}</span>
        </div>
      )}

      <div className="text-xs text-muted" style={{ marginBottom: 12 }}>
        Variável de ambiente: <code style={{ color: 'var(--neon)' }}>{envVar}</code>
      </div>

      <div className="row" style={{ gap: 8 }}>
        <Button size="sm" variant="primary" onClick={() => window.open(signupUrl, '_blank')}>
          <ExternalLink size={14} /> Criar conta grátis
        </Button>
        <Button size="sm" variant="outline" onClick={() => window.open(docsUrl, '_blank')}>
          <Globe size={14} /> Documentação
        </Button>
      </div>
    </div>
  )
}

function Step({ number, text }: { number: number; text: string }) {
  return (
    <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
      <div style={{
        width: 24, height: 24, borderRadius: 8, background: 'var(--neon-soft)',
        color: 'var(--neon)', display: 'grid', placeItems: 'center',
        fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
      }}>
        {number}
      </div>
      <span className="text-sm" style={{ lineHeight: 1.5 }}>{text}</span>
    </div>
  )
}
