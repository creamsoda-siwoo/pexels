import React from 'react';
import { useGameStore } from '../store';
import { GameState } from '../types';
import { Zap, Activity, Cpu, Shield } from 'lucide-react';

export const UI: React.FC = () => {
  const { gameState, score, player, resetGame } = useGameStore();

  return (
    <div className="absolute inset-0 z-10 font-mono select-none overflow-hidden pointer-events-none text-[#00f3ff]">
      
      {/* HUD */}
      {gameState === GameState.PLAYING && (
        <>
            {/* Top Stats */}
            <div className="absolute top-6 right-6 flex items-center gap-4">
                <div className="ui-panel px-4 py-2 flex items-center gap-2 rounded bg-black/80">
                    <Activity size={20} className="text-[#ff00c1]" />
                    <span className="text-xl font-bold tracking-widest">{score} <span className="text-xs">UNITS</span></span>
                </div>
            </div>

            {/* Bottom HUD */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between pointer-events-auto">
                {/* Status Panel */}
                <div className="ui-panel p-4 rounded-lg bg-black/80 w-80">
                     <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                            <span className="bg-[#00f3ff] text-black px-1 font-bold text-xs">LVL.{player.level}</span>
                            <span className="text-sm tracking-wider">CYBER-NINJA</span>
                        </div>
                        <div className="text-xs text-[#ff00c1] animate-pulse">SYSTEM ONLINE</div>
                     </div>
                     
                     {/* HP Bar */}
                     <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1 text-gray-400">
                            <span>INTEGRITY</span>
                            <span>{Math.ceil(player.health)}/{player.maxHealth}</span>
                        </div>
                        <div className="h-2 bg-gray-900 w-full relative border border-gray-700">
                             <div 
                                className="absolute top-0 left-0 h-full bg-[#ff00c1] shadow-[0_0_10px_#ff00c1]" 
                                style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
                             />
                        </div>
                     </div>

                     {/* DATA (XP) Bar */}
                     <div>
                        <div className="flex justify-between text-xs mb-1 text-gray-400">
                            <span>DATA UPLOAD</span>
                            <span>{Math.floor((player.xp / player.maxXp) * 100)}%</span>
                        </div>
                        <div className="h-1 bg-gray-900 w-full relative">
                             <div 
                                className="absolute top-0 left-0 h-full bg-[#00f3ff] shadow-[0_0_10px_#00f3ff]" 
                                style={{ width: `${(player.xp / player.maxXp) * 100}%` }}
                             />
                        </div>
                     </div>
                </div>

                {/* Skills/Weapon Info */}
                <div className="flex gap-2">
                     <div className="ui-panel w-16 h-16 flex flex-col items-center justify-center bg-black/80 rounded">
                        <Zap size={24} className={player.isAttacking ? "text-white" : "text-[#00f3ff]"} />
                        <span className="text-[10px] mt-1">ATK</span>
                     </div>
                     <div className="ui-panel w-16 h-16 flex flex-col items-center justify-center bg-black/80 rounded opacity-50">
                        <Shield size={24} />
                        <span className="text-[10px] mt-1">DEF</span>
                     </div>
                </div>
            </div>
        </>
      )}

      {/* Menu */}
      {gameState === GameState.MENU && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center pointer-events-auto">
          {/* Grid Background Effect */}
          <div className="absolute inset-0 opacity-20" 
             style={{ 
                 backgroundImage: 'linear-gradient(#00f3ff 1px, transparent 1px), linear-gradient(90deg, #00f3ff 1px, transparent 1px)',
                 backgroundSize: '40px 40px'
             }} 
          />
          
          <h1 className="cyber-glitch text-7xl font-black italic tracking-tighter mb-2 z-10 text-white">
            CYBER BLADE
          </h1>
          <p className="text-[#ff00c1] tracking-[0.5em] text-sm mb-12 z-10">NEON CITY PROTOCOL</p>
          
          <button
            onClick={resetGame}
            className="group relative px-12 py-4 bg-transparent border-2 border-[#00f3ff] text-[#00f3ff] font-bold text-xl hover:bg-[#00f3ff] hover:text-black transition-all z-10 overflow-hidden"
          >
            <span className="relative z-10">INITIALIZE</span>
            <div className="absolute inset-0 bg-[#00f3ff] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
          </button>
        </div>
      )}

      {/* Game Over */}
      {gameState === GameState.GAME_OVER && (
        <div className="absolute inset-0 bg-red-900/20 backdrop-blur flex flex-col items-center justify-center pointer-events-auto">
          <h2 className="text-6xl font-black text-red-500 mb-4 cyber-glitch">SYSTEM FAILURE</h2>
          <div className="text-xl text-gray-300 mb-8 font-mono">NEURAL LINK SEVERED</div>
          <button
            onClick={resetGame}
            className="px-8 py-3 bg-[#ff00c1] text-white font-bold rounded hover:bg-white hover:text-black transition-colors shadow-[0_0_15px_#ff00c1]"
          >
            REBOOT SYSTEM
          </button>
        </div>
      )}
    </div>
  );
};