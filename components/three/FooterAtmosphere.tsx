"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  DoubleSide,
  Float32BufferAttribute,
  MathUtils,
  Quaternion,
  Vector3,
  type Group,
  type Mesh,
} from "three";

/* ===================================================================
   ATMOSFERA DEL PIE DE PAGINA
   Tres cosas y nada mas: el haz de un proyector que entra por la
   izquierda, el polvo suspendido que ese haz ilumina, y una tira de
   pelicula que cruza la derecha casi a oscuras.

   Todo el texto, el boton y el BAJO FLOW gigante son HTML: aca solo
   vive lo que aporta profundidad. Geometrias simples, un shader corto
   por elemento, cero post-proceso y cero sombras.
   =================================================================== */

/** Boca del proyector. Es el origen del haz y tambien la luz que bana la cinta. */
const LENS = new Vector3(-3.2, 0.82, 0.3);
/** Hacia donde apunta: al centro, cayendo apenas y entrando en profundidad. */
const BEAM_DIR = new Vector3(1, -0.085, -0.16).normalize();
const BEAM_LENGTH = 6.5;
const BEAM_START_RADIUS = 0.07;
const BEAM_END_RADIUS = 1.45;
/** Cuanto se abre el cono por unidad de largo. El polvo lo usa para saber si esta adentro. */
const BEAM_SPREAD = (BEAM_END_RADIUS - BEAM_START_RADIUS) / BEAM_LENGTH;

/** El eje de un cilindro nace en +Y: hay que acostarlo sobre la direccion del haz. */
const BEAM_QUATERNION = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), BEAM_DIR);

/**
 * COMO PARPADEA LA LAMPARA.
 *
 * Ninguna lampara da una luz plana: respira, el filamento tiembla y cada tanto
 * pega un bajon corto. Son tres cosas distintas y hay que sumarlas, porque una
 * sola da siempre un titileo falso.
 */
function lampBreath(time: number) {
  // 1. La respiracion: sube y baja despacio, del orden del 8%.
  const breath = Math.sin(time * 0.41) * 0.05 + Math.sin(time * 0.77 + 1.3) * 0.032;
  // 2. El temblor del filamento: rapido y minusculo.
  const tremble = Math.sin(time * 11.3) * 0.013 + Math.sin(time * 17.9 + 0.7) * 0.008;
  // 3. El bajon: la potencia 24 mantiene la onda casi siempre en cero y solo
  //    la dispara un instante, cada veinte segundos mas o menos.
  const dip = Math.pow(Math.max(0, Math.sin(time * 0.31 + 1.7)), 24) * 0.1;

  return 1 + breath + tremble - dip;
}

/**
 * La apertura del haz: el cono se abre y se cierra apenas, muy despacio. Es lo
 * que hace que la luz respire tambien de tamano y no solo de intensidad.
 */
function lampSpread(time: number) {
  return 1 + Math.sin(time * 0.33) * 0.06 + Math.sin(time * 0.19 + 2.1) * 0.035;
}

/* -------------------------------------------------------------------
   1. EL HAZ
   Un cono hueco con mezcla aditiva. El brillo no sale de una textura:
   sale de cuanto camino de luz atraviesa la mirada. Las caras que miran
   a la camara tienen mas cono detras, asi que se ven mas claras en el
   centro y se apagan hacia los bordes. Eso es lo que evita que parezca
   un triangulo pegado a la pantalla.
   ------------------------------------------------------------------- */
const beamVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDir = cameraPosition - worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const beamFragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec3 uColor;
  uniform float uTime;
  uniform float uIntensity;
  uniform float uLamp;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDir;

  void main() {
    // 0 en la lente, 1 en la punta del haz.
    float travel = vUv.y;

    // Cuanto cono hay detras de este pixel.
    float facing = abs(dot(normalize(vNormalW), normalize(vViewDir)));
    float core = pow(facing, 1.75);

    // La luz se gasta con la distancia.
    float falloff = pow(1.0 - travel, 1.15);

    // Ruido muy leve: el aire nunca es parejo. Dos senos cruzados alcanzan.
    float grain = 0.88
      + 0.07 * sin(travel * 11.0 - uTime * 0.42 + vUv.x * 6.2831)
      + 0.05 * sin(travel * 4.3 + uTime * 0.23);

    float alpha = core * falloff * grain;
    alpha *= smoothstep(0.0, 0.09, travel);   // no arranca de golpe en la lente
    alpha *= smoothstep(1.0, 0.66, travel);   // se disuelve antes del final

    gl_FragColor = vec4(uColor, alpha * uOpacity * uIntensity * uLamp);
  }
`;

function Beam({ intensityRef }: { intensityRef: RefObject<number> }) {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new Vector3(0.62, 0.75, 1.0) },
      uTime: { value: 0 },
      uIntensity: { value: 1 },
      uLamp: { value: 1 },
      uOpacity: { value: 0.38 },
    }),
    [],
  );

  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    uniforms.uTime.value = time;
    uniforms.uIntensity.value = MathUtils.lerp(uniforms.uIntensity.value, intensityRef.current, 0.045);
    uniforms.uLamp.value = lampBreath(time);

    // El cono se abre y se cierra a lo ancho. El eje del haz es la Y local,
    // asi que se escala en X y Z y el largo queda intacto.
    const mesh = meshRef.current;
    if (mesh) {
      const spread = lampSpread(time);
      mesh.scale.set(spread, 1, spread);
    }
  });

  return (
    <mesh position={[0, BEAM_LENGTH / 2, 0]} ref={meshRef}>
      <cylinderGeometry args={[BEAM_END_RADIUS, BEAM_START_RADIUS, BEAM_LENGTH, 40, 1, true]} />
      <shaderMaterial
        blending={AdditiveBlending}
        depthWrite={false}
        fragmentShader={beamFragmentShader}
        side={DoubleSide}
        transparent
        uniforms={uniforms}
        vertexShader={beamVertexShader}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------
   2. LA LENTE
   Silueta y nada mas: un cuerpo oscuro, dos aros y el circulo de luz.
   No hace falta modelar el proyector entero, solo que se entienda de
   donde sale la luz.
   ------------------------------------------------------------------- */
const glowVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uLamp;
  uniform float uOpacity;

  varying vec2 vUv;

  void main() {
    float distance = length(vUv - 0.5) * 2.0;
    float edge = max(0.0, 1.0 - distance);
    float core = pow(edge, 3.4);
    float halo = pow(edge, 1.15) * 0.3;
    gl_FragColor = vec4(uColor, (core + halo) * uOpacity * uIntensity * uLamp);
  }
`;

function LensGlow({ intensityRef }: { intensityRef: RefObject<number> }) {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new Vector3(0.78, 0.87, 1.0) },
      uIntensity: { value: 1 },
      uLamp: { value: 1 },
      uOpacity: { value: 0.62 },
    }),
    [],
  );

  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    uniforms.uIntensity.value = MathUtils.lerp(uniforms.uIntensity.value, intensityRef.current, 0.045);
    uniforms.uLamp.value = lampBreath(time);

    // El circulo de luz late junto con el haz: si no, se despegan y se nota.
    const mesh = meshRef.current;
    if (mesh) {
      const spread = 1 + (lampSpread(time) - 1) * 0.55;
      mesh.scale.set(spread, spread, 1);
    }
  });

  return (
    <mesh position={[LENS.x, LENS.y, LENS.z + 0.05]} ref={meshRef}>
      <planeGeometry args={[2.1, 2.1]} />
      <shaderMaterial
        blending={AdditiveBlending}
        depthWrite={false}
        fragmentShader={glowFragmentShader}
        transparent
        uniforms={uniforms}
        vertexShader={glowVertexShader}
      />
    </mesh>
  );
}

/* Chapa del cuerpo. Sin luces en la escena, un cubo negro con material plano
   se ve como una mancha: las caras no se distinguen y la forma se pierde. Este
   shader las separa segun hacia donde miran, que es lo minimo para que se lea
   una caja y no un borron. */
const bodyFragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec3 uDark;
  uniform vec3 uSheen;

  varying vec3 vNormalW;

  void main() {
    // Luz de referencia fija, apenas por encima y por delante de la carcasa.
    float lit = max(dot(normalize(vNormalW), normalize(vec3(-0.35, 0.78, 0.52))), 0.0);
    gl_FragColor = vec4(uDark + uSheen * pow(lit, 1.4), 1.0);
  }
`;

const bodyVertexShader = /* glsl */ `
  varying vec3 vNormalW;

  void main() {
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function ProjectorHead() {
  const bodyUniforms = useMemo(
    () => ({
      uDark: { value: new Vector3(0.016, 0.021, 0.031) },
      uSheen: { value: new Vector3(0.075, 0.093, 0.125) },
    }),
    [],
  );

  return (
    <group>
      {/* LA CARCASA. Un proyector de sala no es un tubo: es una caja con un
          lente redondo asomando adelante. El eje del haz es la Y local, asi
          que la caja se corre hacia -Y, que es "hacia atras". */}
      <mesh position={[0, -1.72, 0]}>
        <boxGeometry args={[1.72, 2.15, 1.5]} />
        <shaderMaterial
          fragmentShader={bodyFragmentShader}
          uniforms={bodyUniforms}
          vertexShader={bodyVertexShader}
        />
      </mesh>
      {/* Las aristas de la caja, apenas encendidas: son las que dibujan la
          silueta cuadrada contra el negro del fondo. */}
      <lineSegments position={[0, -1.72, 0]}>
        <edgesGeometry args={[new BoxGeometry(1.72, 2.15, 1.5)]} />
        <lineBasicMaterial color="#2c3a52" opacity={0.55} transparent />
      </lineSegments>

      {/* El tubo del lente, redondo, saliendo de la caja. */}
      <mesh position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.66, 0.74, 0.9, 24, 1, true]} />
        <meshBasicMaterial color="#070a11" side={DoubleSide} />
      </mesh>
      {/* Dos aros: son lo unico del proyector que devuelve algo de luz. */}
      <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.62, 0.045, 6, 36]} />
        <meshBasicMaterial color="#243044" />
      </mesh>
      <mesh position={[0, -0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.03, 6, 36]} />
        <meshBasicMaterial color="#141c29" />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------
   3. EL POLVO
   Un solo THREE.Points. La deriva se calcula en el shader de vertices,
   asi que la CPU no toca el buffer nunca: cuesta lo mismo con 90 que
   con 420 particulas. Cada una calcula sola si esta dentro del cono; si
   no lo esta, casi no se ve. Es el haz el que revela el polvo.
   ------------------------------------------------------------------- */
const dustVertexShader = /* glsl */ `
  precision mediump float;

  uniform float uTime;
  uniform float uSize;
  uniform vec3 uBeamOrigin;
  uniform vec3 uBeamDir;
  uniform float uBeamLength;
  uniform float uBeamStart;
  uniform float uBeamSpread;
  uniform float uRiseSpeed;
  uniform float uRiseSpan;

  attribute float aSeed;
  attribute float aScale;

  varying float vBright;

  void main() {
    // EL POLVO SUBE. Es lo que hace un proyector encendido: el calor de la
    // lampara arma una corriente y las motas trepan despacio por el haz.
    // La fase va de 0 a 1 y vuelve a empezar; el salto no se ve porque la
    // particula se apaga en los dos extremos del recorrido (wrapFade).
    float phase = fract((uTime * uRiseSpeed + aSeed * 3.77) / uRiseSpan);
    float wrapFade = smoothstep(0.0, 0.11, phase) * (1.0 - smoothstep(0.89, 1.0, phase));

    vec3 drifted = position;
    drifted.y += (phase - 0.5) * uRiseSpan;

    // Encima del ascenso, un bamboleo lateral para que no suban en linea recta.
    drifted.x += sin(uTime * 0.190 + aSeed * 6.283) * 0.23;
    drifted.z += sin(uTime * 0.164 + aSeed * 3.117) * 0.20;
    drifted.y += cos(uTime * 0.143 + aSeed * 12.71) * 0.09;

    // Distancia al eje del haz: es lo que decide si la particula se ve.
    vec3 toPoint = drifted - uBeamOrigin;
    float along = dot(toPoint, uBeamDir);
    float radius = length(toPoint - along * uBeamDir);
    float coneRadius = uBeamStart + max(along, 0.0) * uBeamSpread;

    float inside = 1.0 - smoothstep(coneRadius * 0.30, coneRadius * 1.08, radius);
    inside *= step(0.0, along);
    inside *= 1.0 - smoothstep(uBeamLength * 0.62, uBeamLength, along);

    // Centelleo: el polvo real entra y sale del foco todo el tiempo.
    float twinkle = 0.68 + 0.32 * sin(uTime * 1.15 + aSeed * 21.7);
    vBright = (0.07 + 0.93 * inside) * twinkle * wrapFade;

    vec4 mvPosition = modelViewMatrix * vec4(drifted, 1.0);
    gl_PointSize = uSize * aScale * (300.0 / max(-mvPosition.z, 0.001));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const dustFragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uIntensity;

  varying float vBright;

  void main() {
    float distance = length(gl_PointCoord - 0.5);
    float mask = smoothstep(0.5, 0.06, distance);
    gl_FragColor = vec4(uColor, mask * vBright * uOpacity * uIntensity);
  }
`;

function Dust({ count, intensityRef }: { count: number; intensityRef: RefObject<number> }) {
  const { positions, seeds, scales } = useMemo(() => {
    const positionValues = new Float32Array(count * 3);
    const seedValues = new Float32Array(count);
    const scaleValues = new Float32Array(count);

    for (let index = 0; index < count; index += 1) {
      // Dos de cada tres se siembran cerca del haz, que es donde se ven.
      const nearBeam = index % 3 !== 0;
      const along = Math.random() * BEAM_LENGTH;
      const spreadRadius = (BEAM_START_RADIUS + along * BEAM_SPREAD) * 1.4;
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.sqrt(Math.random()) * spreadRadius;

      if (nearBeam) {
        positionValues[index * 3] = LENS.x + BEAM_DIR.x * along + Math.cos(angle) * distance;
        positionValues[index * 3 + 1] = LENS.y + BEAM_DIR.y * along + Math.sin(angle) * distance;
        positionValues[index * 3 + 2] = LENS.z + BEAM_DIR.z * along + Math.sin(angle) * distance * 0.8;
      } else {
        positionValues[index * 3] = (Math.random() - 0.5) * 10.5;
        positionValues[index * 3 + 1] = (Math.random() - 0.5) * 6.2;
        positionValues[index * 3 + 2] = (Math.random() - 0.5) * 4.6 - 0.6;
      }

      seedValues[index] = Math.random();
      scaleValues[index] = 0.5 + Math.random() * 0.85;
    }

    return { positions: positionValues, seeds: seedValues, scales: scaleValues };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 0.1 },
      uColor: { value: new Vector3(0.82, 0.89, 1.0) },
      uOpacity: { value: 0.9 },
      uIntensity: { value: 1 },
      uBeamOrigin: { value: LENS },
      uBeamDir: { value: BEAM_DIR },
      uBeamLength: { value: BEAM_LENGTH },
      uBeamStart: { value: BEAM_START_RADIUS },
      uBeamSpread: { value: BEAM_SPREAD },
      // Tarda unos 23 s en recorrer el tramo entero: se ve subir, no volar.
      uRiseSpeed: { value: 0.075 },
      uRiseSpan: { value: 1.75 },
    }),
    [],
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    // El polvo gana algo menos que el haz cuando el boton se ilumina.
    const target = 1 + (intensityRef.current - 1) * 0.7;
    uniforms.uIntensity.value = MathUtils.lerp(uniforms.uIntensity.value, target, 0.045);
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
      </bufferGeometry>
      <shaderMaterial
        blending={AdditiveBlending}
        depthWrite={false}
        fragmentShader={dustFragmentShader}
        transparent
        uniforms={uniforms}
        vertexShader={dustVertexShader}
      />
    </points>
  );
}

/* -------------------------------------------------------------------
   4. LA TIRA DE PELICULA
   No hay modelo cargado: se arma con una curva y dos vertices por
   tramo. Las perforaciones son matematica en el shader, no una textura.
   La ilumina la misma lente del proyector, asi que solo se enciende
   donde corresponde y el resto queda escondido en la oscuridad.
   ------------------------------------------------------------------- */
const FILM_POINTS = [
  new Vector3(2.4, 3.2, -3.3),
  new Vector3(3.5, 2.05, -1.7),
  new Vector3(4.4, 0.85, -0.55),
  new Vector3(4.9, -0.55, -0.75),
  new Vector3(4.5, -1.85, -1.8),
  new Vector3(3.35, -3.05, -3.1),
];

function buildFilmRibbon(segments: number, width: number) {
  const curve = new CatmullRomCurve3(FILM_POINTS, false, "catmullrom", 0.5);
  const frames = curve.computeFrenetFrames(segments, false);

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const point = new Vector3();
  const edge = new Vector3();
  const face = new Vector3();

  for (let index = 0; index <= segments; index += 1) {
    const t = index / segments;
    curve.getPointAt(t, point);

    const normal = frames.normals[index];
    const binormal = frames.binormals[index];

    // Torsion suave a lo largo de la cinta: sin esto parece una banda plana.
    const twist = Math.sin(t * Math.PI * 1.2) * 0.8;
    const cos = Math.cos(twist);
    const sin = Math.sin(twist);

    edge.copy(binormal).multiplyScalar(cos).addScaledVector(normal, sin);
    face.copy(normal).multiplyScalar(cos).addScaledVector(binormal, -sin);

    for (const side of [-0.5, 0.5]) {
      positions.push(
        point.x + edge.x * width * side,
        point.y + edge.y * width * side,
        point.z + edge.z * width * side,
      );
      normals.push(face.x, face.y, face.z);
      uvs.push(t, side + 0.5);
    }
  }

  for (let index = 0; index < segments; index += 1) {
    const a = index * 2;
    indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);

  return geometry;
}

const filmVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const filmFragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec3 uDark;
  uniform vec3 uSheen;
  uniform vec3 uLightPos;
  uniform float uOpacity;
  uniform float uPerfPitch;
  uniform float uFramePitch;

  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vWorldPos;

  void main() {
    vec3 normal = normalize(vNormalW);
    vec3 toLight = normalize(uLightPos - vWorldPos);
    // abs: la cinta se ve por las dos caras y las dos reciben algo de luz.
    float lambert = abs(dot(normal, toLight));
    float lit = pow(lambert, 1.8);

    float along = vUv.x;
    float across = vUv.y;

    // PROPORCIONES DE 35 MM. Es lo que hace que se lea como pelicula y no
    // como un engranaje: cuatro perforaciones chicas por cada fotograma,
    // no un diente gigante por cuadro.
    float perfCell = fract(along * uPerfPitch);
    float frameCell = fract(along * uFramePitch);

    // Las dos filas de perforaciones, metidas hacia adentro del borde.
    float rowTop = smoothstep(0.055, 0.075, across) * (1.0 - smoothstep(0.150, 0.170, across));
    float rowBottom = smoothstep(0.830, 0.850, across) * (1.0 - smoothstep(0.925, 0.945, across));
    float rows = max(rowTop, rowBottom);
    float holeAlong = smoothstep(0.30, 0.345, perfCell) * (1.0 - smoothstep(0.545, 0.59, perfCell));
    float perforation = rows * holeAlong;

    // La ventana de imagen y la linea que separa un fotograma del otro.
    float image = smoothstep(0.215, 0.240, across) * (1.0 - smoothstep(0.760, 0.785, across));
    float toFrameEdge = min(frameCell, 1.0 - frameCell);
    float frameLine = image * (1.0 - smoothstep(0.006, 0.020, toFrameEdge));

    // Cada fotograma revelo distinto: una variacion fija por cuadro alcanza
    // para que la cinta no parezca una textura repetida.
    float frameId = floor(along * uFramePitch);
    float exposure = fract(sin(frameId * 43.7) * 4375.85);
    vec3 emulsion = uDark * (0.72 + 0.62 * exposure);

    // El filo exterior es lo unico que llega a brillar de verdad.
    float rim = (1.0 - smoothstep(0.0, 0.05, across)) + smoothstep(0.95, 1.0, across);

    vec3 color = mix(uDark, emulsion, image);
    color += uSheen * (0.06 + 0.94 * lit) * 0.44;
    color += uSheen * rim * lit * 0.48;
    color = mix(color, color * 0.35, frameLine);
    color = mix(color, color * 0.12, perforation);

    float alpha = uOpacity * (0.32 + 0.68 * lit);
    alpha *= 1.0 - perforation * 0.94;   // por los agujeros se ve el fondo

    gl_FragColor = vec4(color, alpha);
  }
`;

function FilmStrip({ segments, opacity, animated }: { segments: number; opacity: number; animated: boolean }) {
  const geometry = useMemo(() => buildFilmRibbon(segments, 1.02), [segments]);
  const groupRef = useRef<Group>(null);

  const uniforms = useMemo(
    () => ({
      uDark: { value: new Vector3(0.03, 0.038, 0.052) },
      uSheen: { value: new Vector3(0.34, 0.41, 0.55) },
      uLightPos: { value: LENS },
      uOpacity: { value: opacity },
      // Cuatro perforaciones por fotograma: la proporcion real del 35 mm.
      uFramePitch: { value: 17 },
      uPerfPitch: { value: 68 },
    }),
    [opacity],
  );

  // La geometria se crea a mano, asi que tambien se libera a mano.
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group || !animated) return;
    // Balanceo casi invisible: periodos larguisimos y amplitud de grados.
    const time = state.clock.elapsedTime;
    group.rotation.y = Math.sin(time * 0.075) * 0.055;
    group.rotation.z = Math.sin(time * 0.052 + 1.4) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <shaderMaterial
          depthWrite={false}
          fragmentShader={filmFragmentShader}
          side={DoubleSide}
          transparent
          uniforms={uniforms}
          vertexShader={filmVertexShader}
        />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------
   5. LA CAMARA
   Parallax con lerp, nunca seguimiento directo del cursor. El maximo es
   alrededor de un grado: alcanza para que se sienta el volumen y no
   alcanza para notarse como efecto.
   ------------------------------------------------------------------- */
function CameraParallax({ enabled, depth }: { enabled: boolean; depth: number }) {
  const camera = useThree((state) => state.camera);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    function handleMove(event: PointerEvent) {
      target.current.x = (event.clientX / window.innerWidth - 0.5) * 0.22;
      target.current.y = (event.clientY / window.innerHeight - 0.5) * -0.12;
    }

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [enabled]);

  useFrame(() => {
    if (!enabled) return;
    camera.position.x += (target.current.x - camera.position.x) * 0.025;
    camera.position.y += (target.current.y - camera.position.y) * 0.025;
    camera.position.z = depth;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/** Con el motor congelado ("demand") hay que pedir el cuadro a mano al volver. */
function DemandPainter({ active }: { active: boolean }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
  }, [active, invalidate]);

  return null;
}

type FooterAtmosphereProps = {
  /** Solo la seccion visible dibuja. El resto del tiempo el motor queda congelado. */
  isActive: boolean;
  /** 1 en reposo, ~1.07 cuando el puntero entra en el boton. */
  intensityRef: RefObject<number>;
};

export function FooterAtmosphere({ isActive, intensityRef }: FooterAtmosphereProps) {
  const [profile, setProfile] = useState<{ compact: boolean; reduced: boolean; dpr: [number, number] }>({
    compact: false,
    reduced: false,
    dpr: [1, 1.5],
  });
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const compactQuery = window.matchMedia("(max-width: 768px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      const compact = compactQuery.matches;
      setProfile({
        compact,
        reduced: motionQuery.matches,
        // Nunca por encima de 1.5: el pie no justifica renderizar al doble.
        dpr: [1, compact ? 1.25 : 1.5],
      });
    };

    sync();
    compactQuery.addEventListener("change", sync);
    motionQuery.addEventListener("change", sync);
    return () => {
      compactQuery.removeEventListener("change", sync);
      motionQuery.removeEventListener("change", sync);
    };
  }, []);

  // Pestana en segundo plano: no tiene sentido seguir dibujando.
  useEffect(() => {
    const sync = () => setPageVisible(!document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  const { compact, reduced, dpr } = profile;
  const animated = isActive && pageVisible && !reduced;
  const dustCount = compact ? 90 : 420;
  const cameraDepth = compact ? 8.4 : 6;

  return (
    <Canvas
      camera={{ fov: compact ? 52 : 45, position: [0, 0, cameraDepth] }}
      // El canvas no se desmonta nunca: cuando el pie no esta activo solo se
      // congela el motor, conservando el contexto WebGL ya creado.
      frameloop={animated ? "always" : "demand"}
      dpr={dpr}
      gl={{ alpha: true, antialias: !compact, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = false;
      }}
    >
      <DemandPainter active={isActive} />
      <CameraParallax depth={cameraDepth} enabled={animated && !compact} />

      <group position={[LENS.x, LENS.y, LENS.z]} quaternion={BEAM_QUATERNION}>
        <ProjectorHead />
        <Beam intensityRef={intensityRef} />
      </group>

      <LensGlow intensityRef={intensityRef} />
      <Dust count={dustCount} intensityRef={intensityRef} />
      <FilmStrip animated={animated} opacity={compact ? 0.4 : 0.52} segments={compact ? 44 : 88} />
    </Canvas>
  );
}
