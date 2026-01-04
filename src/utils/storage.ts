import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Pro } from '../types/models';

// Clés utilisées dans AsyncStorage
const KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  PRO: 'pro',
};

// sauvegarde des donnees d'authentification
export const storeAuthData = async (
    accessToken: string,
    refresh_token: string,
    user : User,
    pro?: Pro // car on peut etre un client
) => {
    await AsyncStorage.setItem(KEYS.ACCESS_TOKEN, accessToken)
    await AsyncStorage.setItem(KEYS.REFRESH_TOKEN, refresh_token)
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user))

    if(pro){
        await AsyncStorage.setItem(KEYS.PRO, JSON.stringify(pro))
    }
};

// Récuperer le user stocke
export const utilisateur = async(): Promise<User | null> =>{
    const userStr = await AsyncStorage.getItem(KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
};


// Récupérer le pro stocké
export const pro = async (): Promise<Pro | null> => {
    const proStr = await AsyncStorage.getItem(KEYS.PRO);
    return proStr ? JSON.parse(proStr) : null;
};

// Récupérer access token
export const accessToken = async (): Promise<string | null> => {
    return await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
};

// Récupérer refresh token
export const refreshToken = async (): Promise<string | null> => {
    return await AsyncStorage.getItem(KEYS.REFRESH_TOKEN);
};

// Nettoyer toutes les données auth
export const clearAuthData = async () => {
    await AsyncStorage.multiRemove([
        KEYS.ACCESS_TOKEN,
        KEYS.REFRESH_TOKEN,
        KEYS.USER,
        KEYS.PRO,
    ]);
};
