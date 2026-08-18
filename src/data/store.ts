import type { Product, Promotion } from './types'

export const PRODUCT_CATEGORIES = [
  'Todos', 'Camisetas', 'Bonés', 'Acessórios', 'Equipamentos', 'Exclusivos',
]

export const PRODUCTS: Product[] = [
  {
    id: 'p1', name: 'Camisa Oficial StakeZone 2026', category: 'Camisetas', price: 349.9, oldPrice: 449.9,
    image: '', gradient: 'linear-gradient(135deg, #22ff88, #0a7a42)', badge: '-22%', rating: 4.9,
    colors: ['Preto', 'Branco', 'Verde'], sizes: ['P', 'M', 'G', 'GG'],
    description: 'Camisa oficial da plataforma com tecnologia dry-fit, tecido respirável e corte atlético. Edição 2026.',
    stock: 42
  },
  {
    id: 'p2', name: 'Jaqueta Premium Storm Series', category: 'Camisetas', price: 499.9, oldPrice: 699.9,
    image: '', gradient: 'linear-gradient(135deg, #4d7cff, #1d3a8a)', badge: '-29%', rating: 4.8,
    colors: ['Preto', 'Azul'], sizes: ['P', 'M', 'G', 'GG'],
    description: 'Jaqueta corta-vento impermeável com interior térmico e detalhes em neon. Resistente e moderna.',
    stock: 18
  },
  {
    id: 'p3', name: 'Regata Performance Pro', category: 'Camisetas', price: 149.9, oldPrice: 199.9,
    image: '', gradient: 'linear-gradient(135deg, #00d4ff, #0b6e8f)', badge: '-25%', rating: 4.6,
    colors: ['Preto', 'Ciano'], sizes: ['P', 'M', 'G'],
    description: 'Regata de alta performance com costura plana e toque leve, ideal para treinos intensos.',
    stock: 60
  },
  {
    id: 'p4', name: 'Boné Edição Limitada Gold', category: 'Bonés', price: 129.9, oldPrice: 179.9,
    image: '', gradient: 'linear-gradient(135deg, #ffd166, #c99200)', badge: 'Exclusivo', rating: 4.9,
    colors: ['Dourado', 'Preto'],
    description: 'Boné de edição limitada com bordado dourado premium e ajuste flexível. Número limitado de unidades.',
    stock: 25
  },
  {
    id: 'p5', name: 'Boné Snapback Neon', category: 'Bonés', price: 89.9,
    image: '', gradient: 'linear-gradient(135deg, #22ff88, #00d4ff)', rating: 4.5,
    colors: ['Preto', 'Verde'],
    description: 'Snapback com borda reta e detalhe em neon, aba plana e fecho regulável.',
    stock: 85
  },
  {
    id: 'p6', name: 'Garrafa Térmica Steel 750ml', category: 'Acessórios', price: 79.9, oldPrice: 99.9,
    image: '', gradient: 'linear-gradient(135deg, #8a90a6, #2b2b2b)', badge: '-20%', rating: 4.4,
    colors: ['Preto', 'Inox'],
    description: 'Garrafa em aço inox de dupla parede, mantém a temperatura por até 12 horas.',
    stock: 120
  },
  {
    id: 'p7', name: 'Mochila Tech Urban 25L', category: 'Acessórios', price: 219.9, oldPrice: 279.9,
    image: '', gradient: 'linear-gradient(135deg, #7a5cff, #4a2db8)', badge: '-21%', rating: 4.7,
    colors: ['Preto', 'Roxo'],
    description: 'Mochila com compartimento acolchoado para notebook, USB integrado e tecido repelente à água.',
    stock: 34
  },
  {
    id: 'p8', name: 'Camisa Retrô 2010 Classic', category: 'Camisetas', price: 289.9, oldPrice: 359.9,
    image: '', gradient: 'linear-gradient(135deg, #ff9f43, #c9611a)', badge: '-19%', rating: 4.8,
    colors: ['Laranja', 'Preto'], sizes: ['P', 'M', 'G', 'GG'],
    description: 'Camisa retrô inspirada no visual de 2010. Tecido macio e estampa vintage.',
    stock: 22
  },
  {
    id: 'p9', name: 'Bola de Futebol Pro Match', category: 'Equipamentos', price: 199.9, oldPrice: 259.9,
    image: '', gradient: 'linear-gradient(135deg, #f4f6ff, #8a90a6)', badge: '-23%', rating: 4.6,
    description: 'Bola oficial de treino com costura termossoldada e superfície de microtextura.',
    stock: 40
  },
  {
    id: 'p10', name: 'Bola de Basquete Indoor/Outdoor', category: 'Equipamentos', price: 159.9,
    image: '', gradient: 'linear-gradient(135deg, #ff9f43, #8a3a00)', rating: 4.5,
    description: 'Bola de basquete tamanho 7, excelente aderência para quadras internas e externas.',
    stock: 55
  },
  {
    id: 'p11', name: 'Kit Pulseira Esportiva Smart', category: 'Equipamentos', price: 129.9, oldPrice: 189.9,
    image: '', gradient: 'linear-gradient(135deg, #00d4ff, #4d7cff)', badge: '-31%', rating: 4.7,
    colors: ['Preto', 'Ciano'],
    description: 'Pulseira fitness com monitor de batimentos, passos e sono. Compatível com iOS e Android.',
    stock: 48
  },
  {
    id: 'p12', name: 'Chaveiro Troféu Dourado', category: 'Exclusivos', price: 49.9,
    image: '', gradient: 'linear-gradient(135deg, #ffd166, #ff9f43)', badge: 'Exclusivo', rating: 4.9,
    description: 'Chaveiro troféu em metal com banho dourado, edição exclusiva para membros VIP.',
    stock: 90
  },
  {
    id: 'p13', name: 'Caneca Premium Logo Glow', category: 'Exclusivos', price: 69.9, oldPrice: 89.9,
    image: '', gradient: 'linear-gradient(135deg, #22ff88, #0a7a42)', badge: '-22%', rating: 4.8,
    colors: ['Preto'],
    description: 'Caneca de cerâmica de 380ml com logo em efeito glow que brilha no escuro.',
    stock: 75
  },
  {
    id: 'p14', name: 'Casaco Oversize Urban', category: 'Camisetas', price: 329.9, oldPrice: 429.9,
    image: '', gradient: 'linear-gradient(135deg, #2b2b2b, #8a90a6)', badge: '-23%', rating: 4.5,
    colors: ['Preto', 'Cinza'], sizes: ['M', 'G', 'GG'],
    description: 'Casaco oversized com capuz, bolsos laterais e acabamento premium.',
    stock: 16
  },
  {
    id: 'p15', name: 'Meias Tech 3 Pares', category: 'Acessórios', price: 59.9, oldPrice: 79.9,
    image: '', gradient: 'linear-gradient(135deg, #ff4d6d, #a4133c)', badge: '-25%', rating: 4.4,
    colors: ['Preto', 'Vermelho'],
    description: 'Pack com 3 pares de meias de compressão com canelura reforçada e respirabilidade.',
    stock: 150
  },
  {
    id: 'p16', name: 'Corda Pular Speed Pro', category: 'Equipamentos', price: 49.9,
    image: '', gradient: 'linear-gradient(135deg, #7aa2ff, #2b4fa8)', rating: 4.3,
    description: 'Corda de pular com rolamento de alta velocidade e cabo ajustável.',
    stock: 200
  },
]

export const PROMOTIONS: Promotion[] = [
  {
    id: 'pr1', title: 'Bônus de Boas-Vindas 100%', tag: 'Bônus de Aposta',
    desc: 'Dobre seu primeiro depósito até R$ 1.000 em bônus para apostas esportivas.',
    type: 'bonus', gradient: 'linear-gradient(135deg, rgba(34,255,136,0.9), rgba(0,212,255,0.8))', active: true,
    tos: 'Válido para novos jogadores. Requer depósito mínimo de R$ 20. Bônus sujeito a rollover de 8x em apostas com odds mínimas de 1.80. Termos e condições completos aplicáveis.'
  },
  {
    id: 'pr2', title: 'Cashback de 10% no Ao Vivo', tag: 'Cashback',
    desc: 'Receba 10% de volta em apostas ao vivo que resultarem em derrota. Até R$ 500 por semana.',
    type: 'cashback', gradient: 'linear-gradient(135deg, rgba(255,209,102,0.9), rgba(255,159,67,0.8))', active: true,
    tos: 'Cashback creditado como crédito de aposta. Aplicável apenas a apostas ao vivo em partidas selecionadas. Termos e condições completos aplicáveis.'
  },
  {
    id: 'pr3', title: 'Combinada Booster +20%', tag: 'Multiplicador',
    desc: 'Aumente seus ganhos em 20% em apostas combinadas com 3 ou mais seleções.',
    type: 'bonus', gradient: 'linear-gradient(135deg, rgba(77,124,255,0.9), rgba(199,146,255,0.8))', active: true,
    tos: 'O boost é aplicado automaticamente no retorno potencial. Selecções excluídas: mercados de empate no total. Termos e condições completos aplicáveis.'
  },
  {
    id: 'pr4', title: 'Bônus na Loja: -20% na 1ª compra', tag: 'Loja Oficial',
    desc: 'Use o cupom STORE20 e ganhe 20% de desconto na sua primeira compra na StakeZone Store.',
    type: 'loja', gradient: 'linear-gradient(135deg, rgba(255,77,109,0.85), rgba(255,159,67,0.75))', active: true,
    tos: 'Cupom de uso único por cliente. Não acumulativo com outras ofertas. Válido para produtos participantes. Termos e condições completos aplicáveis.'
  },
  {
    id: 'pr5', title: 'Bônus de Indicação R$ 50', tag: 'Indique e Ganhe',
    desc: 'Convide amigos e ganhe R$ 50 de bônus para cada um que fizer um depósito.',
    type: 'bonus', gradient: 'linear-gradient(135deg, rgba(34,255,136,0.75), rgba(77,124,255,0.8))', active: true,
    tos: 'Bônus creditado após o depósito e aposta qualificadora do indicado. Limite de 10 indicações por mês. Termos e condições completos aplicáveis.'
  },
  {
    id: 'pr6', title: 'Torneio de Futebol: R$ 10k em prêmios', tag: 'Torneio',
    desc: 'Acumule pontos em apostas de futebol e dispute uma premiação semanal de R$ 10.000.',
    type: 'casino', gradient: 'linear-gradient(135deg, rgba(0,212,255,0.8), rgba(255,77,109,0.8))', active: false,
    tos: 'Pontos calculados pelo valor apostado multiplicado pela odd. Prêmios sujeitos a rollover. Termos e condições completos aplicáveis.'
  },
]

export const COUPONS = ['STORE20', 'BEMVINDO10', 'VIP15', 'FANATICO5']
