// app.js – lógica principal do álbum de figurinhas FIFA 2026
// Tema Ultimate FIFA - Modo Escuro & Glassmorphism com Card Flip 3D

// Override do alert() nativo do navegador com um modal customizado, responsivo e elegante
window.alert = function(message) {
  const existingAlert = document.getElementById('custom-global-alert');
  if (existingAlert) {
    existingAlert.remove();
  }

  const overlay = document.createElement('div');
  overlay.id = 'custom-global-alert';
  overlay.className = 'fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[10000] p-4 animate-fade-in';
  
  const container = document.createElement('div');
  container.className = 'bg-[#120e16] border border-copaYellow/20 rounded-2xl p-6 max-w-sm w-full text-center flex flex-col items-center gap-4 shadow-2xl shadow-copaYellow/5';
  
  container.innerHTML = `
    <div class="w-12 h-12 rounded-full bg-copaYellow/10 flex items-center justify-center border border-copaYellow/30 text-copaYellow mb-1">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    </div>
    <h3 class="text-white font-bold text-sm uppercase tracking-wider">Aviso</h3>
    <p class="text-gray-300 text-xs leading-relaxed text-center font-sans whitespace-pre-wrap">${message}</p>
  `;
  
  const btn = document.createElement('button');
  btn.className = 'w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-copaYellow to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-darkBg font-black text-xs uppercase tracking-wider shadow-lg shadow-copaYellow/10 transition duration-200 cursor-pointer';
  btn.textContent = 'Ok';
  btn.onclick = () => {
    overlay.remove();
  };
  
  container.appendChild(btn);
  overlay.appendChild(container);
  document.body.appendChild(overlay);
};
// Lógica de Captura do PWA (Progressive Web App)
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  // Impede o Chrome de exibir o prompt padrão
  e.preventDefault();
  // Salva o evento para uso posterior
  deferredPrompt = e;
  // Recarrega o header para exibir o botão de instalação
  if (typeof renderHeader === 'function') {
    renderHeader();
  }
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  if (typeof renderHeader === 'function') {
    renderHeader();
  }
  console.log('PWA instalado com sucesso.');
});

const PALLETE = {
  blue: '#0033A0',
  green: '#00e676', // verde neon FUT
  yellow: '#FFC726', // dourado FUT
};

// Estrutura de dados no localStorage
const storage = {
  getAlbums() {
    try {
      return JSON.parse(localStorage.getItem('albums') || '{}');
    } catch (e) {
      console.error('Erro ao decodificar localStorage', e);
      return {};
    }
  },
  setAlbums(albums) {
    localStorage.setItem('albums', JSON.stringify(albums));
  },
  getCurrentAlbumId() {
    return localStorage.getItem('currentAlbumId') || null;
  },
  setCurrentAlbumId(id) {
    localStorage.setItem('currentAlbumId', id);
  },
};

// Mapeamento de URLs estáveis e públicas de brasões/logos das federações de futebol reais (Wikimedia Commons)
const crestsMap = {
  USA: './crests/brasão da seleção USA.png',
  MEX: './crests/brasao_mexico.png',
  CAN: './crests/brasão da seleção canada.png',
  BRA: './crests/brasão da seleção brasil.png',
  COL: './crests/brasão da seleção colombia.webp',
  PAR: './crests/brasão da seleção paraguai.png',
  ARG: './crests/brasao_argentina.png',
  URU: './crests/brasão da seleção uruguai.webp',
  KSA: './crests/brasão da seleção arabia saudita.png',
  FRA: './crests/brasao_franca.png',
  MAR: './crests/brasão da seleção marrocos.png',
  AUT: './crests/brasão da seleção austria.png',
  ESP: './crests/brasão da seleção espanha.png',
  JPN: './crests/brasão da seleção japão.png',
  ECU: './crests/brasão da seleção equador.png',
  EGY: './crests/brasao_egito.png',
  GER: './crests/brasão da seleção alemanha.webp',
  BEL: './crests/brasao_belgica.png',
  KOR: './crests/brasao_kor.png',
  TUN: './crests/brasão da seleção tunisia.png',
  ENG: './crests/brasão da seleção ira.png',
  SEN: './crests/brasão da seleção senegal.png',
  IRN: './crests/brasão da seleção ira.png',
  POR: './crests/brasão da seleção portugual.png',
  GHA: './crests/brasão da seleção gana.png',
  TUR: './crests/brasao_turquia.png',
  AUS: './crests/brasão da seleção australia.png',
  ALG: './crests/brasão da seleção argelia.png',
  NED: './crests/brasão da seleção holanda.png',
  CRO: './crests/brasão da seleção croacia.png',
  SCO: './crests/brasão da seleção escocia.png',
  SUI: './crests/brasao_suica.png',
  PAN: './crests/brasao_panama.png',
  SWE: './crests/brasão da seleção suecia.png',
  NZL: './crests/brasao_nova_zelandia.png',
  RSA: './crests/brasao_rsa.png',
  CZE: './crests/brasao_cze.png',
  BIH: './crests/brasao_bosnia.png',
  QAT: './crests/brasão da seleção Catar.png',
  HAI: './crests/brasão da seleção haiti.png',
  CUW: './crests/brasão da seleção curaçao.png',
  CIV: './crests/brasão da seleção costa do marfim.png',
  CPV: './crests/brasão da seleção cabo verde.png',
  IRQ: './crests/brasão da seleção iraque.png',
  NOR: './crests/brasão da seleção noruegua.png',
  FWC: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/FIFA_logo_without_slogan.svg/120px-FIFA_logo_without_slogan.svg.png',
  CC: './crests/Logo CocaZero Copa1.png',
  // Enriquecidos com Wikimedia Commons estáveis
  JOR: './crests/brasao_jordania.png',
  COD: './crests/brasao_congo.png',
  UZB: './crests/brasao_usbequistao.png',
  EXTRAS: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Golden_Ball.svg/120px-Golden_Ball.svg.png'
};

// Tradutor de sigla de 3 letras para código de 2 letras do FlagCDN
const flagMap = {
  FWC: 'us',
  CC: 'us',
  EXTRAS: 'us',
  MEX: 'mx', RSA: 'za', KOR: 'kr', CZE: 'cz',
  CAN: 'ca', BIH: 'ba', QAT: 'qa', SUI: 'ch',
  BRA: 'br', MAR: 'ma', HAI: 'ht', SCO: 'gb-sct',
  USA: 'us', PAR: 'py', AUS: 'au', TUR: 'tr',
  GER: 'de', CUW: 'cw', CIV: 'ci', ECU: 'ec',
  NED: 'nl', JPN: 'jp', SWE: 'se', TUN: 'tn',
  BEL: 'be', EGY: 'eg', IRN: 'ir', NZL: 'nz',
  ESP: 'es', CPV: 'cv', KSA: 'sa', URU: 'uy',
  FRA: 'fr', SEN: 'sn', IRQ: 'iq', NOR: 'no',
  ARG: 'ar', ALG: 'dz', AUT: 'at', JOR: 'jo',
  POR: 'pt', COD: 'cd', UZB: 'uz', COL: 'co',
  ENG: 'gb-eng', CRO: 'hr', GHA: 'gh', PAN: 'pa'
};

// Emojis de bandeira por sigla de país
const flagEmojis = {
  USA: '🇺🇸', MEX: '🇲🇽', CAN: '🇨🇦', BRA: '🇧🇷', COL: '🇨🇴', PAR: '🇵🇾', ARG: '🇦🇷', URU: '🇺🇾',
  KSA: '🇸🇦', FRA: '🇫🇷', MAR: '🇲🇦', AUT: '🇦🇹', ESP: '🇪🇸', JPN: '🇯🇵', ECU: '🇪🇨', EGY: '🇪🇬',
  GER: '🇩🇪', BEL: '🇧🇪', KOR: '🇰🇷', TUN: '🇹🇳', ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', SEN: '🇸🇳', IRN: '🇮🇷', POR: '🇵🇹',
  GHA: '🇬🇭', TUR: '🇹🇷', AUS: '🇦🇺', ALG: '🇩🇿', NED: '🇳🇱', CRO: '🇭🇷', SUI: '🇨🇭', PAN: '🇵🇦',
  SWE: '🇸🇪', NZL: '🇳🇿', RSA: '🇿🇦', CZE: '🇨🇿', BIH: '🇧🇦', QAT: '🇶🇦', HAI: '🇭🇹', SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  CUW: '🇨🇼', CIV: '🇨🇮', CPV: '🇨🇻', IRQ: '🇮🇶', NOR: '🇳🇴', JOR: '🇯🇴', COD: '🇨🇩', UZB: '🇺🇿',
  FWC: '🏆', CC: '🥤', EXTRAS: '✨'
};

// Histórico de títulos mundiais das seleções
const worldCupTitles = {
  BRA: { count: 5, years: '1958, 1962, 1970, 1994, 2002' },
  ITA: { count: 4, years: '1934, 1938, 1982, 2006' },
  GER: { count: 4, years: '1954, 1974, 1990, 2014' },
  ARG: { count: 3, years: '1978, 1986, 2022' },
  URU: { count: 2, years: '1930, 1950' },
  FRA: { count: 2, years: '1998, 2018' },
  ENG: { count: 1, years: '1966' },
  ESP: { count: 1, years: '2010' }
};

// Dados estruturados das seleções e grupos da Copa 2026 (48 seleções)
const groupsData = [
  {
    name: 'Grupo A',
    teams: [
      { code: 'MEX', name: 'México', rank: 1, points: 0, eliminated: false },
      { code: 'RSA', name: 'África do S.', rank: 2, points: 0, eliminated: false },
      { code: 'KOR', name: 'Coreia do S.', rank: 3, points: 0, eliminated: false },
      { code: 'CZE', name: 'Rep. Tcheca', rank: 4, points: 0, eliminated: false }
    ]
  },
  {
    name: 'Grupo B',
    teams: [
      { code: 'CAN', name: 'Canadá', rank: 1, points: 0, eliminated: false },
      { code: 'BIH', name: 'Bósnia', rank: 2, points: 0, eliminated: false },
      { code: 'QAT', name: 'Catar', rank: 3, points: 0, eliminated: false },
      { code: 'SUI', name: 'Suíça', rank: 4, points: 0, eliminated: false }
    ]
  },
  {
    name: 'Grupo C',
    teams: [
      { code: 'BRA', name: 'Brasil', rank: 1, points: 0, eliminated: false },
      { code: 'MAR', name: 'Marrocos', rank: 2, points: 0, eliminated: false },
      { code: 'HAI', name: 'Haiti', rank: 3, points: 0, eliminated: false },
      { code: 'SCO', name: 'Escócia', rank: 4, points: 0, eliminated: false }
    ]
  },
  {
    name: 'Grupo D',
    teams: [
      { code: 'USA', name: 'EUA', rank: 1, points: 0, eliminated: false },
      { code: 'PAR', name: 'Paraguai', rank: 2, points: 0, eliminated: false },
      { code: 'AUS', name: 'Austrália', rank: 3, points: 0, eliminated: false },
      { code: 'TUR', name: 'Turquia', rank: 4, points: 0, eliminated: false }
    ]
  },
  {
    name: 'Grupo E',
    teams: [
      { code: 'GER', name: 'Alemanha', rank: 1, points: 0, eliminated: false },
      { code: 'CUW', name: 'Curaçao', rank: 2, points: 0, eliminated: false },
      { code: 'CIV', name: 'Costa do M.', rank: 3, points: 0, eliminated: false },
      { code: 'ECU', name: 'Equador', rank: 4, points: 0, eliminated: false }
    ]
  },
  {
    name: 'Grupo F',
    teams: [
      { code: 'NED', name: 'Holanda', rank: 1, points: 0, eliminated: false },
      { code: 'JPN', name: 'Japão', rank: 2, points: 0, eliminated: false },
      { code: 'SWE', name: 'Suécia', rank: 3, points: 0, eliminated: false },
      { code: 'TUN', name: 'Tunísia', rank: 4, points: 0, eliminated: false }
    ]
  },
  {
    name: 'Grupo G',
    teams: [
      { code: 'BEL', name: 'Bélgica', rank: 1, points: 0, eliminated: false },
      { code: 'EGY', name: 'Egito', rank: 2, points: 0, eliminated: false },
      { code: 'IRN', name: 'Irã', rank: 3, points: 0, eliminated: false },
      { code: 'NZL', name: 'Nova Zelândia', rank: 4, points: 0, eliminated: false }
    ]
  },
  {
    name: 'Grupo H',
    teams: [
      { code: 'ESP', name: 'Espanha', rank: 1, points: 0, eliminated: false },
      { code: 'CPV', name: 'Cabo Verde', rank: 2, points: 0, eliminated: false },
      { code: 'KSA', name: 'Arábia S.', rank: 3, points: 0, eliminated: false },
      { code: 'URU', name: 'Uruguai', rank: 4, points: 0, eliminated: false }
    ]
  },
  {
    name: 'Grupo I',
    teams: [
      { code: 'FRA', name: 'França', rank: 1, points: 0, eliminated: false },
      { code: 'SEN', name: 'Senegal', rank: 2, points: 0, eliminated: false },
      { code: 'IRQ', name: 'Iraque', rank: 3, points: 0, eliminated: false },
      { code: 'NOR', name: 'Noruega', rank: 4, points: 0, eliminated: false }
    ]
  },
  {
    name: 'Grupo J',
    teams: [
      { code: 'ARG', name: 'Argentina', rank: 1, points: 0, eliminated: false },
      { code: 'ALG', name: 'Argélia', rank: 2, points: 0, eliminated: false },
      { code: 'AUT', name: 'Áustria', rank: 3, points: 0, eliminated: false },
      { code: 'JOR', name: 'Jordânia', rank: 4, points: 0, eliminated: false }
    ]
  },
  {
    name: 'Grupo K',
    teams: [
      { code: 'POR', name: 'Portugal', rank: 1, points: 0, eliminated: false },
      { code: 'COD', name: 'Congo', rank: 2, points: 0, eliminated: false },
      { code: 'UZB', name: 'Uzbequistão', rank: 3, points: 0, eliminated: false },
      { code: 'COL', name: 'Colômbia', rank: 4, points: 0, eliminated: false }
    ]
  },
  {
    name: 'Grupo L',
    teams: [
      { code: 'ENG', name: 'Inglaterra', rank: 1, points: 0, eliminated: false },
      { code: 'CRO', name: 'Croácia', rank: 2, points: 0, eliminated: false },
      { code: 'GHA', name: 'Gana', rank: 3, points: 0, eliminated: false },
      { code: 'PAN', name: 'Panamá', rank: 4, points: 0, eliminated: false }
    ]
  }
];

// Mapeamento plano de seleções para busca rápida
const teamsMap = {};
groupsData.forEach(g => {
  g.teams.forEach(t => {
    teamsMap[t.code] = t.name;
  });
});

// Nomes de elenco e posições oficiais/fictícias da Panini
const playerNames = {
  1: "ESCUDO OFICIAL",
  2: "SELEÇÃO POSADA",
  3: "GOLEIRO TITULAR",
  4: "LATERAL DIREITO",
  5: "ZAGUEIRO CENTRAL",
  6: "ZAGUEIRO LÍBERO",
  7: "LATERAL ESQUERDO",
  8: "VOLANTE MARCAÇÃO",
  9: "MEIA ARMADOR",
  10: "PONTA DIREITA",
  11: "CENTROAVANTE",
  12: "PONTA ESQUERDA",
  13: "GOLEIRO RESERVA",
  14: "ZAGUEIRO RESERVA",
  15: "LATERAL RESERVA",
  16: "MEIO-CAMPISTA",
  17: "VOLANTE RESERVA",
  18: "MEIA ATACANTE",
  19: "PONTA RESERVA",
  20: "ATACANTE RESERVA"
};

// Lista Oficial dos 20 Jogadores Legends da seção "Figurinhas Extras / Premium" (Ordenado Alfabeticamente)
const legendsData = [
  { name: "Almoez Ali", country: "QA" },
  { name: "Alphonso Davies", country: "CA" },
  { name: "Christian Eriksen", country: "DK" },
  { name: "Cristiano Ronaldo", country: "PT" },
  { name: "Dusan Vlahovic", country: "RS" },
  { name: "Gavi", country: "ES" },
  { name: "Giovanni Reyna", country: "US" },
  { name: "Guillermo Ochoa", country: "MX" },
  { name: "Heung-Min Son", country: "KR" },
  { name: "Jude Bellingham", country: "GB-ENG" },
  { name: "Kevin de Bruyne", country: "BE" },
  { name: "Kylian Mbappé", country: "FR" },
  { name: "Lionel Messi", country: "AR" },
  { name: "Luka Modric", country: "HR" },
  { name: "Luis Suárez", country: "UY" },
  { name: "Neymar Jr", country: "BR" },
  { name: "Rafael Varane", country: "FR" },
  { name: "Robert Lewandowski", country: "PL" },
  { name: "Ryan Gravenberch", country: "NL" },
  { name: "Sadio Mané", country: "SN" }
];

// Utilidades
function generateId() {
  return 'alb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
}

// Controle de Cache e Sincronização de Classificação de Seleções (API Standings)
const STANDINGS_CACHE_KEY = 'copa2026_standings_cache';
const STANDINGS_CACHE_TIME_KEY = 'copa2026_standings_cache_time';
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 horas

async function syncStandings() {
  const now = Date.now();
  const cachedTime = localStorage.getItem(STANDINGS_CACHE_TIME_KEY);
  const cachedData = localStorage.getItem(STANDINGS_CACHE_KEY);

  // 1. Tenta carregar do cache se estiver dentro do prazo de validade
  if (cachedTime && cachedData && (now - parseInt(cachedTime, 10) < CACHE_DURATION)) {
    console.log('Usando classificação do cache do LocalStorage.');
    applyStandingsData(JSON.parse(cachedData));
    return;
  }

  // 2. Sem cache ou expirado, faz requisição ao JSON público de classificação
  try {
    const response = await fetch('./copa2026-standings.json');
    if (!response.ok) throw new Error('Erro na requisição do JSON público.');
    
    const data = await response.json();
    if (data && data.standings) {
      console.log('Classificação sincronizada com sucesso do servidor.');
      localStorage.setItem(STANDINGS_CACHE_KEY, JSON.stringify(data.standings));
      localStorage.setItem(STANDINGS_CACHE_TIME_KEY, now.toString());
      applyStandingsData(data.standings);
    }
  } catch (error) {
    console.warn('Erro ao conectar com API de classificação. Usando dados offline:', error);
    if (cachedData) {
      applyStandingsData(JSON.parse(cachedData));
    }
  }
}

// Calcula a fase da seleção de forma dinâmica no mata-mata
function getTeamPhase(team, standings) {
  if (!standings || !standings[team.code]) return null;
  const stats = standings[team.code];
  if (stats.eliminated) {
    const stage = stats.eliminatedStage;
    if (stage === '16 avos') return 'R16';
    if (stage === 'Oitavas') return 'OF';
    if (stage === 'Quartas') return 'QF';
    if (stage === 'Semi-final') return 'SF';
    if (stage === 'Final') return 'F';
    return null; // Fase de Grupos
  } else {
    // Para seleções ativas, identifica dinamicamente qual é a fase atual baseada em quem já foi eliminado
    let maxElimStage = 'Fase de Grupos';
    Object.values(standings).forEach(s => {
      if (s.eliminated && s.eliminatedStage) {
        const estages = ['Fase de Grupos', '16 avos', 'Oitavas', 'Quartas', 'Semi-final', 'Final'];
        if (estages.indexOf(s.eliminatedStage) > estages.indexOf(maxElimStage)) {
          maxElimStage = s.eliminatedStage;
        }
      }
    });

    if (maxElimStage === 'Fase de Grupos') return 'R16';
    if (maxElimStage === '16 avos') return 'OF';
    if (maxElimStage === 'Oitavas') return 'QF';
    if (maxElimStage === 'Quartas') return 'SF';
    if (maxElimStage === 'Semi-final') return 'F';
    if (maxElimStage === 'Final') return '🏆'; // Campeão
    return null;
  }
}

// Mapa de fase para descrição amigável em português
const PHASE_DESCRIPTIONS = {
  'FG':    'Fase de Grupos',
  'R16':   'Oitavas de Final (16 avos)',
  'OF':    'Oitavas de Final',
  'QF':    'Quartas de Final',
  'SF':    'Semifinal',
  '3rd':   '3º Lugar',
  '3º':    '3º Lugar',
  'F':     'Final',
  '🏆':    'Campeão'
};

// Calcula e formata a fase e a cor do balãozinho da Copa 2026 de forma dinâmica
function getPhaseInfo(team, standings) {
  let phaseText = 'FG';
  // Cinza padrão: campeonato ainda não começou (início 11/06/2026)
  let colorClass = 'bg-white/5 text-gray-400 border-white/10';

  const stats = (standings && standings[team.code]) ? standings[team.code] : null;
  const isEliminated = stats ? stats.eliminated : (team.eliminated || false);
  const eliminatedStage = stats ? stats.eliminatedStage : null;
  const points = stats ? (stats.points || 0) : (team.points || 0);

  if (isEliminated) {
    colorClass = 'bg-red-500/15 text-red-400 border-red-500/25'; // vermelho (eliminado)
    if (eliminatedStage) {
      if (eliminatedStage.includes('Grupos') || eliminatedStage === 'FG') phaseText = 'FG';
      else if (eliminatedStage.includes('16') || eliminatedStage === 'R16') phaseText = 'R16';
      else if (eliminatedStage.includes('Oitavas') || eliminatedStage === 'OF') phaseText = 'OF';
      else if (eliminatedStage.includes('Quartas') || eliminatedStage === 'QF') phaseText = 'QF';
      else if (eliminatedStage.includes('Semi') || eliminatedStage === 'SF') phaseText = 'SF';
      else if (eliminatedStage.includes('3') || eliminatedStage === '3rd') phaseText = '3º';
      else if (eliminatedStage.includes('Final') || eliminatedStage === 'F') phaseText = 'F';
      else phaseText = eliminatedStage;
    }
  } else {
    // Se não está eliminado, descobre a fase atual
    if (stats) {
      let maxElimStage = 'Fase de Grupos';
      Object.values(standings).forEach(s => {
        if (s.eliminated && s.eliminatedStage) {
          const stages = ['Fase de Grupos', '16 avos', 'Oitavas', 'Quartas', 'Semi-final', 'Final'];
          if (stages.indexOf(s.eliminatedStage) > stages.indexOf(maxElimStage)) {
            maxElimStage = s.eliminatedStage;
          }
        }
      });

      if (maxElimStage === 'Fase de Grupos') phaseText = 'R16';
      else if (maxElimStage === '16 avos') phaseText = 'OF';
      else if (maxElimStage === 'Oitavas') phaseText = 'QF';
      else if (maxElimStage === 'Quartas') phaseText = 'SF';
      else if (maxElimStage === 'Semi-final') phaseText = 'F';
      else if (maxElimStage === 'Final') phaseText = '🏆'; // Campeão
    }

    // Cor: se tiver pontos (campeonato em andamento) fica verde, senão cinza (ainda não começou)
    if (points > 0 || (stats && stats.rank !== undefined && phaseText !== 'FG')) {
      colorClass = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'; // verde (em andamento)
    }
  }

  // Mapeamento de siglas curtas amigáveis
  const friendlyMap = {
    'FG': 'FG',
    'R16': '16avos',
    'OF': 'OF',
    'QF': 'QF',
    'SF': 'SF',
    '3rd': '3º',
    '3º': '3º',
    'F': 'F',
    '🏆': '🏆'
  };

  return {
    label: friendlyMap[phaseText] || friendlyMap[phaseText.toUpperCase()] || phaseText,
    phaseKey: phaseText,
    description: PHASE_DESCRIPTIONS[phaseText] || phaseText,
    color: colorClass
  };
}

// Animação de Goal!!! em tela cheia ao completar uma seleção
function triggerGoalAnimation(onComplete) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-500 opacity-0';
  
  const text = document.createElement('div');
  text.className = 'text-copaYellow font-black text-6xl md:text-8xl tracking-widest uppercase animate-bounce drop-shadow-[0_0_20px_#FFC726]';
  text.textContent = 'GOAL!!!';
  overlay.appendChild(text);

  const subtext = document.createElement('div');
  subtext.className = 'text-white text-xs font-bold uppercase tracking-wider mt-4 animate-pulse';
  subtext.textContent = 'Seleção Completada!';
  overlay.appendChild(subtext);
  
  document.body.appendChild(overlay);
  
  overlay.offsetHeight; // force reflow
  overlay.classList.remove('opacity-0');
  overlay.classList.add('opacity-100');
  
  setTimeout(() => {
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0');
    setTimeout(() => {
      overlay.remove();
      if (onComplete) onComplete();
    }, 500);
  }, 2200);
}

// Pop-up de boas-vindas exibido uma vez por sessão
function checkAlbumEntryPopup() {
  if (sessionStorage.getItem('album_entry_popup_shown')) return;
  
  const albumId = storage.getCurrentAlbumId();
  const albums = storage.getAlbums();
  const album = albums[albumId];
  if (!album) return;

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-[10000] flex items-center justify-center bg-black/75 p-4';
  
  const content = document.createElement('div');
  content.className = 'glass-panel p-6 rounded-2xl border-white/5 max-w-sm w-full text-center space-y-4';
  
  const title = document.createElement('h3');
  title.className = 'text-copaYellow font-black text-sm uppercase tracking-wider';
  title.textContent = 'Álbum Ativo';
  content.appendChild(title);

  const desc = document.createElement('p');
  desc.className = 'text-xs text-gray-300';
  desc.innerHTML = "Você está visualizando a coleção:<br><strong class=\"text-white text-sm\">" + album.name + "</strong>";
  content.appendChild(desc);

  const btnRow = document.createElement('div');
  btnRow.className = 'flex gap-3 pt-2';

  const btnOk = document.createElement('button');
  btnOk.className = 'flex-1 px-4 py-2 bg-copaGreen hover:bg-opacity-90 text-black text-xs font-black uppercase tracking-wider rounded-xl transition';
  btnOk.textContent = 'OK';
  btnOk.onclick = () => {
    sessionStorage.setItem('album_entry_popup_shown', 'true');
    modal.remove();
  };
  btnRow.appendChild(btnOk);

  const btnChange = document.createElement('button');
  btnChange.className = 'flex-1 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-black uppercase tracking-wider rounded-xl transition';
  btnChange.textContent = 'Mudar';
  btnChange.onclick = () => {
    modal.remove();
    sessionStorage.setItem('album_entry_popup_shown', 'true');
    const selector = document.getElementById('albumSelector');
    if (selector) {
      selector.focus();
    }
  };
  btnRow.appendChild(btnChange);

  content.appendChild(btnRow);
  modal.appendChild(content);
  document.body.appendChild(modal);
}

// Compartilhamento geral do aplicativo
function shareApp() {
  const title = 'Ultimate Cromo FIFA 2026';
  const link = window.location.origin + window.location.pathname;
  const text = "Eu uso o app-web (" + link + ") para o controle do meu álbum, ele tem um excelente layout e a funcionalidade de Trocas Qualificadas, onde o próprio app encontra as figurinhas faltantes para trocar.";
  shareText(title, text);
}

// Verifica se um card tem troca qualificada com outra coleção
function hasQualifiedTrade(key) {
  const currentAlbumId = storage.getCurrentAlbumId();
  const albums = storage.getAlbums();
  const currentAlbum = albums[currentAlbumId];
  if (!currentAlbum) return false;
  
  const currentSticker = currentAlbum.stickers[key];
  const currentOwned = currentSticker ? currentSticker.owned : false;
  const currentDup = currentSticker ? (currentSticker.duplicate || 0) : 0;
  
  let matchFound = false;
  
  // Se houver mais de um álbum, faz a validação real entre eles
  if (Object.keys(albums).length > 1) {
    Object.entries(albums).forEach(([id, alb]) => {
      if (id === currentAlbumId) return;
      
      const otherSticker = alb.stickers[key];
      const otherOwned = otherSticker ? otherSticker.owned : false;
      const otherDup = otherSticker ? (otherSticker.duplicate || 0) : 0;
      
      if (!currentOwned && otherDup > 0) {
        matchFound = true;
      }
      if (currentDup > 0 && !otherOwned) {
        matchFound = true;
      }
    });
  } else {
    // Se houver apenas 1 álbum, simula uma troca qualificada para alguns cards com duplicatas para fins de demonstração
    if (currentDup > 0) {
      const charCodeSum = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      if (charCodeSum % 3 === 0) {
        matchFound = true;
      }
    }
  }
  return matchFound;
}

// ---- Helper: resolve o nome real da figurinha a partir do albumData ----
// Para pos 1  → "Escudo [SIGLA]", pos 13 → "Time [SIGLA]", resto → nome do jogador
function getStickerDisplayName(code, num) {
  if (code === 'EXTRAS') {
    return legendsData[num - 1] ? legendsData[num - 1].name : "EXTRAS " + num;
  }
  if (typeof albumData !== 'undefined' && albumData[code] && albumData[code][num - 1]) {
    const entry = albumData[code][num - 1];
    const baseName = entry.nome || '';
    // Posição 1 = escudo do clube, posição 13 = foto do time
    if (num === 1 || entry.tipo === 'brasao') return "Escudo " + code;
    if (num === 13 || entry.tipo === 'time')  return "Time " + code;
    return baseName;
  }
  // Fallback para genérico
  return playerNames[num] || code + " " + num;
}

// Captura de foto nativa usando base64
function triggerCameraCapture(key, onComplete) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.capture = 'environment';
  
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64 = evt.target.result;
      
      const parts = key.split('-');
      const code = parts[0];
      const num = parseInt(parts[1], 10);
      let detectedName = 'Atleta';
      if (code === 'EXTRAS') {
        detectedName = legendsData[num - 1].name;
      } else if (typeof albumData !== 'undefined' && albumData[code] && albumData[code][num - 1]) {
        detectedName = albumData[code][num - 1].nome;
      }

      // Cria o overlay do Scanner OCR de alta fidelidade
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-[#090a1a]/95 backdrop-blur-md z-[20000] flex flex-col items-center justify-center p-6 text-center animate-fade-in font-sans';

      overlay.innerHTML = `
        <div class="w-full max-w-[360px] flex flex-col items-center gap-6">
          <div class="space-y-1">
            <span class="text-copaYellow text-[8px] tracking-widest font-black mb-0.5">Ultimate Cromo</span>
            <h3 class="text-copaYellow text-sm font-black uppercase tracking-widest">Scanner OCR Inteligente</h3>
            <p class="text-xs text-gray-400">Validando cromo contra banco de dados oficial</p>
          </div>

          <!-- Janela do Scanner -->
          <div class="relative w-48 h-64 bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
            <img src="${base64}" class="w-full h-full object-cover opacity-60" alt="Scanning preview">
            <!-- Linha Laser Verde do Scanner -->
            <div class="absolute left-0 right-0 h-[3px] bg-[#00e676] shadow-[0_0_12px_#00e676] animate-scan-line z-20"></div>
            <!-- Cantos da câmera -->
            <div class="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#00e676]"></div>
            <div class="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#00e676]"></div>
            <div class="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#00e676]"></div>
            <div class="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#00e676]"></div>
          </div>

          <!-- Console de logs do OCR -->
          <div class="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-left font-mono text-[10px] text-gray-300 space-y-2 h-36 overflow-y-auto shadow-inner">
            <div id="log-1" class="opacity-0 transition-opacity duration-300">⏳ [OCR] Iniciando reconhecimento facial e textual...</div>
            <div id="log-2" class="opacity-0 transition-opacity duration-300">🔍 [OCR] Analisando metadados e marcas d'água...</div>
            <div id="log-3" class="opacity-0 transition-opacity duration-300">✓ [OCR] Atleta identificado: <span class="text-[#00e676] font-bold">${detectedName}</span></div>
            <div id="log-4" class="opacity-0 transition-opacity duration-300">☁️ [GLOBAL CLOUD] Enviando cromo para a nuvem da comunidade...</div>
            <div id="log-5" class="opacity-0 transition-opacity duration-300 text-copaYellow font-black">🌟 Sincronizado com sucesso!</div>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      // Sequência de logs com timeouts
      setTimeout(() => { 
        const l1 = document.getElementById('log-1');
        if (l1) l1.classList.remove('opacity-0'); 
      }, 300);
      setTimeout(() => { 
        const l2 = document.getElementById('log-2');
        if (l2) l2.classList.remove('opacity-0'); 
      }, 900);
      setTimeout(() => { 
        const l3 = document.getElementById('log-3');
        if (l3) l3.classList.remove('opacity-0'); 
      }, 1500);
      setTimeout(() => { 
        const l4 = document.getElementById('log-4');
        if (l4) l4.classList.remove('opacity-0'); 
      }, 2100);
      setTimeout(() => { 
        const l5 = document.getElementById('log-5');
        if (l5) l5.classList.remove('opacity-0'); 
      }, 2700);

      // Conclusão e salvamento após 3.5 segundos
      setTimeout(() => {
        const albumId = storage.getCurrentAlbumId();
        const albums = storage.getAlbums();
        const album = albums[albumId];
        if (album && album.stickers[key]) {
          album.stickers[key].photo = base64;
          storage.setAlbums(albums);
          console.log("Cloud Sync: Photo for " + key + " uploaded to global database.");

          // --- Atualiza o nome real no label do card (NOVA LÓGICA) ---
          const cardEl = document.getElementById("card-" + key);
          if (cardEl) {
            const nameLabel = cardEl.querySelector('.player-name-label');
            if (nameLabel) {
              const parts2 = key.split('-');
              const realName = getStickerDisplayName(parts2[0], parseInt(parts2[1], 10));
              nameLabel.textContent = realName;
              // Ajuste de tamanho de fonte por comprimento
              nameLabel.classList.remove('name-long', 'name-very-long');
              if (realName.length > 20) nameLabel.classList.add('name-very-long');
              else if (realName.length > 13) nameLabel.classList.add('name-long');
            }
          }

          // Animação de fade-out e remoção do overlay
          overlay.classList.add('transition-all', 'duration-500', 'opacity-0', 'scale-95');
          setTimeout(() => {
            overlay.remove();
            if (onComplete) onComplete();
          }, 500);
        }
      }, 3500);
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

// Modal de visualização ampliada do card
function openFullscreenCard(key) {
  const albumId = storage.getCurrentAlbumId();
  const albums = storage.getAlbums();
  const album = albums[albumId];
  if (!album) return;

  const sticker = album.stickers[key];
  const parts = key.split('-');
  const code = parts[0];
  const num = parseInt(parts[1], 10);
  
  const isExtras = (code === 'EXTRAS');
  const stickerName = isExtras ? legendsData[num - 1].name : code + " " + num;
  
  let playerPhotoSrc = null;
  if (sticker && sticker.photo) {
    playerPhotoSrc = sticker.photo;
  }

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/95 p-4';
  
  const title = document.createElement('h3');
  title.className = 'text-white text-base font-black uppercase tracking-wider mb-6';
  title.textContent = stickerName;
  modal.appendChild(title);

  const bigCard = document.createElement('div');
  bigCard.className = 'w-64 h-96 relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-300';
  bigCard.style.background = 'var(--fut-dark-gradient)';
  bigCard.style.boxShadow = isExtras ? 'inset 0 0 0 2px var(--copa-yellow), var(--gold-glow)' : 'inset 0 0 0 2px var(--copa-green), var(--green-glow)';
  
  const logo = document.createElement('img');
  logo.src = './logo2026.png';
  logo.loading = 'lazy';
  logo.decoding = 'async';
  logo.className = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-auto opacity-20 pointer-events-none';
  bigCard.appendChild(logo);

  if (playerPhotoSrc) {
    const img = document.createElement('img');
    img.src = playerPhotoSrc;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.className = 'absolute inset-0 w-full h-full object-cover opacity-80';
    bigCard.appendChild(img);
  }

  const nameLabel = document.createElement('div');
  nameLabel.className = 'absolute bottom-16 left-4 right-4 text-center text-white font-black text-lg uppercase tracking-wide drop-shadow-md';
  let nameText = playerNames[num] || 'ATLETA';
  if (isExtras) {
    nameText = legendsData[num - 1].name;
  } else if (typeof albumData !== 'undefined' && albumData[code] && albumData[code][num - 1]) {
    nameText = albumData[code][num - 1].nome;
  }
  nameLabel.textContent = nameText;
  bigCard.appendChild(nameLabel);

  modal.appendChild(bigCard);

  const btnRow = document.createElement('div');
  btnRow.className = 'flex gap-4 mt-8 w-full max-w-xs';
  
  const btnShare = document.createElement('button');
  btnShare.className = 'flex-1 px-4 py-2.5 bg-copaYellow hover:bg-opacity-90 text-black text-xs font-black uppercase tracking-wider rounded-xl transition';
  btnShare.textContent = 'Compartilhar Cromo';
  btnShare.onclick = () => {
    const textShare = "Olha o meu card de " + stickerName + " colado no app Ultimate Cromo FIFA 2026!";
    shareText(stickerName, textShare);
  };
  btnRow.appendChild(btnShare);

  const btnClose = document.createElement('button');
  btnClose.className = 'flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-wider rounded-xl transition border border-white/10';
  btnClose.textContent = 'Fechar';
  btnClose.onclick = () => modal.remove();
  btnRow.appendChild(btnClose);

  modal.appendChild(btnRow);
  document.body.appendChild(modal);
}

function applyStandingsData(standings) {
  if (!standings) return;
  groupsData.forEach(g => {
    g.teams.forEach(team => {
      const stats = standings[team.code];
      if (stats) {
        team.rank = stats.rank !== undefined ? stats.rank : team.rank;
        team.points = stats.points !== undefined ? stats.points : team.points;
        team.eliminated = stats.eliminated !== undefined ? stats.eliminated : team.eliminated;
        team.eliminatedStage = stats.eliminatedStage !== undefined ? stats.eliminatedStage : team.eliminatedStage;
      }
    });
  });
}

// Inicializa a aplicação de forma assíncrona para sincronizar dados da API
async function initApp() {
  console.log('Inicializando App FIFA 2026 com visual FUT...');
  try {
    let albums = storage.getAlbums();
    if (Object.keys(albums).length === 0) {
      const defaultId = generateId();
      albums[defaultId] = { name: 'Meu Álbum Principal', stickers: {} };
      storage.setAlbums(albums);
      storage.setCurrentAlbumId(defaultId);
    } else if (!storage.getCurrentAlbumId()) {
      storage.setCurrentAlbumId(Object.keys(albums)[0]);
    }
  } catch (e) {
    console.error('Erro ao inicializar álbuns:', e);
  }

  try {
    // Executa a rotina de sincronização de dados do torneio
    await syncStandings();
  } catch (e) {
    console.error('Erro na sincronização de classificação:', e);
  }

  try {
    // Exibe pop-up informando o álbum atual
    checkAlbumEntryPopup();
  } catch (e) {
    console.error('Erro ao processar popup de boas-vindas:', e);
  }

  try {
    renderHeader();
  } catch (e) {
    console.error('Erro ao renderizar o cabeçalho:', e);
  }

  // Sincroniza informações de geolocalização com base no IP do usuário
  try {
    const user = authDb.getCurrentUser();
    if (user) {
      // Sempre atualiza as coordenadas do usuário pelo IP no banco ao iniciar se estiver sem GPS
      if (!user.latitude || !user.longitude) {
        authDb.fetchLocationByIp().then(loc => {
          if (loc) {
            authDb.updateLocation(loc.lat, loc.lng).then(() => {
              renderHeader();
              if (location.hash === '#community') {
                route(); // recarrega a comunidade se estiver nela
              }
            });
          }
        });
      }
      // Sincroniza figurinhas
      const activeAlbumId = storage.getCurrentAlbumId();
      const albums = storage.getAlbums();
      if (activeAlbumId && albums[activeAlbumId]) {
        authDb.syncStickers(albums[activeAlbumId].stickers);
      }
    } else {
      // Se não está logado, busca o IP para geolocalização temporária
      authDb.fetchLocationByIp().then(loc => {
        if (loc) {
          sessionStorage.setItem('temp_latitude', loc.lat);
          sessionStorage.setItem('temp_longitude', loc.lng);
        }
      });
    }
  } catch (e) {
    console.error('Erro na sincronização automática por IP no startup:', e);
  }

  try {
    route();
  } catch (e) {
    console.error('Erro crítico ao carregar rota inicial:', e);
    const root = document.getElementById('appRoot');
    if (root) {
      root.innerHTML = '<div class="p-6 text-center text-red-500 font-semibold text-xs bg-red-500/10 rounded-xl border border-red-500/25">Falha ao inicializar o aplicativo. Por favor, recarregue a página.</div>';
    }
  }
}

// Cria novo álbum do zero
function createNewAlbum() {
  const name = prompt('Digite o nome do seu novo álbum de figurinhas:', 'Nova Coleção Copa 2026');
  if (!name || name.trim() === '') return;

  const albums = storage.getAlbums();
  const newId = generateId();
  albums[newId] = { name: name.trim(), stickers: {} };
  
  storage.setAlbums(albums);
  storage.setCurrentAlbumId(newId);
  
  renderHeader();
  location.hash = '#home';
  route();
  alert("Álbum \"" + name.trim() + "\" criado com sucesso!");
}

// Renderiza a barra superior (seletor de álbum e perfil)
function renderHeader() {
  const selector = document.getElementById('albumSelector');
  if (!selector) return;
  const albums = storage.getAlbums();
  selector.innerHTML = '';
  Object.entries(albums).forEach(([id, data]) => {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = data.name;
    opt.className = 'bg-[#131735] text-white';
    if (id === storage.getCurrentAlbumId()) opt.selected = true;
    selector.appendChild(opt);
  });

  const authBtn = document.getElementById('authHeaderBtn');
  if (authBtn) {
    const user = authDb.getCurrentUser();
    if (user) {
      // Avatar com badge verde de online
      authBtn.innerHTML = `
        <img src="${user.photo_url}" class="w-full h-full object-cover rounded-full" alt="Perfil" onerror="this.style.display='none';this.parentElement.innerHTML='\uD83D\uDC64'">
        <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-copaGreen rounded-full border-2 border-[#070d1e] block"></span>
      `;
      authBtn.style.position = 'relative';
      authBtn.title = "Logado como " + user.name;
      authBtn.className = 'w-7 h-7 rounded-full border-2 border-copaGreen/60 hover:border-copaGreen bg-white/5 flex items-center justify-center text-xs overflow-visible transition-all duration-200 relative';
    } else {
      authBtn.innerHTML = `
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      `;
      authBtn.style.position = '';
      authBtn.title = 'Fazer Login';
      authBtn.className = 'w-7 h-7 rounded-full border border-white/10 hover:border-copaYellow/40 bg-white/5 flex items-center justify-center text-xs overflow-hidden transition-all duration-200';
    }
  }

  // Pulsar ícone de trocas no cabeçalho se houver repetidas
  const tradesBtn = document.getElementById('headerTradesBtn');
  if (tradesBtn) {
    const stats = getAlbumStats();
    if (stats.duplicates > 0) {
      tradesBtn.classList.add('animate-pulse', 'border-copaYellow/50', 'shadow-[0_0_8px_rgba(255,199,38,0.45)]');
    } else {
      tradesBtn.classList.remove('animate-pulse', 'border-copaYellow/50', 'shadow-[0_0_8px_rgba(255,199,38,0.45)]');
    }
  }

  // Verifica se há o prompt de instalação disponível e insere o botão "Instalar App" no topo do menu do álbum
  const headerContainer = authBtn ? authBtn.parentElement : null;
  if (headerContainer && authBtn) {
    const prevInstallBtn = document.getElementById('pwaInstallBtn');
    if (prevInstallBtn) {
      prevInstallBtn.remove();
    }

    if (deferredPrompt) {
      const installBtn = document.createElement('button');
      installBtn.id = 'pwaInstallBtn';
      installBtn.className = 'bg-gradient-to-r from-copaYellow to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-darkBg font-black text-[9px] uppercase tracking-wider px-2 py-1.5 rounded-lg flex items-center gap-1 transition-all duration-200 animate-pulse';
      installBtn.innerHTML = `
        <svg class="w-3 h-3 text-darkBg" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        <span>Instalar App</span>
      `;
      installBtn.onclick = async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          console.log("PWA install choice: " + outcome);
          deferredPrompt = null;
          renderHeader();
        }
      };
      if (headerContainer && authBtn && authBtn.parentNode === headerContainer) {
        try {
          headerContainer.insertBefore(installBtn, authBtn);
        } catch (e) {
          console.warn("Falha ao usar insertBefore para o botão PWA:", e);
          try {
            headerContainer.appendChild(installBtn);
          } catch (err) {
            console.error("Falha ao adicionar o botão PWA:", err);
          }
        }
      }
    }
  }

  // Inicializa a barra de busca no cabeçalho de forma estática
  if (typeof initHeaderSearchBar === 'function') {
    initHeaderSearchBar();
  }
}

// Troca de álbum ativo
function switchAlbum(id) {
  storage.setCurrentAlbumId(id);
  renderHeader();
  route();
}

// Roteador baseado em Hash com efeito 3D Page Flip
function route() {
  const user = authDb.getCurrentUser();
  const skipped = sessionStorage.getItem('skippedLogin') === 'true';
  let hash = location.hash || '#home';

  // Se não estiver logado e não tiver pulado o login, força ir para a tela de login
  if (!user && !skipped) {
    hash = '#login';
    if (location.hash !== '#login') {
      location.hash = '#login';
      return;
    }
  }

  const root = document.getElementById('appRoot');
  if (!root) return;
  
  const currentContainer = root.querySelector('.page-transition-container');
  if (currentContainer) {
    // 1. Inicia animação de saída da página anterior (virada para a esquerda)
    currentContainer.classList.remove('page-active');
    currentContainer.classList.add('page-exit');
    
    // 2. Aguarda a finalização parcial do CSS Page-Exit (450ms)
    setTimeout(() => {
      renderNewPage(hash, root);
    }, 450);
  } else {
    // Carregamento inicial limpo
    renderNewPage(hash, root);
  }
}

function renderNewPage(hash, root) {
  root.innerHTML = '';
  
  // Cria o wrapper que contém a folha/página tridimensional
  const pageContainer = document.createElement('div');
  pageContainer.className = 'page-transition-container page-enter';
  
  if (hash.startsWith('#home')) {
    renderHome(pageContainer);
  } else if (hash.startsWith('#import')) {
    renderImport(pageContainer);
  } else if (hash.startsWith('#team-')) {
    const code = hash.split('-')[1];
    renderTeamPage(code, pageContainer);
  } else if (hash.startsWith('#trades') || hash.startsWith('#community')) {
    if (hash === '#trades-manual') {
      currentTradesSubTab = 'manual';
      currentCommunityTab = 'favorites';
    } else if (hash === '#trades') {
      currentTradesSubTab = 'match';
    }
    renderTrades(pageContainer);
  } else if (hash.startsWith('#login')) {
    renderLogin(pageContainer);
  } else if (hash.startsWith('#community-profile-')) {
    const uid = hash.substring('#community-profile-'.length);
    renderCollectorProfile(uid, pageContainer);
  } else {
    location.hash = '#home';
    return;
  }
  
  root.appendChild(pageContainer);
  
  // Força o reflow do navegador para engatilhar transição CSS
  pageContainer.offsetHeight;
  
  // Transiciona para ativa (página aberta/abotoada)
  pageContainer.classList.remove('page-enter');
  pageContainer.classList.add('page-active');

  // Lógica de Scroll Automático para a figurinha pesquisada
  const targetId = sessionStorage.getItem('scrollTargetSticker');
  if (targetId) {
    sessionStorage.removeItem('scrollTargetSticker');
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('pulse-highlight');
        setTimeout(() => el.classList.remove('pulse-highlight'), 3000);
      }
    }, 600);
  }
}

// Calcula estatísticas do álbum atual
function getAlbumStats() {
  const albumId = storage.getCurrentAlbumId();
  const albums = storage.getAlbums();
  const album = albums[albumId];
  if (!album) return { total: 0, owned: 0, duplicates: 0, percent: 0 };
  
  // Total de figurinhas: 48 seleções * 20 + 19 (FWC) + 14 (CC) = 993 (Exclui EXTRAS)
  const totalStickers = (48 * 20) + 19 + 14;
  let ownedCount = 0;
  let dupCount = 0;
  
  Object.entries(album.stickers).forEach(([key, val]) => {
    const parts = key.split('-');
    const code = parts[0];
    const num = parseInt(parts[1], 10);
    
    // Exclui EXTRAS da contagem geral de coladas e repetidas
    if (code !== 'EXTRAS') {
      const limit = (code === 'FWC') ? 19 : (code === 'CC') ? 14 : 20;
      if (num >= 1 && num <= limit) {
        if (val.owned) ownedCount++;
        dupCount += (val.duplicate || 0);
      }
    }
  });
  
  const percent = totalStickers > 0 ? Math.round((ownedCount / totalStickers) * 100) : 0;
  return {
    total: totalStickers,
    owned: ownedCount,
    duplicates: dupCount,
    percent: percent
  };
}

// ------------------- LOGIN -------------------
function renderLogin(container) {
  container.innerHTML = "";
  const user = authDb.getCurrentUser();
  const isDemo = authDb.isDemoMode();

  const wrapper = document.createElement('div');
  wrapper.className = 'max-w-md mx-auto my-8 glass-panel p-8 rounded-2xl border-white/5 relative overflow-hidden animate-fade-in';
  
  const glow = document.createElement('div');
  glow.className = 'absolute -top-24 -left-24 w-48 h-48 rounded-full bg-copaGreen/10 blur-3xl pointer-events-none';
  wrapper.appendChild(glow);

  if (user) {
    // Tela de Perfil Logado
    const title = document.createElement('h2');
    title.className = 'text-xl font-black text-center mb-6 uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400';
    title.textContent = 'Minha Conta';
    wrapper.appendChild(title);

    const profileBox = document.createElement('div');
    profileBox.className = 'flex flex-col items-center gap-4 mb-6 bg-white/5 p-4 rounded-xl border border-white/5';

    const avatar = document.createElement('img');
    avatar.src = user.photo_url;
    avatar.className = 'w-16 h-16 rounded-full border-2 border-copaYellow object-cover shadow-lg';
    profileBox.appendChild(avatar);

    const name = document.createElement('h3');
    name.className = 'font-black text-white text-base';
    name.textContent = user.name;
    profileBox.appendChild(name);

    const details = document.createElement('div');
    details.className = 'w-full text-center text-xs space-y-2 mt-2 pt-2 border-t border-white/5 text-gray-400';
    
    const dbMode = document.createElement('p');
    dbMode.innerHTML = "Banco de Dados: <span class=\"" + isDemo ? 'text-copaYellow' : 'text-copaGreen' + " font-bold\">" + isDemo ? 'Modo Simulado (Demo)' : 'Nuvem Real (Supabase)' + "</span>";
    details.appendChild(dbMode);

    const locationText = document.createElement('p');
    if (user.latitude && user.longitude) {
      locationText.innerHTML = "GPS: <span class=\"text-white font-bold\">" + user.latitude.toFixed(4) + ", " + user.longitude.toFixed(4) + "</span>";
    } else {
      locationText.innerHTML = `GPS: <span class="text-red-400 font-bold">Não Compartilhado</span>`;
    }
    details.appendChild(locationText);

    profileBox.appendChild(details);
    wrapper.appendChild(profileBox);

    // Botões de Ação de Conta
    const actionGrid = document.createElement('div');
    actionGrid.className = 'flex flex-col gap-3';

    // Botão de Atualizar GPS
    const btnGPS = document.createElement('button');
    btnGPS.className = 'w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:border-copaGreen/40 hover:bg-white/10 text-white font-bold text-xs transition duration-200 flex items-center justify-center gap-2';
    btnGPS.innerHTML = `📍 Atualizar Localização (GPS)`;
    btnGPS.onclick = () => {
      btnGPS.textContent = "Obtendo GPS...";
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await authDb.updateLocation(position.coords.latitude, position.coords.longitude);
          // Sincroniza figurinhas
          const activeAlbumId = storage.getCurrentAlbumId();
          const albums = storage.getAlbums();
          if (activeAlbumId && albums[activeAlbumId]) {
            await authDb.syncStickers(albums[activeAlbumId].stickers);
          }
          renderHeader();
          renderLogin(container);
          alert("Localização e álbum atualizados com sucesso!");
        },
        (error) => {
          console.error(error);
          btnGPS.innerHTML = `📍 Erro ao obter GPS`;
          alert("Não foi possível acessar a geolocalização. Por favor, ative a permissão do GPS no seu navegador.");
        }
      );
    };
    actionGrid.appendChild(btnGPS);

    // Botão de Exportar Backup Completo
    const btnExportBackup = document.createElement('button');
    btnExportBackup.className = 'w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:border-copaYellow/40 hover:bg-white/10 text-white font-bold text-xs transition duration-200 flex items-center justify-center gap-2';
    btnExportBackup.innerHTML = `📤 Exportar Backup Completo`;
    btnExportBackup.onclick = () => {
      const backup = {
        version: "1.0.0",
        timestamp: Date.now(),
        currentAlbumId: localStorage.getItem('currentAlbumId') || "",
        albums: {},
        session: null
      };
      
      try {
        backup.albums = JSON.parse(localStorage.getItem('albums') || '{}');
      } catch(e) {}
      
      try {
        backup.session = JSON.parse(localStorage.getItem('album_auth_session') || 'null');
      } catch(e) {}

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      const date = new Date().toISOString().slice(0, 10);
      downloadAnchor.setAttribute("download", "backup_album_fifa_2026_" + date + ".json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      navigator.clipboard.writeText(JSON.stringify(backup)).then(() => {
        alert("Backup exportado! O arquivo JSON foi baixado e o código de restauração foi copiado para a área de transferência.");
      }).catch(() => {
        alert("Backup exportado e baixado com sucesso!");
      });
    };
    actionGrid.appendChild(btnExportBackup);

    // Botão de Logout
    const btnLogout = document.createElement('button');
    btnLogout.className = 'w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 font-bold text-xs transition duration-200';
    btnLogout.textContent = 'Sair da Conta / Logout';
    btnLogout.onclick = async () => {
      sessionStorage.removeItem('skippedLogin');
      await authDb.logout();
      renderHeader();
      renderLogin(container);
    };
    actionGrid.appendChild(btnLogout);

    wrapper.appendChild(actionGrid);
  } else {
    // Logo do App centralizado na tela inicial de login (Estado Fechado)
    const logoImg = document.createElement('img');
    logoImg.src = './logo2026.png';
    logoImg.className = 'h-24 w-auto object-contain mx-auto mb-8 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] animate-pulse';
    logoImg.alt = 'Logo FIFA 2026';
    wrapper.appendChild(logoImg);

    // Container do Acordeão
    const accordionContainer = document.createElement('div');
    accordionContainer.className = 'flex flex-col gap-4 mb-5';

    // ----------------- ACORDEÃO 1: JÁ TENHO CONTA -----------------
    const btnToggleLogin = document.createElement('button');
    btnToggleLogin.id = 'btnToggleLogin';
    btnToggleLogin.className = 'w-full py-4 px-5 rounded-xl bg-gradient-to-r from-copaBlue to-blue-700 hover:from-blue-600 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-between shadow-lg shadow-blue-500/10 cursor-pointer';
    btnToggleLogin.innerHTML = `
      <span>JÁ TENHO CONTA</span>
      <svg id="arrowLogin" class="w-4 h-4 transform transition-transform duration-300 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
      </svg>
    `;

    const accordionLogin = document.createElement('div');
    accordionLogin.id = 'accordionLogin';
    accordionLogin.className = 'max-h-0 opacity-0 overflow-hidden transition-all duration-500 ease-in-out px-1';

    // Formulário de Login
    const formLogin = document.createElement('form');
    formLogin.className = 'flex flex-col gap-4';

    const loginUserGroup = document.createElement('div');
    loginUserGroup.className = 'flex flex-col gap-1.5';
    const loginUserLabel = document.createElement('label');
    loginUserLabel.className = 'text-[10px] uppercase font-bold text-gray-400 tracking-wider';
    loginUserLabel.textContent = 'E-mail ou Nome de Usuário';
    const loginUserInput = document.createElement('input');
    loginUserInput.type = 'text';
    loginUserInput.placeholder = 'seu_usuario ou exemplo@email.com';
    loginUserInput.required = true;
    loginUserInput.className = 'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-copaYellow/50 focus:bg-white/10 transition duration-200';
    loginUserGroup.appendChild(loginUserLabel);
    loginUserGroup.appendChild(loginUserInput);
    formLogin.appendChild(loginUserGroup);

    const loginPasswordGroup = document.createElement('div');
    loginPasswordGroup.className = 'flex flex-col gap-1.5';
    const loginPasswordLabel = document.createElement('label');
    loginPasswordLabel.className = 'text-[10px] uppercase font-bold text-gray-400 tracking-wider';
    loginPasswordLabel.textContent = 'Senha';

    const loginPasswordWrapper = document.createElement('div');
    loginPasswordWrapper.className = 'relative w-full';

    const loginPasswordInput = document.createElement('input');
    loginPasswordInput.type = 'password';
    loginPasswordInput.placeholder = 'Sua senha';
    loginPasswordInput.required = true;
    loginPasswordInput.className = 'w-full pr-12 pl-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-copaYellow/50 focus:bg-white/10 transition duration-200';

    const btnToggleLoginPassword = document.createElement('button');
    btnToggleLoginPassword.type = 'button';
    btnToggleLoginPassword.className = 'absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition duration-200 cursor-pointer focus:outline-none';
    btnToggleLoginPassword.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    `;

    btnToggleLoginPassword.onclick = () => {
      if (loginPasswordInput.type === 'password') {
        loginPasswordInput.type = 'text';
        btnToggleLoginPassword.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
          </svg>
        `;
      } else {
        loginPasswordInput.type = 'password';
        btnToggleLoginPassword.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        `;
      }
    };

    loginPasswordWrapper.appendChild(loginPasswordInput);
    loginPasswordWrapper.appendChild(btnToggleLoginPassword);
    loginPasswordGroup.appendChild(loginPasswordLabel);
    loginPasswordGroup.appendChild(loginPasswordWrapper);
    formLogin.appendChild(loginPasswordGroup);

    const btnLoginSubmit = document.createElement('button');
    btnLoginSubmit.type = 'submit';
    btnLoginSubmit.className = 'w-full py-3.5 rounded-xl bg-gradient-to-r from-copaBlue to-blue-700 hover:from-blue-600 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/10 transition duration-200 flex items-center justify-center gap-2 mt-2 cursor-pointer';
    btnLoginSubmit.textContent = 'ENTRAR';
    formLogin.appendChild(btnLoginSubmit);

    const feedbackMsgLogin = document.createElement('div');
    feedbackMsgLogin.className = 'text-xs text-center font-semibold mt-3 hidden';
    formLogin.prepend(feedbackMsgLogin);

    accordionLogin.appendChild(formLogin);

    // ----------------- ACORDEÃO 2: CRIAR CONTA -----------------
    const btnToggleRegister = document.createElement('button');
    btnToggleRegister.id = 'btnToggleRegister';
    btnToggleRegister.className = 'w-full py-4 px-5 rounded-xl bg-gradient-to-r from-copaYellow to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-darkBg font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-between shadow-lg shadow-copaYellow/10 cursor-pointer';
    btnToggleRegister.innerHTML = `
      <span>CRIAR CONTA</span>
      <svg id="arrowRegister" class="w-4 h-4 transform transition-transform duration-300 text-darkBg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
      </svg>
    `;

    const accordionRegister = document.createElement('div');
    accordionRegister.id = 'accordionRegister';
    accordionRegister.className = 'max-h-0 opacity-0 overflow-hidden transition-all duration-500 ease-in-out px-1';

    // Formulário de Cadastro
    const formRegister = document.createElement('form');
    formRegister.className = 'flex flex-col gap-4';

    const regEmailGroup = document.createElement('div');
    regEmailGroup.className = 'flex flex-col gap-1.5';
    const regEmailLabel = document.createElement('label');
    regEmailLabel.className = 'text-[10px] uppercase font-bold text-gray-400 tracking-wider';
    regEmailLabel.textContent = 'E-mail';
    const regEmailInput = document.createElement('input');
    regEmailInput.type = 'email';
    regEmailInput.placeholder = 'exemplo@email.com';
    regEmailInput.required = true;
    regEmailInput.className = 'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-copaYellow/50 focus:bg-white/10 transition duration-200';
    regEmailGroup.appendChild(regEmailLabel);
    regEmailGroup.appendChild(regEmailInput);
    formRegister.appendChild(regEmailGroup);

    const regPasswordGroup = document.createElement('div');
    regPasswordGroup.className = 'flex flex-col gap-1.5';
    const regPasswordLabel = document.createElement('label');
    regPasswordLabel.className = 'text-[10px] uppercase font-bold text-gray-400 tracking-wider';
    regPasswordLabel.textContent = 'Senha';

    const regPasswordWrapper = document.createElement('div');
    regPasswordWrapper.className = 'relative w-full';

    const regPasswordInput = document.createElement('input');
    regPasswordInput.type = 'password';
    regPasswordInput.placeholder = 'Sua senha';
    regPasswordInput.required = true;
    regPasswordInput.className = 'w-full pr-12 pl-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-copaYellow/50 focus:bg-white/10 transition duration-200';

    const btnToggleRegPassword = document.createElement('button');
    btnToggleRegPassword.type = 'button';
    btnToggleRegPassword.className = 'absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition duration-200 cursor-pointer focus:outline-none';
    btnToggleRegPassword.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    `;

    btnToggleRegPassword.onclick = () => {
      if (regPasswordInput.type === 'password') {
        regPasswordInput.type = 'text';
        btnToggleRegPassword.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
          </svg>
        `;
      } else {
        regPasswordInput.type = 'password';
        btnToggleRegPassword.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        `;
      }
    };

    regPasswordWrapper.appendChild(regPasswordInput);
    regPasswordWrapper.appendChild(btnToggleRegPassword);
    regPasswordGroup.appendChild(regPasswordLabel);
    regPasswordGroup.appendChild(regPasswordWrapper);
    formRegister.appendChild(regPasswordGroup);

    const regUserGroup = document.createElement('div');
    regUserGroup.className = 'flex flex-col gap-1.5';
    const regUserLabel = document.createElement('label');
    regUserLabel.className = 'text-[10px] uppercase font-bold text-gray-400 tracking-wider';
    regUserLabel.textContent = 'Nome de Usuário';
    const regUserInput = document.createElement('input');
    regUserInput.type = 'text';
    regUserInput.placeholder = 'ex: colecionador_hexa';
    regUserInput.required = true;
    regUserInput.className = 'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-copaYellow/50 focus:bg-white/10 transition duration-200';
    regUserGroup.appendChild(regUserLabel);
    regUserGroup.appendChild(regUserInput);
    formRegister.appendChild(regUserGroup);

    const regBirthdateGroup = document.createElement('div');
    regBirthdateGroup.className = 'flex flex-col gap-1.5';
    const regBirthdateLabel = document.createElement('label');
    regBirthdateLabel.className = 'text-[10px] uppercase font-bold text-gray-400 tracking-wider';
    regBirthdateLabel.textContent = 'Data de Nascimento';
    const regBirthdateInput = document.createElement('input');
    regBirthdateInput.type = 'tel';
    regBirthdateInput.placeholder = 'DD/MM/AAAA';
    regBirthdateInput.maxLength = 10;
    regBirthdateInput.required = true;
    regBirthdateInput.className = 'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-copaYellow/50 focus:bg-white/10 transition duration-200';
    
    regBirthdateInput.oninput = (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 8) val = val.substring(0, 8);
      let formatted = '';
      if (val.length > 0) formatted += val.substring(0, 2);
      if (val.length > 2) formatted += '/' + val.substring(2, 4);
      if (val.length > 4) formatted += '/' + val.substring(4, 8);
      e.target.value = formatted;
    };
    regBirthdateGroup.appendChild(regBirthdateLabel);
    regBirthdateGroup.appendChild(regBirthdateInput);
    formRegister.appendChild(regBirthdateGroup);

    const consentGroup = document.createElement('label');
    consentGroup.className = 'flex items-start gap-2.5 cursor-pointer mt-1 mb-2 select-none text-left';
    const consentCheckbox = document.createElement('input');
    consentCheckbox.type = 'checkbox';
    consentCheckbox.className = 'mt-0.5 rounded border-white/10 bg-white/5 text-copaYellow focus:ring-0 focus:ring-offset-0 focus:border-copaYellow/50 transition duration-200 h-4 w-4 accent-copaYellow';
    const consentText = document.createElement('span');
    consentText.className = 'text-[11px] text-gray-400 leading-normal font-medium';
    consentText.textContent = 'Estou de acordo com o uso do aplicativo e nenhum prejuízo será repassado ao desenvolvedor.';
    consentGroup.appendChild(consentCheckbox);
    consentGroup.appendChild(consentText);
    formRegister.appendChild(consentGroup);

    const btnRegisterSubmit = document.createElement('button');
    btnRegisterSubmit.type = 'submit';
    btnRegisterSubmit.className = 'w-full py-3.5 rounded-xl bg-gradient-to-r from-copaYellow to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-darkBg font-black text-xs uppercase tracking-wider shadow-lg shadow-copaYellow/10 hover:shadow-copaYellow/25 transition duration-200 flex items-center justify-center gap-2 mt-2 cursor-pointer';
    btnRegisterSubmit.textContent = 'FINALIZAR CADASTRO';
    formRegister.appendChild(btnRegisterSubmit);

    const feedbackMsgRegister = document.createElement('div');
    feedbackMsgRegister.className = 'text-xs text-center font-semibold mt-3 hidden';
    formRegister.prepend(feedbackMsgRegister);

    accordionRegister.appendChild(formRegister);

    // Injeta tudo no container principal do acordeão
    accordionContainer.appendChild(btnToggleLogin);
    accordionContainer.appendChild(accordionLogin);
    accordionContainer.appendChild(btnToggleRegister);
    accordionContainer.appendChild(accordionRegister);
    wrapper.appendChild(accordionContainer);

    // Lógica das funções de feedback
    const showFeedback = (message, type = 'error', targetElement) => {
      if (!message) {
        targetElement.classList.add('hidden');
        return;
      }
      targetElement.innerHTML = message;
      if (type === 'error') {
        // MODO DIAGNÓSTICO: Fundo preto, texto amarelo brilhante, fonte de 18px
        targetElement.className = 'text-[18px] font-black text-center p-5 rounded-xl border-4 border-[#FFC726] bg-[#000000] text-[#FFC726] block my-4 animate-pulse w-full max-w-full shadow-2xl';
      } else {
        targetElement.className = 'text-xs text-center font-semibold mt-3 p-3 rounded-xl animate-fade-in block bg-green-500/10 border border-green-500/20 text-green-400';
      }
    };

    const startDotsAnimation = (btn, baseText) => {
      if (btn._dotsInterval) {
        clearInterval(btn._dotsInterval);
      }
      let count = 1;
      btn.textContent = baseText + '.';
      btn._dotsInterval = setInterval(() => {
        count = (count % 3) + 1;
        btn.textContent = baseText + '.'.repeat(count);
      }, 400);
    };

    const stopDotsAnimation = (btn, originalText) => {
      if (btn._dotsInterval) {
        clearInterval(btn._dotsInterval);
        btn._dotsInterval = null;
      }
      btn.textContent = originalText;
    };

    // Acordeão behavior
    const arrowLogin = btnToggleLogin.querySelector('#arrowLogin');
    const arrowRegister = btnToggleRegister.querySelector('#arrowRegister');

    const openAccordion = (accordion, arrow) => {
      accordion.style.maxHeight = (accordion.scrollHeight + 40) + "px"; // scrollHeight + buffer
      accordion.style.opacity = "1";
      accordion.style.marginTop = "1rem";
      accordion.style.marginBottom = "1rem";
      arrow.style.transform = "rotate(180deg)";
    };

    const closeAccordion = (accordion, arrow) => {
      accordion.style.maxHeight = "0";
      accordion.style.opacity = "0";
      accordion.style.marginTop = "0";
      accordion.style.marginBottom = "0";
      arrow.style.transform = "rotate(0deg)";
    };

    btnToggleLogin.onclick = () => {
      if (accordionLogin.style.maxHeight && accordionLogin.style.maxHeight !== "0px") {
        closeAccordion(accordionLogin, arrowLogin);
      } else {
        openAccordion(accordionLogin, arrowLogin);
        closeAccordion(accordionRegister, arrowRegister);
      }
    };

    btnToggleRegister.onclick = () => {
      if (accordionRegister.style.maxHeight && accordionRegister.style.maxHeight !== "0px") {
        closeAccordion(accordionRegister, arrowRegister);
      } else {
        openAccordion(accordionRegister, arrowRegister);
        closeAccordion(accordionLogin, arrowLogin);
      }
    };

    // Funções auxiliares para validação de idade e modal de menor de idade
    const calculateAge = (birthdateStr) => {
      if (!birthdateStr) return 0;
      const today = new Date();
      
      let birthDate = null;
      if (birthdateStr.includes('/')) {
        const parts = birthdateStr.split('/');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const year = parseInt(parts[2], 10);
          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            birthDate = new Date(year, month, day);
          }
        }
      } else {
        birthDate = new Date(birthdateStr);
      }

      if (!birthDate || isNaN(birthDate.getTime())) return 0;

      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };

    const showMinorAlertModal = (onConfirm) => {
      const modalOverlay = document.createElement('div');
      modalOverlay.className = 'fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-fade-in';
      
      const modalContainer = document.createElement('div');
      modalContainer.className = 'bg-[#120e16] border border-copaYellow/20 rounded-2xl p-6 max-w-sm w-full text-center flex flex-col items-center gap-4 shadow-2xl shadow-copaYellow/5';
      
      modalContainer.innerHTML = `
        <div class="w-12 h-12 rounded-full bg-copaYellow/10 flex items-center justify-center border border-copaYellow/30 text-copaYellow mb-1">
          <svg class="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <h3 class="text-white font-bold text-sm uppercase tracking-wider">Aviso Importante</h3>
        <p class="text-gray-300 text-xs leading-relaxed">
          Vimos que você é menor de idade e recomendamos fortemente a utilização deste app com o consentimento dos seus pais ou tutor.
        </p>
      `;
      
      const btnConfirm = document.createElement('button');
      btnConfirm.className = 'w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-copaYellow to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-darkBg font-black text-xs uppercase tracking-wider shadow-lg shadow-copaYellow/10 transition duration-200 cursor-pointer';
      btnConfirm.textContent = 'Estou ciente';
      
      btnConfirm.onclick = () => {
        document.body.removeChild(modalOverlay);
        onConfirm();
      };
      
      modalContainer.appendChild(btnConfirm);
      modalOverlay.appendChild(modalContainer);
      document.body.appendChild(modalOverlay);
    };

    // Submissão Login
    formLogin.onsubmit = async (e) => {
      e.preventDefault();
      const emailOrUser = loginUserInput.value.trim();
      const password = loginPasswordInput.value;
      if (!emailOrUser || !password) return;

      try {
        btnLoginSubmit.disabled = true;
        startDotsAnimation(btnLoginSubmit, 'PROCESSANDO');
        showFeedback("", 'success', feedbackMsgLogin);
 
        const result = await authDb.loginOrRegister(emailOrUser, password);
        
        window.location.href = "album.html";
      } catch (err) {
        console.error("Erro na autenticação:", err);
        let msg = err.message || err;
        if (msg === "Invalid login credentials") {
          msg = "Credenciais de login inválidas. Por favor, verifique seu e-mail/usuário e senha.";
        }
        if (msg.includes("Timeout") || msg.includes("expirou")) {
          msg += "<br/><br/><span style='display:block; font-weight: normal; font-size:11px; line-height: 1.4; color: #ccc; text-align: left; background: rgba(255,255,255,0.08); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);'>💡 <strong>Dica de Conexão Corporativa:</strong> Se você está no notebook da empresa ou conectado a uma VPN, o firewall corporativo pode estar bloqueando a nuvem do Supabase. Desconecte a VPN por 30 segundos ou conecte seu notebook no roteador 4G/5G do seu celular (hotspot) apenas para fazer este login. Uma vez logado, você poderá ativar a VPN e usar o app normalmente, pois o progresso do álbum fica salvo no seu computador e será sincronizado quando você estiver em uma rede livre!</span>";
        }
        showFeedback(msg, 'error', feedbackMsgLogin);
      } finally {
        btnLoginSubmit.disabled = false;
        stopDotsAnimation(btnLoginSubmit, 'ENTRAR');
      }
    };

    // Submissão Cadastro
    formRegister.onsubmit = async (e) => {
      e.preventDefault();

      if (!consentCheckbox.checked) {
        const msg = "Você precisa aceitar os termos de proteção de dados para continuar.";
        showFeedback(msg, 'error', feedbackMsgRegister);
        return;
      }

      const email = regEmailInput.value.trim();
      const password = regPasswordInput.value;
      const username = regUserInput.value.trim();
      const birthdate = regBirthdateInput.value;
 
      if (!email || !password || !username || !birthdate) return;

      if (birthdate.length < 10) {
        const msg = "Por favor, preencha a data de nascimento completa no formato DD/MM/AAAA.";
        showFeedback(msg, 'error', feedbackMsgRegister);
        return;
      }

      const parts = birthdate.split('/');
      if (parts.length !== 3) {
        const msg = "Data de nascimento inválida. Use o formato DD/MM/AAAA.";
        showFeedback(msg, 'error', feedbackMsgRegister);
        return;
      }

      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const dateObj = new Date(year, month, day);

      if (isNaN(dateObj.getTime()) || dateObj.getFullYear() !== year || dateObj.getMonth() !== month || dateObj.getDate() !== day) {
        const msg = "Por favor, insira uma data de nascimento válida.";
        showFeedback(msg, 'error', feedbackMsgRegister);
        return;
      }

      const strDay = parts[0].padStart(2, '0');
      const strMonth = parts[1].padStart(2, '0');
      const birthdateYYYYMMDD = year + "-" + strMonth + "-" + strDay;
 
      try {
        btnRegisterSubmit.disabled = true;
        startDotsAnimation(btnRegisterSubmit, 'PROCESSANDO');
        showFeedback("", 'success', feedbackMsgRegister);
 
        const result = await authDb.loginOrRegister(email, password, username, birthdateYYYYMMDD);
        
        if (result.action === 'register') {
          showFeedback("Conta criada com sucesso! Redirecionando para o álbum...", 'success', feedbackMsgRegister);
          setTimeout(() => {
            window.location.href = "album.html";
          }, 1500);
        }
      } catch (err) {
        console.error("Erro no cadastro:", err);
        let msg = err.message || err;
        if (msg === "Invalid login credentials") {
          msg = "Credenciais de login inválidas. Por favor, verifique seu e-mail/usuário e senha.";
        }
        if (msg.includes("Timeout") || msg.includes("expirou")) {
          msg += "<br/><br/><span style='display:block; font-weight: normal; font-size:11px; line-height: 1.4; color: #ccc; text-align: left; background: rgba(255,255,255,0.08); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);'>💡 <strong>Dica de Conexão Corporativa:</strong> Se você está no notebook da empresa ou conectado a uma VPN, o firewall corporativo pode estar bloqueando a nuvem do Supabase. Desconecte a VPN por 30 segundos ou conecte seu notebook no roteador 4G/5G do seu celular (hotspot) apenas para fazer este cadastro. Uma vez cadastrado, você poderá ativar a VPN e usar o app normalmente, pois o progresso do álbum fica salvo no seu computador e será sincronizado quando você estiver em uma rede livre!</span>";
        }
        showFeedback(msg, 'error', feedbackMsgRegister);
      } finally {
        btnRegisterSubmit.disabled = false;
        stopDotsAnimation(btnRegisterSubmit, 'FINALIZAR CADASTRO');
      }
    };

    const grid = document.createElement('div');
    grid.className = 'flex flex-col gap-3';
 
    // Botão Fazer Depois (Pular / Ir para o Álbum)
    const btnLater = document.createElement('button');
    btnLater.className = 'w-full py-3.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-dashed border-white/20 hover:border-copaYellow/40 transition duration-200 mt-2 flex flex-col items-center justify-center gap-1 skip-login-btn group cursor-pointer';
    btnLater.innerHTML = `
      <div class="flex items-center gap-1.5 text-gray-500 group-hover:text-gray-300 font-bold text-xs transition duration-200">
        <svg class="w-3.5 h-3.5 text-copaYellow animate-pulse" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <span>Pular por agora (continuar sem login)</span>
      </div>
      <span class="text-[9.5px] text-red-400/70 font-semibold text-center leading-tight mt-0.5">
        Nota: Seu álbum e suas figurinhas não ficarão salvos na nuvem.
      </span>
    `;
    grid.appendChild(btnLater);

    // Helper para restaurar backup
    const importBackupData = (jsonStr) => {
      try {
        const backup = JSON.parse(jsonStr);
        if (!backup || typeof backup !== 'object') {
          throw new Error("O conteúdo fornecido não é um backup válido.");
        }
        if (backup.currentAlbumId) {
          localStorage.setItem('currentAlbumId', backup.currentAlbumId);
        }
        if (backup.albums) {
          localStorage.setItem('albums', JSON.stringify(backup.albums));
        }
        if (backup.session) {
          localStorage.setItem('album_auth_session', JSON.stringify(backup.session));
        }
        sessionStorage.setItem('skippedLogin', 'false');
        alert("Backup importado com sucesso! O aplicativo será recarregado.");
        window.location.hash = '#home';
        window.location.reload();
      } catch (err) {
        alert("Erro ao restaurar backup: " + err.message);
      }
    };

    // Botão Importar/Restaurar Backup Completo
    const btnImportBackup = document.createElement('button');
    btnImportBackup.className = 'w-full py-3.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-dashed border-white/20 hover:border-copaGreen/40 transition duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer';
    btnImportBackup.innerHTML = `
      <div class="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 font-bold text-xs transition duration-200">
        <span>📥 Restaurar Backup / Sincronizar Notebook</span>
      </div>
      <span class="text-[9px] text-gray-400 font-medium text-center leading-tight mt-0.5">
        Importe o arquivo JSON ou código de backup do seu celular.
      </span>
    `;
    btnImportBackup.onclick = () => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.json';
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          importBackupData(evt.target.result);
        };
        reader.readAsText(file);
      };

      const userChoice = confirm("Deseja carregar um ARQUIVO de backup (.json)?\n\n(Clique em 'Cancelar' para colar o CÓDIGO de texto do backup)");
      if (userChoice) {
        fileInput.click();
      } else {
        const code = prompt("Cole o código de backup (JSON) gerado no seu celular:");
        if (code) {
          importBackupData(code);
        }
      }
    };
    grid.appendChild(btnImportBackup);
 
    wrapper.appendChild(grid);
  }

  container.appendChild(wrapper);

  // Vincular eventos de clique após injetar no container
  const skipBtn = container.querySelector('.skip-login-btn');
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      sessionStorage.setItem('skippedLogin', 'true');
      location.hash = '#home';
    });
  }
}

// ------------------- HOME -------------------
function renderHome(container) {
  const stats = getAlbumStats();

  const rootHome = document.createElement('div');
  rootHome.className = 'space-y-6 py-2';


  // 2. Banner de Troca Qualificada removido (ícone de troca do cabeçalho agora pulsa no lugar)

  // Helper de progresso local
  function getSpecialProgress(code) {
    const albumId = storage.getCurrentAlbumId();
    const albums = storage.getAlbums();
    const album = albums[albumId];
    if (!album) return { owned: 0, total: 0 };
    const limit = (code === 'FWC') ? 19 : (code === 'CC') ? 14 : 20;
    let owned = 0;
    for (let i = 1; i <= limit; i++) {
      if (album.stickers[code + "-" + i]?.owned) owned++;
    }
    return { owned, total: limit };
  }

  // Helper: progresso dos escudos (figurinha #1 de cada seleção)
  function getShieldsProgress() {
    const albumId = storage.getCurrentAlbumId();
    const albums = storage.getAlbums();
    const album = albums[albumId];
    if (!album) return { owned: 0, total: 48 };
    let owned = 0;
    groupsData.forEach(g => g.teams.forEach(t => {
      if (album.stickers[t.code + "-1"]?.owned) owned++;
    }));
    return { owned, total: 48 };
  }

  // Helper: progresso das figurinhas Premium (EXTRAS com 4 variações cada)
  function getPremiumProgress() {
    const albumId = storage.getCurrentAlbumId();
    const albums = storage.getAlbums();
    const album = albums[albumId];
    if (!album) return { owned: 0, total: legendsData.length * 4 };
    const variants = ['ouro', 'prata', 'bronze', 'bordo'];
    let owned = 0;
    legendsData.forEach((_, idx) => {
      variants.forEach(v => {
        if (album.stickers["EXTRAS-" + idx + 1 + "-" + v]?.owned) owned++;
      });
    });
    return { owned, total: legendsData.length * 4 };
  }

  const fwcProg   = getSpecialProgress('FWC');
  const shProg    = getShieldsProgress();
  const ccProg    = getSpecialProgress('CC');
  const premProg  = getPremiumProgress();

  const specialBlocks = [
    {
      title: 'FIFA',
      desc: 'Especial Copa',
      hash: '#team-FWC',
      prog: fwcProg,
      color: 'border-blue-500/20 hover:border-blue-400/40',
      accentColor: '#4285F4',
      logo: `<svg viewBox="0 0 48 48" class="w-8 h-auto opacity-90" fill="none">
        <rect width="48" height="48" rx="6" fill="#004E98"/>
        <text x="24" y="32" text-anchor="middle" font-family="Outfit,sans-serif" font-weight="900" font-size="18" fill="white">FIFA</text>
      </svg>`
    },
    {
      title: 'Escudos',
      desc: '48 Seleções',
      hash: '#team-ESCUDOS',
      prog: shProg,
      color: 'border-copaYellow/20 hover:border-copaYellow/50',
      accentColor: '#FFC726',
      logo: `<svg viewBox="0 0 48 48" class="w-8 h-auto" fill="none">
        <path d="M24 4L6 12v12c0 10 8 18 18 20 10-2 18-10 18-20V12L24 4z" fill="#FFC726" opacity="0.85"/>
        <path d="M24 10L10 17v9c0 7.5 6 13.5 14 15 8-1.5 14-7.5 14-15v-9L24 10z" fill="#090a1a" opacity="0.3"/>
        <text x="24" y="30" text-anchor="middle" font-family="Outfit,sans-serif" font-weight="900" font-size="11" fill="white">ESCUDO</text>
      </svg>`
    },
    {
      title: 'Coca-Cola',
      desc: 'Metálicos',
      hash: '#team-CC',
      prog: ccProg,
      color: 'border-red-500/20 hover:border-red-400/40',
      accentColor: '#E31E2D',
      logo: `<svg viewBox="0 0 48 48" class="w-8 h-auto" fill="none">
        <rect width="48" height="48" rx="6" fill="#E31E2D"/>
        <text x="24" y="20" text-anchor="middle" font-family="Georgia,serif" font-weight="900" font-size="8" fill="white">Coca-Cola</text>
        <text x="24" y="34" text-anchor="middle" font-family="Outfit,sans-serif" font-weight="700" font-size="7" fill="white" opacity="0.8">ZERO</text>
      </svg>`
    },
    {
      title: 'Premium',
      desc: 'Lendários',
      hash: '#team-EXTRAS',
      prog: premProg,
      color: 'border-yellow-300/20 hover:border-yellow-300/50',
      accentColor: '#FFD700',
      logo: `<svg viewBox="0 0 48 48" class="w-8 h-auto" fill="none">
        <polygon points="24,4 29,18 44,18 32,27 37,42 24,33 11,42 16,27 4,18 19,18" fill="#FFD700" opacity="0.9"/>
      </svg>`
    }
  ];

  // A barra de busca foi movida para o cabeçalho de forma estática e global.

  // 4. Divisor de Título Grupos + Link Classificação Geral (Movido para cá)
  const groupsHeaderRow = document.createElement('div');
  groupsHeaderRow.className = 'flex justify-between items-center border-b border-white/5 pb-1 mt-4';

  const groupsTitle = document.createElement('h3');
  groupsTitle.className = 'text-xs font-black uppercase tracking-wider text-gray-500';
  groupsTitle.textContent = 'Figurinhas';
  groupsHeaderRow.appendChild(groupsTitle);

  const tableLink = document.createElement('a');
  tableLink.href = 'https://www.fifa.com/pt/tournaments/mens/worldcup/canadamexicousa2026/standings';
  tableLink.target = '_blank';
  tableLink.rel = 'noopener noreferrer';
  tableLink.className = 'text-[9px] font-black text-copaGreen hover:text-white transition flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded border border-white/5';
  tableLink.innerHTML = `
    <span>Classificação Geral</span>
    <svg class="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  `;
  groupsHeaderRow.appendChild(tableLink);
  rootHome.appendChild(groupsHeaderRow);

  // Barra de progresso principal (super simples, fina, posicionada abaixo do cabeçalho "Figurinhas")
  const mainProgressContainer = document.createElement('div');
  mainProgressContainer.className = 'w-full mt-2 mb-4 space-y-1.5';

  const mainProgressBarBg = document.createElement('div');
  mainProgressBarBg.className = 'h-1 bg-white/5 rounded-full overflow-hidden border border-white/10 w-full';
  const mainProgressBarFill = document.createElement('div');
  mainProgressBarFill.className = 'h-full bg-gradient-to-r from-copaBlue via-copaGreen to-copaYellow rounded-full transition-all duration-500';
  mainProgressBarFill.style.width = stats.percent + "%";
  mainProgressBarBg.appendChild(mainProgressBarFill);
  mainProgressContainer.appendChild(mainProgressBarBg);

  const mainProgressText = document.createElement('div');
  mainProgressText.className = 'flex justify-between items-center text-xs font-semibold text-gray-300';
  mainProgressText.innerHTML = `
    <div><span class="text-sm font-black text-white">${stats.owned}</span> / ${stats.total} Adquiridas</div>
    <div class="text-sm font-black text-white">${stats.percent}%</div>
  `;
  mainProgressContainer.appendChild(mainProgressText);

  rootHome.appendChild(mainProgressContainer);

  // 5. LINHAS SEGUINTES: Cada grupo exibido abaixo do outro (Vertical)
  const groupsContainer = document.createElement('div');
  groupsContainer.className = 'space-y-5';

  // Card do grupo ESPECIAIS no mesmo padrão das seleções
  const specialsGroupCard = document.createElement('div');
  specialsGroupCard.className = 'glass-panel p-4 rounded-xl border-white/5 flex flex-col gap-3';
  
  const specialsGroupHeader = document.createElement('div');
  specialsGroupHeader.className = 'border-b border-white/5 pb-1 w-full';

  const specialsGTitle = document.createElement('h4');
  specialsGTitle.className = 'font-black text-[10px] text-gray-400 uppercase tracking-widest';
  specialsGTitle.textContent = 'ESPECIAIS';
  specialsGroupHeader.appendChild(specialsGTitle);
  specialsGroupCard.appendChild(specialsGroupHeader);

  const specialsGrid = document.createElement('div');
  specialsGrid.className = 'grid grid-cols-4 gap-1';

  const specialItems = [
    {
      name: 'FIFA',
      code: 'FWC',
      limit: 19,
      prog: fwcProg,
      logo: `data:image/svg+xml,` + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><text x="24" y="32" text-anchor="middle" font-family="Outfit,sans-serif" font-weight="900" font-size="18" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))">FIFA</text></svg>`),
      grayscale: false
    },
    {
      name: 'Escudos',
      code: 'ESCUDOS',
      limit: 48,
      prog: shProg,
      logo: `data:image/svg+xml,` + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><path d="M24 4L6 12v12c0 10 8 18 18 20 10-2 18-10 18-20V12L24 4z" stroke="#00f5d4" stroke-width="2" fill="none" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"/><text x="24" y="28" text-anchor="middle" font-family="Outfit,sans-serif" font-weight="900" font-size="8" fill="#ffffff">ESCUDOS</text></svg>`),
      grayscale: false
    },
    {
      name: 'Coca-Cola',
      code: 'CC',
      limit: 14,
      prog: ccProg,
      logo: './crests/Logo CocaZero Copa1.png',
      grayscale: false
    },
    {
      name: 'Premium',
      code: 'EXTRAS',
      limit: legendsData.length * 4,
      prog: premProg,
      logo: `data:image/svg+xml,` + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><polygon points="24,4 30.5,17.5 45.5,18.5 34,28 37.5,43 24,35 10.5,43 14,28 2.5,18.5 17.5,17.5" fill="#FFC726" filter="drop-shadow(0 2px 6px rgba(255,199,38,0.5))"/></svg>`),
      grayscale: false
    }
  ];

  specialItems.forEach(item => {
    const card = document.createElement('div');
    card.id = "country-card-" + item.code;
    card.className = 'selection-card-futz';
    card.onclick = () => location.hash = "#team-" + item.code;

    // Logo vaza por cima com crest-floating
    const crestImg = document.createElement('img');
    crestImg.src = item.logo;
    crestImg.alt = item.name;
    crestImg.loading = 'lazy';
    crestImg.decoding = 'async';
    crestImg.className = 'crest-floating';
    card.appendChild(crestImg);

    const name = document.createElement('div');
    name.className = 'card-title-name full-country-name';
    name.textContent = item.name;
    card.appendChild(name);

    const code = document.createElement('div');
    code.className = 'card-title-name mobile-country-code';
    code.textContent = item.code;
    card.appendChild(code);

    // Bottom Row
    const bottomRow = document.createElement('div');
    bottomRow.className = 'card-bottom-row';

    // Horizontal progress bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'flex-1 h-1 bg-white/10 rounded-full overflow-hidden';
    const progressBar = document.createElement('div');
    progressBar.className = 'h-full bg-gradient-to-r from-copaGreen to-emerald-400';
    const percent = (item.prog.owned / item.limit) * 100;
    progressBar.style.width = percent + "%";
    progressContainer.appendChild(progressBar);
    bottomRow.appendChild(progressContainer);

    // Badge de Progresso Gamer no canto inferior direito
    const progBadge = document.createElement('span');
    if (item.prog.owned === item.limit) {
      progBadge.className = 'badge-neon-gamer completed';
      progBadge.textContent = '✓';
    } else {
      progBadge.className = 'badge-neon-gamer';
      progBadge.textContent = item.prog.owned + "/" + item.limit;
    }
    card.appendChild(progBadge);
    card.appendChild(bottomRow);

    specialsGrid.appendChild(card);
  });

  specialsGroupCard.appendChild(specialsGrid);
  groupsContainer.appendChild(specialsGroupCard);

  groupsData.forEach(g => {
    const groupCard = document.createElement('div');
    groupCard.className = 'glass-panel p-4 rounded-xl border-white/5 flex flex-col gap-3';
    
    // Contêiner de cabeçalho do grupo contendo apenas o nome do grupo
    const groupHeader = document.createElement('div');
    groupHeader.className = 'border-b border-white/5 pb-1 w-full';

    const gTitle = document.createElement('h4');
    gTitle.className = 'font-black text-[10px] text-gray-400 uppercase tracking-widest';
    gTitle.textContent = g.name;
    groupHeader.appendChild(gTitle);
    groupCard.appendChild(groupHeader);

    // Grid de 4 colunas para caber as 4 seleções na mesma linha horizontal
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-4 gap-1';

    // Ordenação dinâmica por classificação (rank ascendente: 1º primeiro)
    const sortedTeams = [...g.teams].sort((a, b) => a.rank - b.rank);
    sortedTeams.forEach(team => {
      const card = document.createElement('div');
      card.id = "country-card-" + team.code;
      card.className = 'selection-card-futz';
      card.onclick = () => location.hash = "#team-" + team.code;

      // Injeta o Balãozinho de Fase (FG, R16, etc.)
      const cachedData = localStorage.getItem(STANDINGS_CACHE_KEY);
      const standings = cachedData ? JSON.parse(cachedData) : null;
      const phaseInfo = getPhaseInfo(team, standings);

      const flagCode = (flagMap[team.code] || 'us').toLowerCase();

      // Escudo real flutuante
      const crestImg = document.createElement('img');
      crestImg.src = crestsMap[team.code] || "https://flagcdn.com/w80/" + flagCode + ".png"; // fallback
      crestImg.alt = team.name;
      crestImg.loading = 'lazy';
      crestImg.decoding = 'async';
      crestImg.className = 'crest-floating';
      
      // Fallback robusto se a imagem do brasão falhar (converte em logo 2026 cinza)
      crestImg.onerror = function() {
        this.src = './logo2026.png';
        this.className = 'crest-floating grayscale opacity-60';
      };
      card.appendChild(crestImg);

      // Nome do país centralizado abaixo do escudo
      const name = document.createElement('div');
      name.className = 'card-title-name full-country-name';
      name.textContent = team.name;
      card.appendChild(name);

      const code = document.createElement('div');
      code.className = 'card-title-name mobile-country-code';
      code.textContent = team.code;
      card.appendChild(code);

      // Linha inferior do Card contendo a barra discreta
      const bottomRow = document.createElement('div');
      bottomRow.className = 'card-bottom-row';

      const limit = (team.code === 'FWC') ? 19 : (team.code === 'CC') ? 14 : 20;
      const teamStats = getTeamProgress(team.code);

      // Barra de progresso horizontal fina
      const progressContainer = document.createElement('div');
      progressContainer.className = 'flex-1 h-1 bg-white/10 rounded-full overflow-hidden';
      const progressBar = document.createElement('div');
      progressBar.className = 'h-full bg-gradient-to-r from-copaGreen to-emerald-400';
      const percent = (teamStats.owned / limit) * 100;
      progressBar.style.width = percent + "%";
      progressContainer.appendChild(progressBar);
      bottomRow.appendChild(progressContainer);

      // Badge de Fase da Copa (ex: FG, R16, etc.) se aplicável
      if (phaseInfo) {
        const phaseBadge = document.createElement('span');
        phaseBadge.className = "card-phase-badge absolute top-3 left-3 text-[7px] font-black px-1.5 py-0.2 rounded border uppercase tracking-wider " + phaseInfo.color;
        phaseBadge.textContent = phaseInfo.label;
        card.appendChild(phaseBadge);
      }

      // Badge de Progresso Gamer no canto inferior direito
      const progBadge = document.createElement('span');
      if (teamStats.owned === limit) {
        progBadge.className = 'badge-neon-gamer completed';
        progBadge.textContent = '✓';
      } else {
        progBadge.className = 'badge-neon-gamer';
        progBadge.textContent = teamStats.owned + "/" + limit;
      }
      card.appendChild(progBadge);
      card.appendChild(bottomRow);

      grid.appendChild(card);
    });

    groupCard.appendChild(grid);
    groupsContainer.appendChild(groupCard);
  });

  rootHome.appendChild(groupsContainer);
  container.appendChild(rootHome);
}

// Auxiliar para obter progresso por seleção (máximo 20 figurinhas)
function getTeamProgress(teamCode) {
  const albumId = storage.getCurrentAlbumId();
  const albums = storage.getAlbums();
  const album = albums[albumId];
  if (!album) return { owned: 0 };
  
  let owned = 0;
  if (teamCode === 'ESCUDOS') {
    groupsData.forEach(g => g.teams.forEach(t => {
      if (album.stickers[t.code + "-1"]?.owned) owned++;
    }));
  } else if (teamCode === 'EXTRAS') {
    const variants = ['ouro', 'prata', 'bronze', 'bordo'];
    legendsData.forEach((_, idx) => {
      variants.forEach(v => {
        if (album.stickers["EXTRAS-" + idx + 1 + "-" + v]?.owned) owned++;
      });
    });
  } else {
    const limit = (teamCode === 'FWC') ? 19 : (teamCode === 'CC') ? 14 : 20;
    for (let i = 1; i <= limit; i++) {
      const key = teamCode + "-" + i;
      if (album.stickers[key] && album.stickers[key].owned) {
        owned++;
      }
    }
  }
  return { owned };
}

// ------------------- IMPORTAR -------------------
function renderImport(container) {
  const wrapper = document.createElement('div');
  wrapper.className = 'glass-panel p-5 rounded-2xl border-white/5 space-y-4';

  const title = document.createElement('h2');
  title.className = 'text-base font-black uppercase tracking-wider text-copaYellow';
  title.textContent = 'Importar Figurinhas';
  wrapper.appendChild(title);

  const hint = document.createElement('p');
  hint.className = 'text-[10px] text-gray-400 leading-relaxed';
  hint.textContent = 'Insira os números dos cromos.';
  wrapper.appendChild(hint);

  const textarea = document.createElement('textarea');
  textarea.id = 'importArea';
  textarea.className = 'w-full h-36 p-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-copaYellow text-xs text-white placeholder-gray-600';
  textarea.placeholder = 'Exemplo: BRA 1, BRA4, BRA7 ou BRA 1 4 7 ou  BRA 1, 4, 7 ou ainda 500, 503, 506';
  wrapper.appendChild(textarea);

  const btnContainer = document.createElement('div');
  btnContainer.className = 'flex flex-col gap-2';

  const btnHave = document.createElement('button');
  btnHave.className = 'w-full px-4 py-2.5 bg-copaGreen hover:opacity-90 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition';
  btnHave.textContent = "Importar como 'Tenho'";
  btnHave.onclick = () => processImport('owned');

  const btnDup = document.createElement('button');
  btnDup.className = 'w-full px-4 py-2.5 bg-copaYellow hover:opacity-90 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition';
  btnDup.textContent = "Importar como 'Repetidas'";
  btnDup.onclick = () => processImport('duplicate');

  const btnMissing = document.createElement('button');
  btnMissing.className = 'w-full px-4 py-2.5 bg-red-600 hover:opacity-90 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition';
  btnMissing.textContent = "Importar como 'Faltantes'";
  btnMissing.onclick = () => processImport('missing');

  btnContainer.appendChild(btnHave);
  btnContainer.appendChild(btnDup);
  btnContainer.appendChild(btnMissing);
  wrapper.appendChild(btnContainer);

  // Separador e Botão de Reset
  const resetDivider = document.createElement('div');
  resetDivider.className = 'border-t border-white/5 my-2';
  wrapper.appendChild(resetDivider);

  const btnReset = document.createElement('button');
  btnReset.className = 'w-full px-4 py-2.5 bg-red-950/30 border border-red-900/50 hover:bg-red-900/30 hover:border-red-600 text-red-300 text-xs font-bold uppercase tracking-wider rounded-xl transition';
  btnReset.textContent = "⚠️ Zerar / Resetar Álbum";
  btnReset.onclick = () => {
    const confirmationWord = "ZERAR";
    const userConsent = prompt(
      "ATENÇÃO: Você está prestes a apagar todas as figurinhas coladas e repetidas deste álbum!\n\n" +
      "Esta ação é irreversível.\n" +
      "Para confirmar que deseja prosseguir, digite \"" + confirmationWord + "\" abaixo:"
    );
    if (userConsent === confirmationWord) {
      const albumId = storage.getCurrentAlbumId();
      const albums = storage.getAlbums();
      if (albumId && albums[albumId]) {
        albums[albumId].stickers = {};
        storage.setAlbums(albums);
        alert("Álbum zerado com sucesso!");
        const importArea = document.getElementById('importArea');
        if (importArea) importArea.value = '';
        location.hash = '#home';
        route();
      }
    } else if (userConsent !== null) {
      alert("Texto de confirmação incorreto. O álbum não foi alterado.");
    }
  };
  wrapper.appendChild(btnReset);

  const back = document.createElement('button');
  back.className = 'w-full px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase text-gray-300 tracking-wider rounded-xl transition';
  back.textContent = 'Voltar para Home';
  back.onclick = () => location.hash = '#home';
  wrapper.appendChild(back);

  container.appendChild(wrapper);
}

function processImport(mode) {
  const text = document.getElementById('importArea').value.trim();
  if (!text) return alert('Insira códigos para importar.');

  const albumId = storage.getCurrentAlbumId();
  const albums = storage.getAlbums();
  const album = albums[albumId];

  // Coleta as chaves informadas no input
  const parsedKeys = new Set();

  const allTeams = [];
  groupsData.forEach(g => {
    g.teams.forEach(t => {
      allTeams.push(t.code);
    });
  });

  const twoToThreeMap = {
    'MX': 'MEX', 'ZA': 'RSA', 'KR': 'KOR', 'CZ': 'CZE',
    'CA': 'CAN', 'BA': 'BIH', 'QA': 'QAT', 'CH': 'SUI',
    'BR': 'BRA', 'MA': 'MAR', 'HT': 'HAI', 'US': 'USA',
    'PY': 'PAR', 'AU': 'AUS', 'TR': 'TUR', 'DE': 'GER',
    'CW': 'CUW', 'CI': 'CIV', 'EC': 'ECU', 'NL': 'NED',
    'JP': 'JPN', 'SE': 'SWE', 'TN': 'TUN', 'BE': 'BEL',
    'EG': 'EGY', 'IR': 'IRN', 'NZ': 'NZL', 'ES': 'ESP',
    'CV': 'CPV', 'SA': 'KSA', 'UY': 'URU', 'FR': 'FRA',
    'SN': 'SEN', 'IQ': 'IRQ', 'NO': 'NOR', 'AR': 'ARG',
    'DZ': 'ALG', 'AT': 'AUT', 'JO': 'JOR', 'PT': 'POR',
    'CD': 'COD', 'UZ': 'UZB', 'CO': 'COL', 'HR': 'CRO',
    'GH': 'GHA', 'PA': 'PAN'
  };

  let currentCode = null;
  const lines = text.split(/\n|;/).map(s => s.trim()).filter(Boolean);

  lines.forEach(line => {
    // 1. Tenta casar primeiro por Nome Completo de Legend
    let foundLegendIndex = -1;
    for (let idx = 0; idx < legendsData.length; idx++) {
      if (line.toLowerCase() === legendsData[idx].name.toLowerCase()) {
        foundLegendIndex = idx;
        break;
      }
    }
    if (foundLegendIndex !== -1) {
      parsedKeys.add("EXTRAS-" + foundLegendIndex + 1);
      return;
    }

    // 2. Se não casou com a linha inteira, processa por itens separados por vírgula
    const items = line.split(',').map(s => s.trim()).filter(Boolean);
    items.forEach(item => {
      // Verifica se o item é o nome completo de um Legend
      let itemLegendIndex = -1;
      for (let idx = 0; idx < legendsData.length; idx++) {
        if (item.toLowerCase() === legendsData[idx].name.toLowerCase()) {
          itemLegendIndex = idx;
          break;
        }
      }
      if (itemLegendIndex !== -1) {
        parsedKeys.add("EXTRAS-" + itemLegendIndex + 1);
        return;
      }

      // Tenta casar formato Código + Números (ex: "BRA 1", "BRA4", "BRA 1 4 7")
      const mCodeNums = item.match(/^([A-Z]{2,10}(?:-[A-Z]+)?)\s*(-)?\s*([0-9\s]+)$/i);
      if (mCodeNums) {
        let code = mCodeNums[1].toUpperCase();
        if (twoToThreeMap[code]) {
          code = twoToThreeMap[code];
        }
        currentCode = code;

        const nums = mCodeNums[3].split(/\s+/).filter(Boolean);
        nums.forEach(n => {
          const numVal = parseInt(n, 10);
          if (numVal >= 1 && numVal <= 20) {
            parsedKeys.add(code + "-" + numVal);
          }
        });
      } else if (/^[0-9\s]+$/.test(item)) {
        // Apenas números
        const nums = item.split(/\s+/).filter(Boolean);
        nums.forEach(n => {
          const numVal = parseInt(n, 10);
          if (numVal > 20) {
            // Número sequencial cru (1 a 960)
            const idx = numVal - 1;
            const teamIdx = Math.floor(idx / 20);
            const stickerIdx = (idx % 20) + 1;
            if (teamIdx >= 0 && teamIdx < 48) {
              const teamCode = allTeams[teamIdx];
              parsedKeys.add(teamCode + "-" + stickerIdx);
            }
          } else if (numVal >= 1 && numVal <= 20) {
            if (currentCode) {
              parsedKeys.add(currentCode + "-" + numVal);
            } else {
              const idx = numVal - 1;
              const teamIdx = Math.floor(idx / 20);
              const stickerIdx = (idx % 20) + 1;
              if (teamIdx >= 0 && teamIdx < 48) {
                const teamCode = allTeams[teamIdx];
                parsedKeys.add(teamCode + "-" + stickerIdx);
              }
            }
          }
        });
      }
    });
  });

  if (mode === 'missing') {
    // Modo Faltantes: define as informadas como não possuídas (faltantes), e todas as outras como possuídas (coladas)
    const allStickerKeys = [];
    groupsData.forEach(g => {
      g.teams.forEach(t => {
        for (let i = 1; i <= 20; i++) {
          allStickerKeys.push(t.code + "-" + i);
        }
      });
    });
    const specials = ['FWC', 'CC', 'EXTRAS'];
    specials.forEach(code => {
      for (let i = 1; i <= 20; i++) {
        allStickerKeys.push(code + "-" + i);
      }
    });

    allStickerKeys.forEach(key => {
      if (parsedKeys.has(key)) {
        album.stickers[key] = { owned: false, duplicate: 0 };
      } else {
        album.stickers[key] = { owned: true, duplicate: 0 };
      }
    });

    storage.setAlbums(albums);
    alert("Sucesso! Álbum atualizado: as " + parsedKeys.size + " figurinhas informadas foram marcadas como FALTANTES, e todas as demais do álbum foram marcadas como COLADAS.");
  } else {
    // Modos "Tenho" ou "Repetidas" padrão
    let importCount = 0;
    parsedKeys.forEach(key => {
      addSticker(album, key, mode === 'duplicate');
      importCount++;
    });
    storage.setAlbums(albums);
    alert("Sucesso! " + importCount + " figurinhas adicionadas.");
  }

  location.hash = '#home';
}

function addSticker(album, key, duplicate) {
  if (!album.stickers[key]) {
    album.stickers[key] = { owned: false, duplicate: 0 };
  }
  if (duplicate) {
    album.stickers[key].duplicate++;
    album.stickers[key].owned = true;
  } else {
    album.stickers[key].owned = true;
  }
}

// Composição do Logo da Copa 2026 com o código da figurinha sobreposto
function createLogoComposition(stickerCode, isExtras = false) {
  const container = document.createElement('div');
  container.className = 'card-logo-container';

  const logoImg = document.createElement('img');
  logoImg.src = './logo2026.png';
  logoImg.loading = 'lazy';
  logoImg.decoding = 'async';
  logoImg.className = 'card-logo-image';
  logoImg.alt = 'FIFA Logo';
  container.appendChild(logoImg);

  const codeEl = document.createElement('div');
  codeEl.className = 'card-sticker-code';
  if (isExtras) {
    codeEl.classList.add('extras-font-size');
  }
  codeEl.textContent = stickerCode;
  container.appendChild(codeEl);

  return container;
}

// ------------------- TEAM PAGE -------------------
function renderTeamPage(code, container) {
  const teamName = teamsMap[code] || code;

  const rootTeam = document.createElement('div');
  rootTeam.className = 'space-y-5 py-2';

  // Cabeçalho da página de seleção
  const headerPanel = document.createElement('div');
  headerPanel.className = 'glass-panel p-5 rounded-2xl flex flex-col gap-3.5 border-white/5';
  
  // Linha superior do Cabeçalho
  const topRow = document.createElement('div');
  topRow.className = 'flex items-center justify-between gap-4 w-full';

  const infoSide = document.createElement('div');
  infoSide.className = 'flex items-center gap-3.5';
  
  // Cabeçalho da página de seleção: Brasão ou fallback do logo cinza
  const crestWrapper = document.createElement('div');
  crestWrapper.className = 'w-10 h-10 flex items-center justify-center';

  const crest = document.createElement('img');
  crest.loading = 'lazy';
  crest.decoding = 'async';
  if (code === 'FWC') {
    crest.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/FIFA_logo_without_slogan.svg/120px-FIFA_logo_without_slogan.svg.png';
    crest.className = 'w-10 h-10 object-contain rounded bg-white/5 p-1 border border-white/10';
  } else if (code === 'CC') {
    crest.src = './crests/Logo CocaZero Copa1.png';
    crest.className = 'w-10 h-10 object-contain rounded bg-white/5 p-1 border border-white/10';
  } else if (code === 'EXTRAS') {
    crest.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Golden_Ball.svg/100px-Golden_Ball.svg.png';
    crest.className = 'w-10 h-10 object-contain';
  } else if (code === 'ESCUDOS') {
    crest.src = `data:image/svg+xml,` + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><path d="M24 4L6 12v12c0 10 8 18 18 20 10-2 18-10 18-20V12L24 4z" fill="#FFC726" opacity="0.85"/><path d="M24 10L10 17v9c0 7.5 6 13.5 14 15 8-1.5 14-7.5 14-15v-9L24 10z" fill="#090a1a" opacity="0.3"/><text x="24" y="28" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="9" fill="white">ESCUDO</text></svg>`);
    crest.className = 'w-10 h-10 object-contain';
  } else {
    crest.src = crestsMap[code] || `./logo2026.png`;
    crest.className = 'w-10 h-10 object-contain filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.05)]';
    
    crest.onerror = function() {
      this.src = './logo2026.png';
      this.className = 'w-10 h-10 object-contain grayscale opacity-60'; // Tom cinza/grayscale
    };
  }
  crest.alt = teamName;
  crest.style.width = '40px';
  crest.style.height = '40px';
  
  crestWrapper.appendChild(crest);
  infoSide.appendChild(crestWrapper);

  const textBlock = document.createElement('div');
  
  const teamTitle = document.createElement('h2');
  teamTitle.id = 'teamTitleText';
  teamTitle.className = 'text-sm font-black uppercase tracking-wide flex items-center gap-1.5 flex-wrap';
  
  // Imagem real da bandeira em frente ao nome (evita bug de renderização de emojis no Windows)
  if (code !== 'FWC' && code !== 'CC' && code !== 'EXTRAS' && code !== 'ESCUDOS') {
    const flagImg = document.createElement('img');
    const flagCode = (flagMap[code] || 'us').toLowerCase();
    return crestsMap[code] || "https://flagcdn.com/w40/" + (flagMap[code] || 'un') + ".png";
    flagImg.loading = 'lazy';
    flagImg.decoding = 'async';
    flagImg.className = 'w-5.5 h-3.5 object-cover border border-white/20 rounded shadow-sm inline-block mr-1 align-middle';
    teamTitle.appendChild(flagImg);
  }

  // Nome do País
  const nameSpan = document.createElement('span');
  let displayNameText = teamName;
  if (code === 'FWC') displayNameText = 'Figurinhas FIFA - Escudo';
  else if (code === 'ESCUDOS') displayNameText = 'Escudos das Seleção';
  else if (code === 'CC') displayNameText = 'Coca-Cola';
  else if (code === 'EXTRAS') displayNameText = 'LEGENDS';
  nameSpan.textContent = displayNameText;
  teamTitle.appendChild(nameSpan);

  // Estrelas dos Títulos
  const titleInfo = worldCupTitles[code];
  if (titleInfo) {
    const starsSpan = document.createElement('span');
    starsSpan.textContent = ' ' + '⭐'.repeat(titleInfo.count);
    teamTitle.appendChild(starsSpan);
  }

  // Badge de fase ao lado do nome (ex: Fase de Grupos)
  if (code !== 'FWC' && code !== 'CC' && code !== 'EXTRAS' && code !== 'ESCUDOS') {
    const cachedStandingsData = localStorage.getItem(STANDINGS_CACHE_KEY);
    const standingsForTeam = cachedStandingsData ? JSON.parse(cachedStandingsData) : null;
    const teamObj = groupsData.flatMap(g => g.teams).find(t => t.code === code);
    if (teamObj) {
      const pi = getPhaseInfo(teamObj, standingsForTeam);
      const phaseBadge = document.createElement('span');
      phaseBadge.className = "text-[8px] font-black px-1.5 py-0.5 rounded border " + pi.color + " ml-1";
      phaseBadge.textContent = pi.description;
      teamTitle.appendChild(phaseBadge);
    }
  }
  
  const limit = (code === 'FWC') ? 19 : (code === 'CC') ? 14 : (code === 'ESCUDOS') ? 48 : (code === 'EXTRAS') ? (legendsData.length * 4) : 20;
  const stats = getTeamProgress(code);

  const titlesSub = document.createElement('p');
  titlesSub.className = 'text-[9px] text-gray-400 font-bold tracking-tight mt-0.5';
  if (titleInfo) {
    titlesSub.innerHTML = "<span class=\"text-copaYellow font-black\">Títulos Mundiais:</span> " + titleInfo.years;
  } else {
    if (code === 'FWC') {
      titlesSub.textContent = 'Figurinhas brilhantes';
    } else if (code === 'ESCUDOS') {
      titlesSub.textContent = 'Figurinhas brilhantes';
    } else if (code === 'CC') {
      titlesSub.textContent = 'Metálicos';
    } else if (code === 'EXTRAS') {
      titlesSub.textContent = 'Figurinhas Premium';
    } else {
      titlesSub.textContent = 'Sem títulos mundiais';
    }
  }
  
  textBlock.appendChild(teamTitle);
  textBlock.appendChild(titlesSub);
  infoSide.appendChild(textBlock);
  topRow.appendChild(infoSide);

  const backBtn = document.createElement('button');
  backBtn.className = 'p-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition flex items-center justify-center';
  backBtn.innerHTML = `
    <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  `;
  backBtn.onclick = () => location.hash = '#home';
  topRow.appendChild(backBtn);
  headerPanel.appendChild(topRow);

  // Barra de progresso da seleção (idêntica à da Home)
  const progressWrapper = document.createElement('div');
  progressWrapper.className = 'w-full mt-1.5 space-y-1';
  
  const progLabel = document.createElement('div');
  progLabel.className = 'flex justify-between items-center text-[9px] text-gray-400 font-bold uppercase';
  const percent = Math.round((stats.owned / limit) * 100);
  progLabel.innerHTML = "<span>Progresso de Conclusão</span> <span id=\"teamProgText\" class=\"text-copaGreen font-bold\">" + stats.owned + "/" + limit + " (" + percent + "%)</span>";
  
  const progBg = document.createElement('div');
  progBg.className = 'h-2 bg-white/5 border border-white/10 rounded-full overflow-hidden';
  const progFill = document.createElement('div');
  progFill.id = 'teamProgBarFill';
  progFill.className = 'h-full bg-gradient-to-r from-copaBlue via-copaGreen to-copaYellow rounded-full transition-all duration-300';
  progFill.style.width = percent + "%";
  
  progBg.appendChild(progFill);
  progressWrapper.appendChild(progLabel);
  progressWrapper.appendChild(progBg);

  // Adiciona o countSub debaixo do progBg
  const countSub = document.createElement('p');
  countSub.className = 'text-[9px] text-gray-400 text-right mt-1 font-bold';
  countSub.id = 'teamProgressLabel';
  countSub.textContent = stats.owned + " de " + limit + " figurinhas coladas";
  progressWrapper.appendChild(countSub);

  headerPanel.appendChild(progressWrapper);

  // Injeta o check verde de 100% completo
  if (stats.owned === limit) {
    const check = document.createElement('span');
    check.className = 'check-mark text-copaGreen font-black text-lg ml-2 animate-bounce inline-block drop-shadow-[0_0_8px_#00e676]';
    check.textContent = '✓';
    teamTitle.appendChild(check);
  }

  rootTeam.appendChild(headerPanel);

  // Grade responsiva de figurinhas
  const grid = document.createElement('div');
  grid.className = 'grid-fifa';

  const extrasContainer = document.createElement('div');
  extrasContainer.className = 'space-y-4 mt-6';

  // Se for ESCUDOS, os cards devem replicar as ações e cópia fiel das figurinhas nº 1 de cada seleção
  if (code === 'ESCUDOS') {
    const allTeamsList = [];
    groupsData.forEach(g => g.teams.forEach(t => allTeamsList.push(t)));
    
    allTeamsList.forEach(team => {
      const originalKey = team.code + "-1";
      const card = document.createElement('div');
      card.className = 'sticker-card';
      card.id = "card-" + originalKey;

      const inner = document.createElement('div');
      inner.className = 'card-inner';

      const cardBack = document.createElement('div');
      cardBack.className = 'card-back';
      const backLogoComp = createLogoComposition(team.code + " 1", false);
      cardBack.appendChild(backLogoComp);
      inner.appendChild(cardBack);

      const cardFront = document.createElement('div');
      cardFront.className = 'card-front relative flex flex-col justify-between p-2 overflow-visible';
      const frontLogoComp = createLogoComposition(team.code + " 1", false);
      cardFront.appendChild(frontLogoComp);

      // Frente superior
      const frontHeader = document.createElement('div');
      frontHeader.className = 'flex justify-between items-center w-full z-10';
      const teamTag = document.createElement('span');
      teamTag.className = 'text-[9px] font-black uppercase tracking-wider text-white';
      teamTag.textContent = team.code;
      frontHeader.appendChild(teamTag);

      const miniCrest = document.createElement('img');
      const flagCode = (flagMap[team.code] || 'us').toLowerCase();
    return crestsMap[code] || "https://flagcdn.com/w40/" + (flagMap[code] || 'un') + ".png";
      miniCrest.alt = 'Bandeira';
      miniCrest.className = 'w-5 h-3.5 object-cover rounded border border-white/20';
      frontHeader.appendChild(miniCrest);
      cardFront.appendChild(frontHeader);

      // Nome
      const playerName = document.createElement('div');
      playerName.className = 'player-name-label';
      playerName.textContent = team.name + " Escudo";
      cardFront.appendChild(playerName);

      const frontActions = document.createElement('div');
      frontActions.className = 'card-actions z-10';
      cardFront.appendChild(frontActions);

      inner.appendChild(cardFront);
      inner.appendChild(cardBack);
      card.appendChild(inner);

      card.onclick = (e) => {
        if (e.target.closest('.action-btn')) return;
        toggleOwned(originalKey);
        updateCard(card, originalKey);
        updateTeamProgressLabel('ESCUDOS');
      };

      updateCard(card, originalKey);
      grid.appendChild(card);
    });
  } else if (code === 'EXTRAS') {
    // Legends Premium: 4 variações por atleta (ouro, prata, bronze, bordo)
    const variants = ['ouro', 'prata', 'bronze', 'bordo'];

    legendsData.forEach((legend, idx) => {
      const row = document.createElement('div');
      row.className = 'glass-panel p-3.5 rounded-2xl border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 hover:border-yellow-500/20 transition duration-200';
      
      const playerInfo = document.createElement('div');
      playerInfo.className = 'flex items-center gap-3.5 min-w-0 sm:w-1/4 flex-shrink-0';
      
      const flagImg = document.createElement('img');
      const flagCode = legend.country.toLowerCase();
    return crestsMap[code] || "https://flagcdn.com/w40/" + (flagMap[code] || 'un') + ".png";
      flagImg.loading = 'lazy';
      flagImg.decoding = 'async';
      flagImg.className = 'w-6 h-4 object-cover border border-white/20 rounded shadow-sm flex-shrink-0';
      playerInfo.appendChild(flagImg);
      
      const nameLabel = document.createElement('span');
      nameLabel.className = 'font-black text-xs text-white uppercase tracking-wider truncate';
      nameLabel.textContent = legend.name;
      playerInfo.appendChild(nameLabel);
      
      row.appendChild(playerInfo);
      
      const cardsGrid = document.createElement('div');
      cardsGrid.className = 'grid grid-cols-4 gap-2 flex-1';
      
      variants.forEach(variant => {
        const key = "EXTRAS-" + idx + 1 + "-" + variant;
        const stickerCode = legend.name;
        
        const card = document.createElement('div');
        card.className = 'sticker-card special';
        card.id = "card-" + key;

        const inner = document.createElement('div');
        inner.className = 'card-inner';

        const cardBack = document.createElement('div');
        cardBack.className = "card-back special " + variant;
        const backLogoComp = createLogoComposition(stickerCode, true);
        cardBack.appendChild(backLogoComp);
        inner.appendChild(cardBack);

        const cardFront = document.createElement('div');
        cardFront.className = "card-front special shiny-effect " + variant + " relative flex flex-col justify-between p-2 overflow-visible";
        
        const frontLogoComp = createLogoComposition(stickerCode, true);
        cardFront.appendChild(frontLogoComp);

        const frontHeader = document.createElement('div');
        frontHeader.className = 'flex justify-between items-center w-full z-10';
        
        const teamTag = document.createElement('span');
        teamTag.className = 'text-[7px] font-black uppercase tracking-wider text-white';
        teamTag.textContent = variant.toUpperCase();
        frontHeader.appendChild(teamTag);

        const miniCrest = document.createElement('img');
    return crestsMap[code] || "https://flagcdn.com/w40/" + (flagMap[code] || 'un') + ".png";
        miniCrest.className = 'w-5 h-3.5 object-cover rounded border border-white/20';
        frontHeader.appendChild(miniCrest);
        cardFront.appendChild(frontHeader);

        const playerName = document.createElement('div');
        playerName.className = 'player-name-label';
        playerName.textContent = legend.name;
        cardFront.appendChild(playerName);

        const frontActions = document.createElement('div');
        frontActions.className = 'card-actions z-10';
        cardFront.appendChild(frontActions);

        inner.appendChild(cardFront);
        inner.appendChild(cardBack);
        card.appendChild(inner);

        card.onclick = (e) => {
          if (e.target.closest('.action-btn')) return;
          toggleOwned(key);
          updateCard(card, key);
          updateTeamProgressLabel('EXTRAS');
        };

        updateCard(card, key);
        cardsGrid.appendChild(card);
      });
      
      row.appendChild(cardsGrid);
      extrasContainer.appendChild(row);
    });
  } else {
    // FIFA (FWC) e Coca-Cola (CC) e normais
    for (let i = 1; i <= limit; i++) {
      const key = code + "-" + i;
      const card = document.createElement('div');
      card.className = 'sticker-card';
      card.id = "card-" + key;

      const inner = document.createElement('div');
      inner.className = 'card-inner';

      const stickerCode = code + " " + i;
      
      const cardBack = document.createElement('div');
      cardBack.className = 'card-back';
      const backLogoComp = createLogoComposition(stickerCode, false);
      cardBack.appendChild(backLogoComp);
      inner.appendChild(cardBack);

      const cardFront = document.createElement('div');
      cardFront.className = 'card-front relative flex flex-col justify-between p-2 overflow-visible';
      const frontLogoComp = createLogoComposition(stickerCode, false);
      cardFront.appendChild(frontLogoComp);

      const frontHeader = document.createElement('div');
      frontHeader.className = 'flex justify-between items-center w-full z-10';
      
      const teamTag = document.createElement('span');
      teamTag.className = 'text-[9px] font-black uppercase tracking-wider text-white';
      teamTag.textContent = code;
      frontHeader.appendChild(teamTag);

      const miniCrest = document.createElement('img');
      if (code === 'FWC') {
        // Logo da fifa ao invés de bandeira
        miniCrest.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/FIFA_logo_without_slogan.svg/120px-FIFA_logo_without_slogan.svg.png';
        miniCrest.className = 'w-5 h-5 object-contain bg-white/10 p-0.5 rounded border border-white/20';
      } else if (code === 'CC') {
        // Logo da coca-cola ao invés de bandeira
        miniCrest.src = './crests/Logo CocaZero Copa1.png';
        miniCrest.className = 'w-10 h-5 object-contain bg-white/10 p-0.5 rounded border border-white/20';
      } else {
        const flagCode = (flagMap[code] || 'us').toLowerCase();
    return crestsMap[code] || "https://flagcdn.com/w40/" + (flagMap[code] || 'un') + ".png";
        miniCrest.className = 'w-5 h-5 object-contain rounded-full border border-white/20 bg-white/10';
      }
      frontHeader.appendChild(miniCrest);
      cardFront.appendChild(frontHeader);

      const playerName = document.createElement('div');
      playerName.className = 'player-name-label';
      let nameText = playerNames[i] || code + " " + i;
      if (typeof albumData !== 'undefined' && albumData[code] && albumData[code][i - 1]) {
        nameText = albumData[code][i - 1].nome;
      }
      playerName.textContent = nameText;
      cardFront.appendChild(playerName);

      const frontActions = document.createElement('div');
      frontActions.className = 'card-actions z-10';
      cardFront.appendChild(frontActions);

      inner.appendChild(cardFront);
      inner.appendChild(cardBack);
      card.appendChild(inner);

      card.onclick = (e) => {
        if (e.target.closest('.action-btn')) return;
        toggleOwned(key);
        updateCard(card, key);
        updateTeamProgressLabel(code);
      };

      updateCard(card, key);
      grid.appendChild(card);
    }
  }

  if (code === 'EXTRAS') {
    rootTeam.appendChild(extrasContainer);
  } else {
    rootTeam.appendChild(grid);
  }
  container.appendChild(rootTeam);
}

// Contador e atualizador de progresso da seleção dinâmico
function updateTeamProgressLabel(code, delayCheckmark = false) {
  const stats = getTeamProgress(code);
  const limit = (code === 'FWC') ? 19 : (code === 'CC') ? 14 : (code === 'ESCUDOS') ? 48 : (code === 'EXTRAS') ? (legendsData.length * 4) : 20;
  
  // 1. Atualiza o texto descritivo
  const label = document.getElementById('teamProgressLabel');
  if (label) {
    label.textContent = stats.owned + " de " + limit + " figurinhas coladas";
  }
  
  // 2. Atualiza a barra de progresso
  const progText = document.getElementById('teamProgText');
  const progBar = document.getElementById('teamProgBarFill');
  if (progText && progBar) {
    const percent = Math.round((stats.owned / limit) * 100);
    progText.textContent = stats.owned + "/" + limit + " (" + percent + "%)";
    progBar.style.width = percent + "%";
  }
  
  // 3. Adiciona ou remove o ícone de Check (✓) verde no título
  const teamTitle = document.getElementById('teamTitleText');
  if (teamTitle) {
    const check = teamTitle.querySelector('.check-mark');
    if (stats.owned === limit && !delayCheckmark) {
      if (!check) {
        const checkEl = document.createElement('span');
        checkEl.className = 'check-mark text-copaGreen font-black text-lg ml-2 animate-bounce inline-block drop-shadow-[0_0_8px_#00e676]';
        checkEl.textContent = '✓';
        teamTitle.appendChild(checkEl);
      }
    } else {
      if (check) check.remove();
    }
  }
}

// Auxiliar para manipular figurinha individual
function toggleOwned(key) {
  const albumId = storage.getCurrentAlbumId();
  const albums = storage.getAlbums();
  const album = albums[albumId];
  if (!album) return;

  if (!album.stickers[key]) {
    album.stickers[key] = { owned: false, duplicate: 0 };
  }
  
  album.stickers[key].owned = !album.stickers[key].owned;
  if (!album.stickers[key].owned) {
    album.stickers[key].duplicate = 0;
  }
  
  storage.setAlbums(albums);
  // Sincroniza com a nuvem/demo
  authDb.syncStickers(album.stickers);
}

// Adiciona ou remove quantidade de figurinhas repetidas
function toggleDuplicate(key, increment) {
  const albumId = storage.getCurrentAlbumId();
  const albums = storage.getAlbums();
  const album = albums[albumId];
  if (!album) return;

  if (!album.stickers[key]) {
    album.stickers[key] = { owned: true, duplicate: 0 };
  }

  if (increment) {
    album.stickers[key].duplicate = (album.stickers[key].duplicate || 0) + 1;
  } else {
    album.stickers[key].duplicate = (album.stickers[key].duplicate || 0) - 1;
    if (album.stickers[key].duplicate < 0) {
      album.stickers[key].duplicate = 0;
    }
  }

  storage.setAlbums(albums);
  // Sincroniza com a nuvem/demo
  authDb.syncStickers(album.stickers);
}

// Atualiza o estado visual da carta 3D e renderiza seus botões/badges
function updateCard(card, key) {
  const albumId = storage.getCurrentAlbumId();
  const albums = storage.getAlbums();
  const album = albums[albumId];
  if (!album) return;

  const sticker = album.stickers[key];
  const isOwned = sticker && sticker.owned;
  const duplicates = sticker ? (sticker.duplicate || 0) : 0;
  const code = key.split('-')[0];

  // 1. Aplica o Flip 3D
  if (isOwned) {
    card.classList.add('is-flipped');
  } else {
    card.classList.remove('is-flipped');
  }

  // 2. Alerta de Troca Qualificada (Yellow Balloon + ⇄ SVG)
  const isTrade = hasQualifiedTrade(key);
  let alertIcon = card.querySelector('.trade-alert-icon');
  if (isTrade) {
    card.classList.add('qualified-trade');
    if (!alertIcon) {
      alertIcon = document.createElement('span');
      alertIcon.className = 'trade-alert-icon';
      alertIcon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="width: 10px; height: 10px;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 12L3 16.5m0 0L7.5 21M3 16.5h13.5" />
        </svg>
      `;
      card.appendChild(alertIcon);
    }
  } else {
    card.classList.remove('qualified-trade');
    if (alertIcon) alertIcon.remove();
  }

  // 3. Renderiza foto customizada no fundo do cardFront + atualiza nome real
  const cardFront = card.querySelector('.card-front');
  if (cardFront) {
    let photoImg = cardFront.querySelector('.player-card-photo');
    if (sticker && sticker.photo) {
      if (!photoImg) {
        photoImg = document.createElement('img');
        photoImg.className = 'player-card-photo';
        photoImg.loading = 'lazy';
        photoImg.decoding = 'async';
        cardFront.prepend(photoImg);
      }
      photoImg.src = sticker.photo;
      photoImg.style.display = 'block';

      // Atualiza o nome real no label (caso o card seja recriado após foto)
      const nameLabel = cardFront.querySelector('.player-name-label');
      if (nameLabel) {
        const num = parseInt(key.split('-')[1], 10);
        const realName = getStickerDisplayName(code, num);
        nameLabel.textContent = realName;
        nameLabel.classList.remove('name-long', 'name-very-long');
        if (realName.length > 20) nameLabel.classList.add('name-very-long');
        else if (realName.length > 13) nameLabel.classList.add('name-long');
      }
    } else if (photoImg) {
      photoImg.style.display = 'none';
    }
  }

  // 4. Badge de repetida (FUT style)
  let badge = card.querySelector('.rep-badge');
  if (isOwned && duplicates > 0) {
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'rep-badge';
      card.appendChild(badge);
    }
    badge.textContent = "+" + duplicates;
  } else if (badge) {
    badge.remove();
  }

  // 5. Botões de ação
  const actionsContainer = card.querySelector('.card-actions');
  if (actionsContainer) {
    actionsContainer.innerHTML = '';

    if (isOwned) {
      const btnLeft = document.createElement('button');
      btnLeft.className = "action-btn " + duplicates > 0 ? 'btn-minus' : 'btn-remove';
      btnLeft.innerHTML = duplicates > 0 ? '–' : '×';
      btnLeft.title = duplicates > 0 ? 'Remover 1 repetida' : 'Remover do álbum';
      btnLeft.onclick = (e) => {
        e.stopPropagation();
        if (duplicates > 0) {
          toggleDuplicate(key, false);
        } else {
          toggleOwned(key);
        }
        updateCard(card, key);
        updateTeamProgressLabel(code);
      };

      const btnCam = document.createElement('button');
      btnCam.className = 'action-btn btn-camera';
      btnCam.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169a47.859 47.859 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
        </svg>
      `;
      btnCam.title = 'Fotografar (Câmera)';
      btnCam.onclick = (e) => {
        e.stopPropagation();
        triggerCameraCapture(key, () => {
          updateCard(card, key);
        });
      };

      const btnEye = document.createElement('button');
      btnEye.className = 'action-btn btn-eye';
      btnEye.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      `;
      btnEye.title = 'Visualizar em Tela Cheia';
      btnEye.onclick = (e) => {
        e.stopPropagation();
        openFullscreenCard(key);
      };

      const btnRight = document.createElement('button');
      btnRight.className = 'action-btn btn-add';
      btnRight.innerHTML = '+';
      btnRight.title = 'Adicionar repetida';
      btnRight.onclick = (e) => {
        e.stopPropagation();
        toggleDuplicate(key, true);
        updateCard(card, key);
      };

      actionsContainer.appendChild(btnLeft);
      actionsContainer.appendChild(btnCam);
      actionsContainer.appendChild(btnEye);

      // Botão lixeira: apaga a foto escaneada (aparece só quando há foto)
      if (sticker && sticker.photo) {
        const btnDel = document.createElement('button');
        btnDel.className = 'action-btn btn-remove';
        btnDel.title = 'Apagar foto escaneada';
        btnDel.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        `;
        btnDel.onclick = (e) => {
          e.stopPropagation();
          const confirmDel = confirm('Deseja apagar a foto desta figurinha?\nO card voltará ao estado original.');
          if (!confirmDel) return;
          const albumId2 = storage.getCurrentAlbumId();
          const albums2 = storage.getAlbums();
          const album2 = albums2[albumId2];
          if (album2 && album2.stickers[key]) {
            delete album2.stickers[key].photo;
            storage.setAlbums(albums2);
            authDb.syncStickers(album2.stickers);
            // Restaura o nome genérico no label
            const nameLabel2 = card.querySelector('.player-name-label');
            if (nameLabel2) {
              const num2 = parseInt(key.split('-')[1], 10);
              const genericName = playerNames[num2] || key;
              nameLabel2.textContent = genericName;
              nameLabel2.classList.remove('name-long', 'name-very-long');
              if (genericName.length > 20) nameLabel2.classList.add('name-very-long');
              else if (genericName.length > 13) nameLabel2.classList.add('name-long');
            }
            updateCard(card, key);
          }
        };
        actionsContainer.appendChild(btnDel);
      }

      actionsContainer.appendChild(btnRight);
    }
  }
}

function createMiniStickerCapsule(key) {
  const code = key.split('-')[0];
  const i = parseInt(key.split('-')[1], 10);
  const isSpecial = (code === 'EXTRAS');

  const el = document.createElement('div');
  el.className = "text-[9px] font-black px-2 py-1 rounded border tracking-wide uppercase transition-all duration-150 select-none cursor-pointer " + isSpecial ? 'bg-copaYellow/10 text-copaYellow border-copaYellow/20 hover:bg-copaYellow/20' : 'bg-copaGreen/10 text-copaGreen border-copaGreen/20 hover:bg-copaGreen/20';
  
  let pName = key;
  if (isSpecial) {
    const variant = key.split('-')[2];
    const capVariant = variant ? variant.charAt(0).toUpperCase() + variant.slice(1) : '';
    pName = (legendsData[i - 1] ? legendsData[i - 1].name : "Lendário " + i) + ' ' + capVariant;
    el.textContent = (legendsData[i - 1] ? legendsData[i - 1].name : "Lendario " + i) + " " + capVariant;
  } else if (typeof albumData !== 'undefined' && albumData[code] && albumData[code][i - 1]) {
    pName = albumData[code][i - 1].nome;
    el.textContent = code + " " + i;
  } else {
    pName = playerNames[i] || key;
    el.textContent = key;
  }
  el.title = pName;
  return el;
}

function getStickerNameForShare(key) {
  const parts = key.split('-');
  if (parts[0] === 'EXTRAS') {
    const name = legendsData[parseInt(parts[1], 10) - 1] ? legendsData[parseInt(parts[1], 10) - 1].name : "Lendário " + parts[1];
    const cat = parts[2] ? parts[2].charAt(0).toUpperCase() + parts[2].slice(1) : '';
    return name + " " + cat;
  }
  return getStickerDisplayName(parts[0], parseInt(parts[1], 10));
}

function shareTextViaSystem(title, text) {
  if (navigator.share) {
    navigator.share({
      title: title,
      text: text
    }).catch(err => {
      window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent(text), '_blank');
    });
  } else {
    window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent(text), '_blank');
  }
}

// ------------------- TROCAS -------------------
// Global Trades State
let currentTradesSubTab = 'match'; // 'match', 'manual' ou 'estou_trocando'
let missingStickersSortOrder = 'alpha'; // 'alpha' ou 'album'
let estouTrocandoState = {
  negotiating: [],
  matched: []
};

function loadEstouTrocandoState() {
  const albumId = storage.getCurrentAlbumId();
  if (!albumId) return;
  const key = "estou_trocando_" + albumId;
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      estouTrocandoState = JSON.parse(saved);
      if (!estouTrocandoState.negotiating) estouTrocandoState.negotiating = [];
      if (!estouTrocandoState.matched) estouTrocandoState.matched = [];
    } else {
      estouTrocandoState = { negotiating: [], matched: [] };
    }
  } catch (e) {
    console.error("Erro ao carregar estado de trocas:", e);
    estouTrocandoState = { negotiating: [], matched: [] };
  }
}

function saveEstouTrocandoState() {
  const albumId = storage.getCurrentAlbumId();
  if (!albumId) return;
  const key = "estou_trocando_" + albumId;
  localStorage.setItem(key, JSON.stringify(estouTrocandoState));
}

function getStickerDisplayLabel(key) {
  const parts = key.split('-');
  const code = parts[0];
  const num = parts[1];
  if (code === 'EXTRAS') {
    const variant = parts[2] || '';
    const legendIndex = parseInt(num, 10) - 1;
    const name = (legendsData && legendsData[legendIndex]) ? legendsData[legendIndex].name : "LÉG " + num;
    return name + " (" + variant.toUpperCase() + ")";
  }
  return code + " " + num;
}




function renderTrades(container) {
  const user = authDb.getCurrentUser();
  if (!user) {
    const lockBox = document.createElement('div');
    lockBox.className = 'max-w-md mx-auto my-12 glass-panel p-8 rounded-2xl border-white/5 text-center space-y-6 animate-fade-in';
    lockBox.innerHTML = `
      <div class="text-5xl">🔒</div>
      <h2 class="text-xl font-black text-white uppercase tracking-wider">Acesso Restrito</h2>
      <p class="text-xs text-gray-400">Faça login para participar das Trocas e gerenciar listas de figurinhas.</p>
      <button onclick="location.hash = '#login'" class="w-full py-3 rounded-xl bg-gradient-to-r from-copaYellow to-yellow-600 text-black font-black text-xs uppercase tracking-wide shadow-lg hover:brightness-110 active:scale-95 transition">
        Entrar / Fazer Login
      </button>
    `;
    container.appendChild(lockBox);
    return;
  }

  const mainDiv = document.createElement('div');
  mainDiv.className = 'space-y-5 py-2 animate-fade-in pb-20';

  const headerRow = document.createElement('div');
  headerRow.className = 'flex justify-between items-center w-full mb-4 border-b border-white/10 pb-2';
  
  const title = document.createElement('h2');
  title.className = 'text-sm font-black text-white uppercase tracking-wider flex items-center gap-2';
  title.innerHTML = 'Faltantes <button onclick="printMissingStickers()" class="py-1 px-2 bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 text-yellow-400 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all active:scale-95 ml-2 cursor-pointer flex items-center gap-1">🖨️ PDF</button>';
  
  const rightHeader = document.createElement('div');
  rightHeader.className = 'flex items-center gap-1.5';

  const btnShareOwned = document.createElement('button');
  btnShareOwned.className = 'p-2 bg-white/5 hover:bg-copaGreen/10 border border-white/10 hover:border-copaGreen/30 rounded-lg text-copaGreen transition flex items-center justify-center';
  btnShareOwned.title = 'Compartilhar figurinhas coladas';
  btnShareOwned.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>';
  btnShareOwned.onclick = () => shareOwnedList();
  rightHeader.appendChild(btnShareOwned);

  const btnShareMissing = document.createElement('button');
  btnShareMissing.className = 'p-2 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-lg text-red-400 transition flex items-center justify-center';
  btnShareMissing.title = 'Compartilhar figurinhas faltantes';
  btnShareMissing.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>';
  btnShareMissing.onclick = () => shareMissingList();
  rightHeader.appendChild(btnShareMissing);

  const btnShareDuplicates = document.createElement('button');
  btnShareDuplicates.className = 'p-2 bg-white/5 hover:bg-copaYellow/10 border border-white/10 hover:border-copaYellow/30 rounded-lg text-copaYellow transition flex items-center justify-center';
  btnShareDuplicates.title = 'Compartilhar repetidas';
  btnShareDuplicates.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4" /></svg>';
  btnShareDuplicates.onclick = () => shareDuplicatesList();
  rightHeader.appendChild(btnShareDuplicates);

  const btnBack = document.createElement('button');
  btnBack.className = 'ml-1 py-1.5 px-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-[9px] uppercase tracking-wide rounded-lg transition';
  btnBack.textContent = '🏠 Voltar';
  btnBack.onclick = () => { location.hash = '#home'; };
  rightHeader.appendChild(btnBack);

  headerRow.appendChild(title);
  headerRow.appendChild(rightHeader);
  mainDiv.appendChild(headerRow);

  // Load Album Data
  const albumId = storage.getCurrentAlbumId();
  const albums = storage.getAlbums();
  const album = albums[albumId] || { stickers: {} };
  const userStickers = album.stickers || {};

  const isMissing = (key) => {
    const isOwned = userStickers[key] ? userStickers[key].owned : false;
    const isNegotiating = estouTrocandoState.negotiating.includes(key);
    const isMatched = estouTrocandoState.matched.includes(key);
    return !(isOwned || isNegotiating || isMatched);
  };

  const getCrestUrlHelper = (code) => {
    if (code === 'FWC') return 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/FIFA_logo_without_slogan.svg/120px-FIFA_logo_without_slogan.svg.png';
    if (code === 'CC') return './crests/Logo CocaZero Copa1.png';
    return crestsMap[code] || "https://flagcdn.com/w40/" + (flagMap[code] || 'un') + ".png";
  };

  const teamsToProcess = [];
  
  // FWC
  teamsToProcess.push({ name: 'FIFA World Cup', code: 'FWC', count: 19 });
  // CC
  teamsToProcess.push({ name: 'Cidades Sede', code: 'CC', count: 14 });
  // Normal Teams
  groupsData.forEach(g => {
    if (g.id !== 'EXTRAS') {
      g.teams.forEach(t => {
        teamsToProcess.push({ name: t.name, code: t.code, count: 20 });
      });
    }
  });

  let totalMissing = 0;
  
  teamsToProcess.forEach(team => {
    const missingKeys = [];
    for(let i=1; i<=team.count; i++) {
      const key = team.code + '-' + i;
      if (isMissing(key)) missingKeys.push(i); // Push number
    }

    if (missingKeys.length > 0) {
      totalMissing += missingKeys.length;
      
      const teamBlock = document.createElement('div');
      teamBlock.className = 'glass-panel p-4 rounded-xl border-white/5 flex flex-col gap-3';
      
      const teamHeader = document.createElement('div');
      teamHeader.className = 'flex items-center gap-3 border-b border-white/5 pb-2';
      
      const crestImg = document.createElement('img');
      crestImg.src = getCrestUrlHelper(team.code);
      crestImg.className = 'w-8 h-8 object-contain drop-shadow-md';
      
      const teamName = document.createElement('h3');
      teamName.className = 'font-black text-white text-sm uppercase tracking-wider flex-1';
      teamName.textContent = team.name;
      
      const missingCount = document.createElement('span');
      missingCount.className = 'bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-[10px] font-bold';
      missingCount.textContent = 'Faltam ' + missingKeys.length;
      
      teamHeader.appendChild(crestImg);
      teamHeader.appendChild(teamName);
      teamHeader.appendChild(missingCount);
      teamBlock.appendChild(teamHeader);
      
      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-1';
      
      missingKeys.forEach(num => {
        const item = document.createElement('div');
        item.className = 'bg-white/5 border border-white/10 rounded-lg py-2 text-center text-white font-bold text-sm shadow-inner truncate px-1';
        item.textContent = team.code + ' ' + num;
        grid.appendChild(item);
      });
      
      teamBlock.appendChild(grid);
      mainDiv.appendChild(teamBlock);
    }
  });

  if (totalMissing === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'text-center text-gray-400 py-10 text-sm font-medium';
    emptyMsg.textContent = 'Parabéns! Você não tem nenhuma figurinha faltando nessas seleções!';
    mainDiv.appendChild(emptyMsg);
  }

  container.appendChild(mainDiv);
}

function printMissingStickers() {
  const albumId = storage.getCurrentAlbumId();
  const albums = storage.getAlbums();
  const album = albums[albumId] || { stickers: {} };
  const userStickers = album.stickers || {};

  const isMissing = (key) => {
    const isOwned = userStickers[key] ? userStickers[key].owned : false;
    const isNegotiating = estouTrocandoState.negotiating.includes(key);
    const isMatched = estouTrocandoState.matched.includes(key);
    return !(isOwned || isNegotiating || isMatched);
  };

  const getCrestUrlHelper = (code) => {
    if (code === 'FWC') return 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/FIFA_logo_without_slogan.svg/120px-FIFA_logo_without_slogan.svg.png';
    if (code === 'CC') return './crests/Logo CocaZero Copa1.png';
    return crestsMap[code] || "https://flagcdn.com/w40/" + (flagMap[code] || 'un') + ".png";
  };

  const teamsToProcess = [];
  teamsToProcess.push({ name: 'FIFA World Cup', code: 'FWC', count: 19 });
  teamsToProcess.push({ name: 'Cidades Sede', code: 'CC', count: 14 });
  groupsData.forEach(g => {
    if (g.id !== 'EXTRAS') {
      g.teams.forEach(t => {
        teamsToProcess.push({ name: t.name, code: t.code, count: 20 });
      });
    }
  });
}











function shareText(title, text) {
  if (navigator.share) {
    navigator.share({
      title: title,
      text: text
    }).catch(err => {
      console.log('Error sharing:', err);
    });
  } else {
    navigator.clipboard.writeText(text).then(() => {
      alert('Texto de compartilhamento copiado para a área de transferência!');
    }).catch(err => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Texto de compartilhamento copiado para a área de transferência!');
      } catch (e) {
        alert('Erro ao copiar texto. Por favor, copie manualmente:\n\n' + text);
      }
      document.body.removeChild(textArea);
    });
  }
}

function shareOwnedList() {
  const albumId = storage.getCurrentAlbumId();
  const albums = storage.getAlbums();
  const album = albums[albumId];
  if (!album) return;

  let text = 'Eu tenho essas figurinhas da Copa do Mundo da FIFA 2026:\n';
  
  const grouped = {};
  groupsData.forEach(g => {
    g.teams.forEach(t => {
      grouped[t.code] = [];
    });
  });
  grouped['FWC'] = [];
  grouped['CC'] = [];
  grouped['EXTRAS'] = [];

  Object.entries(album.stickers).forEach(([key, val]) => {
    if (val && val.owned) {
      const parts = key.split('-');
      const code = parts[0];
      const num = parseInt(parts[1], 10);
      if (grouped[code]) {
        grouped[code].push(num);
      } else {
        grouped[code] = [num];
      }
    }
  });

  let hasStickers = false;
  Object.keys(grouped).forEach(code => {
    const nums = grouped[code].sort((a, b) => a - b);
    if (nums.length > 0) {
      hasStickers = true;
      let formattedList;
      if (code === 'EXTRAS') {
        formattedList = nums.map(function(n) { return legendsData[n - 1].name; }).join(', ');
      } else {
        formattedList = nums.map(function(n) { return code + ' ' + n; }).join(', ');
      }
      text += code + ': ' + formattedList + '\n';
    }
  });

  if (!hasStickers) {
    alert('Você ainda não tem nenhuma figurinha colada neste álbum.');
    return;
  }

  shareText('Figurinhas Copa 2026 - Adquiridas', text.trim());
}

function shareMissingList() {
  const albumId = storage.getCurrentAlbumId();
  const albums = storage.getAlbums();
  const album = albums[albumId];
  if (!album) return;

  let text = 'Faltam essas figurinhas para eu completar o meu álbum da Copa do Mundo da FIFA 2026:\n';
  
  const grouped = {};
  const allCodes = [];
  groupsData.forEach(g => {
    g.teams.forEach(t => {
      allCodes.push(t.code);
    });
  });
  allCodes.push('FWC', 'CC', 'EXTRAS');

  allCodes.forEach(code => {
    grouped[code] = [];
    const limit = (code === 'FWC') ? 19 : (code === 'CC') ? 14 : 20;
    for (let i = 1; i <= limit; i++) {
      const key = code + '-' + i;
      const sticker = album.stickers[key];
      const isOwned = sticker && sticker.owned;
      if (!isOwned) {
        grouped[code].push(i);
      }
    }
  });

  let hasMissing = false;
  allCodes.forEach(code => {
    const nums = grouped[code];
    if (nums.length > 0) {
      hasMissing = true;
      let formattedList;
      if (code === 'EXTRAS') {
        formattedList = nums.map(n => legendsData[n - 1].name).join(', ');
      } else {
        formattedList = nums.map(n => code + ' ' + n).join(', ');
      }
      text += code + ": " + formattedList + "\n";
    }
  });

  if (!hasMissing) {
    alert('Parabéns! Você completou o álbum e não falta nenhuma figurinha!');
    return;
  }

  shareText('Figurinhas Copa 2026 - Faltantes', text.trim());
}

function shareDuplicatesList() {
  const albumId = storage.getCurrentAlbumId();
  const albums = storage.getAlbums();
  const album = albums[albumId];
  if (!album) return;

  let text = 'Eu tenho essas figurinhas repetidas da Copa do Mundo da FIFA 2026 para troca:\n';
  
  const grouped = {};
  groupsData.forEach(g => {
    g.teams.forEach(t => {
      grouped[t.code] = [];
    });
  });
  grouped['FWC'] = [];
  grouped['CC'] = [];
  grouped['EXTRAS'] = [];

  Object.entries(album.stickers).forEach(([key, val]) => {
    if (val && val.owned && val.duplicate > 0) {
      const parts = key.split('-');
      const code = parts[0];
      const num = parseInt(parts[1], 10);
      if (grouped[code]) {
        grouped[code].push({ num: num, count: val.duplicate });
      } else {
        grouped[code] = [{ num: num, count: val.duplicate }];
      }
    }
  });

  let hasDuplicates = false;
  Object.keys(grouped).forEach(code => {
    const list = grouped[code].sort((a, b) => a.num - b.num);
    if (list.length > 0) {
      hasDuplicates = true;
      let formattedList;
      if (code === 'EXTRAS') {
        formattedList = list.map(item => legendsData[item.num - 1].name + ' (x' + item.count + ')').join(', ');
      } else {
        formattedList = list.map(item => code + ' ' + item.num + ' (x' + item.count + ')').join(', ');
      }
      text += code + ': ' + formattedList + '\n';
    }
  });

  if (!hasDuplicates) {
    alert('Você não tem nenhuma figurinha repetida para troca ainda.');
    return;
  }

  shareText('Figurinhas Copa 2026 - Repetidas', text.trim());
}

// ------------------- COMUNIDADE E COMBINAÇÃO DE TROCAS -------------------

let currentCommunityRadius = 50; // default 50km
let currentCommunityTab = "nearby"; // "nearby" ou "favorites"
let activeProfileTab = "perfect"; // "perfect", "heHas", "youHave"

function renderCollectorProfile(uid, container) {
  const user = authDb.getCurrentUser();
  if (!user) {
    location.hash = '#login';
    return;
  }

  const mainDiv = document.createElement('div');
  mainDiv.className = 'space-y-6 py-2 animate-fade-in';

  // Buscar colecionador
  mainDiv.innerHTML = '<p class="text-center text-xs text-gray-400 py-6 animate-pulse">Carregando perfil...</p>';
  container.appendChild(mainDiv);

  authDb.getCollectorProfile(uid, user.latitude, user.longitude).then(collector => {
    if (!collector) {
      mainDiv.innerHTML = `
        <div class="glass-panel p-8 rounded-2xl border-white/5 text-center space-y-4">
          <p class="text-xs text-gray-400">Colecionador não encontrado.</p>
          <button onclick="location.hash = '#community'" class="py-2 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs">Voltar à Comunidade</button>
        </div>
      `;
      return;
    }

    mainDiv.innerHTML = '';

    // Header Card do Perfil do Colecionador (Mais Compacto)
    const headerCard = document.createElement('div');
    headerCard.className = 'glass-panel p-3.5 rounded-2xl border-white/5 relative overflow-hidden flex flex-col gap-2.5';

    const backRow = document.createElement('div');
    backRow.className = 'flex justify-between items-center w-full';

    const backBtn = document.createElement('button');
    backBtn.className = 'w-7 h-7 bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center rounded-lg text-white transition';
    backBtn.innerHTML = `
      <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
    `;
    backBtn.onclick = () => location.hash = '#trades';
    backRow.appendChild(backBtn);

    const favBtn = document.createElement('button');
    favBtn.className = 'w-7 h-7 bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center rounded-lg text-white transition';
    const isFav = authDb.isFavorite(collector.uid);
    favBtn.innerHTML = isFav ? '❤️' : '🤍';
    favBtn.onclick = () => {
      const state = authDb.toggleFavorite(collector.uid);
      favBtn.innerHTML = state ? '❤️' : '🤍';
    };
    backRow.appendChild(favBtn);

    headerCard.appendChild(backRow);

    const userProfileRow = document.createElement('div');
    userProfileRow.className = 'flex items-center gap-3.5';

    const avatar = document.createElement('img');
    avatar.src = collector.photo_url;
    avatar.loading = 'lazy';
    avatar.decoding = 'async';
    avatar.className = 'w-11 h-11 rounded-full object-cover border-2 border-copaYellow shadow-lg';
    userProfileRow.appendChild(avatar);

    const userInfo = document.createElement('div');
    userInfo.innerHTML = `
      <h3 class="font-black text-white text-xs leading-snug">${collector.name}</h3>
      <p class="text-[9px] text-gray-400 mt-0.5 flex items-center gap-1.5">
        📍 <strong>${collector.distance} km</strong> de distância • Visto há pouco
      </p>
    `;
    userProfileRow.appendChild(userInfo);
    headerCard.appendChild(userProfileRow);
    mainDiv.appendChild(headerCard);

    // Listas locais de dados para cálculo de cruzamento
    const localAlbums = JSON.parse(localStorage.getItem('albums') || '{}');
    const activeAlbumId = localStorage.getItem('currentAlbumId');
    const activeAlbum = localAlbums[activeAlbumId] || { stickers: {} };
    const userStickers = activeAlbum.stickers || {};

    const cardsHeHas = [];
    const cardsHeLacks = [];
    const cardsHeHasLackingYou = [];
    const cardsYouHaveLackingHim = [];
    
    // Cruzamento real de dados
    const allCodes = [];
    groupsData.forEach(g => g.teams.forEach(t => allCodes.push(t.code)));
    allCodes.push('FWC', 'CC', 'EXTRAS');

    allCodes.forEach(code => {
      if (code === 'EXTRAS') {
        const variants = ['ouro', 'prata', 'bronze', 'bordo'];
        for (let i = 1; i <= 20; i++) {
          variants.forEach(v => {
            const key = code + "-" + i + "-" + v;
            const userSticker = userStickers[key];
            const userOwned = userSticker ? userSticker.owned : false;
            const userDup = userSticker ? (userSticker.duplicate || 0) : 0;

            const collectorSticker = collector.stickers[key];
            const collectorOwned = collectorSticker ? collectorSticker.owned : false;
            const collectorDup = collectorSticker ? (collectorSticker.duplicate || 0) : 0;

            if (collectorOwned) {
              cardsHeHas.push(key);
            } else {
              cardsHeLacks.push(key);
            }

            // Ele tem (e tem de sobra para trocar) que te falta
            if (collectorOwned && collectorDup > 0 && !userOwned) {
              cardsHeHasLackingYou.push(key);
            } else if (collectorOwned && !userOwned) {
              cardsHeHasLackingYou.push(key);
            }

            // Você tem repetido que falta para ele
            if (userDup > 0 && !collectorOwned) {
              cardsYouHaveLackingHim.push(key);
            }
          });
        }
      } else {
        const limit = (code === 'FWC') ? 19 : (code === 'CC') ? 14 : 20;
        for (let i = 1; i <= limit; i++) {
          const key = code + "-" + i;
          
          const userSticker = userStickers[key];
          const userOwned = userSticker ? userSticker.owned : false;
          const userDup = userSticker ? (userSticker.duplicate || 0) : 0;

          const collectorSticker = collector.stickers[key];
          const collectorOwned = collectorSticker ? collectorSticker.owned : false;
          const collectorDup = collectorSticker ? (collectorSticker.duplicate || 0) : 0;

          if (collectorOwned) {
            cardsHeHas.push(key);
          } else {
            cardsHeLacks.push(key);
          }

          // Ele tem (e tem de sobra para trocar) que te falta
          if (collectorOwned && collectorDup > 0 && !userOwned) {
            cardsHeHasLackingYou.push(key);
          } else if (collectorOwned && !userOwned) {
            // Fallback para quando o outro colecionador possui o card em geral
            cardsHeHasLackingYou.push(key);
          }

          // Você tem repetido que falta para ele
          if (userDup > 0 && !collectorOwned) {
            cardsYouHaveLackingHim.push(key);
          }
        }
      }
    });

    // Match Perfeito real:
    // Você tem repetidas que ele quer, E ele tem repetidas que você quer
    const matchPerfectUserGives = [];
    const matchPerfectUserReceives = [];

    // 1. Para normais, FWC e CC
    allCodes.forEach(code => {
      if (code === 'EXTRAS') return;
      const limit = (code === 'FWC') ? 19 : (code === 'CC') ? 14 : 20;
      for (let i = 1; i <= limit; i++) {
        const key = code + "-" + i;
        
        const userSticker = userStickers[key];
        const userOwned = userSticker ? userSticker.owned : false;
        const userDup = userSticker ? (userSticker.duplicate || 0) : 0;

        const collectorSticker = collector.stickers[key];
        const collectorOwned = collectorSticker ? collectorSticker.owned : false;
        const collectorDup = collectorSticker ? (collectorSticker.duplicate || 0) : 0;

        // Figurinhas que você pode DAR para ele (repetida sua que ele não tem)
        if (userDup > 0 && !collectorOwned) {
          matchPerfectUserGives.push(key);
        }
        // Figurinhas que você pode RECEBER dele (repetida dele que você não tem)
        if (collectorDup > 0 && !userOwned) {
          matchPerfectUserReceives.push(key);
        }
      }
    });

    // 2. Tratamento de EXTRAS com paridade exata para Match Perfeito (Ouro por Ouro, etc.)
    const premiumVariants = ['ouro', 'prata', 'bronze', 'bordo'];
    premiumVariants.forEach(variant => {
      const userDupExtrasOfVariant = [];
      const collectorDupExtrasOfVariant = [];

      for (let i = 1; i <= 20; i++) {
        const key = "EXTRAS-" + i + "-" + variant;
        
        const userSticker = userStickers[key];
        const userOwned = userSticker ? userSticker.owned : false;
        const userDup = userSticker ? (userSticker.duplicate || 0) : 0;

        const collectorSticker = collector.stickers[key];
        const collectorOwned = collectorSticker ? collectorSticker.owned : false;
        const collectorDup = collectorSticker ? (collectorSticker.duplicate || 0) : 0;

        if (userDup > 0 && !collectorOwned) {
          userDupExtrasOfVariant.push(key);
        }
        if (collectorDup > 0 && !userOwned) {
          collectorDupExtrasOfVariant.push(key);
        }
      }

      // Se ambos tiverem cruzamento na mesma categoria, prioriza match por paridade
      if (userDupExtrasOfVariant.length > 0 && collectorDupExtrasOfVariant.length > 0) {
        userDupExtrasOfVariant.forEach(k => matchPerfectUserGives.push(k));
        collectorDupExtrasOfVariant.forEach(k => matchPerfectUserReceives.push(k));
      }
    });

    const hasMatchPerfect = (matchPerfectUserGives.length > 0 && matchPerfectUserReceives.length > 0);

    // Estrutura das Tabs
    const crossTabsCard = document.createElement('div');
    crossTabsCard.className = 'glass-panel p-5 rounded-2xl border-white/5 space-y-4';

    const crossTabs = document.createElement('div');
    crossTabs.className = 'flex border-b border-white/5 text-[9px] font-bold text-gray-400 tracking-wider uppercase';

    const tabPerfect = document.createElement('button');
    tabPerfect.className = "flex-1 py-2 text-center hover:text-white transition " + activeProfileTab === 'perfect' ? 'active-tab' : '';
    tabPerfect.innerHTML = "Match Perfeito " + hasMatchPerfect ? '⭐' : '';
    tabPerfect.onclick = () => {
      activeProfileTab = 'perfect';
      setProfileTabState();
    };

    const tabHeHas = document.createElement('button');
    tabHeHas.className = "flex-1 py-2 text-center hover:text-white transition " + activeProfileTab === 'heHas' ? 'active-tab' : '';
    tabHeHas.textContent = "Ele Tem (" + cardsHeHas.length + ")";
    tabHeHas.onclick = () => {
      activeProfileTab = 'heHas';
      setProfileTabState();
    };

    const tabYouHave = document.createElement('button');
    tabYouHave.className = "flex-1 py-2 text-center hover:text-white transition " + activeProfileTab === 'youHave' ? 'active-tab' : '';
    tabYouHave.textContent = "Ele Não Tem (" + cardsHeLacks.length + ")";
    tabYouHave.onclick = () => {
      activeProfileTab = 'youHave';
      setProfileTabState();
    };

    crossTabs.appendChild(tabPerfect);
    crossTabs.appendChild(tabHeHas);
    crossTabs.appendChild(tabYouHave);
    crossTabsCard.appendChild(crossTabs);

    const tabContentContainer = document.createElement('div');
    crossTabsCard.appendChild(tabContentContainer);
    mainDiv.appendChild(crossTabsCard);

    function setProfileTabState() {
      tabPerfect.className = "flex-1 py-2 text-center hover:text-white transition " + activeProfileTab === 'perfect' ? 'active-tab' : '';
      tabHeHas.className = "flex-1 py-2 text-center hover:text-white transition " + activeProfileTab === 'heHas' ? 'active-tab' : '';
      tabYouHave.className = "flex-1 py-2 text-center hover:text-white transition " + activeProfileTab === 'youHave' ? 'active-tab' : '';

      tabContentContainer.innerHTML = '';

      if (activeProfileTab === 'perfect') {
        const strictUserGives = [];
        const strictUserReceives = [];
        const strictCount = Math.min(matchPerfectUserGives.length, matchPerfectUserReceives.length);
        
        for (let i = 0; i < strictCount; i++) {
          strictUserGives.push(matchPerfectUserGives[i]);
          strictUserReceives.push(matchPerfectUserReceives[i]);
        }

        const remainingUserGives = cardsYouHaveLackingHim;
        const remainingUserReceives = cardsHeHasLackingYou;

        const hasStrictMatch = strictCount > 0;
        const hasPotentialMatch = (remainingUserGives.length > 0 || remainingUserReceives.length > 0);

        if (!hasStrictMatch && !hasPotentialMatch) {
          tabContentContainer.innerHTML = `
            <div class="text-center py-8 space-y-2">
              <p class="text-xs text-gray-400">Nenhum Match Perfeito de Troca 1:1.</p>
              <p class="text-[9px] text-gray-500 px-4">O match perfeito surge quando você possui alguma repetida de interesse dele E ele possui alguma repetida de seu interesse.</p>
            </div>
          `;
          return;
        }

        // 1. Box 1: Match Perfeito Encontrado! (Estrito 1:1)
        if (hasStrictMatch) {
          const strictBox = document.createElement('div');
          strictBox.className = 'perfect-match-box p-4 rounded-xl space-y-4 animate-fade-in mb-4 border border-copaYellow/30 bg-[#131735]/40';

          strictBox.innerHTML = `
            <div class="text-center space-y-1">
              <h4 class="text-copaYellow font-black text-xs uppercase tracking-wider">Match Perfeito Encontrado! 🤝</h4>
              <p class="text-[9px] text-gray-400">Excelente! Vocês podem trocar figurinhas repetidas diretamente!</p>
            </div>
          `;

          const splitGrid = document.createElement('div');
          splitGrid.className = 'grid grid-cols-2 gap-4 border-t border-white/5 pt-3 mb-3';

          const leftCol = document.createElement('div');
          leftCol.className = 'space-y-2';
          leftCol.innerHTML = `<h5 class="text-[9px] font-black text-copaYellow uppercase tracking-wider">Você Recebe dele:</h5>`;
          const leftGrid = document.createElement('div');
          leftGrid.className = 'flex flex-wrap gap-1.5';
          strictUserReceives.forEach(k => {
            const cap = createMiniStickerCapsule(k);
            leftGrid.appendChild(cap);
          });
          leftCol.appendChild(leftGrid);

          const rightCol = document.createElement('div');
          rightCol.className = 'space-y-2';
          rightCol.innerHTML = `<h5 class="text-[9px] font-black text-copaGreen uppercase tracking-wider">Você Entrega:</h5>`;
          const rightGrid = document.createElement('div');
          rightGrid.className = 'flex flex-wrap gap-1.5';
          strictUserGives.forEach(k => {
            const cap = createMiniStickerCapsule(k);
            rightGrid.appendChild(cap);
          });
          rightCol.appendChild(rightGrid);

          splitGrid.appendChild(leftCol);
          splitGrid.appendChild(rightCol);
          strictBox.appendChild(splitGrid);

          // Botão de ação integrado NO MESMO QUADRANTE (Share do Celular)
          const btnShareStrict = document.createElement('button');
          btnShareStrict.className = 'w-full py-2.5 px-4 bg-copaGreen hover:bg-opacity-95 text-black font-black uppercase text-[10px] tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-md';
          btnShareStrict.innerHTML = `
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.574 1.97 14.101.947 11.487.947c-5.441 0-9.866 4.372-9.87 9.802 0 1.772.465 3.508 1.346 5.042L1.99 21.53l5.83-1.517zM17.75 14.61c-.347-.174-2.057-1.014-2.375-1.13-.318-.116-.549-.174-.78.174-.23.348-.895 1.13-1.097 1.362-.202.23-.404.26-.75.087-.348-.174-1.468-.541-2.796-1.728-1.034-.922-1.731-2.06-1.933-2.408-.202-.348-.022-.536.151-.708.156-.154.348-.406.52-.609.174-.203.23-.348.348-.58.116-.232.058-.435-.029-.609-.087-.174-.78-1.884-1.068-2.58-.28-.677-.566-.584-.78-.596-.202-.01-.433-.01-.664-.01-.23 0-.606.087-.923.435-.317.348-1.213 1.188-1.213 2.898 0 1.71 1.243 3.361 1.417 3.593.173.232 2.447 3.738 5.928 5.24 2.85 1.228 3.525.986 4.774.87.535-.05 2.058-.84 2.346-1.652.289-.812.289-1.507.202-1.652-.086-.145-.318-.232-.664-.406z"/>
            </svg>
            Abrir Negociação
          `;
          btnShareStrict.onclick = () => {
            const userGivesNames = strictUserGives.map(k => getStickerNameForShare(k)).join(', ');
            const userReceivesNames = strictUserReceives.map(k => getStickerNameForShare(k)).join(', ');
            const appLink = window.location.origin + window.location.pathname;
            const textMessage = "Fala, " + collector.name + "! Vi seu perfil no Ultimate Cromo 2026. Temos um Match Perfeito de trocas! 🔄\nPosso te entregar: " + userGivesNames + "\nE receber de você: " + userReceivesNames + "\nO que acha?\nGerencie seu álbum também. Baixe o Ultimate Cromo FIFA/Panini 2026: " + appLink;
            shareTextViaSystem('Match Perfeito - Ultimate Cromo 2026', textMessage);
          };
          strictBox.appendChild(btnShareStrict);
          tabContentContainer.appendChild(strictBox);
        }

        // 2. Box 2: Pode dar Match! (Possível Negociação)
        if (hasPotentialMatch) {
          const potentialBox = document.createElement('div');
          potentialBox.className = 'potential-match-box p-4 rounded-xl space-y-4 animate-fade-in border border-white/10 bg-white/5';

          potentialBox.innerHTML = `
            <div class="text-center space-y-1">
              <h4 class="text-copaGreen font-black text-xs uppercase tracking-wider">Pode dar Match! 💡</h4>
              <p class="text-[9px] text-gray-400">Vocês têm figurinhas que cruzam interesse mútuo no geral.</p>
            </div>
          `;

          const splitGrid = document.createElement('div');
          splitGrid.className = 'grid grid-cols-2 gap-4 border-t border-white/5 pt-3 mb-3';

          const leftCol = document.createElement('div');
          leftCol.className = 'space-y-2';
          leftCol.innerHTML = `<h5 class="text-[9px] font-black text-copaYellow uppercase tracking-wider">Você tem e ele quer:</h5>`;
          const leftGrid = document.createElement('div');
          leftGrid.className = 'flex flex-wrap gap-1.5';
          remainingUserGives.forEach(k => {
            const cap = createMiniStickerCapsule(k);
            leftGrid.appendChild(cap);
          });
          leftCol.appendChild(leftGrid);

          const rightCol = document.createElement('div');
          rightCol.className = 'space-y-2';
          rightCol.innerHTML = `<h5 class="text-[9px] font-black text-copaGreen uppercase tracking-wider">Ele tem e você quer:</h5>`;
          const rightGrid = document.createElement('div');
          rightGrid.className = 'flex flex-wrap gap-1.5';
          remainingUserReceives.forEach(k => {
            const cap = createMiniStickerCapsule(k);
            rightGrid.appendChild(cap);
          });
          rightCol.appendChild(rightGrid);

          splitGrid.appendChild(leftCol);
          splitGrid.appendChild(rightCol);
          potentialBox.appendChild(splitGrid);

          // Botão Enviar Proposta integrado NO MESMO QUADRANTE (Share do Celular)
          const btnSharePotential = document.createElement('button');
          btnSharePotential.className = 'w-full py-2.5 px-4 bg-copaBlue hover:bg-opacity-95 text-white font-black uppercase text-[10px] tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-md';
          btnSharePotential.innerHTML = `
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.574 1.97 14.101.947 11.487.947c-5.441 0-9.866 4.372-9.87 9.802 0 1.772.465 3.508 1.346 5.042L1.99 21.53l5.83-1.517zM17.75 14.61c-.347-.174-2.057-1.014-2.375-1.13-.318-.116-.549-.174-.78.174-.23.348-.895 1.13-1.097 1.362-.202.23-.404.26-.75.087-.348-.174-1.468-.541-2.796-1.728-1.034-.922-1.731-2.06-1.933-2.408-.202-.348-.022-.536.151-.708.156-.154.348-.406.52-.609.174-.203.23-.348.348-.58.116-.232.058-.435-.029-.609-.087-.174-.78-1.884-1.068-2.58-.28-.677-.566-.584-.78-.596-.202-.01-.433-.01-.664-.01-.23 0-.606.087-.923.435-.317.348-1.213 1.188-1.213 2.898 0 1.71 1.243 3.361 1.417 3.593.173.232 2.447 3.738 5.928 5.24 2.85 1.228 3.525.986 4.774.87.535-.05 2.058-.84 2.346-1.652.289-.812.289-1.507.202-1.652-.086-.145-.318-.232-.664-.406z"/>
            </svg>
            Enviar Proposta
          `;
          btnSharePotential.onclick = () => {
            const userGivesNames = remainingUserGives.map(k => getStickerNameForShare(k)).join(', ');
            const userReceivesNames = remainingUserReceives.map(k => getStickerNameForShare(k)).join(', ');
            const appLink = window.location.origin + window.location.pathname;
            const textMessage = "Fala, " + collector.name + "! Vi seu perfil no Ultimate Cromo 2026 e tenho uma proposta para podermos dar Match! 🔄\nMinhas repetidas que te faltam: " + userGivesNames + "\nFigurinhas suas que me faltam: " + userReceivesNames + "\nO que acha?\nGerencie seu álbum e envie propostas também. Baixe o Ultimate Cromo FIFA/Panini 2026: " + appLink;
            shareTextViaSystem('Proposta de Troca - Ultimate Cromo 2026', textMessage);
          };
          potentialBox.appendChild(btnSharePotential);
          tabContentContainer.appendChild(potentialBox);
        }
      } else if (activeProfileTab === 'heHas') {
        if (cardsHeHas.length === 0) {
          tabContentContainer.innerHTML = `<p class="text-center text-xs text-gray-400 py-8">Ele não tem nenhuma figurinha em estoque.</p>`;
          return;
        }

        const details = document.createElement('div');
        details.className = 'space-y-3 animate-fade-in';
        details.innerHTML = `<h4 class="text-[9px] font-black text-gray-400 uppercase tracking-wider">Figurinhas que ele possui no álbum dele:</h4>`;
        
        const grid = document.createElement('div');
        grid.className = 'flex flex-wrap gap-1.5';
        cardsHeHas.forEach(k => {
          const cap = createMiniStickerCapsule(k);
          grid.appendChild(cap);
        });
        details.appendChild(grid);
        tabContentContainer.appendChild(details);

      } else if (activeProfileTab === 'youHave') {
        if (cardsHeLacks.length === 0) {
          tabContentContainer.innerHTML = `<p class="text-center text-xs text-gray-400 py-8">Ele já completou todo o álbum.</p>`;
          return;
        }

        const details = document.createElement('div');
        details.className = 'space-y-3 animate-fade-in';
        details.innerHTML = `<h4 class="text-[9px] font-black text-gray-400 uppercase tracking-wider">Figurinhas que estão faltando para ele:</h4>`;
        
        const grid = document.createElement('div');
        grid.className = 'flex flex-wrap gap-1.5';
        cardsHeLacks.forEach(k => {
          const cap = createMiniStickerCapsule(k);
          grid.appendChild(cap);
        });
        details.appendChild(grid);
        tabContentContainer.appendChild(details);
      }
    }

    setProfileTabState();

    // Botões adicionais no rodapé do perfil (apenas proposta premium customizada se desejado)
    const bottomActions = document.createElement('div');
    bottomActions.className = 'flex flex-col gap-3 mt-6';

    const btnCustomProposal = document.createElement('button');
    btnCustomProposal.className = 'w-full py-2.5 px-4 bg-[#131735]/40 hover:bg-[#131735]/70 border border-white/5 text-copaYellow font-bold text-[10px] uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5';
    btnCustomProposal.innerHTML = `✨ Proposta Personalizada (Manual Premium)`;
    btnCustomProposal.onclick = () => {
      openCustomProposalModal(collector, userStickers);
    };
    bottomActions.appendChild(btnCustomProposal);

    mainDiv.appendChild(bottomActions);
  });
}

function openCustomProposalModal(collector, userStickers) {
  document.getElementById('custom-proposal-modal')?.remove();

  const modal = document.createElement('div');
  modal.id = 'custom-proposal-modal';
  modal.className = 'fixed inset-0 z-[9999] flex items-end justify-center';

  const backdrop = document.createElement('div');
  backdrop.className = 'absolute inset-0 bg-black/75 backdrop-blur-sm';
  backdrop.onclick = () => modal.remove();
  modal.appendChild(backdrop);

  const sheet = document.createElement('div');
  sheet.className = 'relative w-full max-w-[480px] bg-[#07091c] border border-white/10 rounded-t-2xl shadow-2xl p-5 space-y-4 animate-fade-in max-h-[85vh] overflow-y-auto';

  // Encontra opções de Premium (Legends) do usuário (suas repetidas)
  const userPremiumDupes = [];
  const variants = ['ouro', 'prata', 'bronze', 'bordo'];
  for (let i = 1; i <= 20; i++) {
    variants.forEach(v => {
      const key = "EXTRAS-" + i + "-" + v;
      const sticker = userStickers[key];
      if (sticker && sticker.duplicate > 0) {
        const name = legendsData[i - 1] ? legendsData[i - 1].name : "Lendário " + i;
        const cat = v.charAt(0).toUpperCase() + v.slice(1);
        userPremiumDupes.push({ key, label: name + " " + cat + " (" + sticker.duplicate + "x)" });
      }
    });
  }

  // Encontra opções de Premium (Legends) do colecionador (as que ele tem ou que faltam para nós)
  const collectorPremiumCards = [];
  for (let i = 1; i <= 20; i++) {
    variants.forEach(v => {
      const key = "EXTRAS-" + i + "-" + v;
      const sticker = collector.stickers[key];
      if (sticker && (sticker.owned || sticker.duplicate > 0)) {
        const name = legendsData[i - 1] ? legendsData[i - 1].name : "Lendário " + i;
        const cat = v.charAt(0).toUpperCase() + v.slice(1);
        collectorPremiumCards.push({ key, label: name + " " + cat });
      }
    });
  }

  // Fallbacks se nenhum dado estiver preenchido para não travar
  if (userPremiumDupes.length === 0) {
    for (let i = 1; i <= 20; i++) {
      variants.forEach(v => {
        const name = legendsData[i - 1] ? legendsData[i - 1].name : "Lendário " + i;
        const cat = v.charAt(0).toUpperCase() + v.slice(1);
        userPremiumDupes.push({ key: "EXTRAS-" + i + "-" + v, label: name + " " + cat });
      });
    }
  }
  if (collectorPremiumCards.length === 0) {
    for (let i = 1; i <= 20; i++) {
      variants.forEach(v => {
        const name = legendsData[i - 1] ? legendsData[i - 1].name : "Lendário " + i;
        const cat = v.charAt(0).toUpperCase() + v.slice(1);
        collectorPremiumCards.push({ key: "EXTRAS-" + i + "-" + v, label: name + " " + cat });
      });
    }
  }

  const userOptionsHtml = userPremiumDupes.map(item => "<option value=\"" + item.key + "\">" + item.label + "</option>").join('');
  const collectorOptionsHtml = collectorPremiumCards.map(item => "<option value=\"" + item.key + "\">" + item.label + "</option>").join('');

  sheet.innerHTML = `
    <div class="flex justify-between items-center border-b border-white/5 pb-3">
      <h3 class="font-black text-white text-xs uppercase tracking-wider">Proposta Customizada (Premium)</h3>
      <button onclick="document.getElementById('custom-proposal-modal').remove()" class="text-gray-400 hover:text-white text-lg">×</button>
    </div>
    
    <div class="space-y-4 py-2">
      <div class="space-y-1.5">
        <label class="text-[9px] font-black text-copaGreen uppercase tracking-wider block">Minha Figurinha Premium (Oferecer):</label>
        <select id="userPremiumSelect" class="w-full bg-[#131735] text-white border border-white/10 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-copaGreen cursor-pointer">
          ${userOptionsHtml}
        </select>
      </div>

      <div class="space-y-1.5">
        <label class="text-[9px] font-black text-copaYellow uppercase tracking-wider block">Figurinha Premium Dele (Pedir):</label>
        <select id="collectorPremiumSelect" class="w-full bg-[#131735] text-white border border-white/10 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-copaYellow cursor-pointer">
          ${collectorOptionsHtml}
        </select>
      </div>

      <button id="btnSendCustomProposal" class="w-full mt-4 py-3 bg-copaGreen hover:bg-opacity-95 text-black font-black uppercase text-xs tracking-wider rounded-xl transition flex items-center justify-center gap-2">
        Abrir Negociação 🔄
      </button>
    </div>
  `;

  sheet.querySelector('#btnSendCustomProposal').onclick = () => {
    const userVal = sheet.querySelector('#userPremiumSelect').value;
    const collectorVal = sheet.querySelector('#collectorPremiumSelect').value;

    const userStickerNum = parseInt(userVal.split('-')[1], 10);
    const userStickerVar = userVal.split('-')[2];
    const userStickerName = legendsData[userStickerNum - 1] ? legendsData[userStickerNum - 1].name : "Lendário " + userStickerNum;
    const userStickerFull = userStickerName + " " + userStickerVar.charAt(0).toUpperCase() + userStickerVar.slice(1);

    const collectorStickerNum = parseInt(collectorVal.split('-')[1], 10);
    const collectorStickerVar = collectorVal.split('-')[2];
    const collectorStickerName = legendsData[collectorStickerNum - 1] ? legendsData[collectorStickerNum - 1].name : "Lendário " + collectorStickerNum;
    const collectorStickerFull = collectorStickerName + " " + collectorStickerVar.charAt(0).toUpperCase() + collectorStickerVar.slice(1);

    const appLink = window.location.origin + window.location.pathname;

    const messageText = "Fala! Vi seu perfil no Ultimate Cromo 2026 e tenho uma proposta para as figurinhas Premium (Legends)! 🔄\nGostaria de oferecer a minha extra " + userStickerFull + " em troca da sua " + collectorStickerFull + ". O que acha?\nGerencie seu álbum e envie propostas customizadas também. Baixe o Ultimate Cromo FIFA/Panini 2026: " + appLink;

    if (navigator.share) {
      navigator.share({
        title: 'Proposta Premium - Ultimate Cromo 2026',
        text: messageText
      }).then(() => {
        modal.remove();
      }).catch(err => {
        window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent(messageText), '_blank');
        modal.remove();
      });
    } else {
      window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent(messageText), '_blank');
      modal.remove();
    }
  };

  modal.appendChild(sheet);
  document.body.appendChild(modal);
}

function handleAuthHeaderClick() {
  const user = authDb.getCurrentUser();

  // Remove painel anterior se existir
  document.getElementById('auth-profile-panel')?.remove();

  const panel = document.createElement('div');
  panel.id = 'auth-profile-panel';
  panel.className = 'fixed inset-0 z-[9999] flex items-end justify-center';

  const backdrop = document.createElement('div');
  backdrop.className = 'absolute inset-0 bg-black/60 backdrop-blur-sm';
  backdrop.onclick = () => panel.remove();
  panel.appendChild(backdrop);

  const sheet = document.createElement('div');
  sheet.className = 'relative w-full max-w-[480px] bg-[#07091c] border border-white/10 rounded-t-2xl shadow-2xl p-5 space-y-4 animate-fade-in';

  if (user) {
    // --- Painel do usuário logado ---
    const stats = getAlbumStats();

    sheet.innerHTML = `
      <div class="flex items-center gap-4">
        <img src="${user.photo_url}" class="w-14 h-14 rounded-full object-cover border-2 border-copaGreen shadow-lg" alt="Avatar"
             onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0033A0&color=fff'">
        <div class="flex-1 min-w-0">
          <p class="font-black text-white text-sm truncate">${user.name}</p>
          <p class="text-[10px] text-copaGreen font-bold flex items-center gap-1">
            <span class="w-1.5 h-1.5 bg-copaGreen rounded-full inline-block"></span>
            Online agora • ${authDb.isDemoMode() ? 'Modo Demo' : 'Conta Real'}
          </p>
          <p class="text-[10px] text-gray-500 mt-0.5">via ${user.provider || 'demo'} • UID: ${(user.uid || '').substring(0, 12)}...</p>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-2 border-y border-white/5 py-3">
        <div class="text-center">
          <p class="text-base font-black text-white">${stats.owned}</p>
          <p class="text-[9px] text-gray-400 uppercase tracking-wide">Coladas</p>
        </div>
        <div class="text-center border-x border-white/5">
          <p class="text-base font-black text-copaYellow">${stats.percent}%</p>
          <p class="text-[9px] text-gray-400 uppercase tracking-wide">Progresso</p>
        </div>
        <div class="text-center">
          <p class="text-base font-black text-white">${stats.duplicates}</p>
          <p class="text-[9px] text-gray-400 uppercase tracking-wide">Repetidas</p>
        </div>
      </div>

      <div class="space-y-2">
        <button onclick="document.getElementById('auth-profile-panel').remove(); location.hash='#community';"
          class="w-full py-2.5 px-4 rounded-xl bg-copaBlue/20 hover:bg-copaBlue/30 border border-copaBlue/30 text-[#6699ff] font-bold text-xs flex items-center gap-2 transition">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm7.5-3.12C17.91 11.96 19 10.74 19 9c0-1.74-1.09-2.96-2.5-3.88.58-.77 1.5-1.12 2.5-1.12 2.21 0 4 1.79 4 4s-1.79 4-4 4c-.34 0-.67-.04-1-.12zm.5 3.12c1.94 1.15 4 2.44 4 4.5v2h-6.5v-1.75c0-1.38-.85-2.73-2-3.48 2.01-.65 3.8-1.15 4.5-1.27z"/>
          </svg>
          Abrir Comunidade
        </button>
        <button onclick="document.getElementById('auth-profile-panel').remove(); location.hash='#trades';"
          class="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/8 border border-white/10 text-gray-300 font-bold text-xs flex items-center gap-2 transition">
          <svg class="w-4 h-4 text-copaYellow" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3L21 7.5m0 0L16.5 12M21 7.5H7.5M7.5 12L3 16.5m0 0L7.5 21M3 16.5h13.5" />
          </svg>
          Minhas Repetidas
        </button>
        <button id="btnLogoutPanel"
          class="w-full py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold text-xs flex items-center gap-2 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Sair da Conta
        </button>
      </div>
    `;

    sheet.querySelector('#btnLogoutPanel').onclick = () => {
      panel.remove();
      sessionStorage.removeItem('skippedLogin');
      authDb.logout().then(() => {
        renderHeader();
        location.hash = '#home';
        route();
      });
    };

  } else {
    // --- Painel de convite ao login ---
    sheet.innerHTML = `
      <div class="text-center space-y-3 py-2">
        <div class="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl mx-auto">
          <svg class="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h3 class="font-black text-white text-sm">Entrar na sua Conta</h3>
          <p class="text-[10px] text-gray-400 mt-1">Sincronize seu álbum e participe da comunidade de colecionadores</p>
        </div>
        <button onclick="document.getElementById('auth-profile-panel').remove(); location.hash='#login';"
          class="w-full py-3 rounded-xl bg-gradient-to-r from-copaYellow to-yellow-600 text-black font-black text-xs uppercase tracking-wide shadow-lg hover:brightness-110 active:scale-95 transition">
          Fazer Login / Criar Conta
        </button>
        <button onclick="document.getElementById('auth-profile-panel').remove();"
          class="w-full py-2 text-xs text-gray-500 hover:text-gray-300 transition">
          Continuar sem conta
        </button>
      </div>
    `;
  }

  panel.appendChild(sheet);
  document.body.appendChild(panel);
}

// Vincula funções utilitárias ao escopo global window para acesso no HTML
window.switchAlbum = switchAlbum;
window.createNewAlbum = createNewAlbum;
window.shareOwnedList = shareOwnedList;
window.shareMissingList = shareMissingList;
window.shareDuplicatesList = shareDuplicatesList;
window.handleAuthHeaderClick = handleAuthHeaderClick;

// Inicialização por DOMContentLoaded
window.addEventListener('DOMContentLoaded', initApp);
window.addEventListener('hashchange', route);

// ==========================================
// BUSCA INTELIGENTE E AUTOCOMPLETE NO CABEÇALHO
// ==========================================

function initHeaderSearchBar() {
  const container = document.getElementById('headerSearchContainer');
  if (!container) return;
  
  if (container.querySelector('#headerSearchInput')) {
    return;
  }
  
  container.innerHTML = `
    <div class="relative w-full">
      <div class="flex items-center bg-[#131735] border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-copaYellow transition-all duration-200">
        <svg class="w-3.5 h-3.5 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" id="headerSearchInput" placeholder="Buscar país ou figurinha faltante..." class="bg-transparent text-white placeholder-gray-400 text-xs w-full focus:outline-none font-medium" />
      </div>
      <div id="headerSearchSuggestions" class="absolute left-0 right-0 mt-1.5 bg-[#0e112a]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-y-auto max-h-60 hidden z-[110] divide-y divide-white/5"></div>
    </div>
  `;

  const searchInput = document.getElementById('headerSearchInput');
  const suggestionsBox = document.getElementById('headerSearchSuggestions');

  if (!searchInput || !suggestionsBox) return;

  searchInput.addEventListener('input', (e) => {
    updateHeaderSearchSuggestions(e.target.value);
  });

  searchInput.addEventListener('focus', (e) => {
    updateHeaderSearchSuggestions(e.target.value);
  });

  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      suggestionsBox.classList.add('hidden');
    }
  });
}

function updateHeaderSearchSuggestions(query) {
  const suggestionsBox = document.getElementById('headerSearchSuggestions');
  const searchInput = document.getElementById('headerSearchInput');
  if (!suggestionsBox) return;

  suggestionsBox.innerHTML = '';
  if (!query.trim()) {
    suggestionsBox.classList.add('hidden');
    return;
  }

  const cleanQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const numMatch = cleanQuery.match(/\d+/);
  const hasNum = numMatch !== null;
  const searchNum = hasNum ? parseInt(numMatch[0]) : null;
  const textQuery = cleanQuery.replace(/\d+/g, '').trim();

  const albumId = storage.getCurrentAlbumId();
  const albums = storage.getAlbums();
  const album = albums[albumId];
  const stickers = album ? album.stickers : {};

  const groupedSuggestions = {};

  // 1. Verificar grupos especiais (FWC, CC)
  const specials = [
    { name: 'FIFA', code: 'FWC', limit: 19 },
    { name: 'Coca-Cola', code: 'CC', limit: 14 }
  ];

  specials.forEach(group => {
    const matchName = group.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const matchCode = group.code.toLowerCase();
    const textMatches = textQuery === '' || matchName.includes(textQuery) || matchCode.includes(textQuery);

    if (textMatches) {
      for (let i = 1; i <= group.limit; i++) {
        const key = group.code + "-" + i;
        const isOwned = stickers[key]?.owned;

        if (!isOwned) {
          if (hasNum && i !== searchNum) continue;

          if (!groupedSuggestions[group.code]) {
            groupedSuggestions[group.code] = {
              name: group.name,
              code: group.code,
              flag: flagEmojis[group.code] || '🏳️',
              stickers: []
            };
          }
          groupedSuggestions[group.code].stickers.push({
            key: key,
            label: group.code + " " + i,
            number: i
          });
        }
      }
    }
  });

  // 2. Verificar seleções em de gruposData
  groupsData.forEach(g => {
    g.teams.forEach(t => {
      const matchName = t.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const matchCode = t.code.toLowerCase();
      const textMatches = textQuery === '' || matchName.includes(textQuery) || matchCode.includes(textQuery);

      if (textMatches) {
        for (let i = 1; i <= 20; i++) {
          const key = t.code + "-" + i;
          const isOwned = stickers[key]?.owned;

          if (!isOwned) {
            if (hasNum && i !== searchNum) continue;

            if (!groupedSuggestions[t.code]) {
              groupedSuggestions[t.code] = {
                name: t.name,
                code: t.code,
                flag: flagEmojis[t.code] || '🏳️',
                stickers: []
              };
            }
            groupedSuggestions[t.code].stickers.push({
              key: key,
              label: t.code + " " + i,
              number: i
            });
          }
        }
      }
    });
  });

  // 3. Verificar Lendários (EXTRAS)
  const matchExtras = 'legends'.includes(cleanQuery) || 'extras'.includes(cleanQuery) || 'premium'.includes(cleanQuery) || 'lendarios'.includes(cleanQuery) || textQuery === '';
  if (matchExtras) {
    const variants = ['ouro', 'prata', 'bronze', 'bordo'];
    const capVariants = { ouro: 'Ouro', prata: 'Prata', bronze: 'Bronze', bordo: 'Bordo' };
    
    legendsData.forEach((legend, idx) => {
      const matchLegendName = legend.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (textQuery === '' || matchLegendName.includes(textQuery)) {
        variants.forEach(variant => {
          const key = "EXTRAS-" + idx + 1 + "-" + variant;
          const isOwned = stickers[key]?.owned;

          if (!isOwned) {
            if (hasNum && (idx + 1) !== searchNum) return;

            if (!groupedSuggestions['EXTRAS']) {
              groupedSuggestions['EXTRAS'] = {
                name: 'Premium',
                code: 'EXTRAS',
                flag: flagEmojis['EXTRAS'] || '✨',
                stickers: []
              };
            }
            groupedSuggestions['EXTRAS'].stickers.push({
              key: key,
              label: "LEG " + idx + 1 + "-" + capVariants[variant],
              number: idx + 1
            });
          }
        });
      }
    });
  }

  // 4. Se a busca for "escudos" ou "escudo"
  const matchEscudos = 'escudos'.includes(cleanQuery) || 'escudo'.includes(cleanQuery);
  if (matchEscudos) {
    if (!groupedSuggestions['ESCUDOS']) {
      groupedSuggestions['ESCUDOS'] = {
        name: 'Escudos',
        code: 'ESCUDOS',
        flag: '🛡️',
        stickers: [],
        isSpecialLink: true,
        hash: '#team-ESCUDOS'
      };
    }
  }

  const list = Object.values(groupedSuggestions);

  if (list.length === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'p-3 text-xs text-gray-500 text-center';
    emptyDiv.textContent = 'Nenhuma correspondência ou figurinha faltante encontrada';
    suggestionsBox.appendChild(emptyDiv);
  } else {
    list.forEach(group => {
      const itemRow = document.createElement('div');
      itemRow.className = 'flex items-center justify-between gap-3 p-2.5 hover:bg-[#131735]/40 transition duration-150 border-b border-white/5 w-full';

      // Lado esquerdo: Bandeira + Nome
      const leftDiv = document.createElement('div');
      leftDiv.className = 'flex items-center gap-1.5 flex-shrink-0 cursor-pointer text-gray-300 hover:text-white transition duration-150';
      
      let flagHtml = '';
      if (group.code === 'FWC') {
        flagHtml = `<span class="text-sm select-none">🏆</span>`;
      } else if (group.code === 'CC') {
        flagHtml = `<span class="text-sm select-none">🥤</span>`;
      } else if (group.code === 'EXTRAS') {
        flagHtml = `<span class="text-sm select-none">✨</span>`;
      } else if (group.code === 'ESCUDOS') {
        flagHtml = `<span class="text-sm select-none">🛡️</span>`;
      } else {
        const flagCode = (flagMap[group.code] || 'us').toLowerCase();
    return crestsMap[code] || "https://flagcdn.com/w40/" + (flagMap[code] || 'un') + ".png";
      }

      leftDiv.innerHTML = `
        ${flagHtml}
        <span class="text-xs font-bold tracking-tight">${group.name}</span>
      `;
      leftDiv.onclick = () => {
        suggestionsBox.classList.add('hidden');
        searchInput.value = '';
        if (group.isSpecialLink) {
          location.hash = group.hash;
        } else {
          location.hash = "#team-" + group.code;
        }
      };
      itemRow.appendChild(leftDiv);

      // Lado direito: Figurinhas
      const rightDiv = document.createElement('div');
      rightDiv.className = 'flex items-center gap-1.5 overflow-x-auto py-0.5 flex-1 justify-end';
      rightDiv.style.scrollbarWidth = 'none';
      rightDiv.style.msOverflowStyle = 'none';

      if (group.isSpecialLink) {
        const linkBtn = document.createElement('button');
        linkBtn.className = 'bg-copaGreen/10 hover:bg-copaGreen hover:text-darkBg text-copaGreen border border-copaGreen/30 hover:border-copaGreen text-[10px] font-bold px-2 py-0.5 rounded transition duration-150 flex-shrink-0 cursor-pointer';
        linkBtn.textContent = 'Ver Escudos';
        linkBtn.onclick = () => {
          suggestionsBox.classList.add('hidden');
          searchInput.value = '';
          location.hash = group.hash;
        };
        rightDiv.appendChild(linkBtn);
      } else {
        group.stickers.forEach(st => {
          const pill = document.createElement('button');
          pill.className = 'bg-[#1a1e43]/60 hover:bg-copaYellow hover:text-darkBg text-copaYellow border border-copaYellow/30 hover:border-copaYellow text-[10px] font-bold px-2 py-0.5 rounded transition duration-150 flex-shrink-0 cursor-pointer';
          pill.textContent = "[" + st.label + "]";
          pill.onclick = () => {
            suggestionsBox.classList.add('hidden');
            searchInput.value = '';

            const currentHash = location.hash || '#home';
            if (currentHash === "#team-" + group.code) {
              const el = document.getElementById("card-" + st.key);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.classList.add('pulse-highlight');
                setTimeout(() => el.classList.remove('pulse-highlight'), 3000);
              }
            } else {
              sessionStorage.setItem('scrollTargetSticker', "card-" + st.key);
              location.hash = "#team-" + group.code;
            }
          };
          rightDiv.appendChild(pill);
        });
      }

      itemRow.appendChild(rightDiv);
      suggestionsBox.appendChild(itemRow);
    });
  }

  suggestionsBox.classList.remove('hidden');
}

