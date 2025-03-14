import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const useAuthStore = create(persist(
  (set) => ({
    isAuthenticated: false,
    user: null,
    loginType: null, // Estado para el tipo de inicio de sesión
    hasWatchedAllVideos: false, // Estado para controlar si ha visto todos los videos
    login: async (username, password) => {
      try {
        const response = await axios.post('http://172.30.190.88:5005/auth/login', { username, password });
        set({ isAuthenticated: true, user: response.data.user, loginType: 'normal' }); // Actualiza el tipo de inicio de sesión
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        set({ isAuthenticated: false, user: null, loginType: null });
      }
    },
    loginWithFolio: async (folio) => {
      try {
        const response = await axios.post('http://172.30.190.88:5005/auth/loginFolio', { folio });
        set({ isAuthenticated: true, user: response.data.user, loginType: 'folio' }); // Actualiza el tipo de inicio de sesión
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        set({ isAuthenticated: false, user: null, loginType: null });
      }
    },
    logout: () => set({ isAuthenticated: false, user: null, loginType: null, hasWatchedAllVideos: false }), // Resetea el tipo de inicio de sesión al cerrar sesión
    markVideosAsWatched: () => set({ hasWatchedAllVideos: true }), // Función para marcar videos como vistos
  }),
  {
    name: 'auth-storage', // nombre del almacenamiento en localStorage
  }
));

export default useAuthStore;