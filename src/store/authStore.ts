import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { authService } from '../services/authService'
import { User, Pro} from '../types/models'
import { RegisterClientData, RegisterProData } from '../types/auth.types'

// interface du store
interface AuthState {
    user: User | null;
    pro: Pro | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    connexion: (email: string, password: string) => Promise<void>;
    deconnexion: () => Promise<void>;
    inscriptionClient: (data: RegisterClientData) => Promise<void>;
    inscriptionPro: (data: RegisterProData) => Promise<void>;
    verifierEmail: (userId: number, code: string) => Promise<void>;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    pro: null,
    isAuthenticated: false,
    isLoading: false,

    connexion: async (email, password) => {
        set({ isLoading: true})

        const data = await authService.connexion(email, password);

        // sauvegarde des tokens
        await AsyncStorage.setItem('access_token', data.access_token);
        await AsyncStorage.setItem('refresh_token', data.refresh_token);

        // mise a jour de l'etat
        set({
            user: data.user,
            pro: data.pro || null,
            isAuthenticated: true,
            isLoading: false
        });
    },

    deconnexion: async () => {
        await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user', 'pro']);

        set({
            user: null,
            pro: null,
            isAuthenticated: false,
            isLoading: false
        });
    },

    inscriptionClient: async (data) => {
        set ({isLoading: true})

        await authService.inscrireClient(data)

        set({isLoading: false})
    },

    inscriptionPro: async (data) => {
        set({isLoading: true})

        await authService.inscrirePro(data)

        set({isLoading: false})
    },

    verifierEmail: async (userId, code) => {
        set({isLoading:true})

        const data = await authService.verifierEmail(userId, code);

        // sauvegarde des tokens
        await AsyncStorage.setItem('access_token', data.access_token)
        await AsyncStorage.setItem('refresh_token', data.refresh_token)

          set({
            user: data.user,
            pro: data.pro || null,
            isAuthenticated: true,
            isLoading: false,
        });

    },

    // Appeler au demarrage
    initialize: async () => {
        set({ isLoading: true });
        
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (token) {
                const data = await authService.utilisateur();
                set({ user: data.user, pro: data.pro, isAuthenticated: true });
            }
            
            //delai d'attente pour afficher le splashscreen
            await new Promise(resolve => setTimeout(resolve, 2000)); 

        } catch (error) {
            await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
        } finally {
            set({ isLoading: false });
        }
    }
}));