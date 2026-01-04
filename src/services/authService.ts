import api from './api'
import {
    RegisterClientData,
    RegisterProData,
    RegisterResponse,
    VerifyEmailResponse,
    LoginResponse,
    CurrentUserResponse,
    RefreshTokenResponse,
    SpecialitesResponse
} from '../types/auth.types'


// Definirion du service d'authentification
export const authService ={

    // ==========================================
    // INSCRIPTION
    // ==========================================

    // Inscription client
    inscrireClient: async(data : RegisterClientData): Promise <RegisterResponse> => {
        const response = await api.post('/auth/inscription', data);
        return response.data;
    },

    //Inscription pro
    inscrirePro: async(data : RegisterProData): Promise <RegisterResponse> => {
        const response = await api.post('/auth/inscription-pro', data);
        return response.data;
    },

    // ==========================================
    // VÉRIFICATION EMAIL
    // ==========================================

    // Verification email
    verifierEmail: async(userId: number, code: string): Promise <VerifyEmailResponse> => {
        const response = await api.post('/auth/verification-email', {user_id :userId, code: code});
        return response.data;
    },

    // envoyer un nouveau code de verification de l'email
    envoyerCode: async(userId: number): Promise<{message:string}> =>{
        const response = await api.post('/auth/envoyer-code', {user_id: userId})
        return response.data;
    },

    // ==========================================
    // CONNEXION
    // ==========================================
    connexion: async (email: string, password: string): Promise<LoginResponse> =>{
        const response = await api.post('/auth/connexion', {email: email, password: password});
        return response.data
    },

    // ==========================================
    // UTILISATEUR
    // ==========================================
    // recuperer les infos sur l'utilisateur actuel (utilisation des tokens enregistre)
    utilisateur: async(): Promise<CurrentUserResponse> => {
        const response = await api.get('/auth/moi');
        return response.data
    },

    // ==========================================
    // RAFRAICHIR TOKEN
    // ==========================================

    // Rafraîchir access token
    rafraichirtoken: async (): Promise<RefreshTokenResponse> => {
        const response = await api.post('/auth/rafraichir');
        return response.data;
    },

    // ==========================================
    // SPÉCIALITÉS
    // ==========================================

    // Liste des spécialités
    Specialites: async (): Promise<SpecialitesResponse> => {
        const response = await api.get('/auth/specialites');
        return response.data;
    },

    // ==========================================
    // MOT DE PASSE
    // ==========================================

    // Mot de passe oublié
    motDePasseoublier: async (email: string): Promise<{message:string}> => {
        const response = await api.post('/auth/mot-de-passe-oublie', {email,});
        return response.data;
    },

    // Réinitialiser mot de passe
    reconfigurerMotDePasse: async (token: string, newPassword: string): Promise<{message:string}> => {
        const response = await api.post('/auth/reinitialiser-mot-de-passe', {token,new_password: newPassword,});
        return response.data;
    },

}

