/**
 * converion json en interface
 * Ici je convertis les jsons retourne par
 * la méthode to_dict() de chaque models
 * en interface pour les mon frontend
 */


// ==========================================
// MODÈLES (Réponses du backend)
// ==========================================

export interface User {
    id: number;
    email: string;
    role: 'client' | 'pro';
    nom: string;
    prenom: string;
    telephone: string;
    photo_url?: string;
    email_verified: boolean;
    is_active: boolean;
    created_at?: string;
    last_login?: string;
}

export interface Pro {
  id: number;
  user_id: number;
  bio?: string;
  business_name: string;
  specialite_id: number;
  ville: string;
  adresse_salon: string;
  pays: string;
  province: string;
  code_postal: string;
  travail_salon: boolean;
  travail_domicile: boolean;
  distance_max_km?: number;
  latitude: number;
  longitude: number;
  rating_avg?: number;
  total_reviews?: number;
  total_appointments?: number;
  created_at?: string;
}

export interface Specialite {
  id: number;
  nom: string;
  slug: string;
  description: string;
  icone_url?: string;
  ordre_affichage: number;
  is_active: boolean;
}
