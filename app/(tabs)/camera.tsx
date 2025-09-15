import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Image, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions, CameraType, FlashMode } from 'expo-camera';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as ImageManipulator from 'expo-image-manipulator';

type FilterId = 'none' | 'portra' | 'tri-x' | 'kodachrome';

export default function CameraScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('auto');
  const [filter, setFilter] = useState<FilterId>('none');
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0);

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
        <View style={styles.cameraBox}>
          <Image source={{ uri: previewUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
          {filter !== 'none' && <FilterOverlay filter={filter} />}
        </View>
        <View style={styles.previewActions}>
          <Pressable style={[styles.button, styles.hollow]} onPress={() => setPreviewUri(null)}>
            <Text style={[styles.buttonText, styles.hollowText]}>Retake</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => {
              // Navigate to Develop screen with the captured URI
              const href = `/(develop)?uri=${encodeURIComponent(previewUri)}`;
              // expo-router supports string hrefs via imperative navigation, but we can also defer
              // For simplicity, set a global location by using the router link in UI. Here we fallback to dynamic import
              // We'll use an inline dynamic to avoid adding a direct dependency at top-level.
              try {
                // @ts-ignore
                require('expo-router').router.push({ pathname: '/develop', params: { uri: previewUri } });
              } catch (e) {
                console.warn('Failed to navigate to develop, ensure expo-router is available', e);
              }
            }}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fill}>
      <View style={styles.cameraBox}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={facing}
          flash={flash}
          enableTorch={flash === 'torch'}
          zoom={zoom}
          animateShutter
        />
        {filter !== 'none' && <FilterOverlay filter={filter} />}
        {/* Center framing marker inside the 4:3 box */}
        <View pointerEvents="none" style={styles.centerMarkerWrap}>
          <View style={styles.centerMarker} />
        </View>
      </View>

      {/* Bottom controls */}
      <View style={styles.bottomBar}>
        {/* Lens selector pill */}
        <View style={styles.lensPill}>
          {['0.5', '1x', '2x', '3x'].map((label, idx) => {
            const selected = (idx === 1 && zoom < 0.3) || (idx === 0 && zoom < 0.05) || (idx === 2 && zoom >= 0.3 && zoom < 0.7) || (idx === 3 && zoom >= 0.7);
            return (
              <Pressable
                key={label}
                style={[styles.lensItem, selected && styles.lensItemActive]}
                onPress={() => {
                  // approximate zoom ranges; real optical lenses differ per device
                  if (label === '0.5') setZoom(0.0);
                  if (label === '1x') setZoom(0.2);
                  if (label === '2x') setZoom(0.5);
                  if (label === '3x') setZoom(0.85);
                }}
              >
                <Text style={[styles.lensText, selected && styles.lensTextActive]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Preset chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {filters.map((f) => (
            <Pressable
              key={f.id}
              onPress={() => setFilter(f.id)}
              style={[styles.chip, filter === f.id && styles.chipActive]}
            >
              <Text style={[styles.chipText, filter === f.id && styles.chipTextActive]}>{f.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.shutterRow}>
          {/* Left: Library */}
          <Pressable style={styles.circleBtn} onPress={() => router.push('/library')}>
            <IconSymbol name="square.stack" size={22} color="#fff" />
          </Pressable>

          {/* Shutter */}
          <Pressable
            onPress={async () => {
              try {
                const photo = await cameraRef.current?.takePictureAsync({
                  quality: 1,
                  skipProcessing: false,
                });
                if (photo?.uri) {
                  // Enforce 4:3 portrait crop
                  const w = photo.width ?? 0;
                  const h = photo.height ?? 0;
                  let cropW = w;
                  let cropH = h;
                  let originX = 0;
                  let originY = 0;
                  const targetRatio = 4 / 3.0; // height / width for portrait 4:3
                  const currentRatio = h / (w || 1);
                  if (currentRatio > targetRatio) {
                    // too tall -> reduce height
                    cropH = Math.floor(w * targetRatio);
                    originY = Math.floor((h - cropH) / 2);
                  } else if (currentRatio < targetRatio) {
                    // too wide -> reduce width
                    cropW = Math.floor(h / targetRatio);
                    originX = Math.floor((w - cropW) / 2);
                  }
                  const result = await ImageManipulator.manipulateAsync(
                    photo.uri,
                    [{ crop: { originX, originY, width: cropW, height: cropH } }],
                    { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
                  );
                  setPreviewUri(result.uri);
                }
              } catch (e) {
                console.warn('Failed to take picture', e);
              }
            }}
            style={styles.shutterOuter}
          >
            <View style={styles.shutterInner} />
          </Pressable>

          {/* Right: Presets panel (for now keep as placeholder action) */}
          <Pressable style={styles.circleBtn} onPress={() => {/* Future: open presets drawer */}}>
            <IconSymbol name="wand.and.stars" size={22} color="#fff" />
          </Pressable>
        </View>

        {/* Flash control bubble */}
        <View style={styles.flashWrap}>
          <Pressable
            style={styles.round}
            onPress={() => setFlash((f) => (f === 'auto' ? 'on' : f === 'on' ? 'off' : 'auto'))}
          >
            <Text style={styles.roundText}>{flash === 'auto' ? '⚡︎ A' : flash === 'on' ? '⚡︎ On' : '⚡︎ Off'}</Text>
          </Pressable>
        </View>
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
  cameraBox: {
    width: '100%',
    aspectRatio: 3 / 4, // 4:3 portrait box
    backgroundColor: '#000',
    alignSelf: 'center',
    overflow: 'hidden',
  },
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
  // No top bar per spec
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
    gap: 14,
  },
  filters: { paddingHorizontal: 16, gap: 8 },
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
  shutterRow: {
    width: '100%',
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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
  circleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
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
  centerMarkerWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerMarker: {
    width: 64,
    height: 140,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#FF8A00', // orange
    opacity: 0.75,
    shadowColor: '#FF8A00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
  lensPill: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  lensItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  lensItemActive: { backgroundColor: '#2ED1C4' }, // teal accent
  lensText: { color: '#fff', fontWeight: '700' },
  lensTextActive: { color: '#000' },
  flashWrap: {
    position: 'absolute',
    right: 16,
    bottom: 24 + 80 + 16, // above shutter row
  },
});
