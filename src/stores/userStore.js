import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || { email: null },
  }),
  getters: {
    email(state) {
      return state.user?.email || null; 
    },

  },
  actions: {
    setUser(user) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user)); // Save user to localStorage
    },
    clearUser() {
      this.user = { email: null };
      localStorage.removeItem('user'); 
    },
  },
});
