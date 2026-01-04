import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration de base
const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur requête : Ajouter token automatiquement
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur réponse : Gérer refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requeteOriginal = error.config;

    // Erreur 401 (token expiré)
    if (error.response?.status === 401 && !requeteOriginal._retry) {
      requeteOriginal._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');

        if (!refreshToken) {
          await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
          return Promise.reject(error);
        }

        // Rafraîchir le token
        const response = await axios.post(
          'http://localhost:5000/auth/rafraichir',
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } }
        );

        const { access_token } = response.data;

        // Sauvegarder nouveau token
        await AsyncStorage.setItem('access_token', access_token);

        // Réessayer requête originale
        requeteOriginal.headers.Authorization = `Bearer ${access_token}`;
        return api(requeteOriginal);

      } catch (refreshError) {
        await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
        return Promise.reject(refreshError);
      }
    }

    // Autres erreurs
    return Promise.reject(error);
  }
);

export default api;