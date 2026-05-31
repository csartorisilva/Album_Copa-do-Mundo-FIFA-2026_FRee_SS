// auth_db.js - Gerenciamento de Autenticação e Sincronização em Nuvem (Supabase / Simulado)

(function () {
  // Configuração opcional do Supabase (Pode ser injetada pelo usuário)
  const SUPABASE_URL = window.SUPABASE_URL || "";
  const SUPABASE_KEY = window.SUPABASE_KEY || "";
  
  let supabaseClient = null;
  const isDemoMode = !SUPABASE_URL || !SUPABASE_KEY;

  if (!isDemoMode && typeof supabase !== 'undefined') {
    try {
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      console.log("Supabase inicializado com sucesso em modo nuvem.");
    } catch (e) {
      console.error("Falha ao inicializar o cliente do Supabase:", e);
    }
  } else {
    console.log("Supabase não configurado. Rodando em Modo de Simulação (Demo).");
  }

  // Estado local do usuário autenticado
  let currentUser = null;
  
  // Carrega sessão salva no LocalStorage
  const sessionKey = "album_auth_session";
  const savedSession = localStorage.getItem(sessionKey);
  if (savedSession) {
    try {
      currentUser = JSON.parse(savedSession);
    } catch (e) {
      localStorage.removeItem(sessionKey);
    }
  }

  // Banco de Dados Simulado da Comunidade
  const MOCK_COLLECTORS = [
    {
      uid: "mock-carlos",
      name: "Carlos Silva",
      photo_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80",
      offsetLat: 0.008,  // ~1.2 km de distância
      offsetLng: -0.005,
      birthdate: "1990-05-15",
      // Carlos terá um match perfeito: tem o que você quer e quer o que você tem repetido
      generateStickers: (userStickers) => {
        const stickers = {};
        // Carlos possui quase todas, mas faltam algumas que o usuário tem repetidas
        for (let team of ['USA', 'MEX', 'CAN', 'BRA', 'ARG', 'URU', 'FRA', 'ENG', 'POR', 'EXTRAS']) {
          for (let i = 1; i <= 20; i++) {
            const key = `${team}-${i}`;
            stickers[key] = { owned: true, duplicate: 0 };
          }
        }
        // Faltam para o Carlos as repetidas do usuário
        Object.entries(userStickers).forEach(([key, val]) => {
          if (val.duplicate > 0) {
            stickers[key] = { owned: false, duplicate: 0 };
          }
        });
        // Carlos tem repetidas das figurinhas que faltam para o usuário
        Object.entries(userStickers).forEach(([key, val]) => {
          if (!val.owned) {
            stickers[key] = { owned: true, duplicate: 1 };
          }
        });
        return stickers;
      }
    },
    {
      uid: "mock-mariana",
      name: "Mariana Costa",
      photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80",
      offsetLat: -0.025, // ~3.5 km
      offsetLng: 0.015,
      birthdate: "1995-10-20",
      // Mariana tem figurinhas que te faltam, mas não quer nada das suas repetidas
      generateStickers: (userStickers) => {
        const stickers = {};
        Object.entries(userStickers).forEach(([key, val]) => {
          if (!val.owned) {
            stickers[key] = { owned: true, duplicate: 1 }; // Mariana tem de sobra
          } else {
            stickers[key] = { owned: true, duplicate: 0 }; // Ela já tem todas que o usuário tem
          }
        });
        return stickers;
      }
    },
    {
      uid: "mock-felipe",
      name: "Felipe Almeida",
      photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80",
      offsetLat: 0.085,  // ~12 km
      offsetLng: -0.045,
      birthdate: "2012-08-12", // menor de idade
      // Felipe quer suas repetidas, mas não tem nada para te dar de volta
      generateStickers: (userStickers) => {
        const stickers = {};
        Object.entries(userStickers).forEach(([key, val]) => {
          if (val.duplicate > 0) {
            stickers[key] = { owned: false, duplicate: 0 }; // Felipe não tem e quer
          } else {
            stickers[key] = { owned: false, duplicate: 0 }; // Ele não tem nada
          }
        });
        return stickers;
      }
    },
    {
      uid: "mock-julia",
      name: "Júlia Mendes",
      photo_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80",
      offsetLat: -0.185, // ~28 km
      offsetLng: 0.125,
      birthdate: "2013-03-04", // menor de idade
      // Júlia tem um perfil médio/baixo
      generateStickers: (userStickers) => {
        const stickers = {};
        // Só tem algumas
        for (let team of ['BRA', 'ARG']) {
          for (let i = 1; i <= 10; i++) {
            stickers[`${team}-${i}`] = { owned: true, duplicate: i === 1 ? 1 : 0 };
          }
        }
        return stickers;
      }
    }
  ];

  // Cálculo da distância entre coordenadas usando a fórmula de Haversine
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return parseFloat((R * c).toFixed(1));
  }

  // Objeto Global exposto
  window.authDb = {
    isDemoMode() {
      return isDemoMode;
    },

    getCurrentUser() {
      return currentUser;
    },

    // Busca coordenadas geográficas aproximadas através de APIs de IP gratuitas
    async fetchLocationByIp() {
      // 1. Tenta ipapi.co
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
            return { lat: data.latitude, lng: data.longitude };
          }
        }
      } catch (e) {
        console.warn("Erro ao buscar coordenadas por IP via ipapi.co:", e);
      }
      // 2. Fallback ipinfo.io
      try {
        const res = await fetch("https://ipinfo.io/json");
        if (res.ok) {
          const data = await res.json();
          if (data && data.loc) {
            const parts = data.loc.split(',');
            const lat = parseFloat(parts[0]);
            const lng = parseFloat(parts[1]);
            if (!isNaN(lat) && !isNaN(lng)) {
              return { lat, lng };
            }
          }
        }
      } catch (e) {
        console.warn("Erro ao buscar coordenadas por IP via ipinfo.io:", e);
      }
      return null;
    },

    // Login Simulado ou Real
    async login(provider, username = "", birthdate = "") {
      if (isDemoMode) {
        // Simulação de login
        const randomId = Math.random().toString(36).substring(2, 10);
        let name = "Usuário Teste";
        let photo = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80";
        
        if (provider === "google") {
          name = username || "Geraldo Google";
          photo = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80&q=80";
        } else if (provider === "apple") {
          name = username || "Adriano Apple";
          photo = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80";
        } else if (provider === "android") {
          name = username || "André Android";
          photo = "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&h=80&q=80";
        }

        currentUser = {
          uid: `demo-${randomId}`,
          name: name,
          photo_url: photo,
          provider: provider,
          birthdate: birthdate,
          latitude: null,
          longitude: null,
          last_seen: new Date().toISOString()
        };

        // Tenta buscar geolocalização automática por IP no momento do login simulado
        try {
          const loc = await this.fetchLocationByIp();
          if (loc) {
            currentUser.latitude = loc.lat;
            currentUser.longitude = loc.lng;
          }
        } catch (e) {
          console.warn("Erro ao associar geolocalização de IP durante o login:", e);
        }

        localStorage.setItem(sessionKey, JSON.stringify(currentUser));
        return currentUser;
      } else {
        // Fluxo Real Supabase (Apenas o esqueleto de chamada OAuth)
        try {
          const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: provider,
            options: {
              redirectTo: window.location.origin
            }
          });
          if (error) throw error;
          return data;
        } catch (e) {
          console.error("Erro no login Supabase:", e);
          throw e;
        }
      }
    },

    // Logout
    async logout() {
      currentUser = null;
      localStorage.removeItem(sessionKey);
      if (!isDemoMode && supabaseClient) {
        await supabaseClient.auth.signOut();
      }
      // Limpa dados de sincronização
      localStorage.removeItem("community_favorites");
    },

    // Atualiza geolocalização do usuário
    async updateLocation(lat, lng) {
      if (!currentUser) return;
      currentUser.latitude = lat;
      currentUser.longitude = lng;
      currentUser.last_seen = new Date().toISOString();
      localStorage.setItem(sessionKey, JSON.stringify(currentUser));

      if (!isDemoMode && supabaseClient) {
        try {
          const { error } = await supabaseClient
            .from('profiles')
            .upsert({
              uid: currentUser.uid,
              name: currentUser.name,
              photo_url: currentUser.photo_url,
              latitude: lat,
              longitude: lng,
              last_seen: currentUser.last_seen
            });
          if (error) throw error;
        } catch (e) {
          console.error("Erro ao sincronizar localização no Supabase:", e);
        }
      }
    },

    // Sincroniza as figurinhas coladas/repetidas na nuvem
    async syncStickers(stickers) {
      if (!currentUser) return;
      if (!isDemoMode && supabaseClient) {
        try {
          const { error } = await supabaseClient
            .from('profiles')
            .update({ stickers: stickers })
            .eq('uid', currentUser.uid);
          if (error) throw error;
        } catch (e) {
          console.error("Erro ao sincronizar figurinhas no Supabase:", e);
        }
      }
    },

    // Retorna colecionadores próximos com raio ajustável
    async getNearbyCollectors(lat, lng, radiusKm = 99999) {
      if (!currentUser) return [];

      if (isDemoMode) {
        // No modo demo, geramos os perfis com base nas coordenadas de GPS fornecidas
        // e cruzamos com o estado do álbum ativo do próprio usuário para criar cenários de troca ideais
        const localAlbums = JSON.parse(localStorage.getItem('albums') || '{}');
        const activeAlbumId = localStorage.getItem('currentAlbumId');
        const activeAlbum = localAlbums[activeAlbumId] || { stickers: {} };
        const userStickers = activeAlbum.stickers || {};

        const results = MOCK_COLLECTORS.map(c => {
          const collectorLat = lat + c.offsetLat;
          const collectorLng = lng + c.offsetLng;
          const dist = getDistance(lat, lng, collectorLat, collectorLng);
          
          return {
            uid: c.uid,
            name: c.name,
            photo_url: c.photo_url,
            latitude: collectorLat,
            longitude: collectorLng,
            distance: dist,
            birthdate: c.birthdate,
            stickers: c.generateStickers(userStickers),
            last_seen: new Date(Date.now() - (dist * 120000)).toISOString() // tempo simulado
          };
        });

        // Filtra pelo raio
        return results.filter(c => c.distance <= radiusKm).sort((a, b) => a.distance - b.distance);
      } else {
        // Supabase query real de distância geográfica usando PostGIS ou cálculo Haversine puro em SQL
        try {
          // Exemplo de RPC ou query de perfis ativos
          const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .neq('uid', currentUser.uid);
          
          if (error) throw error;

          const results = data.map(item => {
            const dist = getDistance(lat, lng, item.latitude, item.longitude);
            return {
              ...item,
              distance: dist
            };
          });

          return results.filter(c => c.distance <= radiusKm).sort((a, b) => a.distance - b.distance);
        } catch (e) {
          console.error("Erro ao buscar colecionadores no Supabase:", e);
          return [];
        }
      }
    },

    // Carrega perfil individual do colecionador
    async getCollectorProfile(uid, lat = null, lng = null) {
      if (isDemoMode) {
        // No modo demo, procuramos o colecionador na lista gerada
        const userLat = lat || (currentUser ? currentUser.latitude : 0) || 0;
        const userLng = lng || (currentUser ? currentUser.longitude : 0) || 0;
        const list = await this.getNearbyCollectors(userLat, userLng);
        return list.find(c => c.uid === uid) || null;
      } else {
        try {
          const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('uid', uid)
            .single();
          
          if (error) throw error;
          
          let dist = null;
          if (lat && lng && data.latitude && data.longitude) {
            dist = getDistance(lat, lng, data.latitude, data.longitude);
          }
          return {
            ...data,
            distance: dist
          };
        } catch (e) {
          console.error("Erro ao buscar perfil no Supabase:", e);
          return null;
        }
      }
    },

    // Favoritos Locais (Minha Comunidade)
    getFavorites() {
      try {
        return JSON.parse(localStorage.getItem("community_favorites") || "[]");
      } catch (e) {
        return [];
      }
    },

    toggleFavorite(uid) {
      let favs = this.getFavorites();
      if (favs.includes(uid)) {
        favs = favs.filter(id => id !== uid);
      } else {
        favs.push(uid);
      }
      localStorage.setItem("community_favorites", JSON.stringify(favs));
      return favs.includes(uid);
    },

    isFavorite(uid) {
      return this.getFavorites().includes(uid);
    }
  };
})();
