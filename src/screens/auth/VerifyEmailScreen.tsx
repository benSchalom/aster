import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { theme } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';
import { AuthStackParamList } from '../../navigation/AppNavigator';

type VerifyEmailScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'VerifyEmail'>;
type VerifyEmailScreenRouteProp = RouteProp<AuthStackParamList, 'VerifyEmail'>;

export const VerifyEmailScreen = () => {
    const navigation = useNavigation<VerifyEmailScreenNavigationProp>();
    const route = useRoute<VerifyEmailScreenRouteProp>();
    const { verifierEmail } = useAuthStore();

    // Récupérer paramètres
    const { userId, email } = route.params;

    // State code
    const [code, setCode] = useState('');
    const [codeError, setCodeError] = useState('');
    const [serverError, setServerError] = useState('');

    // State loading
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    // Countdown (10 minutes = 600 secondes)
    const [timeLeft, setTimeLeft] = useState(600);

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Formater temps (ex: 09:45)
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVerify = async () => {
        // Reset erreurs
        setCodeError('');
        setServerError('');

        // Validation code (4 chiffres)
        if (!code || code.length !== 4) {
            setCodeError('Le code doit contenir 4 chiffres');
            return;
        }

        if (!/^\d{4}$/.test(code)) {
            setCodeError('Le code doit contenir uniquement des chiffres');
            return;
        }

        // Appel API
        setIsLoading(true);

        try {
            await verifierEmail(userId, code);
            // Succès → Store met isAuthenticated = true
            // AppNavigator redirige automatiquement vers Home
            
        } catch (error: any) {
            if (error.response?.status === 429) {
            // Trop de tentatives
            setServerError('Trop de tentatives. Demandez un nouveau code.');
            } else if (error.response?.status === 400) {
            // Code invalide ou expiré
            setServerError(error.response?.data?.error || 'Code invalide');
            } else {
            setServerError('Vérification échouée. Réessayez.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        setServerError('');
        setCodeError('');

        try {
            await authService.envoyerCode(userId);
            
            // Succès → Reset countdown
            setTimeLeft(600); // 10 minutes
            setCode(''); // Vider l'input
            
            Alert.alert('Succès', 'Un nouveau code a été envoyé à votre email');
            
        } catch (error: any) {
            setServerError('Échec de renvoi. Réessayez.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
            {serverError && (
                <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{serverError}</Text>
                </View>
            )}

            <Text style={styles.title}>Vérifier votre email</Text>

            <Text style={styles.message}>
                Un code de vérification a été envoyé à{'\n'}
                <Text style={styles.email}>{email}</Text>
            </Text>

            <View style={styles.countdownContainer}>
                <Text style={styles.countdownLabel}>Code expire dans</Text>
                <Text style={styles.countdownTime}>
                {timeLeft > 0 ? formatTime(timeLeft) : 'Expiré'}
                </Text>
            </View>

            <Input
                label="Code de vérification"
                value={code}
                onChangeText={setCode}
                placeholder="0000"
                keyboardType="number-pad"
                maxLength={4}
                error={codeError}
                disabled={isLoading}
            />

            <Button
                title="Vérifier"
                onPress={handleVerify}
                loading={isLoading}
                disabled={isLoading || code.length !== 4}
                fullWidth
            />

            <TouchableOpacity 
                onPress={handleResend}
                disabled={isResending || timeLeft > 0}
                style={styles.resendContainer}
            >
                <Text style={[
                styles.resendText,
                (isResending || timeLeft > 0) && styles.resendTextDisabled
                ]}>
                {isResending ? 'Envoi en cours...' : 'Renvoyer le code'}
                </Text>
            </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },

    content: {
        flex: 1,
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
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },

    message: {
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.gray[500],
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    },

    email: {
        color: theme.colors.primary,
        fontWeight: theme.typography.fontWeight.semibold,
    },

    countdownContainer: {
        backgroundColor: theme.colors.gray[100],
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        marginBottom: theme.spacing.xl,
        alignItems: 'center',
    },

    countdownLabel: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.gray[500],
        marginBottom: theme.spacing.xs,
    },

    countdownTime: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.primary,
    },

    resendContainer: {
        marginTop: theme.spacing.lg,
        alignItems: 'center',
    },

    resendText: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.primary,
        fontWeight: theme.typography.fontWeight.semibold,
    },

    resendTextDisabled: {
        color: theme.colors.gray[400],
    },
});