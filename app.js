// app.js – lógica principal do álbum de figurinhas FIFA 2026
// Tema Ultimate FIFA - Modo Escuro & Glassmorphism com Card Flip 3D

const PALLETE = {
  blue: '#0033A0',
  green: '#009639',
  yellow: '#FFC726',
};

// Estrutura de dados no localStorage
// albums: { [albumId]: { name: string, stickers: { [code]: { owned: bool, duplicate: number } } } }
// currentAlbumId: string

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

// Dados estruturados das seleções e grupos da Copa 2026 (48 seleções)
const groupsData = [
  { name: 'Grupo A', teams: [{ code: 'US', name: 'EUA' }, { code: 'MX', name: 'México' }, { code: 'CA', name: 'Canadá' }, { code: 'CR', name: 'Costa Rica' }] },
  { name: 'Grupo B', teams: [{ code: 'BR', name: 'Brasil' }, { code: 'CO', name: 'Colômbia' }, { code: 'PY', name: 'Paraguai' }, { code: 'CM', name: 'Camarões' }] },
  { name: 'Grupo C', teams: [{ code: 'AR', name: 'Argentina' }, { code: 'CL', name: 'Chile' }, { code: 'UY', name: 'Uruguai' }, { code: 'SA', name: 'Arábia Saudita' }] },
  { name: 'Grupo D', teams: [{ code: 'FR', name: 'França' }, { code: 'MA', name: 'Marrocos' }, { code: 'AT', name: 'Áustria' }, { code: 'NG', name: 'Nigéria' }] },
  { name: 'Grupo E', teams: [{ code: 'ES', name: 'Espanha' }, { code: 'JP', name: 'Japão' }, { code: 'EC', name: 'Equador' }, { code: 'EG', name: 'Egito' }] },
  { name: 'Grupo F', teams: [{ code: 'DE', name: 'Alemanha' }, { code: 'BE', name: 'Bélgica' }, { code: 'KR', name: 'Coreia do Sul' }, { code: 'TN', name: 'Tunísia' }] },
  { name: 'Grupo G', teams: [{ code: 'GB-ENG', name: 'Inglaterra' }, { code: 'SN', name: 'Senegal' }, { code: 'IR', name: 'Irã' }, { code: 'HN', name: 'Honduras' }] },
  { name: 'Grupo H', teams: [{ code: 'PT', name: 'Portugal' }, { code: 'GH', name: 'Gana' }, { code: 'TR', name: 'Turquia' }, { code: 'PE', name: 'Peru' }] },
  { name: 'Grupo I', teams: [{ code: 'IT', name: 'Itália' }, { code: 'AU', name: 'Austrália' }, { code: 'DZ', name: 'Argélia' }, { code: 'JM', name: 'Jamaica' }] },
  { name: 'Grupo J', teams: [{ code: 'NL', name: 'Holanda' }, { code: 'HR', name: 'Croácia' }, { code: 'GB-SCT', name: 'Escócia' }, { code: 'ML', name: 'Mali' }] },
  { name: 'Grupo K', teams: [{ code: 'DK', name: 'Dinamarca' }, { code: 'CH', name: 'Suíça' }, { code: 'RS', name: 'Sérvia' }, { code: 'PA', name: 'Panamá' }] },
  { name: 'Grupo L', teams: [{ code: 'UA', name: 'Ucrânia' }, { code: 'SE', name: 'Suécia' }, { code: 'PL', name: 'Polônia' }, { code: 'NZ', name: 'Nova Zelândia' }] }
];

// Mapeamento plano de seleções para busca rápida
const teamsMap = {};
groupsData.forEach(g => {
  g.teams.forEach(t => {
    teamsMap[t.code] = t.name;
  });
});

// Utilidades
function generateId() {
  return 'alb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
}

// Inicializa a aplicação
function initApp() {
  console.log('Inicializando App FIFA 2026...');
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
    document.getElementById('appRoot').innerHTML = `
      <div class="glass-panel p-6 rounded-2xl max-w-md mx-auto mt-12 text-center border-red-500/30">
        <h2 class="text-xl font-bold text-red-400 mb-2">Erro de Inicialização</h2>
        <p class="text-gray-400 text-sm mb-4">Não foi possível carregar os dados salvos localmente no seu navegador.</p>
        <button onclick="localStorage.clear(); location.reload();" class="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors">
          Resetar Dados Locais
        </button>
      </div>
    `;
  }
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

// Roteador baseado em Hash
function route() {
  const hash = location.hash || '#home';
  const root = document.getElementById('appRoot');
  if (!root) return;
  
  root.innerHTML = '';
  
  if (hash.startsWith('#home')) {
    renderHome();
  } else if (hash.startsWith('#import')) {
    renderImport();
  } else if (hash.startsWith('#team-')) {
    const code = hash.split('-')[1];
    renderTeamPage(code);
  } else if (hash.startsWith('#trades')) {
    renderTrades();
  } else if (hash.startsWith('#login')) {
    renderLogin();
  } else {
    location.hash = '#home';
  }
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
    // Apenas conta se pertencer às seleções cadastradas
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
function renderLogin() {
  const root = document.getElementById('appRoot');
  const wrapper = document.createElement('div');
  wrapper.className = 'max-w-md mx-auto my-12 glass-panel p-8 rounded-2xl border-white/5 relative overflow-hidden';
  
  // Efeito brilhoso de fundo
  const glow = document.createElement('div');
  glow.className = 'absolute -top-24 -left-24 w-48 h-48 rounded-full bg-copaBlue/30 blur-3xl pointer-events-none';
  wrapper.appendChild(glow);

  const title = document.createElement('h2');
  title.className = 'text-2xl font-black text-center mb-1 uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400';
  title.textContent = 'Acessar Álbum';
  wrapper.appendChild(title);

  const sub = document.createElement('p');
  sub.className = 'text-center text-xs text-gray-400 mb-8';
  sub.textContent = 'Escolha um método rápido para gerenciar sua coleção';
  wrapper.appendChild(sub);

  const grid = document.createElement('div');
  grid.className = 'flex flex-col gap-3';

  const methods = [
    { id: 'sms', label: 'SMS de 6 Dígitos', desc: 'Acesso rápido por telefone' },
    { id: 'google', label: 'Google Account', desc: 'Sincronizar com sua conta Google' },
    { id: 'apple', label: 'Apple ID', desc: 'Entrar usando Apple' },
    { id: 'biometrics', label: 'Biometria local', desc: 'FaceID ou Digital no aparelho' }
  ];

  methods.forEach(m => {
    const btn = document.createElement('button');
    btn.className = 'flex items-center justify-between text-left p-4 rounded-xl bg-white/5 border border-white/5 hover:border-copaYellow/30 hover:bg-white/10 transition duration-200 group';
    btn.onclick = () => {
      // Cria/Seleciona álbum simulado
      const albums = storage.getAlbums();
      const newId = generateId();
      albums[newId] = { name: `Álbum (${m.label})`, stickers: {} };
      storage.setAlbums(albums);
      storage.setCurrentAlbumId(newId);
      renderHeader();
      location.hash = '#home';
    };

    const info = document.createElement('div');
    const lText = document.createElement('div');
    lText.className = 'font-bold text-sm text-gray-200 group-hover:text-white';
    lText.textContent = m.label;
    const dText = document.createElement('div');
    dText.className = 'text-[10px] text-gray-500';
    dText.textContent = m.desc;

    info.appendChild(lText);
    info.appendChild(dText);
    btn.appendChild(info);

    const arrow = document.createElement('div');
    arrow.className = 'text-gray-500 group-hover:text-copaYellow transition';
    arrow.innerHTML = '➔';
    btn.appendChild(arrow);

    grid.appendChild(btn);
  });

  wrapper.appendChild(grid);
  root.appendChild(wrapper);
}

// ------------------- HOME -------------------
function renderHome() {
  const root = document.getElementById('appRoot');
  const stats = getAlbumStats();

  const container = document.createElement('div');
  container.className = 'space-y-6 py-4 animate-fade-in';

  // 1. Painel de Estatísticas / Ultimate Progress
  const statsPanel = document.createElement('div');
  statsPanel.className = 'glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border-white/5';
  
  const statsGlow = document.createElement('div');
  statsGlow.className = 'absolute right-0 top-0 w-64 h-64 bg-copaGreen/10 rounded-full blur-3xl pointer-events-none';
  statsPanel.appendChild(statsGlow);

  const progressSection = document.createElement('div');
  progressSection.className = 'flex-1 space-y-2';
  
  const progressHeader = document.createElement('div');
  progressHeader.className = 'flex justify-between items-center text-xs font-black uppercase tracking-wider text-gray-400';
  progressHeader.innerHTML = `<span>Progresso Geral</span> <span class="text-copaYellow font-bold">${stats.percent}%</span>`;
  progressSection.appendChild(progressHeader);

  const progressBarBg = document.createElement('div');
  progressBarBg.className = 'h-3 bg-white/5 rounded-full overflow-hidden border border-white/10';
  const progressBarFill = document.createElement('div');
  progressBarFill.className = 'h-full bg-gradient-to-r from-copaBlue via-copaGreen to-copaYellow rounded-full transition-all duration-500';
  progressBarFill.style.width = `${stats.percent}%`;
  progressBarBg.appendChild(progressBarFill);
  progressSection.appendChild(progressBarBg);

  const textStats = document.createElement('div');
  textStats.className = 'flex gap-6 mt-4 text-xs font-semibold text-gray-300';
  textStats.innerHTML = `
    <div><span class="text-lg font-black text-white">${stats.owned}</span> / ${stats.total} Figurinhas</div>
    <div class="border-l border-white/10 pl-6"><span class="text-lg font-black text-copaYellow">${stats.duplicates}</span> Repetidas</div>
  `;
  progressSection.appendChild(textStats);
  statsPanel.appendChild(progressSection);

  // Botões de Ação Rápidos do Painel
  const quickActions = document.createElement('div');
  quickActions.className = 'flex gap-3 self-stretch md:self-center';
  
  const btnImport = document.createElement('button');
  btnImport.className = 'flex-1 md:flex-none px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase tracking-wider rounded-xl transition text-center';
  btnImport.textContent = 'Importar Códigos';
  btnImport.onclick = () => location.hash = '#import';
  
  const btnTrades = document.createElement('button');
  btnTrades.className = 'flex-1 md:flex-none px-4 py-2.5 bg-gradient-to-r from-copaBlue to-copaGreen hover:opacity-90 text-xs font-bold uppercase text-white tracking-wider rounded-xl transition text-center';
  btnTrades.textContent = 'Minhas Trocas';
  btnTrades.onclick = () => location.hash = '#trades';

  quickActions.appendChild(btnImport);
  quickActions.appendChild(btnTrades);
  statsPanel.appendChild(quickActions);
  container.appendChild(statsPanel);

  // 2. Banner de Troca Qualificada (Simulado)
  if (stats.duplicates > 0) {
    const banner = document.createElement('div');
    banner.className = 'bg-gradient-to-r from-copaYellow via-[#ffdd67] to-copaYellow text-black py-2.5 px-4 rounded-xl text-center text-xs font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 border border-white/10 animate-pulse';
    banner.innerHTML = `
      <span class="inline-block w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
      Troca Qualificada Disponível! Você possui cromos repetidos para negociar.
    `;
    container.appendChild(banner);
  }

  // 3. Seções Especiais / Seções do Álbum
  const sectionsGrid = document.createElement('div');
  sectionsGrid.className = 'grid grid-cols-1 md:grid-cols-3 gap-4';
  
  const specialSections = [
    { title: 'FW Fifa (Copa Especial)', desc: '10 cromos especiais lendários' },
    { title: 'FW Seleções (Estádios & Escudos)', desc: 'Cromos especiais metalizados' },
    { title: 'Figurinhas Extras / Premium', desc: 'Extra Gold, Silver e Bronze' }
  ];

  specialSections.forEach(sec => {
    const box = document.createElement('div');
    box.className = 'glass-panel p-4 rounded-xl border-white/5 hover:border-white/10 transition relative group cursor-pointer overflow-hidden';
    
    // Efeito holográfico na borda ao passar o mouse
    const edge = document.createElement('div');
    edge.className = 'absolute inset-0 border border-transparent group-hover:border-copaYellow/30 rounded-xl transition duration-300';
    box.appendChild(edge);

    const title = document.createElement('h4');
    title.className = 'font-black text-sm text-copaYellow uppercase tracking-wider mb-1';
    title.textContent = sec.title;
    
    const desc = document.createElement('p');
    desc.className = 'text-xs text-gray-400';
    desc.textContent = sec.desc;

    box.appendChild(title);
    box.appendChild(desc);
    sectionsGrid.appendChild(box);
  });
  container.appendChild(sectionsGrid);

  // 4. Divisor de Título Grupos
  const groupsTitle = document.createElement('h3');
  groupsTitle.className = 'text-sm font-black uppercase tracking-wider text-gray-400 border-b border-white/5 pb-2 mt-8';
  groupsTitle.textContent = 'Seleções por Grupos';
  container.appendChild(groupsTitle);

  // 5. Grid de Grupos (A a L)
  const groupsContainer = document.createElement('div');
  groupsContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-6';

  groupsData.forEach(g => {
    const groupCard = document.createElement('div');
    groupCard.className = 'glass-panel p-4 rounded-2xl border-white/5';
    
    const gTitle = document.createElement('h4');
    gTitle.className = 'font-black text-xs text-gray-400 uppercase tracking-widest mb-3 border-b border-white/5 pb-1';
    gTitle.textContent = g.name;
    groupCard.appendChild(gTitle);

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-2 sm:grid-cols-4 gap-2';

    g.teams.forEach(team => {
      const card = document.createElement('div');
      card.className = 'bg-white/5 border border-white/5 hover:border-copaYellow/30 hover:bg-white/10 p-3 rounded-xl text-center cursor-pointer transition flex flex-col items-center justify-between gap-2 group';
      card.onclick = () => location.hash = `#team-${team.code}`;

      // Bandeira da seleção
      const img = document.createElement('img');
      img.src = `https://flagcdn.com/w80/${team.code.toLowerCase()}.png`;
      img.alt = team.name;
      img.className = 'w-10 h-7 object-cover rounded shadow border border-white/10 group-hover:scale-105 transition duration-200';
      
      const name = document.createElement('div');
      name.className = 'text-[10px] font-black uppercase tracking-wider text-gray-300 group-hover:text-white mt-1';
      name.textContent = team.name;

      // Calcula progresso da seleção específica
      const teamStats = getTeamProgress(team.code);
      const progSpan = document.createElement('span');
      progSpan.className = 'text-[9px] font-bold text-copaGreen bg-copaGreen/10 px-1.5 py-0.5 rounded-full';
      progSpan.textContent = `${teamStats.owned}/20`;
      if (teamStats.owned === 20) {
        progSpan.className = 'text-[9px] font-bold text-copaYellow bg-copaYellow/10 px-1.5 py-0.5 rounded-full animate-bounce';
      }

      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(progSpan);
      grid.appendChild(card);
    });

    groupCard.appendChild(grid);
    groupsContainer.appendChild(groupCard);
  });

  container.appendChild(groupsContainer);
  root.appendChild(container);
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
function renderImport() {
  const root = document.getElementById('appRoot');
  const container = document.createElement('div');
  container.className = 'max-w-xl mx-auto my-6 glass-panel p-6 rounded-2xl border-white/5 space-y-4';

  const title = document.createElement('h2');
  title.className = 'text-xl font-black uppercase tracking-wider text-copaYellow';
  title.textContent = 'Importar Lista de Figurinhas';
  container.appendChild(title);

  const hint = document.createElement('p');
  hint.className = 'text-xs text-gray-400';
  hint.innerHTML = `
    Cole abaixo sua lista de figurinhas. Aceita formatos flexíveis separados por vírgula, ponto e vírgula ou linha. 
    <br>Exemplos: <strong>BR 1, BR 2, BR 15</strong> ou <strong>AR 1 2 5 10</strong>.
  `;
  container.appendChild(hint);

  const textarea = document.createElement('textarea');
  textarea.id = 'importArea';
  textarea.className = 'w-full h-44 p-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-copaYellow text-sm text-white placeholder-gray-600';
  textarea.placeholder = 'Exemplo:\nBR 1, BR 2, BR 5\nAR 3 4 8 9';
  container.appendChild(textarea);

  const btnContainer = document.createElement('div');
  btnContainer.className = 'flex flex-col sm:flex-row gap-3';

  const btnHave = document.createElement('button');
  btnHave.className = 'flex-1 px-4 py-2.5 bg-copaGreen hover:bg-copaGreen/90 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition';
  btnHave.textContent = "Importar como 'Tenho'";
  btnHave.onclick = () => processImport(false);

  const btnDup = document.createElement('button');
  btnDup.className = 'flex-1 px-4 py-2.5 bg-copaYellow hover:bg-copaYellow/90 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition';
  btnDup.textContent = "Importar como 'Repetidas'";
  btnDup.onclick = () => processImport(true);

  btnContainer.appendChild(btnHave);
  btnContainer.appendChild(btnDup);
  container.appendChild(btnContainer);

  const back = document.createElement('button');
  back.className = 'w-full px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase text-gray-300 tracking-wider rounded-xl transition';
  back.textContent = 'Voltar para Home';
  back.onclick = () => location.hash = '#home';
  container.appendChild(back);

  root.appendChild(container);
}

function processImport(asDuplicate) {
  const text = document.getElementById('importArea').value.trim();
  if (!text) {
    alert('Nenhum dado digitado.');
    return;
  }

  const lines = text.split(/\n|,|;/).map(s => s.trim()).filter(Boolean);
  const albumId = storage.getCurrentAlbumId();
  const albums = storage.getAlbums();
  const album = albums[albumId];

  let importCount = 0;

  lines.forEach(line => {
    // Tenta casar formato: "BR 1 2 3" ou "BR-1 BR-2"
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
      // Caso cole "BR-1", "AR-5" de forma individual
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
  alert(`Importação concluída! ${importCount} cromos adicionados.`);
  location.hash = '#home';
}

function addSticker(album, key, duplicate) {
  if (!album.stickers[key]) {
    album.stickers[key] = { owned: false, duplicate: 0 };
  }
  if (duplicate) {
    album.stickers[key].duplicate++;
    // Se marcou como repetida, assume também a posse
    album.stickers[key].owned = true;
  } else {
    album.stickers[key].owned = true;
  }
}

// ------------------- TEAM PAGE -------------------
function renderTeamPage(code) {
  const root = document.getElementById('appRoot');
  const teamName = teamsMap[code] || code;

  const container = document.createElement('div');
  container.className = 'space-y-6 py-4';

  // Cabeçalho da página de seleção
  const headerPanel = document.createElement('div');
  headerPanel.className = 'glass-panel p-6 rounded-2xl flex items-center justify-between gap-4 border-white/5';
  
  const infoSide = document.createElement('div');
  infoSide.className = 'flex items-center gap-4';
  
  const flag = document.createElement('img');
  flag.src = `https://flagcdn.com/w80/${code.toLowerCase()}.png`;
  flag.alt = teamName;
  flag.className = 'w-16 h-11 object-cover rounded shadow border border-white/10';
  infoSide.appendChild(flag);

  const textBlock = document.createElement('div');
  const teamTitle = document.createElement('h2');
  teamTitle.className = 'text-2xl font-black uppercase tracking-wide';
  teamTitle.textContent = teamName;
  const countSub = document.createElement('p');
  countSub.className = 'text-xs text-gray-400';
  
  const stats = getTeamProgress(code);
  countSub.id = 'teamProgressLabel';
  countSub.textContent = `${stats.owned} de 20 cromos adquiridos`;
  textBlock.appendChild(teamTitle);
  textBlock.appendChild(countSub);
  infoSide.appendChild(textBlock);
  headerPanel.appendChild(infoSide);

  const backBtn = document.createElement('button');
  backBtn.className = 'px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-1.5';
  backBtn.innerHTML = `
    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    Voltar
  `;
  backBtn.onclick = () => location.hash = '#home';
  headerPanel.appendChild(backBtn);
  container.appendChild(headerPanel);

  // Legenda de tipos de figurinhas
  const legend = document.createElement('div');
  legend.className = 'text-[11px] text-gray-500 flex flex-wrap gap-4 items-center pl-2';
  legend.innerHTML = `
    <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded bg-copaYellow shadow-sm"></span> Nº 1 Escudo / Nº 2 Equipe (Shiny Gold)</span>
    <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded bg-copaGreen shadow-sm"></span> Nº 3 a 20 Elenco (Normais)</span>
    <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded bg-white/15"></span> Clique para colar/remover a figurinha do álbum</span>
  `;
  container.appendChild(legend);

  // Grade responsiva de figurinhas (20 cromos)
  const grid = document.createElement('div');
  grid.className = 'grid-fifa';

  for (let i = 1; i <= 20; i++) {
    const key = `${code}-${i}`;
    const isSpecial = (i === 1 || i === 2); // Escudo e Time

    // Cria o sticker-card tridimensional
    const card = document.createElement('div');
    card.className = `sticker-card ${isSpecial ? 'special' : ''}`;
    card.id = `card-${key}`;

    const inner = document.createElement('div');
    inner.className = 'card-inner';

    // 1. Verso (Não Possuído)
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    
    const bgNum = document.createElement('div');
    bgNum.className = 'fifa-logo-placeholder';
    bgNum.textContent = '26';
    cardBack.appendChild(bgNum);

    const backNum = document.createElement('div');
    backNum.className = 'card-back-number';
    backNum.textContent = isSpecial ? (i === 1 ? 'ESCUDO' : 'TIME') : `${code} ${i}`;
    cardBack.appendChild(backNum);
    inner.appendChild(cardBack);

    // 2. Frente (Possuído)
    const cardFront = document.createElement('div');
    cardFront.className = `card-front ${isSpecial ? 'special shiny-effect' : ''}`;
    
    // Frente superior
    const frontHeader = document.createElement('div');
    frontHeader.className = 'flex justify-between items-center w-full';
    
    const miniFlag = document.createElement('img');
    miniFlag.src = `https://flagcdn.com/w80/${code.toLowerCase()}.png`;
    miniFlag.className = 'w-6 h-4 object-cover rounded border border-white/10';
    frontHeader.appendChild(miniFlag);

    const teamTag = document.createElement('span');
    teamTag.className = `text-[9px] font-black uppercase tracking-wider ${isSpecial ? 'text-copaYellow' : 'text-copaGreen'}`;
    teamTag.textContent = code;
    frontHeader.appendChild(teamTag);
    cardFront.appendChild(frontHeader);

    // Frente centro (Número do cromo)
    const frontNum = document.createElement('div');
    frontNum.className = 'text-center font-black text-2xl py-1 my-auto tracking-tighter text-white';
    frontNum.textContent = isSpecial ? (i === 1 ? '★ ESC' : '★ TIM') : i;
    cardFront.appendChild(frontNum);

    // Frente inferior (Ações)
    const frontActions = document.createElement('div');
    frontActions.className = 'card-actions';

    // Os botões serão injetados dinamicamente via updateCard
    cardFront.appendChild(frontActions);
    inner.appendChild(cardFront);
    card.appendChild(inner);

    // Clique no card
    card.onclick = (e) => {
      // Se clicou em botões de ação na frente, evita clique duplo
      if (e.target.closest('.action-btn')) return;
      
      const album = storage.getAlbums()[storage.getCurrentAlbumId()];
      const sticker = album.stickers[key];
      const isOwned = sticker && sticker.owned;
      
      if (!isOwned) {
        // Se não possui, clica para obter
        toggleOwned(key);
        updateCard(card, key);
        updateTeamProgressLabel(code);
      }
    };

    // Inicia e atualiza o estado visual do card
    updateCard(card, key);
    grid.appendChild(card);
  }

  container.appendChild(grid);
  root.appendChild(container);
}

// Atualiza o contador de progresso da seleção em tempo real
function updateTeamProgressLabel(code) {
  const label = document.getElementById('teamProgressLabel');
  if (label) {
    const stats = getTeamProgress(code);
    label.textContent = `${stats.owned} de 20 cromos adquiridos`;
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
  // Se tirou a posse, reseta as duplicadas
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

  // 2. Atualiza a Badge de duplicata no canto superior do card (FUT style)
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

  // 3. Atualiza os botões de ação na base do card de frente
  const actionsContainer = card.querySelector('.card-actions');
  if (actionsContainer) {
    actionsContainer.innerHTML = '';

    // Botão esquerdo: Diminuir repetida (-) ou Remover cromo (×)
    const btnLeft = document.createElement('button');
    btnLeft.className = `action-btn ${duplicates > 0 ? 'btn-minus' : 'btn-remove'}`;
    btnLeft.innerHTML = duplicates > 0 ? '–' : '×';
    btnLeft.title = duplicates > 0 ? 'Remover 1 Repetida' : 'Remover do Álbum';
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

    // Botão direito: Adicionar repetida (+)
    const btnRight = document.createElement('button');
    btnRight.className = 'action-btn btn-add';
    btnRight.innerHTML = '+';
    btnRight.title = 'Adicionar Repetida';
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
function renderTrades() {
  const root = document.getElementById('appRoot');
  
  const container = document.createElement('div');
  container.className = 'max-w-2xl mx-auto my-6 glass-panel p-6 rounded-2xl border-white/5 space-y-6';

  const title = document.createElement('h2');
  title.className = 'text-xl font-black uppercase tracking-wider text-copaYellow';
  title.textContent = 'Minhas Figurinhas Repetidas';
  container.appendChild(title);

  // Lista todas as repetidas
  const albumId = storage.getCurrentAlbumId();
  const albums = storage.getAlbums();
  const album = albums[albumId];
  
  const listDiv = document.createElement('div');
  listDiv.className = 'space-y-4';

  if (!album) {
    listDiv.innerHTML = '<p class="text-xs text-gray-500">Nenhum álbum ativo.</p>';
    container.appendChild(listDiv);
    root.appendChild(container);
    return;
  }

  // Filtragem de duplicatas
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
      <div class="text-center py-8 space-y-2">
        <div class="text-3xl">📭</div>
        <p class="text-sm font-bold text-gray-300">Nenhuma repetida encontrada.</p>
        <p class="text-xs text-gray-500">Marque cromos extras na tela de seleções para que apareçam aqui.</p>
      </div>
    `;
  } else {
    // Grade de repetidas resumidas
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-2 sm:grid-cols-3 gap-3';
    
    duplicates.forEach(item => {
      const itemCard = document.createElement('div');
      itemCard.className = 'bg-white/5 border border-white/5 p-3 rounded-xl flex items-center justify-between gap-3';
      
      const info = document.createElement('div');
      const teamLabel = document.createElement('div');
      teamLabel.className = 'text-[9px] font-black uppercase tracking-wider text-copaYellow';
      teamLabel.textContent = item.team;
      const numLabel = document.createElement('div');
      numLabel.className = 'text-sm font-black text-white';
      numLabel.textContent = `Nº ${item.number}`;
      
      info.appendChild(teamLabel);
      info.appendChild(numLabel);
      itemCard.appendChild(info);

      const qty = document.createElement('div');
      qty.className = 'bg-white/10 text-white font-black text-xs px-2 py-1 rounded-lg';
      qty.textContent = `${item.count}x`;
      itemCard.appendChild(qty);

      grid.appendChild(itemCard);
    });
    listDiv.appendChild(grid);
  }

  container.appendChild(listDiv);

  const back = document.createElement('button');
  back.className = 'w-full px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase text-gray-300 tracking-wider rounded-xl transition';
  back.textContent = 'Voltar para Home';
  back.onclick = () => location.hash = '#home';
  container.appendChild(back);

  root.appendChild(container);
}

// ------------------- INICIALIZAÇÃO EVENTOS -------------------
window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', initApp);
