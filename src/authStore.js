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
        const response = await axios.post('http://172.30.189.97:5005/auth/login', { username, password });

        // Extraer solo la información necesaria
        const { user } = response.data;
        const { noReloj, folio, roles } = user;

        console.log("Usuario:", user); // Verifica la estructura del usuario

        // Estructurar el usuario de manera más clara
        const structuredUser = {
          username: noReloj,
          numFolio: folio?.numFolio || null,
          idUsuario: folio?.Usuario?.idUsuario || null,
          fullName: `${folio?.Usuario?.nombre || ''} ${folio?.Usuario?.apellidoPat || ''}`.trim(),
          roles: roles.map(role => role.rol.level), // Extrae solo los niveles de rol
        };

        set({ isAuthenticated: true, user: structuredUser, loginType: 'normal' }); // Actualiza el tipo de inicio de sesión
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        set({ isAuthenticated: false, user: null, loginType: null });
      }
    },
    loginWithFolio: async (folio) => {
      try {
        const response = await axios.post('http://172.30.189.97:5005/auth/loginFolio', { folio });

        // Extraer solo la información necesaria
        const { user } = response.data;
        const { idFolio, numFolio, Usuario, Extras } = user;

        // Estructura el usuario de manera más clara
        const structuredUser = {
          idFolio,
          numFolio,
          fullName: `${Usuario?.nombre || ''} ${Usuario?.apellidoPat || ''}`.trim(),
          hasWatchedAllVideos: Extras?.vioVideos || false, // Estado de si ha visto todos los videos
        };

        set({ isAuthenticated: true, user: structuredUser, loginType: 'folio', hasWatchedAllVideos: structuredUser.hasWatchedAllVideos }); // Actualiza el tipo de inicio de sesión
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        set({ isAuthenticated: false, user: null, loginType: null });
      }
    },
    logout: () => set({ isAuthenticated: false, user: null, loginType: null, hasWatchedAllVideos: false }), // Resetea el tipo de inicio de sesión al cerrar sesión
    markVideosAsWatched: async (idFolio) => {
      try {
        await axios.put(`http://172.30.189.97:5005/folio/extras/${idFolio}`);
        set({ hasWatchedAllVideos: true });
        console.log("Estado de vioVideos actualizado a true");
      } catch (error) {
        console.error("Error al actualizar el estado de vioVideos:", error);
      }
    },
  }),
  {
    name: 'auth-storage', // nombre del almacenamiento en localStorage
  }
));

export default useAuthStore;