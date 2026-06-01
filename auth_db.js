// auth_db.js - Gerenciamento de Autenticação e Sincronização em Nuvem (Supabase / Simulado)

(function () {
  // Configuração opcional do Supabase (Carregada de window.SUPABASE_URL ou configurada pelo usuário)
  const SUPABASE_URL = window.SUPABASE_URL || "";
  const SUPABASE_KEY = window.SUPABASE_KEY || "";
  
  let supabaseClient = null;
  const isDemoMode = false;

  // Estado local do usuário autenticado
  let currentUser = null;
  const sessionKey = "album_auth_session";

  // Carrega sessão salva no LocalStorage como fallback imediato
  const savedSession = localStorage.getItem(sessionKey);
  if (savedSession) {
    try {
      currentUser = JSON.parse(savedSession);
    } catch (e) {
      localStorage.removeItem(sessionKey);
    }
  }

  // Inicialização e escuta da autenticação do Supabase
  if (!isDemoMode && typeof supabase !== 'undefined') {
    try {
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      console.log("Supabase inicializado com sucesso em modo nuvem.");

      // Escuta mudanças de estado da autenticação (Login, Logout, etc.)
      supabaseClient.auth.onAuthStateChange(async (event, session) => {
        console.log("Supabase Auth Event:", event, session);
        
        if (session && session.user) {
          const user = session.user;
          
          let stickers = {};
          let latitude = currentUser ? currentUser.latitude : null;
          let longitude = currentUser ? currentUser.longitude : null;
          let birthdate = currentUser ? currentUser.birthdate : "";

          // Sincroniza dados do perfil na nuvem
          try {
            const { data: profile, error } = await supabaseClient
              .from('profiles')
              .select('*')
              .eq('uid', user.id)
              .maybeSingle();

            if (profile) {
              stickers = profile.stickers || {};
              if (profile.latitude !== null && profile.latitude !== undefined) latitude = profile.latitude;
              if (profile.longitude !== null && profile.longitude !== undefined) longitude = profile.longitude;
              
              // Sincroniza o álbum local se o perfil na nuvem tiver figurinhas
              if (profile.stickers && Object.keys(profile.stickers).length > 0) {
                const activeAlbumId = localStorage.getItem('currentAlbumId');
                const albums = JSON.parse(localStorage.getItem('albums') || '{}');
                if (activeAlbumId && albums[activeAlbumId]) {
                  albums[activeAlbumId].stickers = { ...albums[activeAlbumId].stickers, ...profile.stickers };
                  localStorage.setItem('albums', JSON.stringify(albums));
                }
              }
            } else {
              // Se o perfil do usuário não existe na tabela profiles, cria um novo
              await supabaseClient.from('profiles').insert({
                uid: user.id,
                name: user.user_metadata.full_name || user.user_metadata.name || "Colecionador",
                photo_url: user.user_metadata.avatar_url || "",
                latitude: latitude,
                longitude: longitude,
                last_seen: new Date().toISOString()
              });
            }
          } catch (profileError) {
            console.error("Erro ao sincronizar perfil do Supabase:", profileError);
          }

          currentUser = {
            uid: user.id,
            name: user.user_metadata.full_name || user.user_metadata.name || "Colecionador",
            photo_url: user.user_metadata.avatar_url || "",
            provider: user.app_metadata.provider || "oauth",
            birthdate: birthdate,
            latitude: latitude,
            longitude: longitude,
            last_seen: new Date().toISOString()
          };

          localStorage.setItem(sessionKey, JSON.stringify(currentUser));
          
          // Recarrega cabeçalho e redireciona se o usuário estiver na tela de login
          if (typeof renderHeader === 'function') renderHeader();
          if (window.location.hash === '#login') {
            window.location.hash = '#home';
          }
        } else {
          // Se não houver sessão ativa no Supabase, limpa os dados locais de login de nuvem
          if (!isDemoMode) {
            currentUser = null;
            localStorage.removeItem(sessionKey);
            if (typeof renderHeader === 'function') renderHeader();
          }
        }
      });
    } catch (e) {
      console.error("Falha ao inicializar o cliente do Supabase:", e);
    }
  } else {
    console.log("Supabase não configurado. Rodando em Modo de Simulação (Demo).");
  }

  // Banco de Dados Simulado da Comunidade removido (Modo Demo desativado)

  // Cálculo da distância entre coordenadas geográficas (Haversine)
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

  // Objeto Global exposto no escopo de window
  window.authDb = {
    isDemoMode() {
      return isDemoMode;
    },

    getCurrentUser() {
      return currentUser;
    },

    // Busca coordenadas geográficas aproximadas através de APIs de IP gratuitas
    async fetchLocationByIp() {
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

    // Realiza login via Supabase (Google OAuth)
    async login(provider, username = "", birthdate = "") {
      try {
        // Salva dados de idade localmente para recuperar pós-redirect
        if (birthdate) {
          localStorage.setItem("temp_birthdate", birthdate);
        }
        
        if (!supabaseClient) {
          throw new Error("Cliente Supabase não inicializado. Verifique se o SUPABASE_URL e o SUPABASE_KEY estão configurados no arquivo supabase_config.js.");
        }
        
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: 'https://csartorisilva.github.io/Album_Copa-do-Mundo-FIFA-2026_FRee_SS/',
            queryParams: {
              access_type: 'offline',
              prompt: 'consent'
            }
          }
        });
        if (error) throw error;
        return data;
      } catch (e) {
        console.error("Erro no login Supabase:", e);
        throw e;
      }
    },

    // Logout da conta
    async logout() {
      currentUser = null;
      localStorage.removeItem(sessionKey);
      localStorage.removeItem("temp_birthdate");
      if (!isDemoMode && supabaseClient) {
        await supabaseClient.auth.signOut();
      }
      localStorage.removeItem("community_favorites");
    },

    // Atualiza geolocalização do usuário (local e na nuvem)
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

    // Sincroniza dados do perfil (Nome e Foto)
    async updateProfileInDb(user) {
      if (!isDemoMode && supabaseClient) {
        try {
          const { error } = await supabaseClient
            .from('profiles')
            .upsert({
              uid: user.uid,
              name: user.name,
              photo_url: user.photo_url,
              latitude: user.latitude,
              longitude: user.longitude,
              last_seen: user.last_seen
            });
          if (error) throw error;
        } catch (e) {
          console.error("Erro ao atualizar perfil na tabela profiles:", e);
        }
      }
    },

    // Retorna colecionadores próximos na comunidade com raio ajustável
    async getNearbyCollectors(lat, lng, radiusKm = 99999) {
      if (!currentUser) return [];
      if (!supabaseClient) {
        console.warn("Supabase client not initialized.");
        return [];
      }

      try {
        const { data, error } = await supabaseClient
          .from('profiles')
          .select('*')
          .neq('uid', currentUser.uid);
        
        if (error) throw error;

        const results = data
          .filter(item => item.latitude !== null && item.longitude !== null)
          .map(item => {
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
    },

    // Carrega perfil de outro colecionador individual
    async getCollectorProfile(uid, lat = null, lng = null) {
      if (!supabaseClient) {
        console.warn("Supabase client not initialized.");
        return null;
      }
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

  // Recupera idade salva após retorno do redirect de login
  const tempBirthdate = localStorage.getItem("temp_birthdate");
  if (tempBirthdate && currentUser) {
    currentUser.birthdate = tempBirthdate;
    localStorage.setItem(sessionKey, JSON.stringify(currentUser));
    localStorage.removeItem("temp_birthdate");
  }
})();
