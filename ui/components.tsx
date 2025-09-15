import React from 'react';
import { Pressable, ViewStyle, Text as RNText, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { createBox, createText, useTheme } from '@shopify/restyle';
import type { Theme } from './theme';

export const Box = createBox<Theme>();
export const Text = createText<Theme>();

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'solid' | 'outline' | 'teal';
  style?: ViewStyle;
};

export function Button({ label, onPress, variant = 'solid', style }: ButtonProps) {
  const t = useTheme<Theme>();
  const base: ViewStyle = {
    paddingHorizontal: t.spacing[16],
    paddingVertical: t.spacing[10],
    borderRadius: t.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  };
  const outline: ViewStyle = {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 2,
    borderColor: '#fff',
  };
  const solid: ViewStyle = {
    backgroundColor: '#FF8A00',
  };
  const teal: ViewStyle = {
    backgroundColor: t.colors.accent2 as unknown as string,
  };
  const variantStyle = variant === 'outline' ? outline : variant === 'teal' ? teal : solid;

  return (
    <Pressable onPress={onPress} style={[base, variantStyle, style]}> 
      <RNText style={{ color: '#fff', fontWeight: '700' }}>{label}</RNText>
    </Pressable>
  );
}

type IconButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
};
export function IconButton({ children, onPress }: IconButtonProps) {
  const t = useTheme<Theme>();
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.35)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)'
      }}
    >
      <Box flex={1} alignItems="center" justifyContent="center">{children}</Box>
    </Pressable>
  );
}

export function Pill({ active, children }: { active?: boolean; children: React.ReactNode }) {
  const t = useTheme<Theme>();
  return (
    <View
      style={{
        paddingHorizontal: 12,
        height: 36,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active ? '#fff' : 'rgba(0,0,0,0.5)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)'
      }}
    >
      <RNText style={{ color: active ? '#000' : '#fff', fontWeight: '700' }}>{children}</RNText>
    </View>
  );
}

export function CenterMarker() {
  return (
    <View
      pointerEvents="none"
      style={{
        width: 64,
        height: 140,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: '#FF8A00',
        opacity: 0.75,
        shadowColor: '#FF8A00',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 12,
      }}
    />
  );
}

export function Tray({ children }: { children: React.ReactNode }) {
  return (
    <BlurView intensity={30} tint="dark" style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingBottom: 12,
      paddingTop: 8,
    }}>
      {children}
    </BlurView>
  );
}

