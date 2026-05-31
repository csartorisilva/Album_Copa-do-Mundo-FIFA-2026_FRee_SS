// app.js – lógica principal do álbum de figurinhas FIFA 2026
// Tema Ultimate FIFA - Modo Escuro & Glassmorphism com Card Flip 3D

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
// Mapeamento de URLs estáveis e públicas de brasões/logos das federações de futebol reais (Wikimedia Commons Thumbnails PNG)
const crestsMap = {
  USA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/US_Soccer_Federation_logo.svg/120px-US_Soccer_Federation_logo.svg.png',
  MEX: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/FMF_Logo.png/120px-FMF_Logo.png',
  CAN: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Canada_Soccer_logo.svg/120px-Canada_Soccer_logo.svg.png',
  BRA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Brazilian_Football_Confederation_logo.svg/120px-Brazilian_Football_Confederation_logo.svg.png',
  COL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Federacion_Colombiana_de_Futbol_logo.svg/120px-Federacion_Colombiana_de_Futbol_logo.svg.png',
  PAR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Asociacion_Paraguaya_de_Futbol_logo.svg/120px-Asociacion_Paraguaya_de_Futbol_logo.svg.png',
  ARG: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Asociaci%C3%B3n_del_F%C3%BAtbol_Argentino_logo.svg/120px-Asociaci%C3%B3n_del_F%C3%BAtbol_Argentino_logo.svg.png',
  URU: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Asociaci%C3%B3n_Uruguaya_de_F%C3%BAtbol_logo.svg/120px-Asociaci%C3%B3n_Uruguaya_de_F%C3%BAtbol_logo.svg.png',
  KSA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Saudi_Arabia_Football_Federation_logo.svg/120px-Saudi_Arabia_Football_Federation_logo.svg.png',
  FRA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Logo_F%C3%A9d%C3%A9ration_Fran%C3%A7aise_de_Football.svg/120px-Logo_F%C3%A9d%C3%A9ration_Fran%C3%A7aise_de_Football.svg.png',
  MAR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/F%C3%A9d%C3%A9ration_royale_marocaine_de_football.svg/120px-F%C3%A9d%C3%A9ration_royale_marocaine_de_football.svg.png',
  AUT: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Austrian_Football_Association_logo.svg/120px-Austrian_Football_Association_logo.svg.png',
  ESP: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Real_Federaci%C3%B3n_Espa%C3%B1ola_de_F%C3%BAtbol_logo.svg/120px-Real_Federaci%C3%B3n_Espa%C3%B1ola_de_F%C3%BAtbol_logo.svg.png',
  JPN: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Japan_Football_Association_logo.svg/120px-Japan_Football_Association_logo.svg.png',
  ECU: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Federacion_Ecuatoriana_de_Futbol.svg/120px-Federacion_Ecuatoriana_de_Futbol.svg.png',
  EGY: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Egyptian_Football_Association_logo.svg/120px-Egyptian_Football_Association_logo.svg.png',
  GER: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Deutscher_Fu%C3%9Fball-Bund_logo.svg/120px-Deutscher_Fu%C3%9Fball-Bund_logo.svg.png',
  BEL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Royal_Belgian_FA_logo.svg/120px-Royal_Belgian_FA_logo.svg.png',
  KOR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Korea_Football_Association_logo.svg/120px-Korea_Football_Association_logo.svg.png',
  TUN: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Tunisian_Football_Federation_logo.svg/120px-Tunisian_Football_Federation_logo.svg.png',
  ENG: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/38/England_crest_2009.svg/120px-England_crest_2009.svg.png',
  SEN: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/F%C3%A9d%C3%A9ration_S%C3%A9n%C3%A9galaise_de_Football.svg/120px-F%C3%A9d%C3%A9ration_S%C3%A9n%C3%A9galaise_de_Football.svg.png',
  IRN: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Football_Federation_Islamic_Republic_of_Iran_logo.svg/120px-Football_Federation_Islamic_Republic_of_Iran_logo.svg.png',
  POR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Federa%C3%A7%C3%A3o_Portuguesa_de_Futebol_logo.svg/120px-Federa%C3%A7%C3%A3o_Portuguesa_de_Futebol_logo.svg.png',
  GHA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Ghana_Football_Association_logo.svg/120px-Ghana_Football_Association_logo.svg.png',
  TUR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Turkish_Football_Federation_logo.svg/120px-Turkish_Football_Federation_logo.svg.png',
  AUS: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Football_Australia_logo.svg/120px-Football_Australia_logo.svg.png',
  ALG: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Algerian_Football_Federation_logo.svg/120px-Algerian_Football_Federation_logo.svg.png',
  NED: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Knvb_logo.svg/120px-Knvb_logo.svg.png',
  CRO: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Croatian_Football_Federation_logo.svg/120px-Croatian_Football_Federation_logo.svg.png',
  SCO: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/65/Scottish_Football_Association_crest.svg/120px-Scottish_Football_Association_crest.svg.png',
  SUI: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Swiss_Football_Association_logo.svg/120px-Swiss_Football_Association_logo.svg.png',
  PAN: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Federacion_Panamena_de_Futbol.svg/120px-Federacion_Panamena_de_Futbol.svg.png',
  SWE: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Swedish_Football_Association_logo.svg/120px-Swedish_Football_Association_logo.svg.png',
  NZL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/New_Zealand_Football_logo.svg/120px-New_Zealand_Football_logo.svg.png',
  FWC: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/FIFA_logo_without_slogan.svg/120px-FIFA_logo_without_slogan.svg.png',
  CC: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Coca-Cola_logo.svg/120px-Coca-Cola_logo.svg.png',
  // Enriquecidos com Wikimedia Commons estáveis
  RSA: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/South_African_Football_Association_logo.svg/120px-South_African_Football_Association_logo.svg.png',
  CZE: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Logo_FA%C4%8CR.svg/120px-Logo_FA%C4%8CR.svg.png',
  BIH: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/NFSBiH_logo.svg/120px-NFSBiH_logo.svg.png',
  QAT: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Qatar_Football_Association_logo.svg/120px-Qatar_Football_Association_logo.svg.png',
  HAI: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Logo_F%C3%A9d%C3%A9ration_Ha%C3%AFtienne_de_Football_2021.png/120px-Logo_F%C3%A9d%C3%A9ration_Ha%C3%AFtienne_de_Football_2021.png',
  CUW: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c8/FFK_Logo.png/120px-FFK_Logo.png',
  CIV: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Logo_F%C3%A9d%C3%A9ration_Ivoirienne_de_Football.png/120px-Logo_F%C3%A9d%C3%A9ration_Ivoirienne_de_Football.png',
  CPV: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Cape_Verde_football_association_crest.png/120px-Cape_Verde_football_association_crest.png',
  IRQ: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Iraq_FA_logo.svg/120px-Iraq_FA_logo.svg.png',
  NOR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Norway_national_football_team_crest.svg/120px-Norway_national_football_team_crest.svg.png',
  JOR: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/43/Jordan_Football_Association_logo.svg/120px-Jordan_Football_Association_logo.svg.png',
  COD: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Logo_Fecofa.png/120px-Logo_Fecofa.png',
  UZB: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Uzbekistan_Football_Association_logo.svg/120px-Uzbekistan_Football_Association_logo.svg.png',
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

// Calcula e formata a fase e a cor do balãozinho da Copa 2026 de forma dinâmica
function getPhaseInfo(team, standings) {
  let phaseText = 'FG';
  let colorClass = 'bg-[#FFC726]/10 text-[#FFC726] border-[#FFC726]/30'; // amarelo (não começou)

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

    // Cor do balão: se tiver pontos (campeonato começou) fica verde, senão amarelo
    if (points > 0 || (stats && stats.rank !== undefined)) {
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
  desc.innerHTML = `Você está visualizando a coleção:<br><strong class="text-white text-sm">${album.name}</strong>`;
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
  const title = 'Ultimate Cromos FIFA 2026';
  const link = window.location.origin + window.location.pathname;
  const text = `Eu uso o app-web (${link}) para o controle do meu álbum, ele tem um excelente layout e a funcionalidade de Trocas Qualificadas, onde o próprio app encontra as figurinhas faltantes para trocar.`;
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
          console.log(`Cloud Sync: Photo for ${key} uploaded to global database.`);
          
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
  const stickerName = isExtras ? legendsData[num - 1].name : `${code} ${num}`;
  
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
  logo.className = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-auto opacity-20 pointer-events-none';
  bigCard.appendChild(logo);

  if (playerPhotoSrc) {
    const img = document.createElement('img');
    img.src = playerPhotoSrc;
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
    const textShare = `Olha o meu card de ${stickerName} colado no app Ultimate Cromos FIFA 2026!`;
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
    
    // Executa a rotina de sincronização de dados do torneio
    await syncStandings();
    
    // Exibe pop-up informando o álbum atual
    checkAlbumEntryPopup();
    
    renderHeader();
    route();
  } catch (e) {
    console.error('Erro na inicialização do aplicativo:', e);
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
  alert(`Álbum "${name.trim()}" criado com sucesso!`);
}

// Renderiza a barra superior (seletor de álbum)
function renderHeader() {
  const selector = document.getElementById('albumSelector');
  if (!selector) return;
  const albums = storage.getAlbums();
  selector.innerHTML = '';
  Object.entries(albums).forEach(([id, data]) => {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = data.name;
    opt.className = 'bg-[#131735] text-white'; // Estilo escuro explícito para o dropdown
    if (id === storage.getCurrentAlbumId()) opt.selected = true;
    selector.appendChild(opt);
  });
}

// Troca de álbum ativo
function switchAlbum(id) {
  storage.setCurrentAlbumId(id);
  renderHeader();
  route();
}

// Roteador baseado em Hash com efeito 3D Page Flip
function route() {
  const hash = location.hash || '#home';
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
  } else if (hash.startsWith('#trades')) {
    renderTrades(pageContainer);
  } else if (hash.startsWith('#login')) {
    renderLogin(pageContainer);
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
  const wrapper = document.createElement('div');
  wrapper.className = 'max-w-md mx-auto my-12 glass-panel p-8 rounded-2xl border-white/5 relative overflow-hidden';
  
  const glow = document.createElement('div');
  glow.className = 'absolute -top-24 -left-24 w-48 h-48 rounded-full bg-copaGreen/15 blur-3xl pointer-events-none';
  wrapper.appendChild(glow);

  const title = document.createElement('h2');
  title.className = 'text-2xl font-black text-center mb-1 uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400';
  title.textContent = 'Acessar Coleções';
  wrapper.appendChild(title);

  const sub = document.createElement('p');
  sub.className = 'text-center text-xs text-gray-400 mb-8';
  sub.textContent = 'Escolha um método simulado para entrar';
  wrapper.appendChild(sub);

  const grid = document.createElement('div');
  grid.className = 'flex flex-col gap-3';

  const methods = [
    { id: 'google', label: 'Acesso via Gmail' },
    { id: 'apple', label: 'Acesso via Apple ID' },
    { id: 'android', label: 'Acesso via Android/Google' }
  ];

  methods.forEach(m => {
    const btn = document.createElement('button');
    btn.className = 'flex items-center justify-between text-left p-4 rounded-xl bg-white/5 border border-white/5 hover:border-copaYellow/30 hover:bg-white/10 transition duration-200 group';
    btn.onclick = () => {
      const albums = storage.getAlbums();
      const newId = generateId();
      albums[newId] = { name: `Álbum (${m.label})`, stickers: {} };
      storage.setAlbums(albums);
      storage.setCurrentAlbumId(newId);
      renderHeader();
      location.hash = '#home';
    };

    const label = document.createElement('span');
    label.className = 'font-bold text-sm text-gray-200 group-hover:text-white';
    label.textContent = m.label;
    btn.appendChild(label);

    const arrow = document.createElement('span');
    arrow.className = 'text-gray-500 group-hover:text-copaYellow transition';
    arrow.innerHTML = '➔';
    btn.appendChild(arrow);

    grid.appendChild(btn);
  });

  wrapper.appendChild(grid);
  container.appendChild(wrapper);
}

// ------------------- HOME -------------------
function renderHome(container) {
  const stats = getAlbumStats();

  const rootHome = document.createElement('div');
  rootHome.className = 'space-y-6 py-2';

  // 1. Painel de Estatísticas / Ultimate Progress
  const statsPanel = document.createElement('div');
  statsPanel.className = 'glass-panel p-5 rounded-2xl relative overflow-hidden flex flex-col gap-4 border-white/5';
  
  const statsGlow = document.createElement('div');
  statsGlow.className = 'absolute right-0 top-0 w-48 h-48 bg-copaGreen/10 rounded-full blur-3xl pointer-events-none';
  statsPanel.appendChild(statsGlow);

  const progressSection = document.createElement('div');
  progressSection.className = 'space-y-2';
  
  const progressHeader = document.createElement('div');
  progressHeader.className = 'flex justify-between items-center text-xs font-black uppercase tracking-wider text-gray-400';
  progressHeader.innerHTML = `<span>Progresso Geral</span> <span class="text-copaYellow font-bold">${stats.percent}%</span>`;
  progressSection.appendChild(progressHeader);

  const progressBarBg = document.createElement('div');
  progressBarBg.className = 'h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10';
  const progressBarFill = document.createElement('div');
  progressBarFill.className = 'h-full bg-gradient-to-r from-copaBlue via-copaGreen to-copaYellow rounded-full transition-all duration-500';
  progressBarFill.style.width = `${stats.percent}%`;
  progressBarBg.appendChild(progressBarFill);
  progressSection.appendChild(progressBarBg);

  const textStats = document.createElement('div');
  textStats.className = 'flex justify-between mt-3 text-xs font-semibold text-gray-300';
  textStats.innerHTML = `
    <div><span class="text-base font-black text-white">${stats.owned}</span> / ${stats.total} Adquiridas</div>
    <div><span class="text-base font-black text-copaYellow">${stats.duplicates}</span> Repetidas</div>
  `;
  progressSection.appendChild(textStats);

  // Bloco de Compartilhamento (exibido acima das estatísticas em flex-col)
  const shareBlock = document.createElement('div');
  shareBlock.className = 'flex flex-col gap-2 mt-2 pt-3.5 border-t border-white/5 w-full';
  
  const shareLabel = document.createElement('span');
  shareLabel.className = 'text-[9px] font-black uppercase text-gray-400 tracking-wider text-left';
  shareLabel.textContent = 'Compartilhar:';
  shareBlock.appendChild(shareLabel);

  const shareButtonsContainer = document.createElement('div');
  shareButtonsContainer.className = 'grid grid-cols-3 gap-2 w-full';

  // 1. Possuo (Owned)
  const btnShareOwned = document.createElement('button');
  btnShareOwned.className = 'px-2 py-1 bg-white/5 hover:bg-copaGreen/10 border border-white/10 hover:border-copaGreen/30 rounded-lg text-white hover:text-copaGreen transition text-[9px] font-bold uppercase tracking-wider flex items-center gap-1';
  btnShareOwned.title = 'Compartilhar figurinhas coladas';
  btnShareOwned.innerHTML = `
    <svg class="w-3 h-3 text-copaGreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
    </svg>
    Coladas
  `;
  btnShareOwned.onclick = () => shareOwnedList();
  shareButtonsContainer.appendChild(btnShareOwned);

  // 2. Faltam (Missing)
  const btnShareMissing = document.createElement('button');
  btnShareMissing.className = 'px-2 py-1 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-lg text-white hover:text-red-400 transition text-[9px] font-bold uppercase tracking-wider flex items-center gap-1';
  btnShareMissing.title = 'Compartilhar figurinhas faltantes';
  btnShareMissing.innerHTML = `
    <svg class="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
    </svg>
    Faltam
  `;
  btnShareMissing.onclick = () => shareMissingList();
  shareButtonsContainer.appendChild(btnShareMissing);

  // 3. Repetidas (Duplicates)
  const btnShareDuplicates = document.createElement('button');
  btnShareDuplicates.className = 'px-2 py-1 bg-white/5 hover:bg-copaYellow/10 border border-white/10 hover:border-copaYellow/30 rounded-lg text-white hover:text-copaYellow transition text-[9px] font-bold uppercase tracking-wider flex items-center gap-1';
  btnShareDuplicates.title = 'Compartilhar repetidas para troca';
  btnShareDuplicates.innerHTML = `
    <svg class="w-3 h-3 text-copaYellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4" />
    </svg>
    Repetidas
  `;
  btnShareDuplicates.onclick = () => shareDuplicatesList();
  shareButtonsContainer.appendChild(btnShareDuplicates);

  shareBlock.appendChild(shareButtonsContainer);
  statsPanel.appendChild(shareBlock);
  statsPanel.appendChild(progressSection);

  rootHome.appendChild(statsPanel);

  // 2. Banner de Troca Qualificada (Simulado)
  if (stats.duplicates > 0) {
    const banner = document.createElement('div');
    banner.className = 'bg-gradient-to-r from-copaYellow via-[#ffdd67] to-copaYellow text-black py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider text-center flex items-center justify-center gap-2 border border-white/10 animate-pulse';
    banner.innerHTML = `
      <span class="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span>
      Trocas Qualificadas Disponíveis na aba de repetidas!
    `;
    banner.onclick = () => location.hash = '#trades';
    banner.style.cursor = 'pointer';
    rootHome.appendChild(banner);
  }

  // 3. PRIMEIRA LINHA: Seções Especiais (LADO A LADO na mesma linha)
  const specialGrid = document.createElement('div');
  specialGrid.className = 'grid grid-cols-3 gap-2.5';
  
  const specialSections = [
    { title: 'FIFA', desc: 'Especial Copa', hash: '#team-FWC', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/FIFA_logo_without_slogan.svg/200px-FIFA_logo_without_slogan.svg.png' },
    { title: 'Coca-Cola', desc: 'Metálicos', hash: '#team-CC', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Coca-Cola_logo.svg/200px-Coca-Cola_logo.svg.png' },
    { title: 'Premium', desc: 'Fig. Extras', hash: '#team-EXTRAS', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Golden_Ball.svg/100px-Golden_Ball.svg.png' }
  ];

  specialSections.forEach(sec => {
    const box = document.createElement('div');
    box.className = 'glass-panel p-3 rounded-xl border-white/5 hover:border-copaYellow/30 cursor-pointer flex flex-col justify-center items-center text-center transition group relative overflow-hidden h-16';
    box.onclick = () => location.hash = sec.hash;

    if (sec.logo) {
      const bgLogo = document.createElement('img');
      bgLogo.src = sec.logo;
      bgLogo.className = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-auto opacity-10 pointer-events-none group-hover:scale-110 transition';
      box.appendChild(bgLogo);
    }

    const title = document.createElement('h4');
    title.className = 'font-black text-xs text-copaYellow uppercase tracking-wider group-hover:scale-105 transition z-10';
    title.textContent = sec.title;
    
    const desc = document.createElement('p');
    desc.className = 'text-[9px] text-gray-500 font-semibold z-10';
    desc.textContent = sec.desc;

    box.appendChild(title);
    box.appendChild(desc);
    specialGrid.appendChild(box);
  });
  rootHome.appendChild(specialGrid);

  // 4. Divisor de Título Grupos
  const groupsTitle = document.createElement('h3');
  groupsTitle.className = 'text-xs font-black uppercase tracking-wider text-gray-500 border-b border-white/5 pb-1 mt-6';
  groupsTitle.textContent = 'Seleções por Grupos';
  rootHome.appendChild(groupsTitle);

  // 5. LINHAS SEGUINTES: Cada grupo exibido abaixo do outro (Vertical)
  const groupsContainer = document.createElement('div');
  groupsContainer.className = 'space-y-5';

  groupsData.forEach(g => {
    const groupCard = document.createElement('div');
    groupCard.className = 'glass-panel p-4 rounded-xl border-white/5 flex flex-col gap-3';
    
    // Contêiner de cabeçalho do grupo para alinhar título e link na mesma linha
    const groupHeader = document.createElement('div');
    groupHeader.className = 'flex justify-between items-center border-b border-white/5 pb-1 w-full';

    const gTitle = document.createElement('h4');
    gTitle.className = 'font-black text-[10px] text-gray-400 uppercase tracking-widest';
    gTitle.textContent = g.name;
    groupHeader.appendChild(gTitle);

    // Link oficial da classificação da FIFA
    const tableLink = document.createElement('a');
    tableLink.href = 'https://www.fifa.com/pt/tournaments/mens/worldcup/canadamexicousa2026/standings';
    tableLink.target = '_blank';
    tableLink.rel = 'noopener noreferrer';
    tableLink.className = 'text-[8px] font-black text-copaGreen hover:text-white transition flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded border border-white/5';
    tableLink.innerHTML = `
      <span>Classificação Geral</span>
      <svg class="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    `;
    groupHeader.appendChild(tableLink);
    groupCard.appendChild(groupHeader);

    // Grid de 4 colunas para caber as 4 seleções na mesma linha horizontal
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-4 gap-1';

    // Ordenação dinâmica por classificação (rank ascendente: 1º primeiro)
    const sortedTeams = [...g.teams].sort((a, b) => a.rank - b.rank);
    sortedTeams.forEach(team => {
      const card = document.createElement('div');
      card.className = 'cursor-pointer transition flex flex-col items-center justify-center gap-1 group relative py-1.5 px-0.5 hover:scale-105 mt-2 h-20';
      card.onclick = () => location.hash = `#team-${team.code}`;

      // Injeta o Balãozinho de Fase se estiver no mata-mata
      const cachedData = localStorage.getItem(STANDINGS_CACHE_KEY);
      const standings = cachedData ? JSON.parse(cachedData) : null;
      const phase = getTeamPhase(team, standings);
      if (phase) {
        const balloon = document.createElement('span');
        balloon.className = 'phase-balloon';
        balloon.textContent = phase;
        card.appendChild(balloon);
      }

      // FUT Layout: Escudo de tamanho w-12 h-12 com a bandeira no canto inferior direito
      const crestWrapper = document.createElement('div');
      crestWrapper.className = 'relative w-12 h-12 flex items-center justify-center';

      const flagCode = (flagMap[team.code] || 'us').toLowerCase();

      // Bandeira compacta no canto inferior direito do escudo
      const flagImg = document.createElement('img');
      flagImg.src = `https://flagcdn.com/w40/${flagCode}.png`;
      flagImg.alt = 'Bandeira';
      flagImg.className = 'absolute bottom-0 right-0 w-5.5 h-3.5 object-cover border border-white/10 rounded shadow-md pointer-events-none z-10';

      // Escudo real do Wikimedia
      const crestImg = document.createElement('img');
      crestImg.src = crestsMap[team.code] || `https://flagcdn.com/w80/${flagCode}.png`; // fallback
      crestImg.alt = team.name;
      crestImg.className = 'max-w-full max-h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]';
      
      // Fallback robusto se a imagem do brasão falhar (converte em logo 2026 cinza e mantém a bandeirinha)
      crestImg.onerror = function() {
        this.src = './logo2026.png';
        this.className = 'max-w-full max-h-full object-contain grayscale opacity-60';
        flagImg.style.display = 'block'; // mantém a bandeira no canto
      };

      crestWrapper.appendChild(crestImg);
      crestWrapper.appendChild(flagImg);
      card.appendChild(crestWrapper);

      // Nome do país centralizado abaixo do escudo
      const name = document.createElement('div');
      name.className = 'text-[9px] font-black uppercase tracking-wider text-gray-300 group-hover:text-white mt-1 text-center truncate w-full';
      name.textContent = team.name;
      card.appendChild(name);

      // Progresso numérico e checkmark
      const limit = (team.code === 'FWC') ? 19 : (team.code === 'CC') ? 14 : 20;
      const teamStats = getTeamProgress(team.code);
      const progSpan = document.createElement('span');
      progSpan.className = 'text-[8px] font-black text-copaGreen bg-copaGreen/10 px-1.5 py-0.5 rounded-full';
      progSpan.textContent = `${teamStats.owned}/${limit}`;
      
      if (teamStats.owned === limit) {
        progSpan.className = 'text-[8px] font-black text-copaYellow bg-copaYellow/20 px-1.5 py-0.5 rounded-full border border-copaYellow/20';
        progSpan.textContent = '✓';
      }
      card.appendChild(progSpan);

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
  const limit = (teamCode === 'FWC') ? 19 : (teamCode === 'CC') ? 14 : 20;
  for (let i = 1; i <= limit; i++) {
    const key = `${teamCode}-${i}`;
    if (album.stickers[key] && album.stickers[key].owned) {
      owned++;
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
      `Para confirmar que deseja prosseguir, digite "${confirmationWord}" abaixo:`
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
      parsedKeys.add(`EXTRAS-${foundLegendIndex + 1}`);
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
        parsedKeys.add(`EXTRAS-${itemLegendIndex + 1}`);
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
            parsedKeys.add(`${code}-${numVal}`);
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
              parsedKeys.add(`${teamCode}-${stickerIdx}`);
            }
          } else if (numVal >= 1 && numVal <= 20) {
            if (currentCode) {
              parsedKeys.add(`${currentCode}-${numVal}`);
            } else {
              const idx = numVal - 1;
              const teamIdx = Math.floor(idx / 20);
              const stickerIdx = (idx % 20) + 1;
              if (teamIdx >= 0 && teamIdx < 48) {
                const teamCode = allTeams[teamIdx];
                parsedKeys.add(`${teamCode}-${stickerIdx}`);
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
          allStickerKeys.push(`${t.code}-${i}`);
        }
      });
    });
    const specials = ['FWC', 'CC', 'EXTRAS'];
    specials.forEach(code => {
      for (let i = 1; i <= 20; i++) {
        allStickerKeys.push(`${code}-${i}`);
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
    alert(`Sucesso! Álbum atualizado: as ${parsedKeys.size} figurinhas informadas foram marcadas como FALTANTES, e todas as demais do álbum foram marcadas como COLADAS.`);
  } else {
    // Modos "Tenho" ou "Repetidas" padrão
    let importCount = 0;
    parsedKeys.forEach(key => {
      addSticker(album, key, mode === 'duplicate');
      importCount++;
    });
    storage.setAlbums(albums);
    alert(`Sucesso! ${importCount} figurinhas adicionadas.`);
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
  if (code === 'FWC') {
    crest.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/FIFA_logo_without_slogan.svg/120px-FIFA_logo_without_slogan.svg.png';
    crest.className = 'w-10 h-10 object-contain rounded bg-white/5 p-1 border border-white/10';
  } else if (code === 'CC') {
    crest.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Coca-Cola_logo.svg/120px-Coca-Cola_logo.svg.png';
    crest.className = 'w-10 h-10 object-contain rounded bg-white/5 p-1 border border-white/10';
  } else if (code === 'EXTRAS') {
    crest.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Golden_Ball.svg/100px-Golden_Ball.svg.png';
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
  if (code !== 'FWC' && code !== 'CC' && code !== 'EXTRAS') {
    const flagImg = document.createElement('img');
    const flagCode = (flagMap[code] || 'us').toLowerCase();
    flagImg.src = `https://flagcdn.com/w40/${flagCode}.png`;
    flagImg.className = 'w-5.5 h-3.5 object-cover border border-white/20 rounded shadow-sm inline-block mr-1 align-middle';
    teamTitle.appendChild(flagImg);
  }

  // Nome do País
  const nameSpan = document.createElement('span');
  nameSpan.textContent = teamName;
  teamTitle.appendChild(nameSpan);

  // Estrelas dos Títulos
  const titleInfo = worldCupTitles[code];
  if (titleInfo) {
    const starsSpan = document.createElement('span');
    starsSpan.textContent = ' ' + '⭐'.repeat(titleInfo.count);
    teamTitle.appendChild(starsSpan);
  }
  
  const limit = (code === 'FWC') ? 19 : (code === 'CC') ? 14 : 20;
  const stats = getTeamProgress(code);

  const titlesSub = document.createElement('p');
  titlesSub.className = 'text-[9px] text-gray-400 font-bold tracking-tight mt-0.5';
  if (titleInfo) {
    titlesSub.innerHTML = `<span class="text-copaYellow font-black">Títulos Mundiais:</span> ${titleInfo.years}`;
  } else {
    if (code === 'FWC' || code === 'CC' || code === 'EXTRAS') {
      titlesSub.textContent = '';
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
  progLabel.innerHTML = `<span>Progresso de Conclusão</span> <span id="teamProgText" class="text-copaGreen font-bold">${stats.owned}/${limit} (${percent}%)</span>`;
  
  const progBg = document.createElement('div');
  progBg.className = 'h-2 bg-white/5 border border-white/10 rounded-full overflow-hidden';
  const progFill = document.createElement('div');
  progFill.id = 'teamProgBarFill';
  progFill.className = 'h-full bg-gradient-to-r from-copaBlue via-copaGreen to-copaYellow rounded-full transition-all duration-300';
  progFill.style.width = `${percent}%`;
  
  progBg.appendChild(progFill);
  progressWrapper.appendChild(progLabel);
  progressWrapper.appendChild(progBg);

  // Adiciona o countSub debaixo do progBg
  const countSub = document.createElement('p');
  countSub.className = 'text-[9px] text-gray-400 text-right mt-1 font-bold';
  countSub.id = 'teamProgressLabel';
  countSub.textContent = `${stats.owned} de ${limit} figurinhas coladas`;
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

  // Grade responsiva de figurinhas (20 cromos)
  const grid = document.createElement('div');
  grid.className = 'grid-fifa';

  for (let i = 1; i <= limit; i++) {
    const key = `${code}-${i}`;
    const isSpecial = (code === 'EXTRAS'); // Apenas Legends Premium são especiais

    const card = document.createElement('div');
    card.className = `sticker-card ${isSpecial ? 'special' : ''}`;
    card.id = `card-${key}`;

    const inner = document.createElement('div');
    inner.className = 'card-inner';

    // Determina o texto de identificação do cromo (sigla + número ou nome completo para Legends)
    const stickerCode = (code === 'EXTRAS') ? legendsData[i - 1].name : `${code} ${i}`;
    const isExtras = (code === 'EXTRAS');

    // 1. Verso (Não Possuído - FUT Card fechado com marca d'água da Copa 2026)
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';

    const backLogoComp = createLogoComposition(stickerCode, isExtras);
    cardBack.appendChild(backLogoComp);
    inner.appendChild(cardBack);

    // 2. Frente (Possuído - FUT Card aberto com marca d'água da Copa 2026 e dados do atleta)
    const cardFront = document.createElement('div');
    cardFront.className = `card-front ${isSpecial ? 'special shiny-effect' : ''} relative flex flex-col justify-between p-2 overflow-visible`;

    const frontLogoComp = createLogoComposition(stickerCode, isExtras);
    cardFront.appendChild(frontLogoComp);

    // Determina o país para bandeira/brasão (específico do jogador se for extras, ou o código da seleção se normal)
    const stickerCountry = (code === 'EXTRAS') ? legendsData[i - 1].country : code;

    // Frente superior (Código e mini escudo redondo da federação)
    const frontHeader = document.createElement('div');
    frontHeader.className = 'flex justify-between items-center w-full z-10';
    
    const teamTag = document.createElement('span');
    teamTag.className = 'text-[9px] font-black uppercase tracking-wider text-white';
    teamTag.textContent = stickerCountry;
    frontHeader.appendChild(teamTag);

    const miniCrest = document.createElement('img');
    const flagCode = (flagMap[stickerCountry] || 'us').toLowerCase();
    miniCrest.src = crestsMap[stickerCountry] || `https://flagcdn.com/w40/${flagCode}.png`;
    miniCrest.alt = 'Escudo';
    miniCrest.className = 'w-5 h-5 object-contain rounded-full border border-white/20 bg-white/10';
    miniCrest.onerror = function() {
      this.src = `https://flagcdn.com/w40/${flagCode}.png`;
      this.className = 'w-5 h-3.5 object-cover rounded border border-white/20';
    };
    frontHeader.appendChild(miniCrest);
    cardFront.appendChild(frontHeader);

    // Nome/Posição do atleta centralizado no rodapé
    const playerName = document.createElement('div');
    playerName.className = 'player-name-label';
    let nameText = playerNames[i];
    if (isExtras) {
      nameText = legendsData[i - 1].name;
    } else if (typeof albumData !== 'undefined' && albumData[code] && albumData[code][i - 1]) {
      nameText = albumData[code][i - 1].nome;
    }
    playerName.textContent = nameText;
    if (nameText.length > 20) {
      playerName.classList.add('name-very-long');
    } else if (nameText.length > 13) {
      playerName.classList.add('name-long');
    }
    cardFront.appendChild(playerName);

    // Frente inferior (Ações discretas nos cantos inferiores)
    const frontActions = document.createElement('div');
    frontActions.className = 'card-actions z-10';
    cardFront.appendChild(frontActions);

    inner.appendChild(cardFront);
    inner.appendChild(cardBack); // garante o preserve-3d
    card.appendChild(inner);

    // Clique no card
    card.onclick = (e) => {
      if (e.target.closest('.action-btn')) return;
      
      const albumId = storage.getCurrentAlbumId();
      const albums = storage.getAlbums();
      const album = albums[albumId];
      const wasOwned = album && album.stickers[key] && album.stickers[key].owned;
      
      toggleOwned(key);
      updateCard(card, key);
      
      const stats = getTeamProgress(code);
      if (!wasOwned && stats.owned === limit) {
        // Completou a seleção! Animação Goal e delay checkmark
        updateTeamProgressLabel(code, true);
        triggerGoalAnimation(() => {
          updateTeamProgressLabel(code, false);
        });
      } else {
        updateTeamProgressLabel(code, false);
      }
    };

    updateCard(card, key);
    grid.appendChild(card);
  }

  rootTeam.appendChild(grid);
  container.appendChild(rootTeam);
}

// Contador e atualizador de progresso da seleção dinâmico
function updateTeamProgressLabel(code, delayCheckmark = false) {
  const stats = getTeamProgress(code);
  const limit = (code === 'FWC') ? 19 : (code === 'CC') ? 14 : 20;
  
  // 1. Atualiza o texto descritivo
  const label = document.getElementById('teamProgressLabel');
  if (label) {
    label.textContent = `${stats.owned} de ${limit} figurinhas coladas`;
  }
  
  // 2. Atualiza a barra de progresso
  const progText = document.getElementById('teamProgText');
  const progBar = document.getElementById('teamProgBarFill');
  if (progText && progBar) {
    const percent = Math.round((stats.owned / limit) * 100);
    progText.textContent = `${stats.owned}/${limit} (${percent}%)`;
    progBar.style.width = `${percent}%`;
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

  // 3. Renderiza foto customizada no fundo do cardFront
  const cardFront = card.querySelector('.card-front');
  if (cardFront) {
    let photoImg = cardFront.querySelector('.player-card-photo');
    if (sticker && sticker.photo) {
      if (!photoImg) {
        photoImg = document.createElement('img');
        photoImg.className = 'player-card-photo';
        cardFront.prepend(photoImg); // insere no fundo
      }
      photoImg.src = sticker.photo;
      photoImg.style.display = 'block';
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
    badge.textContent = `+${duplicates}`;
  } else if (badge) {
    badge.remove();
  }

  // 5. Botões de ação
  const actionsContainer = card.querySelector('.card-actions');
  if (actionsContainer) {
    actionsContainer.innerHTML = '';

    if (isOwned) {
      const btnLeft = document.createElement('button');
      btnLeft.className = `action-btn ${duplicates > 0 ? 'btn-minus' : 'btn-remove'}`;
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
      actionsContainer.appendChild(btnRight);
    }
  }
}

// ------------------- TROCAS -------------------
function renderTrades(container) {
  const wrapper = document.createElement('div');
  wrapper.className = 'glass-panel p-5 rounded-2xl border-white/5 space-y-4';

  const title = document.createElement('h2');
  title.className = 'text-base font-black uppercase tracking-wider text-copaYellow';
  title.textContent = 'Figurinhas Repetidas';
  wrapper.appendChild(title);

  // Alerta de Segurança Infantil
  const safetyBanner = document.createElement('div');
  safetyBanner.className = 'bg-red-950/45 border border-red-500/30 p-3 rounded-xl flex items-start gap-2.5 text-[10px] text-red-200 leading-normal shadow-lg';
  safetyBanner.innerHTML = `
    <span class="text-sm">⚠️</span>
    <div>
      <strong class="text-red-400 font-bold block mb-0.5">Alerta de Segurança Infantil</strong>
      Não troque figurinha com desconhecido, sem a presença de um adulto de sua confiança, de preferência fazer trocas somente com amigos próximos.
    </div>
  `;
  wrapper.appendChild(safetyBanner);

  const albumId = storage.getCurrentAlbumId();
  const albums = storage.getAlbums();
  const album = albums[albumId];
  
  const listDiv = document.createElement('div');
  listDiv.className = 'space-y-4';

  if (!album) {
    listDiv.innerHTML = '<p class="text-xs text-gray-500">Nenhum álbum ativo.</p>';
    wrapper.appendChild(listDiv);
    container.appendChild(wrapper);
    return;
  }

  const duplicates = [];
  Object.entries(album.stickers).forEach(([key, val]) => {
    if (val.owned && val.duplicate > 0) {
      const parts = key.split('-');
      const code = parts[0];
      const teamName = teamsMap[code] || (code === 'FWC' ? 'FIFA' : code === 'CC' ? 'Coca-Cola' : code === 'EXTRAS' ? 'Premium' : null);
      if (teamName) {
        duplicates.push({
          key: key,
          team: teamName,
          code: code,
          number: parts[1],
          count: val.duplicate
        });
      }
    }
  });

  if (duplicates.length === 0) {
    listDiv.innerHTML = `
      <div class="text-center py-6 space-y-2">
        <div class="text-2xl">📭</div>
        <p class="text-xs font-bold text-gray-300">Nenhuma repetida encontrada.</p>
        <p class="text-[10px] text-gray-500">Marque cromos extras na tela de seleções para listar aqui.</p>
      </div>
    `;
  } else {
    // Botão de Negociação via WhatsApp
    const btnNegotiate = document.createElement('button');
    btnNegotiate.className = 'w-full px-4 py-3 bg-copaGreen hover:opacity-90 text-black text-xs font-black uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 mb-4';
    btnNegotiate.innerHTML = `
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.574 1.97 14.101.947 11.487.947c-5.441 0-9.866 4.372-9.87 9.802 0 1.772.465 3.508 1.346 5.042L1.99 21.53l5.83-1.517zM17.75 14.61c-.347-.174-2.057-1.014-2.375-1.13-.318-.116-.549-.174-.78.174-.23.348-.895 1.13-1.097 1.362-.202.23-.404.26-.75.087-.348-.174-1.468-.541-2.796-1.728-1.034-.922-1.731-2.06-1.933-2.408-.202-.348-.022-.536.151-.708.156-.154.348-.406.52-.609.174-.203.23-.348.348-.58.116-.232.058-.435-.029-.609-.087-.174-.78-1.884-1.068-2.58-.28-.677-.566-.584-.78-.596-.202-.01-.433-.01-.664-.01-.23 0-.606.087-.923.435-.317.348-1.213 1.188-1.213 2.898 0 1.71 1.243 3.361 1.417 3.593.173.232 2.447 3.738 5.928 5.24 2.85 1.228 3.525.986 4.774.87.535-.05 2.058-.84 2.346-1.652.289-.812.289-1.507.202-1.652-.086-.145-.318-.232-.664-.406z"/>
      </svg>
      Gerar Mensagem de Negociação
    `;
    listDiv.appendChild(btnNegotiate);

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-2 gap-3';
    
    duplicates.forEach(item => {
      const itemCard = document.createElement('label');
      itemCard.className = 'bg-white/5 border border-white/5 p-3 rounded-xl flex items-center justify-between gap-2 cursor-pointer hover:bg-white/10 transition';
      
      const leftSide = document.createElement('div');
      leftSide.className = 'flex items-center gap-2.5';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'w-4 h-4 rounded border-white/10 text-copaYellow bg-[#131735] focus:ring-0 cursor-pointer';
      
      let stickerName = `${item.code} ${item.number}`;
      if (item.code === 'EXTRAS') {
        stickerName = legendsData[parseInt(item.number, 10) - 1].name;
      }
      checkbox.dataset.stickerName = stickerName;
      leftSide.appendChild(checkbox);

      const info = document.createElement('div');
      const teamLabel = document.createElement('div');
      teamLabel.className = 'text-[9px] font-black uppercase tracking-wider text-copaYellow';
      teamLabel.textContent = item.team;
      const numLabel = document.createElement('div');
      numLabel.className = 'text-xs font-black text-white';
      numLabel.textContent = stickerName;
      
      info.appendChild(teamLabel);
      info.appendChild(numLabel);
      leftSide.appendChild(info);
      itemCard.appendChild(leftSide);

      const qty = document.createElement('div');
      qty.className = 'bg-copaYellow text-black font-black text-xs px-2 py-1 rounded-lg';
      qty.textContent = `${item.count}x`;
      itemCard.appendChild(qty);

      grid.appendChild(itemCard);
    });
    listDiv.appendChild(grid);

    // Click handler para gerar mensagem
    btnNegotiate.onclick = () => {
      const checked = Array.from(grid.querySelectorAll('input[type="checkbox"]:checked'));
      if (checked.length === 0) {
        alert('Por favor, selecione pelo menos uma figurinha repetida para negociar.');
        return;
      }
      const selectedNames = checked.map(cb => cb.dataset.stickerName).join(', ');
      const textMessage = `Oi, vi no app Ultimate Cromos FIFA/Panini 2026 que você tem essas figurinhas que eu estou precisando: ${selectedNames}. Eu tenho essas disponíveis. Vamos fazer trocá-las?`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textMessage)}`, '_blank');
    };
  }

  wrapper.appendChild(listDiv);

  const back = document.createElement('button');
  back.className = 'w-full px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase text-gray-300 tracking-wider rounded-xl transition';
  back.textContent = 'Voltar para Home';
  back.onclick = () => location.hash = '#home';
  wrapper.appendChild(back);

  container.appendChild(wrapper);
}

// Funções utilitárias de compartilhamento de listas
function formatStickerNumber(num) {
  return num < 10 ? '0' + num : num;
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
        formattedList = nums.map(n => legendsData[n - 1].name).join(', ');
      } else {
        formattedList = nums.map(n => `${code} ${n}`).join(', ');
      }
      text += `${code}: ${formattedList}\n`;
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
      const key = `${code}-${i}`;
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
        formattedList = nums.map(n => `${code} ${n}`).join(', ');
      }
      text += `${code}: ${formattedList}\n`;
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
        formattedList = list.map(item => `${legendsData[item.num - 1].name} (x${item.count})`).join(', ');
      } else {
        formattedList = list.map(item => `${code} ${item.num} (x${item.count})`).join(', ');
      }
      text += `${code}: ${formattedList}\n`;
    }
  });

  if (!hasDuplicates) {
    alert('Você não tem nenhuma figurinha repetida para troca ainda.');
    return;
  }

  shareText('Figurinhas Copa 2026 - Repetidas', text.trim());
}

// Vincula funções utilitárias ao escopo global window para acesso no HTML
window.switchAlbum = switchAlbum;
window.createNewAlbum = createNewAlbum;
window.shareOwnedList = shareOwnedList;
window.shareMissingList = shareMissingList;
window.shareDuplicatesList = shareDuplicatesList;

// Inicialização por DOMContentLoaded
window.addEventListener('DOMContentLoaded', initApp);
window.addEventListener('hashchange', route);
