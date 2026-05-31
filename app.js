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
  US: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/US_Soccer_Federation_logo.svg/120px-US_Soccer_Federation_logo.svg.png',
  MX: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Federacion_Mexicana_de_Futbol_Asociacion.svg/120px-Federacion_Mexicana_de_Futbol_Asociacion.svg.png',
  CA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Canada_Soccer_logo.svg/120px-Canada_Soccer_logo.svg.png',
  CR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Costa_Rica_Football_Federation_logo.svg/120px-Costa_Rica_Football_Federation_logo.svg.png',
  BR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Brazilian_Football_Confederation_logo.svg/120px-Brazilian_Football_Confederation_logo.svg.png',
  CO: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Federacion_Colombiana_de_Futbol_logo.svg/120px-Federacion_Colombiana_de_Futbol_logo.svg.png',
  PY: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Asociacion_Paraguaya_de_Futbol_logo.svg/120px-Asociacion_Paraguaya_de_Futbol_logo.svg.png',
  CM: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/F%C3%A9d%C3%A9ration_Camerounaise_de_Football_logo.svg/120px-F%C3%A9d%C3%A9ration_Camerounaise_de_Football_logo.svg.png',
  AR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Asociaci%C3%B3n_del_F%C3%BAtbol_Argentino_logo.svg/120px-Asociaci%C3%B3n_del_F%C3%BAtbol_Argentino_logo.svg.png',
  CL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Federaci%C3%B3n_de_F%C3%BAtbol_de_Chile_logo.svg/120px-Federaci%C3%B3n_de_F%C3%BAtbol_de_Chile_logo.svg.png',
  UY: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Asociaci%C3%B3n_Uruguaya_de_F%C3%BAtbol_logo.svg/120px-Asociaci%C3%B3n_Uruguaya_de_F%C3%BAtbol_logo.svg.png',
  SA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Saudi_Arabia_Football_Federation_logo.svg/120px-Saudi_Arabia_Football_Federation_logo.svg.png',
  FR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Logo_F%C3%A9d%C3%A9ration_Fran%C3%A7aise_de_Football.svg/120px-Logo_F%C3%A9d%C3%A9ration_Fran%C3%A7aise_de_Football.svg.png',
  MA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/F%C3%A9d%C3%A9ration_royale_marocaine_de_football.svg/120px-F%C3%A9d%C3%A9ration_royale_marocaine_de_football.svg.png',
  AT: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Austrian_Football_Association_logo.svg/120px-Austrian_Football_Association_logo.svg.png',
  NG: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Nigeria_Football_Federation_logo.svg/120px-Nigeria_Football_Federation_logo.svg.png',
  ES: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Real_Federaci%C3%B3n_Espa%C3%B1ola_de_F%C3%BAtbol_logo.svg/120px-Real_Federaci%C3%B3n_Espa%C3%B1ola_de_F%C3%BAtbol_logo.svg.png',
  JP: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Japan_Football_Association_logo.svg/120px-Japan_Football_Association_logo.svg.png',
  EC: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Federacion_Ecuatoriana_de_Futbol.svg/120px-Federacion_Ecuatoriana_de_Futbol.svg.png',
  EG: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Egyptian_Football_Association_logo.svg/120px-Egyptian_Football_Association_logo.svg.png',
  DE: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Deutscher_Fu%C3%9Fball-Bund_logo.svg/120px-Deutscher_Fu%C3%9Fball-Bund_logo.svg.png',
  BE: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Royal_Belgian_FA_logo.svg/120px-Royal_Belgian_FA_logo.svg.png',
  KR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Korea_Football_Association_logo.svg/120px-Korea_Football_Association_logo.svg.png',
  TN: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Tunisian_Football_Federation_logo.svg/120px-Tunisian_Football_Federation_logo.svg.png',
  'GB-ENG': 'https://upload.wikimedia.org/wikipedia/en/thumb/3/38/England_crest_2009.svg/120px-England_crest_2009.svg.png',
  SN: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/F%C3%A9d%C3%A9ration_S%C3%A9n%C3%A9galaise_de_Football.svg/120px-F%C3%A9d%C3%A9ration_S%C3%A9n%C3%A9galaise_de_Football.svg.png',
  IR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Football_Federation_Islamic_Republic_of_Iran_logo.svg/120px-Football_Federation_Islamic_Republic_of_Iran_logo.svg.png',
  HN: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Federaci%C3%B3n_Nacional_Aut%C3%B3noma_de_Honduras_logo.svg/120px-Federaci%C3%B3n_Nacional_Aut%C3%B3noma_de_Honduras_logo.svg.png',
  PT: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Federa%C3%A7%C3%A3o_Portuguesa_de_Futebol_logo.svg/120px-Federa%C3%A7%C3%A3o_Portuguesa_de_Futebol_logo.svg.png',
  GH: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Ghana_Football_Association_logo.svg/120px-Ghana_Football_Association_logo.svg.png',
  TR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Turkish_Football_Federation_logo.svg/120px-Turkish_Football_Federation_logo.svg.png',
  PE: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Federaci%C3%B3n_Peruana_de_F%C3%BAtbol_logo.svg/120px-Federaci%C3%B3n_Peruana_de_F%C3%BAtbol_logo.svg.png',
  IT: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Italy_national_football_team_logo_%282023%29.svg/120px-Italy_national_football_team_logo_%282023%29.svg.png',
  AU: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Football_Australia_logo.svg/120px-Football_Australia_logo.svg.png',
  DZ: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Algerian_Football_Federation_logo.svg/120px-Algerian_Football_Federation_logo.svg.png',
  JM: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Jamaica_Football_Federation_logo.svg/120px-Jamaica_Football_Federation_logo.svg.png',
  NL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Knvb_logo.svg/120px-Knvb_logo.svg.png',
  HR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Croatian_Football_Federation_logo.svg/120px-Croatian_Football_Federation_logo.svg.png',
  'GB-SCT': 'https://upload.wikimedia.org/wikipedia/en/thumb/6/65/Scottish_Football_Association_crest.svg/120px-Scottish_Football_Association_crest.svg.png',
  ML: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/F%C3%A9d%C3%A9ration_Malienne_de_Football.svg/120px-F%C3%A9d%C3%A9ration_Malienne_de_Football.svg.png',
  DK: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Dansk_Boldspil-Union_logo.svg/120px-Dansk_Boldspil-Union_logo.svg.png',
  CH: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Swiss_Football_Association_logo.svg/120px-Swiss_Football_Association_logo.svg.png',
  RS: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Football_Association_of_Serbia_logo.svg/120px-Football_Association_of_Serbia_logo.svg.png',
  PA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Federacion_Panamena_de_Futbol.svg/120px-Federacion_Panamena_de_Futbol.svg.png',
  UA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Ukrainian_Association_of_Football_logo.svg/120px-Ukrainian_Association_of_Football_logo.svg.png',
  SE: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Swedish_Football_Association_logo.svg/120px-Swedish_Football_Association_logo.svg.png',
  PL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Polish_Football_Association_logo.svg/120px-Polish_Football_Association_logo.svg.png',
  NZ: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/New_Zealand_Football_logo.svg/120px-New_Zealand_Football_logo.svg.png'
};

// Dados estruturados das seleções e grupos da Copa 2026 (48 seleções)
const groupsData = [
  { name: 'Grupo A', teams: [{ code: 'US', name: 'EUA' }, { code: 'MX', name: 'México' }, { code: 'CA', name: 'Canadá' }, { code: 'CR', name: 'Costa Rica' }] },
  { name: 'Grupo B', teams: [{ code: 'BR', name: 'Brasil' }, { code: 'CO', name: 'Colômbia' }, { code: 'PY', name: 'Paraguai' }, { code: 'CM', name: 'Camarões' }] },
  { name: 'Grupo C', teams: [{ code: 'AR', name: 'Argentina' }, { code: 'CL', name: 'Chile' }, { code: 'UY', name: 'Uruguai' }, { code: 'SA', name: 'Arábia S.' }] },
  { name: 'Grupo D', teams: [{ code: 'FR', name: 'França' }, { code: 'MA', name: 'Marrocos' }, { code: 'AT', name: 'Áustria' }, { code: 'NG', name: 'Nigéria' }] },
  { name: 'Grupo E', teams: [{ code: 'ES', name: 'Espanha' }, { code: 'JP', name: 'Japão' }, { code: 'EC', name: 'Equador' }, { code: 'EG', name: 'Egito' }] },
  { name: 'Grupo F', teams: [{ code: 'DE', name: 'Alemanha' }, { code: 'BE', name: 'Bélgica' }, { code: 'KR', name: 'Coreia do S.' }, { code: 'TN', name: 'Tunísia' }] },
  { name: 'Grupo G', teams: [{ code: 'GB-ENG', name: 'Inglaterra' }, { code: 'SN', name: 'Senegal' }, { code: 'IR', name: 'Irã' }, { code: 'HN', name: 'Honduras' }] },
  { name: 'Grupo H', teams: [{ code: 'PT', name: 'Portugal' }, { code: 'GH', name: 'Gana' }, { code: 'TR', name: 'Turquia' }, { code: 'PE', name: 'Peru' }] },
  { name: 'Grupo I', teams: [{ code: 'IT', name: 'Itália' }, { code: 'AU', name: 'Austrália' }, { code: 'DZ', name: 'Argélia' }, { code: 'JM', name: 'Jamaica' }] },
  { name: 'Grupo J', teams: [{ code: 'NL', name: 'Holanda' }, { code: 'HR', name: 'Croácia' }, { code: 'GB-SCT', name: 'Escócia' }, { code: 'ML', name: 'Mali' }] },
  { name: 'Grupo K', teams: [{ code: 'DK', name: 'Dinamarca' }, { code: 'CH', name: 'Suíça' }, { code: 'RS', name: 'Sérvia' }, { code: 'PA', name: 'Panamá' }] },
  { name: 'Grupo L', teams: [{ code: 'UA', name: 'Ucrânia' }, { code: 'SE', name: 'Suécia' }, { code: 'PL', name: 'Polônia' }, { code: 'NZ', name: 'N. Zelândia' }] }
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

// Utilidades
function generateId() {
  return 'alb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
}

// Inicializa a aplicação
function initApp() {
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
  
  // Total de figurinhas: 48 seleções * 20 figurinhas cada = 960 figurinhas
  const totalStickers = Object.keys(teamsMap).length * 20;
  let ownedCount = 0;
  let dupCount = 0;
  
  Object.entries(album.stickers).forEach(([key, val]) => {
    const parts = key.split('-');
    if (teamsMap[parts[0]]) {
      if (val.owned) ownedCount++;
      dupCount += (val.duplicate || 0);
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
    { id: 'sms', label: 'SMS de 6 Dígitos' },
    { id: 'google', label: 'Google Account' },
    { id: 'apple', label: 'Apple ID' }
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
    { title: 'FW FIFA', desc: 'Especial Copa', hash: '#team-FWFIFA' },
    { title: 'Escudos', desc: 'Metálicos', hash: '#team-ESCUDOS' },
    { title: 'Premium', desc: 'Fig. Extras', hash: '#team-EXTRAS' }
  ];

  specialSections.forEach(sec => {
    const box = document.createElement('div');
    box.className = 'glass-panel p-3 rounded-xl border-white/5 hover:border-copaYellow/30 cursor-pointer flex flex-col justify-center items-center text-center transition group relative overflow-hidden';
    box.onclick = () => location.hash = sec.hash;

    const title = document.createElement('h4');
    title.className = 'font-black text-xs text-copaYellow uppercase tracking-wider group-hover:scale-105 transition';
    title.textContent = sec.title;
    
    const desc = document.createElement('p');
    desc.className = 'text-[9px] text-gray-500 font-semibold';
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
    
    const gTitle = document.createElement('h4');
    gTitle.className = 'font-black text-[10px] text-gray-500 uppercase tracking-widest border-b border-white/5 pb-1';
    gTitle.textContent = g.name;
    groupCard.appendChild(gTitle);

    // Grid de 4 colunas para caber as 4 seleções na mesma linha horizontal
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-4 gap-1';

    g.teams.forEach(team => {
      const card = document.createElement('div');
      // SEM QUADRANTE: apenas padding, cursor, flex e hover scale
      card.className = 'cursor-pointer transition flex flex-col items-center justify-start gap-1 group relative py-1.5 px-0.5 hover:scale-105';
      card.onclick = () => location.hash = `#team-${team.code}`;

      // FUT Layout: Escudo de tamanho w-12 h-12 com a bandeira no canto inferior direito
      const crestWrapper = document.createElement('div');
      crestWrapper.className = 'relative w-12 h-12 flex items-center justify-center';

      // Bandeira compacta no canto inferior direito do escudo
      const flagImg = document.createElement('img');
      flagImg.src = `https://flagcdn.com/w40/${team.code.toLowerCase()}.png`;
      flagImg.alt = 'Bandeira';
      flagImg.className = 'absolute bottom-0 right-0 w-5.5 h-3.5 object-cover border border-white/10 rounded shadow-md pointer-events-none z-10';

      // Escudo real do Wikimedia
      const crestImg = document.createElement('img');
      crestImg.src = crestsMap[team.code] || `https://flagcdn.com/w80/${team.code.toLowerCase()}.png`; // fallback
      crestImg.alt = team.name;
      crestImg.className = 'max-w-full max-h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]';
      
      // Fallback robusto se a imagem do brasão falhar (converte em bandeira média e esconde a sobreposta)
      crestImg.onerror = function() {
        this.src = `https://flagcdn.com/w80/${team.code.toLowerCase()}.png`;
        this.className = 'w-10 h-7 object-cover rounded shadow border border-white/10 mt-2.5';
        flagImg.style.display = 'none';
      };

      crestWrapper.appendChild(crestImg);
      crestWrapper.appendChild(flagImg);
      card.appendChild(crestWrapper);

      // Nome do país centralizado abaixo do escudo
      const name = document.createElement('div');
      name.className = 'text-[9px] font-black uppercase tracking-wider text-gray-300 group-hover:text-white mt-1 text-center truncate w-full';
      name.textContent = team.name;
      card.appendChild(name);

      // Progresso numérico
      const teamStats = getTeamProgress(team.code);
      const progSpan = document.createElement('span');
      progSpan.className = 'text-[8px] font-black text-copaGreen bg-copaGreen/10 px-1.5 py-0.5 rounded-full';
      progSpan.textContent = `${teamStats.owned}/20`;
      
      if (teamStats.owned === 20) {
        progSpan.className = 'text-[8px] font-black text-copaYellow bg-copaYellow/20 px-1.5 py-0.5 rounded-full border border-copaYellow/20';
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
  for (let i = 1; i <= 20; i++) {
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
  hint.innerHTML = `
    Insira seus códigos de cromos. Formatos aceitos: 
    <br><strong>BR 1, BR 2, BR 15</strong> ou <strong>AR 1 2 5 10</strong>.
  `;
  wrapper.appendChild(hint);

  const textarea = document.createElement('textarea');
  textarea.id = 'importArea';
  textarea.className = 'w-full h-36 p-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-copaYellow text-xs text-white placeholder-gray-600';
  textarea.placeholder = 'Exemplo:\nBR 1, BR 2, BR 5\nAR 3 4 8 9';
  wrapper.appendChild(textarea);

  const btnContainer = document.createElement('div');
  btnContainer.className = 'flex flex-col gap-2';

  const btnHave = document.createElement('button');
  btnHave.className = 'w-full px-4 py-2.5 bg-copaGreen hover:opacity-90 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition';
  btnHave.textContent = "Importar como 'Tenho'";
  btnHave.onclick = () => processImport(false);

  const btnDup = document.createElement('button');
  btnDup.className = 'w-full px-4 py-2.5 bg-copaYellow hover:opacity-90 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition';
  btnDup.textContent = "Importar como 'Repetidas'";
  btnDup.onclick = () => processImport(true);

  btnContainer.appendChild(btnHave);
  btnContainer.appendChild(btnDup);
  wrapper.appendChild(btnContainer);

  const back = document.createElement('button');
  back.className = 'w-full px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase text-gray-300 tracking-wider rounded-xl transition';
  back.textContent = 'Voltar para Home';
  back.onclick = () => location.hash = '#home';
  wrapper.appendChild(back);

  container.appendChild(wrapper);
}

function processImport(asDuplicate) {
  const text = document.getElementById('importArea').value.trim();
  if (!text) return alert('Insira códigos para importar.');

  const lines = text.split(/\n|,|;/).map(s => s.trim()).filter(Boolean);
  const albumId = storage.getCurrentAlbumId();
  const albums = storage.getAlbums();
  const album = albums[albumId];

  let importCount = 0;

  lines.forEach(line => {
    const m1 = line.match(/^([A-Z]{2,3}(?:-[A-Z]+)?)\s+([0-9\s,]+)$/i);
    if (m1) {
      const code = m1[1].toUpperCase();
      const nums = m1[2].split(/[\s,]+/).filter(Boolean);
      nums.forEach(n => {
        const numVal = parseInt(n, 10);
        if (numVal >= 1 && numVal <= 20) {
          addSticker(album, `${code}-${numVal}`, asDuplicate);
          importCount++;
        }
      });
    } else {
      const m2 = line.match(/^([A-Z]{2,3}(?:-[A-Z]+)?)-([0-9]+)$/i);
      if (m2) {
        const code = m2[1].toUpperCase();
        const numVal = parseInt(m2[2], 10);
        if (numVal >= 1 && numVal <= 20) {
          addSticker(album, `${code}-${numVal}`, asDuplicate);
          importCount++;
        }
      }
    }
  });

  storage.setAlbums(albums);
  alert(`Sucesso! ${importCount} figurinhas adicionadas.`);
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
  
  const flag = document.createElement('img');
  flag.src = `https://flagcdn.com/w80/${code.toLowerCase()}.png`;
  flag.alt = teamName;
  flag.className = 'w-12 h-8 object-cover rounded shadow border border-white/10';
  infoSide.appendChild(flag);

  const textBlock = document.createElement('div');
  
  const teamTitle = document.createElement('h2');
  teamTitle.id = 'teamTitleText';
  teamTitle.className = 'text-lg font-black uppercase tracking-wide flex items-center';
  teamTitle.textContent = teamName;
  
  const countSub = document.createElement('p');
  countSub.className = 'text-[10px] text-gray-400';
  countSub.id = 'teamProgressLabel';
  
  const stats = getTeamProgress(code);
  countSub.textContent = `${stats.owned} de 20 figurinhas coladas`;
  
  textBlock.appendChild(teamTitle);
  textBlock.appendChild(countSub);
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
  const percent = Math.round((stats.owned / 20) * 100);
  progLabel.innerHTML = `<span>Progresso de Conclusão</span> <span id="teamProgText" class="text-copaGreen font-bold">${stats.owned}/20 (${percent}%)</span>`;
  
  const progBg = document.createElement('div');
  progBg.className = 'h-2 bg-white/5 border border-white/10 rounded-full overflow-hidden';
  const progFill = document.createElement('div');
  progFill.id = 'teamProgBarFill';
  progFill.className = 'h-full bg-gradient-to-r from-copaBlue via-copaGreen to-copaYellow rounded-full transition-all duration-300';
  progFill.style.width = `${percent}%`;
  
  progBg.appendChild(progFill);
  progressWrapper.appendChild(progLabel);
  progressWrapper.appendChild(progBg);
  headerPanel.appendChild(progressWrapper);

  // Injeta o check verde de 100% completo
  if (stats.owned === 20) {
    const check = document.createElement('span');
    check.className = 'check-mark text-copaGreen font-black text-lg ml-2 animate-bounce inline-block drop-shadow-[0_0_8px_#00e676]';
    check.textContent = '✓';
    teamTitle.appendChild(check);
  }

  rootTeam.appendChild(headerPanel);

  // Grade responsiva de figurinhas (20 cromos)
  const grid = document.createElement('div');
  grid.className = 'grid-fifa';

  for (let i = 1; i <= 20; i++) {
    const key = `${code}-${i}`;
    const isSpecial = (i === 1 || i === 2); // Escudo e Time

    const card = document.createElement('div');
    card.className = `sticker-card ${isSpecial ? 'special' : ''}`;
    card.id = `card-${key}`;

    const inner = document.createElement('div');
    inner.className = 'card-inner';

    // 1. Verso (Não Possuído - FUT Card fechado, sem o "26" e com numeração no modelo "KOR 10")
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';

    const backNum = document.createElement('div');
    backNum.className = 'card-back-number';
    backNum.textContent = `${code} ${i}`; // ex: KOR 10
    cardBack.appendChild(backNum);
    inner.appendChild(cardBack);

    // 2. Frente (Possuído - Panini Cromo Estilizado)
    const cardFront = document.createElement('div');
    cardFront.className = `card-front panini-sticker ${isSpecial ? 'special shiny-effect' : ''} relative flex flex-col justify-between p-2 overflow-hidden`;

    // Silhueta do atleta de fundo
    const silhouette = document.createElement('div');
    silhouette.className = 'absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none z-0';
    silhouette.innerHTML = `
      <svg class="w-full h-24 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 10.2v3.8c0 .6.4 1 1 1s1-.4 1-1v-2.8l1.8-.8c.4-.2.6-.5.7-.9l.8-2.6 1.7 1.7v5.8h-2c-.6 0-1 .4-1 1s.4 1 1 1h5v-8.2l-2.1-2.1c-.4-.4-1-.5-1.5-.3l-3.3 1.5c-.7.3-1.1 1-1 1.7.1.5.5.9 1 1zM20 22h-1.5l-3-6.5h-1L16 22h-2l-1.6-7.5c-.1-.5-.5-.9-1-.9h-.9L9 22H7l1.7-9.5c.1-.5.5-.9 1-.9h3.6c.8 0 1.5.5 1.7 1.2L16.5 18h1L19 14.5c.2-.5.7-.9 1.3-.9h1.7v2H20l-1.5 3.5h1.5v3z"/>
      </svg>
    `;
    cardFront.appendChild(silhouette);

    // Frente superior (Código e mini escudo redondo da federação)
    const frontHeader = document.createElement('div');
    frontHeader.className = 'flex justify-between items-center w-full z-10';
    
    const teamTag = document.createElement('span');
    teamTag.className = 'text-[9px] font-black uppercase tracking-wider text-white';
    teamTag.textContent = code;
    frontHeader.appendChild(teamTag);

    const miniCrest = document.createElement('img');
    miniCrest.src = crestsMap[code] || `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
    miniCrest.alt = 'Escudo';
    miniCrest.className = 'w-5 h-5 object-contain rounded-full border border-white/20 bg-white/10';
    miniCrest.onerror = function() {
      this.src = `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
      this.className = 'w-5 h-3.5 object-cover rounded border border-white/20';
    };
    frontHeader.appendChild(miniCrest);
    cardFront.appendChild(frontHeader);

    // Frente centro (Número/Tipo de cromo)
    const frontNum = document.createElement('div');
    frontNum.className = 'text-center font-black text-2xl py-1 my-auto tracking-tighter text-white z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]';
    frontNum.textContent = isSpecial ? (i === 1 ? '★ ESC' : '★ TIM') : i;
    cardFront.appendChild(frontNum);

    // Rodapé Laranja/Coral da figurinha Panini contendo o número e nome do atleta
    const playerFooter = document.createElement('div');
    playerFooter.className = 'bg-[#ff5e62] text-white text-[7.5px] font-black py-0.5 px-1.5 rounded flex justify-between items-center w-full z-10 border border-white/10 tracking-wide';
    playerFooter.innerHTML = `<span>Nº ${i}</span> <span class="truncate uppercase max-w-[65px]">${playerNames[i]}</span>`;
    cardFront.appendChild(playerFooter);

    // Frente inferior (Ações)
    const frontActions = document.createElement('div');
    frontActions.className = 'card-actions z-10';
    cardFront.appendChild(frontActions);

    inner.appendChild(cardFront);
    inner.appendChild(cardBack); // garante o preserve-3d
    card.appendChild(inner);

    // Clique no card
    card.onclick = (e) => {
      if (e.target.closest('.action-btn')) return;
      
      const album = storage.getAlbums()[storage.getCurrentAlbumId()];
      const sticker = album.stickers[key];
      const isOwned = sticker && sticker.owned;
      
      if (!isOwned) {
        toggleOwned(key);
        updateCard(card, key);
        updateTeamProgressLabel(code);
      }
    };

    updateCard(card, key);
    grid.appendChild(card);
  }

  rootTeam.appendChild(grid);
  container.appendChild(rootTeam);
}

// Contador e atualizador de progresso da seleção dinâmico
function updateTeamProgressLabel(code) {
  const stats = getTeamProgress(code);
  
  // 1. Atualiza o texto descritivo
  const label = document.getElementById('teamProgressLabel');
  if (label) {
    label.textContent = `${stats.owned} de 20 figurinhas coladas`;
  }
  
  // 2. Atualiza a barra de progresso
  const progText = document.getElementById('teamProgText');
  const progBar = document.getElementById('teamProgBarFill');
  if (progText && progBar) {
    const percent = Math.round((stats.owned / 20) * 100);
    progText.textContent = `${stats.owned}/20 (${percent}%)`;
    progBar.style.width = `${percent}%`;
  }
  
  // 3. Adiciona ou remove o ícone de Check (✓) verde no título
  const teamTitle = document.getElementById('teamTitleText');
  if (teamTitle) {
    if (stats.owned === 20) {
      if (!teamTitle.querySelector('.check-mark')) {
        const check = document.createElement('span');
        check.className = 'check-mark text-copaGreen font-black text-lg ml-2 animate-bounce inline-block drop-shadow-[0_0_8px_#00e676]';
        check.textContent = '✓';
        teamTitle.appendChild(check);
      }
    } else {
      const check = teamTitle.querySelector('.check-mark');
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

  // 1. Aplica o Flip 3D
  if (isOwned) {
    card.classList.add('is-flipped');
  } else {
    card.classList.remove('is-flipped');
  }

  // 2. Badge de repetida (FUT style)
  let badge = card.querySelector('.rep-badge');
  if (isOwned && duplicates > 0) {
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'rep-badge';
      card.appendChild(badge);
    }
    badge.textContent = `x${duplicates}`;
  } else if (badge) {
    badge.remove();
  }

  // 3. Botões de ação
  const actionsContainer = card.querySelector('.card-actions');
  if (actionsContainer) {
    actionsContainer.innerHTML = '';

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
      updateTeamProgressLabel(key.split('-')[0]);
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
    actionsContainer.appendChild(btnRight);
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
      const teamName = teamsMap[parts[0]];
      if (teamName) {
        duplicates.push({
          key: key,
          team: teamName,
          code: parts[0],
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
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-2 gap-3';
    
    duplicates.forEach(item => {
      const itemCard = document.createElement('div');
      itemCard.className = 'bg-white/5 border border-white/5 p-3 rounded-xl flex items-center justify-between gap-2';
      
      const info = document.createElement('div');
      const teamLabel = document.createElement('div');
      teamLabel.className = 'text-[9px] font-black uppercase tracking-wider text-copaYellow';
      teamLabel.textContent = item.team;
      const numLabel = document.createElement('div');
      numLabel.className = 'text-xs font-black text-white';
      numLabel.textContent = `Nº ${item.number}`;
      
      info.appendChild(teamLabel);
      info.appendChild(numLabel);
      itemCard.appendChild(info);

      const qty = document.createElement('div');
      qty.className = 'bg-copaYellow text-black font-black text-xs px-2 py-1 rounded-lg';
      qty.textContent = `${item.count}x`;
      itemCard.appendChild(qty);

      grid.appendChild(itemCard);
    });
    listDiv.appendChild(grid);
  }

  wrapper.appendChild(listDiv);

  const back = document.createElement('button');
  back.className = 'w-full px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase text-gray-300 tracking-wider rounded-xl transition';
  back.textContent = 'Voltar para Home';
  back.onclick = () => location.hash = '#home';
  wrapper.appendChild(back);

  container.appendChild(wrapper);
}

// Vincula funções utilitárias ao escopo global window para acesso no HTML
window.switchAlbum = switchAlbum;
window.createNewAlbum = createNewAlbum;

// Inicialização por DOMContentLoaded
window.addEventListener('DOMContentLoaded', initApp);
window.addEventListener('hashchange', route);
