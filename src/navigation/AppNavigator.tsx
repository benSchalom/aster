// Bibliotheques
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { theme } from '../constants/theme';

// Ecrans
import { SplashScreen } from '../screens/auth/SplashScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';


// store
import { useAuthStore } from '../store/authStore';

// Types navigation:Les différents ecrans (avec leurs paramétres) impliquées dans cette stack
export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  RegisterClient: undefined;
  RegisterPro: undefined;
  VerifyEmail: { userId: number; email: string };
  ForgotPassword: undefined;
};

// Create Stack
const AuthStack = createStackNavigator<AuthStackParamList>();

// Composant principal
export const AppNavigator = () => {
    const { initialize, isLoading, isAuthenticated } = useAuthStore();
    // a l'aide dus tore je verifie si un token existe au demarrage 
    useEffect(() => { /// Execution du code une seul fois grace  useEffect()
        initialize();
    }, []);

    if (isLoading) { // pendant la verification
        return <SplashScreen />;
    }

    return ( // apres verification
        <NavigationContainer>
            <AuthStack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: theme.colors.primary,
                    },
                    headerTintColor: theme.colors.white,
                    headerTitleStyle: {
                        fontWeight: theme.typography.fontWeight.semibold,
                    },
                }}
            >
                {/* Ecran de connexion */}
                <AuthStack.Screen 
                    name="Login" 
                    component={LoginScreen}
                    options={{ 
                        title: 'Connexion',
                        headerBackTitle: 'Retour'
                    }}
                />

            </AuthStack.Navigator>
        </NavigationContainer>
    );
};