import React, { useEffect } from 'react';
import { View, StyleSheet, ImageBackground, StatusBar } from 'react-native';
import { Logo } from '../../components/Logo';

export const SplashScreen = () => {
  useEffect(() => {
    // TODO: Vérifier token et naviguer (on fera ça plus tard)
    // Pour l'instant juste affichage visuel
  }, []);

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