import React from 'react';
import { useGameStore } from '../store';
import { Box, Sphere, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { FloatingText } from '../types';

const DamageNumber: React.FC<{ data: FloatingText }> = ({ data }) => {
    const ref = React.useRef<any>();
    useFrame((state, delta) => {
        if(ref.current) {
            ref.current.position.y += data.velocityY * delta;
            ref.current.material.opacity = data.life;
        }
    });
    return (
        <Text
            ref={ref}
            position={[data.position.x, 2.5, data.position.z]}
            fontSize={0.8}
            font="https://fonts.gstatic.com/s/vt323/v17/pxiKyp0ihIEF2isRFJ4.woff2" // Tech-ish font
            color={data.color}
            anchorX="center"
            anchorY="middle"
        >
            {data.text}
        </Text>
    );
};

export const Obstacles: React.FC = () => {
  const { enemies, texts } = useGameStore();

  return (
    <group>
      {enemies.map(e => (
        <group key={e.id} position={[e.position.x, 0, e.position.z]}>
          {/* DRONE */}
          {e.type === 'DRONE' && (
              <group position={[0, 1.2, 0]}>
                  <Sphere args={[0.4, 8, 8]} castShadow>
                      <meshStandardMaterial color={e.isHit > 0 ? '#fff' : '#444'} metalness={0.8} />
                  </Sphere>
                  {/* Eye */}
                  <Sphere args={[0.15, 8, 8]} position={[0, 0, 0.3]}>
                      <meshBasicMaterial color="#ef4444" />
                  </Sphere>
                  {/* Hover effect rings */}
                  <mesh rotation={[Math.PI/2, 0, 0]}>
                      <torusGeometry args={[0.6, 0.05, 4, 16]} />
                      <meshBasicMaterial color="#ef4444" />
                  </mesh>
              </group>
          )}

          {/* CYBORG */}
          {e.type === 'CYBORG' && (
              <group position={[0, 0, 0]}>
                  <Box args={[0.6, 1.4, 0.4]} position={[0, 0.7, 0]} castShadow>
                      <meshStandardMaterial color={e.isHit > 0 ? '#fff' : '#2d3748'} metalness={0.5} />
                  </Box>
                  <Box args={[0.4, 0.1, 0.2]} position={[0, 1.2, 0.21]}>
                      <meshBasicMaterial color="#facc15" />
                  </Box>
              </group>
          )}

          {/* MECH */}
          {e.type === 'MECH' && (
              <group position={[0, 0, 0]}>
                  <Box args={[1.8, 1.5, 1.8]} position={[0, 0.75, 0]} castShadow>
                      <meshStandardMaterial color={e.isHit > 0 ? '#fff' : '#1e293b'} metalness={0.8} />
                  </Box>
                  <Box args={[1, 0.8, 1]} position={[0, 1.8, 0]}>
                      <meshStandardMaterial color={e.isHit > 0 ? '#fff' : '#334155'} />
                  </Box>
                  {/* Glowing vents */}
                  <Box args={[1.6, 0.2, 1.9]} position={[0, 0.5, 0]}>
                      <meshBasicMaterial color="#ff00c1" />
                  </Box>
              </group>
          )}
          
          {/* HP Bar */}
          <group position={[0, e.type === 'MECH' ? 3.5 : 2.5, 0]}>
             <mesh position={[-0.5 + (e.health/e.maxHealth)*0.5, 0, 0]}>
                <planeGeometry args={[(e.health/e.maxHealth), 0.1]} />
                <meshBasicMaterial color="#00f3ff" />
             </mesh>
          </group>
        </group>
      ))}

      {texts.map(t => <DamageNumber key={t.id} data={t} />)}
    </group>
  );
};