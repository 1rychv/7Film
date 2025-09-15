import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { CameraView, useCameraPermissions, CameraType, FlashMode } from 'expo-camera';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

type FilterId = 'none' | 'portra' | 'tri-x' | 'kodachrome';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [filter, setFilter] = useState<FilterId>('none');
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const cameraRef = useRef<CameraView>(null);

  const filters = useMemo(
    () => [
      { id: 'none' as const, label: 'None' },
      { id: 'portra' as const, label: 'Portra' },
      { id: 'tri-x' as const, label: 'Tri‑X' },
      { id: 'kodachrome' as const, label: 'Kodachrome' },
    ],
    []
  );

  if (!permission) {
    return <View style={styles.fill} />;
  }

  if (!permission.granted) {
    return (
      <ThemedView style={[styles.fill, styles.center]}>
        <ThemedText style={styles.permissionTitle}>Camera Access Needed</ThemedText>
        <ThemedText style={styles.permissionBody}>
          7Film needs camera access to take photos.
        </ThemedText>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </Pressable>
      </ThemedView>
    );
  }

  // Preview captured photo
  if (previewUri) {
    return (
      <View style={styles.fill}>
        <Image source={{ uri: previewUri }} style={styles.fill} resizeMode="cover" />
        {filter !== 'none' && <FilterOverlay filter={filter} />}
        <View style={styles.previewActions}>
          <Pressable style={[styles.button, styles.hollow]} onPress={() => setPreviewUri(null)}>
            <Text style={[styles.buttonText, styles.hollowText]}>Retake</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => {
              // TODO: Save to library and apply filter processing to the file
              setPreviewUri(null);
            }}
          >
            <Text style={styles.buttonText}>Use Photo</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fill}>
      <CameraView
        ref={cameraRef}
        style={styles.fill}
        facing={facing}
        flash={flash}
        enableTorch={flash === 'torch'}
        animateShutter
      />
      {filter !== 'none' && <FilterOverlay filter={filter} />}

      {/* Top controls */}
      <View style={styles.topBar}>
        <Pressable
          style={styles.round}
          onPress={() => setFlash((f) => (f === 'off' ? 'on' : f === 'on' ? 'torch' : 'off'))}
        >
          <Text style={styles.roundText}>
            {flash === 'off' ? '⚡︎ Off' : flash === 'on' ? '⚡︎ On' : '🔦 Torch'}
          </Text>
        </Pressable>

        <Pressable style={styles.round} onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}>
          <Text style={styles.roundText}>↺ Flip</Text>
        </Pressable>
      </View>

      {/* Bottom controls */}
      <View style={styles.bottomBar}>
        <View style={styles.filters}>
          {filters.map((f) => (
            <Pressable
              key={f.id}
              onPress={() => setFilter(f.id)}
              style={[styles.chip, filter === f.id && styles.chipActive]}
            >
              <Text style={[styles.chipText, filter === f.id && styles.chipTextActive]}>{f.label}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={async () => {
            try {
              const photo = await cameraRef.current?.takePictureAsync({
                quality: 1,
                skipProcessing: false,
              });
              if (photo?.uri) setPreviewUri(photo.uri);
            } catch (e) {
              console.warn('Failed to take picture', e);
            }
          }}
          style={styles.shutterOuter}
        >
          <View style={styles.shutterInner} />
        </Pressable>
      </View>
    </View>
  );
}

function FilterOverlay({ filter }: { filter: FilterId }) {
  // Minimal visual hint overlays for now; replace with real processing later
  if (filter === 'portra') {
    return <View pointerEvents="none" style={[styles.overlay, { backgroundColor: 'rgba(255, 228, 180, 0.08)' }]} />;
  }
  if (filter === 'tri-x') {
    return <View pointerEvents="none" style={[styles.overlay, { backgroundColor: 'rgba(30, 30, 30, 0.15)' }]} />;
  }
  if (filter === 'kodachrome') {
    return <View pointerEvents="none" style={[styles.overlay, { backgroundColor: 'rgba(255, 80, 0, 0.05)' }]} />;
  }
  return null;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  permissionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  permissionBody: { opacity: 0.8, marginBottom: 16 },
  button: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  buttonText: { color: '#fff', fontWeight: '700' },
  hollow: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
  },
  hollowText: { color: '#fff' },
  topBar: {
    position: 'absolute',
    top: 24,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
    gap: 16,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  chipActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  chipText: { color: '#fff', fontWeight: '600' },
  chipTextActive: { color: '#000' },
  shutterOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#fff',
  },
  round: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 999,
  },
  roundText: { color: '#fff', fontWeight: '700' },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  previewActions: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

