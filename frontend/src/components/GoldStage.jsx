import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { prefersReducedMotion } from '../hooks'

/* Soft radial sprite used by every particle */
function useSpriteTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const g = c.getContext('2d')
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32)
    gr.addColorStop(0, 'rgba(255,255,240,1)')
    gr.addColorStop(0.22, 'rgba(255,215,140,.85)')
    gr.addColorStop(0.55, 'rgba(255,150,40,.25)')
    gr.addColorStop(1, 'rgba(255,120,20,0)')
    g.fillStyle = gr
    g.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(c)
  }, [])
}

const PALETTE = ['#FFF1C9', '#FFD978', '#F5B52E', '#FF8A1F', '#C77A12'].map(c => new THREE.Color(c))
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5

/** Brush-stroke ring of gold particles that assembles on load. */
function Ring({ texture, reduce }) {
  const groupRef = useRef()
  const pointsRef = useRef()
  const matRef = useRef()
  const { size } = useThree()
  const small = size.width < 700
  const N = small ? 3500 : 7500

  const { positions, from, to, colors, delay } = useMemo(() => {
    const positions = new Float32Array(N * 3)
    const from = new Float32Array(N * 3)
    const to = new Float32Array(N * 3)
    const colors = new Float32Array(N * 3)
    const delay = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      const th = Math.random() * Math.PI * 2
      const spray = 0
      const r = 3.45 + gauss() * 0.09
      to[i * 3 + 2] = gauss() * 0.06

      // start: further out and a turn and a half "behind" on the same circle path
      from[i * 3] = th + Math.PI * (2.2 + Math.random() * 0.8)   // start angle
      from[i * 3 + 1] = r * (2.4 + Math.random() * 1.2)         // start radius
      from[i * 3 + 2] = -3 - Math.random() * 4                   // start depth
      to[i * 3 + 0] = th; to[i * 3 + 1] = r; to[i * 3 + 2] = to[i * 3 + 2]

      const c = PALETTE[Math.min(4, Math.floor(Math.pow(Math.random(), 1.4) * 5))]
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b
      delay[i] = (th / (Math.PI * 2)) * 0.6 + Math.random() * 0.4
    }
    // place every particle at its starting point (polar -> cartesian)
    for (let i = 0; i < N; i++) {
      const j = i * 3
      const a = reduce ? to[j] : from[j], rr = reduce ? to[j + 1] : from[j + 1]
      positions[j] = Math.cos(a) * rr
      positions[j + 1] = Math.sin(a) * rr
      positions[j + 2] = reduce ? to[j + 2] : from[j + 2]
    }
    return { positions, from, to, colors, delay }
  }, [N, reduce])

  const state = useRef({ t0: performance.now(), converged: reduce })
  const ease = t => 1 - Math.pow(1 - t, 3)

  useFrame(() => {
    const group = groupRef.current
    const pts = pointsRef.current
    if (!group || !pts) return

    if (!state.current.converged) {
      const t = (performance.now() - state.current.t0) / 3200
      const arr = pts.geometry.attributes.position.array
      for (let i = 0; i < N; i++) {
        const k = ease(Math.min(1, Math.max(0, (t - delay[i] * 0.45) / 0.55)))
        const j = i * 3
        const a = from[j] + (to[j] - from[j]) * k            // angle sweeps round the circle
        const rr = from[j + 1] + (to[j + 1] - from[j + 1]) * k // radius spirals in
        arr[j] = Math.cos(a) * rr
        arr[j + 1] = Math.sin(a) * rr
        arr[j + 2] = from[j + 2] + (to[j + 2] - from[j + 2]) * k
      }
      pts.geometry.attributes.position.needsUpdate = true
      if (t > 1.5) state.current.converged = true
    }

    pts.rotation.z -= 0.0016 * (reduce ? 0.15 : 1)

    group.rotation.x = 0
    group.position.y = -0.2
    group.scale.setScalar(Math.min(1.05, (size.width / size.height) * 1.15))
  })

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={N} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={N} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          ref={matRef}
          size={0.075}
          map={texture}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <OuterSparkle reduce={reduce} small={small} />
    </group>
  )
}

/** Gold dust drifting upward behind everything. */
function Dust({ texture, reduce }) {
  const ref = useRef()
  const { size } = useThree()
  const D = size.width < 700 ? 700 : 1600

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(D * 3)
    const speeds = new Float32Array(D)
    for (let i = 0; i < D; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2
      speeds[i] = 0.002 + Math.random() * 0.008
    }
    return { positions, speeds }
  }, [D])

  useFrame(() => {
    const pts = ref.current
    if (!pts) return
    const arr = pts.geometry.attributes.position.array
    const speed = reduce ? 0.15 : 1
    for (let i = 0; i < D; i++) {
      arr[i * 3 + 1] += speeds[i] * speed
      if (arr[i * 3 + 1] > 7) arr[i * 3 + 1] = -7
    }
    pts.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={D} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        map={texture}
        color="#FFB84A"
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/** Camera drifts toward the pointer — same maths as the HTML version. */
function CameraRig() {
  const m = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = e => { m.current.x = e.clientX / innerWidth - 0.5; m.current.y = e.clientY / innerHeight - 0.5 }
    addEventListener('pointermove', onMove, { passive: true })
    return () => removeEventListener('pointermove', onMove)
  }, [])
  useFrame(({ camera }) => {
    camera.position.x += (m.current.x * 1.2 - camera.position.x) * 0.04
    camera.position.y += (-m.current.y * 0.8 - camera.position.y) * 0.04
  })
  return null
}

export default function GoldStage() {
  const reduce = prefersReducedMotion()
  return (
    <Canvas
      id="stage"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none', mixBlendMode: 'screen' }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 50, position: [0, 0, 9], near: 0.1, far: 100 }}
    >
      <StageContents reduce={reduce} />
    </Canvas>
  )
}


/* ---------- Outer sparkle: twinkling gold motes orbiting just outside the ring,
   embers drifting outward, and a few star glints. Runs in one shader for smoothness. */
const sparkleVert = `
  uniform float uTime; uniform float uFade; uniform float uPx;
  attribute float aAngle; attribute float aRadius; attribute float aSpeed;
  attribute float aPhase; attribute float aSize; attribute float aDrift; attribute float aTw;
  varying float vAlpha;
  void main(){
    float t = uTime;
    float life = fract(t * aDrift + aPhase);                 // ember life 0..1
    float r = aRadius + sin(t * .7 + aPhase * 6.283) * .05 + life * aDrift * 9.0;
    float a = aAngle + t * aSpeed;
    vec3 p = vec3(cos(a) * r, sin(a) * r, sin(a * 3. + aPhase * 6.283) * .15);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float tw = .25 + .75 * pow(.5 + .5 * sin(t * aTw + aPhase * 6.283), 3.0);
    float fadeLife = aDrift > 0.0 ? smoothstep(0., .15, life) * (1. - smoothstep(.55, 1., life)) : 1.0;
    vAlpha = tw * fadeLife * uFade;
    gl_PointSize = aSize * uPx * (27.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }`
const sparkleFrag = `
  uniform sampler2D uTex; uniform vec3 uColor;
  varying float vAlpha;
  void main(){
    vec4 c = texture2D(uTex, gl_PointCoord);
    gl_FragColor = vec4(uColor * c.rgb, c.a * vAlpha);
  }`

function starTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64
  const g = c.getContext('2d')
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 10)
  r.addColorStop(0, 'rgba(255,255,245,1)'); r.addColorStop(1, 'rgba(255,200,110,0)')
  g.fillStyle = r; g.fillRect(0, 0, 64, 64)
  g.globalCompositeOperation = 'lighter'
  const ray = (w, h) => {
    const lg = g.createLinearGradient(32 - w / 2, 0, 32 + w / 2, 0)
    lg.addColorStop(0, 'rgba(255,210,120,0)'); lg.addColorStop(.5, 'rgba(255,250,225,.95)'); lg.addColorStop(1, 'rgba(255,210,120,0)')
    g.fillStyle = lg; g.fillRect(32 - w / 2, 32 - h / 2, w, h)
  }
  ray(64, 2.2); g.save(); g.translate(32, 32); g.rotate(Math.PI / 2); g.translate(-32, -32); ray(64, 2.2); g.restore()
  return new THREE.CanvasTexture(c)
}
function dotTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64
  const g = c.getContext('2d')
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  r.addColorStop(0, 'rgba(255,255,240,1)'); r.addColorStop(.25, 'rgba(255,220,150,.8)'); r.addColorStop(.6, 'rgba(255,160,50,.2)'); r.addColorStop(1, 'rgba(255,120,20,0)')
  g.fillStyle = r; g.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

function SparkleLayer({ count, build, tex, color, reduce }) {
  const mat = useRef()
  const { gl } = useThree()
  const attrs = useMemo(() => {
    const A = { aAngle: [], aRadius: [], aSpeed: [], aPhase: [], aSize: [], aDrift: [], aTw: [] }
    for (let i = 0; i < count; i++) { const v = build(i); for (const k in A) A[k].push(v[k]) }
    const out = {}; for (const k in A) out[k] = new Float32Array(A[k])
    return out
  }, [count, build])
  const positions = useMemo(() => new Float32Array(count * 3), [count])
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uFade: { value: reduce ? 1 : 0 }, uPx: { value: gl.getPixelRatio() },
    uTex: { value: tex }, uColor: { value: new THREE.Color(color) },
  }), [tex, color, reduce, gl])
  const t0 = useRef(performance.now())
  useFrame(() => {
    if (!mat.current) return
    const t = (performance.now() - t0.current) / 1000
    mat.current.uniforms.uTime.value = reduce ? t * 0.15 : t
    // fade in once the ring has formed
    mat.current.uniforms.uFade.value = reduce ? 1 : Math.min(1, Math.max(0, (t - 2.2) / 1.6))
  })
  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        {Object.entries(attrs).map(([k, arr]) => (
          <bufferAttribute key={k} attach={`attributes-${k}`} count={count} array={arr} itemSize={1} />
        ))}
      </bufferGeometry>
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={sparkleVert} fragmentShader={sparkleFrag}
        transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

function OuterSparkle({ reduce, small }) {
  const dot = useMemo(dotTexture, [])
  const star = useMemo(starTexture, [])
  const R = 3.45
  // halo of motes hugging the outside of the ring
  const halo = useMemo(() => () => {
    const d = Math.pow(Math.random(), 2.2)                     // most sit close to the ring
    return { aAngle: Math.random() * 6.283, aRadius: R + 0.14 + d * 1.1, aSpeed: (0.025 + Math.random() * 0.05) * (Math.random() < .5 ? -1 : 1) * (1 - d * .5),
             aPhase: Math.random(), aSize: 0.6 + Math.random() * 1.4, aDrift: 0, aTw: 1.2 + Math.random() * 3 }
  }, [])
  // embers that leave the ring and float outward, fading
  const embers = useMemo(() => () => ({
    aAngle: Math.random() * 6.283, aRadius: R + 0.1, aSpeed: (Math.random() - .5) * 0.06,
    aPhase: Math.random(), aSize: 0.8 + Math.random() * 1.2, aDrift: 0.08 + Math.random() * 0.1, aTw: 2 + Math.random() * 3,
  }), [])
  // a handful of bright four-point glints
  const glints = useMemo(() => () => ({
    aAngle: Math.random() * 6.283, aRadius: R + 0.2 + Math.random() * 0.7, aSpeed: (Math.random() - .5) * 0.04,
    aPhase: Math.random(), aSize: 5 + Math.random() * 5, aDrift: 0, aTw: 0.6 + Math.random() * 0.9,
  }), [])
  return (
    <>
      <SparkleLayer count={small ? 900 : 2000} build={halo} tex={dot} color="#FFC861" reduce={reduce} />
      <SparkleLayer count={small ? 120 : 260} build={embers} tex={dot} color="#FFB347" reduce={reduce} />
      <SparkleLayer count={small ? 14 : 26} build={glints} tex={star} color="#FFF3D1" reduce={reduce} />
    </>
  )
}

function StageContents({ reduce }) {
  const texture = useSpriteTexture()
  return (
    <>
      <Ring texture={texture} reduce={reduce} />
      <Dust texture={texture} reduce={reduce} />
    </>
  )
}
