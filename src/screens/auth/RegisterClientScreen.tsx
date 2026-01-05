import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { theme } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { validateEmail, validatePhone, validatePassword, validateRequired, validatePasswordMatch } from '../../utils/validation';
import { AuthStackParamList } from '../../navigation/AppNavigator';


type RegisterClientScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'RegisterClient'>;

export const RegisterClientScreen = () => {
    const navigation = useNavigation<RegisterClientScreenNavigationProp>();
    const { inscriptionClient } = useAuthStore();

    // States pour les inputs (6 champs)
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // States pour les erreurs (6 erreurs)
    const [prenomError, setPrenomError] = useState('');
    const [nomError, setNomError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [telephoneError, setTelephoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [serverError, setServerError] = useState('');

    // State loading
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        // Reset erreurs
        setPrenomError('');
        setNomError('');
        setEmailError('');
        setTelephoneError('');
        setPasswordError('');
        setConfirmPasswordError('');
        setServerError('');

        // Validation prénom
        const prenomValidation = validateRequired(prenom, 'Prénom');
        if (!prenomValidation.valid) {
            setPrenomError(prenomValidation.error!);
            return;
        }

        // Validation nom
        const nomValidation = validateRequired(nom, 'Nom');
        if (!nomValidation.valid) {
            setNomError(nomValidation.error!);
            return;
        }

        // Validation email
        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            setEmailError(emailValidation.error!);
            return;
        }

        // Validation téléphone
        const telephoneValidation = validatePhone(telephone);
        if (!telephoneValidation.valid) {
            setTelephoneError(telephoneValidation.error!);
            return;
        }

        // Validation password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            setPasswordError(passwordValidation.error!);
            return;
        }

        // Validation password match
        const passwordMatchValidation = validatePasswordMatch(password, confirmPassword);
        if (!passwordMatchValidation.valid) {
            setConfirmPasswordError(passwordMatchValidation.error!);
            return;
        }

        // Appel API
        setIsLoading(true);

        try {
            const data = await inscriptionClient({
                email,
                password,
                nom,
                prenom,
                telephone,
            });

            // Succès → Rediriger vers VerifyEmail
            navigation.navigate('VerifyEmail', {
                userId: data.user_id,
                email: email,
            });

        } catch (error: any) {
            // Erreur serveur
            const errorMessage = error.response?.data?.error || 'Inscription échouée. Vérifiez votre connexion.';
            setServerError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
            {serverError && (
                <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{serverError}</Text>
                </View>
            )}

            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez Asteur aujourd'hui</Text>

            <Input
                label="Prénom"
                value={prenom}
                onChangeText={setPrenom}
                placeholder="Jean"
                error={prenomError}
                disabled={isLoading}
            />

            <Input
                label="Nom"
                value={nom}
                onChangeText={setNom}
                placeholder="Tremblay"
                error={nomError}
                disabled={isLoading}
            />

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
                label="Téléphone"
                value={telephone}
                onChangeText={setTelephone}
                placeholder="+1 514 123 4567"
                type="phone"
                error={telephoneError}
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

            <Input
                label="Confirmer le mot de passe"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                type="password"
                error={confirmPasswordError}
                disabled={isLoading}
            />

            <Button
                title="S'inscrire"
                onPress={handleRegister}
                loading={isLoading}
                disabled={isLoading}
                fullWidth
            />

            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Déjà un compte ? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Se connecter</Text>
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
        marginBottom: theme.spacing.lg,
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

    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.lg,
    },

    loginText: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.gray[500],
    },

    loginLink: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.primary,
        fontWeight: theme.typography.fontWeight.semibold,
    },
});