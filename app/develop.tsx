import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, LayoutChangeEvent, Image as RNImage, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Surface } from 'gl-react-expo';
import { GLSL, Node, Shaders } from 'gl-react';
import { Colors } from '@/constants/theme';

const shaders = Shaders.create({
  halation: {
    frag: GLSL`
precision highp float;
varying vec2 uv;
uniform sampler2D t;           // input image
uniform vec2 uTexel;           // 1.0 / viewport size
uniform float uThreshold;      // 0..1
uniform float uKnee;           // 0..1 small
uniform float uRadius;         // pixel radius scale
uniform float uStrength;       // 0..1
uniform vec3  uTint;           // warm tint

float luma(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

void main(){
  vec3 base = texture2D(t, uv).rgb;
  float y = luma(base);
  float mask = smoothstep(uThreshold, uThreshold + uKnee, y);

  // simple 9-tap blur (separable would be better, this is a preview)
  vec3 b = vec3(0.0);
  float total = 0.0;
  for (int x=-2; x<=2; x++) {
    for (int y=-2; y<=2; y++) {
      float w = exp(-float(x*x + y*y) / 6.0);
      vec2 o = vec2(float(x), float(y)) * uTexel * uRadius;
      b += texture2D(t, uv + o).rgb * w;
      total += w;
    }
  }
  b /= max(total, 1e-5);

  // keep highlights only & tint warm, slight red bias
  b = mix(vec3(0.0), b, mask);
  b *= uTint;
  b.r *= 1.12;

  vec3 color = base + uStrength * b;
  gl_FragColor = vec4(color, 1.0);
}
`
  }
});

export default function Develop() {
  const router = useRouter();
  const { uri } = useLocalSearchParams<{ uri?: string }>();

  const [layout, setLayout] = useState({ w: 0, h: 0 });
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setLayout({ w: width, h: height });
  }, []);

  const [threshold, setThreshold] = useState(0.8);
  const [knee, setKnee] = useState(0.1);
  const [radius, setRadius] = useState(2.0);
  const [strength, setStrength] = useState(0.4);

  const uTexel = useMemo(() => (
    layout.w > 0 && layout.h > 0 ? [1 / layout.w, 1 / layout.h] as [number, number] : [1 / 1000, 1 / 1000]
  ), [layout]);

  const tint = [1.0, 0.45, 0.2] as [number, number, number];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.round} onPress={() => router.back()}>
          <Text style={styles.roundText}>‹ Back</Text>
        </Pressable>
        <Text style={styles.title}>Develop</Text>
        <View style={{ width: 64 }} />
      </View>

      <View style={styles.surfaceWrap} onLayout={onLayout}>
        {uri ? (
          <Surface style={styles.surface}>
            {/* gl-react maps the first child to sampler2D uniform `t` */}
            <Node
              shader={shaders.halation}
              uniforms={{
                uThreshold: threshold,
                uKnee: knee,
                uRadius: radius,
                uStrength: strength,
                uTint: tint,
                uTexel,
              }}
            >
              <RNImage source={{ uri: decodeURIComponent(uri) }} resizeMode="contain" style={styles.img} />
            </Node>
          </Surface>
        ) : (
          <View style={[styles.surface, styles.center]}>
            <Text>No image selected.</Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <Control label="Strength" value={strength} onDec={() => setStrength(Math.max(0, +(strength - 0.1).toFixed(2)))} onInc={() => setStrength(Math.min(1, +(strength + 0.1).toFixed(2)))} />
        <Control label="Threshold" value={threshold} onDec={() => setThreshold(Math.max(0, +(threshold - 0.05).toFixed(2)))} onInc={() => setThreshold(Math.min(1, +(threshold + 0.05).toFixed(2)))} />
        <Control label="Radius" value={radius} onDec={() => setRadius(Math.max(0.5, +(radius - 0.5).toFixed(2)))} onInc={() => setRadius(Math.min(12, +(radius + 0.5).toFixed(2)))} />
      </View>
    </View>
  );
}

function Control({ label, value, onDec, onInc }: { label: string; value: number; onDec: () => void; onInc: () => void }) {
  return (
    <View style={styles.control}>
      <Text style={styles.controlLabel}>{label}</Text>
      <View style={styles.controlRow}>
        <Pressable onPress={onDec} style={[styles.step, styles.stepLeft]}><Text style={styles.stepText}>−</Text></Pressable>
        <Text style={styles.valueText}>{value.toFixed(2)}</Text>
        <Pressable onPress={onInc} style={[styles.step, styles.stepRight]}><Text style={styles.stepText}>+</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { color: '#fff', fontSize: 16, fontWeight: '700' },
  round: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 999 },
  roundText: { color: '#fff', fontWeight: '700' },
  surfaceWrap: { flex: 1, paddingHorizontal: 8 },
  surface: { flex: 1, backgroundColor: '#111', borderRadius: 8, overflow: 'hidden' },
  img: { width: '100%', height: '100%' },
  center: { alignItems: 'center', justifyContent: 'center' },
  controls: {
    padding: 12,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  control: { marginBottom: 10 },
  controlRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  controlLabel: { color: '#fff', marginBottom: 6, fontWeight: '600' },
  step: { width: 44, height: 36, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  stepLeft: {},
  stepRight: {},
  stepText: { fontSize: 18, fontWeight: '800' },
  valueText: { color: '#fff', minWidth: 64, textAlign: 'center', fontVariant: ['tabular-nums'] },
});

