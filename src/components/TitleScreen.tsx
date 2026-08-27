import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { HeroClass, GameSaveData, PlayerStats } from '../types';
import { HERO_CLASSES } from '../data/gameData';
import { createHumanHeroMesh } from '../utils/three3dModels';
import { soundEngine } from '../utils/soundEngine';
import { Trophy, Play, Sparkles, Eye } from 'lucide-react';

const titleGLTFLoader = new GLTFLoader();
const titleGLTFCache: Record<string, THREE.Group> = {};

function getClassGenderModelPath(heroClass: HeroClass, gender: 'male' | 'female' = 'female'): string {
  const classKey =
    heroClass === 'Guerrero' ? 'hero_warrior' :
    heroClass === 'Mago' ? 'hero_mage' :
    heroClass === 'Pícaro' ? 'hero_rogue' :
    heroClass === 'Paladín' ? 'hero_paladin' :
    heroClass === 'Nigromante' ? 'hero_necromancer' :
    heroClass === 'Arquero' ? 'hero_archer' : 'hero_berserker';
  return `/models/${classKey}_${gender}.glb`;
}


import { getHeroSpriteCanvas } from '../utils/pixelSpriteGenerator';

interface TitleScreenProps {
  slots: (GameSaveData | null)[];
  activeSlotIndex: number;
  onSelectSlot: (slotIndex: number) => void;
  onStartNewGame: (playerName: string, heroClass: HeroClass, gender?: 'male' | 'female', slotIndex?: number) => void;
  onStartShowcaseGame?: (playerName: string, heroClass: HeroClass, gender?: 'male' | 'female', slotIndex?: number) => void;
  onResumeGame: (slotIndex: number) => void;
  onDeleteSlot: (slotIndex: number) => void;
  onOpenLeaderboard: () => void;
  onOpenPrologue?: () => void;
}

// Escaparate 3D de Personajes con Iluminación Dinámica y Pedestal
const PixelHeroPreview: React.FC<{ heroClass: HeroClass; gender: 'male' | 'female' }> = ({ heroClass, gender }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.04;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2 + 10;

      ctx.clearRect(0, 0, w, h);

      // 1. Pedestal de Invocación Rúnico
      const pedBob = Math.sin(time * 2) * 3;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 34, 45, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Base del pedestal
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 28 + pedBob, 42, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 26 + pedBob, 38, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Aura y Destellos Mágicos
      const auraColor = heroClass === 'Guerrero' ? 'rgba(239, 68, 68, 0.2)' : heroClass === 'Mago' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(16, 185, 129, 0.2)';
      ctx.fillStyle = auraColor;
      ctx.beginPath();
      ctx.arc(cx, cy - 8 + pedBob, 36 + Math.sin(time * 4) * 4, 0, Math.PI * 2);
      ctx.fill();

      // 3. Sprite 2.5D del Héroe
      const breath = Math.sin(time * 3) * 2;
      const hX = cx;
      const hY = cy - 14 + pedBob + breath;

      // Sombra
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(hX, cy + 24 + pedBob, 20, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Torso / Traje de Clase
      const suitColor = heroClass === 'Guerrero' ? '#dc2626' : heroClass === 'Mago' ? '#3b82f6' : '#059669';
      ctx.fillStyle = suitColor;
      ctx.fillRect(hX - 10, hY + 4, 20, 22);

      // Cabeza y Rostro
      ctx.fillStyle = '#fde047'; // Tono piel
      ctx.fillRect(hX - 8, hY - 14, 16, 16);
      // Cabello
      ctx.fillStyle = gender === 'female' ? '#b45309' : '#1e293b';
      ctx.fillRect(hX - 9, hY - 18, 18, 8);
      if (gender === 'female') {
        ctx.fillRect(hX - 11, hY - 14, 3, 16);
        ctx.fillRect(hX + 8, hY - 14, 3, 16);
      }
      // Ojos
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(hX - 5, hY - 8, 3, 4);
      ctx.fillRect(hX + 2, hY - 8, 3, 4);

      // Botas
      ctx.fillStyle = '#78350f';
      ctx.fillRect(hX - 8, hY + 24, 6, 8);
      ctx.fillRect(hX + 2, hY + 24, 6, 8);

      // Armas de Clase
      if (heroClass === 'Guerrero') {
        // Espada y Escudo
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(hX + 12, hY - 12, 4, 28);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(hX + 9, hY + 8, 10, 3);
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(hX - 16, hY + 4, 6, 16);
      } else if (heroClass === 'Mago') {
        // Báculo Mágico con Orbe Radiante
        ctx.fillStyle = '#78350f';
        ctx.fillRect(hX + 12, hY - 18, 4, 38);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(hX + 14, hY - 20, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(hX + 12, hY - 22, 3, 3);
      } else {
        // Pícaro: Dagas Gemelas
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(hX - 14, hY + 6, 3, 16);
        ctx.fillRect(hX + 11, hY + 6, 3, 16);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [heroClass, gender]);

  return (
    <div className="w-full h-full flex items-center justify-center select-none">
      <canvas
        ref={canvasRef}
        width={160}
        height={140}
        className="w-full h-full object-contain"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};

export const TitleScreen: React.FC<TitleScreenProps> = ({
  slots = [],
  activeSlotIndex = 0,
  onSelectSlot,
  onStartNewGame,
  onStartShowcaseGame,
  onResumeGame,
  onDeleteSlot,
  onOpenLeaderboard,
  onOpenPrologue,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<number>(activeSlotIndex || 0);
  const [selectedClass, setSelectedClass] = useState<HeroClass>('Guerrero');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [playerName, setPlayerName] = useState('Héroe');

  const classInfo = HERO_CLASSES[selectedClass];

  const handleStart = () => {
    soundEngine.unlock();
    soundEngine.playSfx('levelup');
    onStartNewGame(playerName.trim() || 'Héroe', selectedClass, gender, selectedSlot);
  };

  const handleShowcase = () => {
    soundEngine.unlock();
    soundEngine.playSfx('levelup');
    onStartShowcaseGame?.(playerName.trim() || 'Héroe', selectedClass, gender, selectedSlot);
  };

  const ALL_HERO_CLASSES: HeroClass[] = [
    'Guerrero',
    'Mago',
    'Pícaro',
    'Paladín',
    'Nigromante',
    'Arquero',
    'Berserker',
  ];

  const CLASS_TAGS: Record<HeroClass, { tag: string; icon: string }> = {
    Guerrero: { tag: 'Tanque / Espada', icon: '⚔️' },
    Mago: { tag: 'Arcano / Hechizos', icon: '🪄' },
    Pícaro: { tag: 'Asesino / Dagas', icon: '🗡️' },
    Paladín: { tag: 'Sagrado / Escudo', icon: '🛡️' },
    Nigromante: { tag: 'Sombras / Almas', icon: '💀' },
    Arquero: { tag: 'Tirador / Arcos', icon: '🏹' },
    Berserker: { tag: 'Furia / Hachas', icon: '🪓' },
  };

  return (
    <div
      className="flex flex-col justify-between w-full max-w-4xl mx-auto p-2 sm:p-4 bg-slate-950 text-slate-100 rounded-2xl border-2 border-amber-500/60 shadow-2xl font-mono relative overflow-hidden h-full max-h-[100dvh] select-none"
      style={{
        paddingTop: 'max(0.5rem, env(safe-area-inset-top, 0.5rem))',
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))',
      }}
    >
      {/* Retro Atmospheric Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-950 pointer-events-none" />

      {/* 1. Header: Logo & System Buttons */}
      <div className="relative z-10 flex items-center justify-between gap-2 border-b border-amber-500/30 pb-1.5 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <h1 className="text-sm sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 tracking-tight">
            CRÓNICAS PIXEL RPG
          </h1>
        </div>

        <div className="flex items-center gap-1">
          {onOpenPrologue && (
            <button
              type="button"
              onClick={onOpenPrologue}
              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold rounded-lg text-[10px] sm:text-xs transition flex items-center gap-1"
            >
              <span>📜 Lore</span>
            </button>
          )}
          <button
            type="button"
            onClick={onOpenLeaderboard}
            className="p-1 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 font-bold rounded-lg text-xs transition"
            title="Salón de la Fama"
          >
            <Trophy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Horizontal Slot Selector Carousel (Píldoras Ergonómicas de Ranuras) */}
      <div className="relative z-10 my-1 flex-shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {(slots || []).map((slotData, idx) => {
            const isSelected = selectedSlot === idx;
            const player = slotData?.player;
            const isOccupied = !!player;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  soundEngine.unlock();
                  soundEngine.playSfx('select');
                  setSelectedSlot(idx);
                  onSelectSlot(idx);
                }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl border transition flex items-center gap-2 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-lg scale-102 ring-2 ring-amber-400/50'
                    : isOccupied
                    ? 'bg-slate-900/90 text-amber-300 border-slate-700 hover:border-slate-500 font-bold'
                    : 'bg-slate-950/60 text-slate-400 border-dashed border-slate-800 hover:border-slate-600'
                }`}
              >
                <span className="text-xs">
                  {isOccupied ? (player ? CLASS_TAGS[player.heroClass]?.icon || '⚔️' : '💾') : '➕'}
                </span>
                <div className="text-left leading-tight">
                  <div className="text-[11px] font-bold">
                    {isOccupied && player ? player.name : `Ranura ${idx + 1}`}
                  </div>
                  <div className={`text-[9px] ${isSelected ? 'text-slate-900/80 font-bold' : 'text-slate-400'}`}>
                    {isOccupied && player ? `Nv.${player.level}` : 'Vacía'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Hero Stage Card & Creation Form (Zero-Scroll Compact View) */}
      <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-12 gap-2 bg-slate-900/85 rounded-xl p-2 sm:p-3 border border-slate-800 shadow-xl overflow-y-auto md:overflow-hidden min-h-0">
        {/* Left Column: 2.5D Hero Stage & Name */}
        <div className="md:col-span-5 flex flex-row md:flex-col items-center justify-between bg-slate-950/80 rounded-xl p-2 border border-slate-800/80 shadow-inner">
          {/* 2.5D Hero Canvas */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 flex items-center justify-center">
            <PixelHeroPreview heroClass={selectedClass} gender={gender} />
          </div>

          {/* Character Quick Info */}
          <div className="flex-1 md:w-full flex flex-col justify-center text-left md:text-center pl-2 md:pl-0">
            <div className="text-xs sm:text-sm font-black text-amber-300 truncate">
              {CLASS_TAGS[selectedClass].icon} {classInfo.name}
            </div>
            <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
              {classInfo.description}
            </div>
            {/* Gender Toggle */}
            <div className="flex gap-1 mt-1.5">
              <button
                type="button"
                onClick={() => {
                  soundEngine.unlock();
                  soundEngine.playSfx('select');
                  setGender('female');
                }}
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition ${
                  gender === 'female'
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                👧 Mujer
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.unlock();
                  soundEngine.playSfx('select');
                  setGender('male');
                }}
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition ${
                  gender === 'male'
                    ? 'bg-sky-950 border-sky-400 text-sky-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                👦 Hombre
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Name Input & Class Selection Pills */}
        <div className="md:col-span-7 flex flex-col justify-between gap-1.5 overflow-hidden">
          {/* Name Input */}
          <div>
            <label className="block text-[10px] sm:text-xs font-bold text-slate-300 mb-0.5">Nombre del Héroe:</label>
            <input
              type="text"
              maxLength={16}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500 shadow-inner"
              placeholder="Introduce tu nombre"
            />
          </div>

          {/* Class Grid Selector */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <label className="block text-[10px] sm:text-xs font-bold text-slate-300 mb-1">Clase del Personaje:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
              {ALL_HERO_CLASSES.map((cls) => {
                const isSelected = selectedClass === cls;
                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => {
                      soundEngine.unlock();
                      soundEngine.playSfx('select');
                      setSelectedClass(cls);
                    }}
                    className={`p-1.5 sm:p-2 rounded-xl border text-left transition flex items-center gap-1.5 min-h-[38px] ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-md ring-1 ring-amber-400'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-base flex-shrink-0">{CLASS_TAGS[cls].icon}</span>
                    <span className="text-[11px] font-bold truncate">{cls}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Action Bar: Big Touch-Friendly Buttons (Min 48px height) */}
      <div className="relative z-10 mt-2 pt-1 flex items-center gap-2 flex-shrink-0">
        {slots?.[selectedSlot]?.player ? (
          <button
            type="button"
            onClick={() => {
              soundEngine.unlock();
              soundEngine.playSfx('select');
              onResumeGame(selectedSlot);
            }}
            className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 active:scale-98 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition shadow-xl flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>CONTINUAR PARTIDA (Nv.{slots[selectedSlot]?.player?.level})</span>
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleStart}
              className="flex-1 h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-98 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition shadow-xl flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>¡COMENZAR (NV. 1)!</span>
            </button>
            <button
              type="button"
              onClick={handleShowcase}
              className="flex-1 h-12 bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 active:scale-98 text-white font-black rounded-xl text-xs sm:text-sm transition shadow-xl flex items-center justify-center gap-1.5 border border-amber-400/60"
              title="Iniciar con Nivel 99, todas las zonas, armas Tier 8 y oro al máximo"
            >
              <span>👑 NV. 99 (DESBLOQUEAR TODO)</span>
            </button>
          </>
        )}

        {slots?.[selectedSlot]?.player && (
          <button
            type="button"
            onClick={() => {
              if (confirm(`¿Borrar el personaje de la Ranura ${selectedSlot + 1}?`)) {
                soundEngine.playSfx('error');
                onDeleteSlot(selectedSlot);
              }
            }}
            className="h-12 px-3 bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 font-bold rounded-xl text-xs transition active:scale-95 flex items-center justify-center"
            title="Borrar Personaje"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
};
