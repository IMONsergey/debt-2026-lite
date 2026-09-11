import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { heroPlanetDataUrl } from '../assets/hero-planet/index.js';

const MAX_DPR = 2;

const VERT_SRC = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG_SRC = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform vec3 uBg, uBase, uAccent, uHigh;
uniform float uRays, uContrast, uSweep, uFall, uAper, uDirection;

const float PI = 3.14159265;
const float TAU = 6.28318531;

float sat(float x){ return clamp(x, 0.0, 1.0); }
float pw(float x, float e){ return pow(max(x, 1e-5), e); }
float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 34.56); return fract(p.x * p.y); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i), b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0)), d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm3(vec2 p){
  float s = 0.0, a = 0.5;
  for(int i = 0; i < 3; i++){
    s += a * vnoise(p);
    p = p * 2.07 + vec2(4.1, 2.3);
    a *= 0.5;
  }
  return s;
}

void main(){
  float ar = uRes.x / max(uRes.y, 1.0);
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (uv - 0.5) * vec2(ar, 1.0);
  float t = uTime * 0.07;

  float dcs = cos(uDirection), dsn = sin(uDirection);
  mat2 drot = mat2(dcs, -dsn, dsn, dcs);
  p = drot * p;
  vec2 src = vec2(0.0, -0.78);
  vec2 d = p - src;
  float r = max(length(d), 1e-3);
  float th = atan(d.x, d.y);

  vec2 mp = drot * ((uMouse - 0.5) * vec2(ar, 1.0));
  vec2 md = mp - src;
  float mr = max(length(md), 1e-3);
  float mth = atan(md.x, md.y);
  float ang = abs(mod(th - mth + PI, TAU) - PI);
  float aw = max(uAper, 0.02);
  float h = sat(uHover);
  float swell = 1.0 + 0.55 * exp(-pw(abs(r - mr) / 0.40, 2.0));
  float open = h * exp(-pw(ang / aw, 2.0)) * swell;
  float close = h * smoothstep(aw, aw + 0.30, ang);

  float v = fbm3(vec2(th * uRays, r * 0.9 - t * 2.4));
  v += 0.50 * vnoise(vec2(th * uRays * 2.4 + 3.0, r * 1.8 - t * 3.6));
  v = pw(sat(v * 1.10 - 0.31), uContrast);
  v = mix(v, smoothstep(0.08, 0.50, v), 0.60 * sat(open));

  float env = exp(-pw(max(r - 0.30, 0.0) * uFall, 1.5));
  float aen = exp(-pw(abs(th) / max(uSweep, 0.05), 2.0));
  float body = v * env * aen * (1.0 + 0.90 * open) * (1.0 - 0.55 * close);
  float bloom = exp(-pw(max(r - 0.18, 0.0) * uFall * 1.30, 1.7)) * aen * (1.0 + 0.25 * open);

  vec3 col = uBg;
  col += uBase * bloom * 0.90;
  col += mix(uBase, uAccent, sat(body * 1.6)) * body * 2.4;
  col += uHigh * pw(sat(body - 0.38), 2.0) * 1.10;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Hero RayColumn shader:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function hexColor(value, fallback) {
  const hex = String(value || '').replace('#', '');
  if (hex.length !== 6) return fallback;
  const rgb = [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
  return rgb.every(Number.isFinite) ? rgb : fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function RayColumn() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false });
    if (!gl) return undefined;

    const vertexShader = compile(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fragmentShader = compile(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vertexShader || !fragmentShader) return undefined;

    const program = gl.createProgram();
    if (!program) return undefined;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Hero RayColumn link:', gl.getProgramInfoLog(program));
      return undefined;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const positionLocation = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const locations = new Map();
    const uniform = (name) => {
      if (!locations.has(name)) locations.set(name, gl.getUniformLocation(program, name));
      return locations.get(name);
    };

    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, on: 0, target: 0 };
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let last = performance.now();
    let clock = 0;

    const trackPointer = (event) => {
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!inside || rect.width <= 0 || rect.height <= 0) {
        pointer.target = 0;
        return;
      }
      pointer.tx = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      pointer.ty = clamp((event.clientY - rect.top) / rect.height, 0, 1);
      pointer.target = reduceMotion ? 0 : 1;
    };

    const resetPointer = () => { pointer.target = 0; };

    const render = (now) => {
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduceMotion) clock = (clock + delta * 0.48) % 3600;

      const easing = 1 - Math.exp(-6 * delta);
      pointer.on += (pointer.target - pointer.on) * easing;
      pointer.x += ((pointer.target > 0 ? pointer.tx : 0.5) - pointer.x) * easing;
      pointer.y += ((pointer.target > 0 ? pointer.ty : 0.5) - pointer.y) * easing;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);

      gl.uniform2f(uniform('uRes'), width, height);
      gl.uniform1f(uniform('uTime'), clock);
      gl.uniform2f(uniform('uMouse'), pointer.x, 1 - pointer.y);
      gl.uniform1f(uniform('uHover'), Math.min(1, pointer.on) * 0.63);

      const background = hexColor('#000206', [0, 0.008, 0.024]);
      const base = hexColor('#3D00FF', [0.239, 0, 1]);
      const accent = hexColor('#6EABF5', [0.431, 0.671, 0.961]);
      const highlight = hexColor('#CFE4FF', [0.812, 0.894, 1]);
      gl.uniform3f(uniform('uBg'), ...background);
      gl.uniform3f(uniform('uBase'), ...base);
      gl.uniform3f(uniform('uAccent'), ...accent);
      gl.uniform3f(uniform('uHigh'), ...highlight);
      gl.uniform1f(uniform('uRays'), 3.6);
      gl.uniform1f(uniform('uContrast'), 1.5);
      gl.uniform1f(uniform('uSweep'), 0.78);
      gl.uniform1f(uniform('uFall'), 1.5);
      gl.uniform1f(uniform('uAper'), 0.16);
      gl.uniform1f(uniform('uDirection'), 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      frame = requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', trackPointer, { passive: true });
    window.addEventListener('pointerleave', resetPointer);
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', trackPointer);
      window.removeEventListener('pointerleave', resetPointer);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return <canvas className="hero-experiment-rays" ref={canvasRef} />;
}

export function HeroRayColumnPortal() {
  const [hero, setHero] = useState(null);

  useEffect(() => {
    const attach = () => {
      const nextHero = document.querySelector('.hero-placeholder');
      if (nextHero) setHero(nextHero);
      return Boolean(nextHero);
    };

    if (attach()) return undefined;
    const observer = new MutationObserver(() => {
      if (attach()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  if (!hero) return null;

  return createPortal(
    <div className="hero-experiment-background" aria-hidden="true">
      <RayColumn />
      <img className="hero-experiment-planet" src={heroPlanetDataUrl} alt="" />
    </div>,
    hero,
  );
}
