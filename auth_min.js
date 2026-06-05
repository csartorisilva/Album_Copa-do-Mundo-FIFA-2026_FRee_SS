/* auth_min.js – Minimal authentication logic */

let supabaseClient = null;
let initError = null;

const hasValidConfig = typeof window.SUPABASE_URL !== 'undefined' && 
                       typeof window.SUPABASE_KEY !== 'undefined' && 
                       window.SUPABASE_URL !== "" && 
                       window.SUPABASE_KEY !== "" && 
                       !window.SUPABASE_KEY.includes('REAL_AQUI');

if (hasValidConfig) {
  try {
    supabaseClient = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
    window.supabaseClient = supabaseClient;
  } catch (err) {
    initError = "Erro no createClient: " + (err.message || err);
    console.error("Erro ao inicializar o cliente Supabase:", err);
  }
} else {
  initError = "O arquivo supabase_config.js não carregou as chaves corretamente (possível erro de cache ou branch).";
  console.warn("Configurações do Supabase ausentes ou usando valores de exemplo (SUA_CHAVE_ANON_REAL_AQUI).");
}

document.addEventListener('DOMContentLoaded', () => {
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const submitBtn = document.getElementById('submit-btn');
  const form = document.getElementById('auth-form');

  // Switch tabs UI
  function setTab(isLogin) {
    if (isLogin) {
      tabLogin.classList.add('active');
      tabSignup.classList.remove('active');
      submitBtn.textContent = 'Entrar';
    } else {
      tabLogin.classList.remove('active');
      tabSignup.classList.add('active');
      submitBtn.textContent = 'Cadastrar';
    }
  }

  tabLogin.addEventListener('click', () => setTab(true));
  tabSignup.addEventListener('click', () => setTab(false));

  // Initial state – login tab active
  setTab(true);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const isLogin = tabLogin.classList.contains('active');

    if (!supabaseClient) {
      console.warn("Supabase inativo (" + initError + "). Utilizando fallback offline local.");
      const users = JSON.parse(localStorage.getItem('mock_users') || '{}');
      if (isLogin) {
        if (users[email] && users[email].password === password) {
          localStorage.setItem('album_auth_session', JSON.stringify({ uid: users[email].uid, name: email.split('@')[0], email }));
          window.location.href = 'album.html';
        } else {
          alert('ATENÇÃO: Conexão com banco de dados indisponível no momento.\nModo Offline Ativado: Credenciais locais inválidas. Tente cadastrar primeiro.');
        }
      } else {
        if (users[email]) {
          alert('ATENÇÃO: Modo Offline. Este e-mail já está cadastrado localmente.');
        } else {
          const uid = 'local_' + Date.now();
          users[email] = { uid, password };
          localStorage.setItem('mock_users', JSON.stringify(users));
          localStorage.setItem('album_auth_session', JSON.stringify({ uid, name: email.split('@')[0], email }));
          window.location.href = 'album.html';
        }
      }
      return;
    }

    try {
      let result;
      if (isLogin) {
        result = await supabaseClient.auth.signInWithPassword({ email, password });
      } else {
        result = await supabaseClient.auth.signUp({ email, password });
      }
      if (result.error) {
        // Show the raw Supabase error message
        alert(result.error.message);
        return;
      }
      
      if (result.data && result.data.user) {
        const user = result.data.user;
        const displayName = user.user_metadata?.username || user.user_metadata?.full_name || email.split('@')[0];
        const uid = user.id;
        localStorage.setItem('album_auth_session', JSON.stringify({ uid, name: displayName, email }));
      }

      // Success – redirect to album page
      window.location.href = 'album.html';
    } catch (err) {
      // Unexpected error
      alert(err.message || 'Erro inesperado');
    }
  });
});
