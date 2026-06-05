// auth_stub.js – Minimal stub to replace the previous authDb object
// Provides no‑op implementations for methods used throughout app.js after the login UI was replaced.
window.authDb = {
  // Returns the current user (null means not logged in)
  getCurrentUser() {
    return null;
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
    // No persistence needed for the minimal version
    return;
  },
  // Sticker sync placeholder
  async syncStickers(stickers) {
    // No‑op – real sync is handled elsewhere if needed
    return;
  },
  // Simple logout using Supabase if client exists
  async logout() {
    if (window.supabase) {
      await supabase.auth.signOut();
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
