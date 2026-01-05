import React, { useEffect } from 'react';
import { View, StyleSheet, ImageBackground, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';  
import { StackNavigationProp } from '@react-navigation/stack';  
import { AuthStackParamList } from '../../navigation/AppNavigator';  
import { useAuthStore } from '../../store/authStore';  
import { Logo } from '../../components/Logo';

type SplashScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Splash'>;

export const SplashScreen = () => {
  return (
    <ImageBackground
      source={require('../../../assets/splash-bg.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.container}>
        <Logo size={250} animated />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});