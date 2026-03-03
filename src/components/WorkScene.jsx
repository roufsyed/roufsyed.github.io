import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, RoundedBox } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function createCodeTexture(type, isDark) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 620;
  const ctx = canvas.getContext('2d');

  const bg = isDark ? '#121a26' : '#172131';
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#6aa9ff';
  ctx.fillRect(30, 30, 18, 18);
  ctx.fillStyle = '#8a97ac';
  ctx.fillRect(30, 60, 18, 18);
  ctx.fillRect(30, 90, 18, 18);

  ctx.font = '28px Menlo, Consolas, monospace';
  ctx.fillStyle = '#dce7f9';

  const java = [
    'public class PaymentService {',
    '  private final GraphClient client;',
    '  public Receipt pay(Order order) {',
    '    var req = PaymentRequest.from(order);',
    '    var res = client.execute(req);',
    '    return Receipt.success(res.id());',
    '  }',
    '}'
  ];

  const aes512 = [
    '// AES-512 style envelope (demo)',
    'const key = HKDF_SHA512(masterKey, salt);',
    'const iv  = randomBytes(16);',
    'const c1  = AES_256_GCM_Encrypt(key[0..31], iv, data);',
    'const c2  = AES_256_GCM_Encrypt(key[32..63], iv, c1);',
    'const tag = SHA512(iv || c2 || aad);',
    'return { iv, ciphertext: c2, tag };'
  ];

  const lines = type === 'java' ? java : aes512;
  lines.forEach((line, i) => {
    const y = 145 + i * 52;
    if (line.startsWith('public') || line.startsWith('const')) {
      ctx.fillStyle = '#7fd68b';
    } else if (line.startsWith('//')) {
      ctx.fillStyle = '#9aa9bf';
    } else {
      ctx.fillStyle = '#f0c46f';
    }
    ctx.fillText(line, 80, y);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function CodeScreen({ position, rotation = [0, 0, 0], palette, type, darkMode }) {
  const tex = useMemo(() => createCodeTexture(type, darkMode), [type, darkMode]);

  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[1.7, 1.08, 0.1]} radius={0.12} smoothness={5}>
        <meshStandardMaterial color={palette.monitorBody} metalness={0.2} roughness={0.35} />
      </RoundedBox>
      <RoundedBox position={[0, 0, 0.06]} args={[1.46, 0.86, 0.03]} radius={0.06} smoothness={4}>
        <meshStandardMaterial color={palette.monitorScreen} />
      </RoundedBox>
      <mesh position={[0, 0, 0.078]}>
        <planeGeometry args={[1.34, 0.76]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>

      <mesh position={[0, -0.65, -0.02]}>
        <boxGeometry args={[0.2, 0.28, 0.08]} />
        <meshStandardMaterial color={palette.monitorBody} />
      </mesh>
      <mesh position={[0, -0.79, 0]}>
        <boxGeometry args={[0.72, 0.05, 0.2]} />
        <meshStandardMaterial color={palette.monitorBody} />
      </mesh>
    </group>
  );
}

function Avatar({ palette }) {
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = 3.08;
    }
  });

  return (
    <group ref={ref} position={[-0.24, -0.3, 1.56]}>
      <mesh position={[0, 0.84, -0.06]}>
        <sphereGeometry args={[0.29, 32, 32]} />
        <meshStandardMaterial color={palette.head} />
      </mesh>

      <mesh position={[0.0, 0.95, -0.08]} rotation={[0.08, -0.05, 0]}>
        <sphereGeometry args={[0.3, 34, 24, 0, Math.PI * 2, 0, Math.PI * 0.75]} />
        <meshStandardMaterial color={palette.hair} roughness={0.6} />
      </mesh>
      <mesh position={[0.12, 0.88, 0.16]} rotation={[0.4, 0.2, 0.06]}>
        <capsuleGeometry args={[0.04, 0.16, 8, 10]} />
        <meshStandardMaterial color={palette.hair} roughness={0.6} />
      </mesh>

      <mesh position={[0, 0.52, -0.02]}>
        <cylinderGeometry args={[0.09, 0.1, 0.12, 16]} />
        <meshStandardMaterial color={palette.head} />
      </mesh>

      <RoundedBox args={[0.82, 0.7, 0.4]} radius={0.16} smoothness={5} position={[0, 0.16, 0.01]}>
        <meshStandardMaterial color={palette.hoodie} />
      </RoundedBox>
      <mesh position={[0, 0.23, 0.18]}>
        <boxGeometry args={[0.34, 0.3, 0.02]} />
        <meshStandardMaterial color={palette.shirt} />
      </mesh>

      <mesh position={[-0.34, 0.16, 0.08]} rotation={[0, 0, 0.5]}>
        <capsuleGeometry args={[0.07, 0.38, 8, 10]} />
        <meshStandardMaterial color={palette.hoodie} />
      </mesh>
      <mesh position={[0.34, 0.16, 0.08]} rotation={[0, 0, -0.5]}>
        <capsuleGeometry args={[0.07, 0.38, 8, 10]} />
        <meshStandardMaterial color={palette.hoodie} />
      </mesh>

      <mesh position={[-0.36, 0.02, 0.16]}>
        <sphereGeometry args={[0.045, 20, 20]} />
        <meshStandardMaterial color={palette.head} />
      </mesh>
      <mesh position={[0.36, 0.02, 0.16]}>
        <sphereGeometry args={[0.045, 20, 20]} />
        <meshStandardMaterial color={palette.head} />
      </mesh>

      <RoundedBox args={[0.2, 0.12, 0.02]} radius={0.03} smoothness={3} position={[-0.1, 0.84, 0.2]}>
        <meshStandardMaterial color={palette.glasses} metalness={0.3} roughness={0.35} />
      </RoundedBox>
      <RoundedBox args={[0.2, 0.12, 0.02]} radius={0.03} smoothness={3} position={[0.1, 0.84, 0.2]}>
        <meshStandardMaterial color={palette.glasses} metalness={0.3} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, 0.84, 0.2]}>
        <boxGeometry args={[0.04, 0.02, 0.02]} />
        <meshStandardMaterial color={palette.glasses} />
      </mesh>

      <mesh position={[0, 0.77, 0.23]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.045, 0.006, 8, 24, Math.PI]} />
        <meshStandardMaterial color={palette.smile} />
      </mesh>

      <RoundedBox args={[0.34, 0.2, 0.24]} radius={0.08} smoothness={4} position={[0, -0.24, 0.04]}>
        <meshStandardMaterial color={palette.pants} />
      </RoundedBox>

      <mesh position={[-0.11, -0.8, 0.04]}>
        <capsuleGeometry args={[0.09, 0.86, 8, 10]} />
        <meshStandardMaterial color={palette.pants} />
      </mesh>
      <mesh position={[0.11, -0.8, 0.04]}>
        <capsuleGeometry args={[0.09, 0.86, 8, 10]} />
        <meshStandardMaterial color={palette.pants} />
      </mesh>

      <RoundedBox args={[0.22, 0.11, 0.34]} radius={0.04} smoothness={3} position={[-0.11, -1.24, 0.14]}>
        <meshStandardMaterial color={palette.shoe} />
      </RoundedBox>
      <RoundedBox args={[0.22, 0.11, 0.34]} radius={0.04} smoothness={3} position={[0.11, -1.24, 0.14]}>
        <meshStandardMaterial color={palette.shoe} />
      </RoundedBox>
      <mesh position={[-0.11, -1.295, 0.14]}>
        <boxGeometry args={[0.2, 0.02, 0.3]} />
        <meshStandardMaterial color={palette.sole} />
      </mesh>
      <mesh position={[0.11, -1.295, 0.14]}>
        <boxGeometry args={[0.2, 0.02, 0.3]} />
        <meshStandardMaterial color={palette.sole} />
      </mesh>
    </group>
  );
}

function WorkspaceScene({ palette, darkMode }) {
  return (
    <group>
      <mesh position={[0, -1.55, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.2, 4.2]} />
        <meshStandardMaterial color={palette.floor} />
      </mesh>

      <mesh position={[0, -1.53, 0.55]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 2.3, 48]} />
        <meshStandardMaterial color={palette.rug} />
      </mesh>

      <RoundedBox args={[4.4, 0.14, 2.15]} radius={0.1} smoothness={5} position={[0, -0.45, 0.12]}>
        <meshStandardMaterial color={palette.deskTop} />
      </RoundedBox>

      {[
        [-1.85, 0.94],
        [1.85, 0.94],
        [-1.85, -0.7],
        [1.85, -0.7]
      ].map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, -1.05, z]}>
          <cylinderGeometry args={[0.07, 0.08, 1.25, 18]} />
          <meshStandardMaterial color={palette.deskLeg} />
        </mesh>
      ))}

      <CodeScreen position={[-0.72, 0.3, 0.18]} rotation={[0, 0.08, 0]} palette={palette} type="java" darkMode={darkMode} />
      <CodeScreen position={[1.05, 0.27, 0.15]} rotation={[0, -0.12, 0]} palette={palette} type="aes" darkMode={darkMode} />

      <Avatar palette={palette} />

      <group position={[0.2, -0.35, 1.08]} rotation={[0, 0, 0]}>
        <RoundedBox args={[0.96, 0.06, 0.36]} radius={0.03} smoothness={4} position={[0, -0.004, 0]}>
          <meshStandardMaterial color={palette.keyboardEdge} metalness={0.15} roughness={0.42} />
        </RoundedBox>
        <RoundedBox args={[0.92, 0.05, 0.32]} radius={0.025} smoothness={4}>
          <meshStandardMaterial color={palette.keyboard} metalness={0.12} roughness={0.42} />
        </RoundedBox>

        {[
          { y: 0.028, z: -0.1, n: 14, off: 0, w: 0.05 },
          { y: 0.028, z: -0.045, n: 13, off: 0.025, w: 0.05 },
          { y: 0.028, z: 0.01, n: 13, off: 0.02, w: 0.05 },
          { y: 0.028, z: 0.065, n: 12, off: 0.03, w: 0.055 },
          { y: 0.028, z: 0.12, n: 7, off: 0.17, w: 0.075 }
        ].map((row, rIndex) =>
          [...Array(row.n)].map((_, i) => {
            const x = -0.39 + row.off + i * 0.06;
            const capWidth = rIndex === 4 && i === 3 ? 0.26 : row.w;
            return (
              <RoundedBox
                key={`${rIndex}-${i}`}
                args={[capWidth, 0.016, 0.042]}
                radius={0.006}
                smoothness={3}
                position={[x, row.y, row.z]}
              >
                <meshStandardMaterial color={palette.keyboardKey} />
              </RoundedBox>
            );
          })
        )}
      </group>

      <group position={[0.88, -0.34, 1.08]} rotation={[0, 0, 0]}>
        <RoundedBox args={[0.18, 0.06, 0.13]} radius={0.06} smoothness={6}>
          <meshStandardMaterial color={palette.mouse} metalness={0.1} roughness={0.38} />
        </RoundedBox>
        <RoundedBox args={[0.074, 0.014, 0.11]} radius={0.02} smoothness={3} position={[-0.04, 0.03, -0.005]}>
          <meshStandardMaterial color={palette.keycap} />
        </RoundedBox>
        <RoundedBox args={[0.074, 0.014, 0.11]} radius={0.02} smoothness={3} position={[0.04, 0.03, -0.005]}>
          <meshStandardMaterial color={palette.keycap} />
        </RoundedBox>
        <mesh position={[0, 0.038, 0.0]}>
          <cylinderGeometry args={[0.007, 0.007, 0.035, 16]} />
          <meshStandardMaterial color={palette.keyboard} />
        </mesh>
      </group>
    </group>
  );
}

export default function WorkScene({ theme }) {
  const darkMode = theme === 'dark';
  const palette =
    darkMode
      ? {
          sceneBackground: '#10161f',
          floor: '#0f1822',
          rug: '#c37b1f',
          deskTop: '#e2e5ea',
          deskLeg: '#b79d7a',
          monitorBody: '#303745',
          monitorScreen: '#1d2430',
          head: '#e8c7ac',
          hair: '#2f221b',
          hoodie: '#7b7d80',
          shirt: '#cc7e74',
          pants: '#1f2a3a',
          shoe: '#1a1d24',
          sole: '#e5e8ef',
          glasses: '#2a2220',
          smile: '#6d4b3d',
          keyboard: '#6b4a34',
          keyboardEdge: '#2d1f16',
          keyboardKey: '#8a5c3a',
          mouse: '#2b3342',
          keycap: '#dce6f5',
          mobileBody: '#6d8fcb',
          mobileScreen: '#f4f6fa',
          mobileAccent: '#ffffff'
        }
      : {
          sceneBackground: '#f7f3eb',
          floor: '#f2eee6',
          rug: '#e69a2c',
          deskTop: '#f0f1f4',
          deskLeg: '#b89f7f',
          monitorBody: '#3b4048',
          monitorScreen: '#252c36',
          head: '#ebcfb8',
          hair: '#34261e',
          hoodie: '#8a8c8f',
          shirt: '#d58b80',
          pants: '#202c3e',
          shoe: '#181c23',
          sole: '#eef1f7',
          glasses: '#2b2422',
          smile: '#6f4d3f',
          keyboard: '#7a5438',
          keyboardEdge: '#322318',
          keyboardKey: '#936243',
          mouse: '#303949',
          keycap: '#e6edf9',
          mobileBody: '#86a8d8',
          mobileScreen: '#f8fbff',
          mobileAccent: '#ffffff'
        };

  return (
    <div className="scene-wrap" aria-label="Stylized software engineer workspace 3D illustration">
      <Canvas camera={{ position: [0.15, 0.2, 7.2], fov: 38 }}>
        <color attach="background" args={[palette.sceneBackground]} />
        <ambientLight intensity={0.95} />
        <directionalLight position={[3.5, 4.2, 3]} intensity={1.2} />
        <directionalLight position={[-3, 2, 1]} intensity={0.5} />

        <Float speed={0.5} rotationIntensity={0.02} floatIntensity={0.03}>
          <WorkspaceScene palette={palette} darkMode={darkMode} />
        </Float>

        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={1.75} minPolarAngle={1.15} />
      </Canvas>
    </div>
  );
}
