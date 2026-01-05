// Validation email
export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  if (!email) {
    return { valid: false, error: 'Email requis' };
  }

  // Regex standard email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Format email invalide' };
  }

  return { valid: true };
};

// Validation téléphone (format international)
export const validatePhone = (phone: string): { valid: boolean; error?: string } => {
  if (!phone) {
    return { valid: false, error: 'Numéro de téléphone requis' };
  }

  // Enlever espaces, tirets, parenthèses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Doit commencer par + et avoir 10-15 chiffres
  const phoneRegex = /^\+[1-9]\d{9,14}$/;

  if (!phoneRegex.test(cleaned)) {
    return { 
      valid: false, 
      error: 'Format invalide. Ex: +1 514 123 4567' 
    };
  }

  return { valid: true };
};

// Validation mot de passe
export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (!password) {
    return { valid: false, error: 'Mot de passe requis' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Minimum 8 caractères' };
  }

  // Au moins une majuscule
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Au moins une majuscule requise' };
  }

  // Au moins une minuscule
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Au moins une minuscule requise' };
  }

  // Au moins un chiffre
  if (!/\d/.test(password)) {
    return { valid: false, error: 'Au moins un chiffre requis' };
  }

  // Au moins un caractère spécial
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, error: 'Au moins un caractère spécial requis' };
  }

  return { valid: true };
};

// Validation champs requis
export const validateRequired = (value: string, fieldName: string): { valid: boolean; error?: string } => {
  if (!value || value.trim() === '') {
    return { valid: false, error: `${fieldName} requis` };
  }
  return { valid: true };
};

// valider le match du mot de passe et la confirmation
export const validatePasswordMatch = (
  password: string, 
  confirmPassword: string
): { valid: boolean; error?: string } => {
  if (password !== confirmPassword) {
    return { valid: false, error: 'Les mots de passe ne correspondent pas' };
  }
  return { valid: true };
};