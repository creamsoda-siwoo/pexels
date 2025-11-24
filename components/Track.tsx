import React from 'react';
import { GAME_CONFIG } from '../types';
import { Box } from '@react-three/drei';

export const Track: React.FC = () => {
  const size = GAME_CONFIG.ARENA_SIZE;
  const wallHeight = 6;
  
  return (
    <group>
      {/* City Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size + 8, size + 8]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Neon Grid */}
      <gridHelper args={[size + 8, size / 2, '#00f3ff', '#1a1a1a']} position={[0, 0.05, 0]} />

      {/* Holographic Walls / Skyscrapers */}
      <Box args={[size + 8, wallHeight, 1]} position={[0, wallHeight/2, -size/2 - 1]}>
        <meshStandardMaterial color="#111" />
      </Box>
      <mesh position={[0, 0.1, -size/2 - 0.4]} rotation={[-Math.PI/2, 0, 0]}>
         <planeGeometry args={[size + 8, 2]} />
         <meshBasicMaterial color="#ff00c1" opacity={0.2} transparent />
      </mesh>

      <Box args={[size + 8, wallHeight, 1]} position={[0, wallHeight/2, size/2 + 1]}>
        <meshStandardMaterial color="#111" />
      </Box>
      <mesh position={[0, 0.1, size/2 + 0.4]} rotation={[-Math.PI/2, 0, 0]}>
         <planeGeometry args={[size + 8, 2]} />
         <meshBasicMaterial color="#00f3ff" opacity={0.2} transparent />
      </mesh>

      <Box args={[1, wallHeight, size + 6]} position={[-size/2 - 1, wallHeight/2, 0]}>
        <meshStandardMaterial color="#111" />
      </Box>
      <Box args={[1, wallHeight, size + 6]} position={[size/2 + 1, wallHeight/2, 0]}>
        <meshStandardMaterial color="#111" />
      </Box>

      {/* Neon Pillars / Server stacks */}
      {[-1, 1].map(x => [-1, 1].map(z => (
          <group key={`${x}-${z}`} position={[x * size/3, 0, z * size/3]}>
            <Box args={[2, 8, 2]} position={[0, 4, 0]} castShadow receiveShadow>
                <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
            </Box>
            {/* Neon Strips */}
            <Box args={[2.1, 0.2, 2.1]} position={[0, 2, 0]}>
                <meshBasicMaterial color="#00f3ff" />
            </Box>
            <Box args={[2.1, 0.2, 2.1]} position={[0, 6, 0]}>
                <meshBasicMaterial color="#ff00c1" />
            </Box>
          </group>
      )))}
    </group>
  );
};