/* auth_min.js – Minimal authentication logic */

let supabaseClient = null;

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
    console.error("Erro ao inicializar o cliente Supabase:", err);
  }
} else {
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
    if (!supabaseClient) {
      alert("Erro de Configuração: O arquivo 'supabase_config.js' não foi carregado ou contém chaves inválidas (de exemplo). Se você está na Vercel, certifique-se de configurar as variáveis de ambiente ou implantar a branch 'gh-pages' que contém as credenciais injetadas.");
      return;
    }
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const isLogin = tabLogin.classList.contains('active');
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
      // Success – redirect to album page
      window.location.href = 'album.html';
    } catch (err) {
      // Unexpected error
      alert(err.message || 'Erro inesperado');
    }
  });
});
