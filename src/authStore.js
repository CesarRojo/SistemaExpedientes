import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const useAuthStore = create(persist(
  (set) => ({
    isAuthenticated: false,
    user: null,
    login: async (username, password) => {
      try {
        const response = await axios.post('http://192.168.1.68:5005/auth/login', { username, password });
        set({ isAuthenticated: true, user: response.data.user });
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        set({ isAuthenticated: false, user: null });
      }
    },
    logout: () => set({ isAuthenticated: false, user: null }),
  }),
  {
    name: 'auth-storage', // nombre del almacenamiento en localStorage
  }
));

export default useAuthStore;