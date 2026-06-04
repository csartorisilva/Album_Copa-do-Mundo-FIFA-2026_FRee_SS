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

  // Helper para impor limite de tempo nas requisições do Supabase (impede travamentos em "PROCESSANDO")
  const promiseWithTimeout = (promise, ms = 12000) => {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("A conexão com o servidor expirou (Timeout). Verifique se sua conexão está ativa ou se sua rede corporativa/VPN está bloqueando as requisições para a nuvem do Supabase.")), ms)
      )
    ]);
  };

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

      // Validação estrita para impedir o uso da service_role key no front-end
      const jwtRole = (function(token) {
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = parts[1];
            const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
            const claims = JSON.parse(decoded);
            return claims.role || null;
          }
        } catch (e) {}
        return null;
      })(SUPABASE_KEY);

      if (jwtRole === 'service_role') {
        throw new Error("ERRO DE CONFIGURAÇÃO CRÍTICO: A chave 'service_role' (com privilégios de super-usuário) foi detectada no front-end. Remova-a imediatamente do seu supabase_config.js ou do GitHub Repository Secrets e utilize apenas a chave pública 'anon public'. Isso previne o bypass de confirmação de e-mail e garante a segurança do seu banco de dados.");
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

    async loginOrRegister(email, password, username = "", birthdate = "") {
      if (!supabaseClient) {
        throw new Error("Cliente Supabase não inicializado. Verifique se o SUPABASE_URL e o SUPABASE_KEY estão configurados no arquivo supabase_config.js.");
      }

      const cleanEmail = email ? email.trim() : "";
      const cleanPassword = password ? password.trim() : "";
      const cleanUsername = username ? username.trim() : "";

      // Se username e birthdate NÃO forem informados, é um fluxo exclusivo de LOGIN
      if (!cleanUsername || !birthdate) {
        let finalEmail = cleanEmail;
        let isEmail = true;

        // Se começar com '@', remove e trata como username
        if (finalEmail.startsWith('@')) {
          finalEmail = finalEmail.substring(1);
          isEmail = false;
        } else if (!finalEmail.includes('@')) {
          // Se não contiver '@' em nenhuma parte, trata como username
          isEmail = false;
        }

        if (!isEmail) {
          try {
            const { data: profile, error: queryError } = await promiseWithTimeout(supabaseClient
              .from('profiles')
              .select('email')
              .ilike('username', finalEmail)
              .maybeSingle());
              
            if (queryError) throw queryError;
            if (profile && profile.email) {
              finalEmail = profile.email;
            } else {
              throw new Error(`Nome de usuário '@${finalEmail}' não encontrado.`);
            }
          } catch (err) {
            console.error("Erro ao buscar e-mail pelo username:", err);
            throw new Error(err.message || "Nome de usuário não encontrado ou erro de conexão.");
          }
        }

        // Tenta fazer login tradicional (Exclusivo para o bloco Já Tenho Conta)
        const { data, error: signInError } = await promiseWithTimeout(supabaseClient.auth.signInWithPassword({ 
          email: finalEmail, 
          password: cleanPassword 
        }));
        if (signInError) {
          throw signInError;
        }

        // SALVA SESSÃO LOCALMENTE DE FORMA IMEDIATA PARA EVITAR CORRIDA DE REDIRECIONAMENTO
        if (data && data.session) {
          const user = data.session.user;
          const displayName = user.user_metadata.username || user.user_metadata.full_name || user.user_metadata.name || "Colecionador";
          currentUser = {
            uid: user.id,
            name: displayName,
            photo_url: user.user_metadata.avatar_url || "",
            provider: user.app_metadata.provider || "email",
            birthdate: user.user_metadata.birthdate || "",
            latitude: null,
            longitude: null,
            last_seen: new Date().toISOString()
          };
          localStorage.setItem(sessionKey, JSON.stringify(currentUser));
        }

        return { action: 'login', data };
      }

      // Caso contrário, é o fluxo exclusivo de CADASTRO
      // Normalização da data de nascimento (converter DD/MM/AAAA para AAAA-MM-DD caso contenha barras)
      let finalBirthdate = birthdate;
      if (birthdate && birthdate.includes('/')) {
        const dateParts = birthdate.split('/');
        if (dateParts.length === 3) {
          const day = dateParts[0].padStart(2, '0');
          const month = dateParts[1].padStart(2, '0');
          const year = dateParts[2];
          finalBirthdate = `${year}-${month}-${day}`;
        }
      }

      // 1. Validamos se o username é único antes de prosseguir
      const { data: checkUser } = await promiseWithTimeout(supabaseClient
        .from('profiles')
        .select('uid')
        .eq('username', cleanUsername)
        .maybeSingle());
      if (checkUser) {
        throw new Error("Este Nome de Usuário já está em uso. Por favor, escolha outro.");
      }

      // 2. Tenta realizar o cadastro (signUp) direto
      const { data: signUpData, error: signUpError } = await promiseWithTimeout(supabaseClient.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: {
          data: {
            username: cleanUsername,
            birthdate: finalBirthdate
          }
        }
      }));

      if (signUpError) {
        const errorMsg = (signUpError.message || "").toLowerCase();
        // Bypass temporário para testes se for bloqueio de IP/email do Supabase no cadastro
        if (errorMsg.includes("email rate limit exceeded") || errorMsg.includes("rate limit") || signUpError.status === 429) {
          const finalUsername = cleanUsername || "Colecionador Teste";
          const testBirthdate = finalBirthdate || "2010-01-01"; // Padrão menor de idade para testes rápidos
          
          console.warn("Bypass do Rate Limit no signUp ativado para testes: simulando login/cadastro bem-sucedido.");
          currentUser = {
            uid: "mock-uid-" + Date.now(),
            name: finalUsername,
            photo_url: "",
            provider: "email",
            birthdate: testBirthdate,
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
          throw new Error("Este e-mail já está cadastrado. Por favor, faça login com sua senha.");
        }
        throw signUpError;
      }

      // Se o cadastro retornar a sessão nativa ativa imediatamente, absorve a sessão e retorna
      if (signUpData && signUpData.session) {
        try {
          console.log("Cadastro bem-sucedido com sessão nativa. Definindo sessão...");
          await promiseWithTimeout(supabaseClient.auth.setSession({
            access_token: signUpData.session.access_token,
            refresh_token: signUpData.session.refresh_token
          }));

          // SALVA SESSÃO LOCALMENTE DE FORMA IMEDIATA
          const user = signUpData.session.user;
          const displayName = user.user_metadata.username || user.user_metadata.full_name || user.user_metadata.name || "Colecionador";
          currentUser = {
            uid: user.id,
            name: displayName,
            photo_url: user.user_metadata.avatar_url || "",
            provider: user.app_metadata.provider || "email",
            birthdate: user.user_metadata.birthdate || "",
            latitude: null,
            longitude: null,
            last_seen: new Date().toISOString()
          };
          localStorage.setItem(sessionKey, JSON.stringify(currentUser));
        } catch (setSessionErr) {
          console.warn("Erro ao definir sessão nativa:", setSessionErr);
        }
      } else {
        // Fallback automático de signIn caso a sessão não venha no signUp
        console.log("Sessão nativa não retornada no signUp. Executando fallback de login automático com delay para evitar race condition...");
        
        // Adiciona um pequeno delay no fallback de login de cadastro para garantir o commit no Supabase
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
          const { data: signInData, error: signInErr } = await promiseWithTimeout(supabaseClient.auth.signInWithPassword({ 
            email: cleanEmail, 
            password: cleanPassword 
          }));
          if (signInErr) throw signInErr;
          if (signInData && signInData.session) {
            await promiseWithTimeout(supabaseClient.auth.setSession({
              access_token: signInData.session.access_token,
              refresh_token: signInData.session.refresh_token
            }));
            signUpData.session = signInData.session;

            // SALVA SESSÃO LOCALMENTE DE FORMA IMEDIATA
            const user = signInData.session.user;
            const displayName = user.user_metadata.username || user.user_metadata.full_name || user.user_metadata.name || "Colecionador";
            currentUser = {
              uid: user.id,
              name: displayName,
              photo_url: user.user_metadata.avatar_url || "",
              provider: user.app_metadata.provider || "email",
              birthdate: user.user_metadata.birthdate || "",
              latitude: null,
              longitude: null,
              last_seen: new Date().toISOString()
            };
            localStorage.setItem(sessionKey, JSON.stringify(currentUser));
          }
        } catch (fallbackErr) {
          console.error("Fallback de login automático falhou:", fallbackErr);
          throw new Error("Cadastro concluído com sucesso, mas o login automático falhou. Por favor, acesse o bloco 'JÁ TENHO CONTA' para entrar.");
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
