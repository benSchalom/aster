// 1. Imports
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 2. Import écrans
import { SplashScreen } from '../screens/auth/SplashScreen';
//import { LoginScreen } from '../screens/auth/LoginScreen';
// ... autres écrans

// 3. Import store
import { useAuthStore } from '../store/authStore';

// 4. Types navigation
export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  RegisterClient: undefined;
  RegisterPro: undefined;
  VerifyEmail: { userId: number; email: string };
  ForgotPassword: undefined;
};

// 5. Create Stack
const AuthStack = createStackNavigator<AuthStackParamList>();

// 6. Composant principal
export const AppNavigator = () => {
  // Logique navigation
}