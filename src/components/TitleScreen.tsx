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
const ThreeHeroPreview: React.FC<{ heroClass: HeroClass; gender: 'male' | 'female' }> = ({ heroClass, gender }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animId: number | null = null;
    let renderer: THREE.WebGLRenderer | null = null;

    try {
      const width = container.clientWidth || 240;
      const height = container.clientHeight || 180;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
      camera.position.set(0, 0.90, 2.7);
      camera.lookAt(0, 0.70, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;

      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffedd5, 2.2);
      dirLight.position.set(2.5, 4, 3);
      dirLight.castShadow = true;
      scene.add(dirLight);

      const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
      rimLight.position.set(-2.5, 2.5, -2.5);
      scene.add(rimLight);

      // Ornate Pedestal
      const pedestalGroup = new THREE.Group();
      const pedBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.75, 0.85, 0.15, 24),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.4 })
      );
      pedBase.position.y = -0.075;
      pedBase.receiveShadow = true;
      pedestalGroup.add(pedBase);

      const pedGoldRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.76, 0.025, 16, 32),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.8 })
      );
      pedGoldRing.rotation.x = Math.PI / 2;
      pedGoldRing.position.y = 0.0;
      pedestalGroup.add(pedGoldRing);

      scene.add(pedestalGroup);

      // Mock PlayerStats for Consistent 3D Hero Preview
      const dummyPlayer: PlayerStats = {
        name: 'Hero',
        heroClass,
        gender,
        level: 1,
        exp: 0,
        maxExp: 100,
        hp: 100,
        maxHp: 100,
        mp: 50,
        maxMp: 50,
        attack: 10,
        defense: 10,
        speed: 10,
        critical: 5,
        gold: 0,
        diamonds: 0,
        unlockedClasses: [],
        inventory: [],
        skills: [],
      };

      const heroMeshRes = createHumanHeroMesh(dummyPlayer);
      const heroGroup = heroMeshRes.group;
      heroGroup.position.set(0, 0.02, 0);
      scene.add(heroGroup);

      let time = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        time += 0.02;

        // Gentle revolving showcase & breathing
        heroGroup.rotation.y = time * 0.75;
        const breath = Math.sin(time * 3) * 0.015;
        if (heroMeshRes.torsoGroup) heroMeshRes.torsoGroup.position.y = 0.72 + breath;
        if (heroMeshRes.headGroup) heroMeshRes.headGroup.position.y = 1.10 + breath;
        if (heroMeshRes.leftArm) heroMeshRes.leftArm.rotation.x = Math.sin(time * 3) * 0.05;
        if (heroMeshRes.rightArm) heroMeshRes.rightArm.rotation.x = -Math.sin(time * 3) * 0.05;

        if (renderer) renderer.render(scene, camera);
      };

      animate();
    } catch (e) {
      console.error('ThreeHeroPreview error:', e);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (renderer) {
        renderer.dispose();
      }
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [heroClass, gender]);

  return (
    <div className="w-full h-36 sm:h-44 flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full" />
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
    <div className="flex flex-col items-center justify-start w-full max-w-5xl mx-auto p-2 sm:p-4 bg-slate-950 text-slate-100 rounded-xl border-2 border-amber-500/60 shadow-2xl font-mono relative overflow-y-auto max-h-[96dvh] touch-pan-y select-none">
      {/* Retro Atmospheric Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-950 pointer-events-none" />

      {/* Main Game Logo */}
      <div className="relative text-center my-1 space-y-0.5 z-10">
        <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/40 rounded-full text-amber-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3 h-3" />
          <span>Crónicas Pixel RPG Retro</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 drop-shadow-md tracking-tight">
          CRÓNICAS PIXEL
        </h1>
      </div>

      {/* 🎭 5 RANURAS DE PERSONAJES (SLOTS 1 AL 5) */}
      <div className="relative z-10 w-full mb-3 bg-slate-900/90 border border-amber-500/60 rounded-xl p-2.5 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400">
            <span>💾</span>
            <span>Ranuras de Personajes (Slots 1 a 5)</span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold">
            Selecciona una ranura para jugar o crear un héroe
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {(slots || []).map((slotData, idx) => {
            const isSelected = selectedSlot === idx;
            const player = slotData?.player;
            const isOccupied = !!player;

            return (
              <div
                key={idx}
                onClick={() => {
                  soundEngine.unlock();
                  soundEngine.playSfx('select');
                  setSelectedSlot(idx);
                  onSelectSlot(idx);
                }}
                className={`p-2 rounded-lg border transition cursor-pointer flex flex-col justify-between relative ${
                  isSelected
                    ? 'bg-amber-950/40 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.35)] ring-1 ring-amber-400'
                    : isOccupied
                    ? 'bg-slate-950/80 border-slate-700 hover:border-slate-500'
                    : 'bg-slate-950/40 border-dashed border-slate-800 hover:border-slate-600'
                }`}
              >
                {/* Header Slot Title */}
                <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                  <span className={isSelected ? 'text-amber-300' : 'text-slate-400'}>
                    Ranura {idx + 1}
                  </span>
                  {isOccupied && player && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Nv. {player.level || 1}
                    </span>
                  )}
                </div>

                {isOccupied && player ? (
                  <div className="space-y-1 my-0.5">
                    <div className="flex items-center space-x-1 font-bold text-xs text-slate-100 truncate">
                      <span>{CLASS_TAGS[player.heroClass]?.icon || '⚔️'}</span>
                      <span className="truncate">{player.name || 'Héroe'}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {player.gender === 'female' ? 'Mujer' : 'Hombre'} · {player.heroClass || 'Guerrero'}
                    </div>
                    <div className="text-[9px] text-slate-400 flex items-center justify-between">
                      <span className="text-yellow-300 font-bold">🪙 {(player.gold || 0).toLocaleString()}G</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-1 pt-1 mt-1 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundEngine.unlock();
                          soundEngine.playSfx('select');
                          onResumeGame(idx);
                        }}
                        className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded text-[10px] transition shadow flex items-center justify-center space-x-1 active:scale-95"
                      >
                        <Play className="w-2.5 h-2.5" />
                        <span>Jugar</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`¿Borrar el personaje "${player.name || 'Héroe'}" (Nv. ${player.level || 1}) de la Ranura ${idx + 1}?`)) {
                            soundEngine.playSfx('error');
                            onDeleteSlot(idx);
                          }
                        }}
                        className="p-1 bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 rounded text-[10px] transition active:scale-95"
                        title="Borrar Personaje"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-3 text-center space-y-1">
                    <span className="text-slate-500 text-base">➕</span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {isSelected ? 'Crear Héroe' : 'Vacía'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hero Creation Form & 3D Character Showcase Split View */}
      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3 bg-slate-900/85 rounded-xl p-2.5 sm:p-3 border border-slate-800 shadow-xl">
        {/* LEFT COLUMN: 3D REALISTIC FIGURINE SHOWCASE */}
        <div className="lg:col-span-5 flex flex-col items-center justify-between bg-slate-950/80 rounded-xl p-2.5 border border-slate-800 shadow-inner relative overflow-hidden">
          <div className="w-full flex justify-between items-center text-xs font-bold text-slate-300 mb-1 z-10">
            <span className="text-amber-400 flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Modelo 3D del Héroe</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
              {gender === 'female' ? '👧 Femenino' : '👦 Masculino'}
            </span>
          </div>

          {/* 3D Real-time Hero Figurine Preview */}
          <div className="relative w-full flex items-center justify-center">
            <ThreeHeroPreview heroClass={selectedClass} gender={gender} />
          </div>

          {/* Character Tag & Lore Snippet */}
          <div className="w-full text-center mt-1 z-10">
            <h3 className="text-sm font-bold text-amber-300 flex items-center justify-center space-x-1.5">
              <span>{CLASS_TAGS[selectedClass].icon}</span>
              <span>{classInfo.name}</span>
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-snug px-1">
              {classInfo.description}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: CLASS SELECTION, GENDER & ATTRIBUTES */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-2">
          {/* Active Slot Indicator for Creation */}
          <div className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[11px] font-bold text-amber-300 flex items-center justify-between">
            <span>✨ Creando personaje en: <strong>Ranura {selectedSlot + 1}</strong></span>
            {slots?.[selectedSlot] && (
              <span className="text-[10px] text-amber-400">⚠️ Se sobreescribirá la ranura</span>
            )}
          </div>

          {/* Row: Name Input & Gender Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5">
            <div className="sm:col-span-6">
              <label className="block text-[11px] font-bold text-slate-300 mb-0.5">Nombre del Héroe:</label>
              <input
                type="text"
                maxLength={16}
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500 shadow-inner"
                placeholder="Introduce tu nombre de héroe"
              />
            </div>

            {/* Gender Toggle: Hombre vs Mujer */}
            <div className="sm:col-span-6">
              <label className="block text-[11px] font-bold text-slate-300 mb-0.5">Género del Personaje:</label>
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.unlock();
                    soundEngine.playSfx('select');
                    setGender('female');
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition flex items-center justify-center space-x-1 ${
                    gender === 'female'
                      ? 'bg-emerald-950/70 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      : 'bg-slate-950/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>👧 Mujer (Elfa)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.unlock();
                    soundEngine.playSfx('select');
                    setGender('male');
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition flex items-center justify-center space-x-1 ${
                    gender === 'male'
                      ? 'bg-sky-950/70 border-sky-400 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                      : 'bg-slate-950/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>👦 Hombre</span>
                </button>
              </div>
            </div>
          </div>

          {/* Class Selection Grid */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Selecciona tu Clase:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
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
                    className={`p-1.5 rounded-lg border text-left transition flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-amber-950/80 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-base">{CLASS_TAGS[cls].icon}</span>
                    <div className="leading-tight truncate">
                      <div className="text-xs font-bold truncate">{cls}</div>
                      <div className="text-[9px] text-slate-400 truncate">{CLASS_TAGS[cls].tag.split('/')[0]}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-1 flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={handleStart}
              className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-lg text-xs transition shadow-lg flex items-center justify-center space-x-1.5 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Comenzar Aventura en Ranura {selectedSlot + 1}</span>
            </button>

            {onStartShowcaseGame && (
              <button
                type="button"
                onClick={handleShowcase}
                className="py-2 px-3 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/80 text-purple-300 font-bold rounded-lg text-xs transition flex items-center space-x-1 active:scale-95"
                title="Modo Creador (Nivel 75 y Tier 8)"
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span className="hidden sm:inline">Desbloqueado</span>
              </button>
            )}

            {onOpenPrologue && (
              <button
                type="button"
                onClick={onOpenPrologue}
                className="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold rounded-lg text-xs transition flex items-center space-x-1"
                title="Historia y Prólogo"
              >
                <span>📜 Lore</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="py-2 px-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 font-bold rounded-lg text-xs transition"
              title="Salón de la Fama"
            >
              <Trophy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
