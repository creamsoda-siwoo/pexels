import React, { useRef } from 'react';
import { useGameStore } from '../store';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils } from 'three';
import { Box, Sphere } from '@react-three/drei';

export const Player: React.FC = () => {
  const { player } = useGameStore();
  const groupRef = useRef<Group>(null);
  const weaponRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
        groupRef.current.position.x = MathUtils.lerp(groupRef.current.position.x, player.position.x, 0.2);
        groupRef.current.position.z = MathUtils.lerp(groupRef.current.position.z, player.position.z, 0.2);
        groupRef.current.rotation.y = player.rotation;
    }

    if (weaponRef.current) {
        // Fast slash animation
        const targetRot = player.isAttacking ? -Math.PI / 1.2 : 0;
        const currentRot = weaponRef.current.rotation.y;
        weaponRef.current.rotation.y = MathUtils.lerp(currentRot, targetRot, 0.5);
        
        if (!player.isAttacking && Math.abs(currentRot) > 0.1) {
             weaponRef.current.rotation.y = MathUtils.lerp(currentRot, 0, 0.2);
        }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Cyber Ninja Body */}
      <group position={[0, 0, 0]}>
        {/* Legs */}
        <Box args={[0.2, 0.7, 0.2]} position={[-0.15, 0.35, 0]} castShadow>
             <meshStandardMaterial color="#333" />
        </Box>
        <Box args={[0.2, 0.7, 0.2]} position={[0.15, 0.35, 0]} castShadow>
             <meshStandardMaterial color="#333" />
        </Box>
        
        {/* Torso */}
        <Box args={[0.5, 0.6, 0.25]} position={[0, 1.0, 0]} castShadow>
            <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
        </Box>
        {/* Glowing Core */}
        <Sphere args={[0.1, 8, 8]} position={[0, 1.0, 0.15]}>
             <meshBasicMaterial color="#00f3ff" />
        </Sphere>

        {/* Head */}
        <Box args={[0.3, 0.35, 0.3]} position={[0, 1.55, 0]} castShadow>
             <meshStandardMaterial color="#111" metalness={0.9} />
        </Box>
        {/* Visor */}
        <Box args={[0.32, 0.08, 0.2]} position={[0, 1.55, 0.1]}>
             <meshBasicMaterial color="#ff00c1" />
        </Box>

        {/* Scarf / Streamer */}
        <Box args={[0.1, 0.8, 0.05]} position={[0, 1.4, -0.2]} rotation={[0.5, 0, 0]}>
             <meshBasicMaterial color="#00f3ff" transparent opacity={0.6} />
        </Box>
      </group>

      {/* Weapon Arm */}
      <group position={[0.35, 1.1, 0]} ref={weaponRef} rotation={[0, 0, 0]}>
         <Box args={[0.1, 0.4, 0.1]} position={[0, -0.1, 0]}>
            <meshStandardMaterial color="#333" />
         </Box>
         {/* Laser Katana */}
         <Box args={[0.05, 0.05, 1.8]} position={[0, 0, 0.8]}>
            <meshBasicMaterial color={player.isAttacking ? "#ffffff" : "#00f3ff"} />
         </Box>
         {/* Glow effect geometry */}
         <Box args={[0.1, 0.02, 1.7]} position={[0, 0, 0.8]}>
             <meshBasicMaterial color="#00f3ff" transparent opacity={0.4} />
         </Box>
      </group>

      {/* Player Light */}
      <pointLight position={[0, 2, 0]} intensity={3} distance={6} color="#00f3ff" />
    </group>
  );
};