"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// Fotoğraf üzerinde: cover-fit, sakin sıvı akış, fare hızına bağlı dalga,
// hafif kromatik sapma, sinematik vinyet ve film greni.
const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform vec2 uRes;
  uniform vec2 uImg;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uVel;
  uniform float uIntro;
  uniform float uPointer;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
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

  vec2 coverUv(vec2 uv) {
    float rs = uRes.x / uRes.y;
    float ri = uImg.x / uImg.y;
    vec2 s = rs < ri ? vec2(rs / ri, 1.0) : vec2(1.0, ri / rs);
    return (uv - 0.5) * s + 0.5;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.12;

    // Sakin sıvı akış
    float n = snoise(uv * 2.5 + t) * 0.6 + snoise(uv * 5.0 - t * 0.6) * 0.4;
    vec2 disp = vec2(n, snoise(uv * 3.0 + 7.0 - t)) * 0.004;

    // Fare dalgası: hıza bağlı, yumuşak düşüş
    vec2 d = uv - uMouse;
    d.x *= uRes.x / uRes.y;
    float dist = length(d);
    float ripple = smoothstep(0.42, 0.0, dist) * uPointer;
    disp += uVel * ripple * 0.35;
    disp += normalize(d + 1e-5) * ripple * length(uVel) * 0.08;

    // Giriş: hafif yakınlaştırmadan açılış
    vec2 cuv = coverUv(uv);
    cuv = (cuv - 0.5) * (1.0 + (1.0 - uIntro) * 0.12) + 0.5;

    float ca = 0.0005 + ripple * 0.0022;
    vec3 col;
    col.r = texture2D(uTex, cuv + disp * (1.0 + ca * 60.0) + vec2(ca, 0.0)).r;
    col.g = texture2D(uTex, cuv + disp).g;
    col.b = texture2D(uTex, cuv + disp * (1.0 - ca * 60.0) - vec2(ca, 0.0)).b;

    // Renk derecelendirme: desatüre, sıcak altın tonlar, derin gölgeler
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, 0.42);
    col = pow(col, vec3(1.12));
    col = mix(col, col * vec3(1.14, 1.0, 0.8), 0.75);
    col = mix(col, luma * vec3(0.98, 0.84, 0.62), 0.18);
    float vig = smoothstep(1.3, 0.3, length((uv - 0.5) * vec2(1.1, 1.0)));
    col *= mix(0.62, 1.0, vig);

    // Film greni
    float g = fract(sin(dot(uv * uRes + mod(uTime, 10.0) * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
    col += (g - 0.5) * 0.045;

    // Giriş: sayfa zemininin sıcak beyazından fotoğrafa geçiş
    col = mix(vec3(0.984, 0.98, 0.968), col, uIntro);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Plane({ src, intro, onReady }: { src: string; intro: boolean; onReady: () => void }) {
  const tex = useLoader(THREE.TextureLoader, src);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const target = useRef(new THREE.Vector2(0.5, 0.5));
  const vel = useRef(new THREE.Vector2(0, 0));
  const last = useRef(new THREE.Vector2(0.5, 0.5));
  const pointerActive = useRef(false);

  // Dalga yalnızca hassas işaretçi (fare) hareket ettiğinde etkinleşir; dokunmatikte kapalı.
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const on = () => {
      pointerActive.current = true;
    };
    window.addEventListener("pointermove", on, { once: true, passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, []);

  useEffect(() => {
    // three.js doku nesnesi yapılandırılır (React state'i değil, GPU kaynağı).
    // eslint-disable-next-line react-hooks/immutability
    tex.colorSpace = THREE.SRGBColorSpace;
     
    tex.minFilter = THREE.LinearFilter;
     
    tex.generateMipmaps = false;
     
    tex.needsUpdate = true;
    onReady();
  }, [tex, onReady]);

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uRes: { value: new THREE.Vector2(1, 1) },
      uImg: { value: new THREE.Vector2(tex.image.width, tex.image.height) },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVel: { value: new THREE.Vector2(0, 0) },
      uIntro: { value: 0 },
      uPointer: { value: 0 },
    }),
    [tex],
  );

  useFrame((state, delta) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value = state.clock.elapsedTime;
    u.uRes.value.set(size.width, size.height);
    target.current.set(state.pointer.x * 0.5 + 0.5, state.pointer.y * 0.5 + 0.5);
    mouse.current.lerp(target.current, 1 - Math.pow(0.0005, delta));
    const v = mouse.current.clone().sub(last.current);
    last.current.copy(mouse.current);
    vel.current.lerp(v, 0.35);
    vel.current.multiplyScalar(Math.pow(0.02, delta));
    u.uMouse.value.copy(mouse.current);
    u.uVel.value.copy(vel.current);
    const goal = intro ? 1 : 0;
    u.uIntro.value += (goal - u.uIntro.value) * (1 - Math.pow(0.05, delta));
    const pGoal = pointerActive.current ? 1 : 0;
    u.uPointer.value += (pGoal - u.uPointer.value) * (1 - Math.pow(0.1, delta));
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} depthWrite={false} />
    </mesh>
  );
}

export default function HeroCanvas({ src, intro, onReady }: { src: string; intro: boolean; onReady: () => void }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <Suspense fallback={null}>
        <Plane src={src} intro={intro} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
