/* auth_min.js – Minimal authentication logic */

// Ensure supabase client is initialized in supabase_config.js and exposed as `supabase`

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
    try {
      let result;
      if (isLogin) {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password });
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
