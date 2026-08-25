import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PlayerStats, EquipmentItem, Enemy } from '../types';
import { createHumanHeroMesh, createRealisticEnemyMesh } from '../utils/three3dModels';

const battleHeroGLTFLoader = new GLTFLoader();
let cachedBattleHeroGLTF: THREE.Group | null = null;


interface ThreeBattleCanvasProps {
  player: PlayerStats;
  equipment?: {
    weapon: EquipmentItem | null;
    armor: EquipmentItem | null;
    accessory: EquipmentItem | null;
  };
  enemy: Enemy;
  playerIsAttacking: boolean;
  playerIsHit: boolean;
  isDefending: boolean;
  enemyIsAttacking: boolean;
  enemyIsHit: boolean;
  activeEffect?: 'physical' | 'fire' | 'ice' | 'thunder' | 'holy' | 'shadow' | 'heal' | null;
}

// Procedural texture helpers for environment
function createGrassFieldTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base grass green gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#38a169');
  grad.addColorStop(0.5, '#2f855a');
  grad.addColorStop(1, '#276749');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle grass blades & dappled texture
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const len = 4 + Math.random() * 8;
    ctx.strokeStyle = Math.random() > 0.5 ? '#48bb78' : '#22543d';
    ctx.lineWidth = 1 + Math.random() * 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 4, y - len);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

function createDirtPedestalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Radial earthen soil gradient
  const radial = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
  radial.addColorStop(0, '#b45309');
  radial.addColorStop(0.65, '#92400e');
  radial.addColorStop(0.9, '#78350f');
  radial.addColorStop(1, '#451a03');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, 256, 256);

  // Soil pebble noise
  for (let i = 0; i < 600; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#d97706' : '#713f12';
    ctx.beginPath();
    ctx.arc(Math.random() * 256, Math.random() * 256, 1 + Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function createSkyGradientTexture(theme: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  if (theme === 'volcano') {
    grad.addColorStop(0, '#450a0a');
    grad.addColorStop(0.5, '#7f1d1d');
    grad.addColorStop(0.85, '#ea580c');
    grad.addColorStop(1, '#fef08a');
  } else if (theme === 'cave') {
    grad.addColorStop(0, '#020617');
    grad.addColorStop(0.6, '#0f172a');
    grad.addColorStop(1, '#1e1b4b');
  } else if (theme === 'castle') {
    grad.addColorStop(0, '#09090b');
    grad.addColorStop(0.5, '#18181b');
    grad.addColorStop(0.85, '#3b0764');
    grad.addColorStop(1, '#581c87');
  } else {
    // Forest / Daylight default
    grad.addColorStop(0, '#0284c7');
    grad.addColorStop(0.4, '#38bdf8');
    grad.addColorStop(0.75, '#bae6fd');
    grad.addColorStop(1, '#fef9c3');
  }

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Sun / Moon / Energy Glow
  if (theme !== 'cave') {
    const sunGrad = ctx.createRadialGradient(380, 100, 10, 380, 100, 180);
    sunGrad.addColorStop(0, 'rgba(255, 255, 240, 0.9)');
    sunGrad.addColorStop(0.3, 'rgba(254, 240, 138, 0.5)');
    sunGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(380, 100, 180, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 3D Tree Mesh Helper
function createStylizedTree(scale = 1.0, leafHue = 0x22c55e): THREE.Group {
  const tree = new THREE.Group();

  // Wooden Trunk
  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x5c3a21,
    roughness: 0.85,
  });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * scale, 0.28 * scale, 1.6 * scale, 7), trunkMat);
  trunk.position.y = 0.8 * scale;
  trunk.castShadow = true;
  tree.add(trunk);

  // Foliage Layers
  const foliageMat1 = new THREE.MeshStandardMaterial({
    color: leafHue,
    roughness: 0.6,
    flatShading: true,
  });
  const foliageMat2 = new THREE.MeshStandardMaterial({
    color: new THREE.Color(leafHue).offsetHSL(0, 0, -0.08),
    roughness: 0.65,
    flatShading: true,
  });

  const layer1 = new THREE.Mesh(new THREE.ConeGeometry(1.2 * scale, 1.4 * scale, 7), foliageMat2);
  layer1.position.y = 1.6 * scale;
  layer1.castShadow = true;
  tree.add(layer1);

  const layer2 = new THREE.Mesh(new THREE.ConeGeometry(0.95 * scale, 1.2 * scale, 7), foliageMat1);
  layer2.position.y = 2.2 * scale;
  layer2.castShadow = true;
  tree.add(layer2);

  const layer3 = new THREE.Mesh(new THREE.ConeGeometry(0.65 * scale, 1.0 * scale, 7), foliageMat1);
  layer3.position.y = 2.7 * scale;
  layer3.castShadow = true;
  tree.add(layer3);

  return tree;
}

// 3D Wildflower Tuft Helper
function createFlowerTuft(color = 0xfacc15): THREE.Group {
  const tuft = new THREE.Group();
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x15803d });
  const petalMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4 });

  for (let i = 0; i < 4; i++) {
    const ang = (i / 4) * Math.PI * 2;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 4), stemMat);
    stem.position.set(Math.cos(ang) * 0.1, 0.15, Math.sin(ang) * 0.1);
    stem.rotation.z = Math.cos(ang) * 0.2;
    tuft.add(stem);

    const bloom = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), petalMat);
    bloom.position.set(stem.position.x, 0.3, stem.position.z);
    tuft.add(bloom);
  }
  return tuft;
}

export const ThreeBattleCanvas: React.FC<ThreeBattleCanvasProps> = ({
  player,
  equipment,
  enemy,
  playerIsAttacking,
  playerIsHit,
  isDefending,
  enemyIsAttacking,
  enemyIsHit,
  activeEffect,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 720;
    const height = container.clientHeight || 340;

    // Theme identification
    const zoneId = (enemy.zoneId || '').toLowerCase();
    const isVolcano = zoneId.includes('volcano') || zoneId.includes('volcán') || enemy.name.toLowerCase().includes('volcán');
    const isCave = zoneId.includes('cave') || zoneId.includes('cueva') || enemy.name.toLowerCase().includes('sombra');
    const isCastle = zoneId.includes('castle') || zoneId.includes('castillo') || enemy.isBoss;
    const themeName = isVolcano ? 'volcano' : isCave ? 'cave' : isCastle ? 'castle' : 'forest';

    // 1. SCENE SETUP
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(
      isCave ? 0x020617 : isVolcano ? 0x450a0a : 0xbae6fd,
      0.04
    );

    const isMobile = typeof window !== 'undefined' && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 900);

    // 2. ISOMETRIC OVER-THE-SHOULDER CAMERA
    // Placed behind and to the left of hero, looking diagonally across towards the enemy
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(-2.7, 1.85, 3.1);
    camera.lookAt(0.15, 0.75, -0.2);

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
      precision: isMobile ? 'mediump' : 'highp',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = isMobile ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. LIGHTING
    const ambientLight = new THREE.AmbientLight(
      isCave ? 0x64748b : isVolcano ? 0xfecaca : 0xf8fafc,
      1.2
    );
    scene.add(ambientLight);

    // Main Sun Key Light
    const sunLight = new THREE.DirectionalLight(
      isVolcano ? 0xf97316 : 0xfef08a,
      2.2
    );
    sunLight.position.set(-5, 10, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = isMobile ? 512 : 1024;
    sunLight.shadow.mapSize.height = isMobile ? 512 : 1024;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Soft Rim Light for character 3D definition against background
    const rimLight = new THREE.DirectionalLight(
      isCave ? 0x38bdf8 : 0x67e8f9,
      1.5
    );
    rimLight.position.set(6, 6, -8);
    scene.add(rimLight);

    // Dedicated Hero Key Light (ensures hero colors pop vibrantly)
    const heroSpot = new THREE.PointLight(0xfffbeb, 2.0, 7);
    heroSpot.position.set(-1.8, 2.6, 1.6);
    scene.add(heroSpot);

    // Dedicated Enemy Key Light
    const enemySpot = new THREE.PointLight(0xffffff, 2.0, 7);
    enemySpot.position.set(1.4, 2.6, -0.6);
    scene.add(enemySpot);

    // 5. SKY DOME BACKDROP
    const skyTex = createSkyGradientTexture(themeName);
    const skyGeo = new THREE.SphereGeometry(30, 24, 16);
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTex,
      side: THREE.BackSide,
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyMesh);

    // 6. MAIN BATTLE GROUND FIELD
    const terrainGroup = new THREE.Group();

    const grassTex = createGrassFieldTexture();
    const groundGeo = new THREE.PlaneGeometry(35, 35, 16, 16);
    const groundMat = new THREE.MeshStandardMaterial({
      map: grassTex,
      color: isCave ? 0x334155 : isVolcano ? 0x1c1917 : 0x4ade80,
      roughness: 0.85,
      metalness: 0.1,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.02;
    groundMesh.receiveShadow = true;
    terrainGroup.add(groundMesh);

    // 7. CIRCULAR BATTLE PLATFORMS (Like Pokémon 3D Battle Arena!)
    const pedestalTex = createDirtPedestalTexture();

    // -- Hero Pedestal at (-1.1, 0, 0.8) --
    const heroPedestalGroup = new THREE.Group();
    heroPedestalGroup.position.set(-1.1, 0.01, 0.8);

    const heroDiskGeo = new THREE.CylinderGeometry(1.4, 1.5, 0.08, 32);
    const heroDiskMat = new THREE.MeshStandardMaterial({
      map: pedestalTex,
      color: 0xfef08a,
      roughness: 0.75,
    });
    const heroDisk = new THREE.Mesh(heroDiskGeo, heroDiskMat);
    heroDisk.position.y = -0.03;
    heroDisk.receiveShadow = true;
    heroPedestalGroup.add(heroDisk);

    // Glowing rim / trim for Hero Base
    const heroRingGeo = new THREE.RingGeometry(1.32, 1.42, 32);
    const heroRingMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const heroRing = new THREE.Mesh(heroRingGeo, heroRingMat);
    heroRing.rotation.x = -Math.PI / 2;
    heroRing.position.y = 0.02;
    heroPedestalGroup.add(heroRing);

    terrainGroup.add(heroPedestalGroup);

    // -- Enemy Pedestal at (1.4, 0, -1.2) --
    const enemyPedestalGroup = new THREE.Group();
    enemyPedestalGroup.position.set(1.4, 0.01, -1.2);

    const enemyDiskGeo = new THREE.CylinderGeometry(1.5, 1.6, 0.08, 32);
    const enemyDiskMat = new THREE.MeshStandardMaterial({
      map: pedestalTex,
      color: enemy.isBoss ? 0xfca5a5 : 0xfef08a,
      roughness: 0.75,
    });
    const enemyDisk = new THREE.Mesh(enemyDiskGeo, enemyDiskMat);
    enemyDisk.position.y = -0.03;
    enemyDisk.receiveShadow = true;
    enemyPedestalGroup.add(enemyDisk);

    // Glowing rim for Enemy Base
    const enemyRingGeo = new THREE.RingGeometry(1.42, 1.52, 32);
    const enemyRingMat = new THREE.MeshBasicMaterial({
      color: enemy.isBoss ? 0xef4444 : 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const enemyRing = new THREE.Mesh(enemyRingGeo, enemyRingMat);
    enemyRing.rotation.x = -Math.PI / 2;
    enemyRing.position.y = 0.02;
    enemyPedestalGroup.add(enemyRing);

    terrainGroup.add(enemyPedestalGroup);

    // 8. 3D BACKGROUND PROPS (Lush Foliage Trees & Floral Details)
    const treePositions = [
      { x: -4.8, z: -3.5, scale: 1.25, hue: 0x15803d },
      { x: -2.4, z: -5.2, scale: 1.1, hue: 0x16a34a },
      { x: 0.5, z: -6.2, scale: 1.4, hue: 0x15803d },
      { x: 3.2, z: -4.8, scale: 1.2, hue: 0x22c55e },
      { x: 5.6, z: -2.8, scale: 1.3, hue: 0x16a34a },
      { x: -5.8, z: 0.5, scale: 1.0, hue: 0x22c55e },
    ];

    treePositions.forEach((tp) => {
      const tree = createStylizedTree(tp.scale, tp.hue);
      tree.position.set(tp.x, 0, tp.z);
      terrainGroup.add(tree);
    });

    // Small wildflowers & grass tufts
    const flowerColors = [0xfacc15, 0x38bdf8, 0xf43f5e, 0xa855f7, 0xffffff];
    for (let f = 0; f < 18; f++) {
      const fx = (Math.random() - 0.5) * 10;
      const fz = (Math.random() - 0.5) * 8 - 1;
      // Keep clear of battle circle pedestals
      if (Math.hypot(fx - -1.1, fz - 0.8) > 1.6 && Math.hypot(fx - 1.4, fz - -1.2) > 1.6) {
        const flower = createFlowerTuft(flowerColors[f % flowerColors.length]);
        flower.position.set(fx, 0, fz);
        flower.scale.setScalar(0.7 + Math.random() * 0.5);
        terrainGroup.add(flower);
      }
    }

    scene.add(terrainGroup);

    // 9. 3D HERO CHARACTER (Foreground-Left, Over-the-shoulder Isometric)
    const HERO_BASE_POS = new THREE.Vector3(-1.1, 0.05, 0.8);
    const ENEMY_BASE_POS = new THREE.Vector3(1.4, 0.05, -1.2);

    const heroResult = createHumanHeroMesh(player, equipment);
    const heroGroup = heroResult.group;
    heroGroup.position.copy(HERO_BASE_POS);

    // Angle to face the enemy across the battlefield
    const heroFaceAngle = Math.atan2(ENEMY_BASE_POS.x - HERO_BASE_POS.x, ENEMY_BASE_POS.z - HERO_BASE_POS.z);
    heroGroup.rotation.y = heroFaceAngle;
    scene.add(heroGroup);

    // 10. 3D ENEMY CHARACTER (Background-Right, Facing down-left towards hero)
    const enemyResult = createRealisticEnemyMesh(enemy);
    const enemyGroup = enemyResult.group;
    enemyGroup.position.copy(ENEMY_BASE_POS);

    const enemyFaceAngle = Math.atan2(HERO_BASE_POS.x - ENEMY_BASE_POS.x, HERO_BASE_POS.z - ENEMY_BASE_POS.z);
    enemyGroup.rotation.y = enemyFaceAngle;
    scene.add(enemyGroup);

    // 11. ATMOSPHERIC PARTICLES (Drifting Leaves & Magic Sparkles)
    const particleCount = 40;
    const particlesGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 12;
      posArray[i + 1] = 0.2 + Math.random() * 4;
      posArray[i + 2] = (Math.random() - 0.5) * 12;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.1,
      color: isVolcano ? 0xf97316 : isCave ? 0x38bdf8 : 0x86efac,
      transparent: true,
      opacity: 0.75,
    });
    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // 12. SPELL & ELEMENTAL FX (3D Runes & Particle Bursts)
    const fxGroup = new THREE.Group();
    scene.add(fxGroup);

    if (activeEffect) {
      const fxColor =
        activeEffect === 'fire' ? 0xef4444 :
        activeEffect === 'ice' ? 0x38bdf8 :
        activeEffect === 'thunder' ? 0xfacc15 :
        activeEffect === 'holy' || activeEffect === 'heal' ? 0x34d399 :
        activeEffect === 'shadow' ? 0xa855f7 : 0xf8fafc;

      // 1. Dynamic glowing spell light source
      const spellLight = new THREE.PointLight(fxColor, 3.5, 6);
      spellLight.position.set(ENEMY_BASE_POS.x, 1.2, ENEMY_BASE_POS.z);
      fxGroup.add(spellLight);

      // 2. Spinning 3D Torus Ring
      const fxRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.9, 0.09, 16, 32),
        new THREE.MeshStandardMaterial({
          color: fxColor,
          emissive: fxColor,
          emissiveIntensity: 2.5,
          transparent: true,
          opacity: 0.9,
          roughness: 0.2,
        })
      );
      fxRing.position.set(ENEMY_BASE_POS.x, 0.8, ENEMY_BASE_POS.z);
      fxRing.rotation.x = Math.PI / 3;
      fxGroup.add(fxRing);

      // 3. Ground Summoning Rune Ring
      const runeRingGeo = new THREE.RingGeometry(0.4, 1.3, 32);
      const runeRingMat = new THREE.MeshBasicMaterial({
        color: fxColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      });
      const runeRing = new THREE.Mesh(runeRingGeo, runeRingMat);
      runeRing.rotation.x = -Math.PI / 2;
      runeRing.position.set(ENEMY_BASE_POS.x, 0.04, ENEMY_BASE_POS.z);
      fxGroup.add(runeRing);
    }

    // 13. ANIMATION LOOP
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Rotate subtle aura rings
      heroRing.rotation.z = time * 0.5;
      enemyRing.rotation.z = -time * 0.5;

      // Animate drifting atmospheric particles along the breeze
      const positions = particlesGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] += 0.008;     // X drift
        positions[i + 1] -= 0.004; // Gentle fall
        positions[i + 2] -= 0.006; // Z drift
        if (positions[i + 1] < 0) {
          positions[i + 1] = 4;
          positions[i] = (Math.random() - 0.5) * 12;
          positions[i + 2] = (Math.random() - 0.5) * 12;
        }
      }
      particlesGeo.attributes.position.needsUpdate = true;

      // Subtle dynamic camera float / breathing
      camera.position.x = -2.7 + Math.sin(time * 0.8) * 0.04;
      camera.position.y = 1.85 + Math.cos(time * 0.6) * 0.03;
      camera.position.z = 3.1 + Math.sin(time * 0.5) * 0.03;
      camera.lookAt(0.15, 0.75, -0.2);

      const delta = clock.getDelta();

      // HERO COMBAT ANIMATIONS & DYNAMIC PHYSICS

      if (playerIsAttacking) {
        // Hero dashes forward along the diagonal line towards enemy platform
        heroGroup.position.set(0.25, 0.25, -0.3);
        heroGroup.rotation.y = heroFaceAngle;
        heroGroup.rotation.z = -0.15;
        heroResult.rightArm.rotation.x = -Math.PI * 0.65;
        heroResult.leftArm.rotation.x = 0.4;
      } else if (playerIsHit) {
        // Hero recoils back-left along the diagonal vector
        heroGroup.position.set(-1.6, 0.05, 1.25);
        heroGroup.rotation.y = heroFaceAngle;
        heroGroup.rotation.z = 0.25;
      } else if (isDefending) {
        // Shield Guard
        heroGroup.position.copy(HERO_BASE_POS);
        heroGroup.rotation.y = heroFaceAngle;
        heroGroup.rotation.z = 0;
        heroResult.leftArm.rotation.x = -0.9;
        heroResult.rightArm.rotation.x = -0.3;
      } else {
        // Hero Idle Stance & Breathing (Over-the-shoulder view)
        heroGroup.position.set(
          HERO_BASE_POS.x,
          HERO_BASE_POS.y + Math.sin(time * 3) * 0.02,
          HERO_BASE_POS.z
        );
        heroGroup.rotation.y = heroFaceAngle + Math.sin(time * 2) * 0.03;
        heroGroup.rotation.z = 0;
        heroResult.torsoGroup.position.y = 0.70 + Math.sin(time * 3) * 0.015;
        heroResult.headGroup.position.y = 1.15 + Math.sin(time * 3) * 0.02;
        heroResult.rightArm.rotation.x = Math.sin(time * 3) * 0.08;
        heroResult.leftArm.rotation.x = -Math.sin(time * 3) * 0.08;

        // Wave headband ribbons in the wind
        if (heroResult.headbandTail) {
          heroResult.headbandTail.rotation.z = -0.3 + Math.sin(time * 6) * 0.15;
          heroResult.headbandTail.rotation.y = Math.cos(time * 4) * 0.2;
        }
      }

      // ENEMY COMBAT ANIMATIONS (Diagonal Lunge & Hit Recoil)
      if (enemyIsAttacking) {
        // Enemy dashes down-left along the diagonal vector towards hero platform
        enemyGroup.position.set(-0.25, 0.25, 0.2);
        enemyGroup.rotation.y = enemyFaceAngle;
        enemyGroup.rotation.z = 0.2;
      } else if (enemyIsHit) {
        // Enemy recoils back-right along diagonal
        enemyGroup.position.set(1.9, 0.05, -1.7);
        enemyGroup.rotation.y = enemyFaceAngle;
        enemyGroup.rotation.z = -0.25;
      } else {
        // Enemy Idle on platform
        enemyGroup.position.set(
          ENEMY_BASE_POS.x,
          ENEMY_BASE_POS.y + Math.sin(time * 3 + 1) * 0.02,
          ENEMY_BASE_POS.z
        );
        enemyGroup.rotation.y = enemyFaceAngle + Math.sin(time * 2 + 1) * 0.03;
        enemyGroup.rotation.z = 0;
      }

      // Enemy Mesh Internal Animation (Wings, Tail, Legs, Eyes)
      enemyResult.updateAnimation(time, enemyIsAttacking, enemyIsHit);

      // Rotate Spell FX if present
      if (fxGroup.children.length > 0) {
        fxGroup.children.forEach((c) => {
          c.rotation.z += 0.05;
          c.scale.setScalar(1 + Math.sin(time * 10) * 0.1);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [player, equipment, enemy, playerIsAttacking, playerIsHit, isDefending, enemyIsAttacking, enemyIsHit, activeEffect]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[320px] sm:min-h-[360px] rounded-xl overflow-hidden relative border-2 border-slate-700/60 shadow-2xl bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-600 select-none"
    />
  );
};
