export const state = {
  /** Currently logged-in user profile, or null when signed out. */
  curUser: null,

  /** Currently active sidebar category. */
  curCat: 'All',

  /** Cached list of all user profiles (admin panel). */
  cachedUsers: []
};
