import React, {useRef } from 'react'
import {
    Pressable,
    Text,
    View, 
    ActivityIndicator,
    StyleSheet,
    Animated,
} from 'react-native'
import { theme } from '../constants/theme'


interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
}: ButtonProps) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const isDisabled = disabled || loading;

  const buttonStyle = [
    styles.base,
    variant === 'primary' ? styles.primary : styles.secondary,
    size === 'sm' && styles.sm,
    size === 'md' && styles.md,
    size === 'lg' && styles.lg,
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
  ];

  const textStyle = [
    styles.text,
    variant === 'primary' ? styles.textPrimary : styles.textSecondary,
    size === 'sm' && styles.textSm,
    size === 'md' && styles.textMd,
    size === 'lg' && styles.textLg,
  ];

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        style={buttonStyle}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'primary' ? theme.colors.white : theme.colors.secondary}
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={textStyle}>{title}</Text>
            {icon && iconPosition === 'right' && <View style={styles.iconContainer}>{icon}</View>}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
  },
  // Variants
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.secondary,
  },
  // Sizes
  sm: {
    height: 40,
    paddingHorizontal: theme.spacing.md,
  },
  md: {
    height: 56,
    paddingHorizontal: theme.spacing.lg,
  },
  lg: {
    height: 64,
    paddingHorizontal: theme.spacing.xl,
  },
  // Text styles
  text: {
    fontWeight: theme.typography.fontWeight.semibold,
  },
  textPrimary: {
    color: theme.colors.white,
  },
  textSecondary: {
    color: theme.colors.secondary,
  },
  textSm: {
    fontSize: theme.typography.fontSize.sm,
  },
  textMd: {
    fontSize: theme.typography.fontSize.base,
  },
  textLg: {
    fontSize: theme.typography.fontSize.lg,
  },
  // States
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  iconContainer: {
    marginHorizontal: theme.spacing.xs,
  },
});