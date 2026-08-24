import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { HeroClass, GameSaveData, PlayerStats } from '../types';
import { HERO_CLASSES } from '../data/gameData';
import { createHumanHeroMesh } from '../utils/three3dModels';
import { soundEngine } from '../utils/soundEngine';
import { Trophy, Play, Sparkles, Eye, User, Sparkle } from 'lucide-react';

const titleGLTFLoader = new GLTFLoader();
const titleGLTFCache: Record<string, THREE.Group> = {};

export function getClassGenderModelPath(heroClass: HeroClass, gender: 'male' | 'female' = 'female'): string {
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
  hasSavedGame: boolean;
  savedGameData: GameSaveData | null;
  onStartNewGame: (playerName: string, heroClass: HeroClass, gender?: 'male' | 'female') => void;
  onStartShowcaseGame?: (playerName: string, heroClass: HeroClass, gender?: 'male' | 'female') => void;
  onResumeGame: () => void;
  onOpenLeaderboard: () => void;
  onOpenPrologue?: () => void;
}

// Escaparate 3D de Personajes con Iluminación Dinámica y Pedestal
const ThreeHeroPreview: React.FC<{ heroClass: HeroClass; gender: 'male' | 'female' }> = ({ heroClass, gender }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0.90, 2.7);
    camera.lookAt(0, 0.70, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
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

    let animId: number;
    let time = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.02;

      // Gentle revolving showcase & breathing
      heroGroup.rotation.y = time * 0.75;
      const breath = Math.sin(time * 3) * 0.015;
      heroMeshRes.torsoGroup.position.y = 0.72 + breath;
      heroMeshRes.headGroup.position.y = 1.10 + breath;
      heroMeshRes.leftArm.rotation.x = Math.sin(time * 3) * 0.05;
      heroMeshRes.rightArm.rotation.x = -Math.sin(time * 3) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [heroClass, gender]);

  return (
    <div className="w-full h-36 sm:h-48 flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};

export const TitleScreen: React.FC<TitleScreenProps> = ({
  hasSavedGame,
  savedGameData,
  onStartNewGame,
  onStartShowcaseGame,
  onResumeGame,
  onOpenLeaderboard,
  onOpenPrologue,
}) => {
  const [selectedClass, setSelectedClass] = useState<HeroClass>('Guerrero');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [playerName, setPlayerName] = useState('Héroe');

  const classInfo = HERO_CLASSES[selectedClass];

  const handleStart = () => {
    soundEngine.unlock();
    soundEngine.playSfx('levelup');
    onStartNewGame(playerName.trim() || 'Héroe', selectedClass, gender);
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
    <div className="flex flex-col items-center justify-start w-full max-w-5xl mx-auto p-2 sm:p-5 bg-slate-950 text-slate-100 rounded-xl border-2 border-amber-500/60 shadow-2xl font-mono relative overflow-y-auto max-h-[96dvh] touch-pan-y select-none">
      {/* Retro Atmospheric Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-950 pointer-events-none" />

      {/* Main Game Logo */}
      <div className="relative text-center my-1 sm:my-2 space-y-0.5 sm:space-y-1 z-10">
        <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/40 rounded-full text-amber-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3 h-3" />
          <span>Crónicas Pixel RPG Retro</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 drop-shadow-md tracking-tight">
          CRÓNICAS PIXEL
        </h1>
      </div>

      {/* Resume Save Prompt if exists */}
      {hasSavedGame && savedGameData && (
        <div className="relative z-10 w-full max-w-lg bg-slate-900/90 border border-amber-500/80 rounded-xl p-2 sm:p-3 mb-2 text-center shadow-lg">
          <div className="text-[11px] sm:text-xs text-amber-400 font-bold mb-0.5">
            💾 Partida Guardada Encontrada
          </div>
          <div className="text-[11px] sm:text-xs text-slate-300 font-bold">
            {savedGameData.player.name} · Nivel {savedGameData.player.level} ({savedGameData.player.heroClass})
          </div>
          <button
            onClick={() => {
              soundEngine.unlock();
              soundEngine.playSfx('select');
              onResumeGame();
            }}
            className="mt-1.5 w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg transition text-xs shadow-md flex items-center justify-center space-x-2 active:scale-95"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Continuar Aventura Guardada</span>
          </button>
        </div>
      )}

      {/* Hero Creation Form & 3D Character Showcase Split View */}
      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-4 bg-slate-900/85 rounded-xl p-2.5 sm:p-4 border border-slate-800 shadow-xl">
        {/* LEFT COLUMN: 3D REALISTIC FIGURINE SHOWCASE */}
        <div className="lg:col-span-5 flex flex-col items-center justify-between bg-slate-950/80 rounded-xl p-3 border border-slate-800 shadow-inner relative overflow-hidden">
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
          <div className="w-full text-center mt-1.5 z-10">
            <h3 className="text-base font-bold text-amber-300 flex items-center justify-center space-x-2">
              <span>{CLASS_TAGS[selectedClass].icon}</span>
              <span>{classInfo.name}</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug px-2">
              {classInfo.description}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: CLASS SELECTION, GENDER & ATTRIBUTES */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-2 sm:space-y-3">
          {/* Row: Name Input & Gender Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 sm:gap-2.5">
            <div className="sm:col-span-6">
              <label className="block text-[11px] sm:text-xs font-bold text-slate-300 mb-0.5">Nombre del Héroe:</label>
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
              <label className="block text-[11px] sm:text-xs font-bold text-slate-300 mb-0.5">Género del Personaje:</label>
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
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span>👧</span>
                  <span>Mujer (Elfa)</span>
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
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span>👦</span>
                  <span>Hombre</span>
                </button>
              </div>
            </div>
          </div>

          {/* 7 Class Selector Grid */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold text-slate-300 mb-1">Selecciona tu Clase:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-1.5">
              {ALL_HERO_CLASSES.map((c) => {
                const isSelected = selectedClass === c;

                return (
                  <button
                    key={c}
                    onClick={() => {
                      soundEngine.unlock();
                      soundEngine.playSfx('select');
                      setSelectedClass(c);
                    }}
                    className={`p-1.5 rounded-lg border text-left flex items-center space-x-1.5 transition ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-lg">{CLASS_TAGS[c].icon}</span>
                    <div className="truncate">
                      <div className="text-[11px] sm:text-xs font-bold leading-none">{c}</div>
                      <div className="text-[8px] sm:text-[9px] text-slate-400 truncate mt-0.5">
                        {CLASS_TAGS[c].tag.split('/')[0]}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              onClick={handleStart}
              className="flex-1 min-w-[130px] py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg transition text-xs shadow-lg flex items-center justify-center space-x-1.5 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Comenzar Aventura</span>
            </button>

            {onStartShowcaseGame && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.unlock();
                  soundEngine.playSfx('levelup');
                  onStartShowcaseGame(playerName.trim() || classInfo.name, selectedClass, gender);
                }}
                className="py-2.5 px-3 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-purple-200 border border-purple-500/60 rounded-lg transition text-xs font-bold flex items-center justify-center space-x-1 shadow-lg active:scale-95"
                title="Comenzar con Nivel 75, 99.999 Oro, Equipo Tier 8 Divino, Todas las Habilidades y las 8 Zonas Desbloqueadas"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span>⚡ Desbloqueado</span>
              </button>
            )}

            {onOpenPrologue && (
              <button
                onClick={() => {
                  soundEngine.unlock();
                  soundEngine.playSfx('select');
                  onOpenPrologue();
                }}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold border border-amber-500/40 rounded-lg transition text-xs flex items-center justify-center space-x-1 active:scale-95"
                title="Descubrir la Historia & Lore de Aethelgard"
              >
                <span>📜 Lore</span>
              </button>
            )}

            <button
              onClick={() => {
                soundEngine.unlock();
                soundEngine.playSfx('select');
                onOpenLeaderboard();
              }}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-lg transition flex items-center justify-center active:scale-95"
              title="Tabla de Clasificación Global"
            >
              <Trophy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
