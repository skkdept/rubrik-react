import { useEffect, useRef, type RefObject } from "react";
import { Renderer, Geometry, Program, Mesh, Texture } from "ogl";
import styles from "./HeroSection.module.css";

// WebGL grid-mesh press effect, adapted from reactbits' "Elastic Mesh"
// (https://reactbits.dev/animations/elastic-mesh — MIT-style usage, ogl
// runtime). The original renders an opaque gradient/image card; here the
// visible pattern is the *exact same drawing* as the existing static CSS
// grid (see buildGridPatternData below — same hairline + crosshair-tick
// shapes, same relative proportions), rasterized once to a small repeating
// texture rather than hand-approximated with shader math. Trying to
// reconstruct "faint hairline + bolder crosshair" purely from smoothstep
// distance fields took several rounds of guessing opacities and still
// didn't match; sampling the identical shapes guarantees it does. Pressure
// only brightens/tints toward the accent color and bends the mesh — same
// lattice, not a different one. Tilt is 0 (no perspective skew) so the flat
// grid stays pixel-aligned with the real DOM layout; depth comes entirely
// from the physical dent + lighting.
const DIST = 4.6;
const TILE_PX = 61; // must match HeroSection.module.css's old .backgroundGrid tile size
// Power-of-two (required for REPEAT wrapping on WebGL1). Higher than the
// tile's own ~61px so thin strokes (down to ~1px at real scale) are still
// represented by several texture pixels — at a coarser resolution, mip
// minification loses most of a thin line's intensity depending on exactly
// where it falls between texels (confirmed by measuring: thinning a stroke
// at 64px resolution silently cut its rendered contrast far more than the
// geometric width change alone should).
const TEXTURE_SIZE = 256;
const TEXTURE_SCALE = TEXTURE_SIZE / TILE_PX;

// The texture only encodes SHAPE, as two clean binary (0 or 255) channels —
// red = "is this pixel part of the bolder tick", alpha = "is this pixel ink
// at all" (hairline or tick). How opaque each shape actually renders is
// entirely up to the shader's uHairlineOpacity/uTickOpacity uniforms. An
// earlier version tried to bake both the shape AND its opacity into a
// single alpha channel via layered fillRect() draws — those composite
// where the hairline and tick overlap (exactly at their shared center),
// stacking to a much higher combined alpha than either value alone, which
// made the two opacities impossible to reason about independently.
//
// Built as a raw Uint8Array, not a <canvas>+putImageData — a 2D canvas is
// frequently GPU-accelerated, and handing an accelerated canvas to
// texImage2D can force the browser to read the GPU-rendered content back to
// upload it as a WebGL texture ("GPU stall due to ReadPixels", visible as
// real jank around the Hero on first mount). ogl's Texture accepts a plain
// TypedArray directly, skipping that path entirely.
function buildGridPatternData(): Uint8Array {
  const data = new Uint8Array(TEXTURE_SIZE * TEXTURE_SIZE * 4);

  // Both shapes are centered on the SAME point (the tile's middle) — the
  // original CSS positions its hairline gradients at a 30.5px offset
  // specifically so their crossings land exactly on the crosshair tile's
  // centers rather than its corners (per the source comment in
  // HeroSection.module.css).
  const c = TEXTURE_SIZE / 2;
  const hairlineHalf = (1.5 * TEXTURE_SCALE) / 2;
  const armHalf = (12 * TEXTURE_SCALE) / 2;
  const armThickHalf = (1.4 * TEXTURE_SCALE) / 2;

  for (let y = 0; y < TEXTURE_SIZE; y++) {
    for (let x = 0; x < TEXTURE_SIZE; x++) {
      const onHairline = Math.abs(x - c) <= hairlineHalf || Math.abs(y - c) <= hairlineHalf;
      const onTick =
        (Math.abs(y - c) <= armThickHalf && Math.abs(x - c) <= armHalf) ||
        (Math.abs(x - c) <= armThickHalf && Math.abs(y - c) <= armHalf);

      const idx = (y * TEXTURE_SIZE + x) * 4;
      data[idx] = onTick ? 255 : 0; // R: isTick
      data[idx + 1] = 0;
      data[idx + 2] = 0;
      data[idx + 3] = onTick || onHairline ? 255 : 0; // A: isInk
    }
  }

  return data;
}

const VERT = `
precision highp float;
attribute vec2 aGrid;
attribute vec2 uv;
attribute vec3 aOffset;
attribute vec3 aNormal;

uniform float uAspect;
uniform float uDist;

varying vec2 vUv;
varying vec3 vNormal;
varying float vDepth;

void main() {
  vUv = uv;

  vec2 base = vec2((aGrid.x * 2.0 - 1.0) * uAspect, 1.0 - aGrid.y * 2.0);
  vec3 p = vec3(base + aOffset.xy, aOffset.z);

  float persp = uDist / (uDist - p.z);
  vec2 clip = vec2(p.x / uAspect, p.y) * persp;

  vNormal = aNormal;
  vDepth = aOffset.z;
  gl_Position = vec4(clip, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

varying vec2 vUv;
varying vec3 vNormal;
varying float vDepth;

uniform sampler2D tPattern;
uniform vec3 uRestColor;
uniform float uHairlineOpacity;
uniform float uTickOpacity;
uniform vec3 uPressColor;
uniform vec3 uHighlight;
uniform float uShading;
uniform vec2 uRes;
uniform float uTilePx;

void main() {
  vec3 N = normalize(vNormal);
  vec3 L = normalize(vec3(-0.35, 0.55, 0.78));
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 H = normalize(L + V);

  float diff = clamp(dot(N, L), 0.0, 1.0);
  float specRaw = pow(clamp(dot(N, H), 0.0, 1.0), 26.0);
  float specFlat = pow(clamp(H.z, 0.0, 1.0), 26.0);
  float spec = clamp((specRaw - specFlat) / (1.0 - specFlat), 0.0, 1.0);
  float ao = clamp(1.0 + vDepth * 0.45, 0.65, 1.25);

  // Same 61px pitch as the static grid this replaces (see
  // HeroSection.module.css's old .backgroundGrid comment). Sampling the
  // REPEAT-wrapped pattern texture directly in real pixels keeps tiles
  // perfectly square regardless of the container's aspect ratio.
  vec2 patternUv = (vUv * uRes) / uTilePx;
  vec4 tex = texture2D(tPattern, patternUv);
  float coverage = tex.a;
  float isTick = tex.r;
  float restOpacity = mix(uHairlineOpacity, uTickOpacity, isTick);

  // How far this point has actually been pushed — 0 across the resting
  // (flat) grid, ramping up only where the surface is genuinely dented.
  float presence = clamp(abs(vDepth) * 8.0, 0.0, 1.0);

  vec3 color = mix(uRestColor, uPressColor, presence) * mix(1.0, ao, presence);
  color += uHighlight * spec * uShading * presence;

  float alpha = coverage * mix(restOpacity, 1.0, presence * 0.9);
  if (alpha <= 0.003) discard;

  gl_FragColor = vec4(color, alpha);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const REST_COLOR = hexToRgb("#12201f"); // matches the old static grid's ink color
const PRESS_COLOR = hexToRgb("#e0f8f6"); // --primitive-color-teal-primary, lightened ~88% toward white
const HIGHLIGHT_COLOR = hexToRgb("#ffffff");

// Rendered whenever HeroSection has already confirmed reduced-motion is
// off — see the `pressGridActive` check there. This component assumes it's
// clear to run, on both mouse/trackpad and touch.
export function PressGrid({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    let disposed = false;
    let cleanupGl: (() => void) | undefined;

    // Deferred so WebGL context creation / shader compilation never
    // competes with the Hero's own critical first paint (LCP text/image).
    const hasIdleCallback = typeof window.requestIdleCallback === "function";
    const idle: (cb: () => void) => number = hasIdleCallback
      ? (cb) => window.requestIdleCallback(cb)
      : (cb) => window.setTimeout(cb, 200);
    const cancelIdle: (id: number) => void = hasIdleCallback
      ? (id) => window.cancelIdleCallback(id)
      : (id) => window.clearTimeout(id);

    const idleId = idle(() => {
      if (disposed) return;
      cleanupGl = setup(container, section);
    });

    return () => {
      disposed = true;
      cancelIdle(idleId);
      cleanupGl?.();
    };
  }, [sectionRef]);

  return <div ref={containerRef} className={styles.pressGrid} aria-hidden="true" />;
}

function setup(container: HTMLDivElement, section: HTMLElement) {
  let renderer: Renderer;
  try {
    renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) });
  } catch {
    return undefined; // WebGL unavailable — leave the static CSS grid as-is.
  }
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // Declared up front so resize() (called once synchronously below, before
  // scheduleFrame/frame are defined further down) can safely call
  // scheduleFrame() too — function declarations hoist fully, but these
  // `let`s would still be in their temporal dead zone if left at their
  // point of use.
  let raf = 0;
  let running = false;
  const STEP = 1 / 120;
  const MAX_SUB = 5;
  let accTime = 0;
  let last = performance.now();

  const N = 32;
  const nodeCount = N * N;

  const aGrid = new Float32Array(nodeCount * 2);
  const uv = new Float32Array(nodeCount * 2);
  const aOffset = new Float32Array(nodeCount * 3);
  const aNormal = new Float32Array(nodeCount * 3);

  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const idx = j * N + i;
      const u = i / (N - 1);
      const v = j / (N - 1);
      aGrid[idx * 2] = u;
      aGrid[idx * 2 + 1] = v;
      uv[idx * 2] = u;
      uv[idx * 2 + 1] = v;
      aNormal[idx * 3 + 2] = 1;
    }
  }

  const quads = (N - 1) * (N - 1);
  const index = new Uint16Array(quads * 6);
  let t = 0;
  for (let j = 0; j < N - 1; j++) {
    for (let i = 0; i < N - 1; i++) {
      const a = j * N + i;
      const b = a + 1;
      const c = a + N;
      const d = c + 1;
      index[t++] = a;
      index[t++] = c;
      index[t++] = b;
      index[t++] = b;
      index[t++] = c;
      index[t++] = d;
    }
  }

  const geometry = new Geometry(gl, {
    aGrid: { size: 2, data: aGrid },
    uv: { size: 2, data: uv },
    aOffset: { size: 3, data: aOffset },
    aNormal: { size: 3, data: aNormal },
    index: { data: index },
  });

  const patternTexture = new Texture(gl, {
    image: buildGridPatternData(),
    width: TEXTURE_SIZE,
    height: TEXTURE_SIZE,
    wrapS: gl.REPEAT,
    wrapT: gl.REPEAT,
    // Mipmapping matters here: the texture's hairline/tick shapes are only
    // 1-2px wide, and the tile is displayed close to 1:1 with screen
    // pixels — without prefiltered mip levels, LINEAR minification can
    // sample between a thin feature's texels and lose most of its
    // intensity (confirmed by measuring rendered contrast at nominal
    // alpha=1: actual measured depth was ~5-10x fainter than a fully
    // opaque line should produce).
    generateMipmaps: true,
    minFilter: gl.LINEAR_MIPMAP_LINEAR,
    magFilter: gl.LINEAR,
  });

  const program = new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    transparent: true,
    cullFace: false,
    uniforms: {
      tPattern: { value: patternTexture },
      uRestColor: { value: REST_COLOR },
      uHairlineOpacity: { value: 0.278 },
      uTickOpacity: { value: 0.432 },
      uPressColor: { value: PRESS_COLOR },
      uHighlight: { value: HIGHLIGHT_COLOR },
      uShading: { value: 0.9 },
      uRes: { value: [1, 1] },
      uTilePx: { value: TILE_PX },
      uAspect: { value: 1 },
      uDist: { value: DIST },
    },
  });

  const mesh = new Mesh(gl, { geometry, program });

  const baseX = new Float32Array(nodeCount);
  const baseY = new Float32Array(nodeCount);
  const pos = new Float32Array(nodeCount * 3);
  const vel = new Float32Array(nodeCount * 3);
  const accel = new Float32Array(nodeCount * 3);

  let aspect = 1;
  function refreshBase() {
    for (let idx = 0; idx < nodeCount; idx++) {
      baseX[idx] = (aGrid[idx * 2] * 2 - 1) * aspect;
      baseY[idx] = 1 - aGrid[idx * 2 + 1] * 2;
    }
  }

  function resize() {
    const w = container.offsetWidth || 1;
    const h = container.offsetHeight || 1;
    renderer.setSize(w, h);
    aspect = w / h;
    program.uniforms.uAspect.value = aspect;
    program.uniforms.uRes.value = [w, h];
    refreshBase();
    scheduleFrame(); // repaint at the new size even if the loop had settled/stopped
  }

  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false, targetActive: false };

  function toPlane(clientX: number, clientY: number) {
    const rect = container.getBoundingClientRect();
    const mx = (clientX - rect.left) / rect.width;
    const my = (clientY - rect.top) / rect.height;
    pointer.tx = (mx * 2 - 1) * aspect;
    pointer.ty = 1 - my * 2;
  }

  const GRAB_RADIUS = 0.55;
  const PULL = 0.4;
  const STIFFNESS = 0.05;
  const DAMPING = 0.22;
  const COUPLING = 0.22;

  function onMove(e: PointerEvent) {
    toPlane(e.clientX, e.clientY);
    pointer.targetActive = true;
    scheduleFrame();
  }
  function onLeave() {
    pointer.targetActive = false;
  }
  // Touch-only: a touch pointer has no hover state, so a mouse's
  // `pointerleave` (bound below) never fires for it — `pointermove` only
  // ever fires for touch while a finger is down and dragging, per the
  // Pointer Events spec, so the press needs to release explicitly on lift
  // or an interrupted touch (e.g. an incoming call, or the OS treating it
  // as a scroll/gesture instead). Scoped to non-mouse pointers specifically
  // — a first version released on every `pointerup` regardless of type,
  // which meant every mouse click also sprang the grid back even though the
  // cursor was still sitting right there hovering; the very next tiny mouse
  // move re-pressed it, so a few clicks in the same spot pressed and
  // released in rapid succession and visibly "vibrated" instead of holding
  // one smooth press for as long as the mouse stayed put.
  function onTouchRelease(e: PointerEvent) {
    if (e.pointerType === "mouse") return;
    pointer.targetActive = false;
  }

  section.addEventListener("pointermove", onMove);
  section.addEventListener("pointerleave", onLeave);
  section.addEventListener("pointerup", onTouchRelease);
  section.addEventListener("pointercancel", onTouchRelease);

  function substep() {
    const active = pointer.active;
    const r = GRAB_RADIUS * 1.4;
    const invR = 1 / r;
    const force = PULL * 0.009;

    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const idx = j * N + i;
        const o3 = idx * 3;
        const ox = pos[o3];
        const oy = pos[o3 + 1];
        const oz = pos[o3 + 2];

        let ax = -STIFFNESS * ox;
        let ay = -STIFFNESS * oy;
        let az = -STIFFNESS * oz;

        let sumx = 0,
          sumy = 0,
          sumz = 0,
          cnt = 0;
        if (i > 0) {
          const n = (idx - 1) * 3;
          sumx += pos[n];
          sumy += pos[n + 1];
          sumz += pos[n + 2];
          cnt++;
        }
        if (i < N - 1) {
          const n = (idx + 1) * 3;
          sumx += pos[n];
          sumy += pos[n + 1];
          sumz += pos[n + 2];
          cnt++;
        }
        if (j > 0) {
          const n = (idx - N) * 3;
          sumx += pos[n];
          sumy += pos[n + 1];
          sumz += pos[n + 2];
          cnt++;
        }
        if (j < N - 1) {
          const n = (idx + N) * 3;
          sumx += pos[n];
          sumy += pos[n + 1];
          sumz += pos[n + 2];
          cnt++;
        }
        ax += COUPLING * (sumx - cnt * ox);
        ay += COUPLING * (sumy - cnt * oy);
        az += COUPLING * (sumz - cnt * oz);

        if (active) {
          const dx = pointer.x - (baseX[idx] + ox);
          const dy = pointer.y - (baseY[idx] + oy);
          const d = Math.sqrt(dx * dx + dy * dy);
          const tnorm = d * invR;
          if (tnorm < 1) {
            const zBump = 1 - tnorm * tnorm;
            // Negative: dents INTO the screen (pressed), not bulges toward
            // the viewer.
            az -= force * zBump * zBump * 6.0;
            if (d > 1e-4) {
              const pinch = tnorm * (1 - tnorm) * (1 - tnorm) * 6.75;
              const dir = (force * pinch * 1.6) / d;
              ax += dx * dir;
              ay += dy * dir;
            }
          }
        }

        accel[o3] = ax;
        accel[o3 + 1] = ay;
        accel[o3 + 2] = az;
      }
    }

    const retain = 1 - DAMPING;
    for (let k = 0; k < nodeCount; k++) {
      const o3 = k * 3;
      const nvx = (vel[o3] + accel[o3]) * retain;
      const nvy = (vel[o3 + 1] + accel[o3 + 1]) * retain;
      const nvz = (vel[o3 + 2] + accel[o3 + 2]) * retain;
      vel[o3] = nvx;
      vel[o3 + 1] = nvy;
      vel[o3 + 2] = nvz;
      pos[o3] = Math.min(1.2, Math.max(-1.2, pos[o3] + nvx));
      pos[o3 + 1] = Math.min(1.2, Math.max(-1.2, pos[o3 + 1] + nvy));
      pos[o3 + 2] = Math.min(1.2, Math.max(-1.2, pos[o3 + 2] + nvz));
    }
  }

  function commit() {
    let maxVel = 0;
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const idx = j * N + i;
        const o3 = idx * 3;
        const iL = i > 0 ? idx - 1 : idx;
        const iR = i < N - 1 ? idx + 1 : idx;
        const iD = j > 0 ? idx - N : idx;
        const iU = j < N - 1 ? idx + N : idx;

        const lx = baseX[iL] + pos[iL * 3];
        const ly = baseY[iL] + pos[iL * 3 + 1];
        const lz = pos[iL * 3 + 2];
        const rx = baseX[iR] + pos[iR * 3];
        const ry = baseY[iR] + pos[iR * 3 + 1];
        const rz = pos[iR * 3 + 2];
        const dx = baseX[iD] + pos[iD * 3];
        const dy = baseY[iD] + pos[iD * 3 + 1];
        const dz = pos[iD * 3 + 2];
        const ux = baseX[iU] + pos[iU * 3];
        const uy = baseY[iU] + pos[iU * 3 + 1];
        const uz = pos[iU * 3 + 2];

        const txx = rx - lx,
          txy = ry - ly,
          txz = rz - lz;
        const tyx = ux - dx,
          tyy = uy - dy,
          tyz = uz - dz;

        let nx = txy * tyz - txz * tyy;
        let ny = txz * tyx - txx * tyz;
        let nz = txx * tyy - txy * tyx;
        if (nz < 0) {
          nx = -nx;
          ny = -ny;
          nz = -nz;
        }
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
        aNormal[o3] = nx / len;
        aNormal[o3 + 1] = ny / len;
        aNormal[o3 + 2] = nz / len;

        aOffset[o3] = pos[o3];
        aOffset[o3 + 1] = pos[o3 + 1];
        aOffset[o3 + 2] = pos[o3 + 2];

        const vm = Math.abs(vel[o3]) + Math.abs(vel[o3 + 1]) + Math.abs(vel[o3 + 2]);
        if (vm > maxVel) maxVel = vm;
      }
    }
    geometry.attributes.aOffset.needsUpdate = true;
    geometry.attributes.aNormal.needsUpdate = true;
    return maxVel;
  }

  // Runs continuously only while something is actually moving. A
  // WebGL render+physics loop that never stops (the reactbits original
  // always runs, since its demo card is meant to keep wobbling) is real,
  // sustained GPU/CPU cost sitting right under the Nav for the entire time
  // the Hero is mounted — worth avoiding even though it wasn't reproducible
  // as visible jank here. Stops once the mesh has settled AND the pointer
  // isn't active; scheduleFrame() wakes it back up on the next interaction
  // or resize.
  const SETTLE_VELOCITY = 0.0002;

  function scheduleFrame() {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function frame(now: number) {
    let dt = (now - last) / 1000;
    last = now;
    if (dt > 0.25) dt = 0.25;

    const tau = 0.06;
    const kLerp = 1 - Math.exp(-Math.max(dt, 1e-4) / tau);
    pointer.x += (pointer.tx - pointer.x) * kLerp;
    pointer.y += (pointer.ty - pointer.y) * kLerp;
    pointer.active = pointer.targetActive;

    accTime += dt;
    let sub = 0;
    while (accTime >= STEP && sub < MAX_SUB) {
      substep();
      accTime -= STEP;
      sub++;
    }
    if (accTime > STEP) accTime = 0;

    const maxVel = commit();
    renderer.render({ scene: mesh });

    const pointerSettled = Math.abs(pointer.x - pointer.tx) < 0.001 && Math.abs(pointer.y - pointer.ty) < 0.001;
    if (!pointer.active && maxVel < SETTLE_VELOCITY && pointerSettled) {
      running = false;
    } else {
      raf = requestAnimationFrame(frame);
    }
  }
  scheduleFrame(); // initial paint of the resting grid

  container.appendChild(gl.canvas);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    section.removeEventListener("pointermove", onMove);
    section.removeEventListener("pointerleave", onLeave);
    section.removeEventListener("pointerup", onTouchRelease);
    section.removeEventListener("pointercancel", onTouchRelease);
    if (gl.canvas.parentElement === container) container.removeChild(gl.canvas);
    const lose = gl.getExtension("WEBGL_lose_context");
    if (lose) lose.loseContext();
  };
}
