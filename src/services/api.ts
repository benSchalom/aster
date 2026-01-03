import axios from 'axios'; // utile pour les requete http vers l'api
import AsyncStorage from '@react-native-async-storage/async-storage' // stocker le jwt sur mon telephone

const api = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});


// Sauvegarde local des tokens
api.interceptors.request.use( async (config) => {
    const token =  await AsyncStorage.getItem('access_token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

// intercepteur de reponse lorsque le token expire afin de le rafraichir
api.interceptors.response.use(
    (response) =>response, 
    async(error) =>{ // traitement en cas d'erreur
        const requeteOriginal = error.config // configuration de la requete qui a echoue

        if(error.response?.status === 401 && !requeteOriginal._retry){
            requeteOriginal._retry = true

            // rafraichir
            const refreshToken = await AsyncStorage.getItem('refresh_token')
            if(refreshToken){
                try{
                    const response = await api.post('/api/auth/rafraichir', {}, {
                        headers: { Authorization: `Bearer ${refreshToken}` }
                    });
                    const { access_token }= response.data

                    // sauvegarde du nouveau token
                    await AsyncStorage.setItem('access_token', access_token)

                    // retente la requete qui avait crasher avec lle token expire
                    requeteOriginal.headers.Authorization = `Bearer ${access_token}`
                    return api(requeteOriginal)
                } catch {
  
                await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
            }
        }
    }
    
    return Promise.reject(error);
});

// Api pour authentification
export const authAPI = {

    //Connexion
    login: async (email: string, password: string) => {
        const response = await api.post('/api/auth/connexion', {email, password})
        return response.data
    }
}

export default api;