import { COLORS } from './colors'
import { TYPOGRAPHY} from './typography'

export const theme = {
    colors : COLORS,
    typography: TYPOGRAPHY,

    spacing: {
        xs: 4,    // entre icone et texte
        sm: 8,    // Petits espacements
        md: 16,   // padding
        lg: 24,   // Sections
        xl: 32,   // Grands espacements
        xxl: 48,  // entre sections majeures
    },

    radius: {
        sm: 8,     // badges et tags
        md: 12,    // Inputs, boutons 
        lg: 16,    // cartes et formulaire modals
        xl: 24,    // Grandes cards, bottom sheets
        full: 9999, // Boutons ronds, avatars
    },

    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2, 
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 8,
        },
    },

    durations: {
        normal: 300,  // transitions standarts
        slow: 500,    // Animations élaborées
    },

    iconSize: {
        sm: 16,   // Icônes inline dans texte
        md: 24,   // Icônes standard (boutons, navigation)
        lg: 32,   // Grandes icônes
        xl: 48,   // Icônes hero, illustrations
    }
} as const