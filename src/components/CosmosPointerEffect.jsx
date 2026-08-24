import { useEffect, useRef } from 'react';
import '../styles/cosmos-effect.css';

const MAX_DPR = 1.5;
const DESKTOP_PARTICLES = 56;
const TABLET_PARTICLES = 34;
const MOBILE_PARTICLES = 22;
const DESKTOP_FPS = 28;
const TOUCH_FPS = 14;

export function CosmosPointerEffect() {
  const layerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current;
    const canvas = canvasRef.current;
    if (!layer || !canvas) return undefined;

    const context = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!context) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let animationFrame = 0;
    let lastFrame = 0;
    let running = !document.hidden;

    const pointer = {
      active: false,
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      screenX: 0,
      screenY: 0,
      targetScreenX: 0,
      targetScreenY: 0,
    };

    const particleCount = () => {
      if (window.innerWidth < 700) return MOBILE_PARTICLES;
      if (window.innerWidth < 1181) return TABLET_PARTICLES;
      return DESKTOP_PARTICLES;
    };

    function createParticle(index) {
      const bright = index % 11 === 0;
      return {
        nx: Math.random(),
        ny: Math.random(),
        depth: 0.25 + Math.random() * 0.75,
        radius: bright ? 1 + Math.random() * 0.42 : 0.38 + Math.random() * 0.65,
        alpha: bright ? 0.24 + Math.random() * 0.14 : 0.08 + Math.random() * 0.16,
        driftX: -0.34 + Math.random() * 0.68,
        driftY: -0.22 + Math.random() * 0.44,
        phase: Math.random() * Math.PI * 2,
        speed: 0.7 + Math.random() * 1.1,
        blue: Math.random() > 0.72,
        glint: bright,
      };
    }

    function rebuildParticles() {
      particles = Array.from({ length: particleCount() }, (_, index) => createParticle(index));
    }

    function resize() {
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      pointer.screenX = pointer.targetScreenX = width * 0.5;
      pointer.screenY = pointer.targetScreenY = height * 0.5;
      rebuildParticles();
      draw(performance.now());
    }

    function draw(time) {
      context.clearRect(0, 0, width, height);

      pointer.x += (pointer.targetX - pointer.x) * 0.075;
      pointer.y += (pointer.targetY - pointer.y) * 0.075;
      pointer.screenX += (pointer.targetScreenX - pointer.screenX) * 0.14;
      pointer.screenY += (pointer.targetScreenY - pointer.screenY) * 0.14;

      if (finePointer.matches && pointer.active) {
        const halo = context.createRadialGradient(
          pointer.screenX,
          pointer.screenY,
          0,
          pointer.screenX,
          pointer.screenY,
          230,
        );
        halo.addColorStop(0, 'rgba(58, 154, 255, 0.038)');
        halo.addColorStop(0.34, 'rgba(24, 111, 255, 0.022)');
        halo.addColorStop(1, 'rgba(24, 111, 255, 0)');
        context.fillStyle = halo;
        context.fillRect(pointer.screenX - 230, pointer.screenY - 230, 460, 460);
      }

      const seconds = time * 0.001;
      const travelX = width + 80;
      const travelY = height + 80;

      particles.forEach((particle) => {
        const driftX = seconds * particle.driftX * 5.5;
        const driftY = seconds * particle.driftY * 4.5;
        const baseX = ((particle.nx * width + driftX + 40) % travelX) - 40;
        const baseY = ((particle.ny * height + driftY + 40) % travelY) - 40;
        const parallaxX = pointer.x * particle.depth * 34;
        const parallaxY = pointer.y * particle.depth * 24;
        const x = baseX + parallaxX;
        const y = baseY + parallaxY;

        const distance = pointer.active
          ? Math.hypot(x - pointer.screenX, y - pointer.screenY)
          : Number.POSITIVE_INFINITY;
        const proximity = Math.max(0, 1 - (distance / 230));
        const twinkle = 0.76 + Math.sin((seconds * particle.speed) + particle.phase) * 0.16;
        const alpha = Math.min(0.48, particle.alpha * twinkle * (1 + proximity * 1.45));
        const radius = particle.radius * (1 + proximity * 0.8);

        context.fillStyle = particle.blue
          ? `rgba(86, 174, 255, ${alpha})`
          : `rgba(235, 247, 255, ${alpha})`;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();

        if (particle.glint) {
          context.strokeStyle = `rgba(108, 188, 255, ${alpha * 0.36})`;
          context.lineWidth = 0.65;
          context.beginPath();
          context.moveTo(x - 3.5, y);
          context.lineTo(x + 3.5, y);
          context.moveTo(x, y - 3.5);
          context.lineTo(x, y + 3.5);
          context.stroke();
        }
      });
    }

    function frame(time) {
      if (!running) return;

      const fps = finePointer.matches ? DESKTOP_FPS : TOUCH_FPS;
      const interval = 1000 / fps;
      if (time - lastFrame >= interval) {
        lastFrame = time;
        draw(time);
      }
      animationFrame = window.requestAnimationFrame(frame);
    }

    function start() {
      window.cancelAnimationFrame(animationFrame);
      if (!running || reducedMotion.matches) {
        draw(performance.now());
        return;
      }
      lastFrame = 0;
      animationFrame = window.requestAnimationFrame(frame);
    }

    function handlePointerMove(event) {
      if (!finePointer.matches) return;
      pointer.active = true;
      pointer.targetX = ((event.clientX / width) - 0.5) * 2;
      pointer.targetY = ((event.clientY / height) - 0.5) * 2;
      pointer.targetScreenX = event.clientX;
      pointer.targetScreenY = event.clientY;
      layer.style.setProperty('--cosmos-pointer-x', `${Math.round(event.clientX)}px`);
      layer.style.setProperty('--cosmos-pointer-y', `${Math.round(event.clientY)}px`);
      layer.style.setProperty('--cosmos-shift-x', `${Math.round(pointer.targetX * 18)}px`);
      layer.style.setProperty('--cosmos-shift-y', `${Math.round(pointer.targetY * 14)}px`);
      layer.style.setProperty('--cosmos-far-shift-x', `${Math.round(pointer.targetX * -10)}px`);
      layer.style.setProperty('--cosmos-far-shift-y', `${Math.round(pointer.targetY * -8)}px`);
    }

    function handlePointerLeave() {
      pointer.active = false;
      pointer.targetX = 0;
      pointer.targetY = 0;
      pointer.targetScreenX = width * 0.5;
      pointer.targetScreenY = height * 0.5;
      layer.style.setProperty('--cosmos-shift-x', '0px');
      layer.style.setProperty('--cosmos-shift-y', '0px');
      layer.style.setProperty('--cosmos-far-shift-x', '0px');
      layer.style.setProperty('--cosmos-far-shift-y', '0px');
    }

    function handleVisibility() {
      running = !document.hidden;
      start();
    }

    function handleMotionChange() {
      start();
    }

    resize();
    start();

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    reducedMotion.addEventListener?.('change', handleMotionChange);

    return () => {
      running = false;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
      reducedMotion.removeEventListener?.('change', handleMotionChange);
    };
  }, []);

  return (
    <div className="cosmos-pointer-layer" ref={layerRef} aria-hidden="true">
      <span className="cosmos-pointer-layer__stars cosmos-pointer-layer__stars--near" />
      <span className="cosmos-pointer-layer__stars cosmos-pointer-layer__stars--far" />
      <canvas
        ref={canvasRef}
        className="cosmos-pointer-effect"
        data-cosmos-effect="reactive"
      />
    </div>
  );
}
