import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, OrbitControls, RoundedBox, Sphere } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function DeviceCore() {
  const ref = useRef();

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.elapsedTime * 0.18;
  });

  return (
    <group ref={ref}>
      <RoundedBox args={[1.3, 2.2, 0.1]} radius={0.08} smoothness={6}>
        <meshStandardMaterial color="#1a73e8" metalness={0.25} roughness={0.35} />
      </RoundedBox>
      <RoundedBox position={[0, 0, 0.06]} args={[1.08, 1.85, 0.05]} radius={0.07} smoothness={6}>
        <meshStandardMaterial color="#ffffff" />
      </RoundedBox>
      <mesh position={[0, 0.86, 0.09]}>
        <boxGeometry args={[0.32, 0.04, 0.02]} />
        <meshStandardMaterial color="#34a853" />
      </mesh>
    </group>
  );
}

function SdkRings() {
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
        <meshStandardMaterial color="#ea4335" emissive="#ea4335" emissiveIntensity={0.1} />
      </mesh>
      <mesh ref={ring2} rotation={[0.6, 0, 0]}>
        <torusGeometry args={[1.83, 0.015, 12, 80]} />
        <meshStandardMaterial color="#ff2da4" emissive="#ff2da4" emissiveIntensity={0.1} />
      </mesh>
    </group>
  );
}

function ServiceNodes() {
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
          <meshStandardMaterial color="#fbbc04" emissive="#fbbc04" emissiveIntensity={0.2} />
        </Sphere>
      ))}
      <Line
        points={[nodes[0], nodes[1], nodes[2], nodes[4], nodes[3], nodes[0]]}
        color="#34a853"
        lineWidth={1}
      />
    </group>
  );
}

export default function WorkScene() {
  return (
    <div className="scene-wrap" aria-label="3D engineering theme visualization">
      <Canvas camera={{ position: [0.2, 0.2, 5], fov: 48 }}>
        <color attach="background" args={['#fffdf8']} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 3]} intensity={1.2} />
        <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.2}>
          <DeviceCore />
        </Float>
        <SdkRings />
        <ServiceNodes />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={1.8} minPolarAngle={1.2} />
      </Canvas>
    </div>
  );
}
