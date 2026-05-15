// ============================================================
// APP STATE - single source of truth
// ============================================================
// Avoids globals scattered across files. Import state from anywhere
// and read/write its properties.

export const state = {
  /** Currently logged-in user profile, or null when signed out. */
  curUser: null,

  /** Currently active sidebar category. */
  curCat: 'All',

  /** Cached list of all user profiles (admin panel). */
  cachedUsers: []
};
