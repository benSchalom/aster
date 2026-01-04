/**
 * Definition d'interface 
 * pour la gestion du format 
 * de donner envoyer a mon 
 * api d'authentification a des fins
 * de traitement
 * 
 * Definition des interfaces decrivant 
 * le format des reponses obtenus par 
 * les routes de l'authentification
 */


import { User } from './models'
import { Pro } from './models'
import { Specialite } from './models'


// ==========================================
// TYPES D'ENVOI (Requêtes vers le backend)
// ==========================================

export interface RegisterClientData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
}

export interface RegisterProData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
  business_name: string;
  specialite_id: number;
  pays: string;
  province: string;
  ville: string;
  adresse_salon: string;
  code_postal: string;
  travail_salon: boolean;
  travail_domicile: boolean;
  distance_max_km?: number;
  bio?: string;
}




// ==========================================
// RÉPONSES DES ROUTES
// ==========================================

export interface RegisterResponse {
  message: string;
  user_id: number;
  email: string;
  requires_verification: boolean;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
  user: User;
  pro?: Pro;
}

export interface LoginResponse {
  message: string;
  user: User;
  access_token: string;
  refresh_token: string;
  pro?: Pro;
}

export interface CurrentUserResponse {
  user: User;
  pro?: Pro;
}

export interface RefreshTokenResponse {
  access_token: string;
}

export interface SpecialitesResponse {
  specialites: Specialite[];
}

export interface ApiError {
  error: string;
  requires_verification?: boolean;
  user_id?: number;
}