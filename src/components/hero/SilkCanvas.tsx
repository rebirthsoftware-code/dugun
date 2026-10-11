"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// Domain-warped fBm "ipek" kumaş; altın ışık kırılmaları fare ile tepki verir.
const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uRes;
  uniform float uIntro;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
      v += a * snoise(p);
      p = p * 2.03 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv * vec2(uRes.x / uRes.y, 1.0);
    float t = uTime * 0.07;
    vec2 m = (uMouse - 0.5) * 0.35;

    vec2 q = vec2(fbm(p * 0.55 + t), fbm(p * 0.55 - t * 0.7 + 3.1));
    vec2 r = vec2(
      fbm(p * 0.45 + 1.1 * q + m + vec2(1.7, 9.2) + t * 0.6),
      fbm(p * 0.45 + 1.1 * q - m + vec2(8.3, 2.8) - t * 0.4)
    );
    float f = fbm(p * 0.5 + 1.2 * r);

    // Geniş, yumuşak ipek kıvrımları
    float folds = sin((uv.y * 1.4 + uv.x * 0.35 + f * 1.6 + r.x * 1.1) * 3.14159);
    float sheen = pow(smoothstep(0.1, 1.0, folds * 0.5 + 0.5), 2.6);

    vec3 ink  = vec3(0.043, 0.039, 0.039);
    vec3 wine = vec3(0.17, 0.075, 0.085);
    vec3 gold = vec3(0.83, 0.71, 0.51);
    vec3 pale = vec3(0.95, 0.90, 0.80);

    vec3 col = mix(ink, wine, smoothstep(-0.35, 0.65, f));
    col = mix(col, gold, sheen * 0.42 * (0.55 + 0.45 * r.y));
    col += pale * pow(sheen, 6.0) * 0.1;
    // Metnin durduğu sol-alt bölgeyi karart
    float textShade = smoothstep(0.0, 0.75, uv.x) * 0.55 + 0.45;
    col *= mix(0.55, 1.0, textShade);

    float vig = smoothstep(1.15, 0.25, length(uv - vec2(0.5, 0.45)));
    col *= mix(0.55, 1.0, vig);
    col *= uIntro;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function SilkPlane({ intro }: { intro: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const target = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRes: { value: new THREE.Vector2(1, 1) },
      uIntro: { value: 0 },
    }),
    [],
  );

  useFrame((state, delta) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value = state.clock.elapsedTime;
    u.uRes.value.set(size.width, size.height);
    const px = state.pointer.x * 0.5 + 0.5;
    const py = state.pointer.y * 0.5 + 0.5;
    target.current.set(px, py);
    mouse.current.lerp(target.current, 1 - Math.pow(0.001, delta));
    u.uMouse.value.copy(mouse.current);
    const goal = intro ? 1 : 0;
    u.uIntro.value += (goal - u.uIntro.value) * (1 - Math.pow(0.02, delta));
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} depthWrite={false} />
    </mesh>
  );
}

export default function SilkCanvas({ intro }: { intro: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
      frameloop="always"
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <SilkPlane intro={intro} />
    </Canvas>
  );
}
