import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function Develop() {
  const router = useRouter();
  const { uri } = useLocalSearchParams<{ uri?: string }>();

  const [strength, setStrength] = useState(0.4);
  const [contrast, setContrast] = useState(1.0);
  const [saturation, setSaturation] = useState(1.0);

  // Simple filter styles using React Native's Image style props
  const imageStyle = {
    opacity: 1,
    // Note: React Native doesn't support CSS filters directly,
    // but we can simulate some effects with opacity and tint
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.round} onPress={() => router.back()}>
          <Text style={styles.roundText}>‹ Back</Text>
        </Pressable>
        <Text style={styles.title}>Develop</Text>
        <View style={{ width: 64 }} />
      </View>

      <View style={styles.surfaceWrap}>
        {uri ? (
          <View style={styles.surface}>
            <Image
              source={{ uri: decodeURIComponent(String(uri)) }}
              style={[styles.image, imageStyle]}
              resizeMode="contain"
            />
            {/* Overlay for halation effect simulation */}
            <View
              style={[
                styles.overlay,
                {
                  backgroundColor: `rgba(255, 115, 51, ${strength * 0.15})`,
                  opacity: strength
                }
              ]}
              pointerEvents="none"
            />
          </View>
        ) : (
          <View style={[styles.surface, styles.center]}>
            <Text style={styles.noImageText}>No image selected.</Text>
            <Pressable
              style={styles.button}
              onPress={() => router.push('/(tabs)/camera')}
            >
              <Text style={styles.buttonText}>Take Photo</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <Control
          label="Halation"
          value={strength}
          onDec={() => setStrength(Math.max(0, +(strength - 0.1).toFixed(2)))}
          onInc={() => setStrength(Math.min(1, +(strength + 0.1).toFixed(2)))}
        />
        <Control
          label="Contrast"
          value={contrast}
          onDec={() => setContrast(Math.max(0.5, +(contrast - 0.1).toFixed(2)))}
          onInc={() => setContrast(Math.min(2, +(contrast + 0.1).toFixed(2)))}
        />
        <Control
          label="Saturation"
          value={saturation}
          onDec={() => setSaturation(Math.max(0, +(saturation - 0.1).toFixed(2)))}
          onInc={() => setSaturation(Math.min(2, +(saturation + 0.1).toFixed(2)))}
        />
      </View>
    </View>
  );
}

function Control({ label, value, onDec, onInc }: { label: string; value: number; onDec: () => void; onInc: () => void }) {
  return (
    <View style={styles.control}>
      <Text style={styles.controlLabel}>{label}</Text>
      <View style={styles.controlRow}>
        <Pressable onPress={onDec} style={[styles.step, styles.stepLeft]}>
          <Text style={styles.stepText}>−</Text>
        </Pressable>
        <Text style={styles.valueText}>{value.toFixed(2)}</Text>
        <Pressable onPress={onInc} style={[styles.step, styles.stepRight]}>
          <Text style={styles.stepText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  header: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  },
  round: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999
  },
  roundText: {
    color: '#fff',
    fontWeight: '700'
  },
  surfaceWrap: {
    flex: 1,
    paddingHorizontal: 8
  },
  surface: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  noImageText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
    opacity: 0.7,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
  },
  controls: {
    padding: 12,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  control: {
    marginBottom: 10
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  controlLabel: {
    color: '#fff',
    marginBottom: 6,
    fontWeight: '600'
  },
  step: {
    width: 44,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepLeft: {},
  stepRight: {},
  stepText: {
    fontSize: 18,
    fontWeight: '800'
  },
  valueText: {
    color: '#fff',
    minWidth: 64,
    textAlign: 'center',
    fontVariant: ['tabular-nums']
  },
});