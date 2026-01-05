import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { theme } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { validateEmail, validatePassword } from '../../utils/validation';
import { AuthStackParamList } from '../../navigation/AppNavigator';


type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;


export const LoginScreen = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const { connexion } = useAuthStore();

    // etats pour les inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // etats pour les erreurs
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [serverError, setServerError] = useState('');

    // etats loading
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        //Reset toutes les erreurs
        setEmailError('');
        setPasswordError('');
        setServerError('');

        // Validation email
        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            setEmailError(emailValidation.error!);
            return; // Arrêter si erreur
        }

        // Validation password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            setPasswordError(passwordValidation.error!);
            return;
        }

        // Appel de l'api
        setIsLoading(true);
  
        try {
            await connexion(email, password);
            // Si succès, le store met à jour isAuthenticated
            // AppNavigator redirigera automatiquement vers Home
            
        } catch (error: any) {
            // Cas 1 : Email non vérifié (403 + requires_verification)
            if (error.response?.status === 403 && error.response?.data?.requires_verification) {
                navigation.navigate('VerifyEmail', {
                userId: error.response.data.user_id,
                email: email,
                });
                return;
            }

            // Cas 2 : Autres erreurs (401, 500, réseau, etc.)
            const errorMessage = error.response?.data?.error || 'Connexion échouée. Vérifiez votre connexion.';
            setServerError(errorMessage);

        } finally {
            setIsLoading(false);
        };
    }

    // UI/UX
    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}> 
            {/* 1. Banner erreur serveur */}
                {serverError && (
                <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{serverError}</Text>
                </View>
            )}

            {/* 2. Titre */}
            <Text style={styles.title}>Connexion</Text>
            <Text style={styles.subtitle}>Content de vous revoir !</Text>

            {/* 3. Inputs */}
            <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="votre@email.com"
                type="email"
                error={emailError}
                disabled={isLoading}
            />

            <Input
                label="Mot de passe"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                type="password"
                error={passwordError}
                disabled={isLoading}
            />


            {/* 4. Bouton connexion */}
            <Button
                title="Se connecter"
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
                fullWidth
            />

            {/* 5. Liens */}
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.link}>Mot de passe oublié ?</Text>
                </TouchableOpacity>

                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Pas de compte ? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Choice')}>
                    <Text style={styles.registerLink}>S'inscrire</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView> 
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },

    scrollContent: {
        flexGrow: 1,
        padding: theme.spacing.lg,
        justifyContent: 'center',
    },

    errorBanner: {
        backgroundColor: theme.colors.error,
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        marginBottom: theme.spacing.lg
    },

    errorText: {
        color: theme.colors.white,
        fontSize: theme.typography.fontSize.sm,
        textAlign: 'center',
    },

    title: {
        fontSize: theme.typography.fontSize['xxxl'],
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.black,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },

    subtitle: {
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.gray[500],
        marginBottom: theme.spacing.xl,
        textAlign: 'center',
    },

    link: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.primary,
        textAlign: 'center',
        marginTop: theme.spacing.md,
    },

    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.lg,
    },

    registerText: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.gray[500],
    },
    
    registerLink: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.primary,
        fontWeight: theme.typography.fontWeight.semibold,
    },

})