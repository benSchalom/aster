import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { AuthStackParamList } from '../../navigation/AppNavigator';

type ChoiceScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Choice'>;

export const ChoiceScreen = () => {
  const navigation = useNavigation<ChoiceScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Asteur</Text>
      <Text style={styles.subtitle}>Choisissez votre type de compte</Text>

      {/* Bouton Client */}
      <TouchableOpacity 
        style={styles.choiceButton}
        onPress={() => navigation.navigate('RegisterClient')}
      >
        <Ionicons name="person-outline" size={48} color={theme.colors.primary} />
        <Text style={styles.choiceTitle}>Je suis client</Text>
        <Text style={styles.choiceDescription}>
          Réservez des rendez-vous facilement
        </Text>
      </TouchableOpacity>

      {/* Bouton Pro */}
      <TouchableOpacity 
        style={styles.choiceButton}
        onPress={() => navigation.navigate('RegisterPro')}
      >
        <Ionicons name="briefcase-outline" size={48} color={theme.colors.secondary} />
        <Text style={styles.choiceTitle}>Je suis professionnel</Text>
        <Text style={styles.choiceDescription}>
          Gérez vos rendez-vous et clients
        </Text>
      </TouchableOpacity>

      {/* Lien connexion */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Déjà un compte ? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    justifyContent: 'center',
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
    marginBottom: theme.spacing.xxl,
    textAlign: 'center',
  },

  choiceButton: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.gray[200],
  },

  choiceTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.black,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },

  choiceDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray[500],
    textAlign: 'center',
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
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