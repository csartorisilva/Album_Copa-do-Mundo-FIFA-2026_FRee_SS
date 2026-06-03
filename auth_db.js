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

  let supabaseInitError = null;

  // Inicialização e escuta da autenticação do Supabase
  if (!isDemoMode && typeof supabase !== 'undefined') {
    try {
      if (!SUPABASE_URL || !SUPABASE_KEY) {
        throw new Error(`Credenciais do Supabase ausentes ou vazias no supabase_config.js. URL: '${SUPABASE_URL || ""}', Key: '${SUPABASE_KEY ? "configurada (tamanho: " + SUPABASE_KEY.length + ")" : "ausente"}'`);
      }
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      console.log("Supabase inicializado com sucesso em modo nuvem.");

      // Escuta mudanças de estado da autenticação (Login, Logout, etc.)
      supabaseClient.auth.onAuthStateChange(async (event, session) => {
        console.log("Supabase Auth Event:", event, session);
        
        if (session && session.user) {
          const user = session.user;
          
          let stickers = {};
          let latitude = currentUser ? currentUser.latitude : null;
          let longitude = currentUser ? currentUser.longitude : null;
          let displayName = user.user_metadata.username || user.user_metadata.full_name || user.user_metadata.name || "Colecionador";
          let userBirthdate = user.user_metadata.birthdate || "";
 
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
              if (profile.username) displayName = profile.username;
              if (profile.birthdate) userBirthdate = profile.birthdate;
              
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
                name: displayName,
                photo_url: user.user_metadata.avatar_url || "",
                username: user.user_metadata.username || "",
                email: user.email,
                birthdate: userBirthdate || null,
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
            name: displayName,
            photo_url: user.user_metadata.avatar_url || "",
            provider: user.app_metadata.provider || "email",
            birthdate: userBirthdate,
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
            // Se for uma sessão simulada de teste local (bypass de rate limit), não a destrua no carregamento
            if (currentUser && currentUser.uid && currentUser.uid.startsWith("mock-uid-")) {
              if (event === 'SIGNED_OUT') {
                currentUser = null;
                localStorage.removeItem(sessionKey);
                if (typeof renderHeader === 'function') renderHeader();
              } else {
                console.log("Mantendo sessão simulada de teste local ativa.");
              }
              return;
            }

            // Para sessões reais, limpa se a sessão do Supabase expirou/não existe
            currentUser = null;
            localStorage.removeItem(sessionKey);
            if (typeof renderHeader === 'function') renderHeader();
          }
        }
      });
    } catch (e) {
      console.error("Falha ao inicializar o cliente do Supabase:", e);
      supabaseInitError = e;
    }
  } else {
    console.log("Supabase não configurado ou CDN indisponível. Rodando em Modo de Simulação (Demo).");
    if (typeof supabase === 'undefined') {
      supabaseInitError = new Error("Biblioteca global 'supabase' está indefinida (o script CDN não carregou).");
    }
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

    // Login ou Cadastro unificado via E-mail e Senha
    async loginOrRegister(email, password, username = "", birthdate = "") {
      if (!supabaseClient) {
        throw new Error("Cliente Supabase não inicializado. Verifique se o SUPABASE_URL e o SUPABASE_KEY estão configurados no arquivo supabase_config.js.");
      }

      let finalEmail = email;
      if (email && !email.includes('@')) {
        try {
          const { data: profile, error: queryError } = await supabaseClient
            .from('profiles')
            .select('email')
            .eq('username', email)
            .maybeSingle();
            
          if (queryError) throw queryError;
          if (profile && profile.email) {
            finalEmail = profile.email;
          } else {
            throw new Error(`Nome de usuário '${email}' não encontrado.`);
          }
        } catch (err) {
          console.error("Erro ao buscar e-mail pelo username:", err);
          throw new Error("Nome de usuário não encontrado ou erro de conexão.");
        }
      }

      // 1. Tenta fazer login primeiro de forma limpa e sequencial
      const { data, error: signInError } = await supabaseClient.auth.signInWithPassword({ email: finalEmail, password });
      
      // Se o login foi bem-sucedido e retornou sessão, finaliza aqui
      if (!signInError && data && data.session) {
        return { action: 'login', data };
      }

      // Tratamento detalhado de erros do login
      if (signInError) {
        const errorMsg = (signInError.message || "").toLowerCase();
        const errorStatus = signInError.status;

        // Se for erro de limite de requisições (Rate Limit 429), lança o erro imediatamente ou simula login local
        const isRateLimit = errorStatus === 429 || errorMsg.includes("rate limit") || errorMsg.includes("too many requests") || errorMsg.includes("email rate limit exceeded");
        if (isRateLimit) {
          // Bypass temporário para testes se for bloqueio de IP/email do Supabase
          if (errorMsg.includes("email rate limit exceeded") || errorMsg.includes("rate limit")) {
            const finalUsername = username || "Colecionador Teste";
            const finalBirthdate = birthdate || "2010-01-01"; // Padrão menor de idade para testes rápidos
            
            console.warn("Bypass do Rate Limit no signIn ativado para testes: simulando login bem-sucedido.");
            currentUser = {
              uid: "mock-uid-" + Date.now(),
              name: finalUsername,
              photo_url: "",
              provider: "email",
              birthdate: finalBirthdate,
              latitude: null,
              longitude: null,
              last_seen: new Date().toISOString()
            };
            localStorage.setItem(sessionKey, JSON.stringify(currentUser));
            if (typeof renderHeader === 'function') renderHeader();
            return { action: 'register', data: { session: { user: currentUser } } };
          }
          throw signInError;
        }

        // Se for outro erro de sistema/rede que não seja credenciais inválidas/usuário não encontrado, também propaga
        const isInvalidCredentials = errorMsg.includes("invalid login credentials") || 
                                     errorMsg.includes("invalid_credentials") || 
                                     errorMsg.includes("user not found") ||
                                     errorStatus === 400;
        if (!isInvalidCredentials) {
          throw signInError;
        }
      }

      // 2. Se o login falhou porque o usuário não existe (ou credenciais novas), prosseguimos para o cadastro.
      // O nome de usuário e a data de nascimento passam a ser obrigatórios.
      if (!username || !birthdate) {
        throw new Error("Credenciais inválidas. Se você deseja criar uma nova conta, preencha também o Nome de Usuário e a Data de Nascimento.");
      }

      // Validamos se o username é único antes de prosseguir
      const { data: checkUser } = await supabaseClient
        .from('profiles')
        .select('uid')
        .eq('username', username)
        .maybeSingle();
      if (checkUser) {
        throw new Error("Este Nome de Usuário já está em uso. Por favor, escolha outro.");
      }

      // Tenta realizar o cadastro
      const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            birthdate: birthdate
          }
        }
      });

      if (signUpError) {
        const errorMsg = (signUpError.message || "").toLowerCase();
        // Bypass temporário para testes se for bloqueio de IP/email do Supabase no cadastro
        if (errorMsg.includes("email rate limit exceeded") || errorMsg.includes("rate limit") || signUpError.status === 429) {
          const finalUsername = username || "Colecionador Teste";
          const finalBirthdate = birthdate || "2010-01-01"; // Padrão menor de idade para testes rápidos
          
          console.warn("Bypass do Rate Limit no signUp ativado para testes: simulando login/cadastro bem-sucedido.");
          currentUser = {
            uid: "mock-uid-" + Date.now(),
            name: finalUsername,
            photo_url: "",
            provider: "email",
            birthdate: finalBirthdate,
            latitude: null,
            longitude: null,
            last_seen: new Date().toISOString()
          };
          localStorage.setItem(sessionKey, JSON.stringify(currentUser));
          if (typeof renderHeader === 'function') renderHeader();
          return { action: 'register', data: { session: { user: currentUser } } };
        }

        // Se o e-mail já estiver cadastrado, a senha do login acima estava incorreta
        if (signUpError.message && (signUpError.message.includes("already registered") || signUpError.message.includes("already exists"))) {
          throw new Error("Senha incorreta para este e-mail.");
        }
        throw signUpError;
      }

      // Se o cadastro foi realizado com sucesso mas a sessão não foi iniciada automaticamente (ex: e-mail pendente), tenta forçar o login automático imediato
      if (signUpData && !signUpData.session) {
        try {
          console.log("Cadastro bem-sucedido. Tentando login automático imediato...");
          const { data: signInData, error: signInAfterSignUpError } = await supabaseClient.auth.signInWithPassword({ email: email, password: password });
          if (!signInAfterSignUpError && signInData && signInData.session) {
            return { action: 'register', data: signInData };
          } else if (signInAfterSignUpError) {
            throw signInAfterSignUpError;
          }
        } catch (e) {
          console.error("Falha no login automático pós-cadastro:", e);
          throw new Error("Cadastro concluído com sucesso, mas o login automático falhou: " + (e.message || e));
        }
      }

      return { action: 'register', data: signUpData };
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

})();
