import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Track } from './Track';
import { Player } from './Player';
import { Obstacles } from './Obstacles';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { useGameStore } from '../store';
import { Vector3 } from 'three';
import { GameState } from '../types';

const GameLoop = () => {
    const { gameTick, player, gameState } = useGameStore();
    
    useFrame((state, delta) => {
        const dt = Math.min(delta, 0.1);
        gameTick(dt, state.clock.elapsedTime);

        if (gameState === GameState.PLAYING) {
            const targetPos = new Vector3(player.position.x + 8, 14, player.position.z + 8);
            state.camera.position.lerp(targetPos, 0.1);
            state.camera.lookAt(player.position.x, 0, player.position.z);
        }
    });
    return null;
}

const InputHandler = () => {
    const { setInputVector, playerAttack } = useGameStore();
    const keys = useRef<Set<string>>(new Set());

    useEffect(() => {
        const updateInput = () => {
            let x = 0;
            let z = 0;
            if (keys.current.has('ArrowUp') || keys.current.has('KeyW')) z -= 1;
            if (keys.current.has('ArrowDown') || keys.current.has('KeyS')) z += 1;
            if (keys.current.has('ArrowLeft') || keys.current.has('KeyA')) x -= 1;
            if (keys.current.has('ArrowRight') || keys.current.has('KeyD')) x += 1;
            setInputVector(x, z);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            keys.current.add(e.code);
            updateInput();
            if (e.code === 'Space') playerAttack();
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            keys.current.delete(e.code);
            updateInput();
        };
        const handleMouseDown = () => playerAttack();

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('mousedown', handleMouseDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('mousedown', handleMouseDown);
        };
    }, [setInputVector, playerAttack]);
    
    return null;
}

export const World: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0 bg-black">
      <Canvas 
        shadows 
        camera={{ position: [8, 14, 8], fov: 40 }}
        gl={{ toneMappingExposure: 1.1 }}
      >
        <GameLoop />
        <InputHandler />

        {/* Dark City Ambiance */}
        <ambientLight intensity={0.2} color="#4c1d95" />
        <directionalLight 
            position={[-5, 20, -10]} 
            intensity={0.8} 
            color="#2563eb"
            castShadow 
        />
        {/* Neon Accents */}
        <pointLight position={[10, 5, 10]} intensity={2} color="#00f3ff" distance={15} />
        <pointLight position={[-10, 5, -10]} intensity={2} color="#ff00c1" distance={15} />

        <Player />
        <Track />
        <Obstacles />
        
        <EffectComposer disableNormalPass>
            <Bloom intensity={1.5} luminanceThreshold={0.2} radius={0.6} />
            <ChromaticAberration offset={[0.002, 0.002]} />
            <Vignette eskil={false} offset={0.1} darkness={1.0} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};