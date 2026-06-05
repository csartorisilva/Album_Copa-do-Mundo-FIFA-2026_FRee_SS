// auth_stub.js – Minimal stub to replace the previous authDb object
// Provides implementations for methods used throughout app.js after the login UI was replaced.
window.authDb = {
  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('album_auth_session')) || null;
    } catch (e) {
      return null;
    }
  },
  // Demo mode flag – keep false for real usage
  isDemoMode() {
    return false;
  },
  // Location helpers – simply resolve null / do nothing
  async fetchLocationByIp() {
    return null;
  },
  async updateLocation(lat, lng) {
    const user = this.getCurrentUser();
    if (!user) return;
    const client = window.supabaseClient || window.supabase;
    if (client) {
      try {
        await client.from('profiles').upsert({
          uid: user.uid,
          name: user.name,
          latitude: lat,
          longitude: lng,
          last_seen: new Date().toISOString()
        });
      } catch (e) {
        console.error("Erro ao salvar localização:", e);
      }
    }
  },
  // Sticker sync cloud implementation
  async syncStickers(stickers) {
    const user = this.getCurrentUser();
    if (!user) return;
    const client = window.supabaseClient || window.supabase;
    if (client) {
      try {
        await client.from('profiles').upsert({
          uid: user.uid,
          name: user.name,
          stickers: stickers,
          last_seen: new Date().toISOString()
        });
      } catch (e) {
        console.error("Erro ao sincronizar figurinhas:", e);
      }
    }
  },
  // Simple logout using Supabase if client exists
  async logout() {
    localStorage.removeItem('album_auth_session');
    const client = window.supabaseClient || window.supabase;
    if (client && client.auth) {
      await client.auth.signOut();
    }
    return;
  },
  // Community helpers – return empty data
  async getNearbyCollectors() { return []; },
  getFavorites() { return []; },
  toggleFavorite() { return false; },
  isFavorite() { return false; },
  async getCollectorProfile() { return null; }
};
