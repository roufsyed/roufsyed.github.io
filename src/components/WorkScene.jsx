import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, OrbitControls, RoundedBox, Sphere } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function DeviceCore({ palette }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.elapsedTime * 0.18;
  });

  return (
    <group ref={ref}>
      <RoundedBox args={[1.3, 2.2, 0.1]} radius={0.08} smoothness={6}>
        <meshStandardMaterial color={palette.deviceBody} metalness={0.25} roughness={0.35} />
      </RoundedBox>
      <RoundedBox position={[0, 0, 0.06]} args={[1.08, 1.85, 0.05]} radius={0.07} smoothness={6}>
        <meshStandardMaterial color={palette.deviceScreen} />
      </RoundedBox>
      <mesh position={[0, 0.86, 0.09]}>
        <boxGeometry args={[0.32, 0.04, 0.02]} />
        <meshStandardMaterial color={palette.deviceAccent} />
      </mesh>
    </group>
  );
}

function SdkRings({ palette }) {
  const ring = useRef();
  const ring2 = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ring.current.rotation.z = t * 0.42;
    ring2.current.rotation.z = -t * 0.38;
  });

  return (
    <group position={[0, 0, -0.15]}>
      <mesh ref={ring}>
        <torusGeometry args={[1.52, 0.02, 12, 80]} />
        <meshStandardMaterial
          color={palette.ringPrimary}
          emissive={palette.ringPrimary}
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh ref={ring2} rotation={[0.6, 0, 0]}>
        <torusGeometry args={[1.83, 0.015, 12, 80]} />
        <meshStandardMaterial
          color={palette.ringSecondary}
          emissive={palette.ringSecondary}
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}

function ServiceNodes({ palette }) {
  const group = useRef();
  const nodes = useMemo(
    () =>
      [
        [-2.25, 0.9, -0.6],
        [-2.45, -0.05, -0.3],
        [-2.0, -0.9, -0.45],
        [-1.45, 0.5, -0.9],
        [-1.3, -0.45, -0.85]
      ].map((pos) => new THREE.Vector3(...pos)),
    []
  );

  useFrame(({ clock }) => {
    group.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.06;
  });

  return (
    <group ref={group}>
      {nodes.map((node, index) => (
        <Sphere key={index} args={[0.08, 32, 32]} position={node}>
          <meshStandardMaterial color={palette.node} emissive={palette.node} emissiveIntensity={0.2} />
        </Sphere>
      ))}
      <Line
        points={[nodes[0], nodes[1], nodes[2], nodes[4], nodes[3], nodes[0]]}
        color={palette.line}
        lineWidth={1}
      />
    </group>
  );
}

export default function WorkScene({ theme }) {
  const palette =
    theme === 'dark'
      ? {
          sceneBackground: '#121920',
          deviceBody: '#3b8cff',
          deviceScreen: '#1b222b',
          deviceAccent: '#50d36f',
          ringPrimary: '#ff6a5e',
          ringSecondary: '#ff6bc8',
          node: '#ffd261',
          line: '#62de82'
        }
      : {
          sceneBackground: '#fffdf8',
          deviceBody: '#1a73e8',
          deviceScreen: '#ffffff',
          deviceAccent: '#34a853',
          ringPrimary: '#ea4335',
          ringSecondary: '#ff2da4',
          node: '#fbbc04',
          line: '#34a853'
        };

  return (
    <div className="scene-wrap" aria-label="3D engineering theme visualization">
      <Canvas camera={{ position: [0.2, 0.2, 5], fov: 48 }}>
        <color attach="background" args={[palette.sceneBackground]} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 3]} intensity={1.2} />
        <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.2}>
          <DeviceCore palette={palette} />
        </Float>
        <SdkRings palette={palette} />
        <ServiceNodes palette={palette} />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={1.8} minPolarAngle={1.2} />
      </Canvas>
    </div>
  );
}
