import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';

import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { theme } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';
import { validateEmail, validatePhone, validatePassword, validateRequired, validatePasswordMatch } from '../../utils/validation';
import { AuthStackParamList } from '../../navigation/AppNavigator';
import { Specialite } from '../../types/models';

type RegisterProScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'RegisterPro'>;


export const RegisterProScreen = () => {
    const navigation = useNavigation<RegisterProScreenNavigationProp>();
    const { inscriptionPro } = useAuthStore();

    // States infos personnelles (6)
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // States infos professionnelles (3)
    const [businessName, setBusinessName] = useState('');
    const [specialiteId, setSpecialiteId] = useState<number | null>(null);
    const [bio, setBio] = useState('');

    // States localisation (5)
    const [pays, setPays] = useState('Canada');
    const [province, setProvince] = useState('');
    const [ville, setVille] = useState('');
    const [adresseSalon, setAdresseSalon] = useState('');
    const [codePostal, setCodePostal] = useState('');

    // States mode de travail (3)
    const [travailSalon, setTravailSalon] = useState(true);
    const [travailDomicile, setTravailDomicile] = useState(false);
    const [distanceMaxKm, setDistanceMaxKm] = useState('');

    // States erreurs (13)
    const [prenomError, setPrenomError] = useState('');
    const [nomError, setNomError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [telephoneError, setTelephoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [businessNameError, setBusinessNameError] = useState('');
    const [specialiteError, setSpecialiteError] = useState('');
    const [provinceError, setProvinceError] = useState('');
    const [villeError, setVilleError] = useState('');
    const [adresseSalonError, setAdresseSalonError] = useState('');
    const [codePostalError, setCodePostalError] = useState('');
    const [distanceError, setDistanceError] = useState('');
    const [serverError, setServerError] = useState('');

    // States UI
    const [isLoading, setIsLoading] = useState(false);
    const [specialites, setSpecialites] = useState<Specialite[]>([]);
    const [loadingSpecialites, setLoadingSpecialites] = useState(true);

    // Charger spécialités au montage
    useEffect(() => {
        const loadSpecialites = async () => {
        try {
            const data = await authService.specialites();
            setSpecialites(data.specialites);
        } catch (error) {
            console.log('Erreur chargement spécialités:', error);
        } finally {
            setLoadingSpecialites(false);
        }
        };

        loadSpecialites();
    }, []);

    const handleRegister = async () => {
        // Reset toutes les erreurs
        setPrenomError('');
        setNomError('');
        setEmailError('');
        setTelephoneError('');
        setPasswordError('');
        setConfirmPasswordError('');
        setBusinessNameError('');
        setSpecialiteError('');
        setProvinceError('');
        setVilleError('');
        setAdresseSalonError('');
        setCodePostalError('');
        setDistanceError('');
        setServerError('');

        // Validations infos personnelles (identique RegisterClient)
        const prenomValidation = validateRequired(prenom, 'Prénom');
        if (!prenomValidation.valid) {
            setPrenomError(prenomValidation.error!);
            return;
        }

        const nomValidation = validateRequired(nom, 'Nom');
        if (!nomValidation.valid) {
            setNomError(nomValidation.error!);
            return;
        }

        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            setEmailError(emailValidation.error!);
            return;
        }

        const telephoneValidation = validatePhone(telephone);
        if (!telephoneValidation.valid) {
            setTelephoneError(telephoneValidation.error!);
            return;
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            setPasswordError(passwordValidation.error!);
            return;
        }

        const passwordMatchValidation = validatePasswordMatch(password, confirmPassword);
        if (!passwordMatchValidation.valid) {
            setConfirmPasswordError(passwordMatchValidation.error!);
            return;
        }

        // Validation nom du salon
        const businessNameValidation = validateRequired(businessName, 'Nom du salon');
        if (!businessNameValidation.valid) {
            setBusinessNameError(businessNameValidation.error!);
            return;
        }

        // Validation spécialité
        if (!specialiteId) {
            setSpecialiteError('Veuillez sélectionner une spécialité');
            return;
        }

        // Validation province
        const provinceValidation = validateRequired(province, 'Province');
        if (!provinceValidation.valid) {
            setProvinceError(provinceValidation.error!);
            return;
        }

        // Validation ville
        const villeValidation = validateRequired(ville, 'Ville');
        if (!villeValidation.valid) {
            setVilleError(villeValidation.error!);
            return;
        }

        // Validation adresse
        const adresseValidation = validateRequired(adresseSalon, 'Adresse du salon');
        if (!adresseValidation.valid) {
            setAdresseSalonError(adresseValidation.error!);
            return;
        }

        // Validation code postal
        const codePostalValidation = validateRequired(codePostal, 'Code postal');
        if (!codePostalValidation.valid) {
            setCodePostalError(codePostalValidation.error!);
            return;
        }

        // Si travail à domicile, distance obligatoire
        if (travailDomicile && !distanceMaxKm) {
            setDistanceError('Distance maximale requise pour travail à domicile');
            return;
        }

        // Validation format distance (nombre positif)
        if (travailDomicile && distanceMaxKm) {
            const distance = parseFloat(distanceMaxKm);
            if (isNaN(distance) || distance <= 0) {
            setDistanceError('Distance invalide');
            return;
            }
        }

        // Appel API
        setIsLoading(true);

        try {
            const data = await inscriptionPro({
                email,
                password,
                nom,
                prenom,
                telephone,
                business_name: businessName,
                specialite_id: specialiteId,
                pays,
                province,
                ville,
                adresse_salon: adresseSalon,
                code_postal: codePostal,
                travail_salon: travailSalon,
                travail_domicile: travailDomicile,
                distance_max_km: travailDomicile ? parseFloat(distanceMaxKm) : undefined,
                bio: bio || undefined, // Optionnel
                });

                // Succès → Rediriger vers VerifyEmail
                navigation.navigate('VerifyEmail', {
                userId: data.user_id,
                email: email,
                });

            } catch (error: any) {
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
            {/* Banner erreur serveur */}
            {serverError && (
            <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{serverError}</Text>
            </View>
            )}

            {/* Titre */}
            <Text style={styles.title}>Inscription Professionnelle</Text>
            <Text style={styles.subtitle}>Rejoignez Aster en tant que pro</Text>

            {/* Section titre */}
            <Text style={styles.sectionTitle}>Informations personnelles</Text>

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

            {/* 4. Section Infos professionnelles */}
            <Text style={styles.sectionTitle}>Informations professionnelles</Text>

            <Input
            label="Nom du salon"
            value={businessName}
            onChangeText={setBusinessName}
            placeholder="Salon Beauté Marie"
            error={businessNameError}
            disabled={isLoading}
            />

            {/* Dropdown Spécialité */}
            <View style={styles.inputContainer}>
            <Text style={styles.label}>Spécialité *</Text>
            <View style={styles.pickerContainer}>
                <Picker
                selectedValue={specialiteId}
                onValueChange={(value) => setSpecialiteId(value)}
                enabled={!isLoading && !loadingSpecialites}
                style={styles.picker}
                >
                <Picker.Item label="Sélectionner une spécialité" value={null} />
                {specialites.map((spec) => (
                    <Picker.Item key={spec.id} label={spec.nom} value={spec.id} />
                ))}
                </Picker>
            </View>
            {specialiteError && <Text style={styles.errorText}>{specialiteError}</Text>}
            </View>

            <Input
            label="Bio (optionnel)"
            value={bio}
            onChangeText={setBio}
            placeholder="Parlez-nous de votre expérience..."
            multiline
            disabled={isLoading}
            />

            {/* 5. Section Localisation */}
            <Text style={styles.sectionTitle}>Localisation</Text>

            <Input
            label="Province"
            value={province}
            onChangeText={setProvince}
            placeholder="Québec"
            error={provinceError}
            disabled={isLoading}
            />

            <Input
            label="Ville"
            value={ville}
            onChangeText={setVille}
            placeholder="Montréal"
            error={villeError}
            disabled={isLoading}
            />

            <Input
            label="Adresse du salon"
            value={adresseSalon}
            onChangeText={setAdresseSalon}
            placeholder="123 rue Sainte-Catherine"
            error={adresseSalonError}
            disabled={isLoading}
            />

            <Input
            label="Code postal"
            value={codePostal}
            onChangeText={setCodePostal}
            placeholder="H2X 1Y5"
            error={codePostalError}
            disabled={isLoading}
            />

            {/* 6. Section Mode de travail */}
            <Text style={styles.sectionTitle}>Mode de travail</Text>

            {/* Switch Travail au salon */}
            <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Travail au salon</Text>
            <Switch
                value={travailSalon}
                onValueChange={setTravailSalon}
                trackColor={{ false: theme.colors.gray[300], true: theme.colors.primary }}
                thumbColor={theme.colors.white}
                disabled={isLoading}
            />
            </View>

            {/* Switch Travail à domicile */}
            <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Travail à domicile</Text>
            <Switch
                value={travailDomicile}
                onValueChange={setTravailDomicile}
                trackColor={{ false: theme.colors.gray[300], true: theme.colors.primary }}
                thumbColor={theme.colors.white}
                disabled={isLoading}
            />
            </View>

            {/* Input distance (conditionnel) */}
            {travailDomicile && (
                <Input
                    label="Distance maximale (km)"
                    value={distanceMaxKm}
                    onChangeText={setDistanceMaxKm}
                    placeholder="15"
                    keyboardType="numeric"
                    error={distanceError}
                    disabled={isLoading}
                />
            )}

            {/* 7. Bouton + Lien */}
            <Button
                title="S'inscrire"
                onPress={handleRegister}
                loading={isLoading}
                disabled={isLoading || loadingSpecialites}
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

    sectionTitle: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.semibold,
        color: theme.colors.black,
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.md,
    },

    inputContainer: {
        marginBottom: theme.spacing.md,
    },

    label: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.medium,
        color: theme.colors.black,
        marginBottom: theme.spacing.xs,
    },

    pickerContainer: {
        backgroundColor: theme.colors.white,
        borderWidth: 1,
        borderColor: theme.colors.gray[200],
        borderRadius: theme.radius.md,
        overflow: 'hidden',
    },

    picker: {
        height: 56,
    },

    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.gray[200],
    },

    switchLabel: {
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.black,
        fontWeight: theme.typography.fontWeight.medium,
    },

    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
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