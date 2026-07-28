'use client';

import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Player, AyoBoard as AyoBoardModel } from '@/lib/api';

/* ------------------------------------------------------------------ *
 * Layout — world coordinates. X = columns, Z = rows, Y = up.
 * Top surface of the board sits at y = 0.
 * ------------------------------------------------------------------ */
const COLS = 6;
const COL_GAP = 1.72;
const ROW_Z = 1.34;
const STORE_X = 5.95;

const BOARD_W = 14.7;
const BOARD_D = 5.7;
const BOARD_TH = 1.0;

const PIT_HOLE = 0.62;
const PIT_BOWL = 0.66;
const STORE_HOLE = 0.9;
const STORE_BOWL = 0.94;

const colX = (c: number) => (c - (COLS - 1) / 2) * COL_GAP;

// Bottom row (South) = Player 1, pits 0..5 left→right.
// Top row (North) = Player 2, pits 6..11 shown 11..6 left→right (counter-clockwise chain).
const SOUTH = [0, 1, 2, 3, 4, 5];
const NORTH = [11, 10, 9, 8, 7, 6];

interface PitDef {
  index: number;
  x: number;
  z: number;
  owner: Player;
}

const PIT_DEFS: PitDef[] = [
  ...SOUTH.map((index, c) => ({ index, x: colX(c), z: ROW_Z, owner: 'PLAYER_1' as Player })),
  ...NORTH.map((index, c) => ({ index, x: colX(c), z: -ROW_Z, owner: 'PLAYER_2' as Player })),
];

/* Stable scatter offsets inside a bowl (golden-angle spiral). */
function scatter(n: number, spread: number): [number, number][] {
  const pts: [number, number][] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const r = spread * Math.sqrt((i + 0.55) / n);
    const a = i * golden;
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  return pts;
}
const PIT_SCATTER = scatter(8, 0.34);
const STORE_SCATTER = scatter(12, 0.6);

/* ------------------------------------------------------------------ *
 * Board slab — an extruded rounded rectangle with real carved holes.
 * ------------------------------------------------------------------ */
function useBoardGeometry() {
  return useMemo(() => {
    const w = BOARD_W / 2;
    const d = BOARD_D / 2;
    const cr = 0.7; // corner radius (shape space: u = x, v = -z)

    const shape = new THREE.Shape();
    shape.moveTo(-w + cr, -d);
    shape.lineTo(w - cr, -d);
    shape.absarc(w - cr, -d + cr, cr, -Math.PI / 2, 0, false);
    shape.lineTo(w, d - cr);
    shape.absarc(w - cr, d - cr, cr, 0, Math.PI / 2, false);
    shape.lineTo(-w + cr, d);
    shape.absarc(-w + cr, d - cr, cr, Math.PI / 2, Math.PI, false);
    shape.lineTo(-w, -d + cr);
    shape.absarc(-w + cr, -d + cr, cr, Math.PI, (3 * Math.PI) / 2, false);

    // Pit holes (v = -z).
    for (const p of PIT_DEFS) {
      const hole = new THREE.Path();
      hole.absarc(p.x, -p.z, PIT_HOLE, 0, Math.PI * 2, true);
      shape.holes.push(hole);
    }
    // Store holes (oval, elongated along z).
    for (const sx of [-STORE_X, STORE_X]) {
      const hole = new THREE.Path();
      hole.absellipse(sx, 0, STORE_HOLE, STORE_HOLE * 1.7, 0, Math.PI * 2, true, 0);
      shape.holes.push(hole);
    }

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: BOARD_TH,
      bevelEnabled: true,
      bevelThickness: 0.13,
      bevelSize: 0.13,
      bevelSegments: 4,
      curveSegments: 24,
    });
    geo.rotateX(-Math.PI / 2);
    geo.computeBoundingBox();
    geo.translate(0, -(geo.boundingBox?.max.y ?? BOARD_TH), 0); // top face → y = 0
    geo.computeVertexNormals();
    return geo;
  }, []);
}

/* ------------------------------------------------------------------ *
 * A single bowl (pit or store) with its seeds + label.
 * ------------------------------------------------------------------ */
interface BowlProps {
  x: number;
  z: number;
  bowlR: number;
  ovalZ?: number;
  count: number;
  visibleCap: number;
  offsets: [number, number][];
  seedSize: number;
  canClick: boolean;
  dim: boolean;
  accent: string;
  onClick?: () => void;
  label?: string;
  labelStrong?: boolean;
}

function Bowl({
  x, z, bowlR, ovalZ = 1, count, visibleCap, offsets, seedSize,
  canClick, dim, accent, onClick, label, labelStrong,
}: BowlProps) {
  const [hover, setHover] = useState(false);
  const seedGroup = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const drop = useRef(0);
  const prevCount = useRef(count);

  if (prevCount.current !== count) {
    drop.current = 0; // replay settle animation on any change
    prevCount.current = count;
  }

  const shown = Math.min(count, visibleCap);
  const restY = -bowlR * 0.42;

  useFrame((_, delta) => {
    drop.current = Math.min(1, drop.current + delta * 3.2);
    const p = drop.current;
    const ease = 1 - Math.pow(1 - p, 3);
    const g = seedGroup.current;
    if (g) {
      g.children.forEach((child, i) => {
        const lift = 0.9 * (1 - ease) * (1 + (i % 3) * 0.15);
        child.position.y = restY + lift;
        const s = 0.45 + 0.55 * ease;
        child.scale.setScalar(s);
      });
    }
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshStandardMaterial;
      const target = hover ? 1.6 : canClick ? 0.55 : 0;
      mat.emissiveIntensity += (target - mat.emissiveIntensity) * Math.min(1, delta * 8);
      const ty = hover && canClick ? 0.12 : 0.02;
      ringRef.current.position.y += (ty - ringRef.current.position.y) * Math.min(1, delta * 8);
    }
  });

  const seedColor = dim ? '#8f836b' : '#efe4cc';

  return (
    <group position={[x, 0, z]}>
      {/* Bowl interior — lower hemisphere, seen from inside (BackSide). */}
      <mesh scale={[1, 1, ovalZ]} receiveShadow>
        <sphereGeometry args={[bowlR, 40, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial
          color="#20140c"
          roughness={0.95}
          metalness={0}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Playable rim glow. */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} scale={[1, ovalZ, 1]}>
        <torusGeometry args={[bowlR * 0.92, 0.045, 12, 48]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0}
          roughness={0.4}
          metalness={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Seeds. */}
      <group ref={seedGroup}>
        {offsets.slice(0, shown).map(([ox, oz], i) => (
          <mesh key={i} position={[ox, restY, oz * ovalZ]} castShadow>
            <sphereGeometry args={[seedSize, 18, 18]} />
            <meshStandardMaterial color={seedColor} roughness={0.42} metalness={0.02} />
          </mesh>
        ))}
      </group>

      {/* Invisible click target (only when playable). */}
      {canClick && onClick && (
        <mesh
          position={[0, 0.14, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[1, ovalZ, 1]}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            onClick();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHover(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHover(false);
            document.body.style.cursor = 'auto';
          }}
        >
          <circleGeometry args={[bowlR * 1.25, 32]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}

      {/* Count label. */}
      {label !== undefined && (
        <Html center position={[0, 0.42, 0]} distanceFactor={11} style={{ pointerEvents: 'none' }} zIndexRange={[10, 0]}>
          <div
            className={[
              'select-none rounded-full font-semibold tabular-nums leading-none transition',
              labelStrong ? 'px-2.5 py-1 text-[15px]' : 'px-2 py-0.5 text-[13px]',
              canClick
                ? 'bg-wood-brass text-black shadow-[0_2px_10px_rgba(202,169,107,0.5)]'
                : dim
                  ? 'bg-black/40 text-neutral-500'
                  : 'bg-black/55 text-neutral-200',
            ].join(' ')}
          >
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Scene.
 * ------------------------------------------------------------------ */
interface SceneProps {
  board: AyoBoardModel;
  currentTurn: Player;
  isAiThinking?: boolean;
  onMakeMove: (pitIndex: number) => void;
}

function Scene({ board, currentTurn, isAiThinking, onMakeMove }: SceneProps) {
  const boardGeo = useBoardGeometry();

  return (
    <>
      <color attach="background" args={['#0c0a08']} />
      <fog attach="fog" args={['#0c0a08', 18, 34]} />

      <ambientLight intensity={0.5} />
      <hemisphereLight args={['#fff2d8', '#241109', 0.5]} />
      <directionalLight
        position={[6, 13, 7]}
        intensity={1.7}
        color="#fff3df"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-9, 6, -5]} intensity={0.45} color="#c8a06a" />
      <pointLight position={[0, 7, 3]} intensity={0.35} color="#ffe6bd" />

      {/* Carved board slab. */}
      <mesh geometry={boardGeo} castShadow receiveShadow>
        <meshStandardMaterial color="#3a281b" roughness={0.58} metalness={0.06} />
      </mesh>

      {/* Center inlay line between the two rows. */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[BOARD_W - 5.6, 0.05]} />
        <meshStandardMaterial color="#caa96b" emissive="#8a6f43" emissiveIntensity={0.25} roughness={0.5} metalness={0.4} transparent opacity={0.55} />
      </mesh>

      {/* Pits. */}
      {PIT_DEFS.map((p) => {
        const count = board.pits[p.index];
        const canClick = currentTurn === p.owner && count > 0 && !isAiThinking;
        const dim = !canClick && (currentTurn !== p.owner || count === 0);
        return (
          <Bowl
            key={p.index}
            x={p.x}
            z={p.z}
            bowlR={PIT_BOWL}
            count={count}
            visibleCap={8}
            offsets={PIT_SCATTER}
            seedSize={0.15}
            canClick={canClick}
            dim={dim}
            accent="#caa96b"
            onClick={() => onMakeMove(p.index)}
            label={String(count)}
          />
        );
      })}

      {/* Stores (captured granaries). Player 1 → right, Player 2 → left. */}
      <Bowl
        x={STORE_X}
        z={0}
        bowlR={STORE_BOWL}
        ovalZ={1.7}
        count={board.player1Captured}
        visibleCap={12}
        offsets={STORE_SCATTER}
        seedSize={0.16}
        canClick={false}
        dim={false}
        accent="#34d399"
        label={String(board.player1Captured)}
        labelStrong
      />
      <Bowl
        x={-STORE_X}
        z={0}
        bowlR={STORE_BOWL}
        ovalZ={1.7}
        count={board.player2Captured}
        visibleCap={12}
        offsets={STORE_SCATTER}
        seedSize={0.16}
        canClick={false}
        dim={false}
        accent="#f5c563"
        label={String(board.player2Captured)}
        labelStrong
      />

      <ContactShadows position={[0, -1.02, 0]} opacity={0.55} scale={22} blur={2.6} far={6} resolution={1024} color="#000000" />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        target={[0, -0.1, 0.15]}
        minPolarAngle={0.62}
        maxPolarAngle={1.02}
        minAzimuthAngle={-0.34}
        maxAzimuthAngle={0.34}
        rotateSpeed={0.5}
      />
    </>
  );
}

export default function BoardCanvas(props: SceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      camera={{ position: [0, 8.4, 8.8], fov: 38 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
