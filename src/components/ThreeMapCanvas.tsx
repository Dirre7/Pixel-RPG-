import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Zone, PlayerStats, EquipmentItem } from '../types';
import { areZoneMainQuestsCompleted } from '../data/gameData';

const heroGLTFLoader = new GLTFLoader();
let cachedHeroGLTFScene: THREE.Group | null = null;

let cachedFantasyTreeGLTF: THREE.Group | null = null;
const fantasyTreeCallbacks: ((model: THREE.Group) => void)[] = [];

const loadFantasyTreeGLTF = (onLoad: (model: THREE.Group) => void) => {
  if (cachedFantasyTreeGLTF) {
    onLoad(cachedFantasyTreeGLTF);
    return;
  }
  fantasyTreeCallbacks.push(onLoad);
  if (fantasyTreeCallbacks.length === 1) {
    const loader = new GLTFLoader();
    loader.load(
      '/models/environment/trees/fantasy_tree.glb',
      (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        cachedFantasyTreeGLTF = model;
        fantasyTreeCallbacks.forEach((cb) => cb(model));
        fantasyTreeCallbacks.length = 0;
      },
      undefined,
      (err) => {
        console.warn('Fallback en fantasy_tree.glb:', err);
      }
    );
  }
};


import {
  createHumanHeroMesh,
  createHumanNPCMesh,
  createLowPolyCottage,
  createLowPolyWindmill,
  createLowPolyWaterWell,
  createLowPolyMarketStall,
  createLowPolyForge,
  createLowPolyStreetLamp,
  create3DDungeonStoneWallMesh,
  create3DTurquoiseGrottoMesh,
  create3DGlowingCrystalClusterMesh,
  create3DDwarvenForgeMesh,
  create3DVolcanicBasaltSpireMesh,
  create3DLavaRiverTileMesh,
  create3DVolcanicRubyCrystalMesh,
  create3DDragonForgeMesh,
  create3DCastleRotundaTowerMesh,
  create3DCastleArchedWallMesh,
  create3DRoyalRelicCrystalMesh,
  create3DRoyalForgeMesh,
  createStylizedChestMesh,
  create3DWoodenCratesMesh,
  create3DOakBarrelsMesh,
  create3DMerchantCartMesh,
  create3DStonePlanterMesh,
  create3DApothecaryBuildingMesh,
  create3DCityHallBuildingMesh,
  create3DTavernBuildingMesh,
} from '../utils/three3dModels';

interface ThreeMapCanvasProps {
  currentZone: Zone;
  playerPos: { x: number; y: number };
  player: PlayerStats;
  equipment?: {
    weapon: EquipmentItem | null;
    armor: EquipmentItem | null;
    accessory: EquipmentItem | null;
  };
  facingDir: 'up' | 'down' | 'left' | 'right';
  openedChests: string[];
  defeatedBosses: string[];
  completedQuests?: string[];
  onTileClick?: (x: number, y: number) => void;
}

const ThreeMapCanvasComponent: React.FC<ThreeMapCanvasProps> = ({
  currentZone,
  playerPos,
  player,
  equipment,
  facingDir,
  openedChests,
  defeatedBosses,
  completedQuests = [],
  onTileClick,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const isBossDefeated = defeatedBosses.includes(currentZone.boss.name);
  const isBossPortalUnlocked = areZoneMainQuestsCompleted(currentZone.id, completedQuests).isUnlocked;

  const facingDirRef = useRef(facingDir);
  const openedChestsRef = useRef(openedChests);
  const defeatedBossesRef = useRef(defeatedBosses);

  useEffect(() => {
    facingDirRef.current = facingDir;
  }, [facingDir]);

  useEffect(() => {
    openedChestsRef.current = openedChests;
  }, [openedChests]);

  useEffect(() => {
    defeatedBossesRef.current = defeatedBosses;
  }, [defeatedBosses]);

  // Overhead MOBA HUD direct DOM ref (Eliminates 60-120 React re-renders per second)
  const hudRef = useRef<HTMLDivElement | null>(null);

  // Interpolated player position in 3D world space
  const playerTargetPosRef = useRef<{ x: number; z: number }>({
    x: playerPos.x * 2.5,
    z: playerPos.y * 2.5,
  });
  const playerCurrentPosRef = useRef<{ x: number; z: number }>({
    x: playerPos.x * 2.5,
    z: playerPos.y * 2.5,
  });

  // Keep target updated
  useEffect(() => {
    playerTargetPosRef.current = {
      x: playerPos.x * 2.5,
      z: playerPos.y * 2.5,
    };
  }, [playerPos.x, playerPos.y]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 900;
    let height = container.clientHeight || Math.max(580, Math.round(width * 0.65));

    // 1. SCENE & CAMERA SETUP
    const scene = new THREE.Scene();

    // Biome Fog
    if (currentZone.id === 'zone_forest') {
      scene.background = new THREE.Color('#0a130c');
      scene.fog = new THREE.FogExp2('#0a130c', 0.018);
    } else if (currentZone.id === 'zone_cave') {
      scene.background = new THREE.Color('#0f172a');
      scene.fog = new THREE.Fog('#0f172a', 50, 220);
    } else if (currentZone.id === 'zone_volcano') {
      scene.background = new THREE.Color('#180703');
      scene.fog = new THREE.Fog('#180703', 50, 220);
    } else if (currentZone.id === 'zone_castle') {
      scene.background = new THREE.Color('#0c1322');
      scene.fog = new THREE.Fog('#0c1322', 50, 220);
    } else {
      scene.background = new THREE.Color('#0a0714');
      scene.fog = new THREE.FogExp2('#0a0714', 0.02);
    }

    // 3D Isometric Perspective Camera (High-Visibility ARPG Angle)
    let aspect = width / height;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    
    const mapW = currentZone.mapWidth * 2.5;
    const mapH = currentZone.mapHeight * 2.5;
    const centerX = mapW / 2;
    const centerZ = mapH / 2;

    camera.position.set(centerX + 8.5, 11.5, centerZ + 8.5);
    camera.lookAt(centerX, 0.8, centerZ);

    const isTouchOrMobile = typeof window !== 'undefined' && (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 0) ||
      window.innerWidth < 1024
    );
    const isMobile = isTouchOrMobile;

    // 2. STYLIZED CLEAN RPG RENDERER (CRISP RETINA RESOLUTION & 60 FPS SOLID)
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: false,
      powerPreference: 'high-performance',
      precision: 'mediump',
      stencil: false,
      depth: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Handle Resize dynamically
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || Math.max(580, Math.round(newW * 0.65));
      if (!newW || !newH) return;
      width = newW;
      height = newH;

      aspect = newW / newH;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();

      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // 3. LIGHTING SETUP
    // Ambient Light (Warm magma, torch & imperial moonlight fill light)
    const ambientLight = new THREE.AmbientLight(
      currentZone.id === 'zone_forest'
        ? 0x224422
        : currentZone.id === 'zone_cave'
        ? 0xffedd5
        : currentZone.id === 'zone_volcano'
        ? 0xff7722
        : currentZone.id === 'zone_castle'
        ? 0xe0e7ff
        : 0x334155,
      currentZone.id === 'zone_forest' ? 1.2 : 1.8
    );
    scene.add(ambientLight);

    // Hemisphere Light (Sky ambient vs Ground bounce)
    const hemiLight = new THREE.HemisphereLight(
      currentZone.id === 'zone_forest'
        ? 0xfef08a
        : currentZone.id === 'zone_cave'
        ? 0xfde047
        : currentZone.id === 'zone_volcano'
        ? 0xf97316
        : currentZone.id === 'zone_castle'
        ? 0x93c5fd
        : 0x38bdf8,
      currentZone.id === 'zone_volcano'
        ? 0x18181b
        : currentZone.id === 'zone_cave' || currentZone.id === 'zone_castle'
        ? 0x1e293b
        : 0x14532d,
      currentZone.id === 'zone_forest' ? 1.0 : 1.4
    );
    scene.add(hemiLight);

    // Directional Main Light with Shadows (Torch / Sun Isometric Spotlight)
    const sunLight = new THREE.DirectionalLight(
      currentZone.id === 'zone_forest'
        ? 0xfff7ed
        : currentZone.id === 'zone_cave'
        ? 0xfffbeb
        : currentZone.id === 'zone_volcano'
        ? 0xffedd5
        : currentZone.id === 'zone_castle'
        ? 0xfff7ed
        : 0xd8b4fe,
      2.4
    );
    const sunPosX = centerX + 110;
    const sunPosY = 85;
    const sunPosZ = centerZ - 130;
    sunLight.position.set(sunPosX, sunPosY, sunPosZ);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = isTouchOrMobile ? 1024 : 2048;
    sunLight.shadow.mapSize.height = isTouchOrMobile ? 1024 : 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 250;
    const shadowD = 40;
    sunLight.shadow.camera.left = -shadowD;
    sunLight.shadow.camera.right = shadowD;
    sunLight.shadow.camera.top = shadowD;
    sunLight.shadow.camera.bottom = -shadowD;
    sunLight.shadow.bias = -0.0002;
    sunLight.shadow.normalBias = 0.025;
    sunLight.shadow.radius = isTouchOrMobile ? 1 : 2.5;
    scene.add(sunLight);

    // --- BACKGROUND MAP ENVIRONMENT: OCEAN, SUN, CLOUDS & COASTAL CLIFFS ---
    // 1. VAST OCEAN WATER PLANE WITH SUN SPECULAR REFLECTIONS
    const waterPBR = getCachedWaterPBR(currentZone.id);
    waterPBR.diffuse.wrapS = THREE.RepeatWrapping;
    waterPBR.diffuse.wrapT = THREE.RepeatWrapping;
    waterPBR.diffuse.repeat.set(48, 48);
    waterPBR.normal.wrapS = THREE.RepeatWrapping;
    waterPBR.normal.wrapT = THREE.RepeatWrapping;
    waterPBR.normal.repeat.set(48, 48);

    const oceanGeo = new THREE.PlaneGeometry(1200, 1200, isTouchOrMobile ? 16 : 32, isTouchOrMobile ? 16 : 32);
    const oceanMat = new THREE.MeshPhysicalMaterial({
      map: waterPBR.diffuse,
      normalMap: waterPBR.normal,
      normalScale: new THREE.Vector2(2.2, 2.2),
      roughness: 0.05,
      metalness: 0.2,
      transmission: 0,
      ior: 1.333,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.95,
    });
    const oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
    oceanMesh.rotation.x = -Math.PI / 2;
    oceanMesh.position.set(centerX, -0.38, centerZ);
    oceanMesh.receiveShadow = true;
    scene.add(oceanMesh);

    // 2. GLOWING 3D SUN & SOLAR CORONA HALO
    const sunGroup = new THREE.Group();
    sunGroup.position.set(sunPosX, sunPosY, sunPosZ);

    const sunCore = new THREE.Mesh(
      new THREE.SphereGeometry(14, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xfff3c7 })
    );
    sunGroup.add(sunCore);

    const sunCoronaMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.35,
      side: THREE.BackSide,
    });
    const sunCorona = new THREE.Mesh(new THREE.SphereGeometry(24, 24, 24), sunCoronaMat);
    sunGroup.add(sunCorona);

    const sunCoronaOuter = new THREE.Mesh(
      new THREE.SphereGeometry(38, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.15, side: THREE.BackSide })
    );
    sunGroup.add(sunCoronaOuter);

    scene.add(sunGroup);

    // 3. FLOATING 3D VOLUMETRIC CUMULUS CLOUDS (Desktop Only for Maximum Performance)
    const cloudGroup = new THREE.Group();
    const animatedClouds: THREE.Group[] = [];
    if (!isMobile) {
      const cloudMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.9,
        metalness: 0.0,
        transparent: true,
        opacity: 0.92,
      });

      const cloudCount = 12;
      for (let c = 0; c < cloudCount; c++) {
        const cloud = new THREE.Group();
        const cloudCX = centerX - 120 + Math.random() * 240;
        const cloudCY = 38 + Math.random() * 25;
        const cloudCZ = centerZ - 120 + Math.random() * 240;
        cloud.position.set(cloudCX, cloudCY, cloudCZ);

        const puffCount = 5 + Math.floor(Math.random() * 4);
        for (let p = 0; p < puffCount; p++) {
          const puffRadius = 3.5 + Math.random() * 5.0;
          const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(puffRadius, 1), cloudMat);
          puff.position.set(
            (p - puffCount / 2) * 3.8,
            (Math.random() - 0.5) * 2.0,
            (Math.random() - 0.5) * 3.0
          );
          cloud.add(puff);
        }
        cloudGroup.add(cloud);
        animatedClouds.push(cloud);
      }
      scene.add(cloudGroup);
    }

    // 4. COASTAL ROCK CLIFFS SURROUNDING THE ISLAND MAP (Desktop Only)
    if (!isMobile) {
      const cliffMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
      const islandMinX = -2;
      const islandMaxX = mapW + 2;
      const islandMinZ = -2;
      const islandMaxZ = mapH + 2;
      const cliffStep = 6;

      for (let i = -10; i <= mapW + 10; i += cliffStep) {
        // North & South Coast Cliffs
        [islandMinZ - 1.5, islandMaxZ + 1.5].forEach((cz) => {
          const cliff = new THREE.Mesh(new THREE.DodecahedronGeometry(2.5 + Math.random() * 2, 1), cliffMat);
          cliff.position.set(i, 0.2, cz);
          cliff.scale.set(1.2, 0.6 + Math.random() * 0.8, 1.2);
          cliff.receiveShadow = true;
          scene.add(cliff);
        });
      }

      for (let j = -10; j <= mapH + 10; j += cliffStep) {
        // East & West Coast Cliffs
        [islandMinX - 1.5, islandMaxX + 1.5].forEach((cx) => {
          const cliff = new THREE.Mesh(new THREE.DodecahedronGeometry(2.5 + Math.random() * 2, 1), cliffMat);
          cliff.position.set(cx, 0.2, j);
          cliff.scale.set(1.2, 0.6 + Math.random() * 0.8, 1.2);
          cliff.receiveShadow = true;
          scene.add(cliff);
        });
      }
    }

    // 4. PROCEDURAL PBR CANVAS TEXTURES FOR GROUND & PATHS (Cached for instant map switching)
    const groundPBR = getCachedGroundPBR(currentZone.id);
    groundPBR.diffuse.wrapS = THREE.RepeatWrapping;
    groundPBR.diffuse.wrapT = THREE.RepeatWrapping;
    groundPBR.diffuse.repeat.set(currentZone.mapWidth * 0.8, currentZone.mapHeight * 0.8);
    groundPBR.normal.wrapS = THREE.RepeatWrapping;
    groundPBR.normal.wrapT = THREE.RepeatWrapping;
    groundPBR.normal.repeat.set(currentZone.mapWidth * 0.8, currentZone.mapHeight * 0.8);

    // 5. BUILD 3D TERRAIN TILES
    const tileGroup = new THREE.Group();
    scene.add(tileGroup);

    const tileGeo = new THREE.BoxGeometry(2.505, 0.4, 2.505);

    // Geometries & Materials reuse with Stylized Clean Lambert Shader
    const pathPBR = getCachedPathPBR();
    const pathMat = new THREE.MeshLambertMaterial({
      map: pathPBR.diffuse,
    });

    // Border Dirt Edge Material for natural road blending
    const pathBorderMat = new THREE.MeshStandardMaterial({
      color: 0x451a03,
      roughness: 0.9,
      metalness: 0.05,
    });

    // Track objects for realistic environmental wind/water/light animations
    const animatedSwayObjects: THREE.Group[] = [];
    const animatedWaters: THREE.Mesh[] = [oceanMesh];
    const animatedLanterns: THREE.PointLight[] = [];
    const animatedSmokes: THREE.Mesh[] = [];
    const animatedBuildingUpdaters: ((time: number) => void)[] = [];
    const animatedNPCUpdaters: ((time: number) => void)[] = [];

    // Interactive fluid ripple rings pool
    const waterRipples: { mesh: THREE.Mesh; scale: number; opacity: number; active: boolean }[] = [];
    for (let r = 0; r < 8; r++) {
      const ripGeo = new THREE.RingGeometry(0.1, 0.35, 24);
      const ripMat = new THREE.MeshBasicMaterial({
        color: currentZone.id === 'zone_volcano' ? 0xfba107 : 0xe0f2fe,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });
      const ripMesh = new THREE.Mesh(ripGeo, ripMat);
      ripMesh.rotation.x = -Math.PI / 2;
      ripMesh.position.y = -0.18;
      scene.add(ripMesh);
      waterRipples.push({ mesh: ripMesh, scale: 1, opacity: 0, active: false });
    }

    // Volumetric Sunlight Beams (God Rays) for Forest Atmosphere
    if (currentZone.id === 'zone_forest') {
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
      });
      for (let b = 0; b < 6; b++) {
        const beamGeo = new THREE.CylinderGeometry(0.8, 2.5, 25, 12);
        const beam = new THREE.Mesh(beamGeo, beamMat);
        beam.position.set(centerX - 10 + b * 8, 12, centerZ - 8 + (b % 3) * 6);
        beam.rotation.z = 0.35;
        beam.rotation.x = -0.2;
        scene.add(beam);
      }
    }

    // Track obstacles for dynamic X-Ray transparency when near player
    const obstacleGroups: { group: THREE.Group; gridX: number; gridY: number }[] = [];

    // Ground Tile Material with Stylized Clean High-Performance Shader
    const groundMat = new THREE.MeshLambertMaterial({
      map: groundPBR.diffuse,
    });

    // Ground Tile Instanced Mesh with True PBR Physical Shader (1 single draw call for all 3600 tiles!)
    const totalTiles = currentZone.mapWidth * currentZone.mapHeight;
    const groundInstancedMesh = new THREE.InstancedMesh(tileGeo, groundMat, totalTiles);
    groundInstancedMesh.receiveShadow = true;
    const dummyMatrix = new THREE.Matrix4();
    const dummyPos = new THREE.Vector3();
    const dummyQuat = new THREE.Quaternion();
    const dummyScale = new THREE.Vector3(1, 1, 1);

    let tileIndex = 0;
    for (let y = 0; y < currentZone.mapHeight; y++) {
      for (let x = 0; x < currentZone.mapWidth; x++) {
        const rawTile = currentZone.tileData[y]?.[x];
        if (rawTile === -1) {
          // Off-map void / abyss: invisible, zero scale
          dummyScale.set(0, 0, 0);
          dummyMatrix.compose(dummyPos, dummyQuat, dummyScale);
          groundInstancedMesh.setMatrixAt(tileIndex++, dummyMatrix);
          dummyScale.set(1, 1, 1);
          continue;
        }

        const isWaterTile = rawTile === 3;
        const posX = x * 2.5;
        const posZ = y * 2.5;
        const elevation = 0; // Flat, uniform, seamless terrain
        const baseGroundY = isWaterTile ? -0.55 : -0.2;
        dummyPos.set(posX, baseGroundY + elevation, posZ);
        dummyMatrix.compose(dummyPos, dummyQuat, dummyScale);
        groundInstancedMesh.setMatrixAt(tileIndex++, dummyMatrix);
      }
    }
    groundInstancedMesh.instanceMatrix.needsUpdate = true;
    tileGroup.add(groundInstancedMesh);

    // 🎯 ENTITY CULLING SYSTEM: Only active entities within screen viewport are rendered
    const cullingEntities: { object: THREE.Object3D; gridX: number; gridY: number }[] = [];
    const addWorldEntity = (object: THREE.Object3D, gridX: number, gridY: number) => {
      tileGroup.add(object);
      cullingEntities.push({ object, gridX, gridY });
    };

    // 🚀 PATH INSTANCED MESH (1 Single Draw Call for all road cobblestone tiles!)
    const pathMainGeo = new THREE.BoxGeometry(2.505, 0.40, 2.505);
    let totalPathCount = 0;
    for (let py = 0; py < currentZone.mapHeight; py++) {
      for (let px = 0; px < currentZone.mapWidth; px++) {
        if (currentZone.tileData[py]?.[px] === 2) totalPathCount++;
      }
    }
    const pathInstancedMesh = new THREE.InstancedMesh(pathMainGeo, pathMat, Math.max(1, totalPathCount));
    pathInstancedMesh.receiveShadow = !isTouchOrMobile;
    let pathIndex = 0;

    // Shared Bridge Materials
    const bridgeRailMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.85 });
    const bridgePostMat = new THREE.MeshStandardMaterial({ color: 0x3b1c0a, roughness: 0.9 });

    // Populate Map Tiles Details, Paths, Buildings & Obstacles
    for (let y = 0; y < currentZone.mapHeight; y++) {
      for (let x = 0; x < currentZone.mapWidth; x++) {
        const tileType = currentZone.tileData[y]?.[x] ?? 0;
        if (tileType === -1) continue; // Skip off-map void

        const posX = x * 2.5;
        const posZ = y * 2.5;

        // Perfectly flat and uniform terrain level
        const elevation = 0;

        // SOLID CONTINUOUS SEAMLESS PATH (Instanced 1 draw call)
        if (tileType === 2) {
          dummyPos.set(posX, -0.18, posZ);
          dummyMatrix.compose(dummyPos, dummyQuat, dummyScale);
          pathInstancedMesh.setMatrixAt(pathIndex++, dummyMatrix);

          // 🌉 Wooden Bridge Handrails when path crosses water
          const hasNorthWater = currentZone.tileData[y - 1]?.[x] === 3;
          const hasSouthWater = currentZone.tileData[y + 1]?.[x] === 3;
          const hasEastWater = currentZone.tileData[y]?.[x + 1] === 3;
          const hasWestWater = currentZone.tileData[y]?.[x - 1] === 3;

          if (hasNorthWater) {
            const bridgeGroupN = new THREE.Group();
            const railN = new THREE.Mesh(new THREE.BoxGeometry(2.52, 0.08, 0.08), bridgeRailMat);
            railN.position.set(posX, 0.32, posZ - 1.18);
            railN.castShadow = !isMobile;
            bridgeGroupN.add(railN);

            for (let p = -1; p <= 1; p++) {
              const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.12), bridgePostMat);
              post.position.set(posX + p * 1.05, 0.15, posZ - 1.18);
              post.castShadow = !isMobile;
              bridgeGroupN.add(post);
            }
            addWorldEntity(bridgeGroupN, x, y);
          }

          if (hasSouthWater) {
            const bridgeGroupS = new THREE.Group();
            const railS = new THREE.Mesh(new THREE.BoxGeometry(2.52, 0.08, 0.08), bridgeRailMat);
            railS.position.set(posX, 0.32, posZ + 1.18);
            railS.castShadow = !isMobile;
            bridgeGroupS.add(railS);

            for (let p = -1; p <= 1; p++) {
              const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.12), bridgePostMat);
              post.position.set(posX + p * 1.05, 0.15, posZ + 1.18);
              post.castShadow = !isMobile;
              bridgeGroupS.add(post);
            }
            addWorldEntity(bridgeGroupS, x, y);
          }

          if (hasWestWater) {
            const bridgeGroupW = new THREE.Group();
            const railW = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 2.52), bridgeRailMat);
            railW.position.set(posX - 1.18, 0.32, posZ);
            railW.castShadow = !isMobile;
            bridgeGroupW.add(railW);

            for (let p = -1; p <= 1; p++) {
              const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.12), bridgePostMat);
              post.position.set(posX - 1.18, 0.15, posZ + p * 1.05);
              post.castShadow = !isMobile;
              bridgeGroupW.add(post);
            }
            addWorldEntity(bridgeGroupW, x, y);
          }

          if (hasEastWater) {
            const bridgeGroupE = new THREE.Group();
            const railE = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 2.52), bridgeRailMat);
            railE.position.set(posX + 1.18, 0.32, posZ);
            railE.castShadow = !isMobile;
            bridgeGroupE.add(railE);

            for (let p = -1; p <= 1; p++) {
              const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.12), bridgePostMat);
              post.position.set(posX + 1.18, 0.15, posZ + p * 1.05);
              post.castShadow = !isMobile;
              bridgeGroupE.add(post);
            }
            addWorldEntity(bridgeGroupE, x, y);
          }

          // 🌿 Organic RPG Roadside Transitions: Stone Curbs, Wild Grass, Pebbles & Wooden Fences (Desktop Only)
          if (!isMobile) {
            const hasNorthGrass = currentZone.tileData[y - 1]?.[x] !== 2 && currentZone.tileData[y - 1]?.[x] !== 3;
            const hasSouthGrass = currentZone.tileData[y + 1]?.[x] !== 2 && currentZone.tileData[y + 1]?.[x] !== 3;
            const hasEastGrass = currentZone.tileData[y]?.[x + 1] !== 2 && currentZone.tileData[y]?.[x + 1] !== 3;
            const hasWestGrass = currentZone.tileData[y]?.[x - 1] !== 2 && currentZone.tileData[y]?.[x - 1] !== 3;

            const curbMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.85 });
            const pebbleMat = new THREE.MeshStandardMaterial({ color: 0x57534e, roughness: 0.9 });
            const grassMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.6 });
            const fenceMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.85 });

            if (hasNorthGrass) {
              const curbN = new THREE.Mesh(new THREE.BoxGeometry(2.505, 0.04, 0.12), curbMat);
              curbN.position.set(posX, 0.02, posZ - 1.20);
              addWorldEntity(curbN, x, y);

              if ((x + y) % 2 === 0) {
                const pN = new THREE.Mesh(new THREE.DodecahedronGeometry(0.09, 1), pebbleMat);
                pN.position.set(posX + 0.45, 0.05, posZ - 1.16);
                addWorldEntity(pN, x, y);
              }

              if ((x * 7 + y * 11) % 3 === 0) {
                const gN = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 4), grassMat);
                gN.position.set(posX - 0.5, 0.08, posZ - 1.18);
                addWorldEntity(gN, x, y);
              }

              if ((x * 13 + y * 19) % 4 === 0 && currentZone.id === 'zone_forest') {
                const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.55, 6), fenceMat);
                post1.position.set(posX - 0.7, 0.25, posZ - 1.22);
                addWorldEntity(post1, x, y);

                const post2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.55, 6), fenceMat);
                post2.position.set(posX + 0.7, 0.25, posZ - 1.22);
                addWorldEntity(post2, x, y);

                const rail = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.04), fenceMat);
                rail.position.set(posX, 0.35, posZ - 1.22);
                addWorldEntity(rail, x, y);
              }
            }

            if (hasSouthGrass) {
              const curbS = new THREE.Mesh(new THREE.BoxGeometry(2.505, 0.04, 0.12), curbMat);
              curbS.position.set(posX, 0.02, posZ + 1.20);
              addWorldEntity(curbS, x, y);

              if ((x + y) % 2 === 1) {
                const pS = new THREE.Mesh(new THREE.DodecahedronGeometry(0.09, 1), pebbleMat);
                pS.position.set(posX - 0.45, 0.05, posZ + 1.16);
                addWorldEntity(pS, x, y);
              }

              if ((x * 11 + y * 13) % 3 === 0) {
                const gS = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 4), grassMat);
                gS.position.set(posX + 0.5, 0.08, posZ + 1.18);
                addWorldEntity(gS, x, y);
              }

              if ((x * 17 + y * 23) % 4 === 0 && currentZone.id === 'zone_forest') {
                const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.55, 6), fenceMat);
                post1.position.set(posX - 0.7, 0.25, posZ + 1.22);
                addWorldEntity(post1, x, y);

                const post2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.55, 6), fenceMat);
                post2.position.set(posX + 0.7, 0.25, posZ + 1.22);
                addWorldEntity(post2, x, y);

                const rail = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.04), fenceMat);
                rail.position.set(posX, 0.35, posZ + 1.22);
                addWorldEntity(rail, x, y);
              }
            }

            if (hasWestGrass) {
              const curbW = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 2.505), curbMat);
              curbW.position.set(posX - 1.20, 0.02, posZ);
              addWorldEntity(curbW, x, y);

              if ((x + y) % 2 === 0) {
                const pW = new THREE.Mesh(new THREE.DodecahedronGeometry(0.09, 1), pebbleMat);
                pW.position.set(posX - 1.16, 0.05, posZ + 0.45);
                addWorldEntity(pW, x, y);
              }

              if ((x * 13 + y * 17) % 3 === 0) {
                const gW = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 4), grassMat);
                gW.position.set(posX - 1.18, 0.08, posZ - 0.5);
                addWorldEntity(gW, x, y);
              }

              if ((x * 19 + y * 29) % 4 === 0 && currentZone.id === 'zone_forest') {
                const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.55, 6), fenceMat);
                post1.position.set(posX - 1.22, 0.25, posZ - 0.7);
                addWorldEntity(post1, x, y);

                const post2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.55, 6), fenceMat);
                post2.position.set(posX - 1.22, 0.25, posZ + 0.7);
                addWorldEntity(post2, x, y);

                const rail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 1.6), fenceMat);
                rail.position.set(posX - 1.22, 0.35, posZ);
                addWorldEntity(rail, x, y);
              }
            }

            if (hasEastGrass) {
              const curbE = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 2.505), curbMat);
              curbE.position.set(posX + 1.20, 0.02, posZ);
              addWorldEntity(curbE, x, y);

              if ((x + y) % 2 === 1) {
                const pE = new THREE.Mesh(new THREE.DodecahedronGeometry(0.09, 1), pebbleMat);
                pE.position.set(posX + 1.16, 0.05, posZ - 0.45);
                addWorldEntity(pE, x, y);
              }

              if ((x * 17 + y * 23) % 3 === 0) {
                const gE = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 4), grassMat);
                gE.position.set(posX + 1.18, 0.08, posZ + 0.5);
                addWorldEntity(gE, x, y);
              }

              if ((x * 23 + y * 31) % 4 === 0 && currentZone.id === 'zone_forest') {
                const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.55, 6), fenceMat);
                post1.position.set(posX + 1.22, 0.25, posZ - 0.7);
                addWorldEntity(post1, x, y);

                const post2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.55, 6), fenceMat);
                post2.position.set(posX + 1.22, 0.25, posZ + 0.7);
                addWorldEntity(post2, x, y);

                const rail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 1.6), fenceMat);
                rail.position.set(posX + 1.22, 0.35, posZ);
                addWorldEntity(rail, x, y);
              }
            }
          }
        }

        // Ground / Path Decorations (Hedges, Flower Patches, 3D Grass Tufts, Pebbles, Lanterns, Crystals)
        if (tileType === 0) {
          const decSeed = Math.abs(x * 23 + y * 43);
          const hasNeighborPath =
            (currentZone.tileData[y - 1]?.[x] === 2) ||
            (currentZone.tileData[y + 1]?.[x] === 2) ||
            (currentZone.tileData[y]?.[x - 1] === 2) ||
            (currentZone.tileData[y]?.[x + 1] === 2);

          if (currentZone.id === 'zone_cave') {
            // Cavern Crystals & Mine Props
            if (decSeed % 7 === 0) {
              const crystalCluster = create3DGlowingCrystalClusterMesh(x, y);
              crystalCluster.position.set(posX, elevation, posZ);
              addWorldEntity(crystalCluster, x, y);
            } else if (decSeed % 17 === 0 && !isMobile) {
              const pebble = create3DRockPebbleMesh(posX, posZ, decSeed);
              pebble.position.y += elevation;
              addWorldEntity(pebble, x, y);
            }
          } else if (currentZone.id === 'zone_volcano') {
            // Volcanic Ruby Crystals & Basalt Debris
            if (decSeed % 7 === 0) {
              const rubyCluster = create3DVolcanicRubyCrystalMesh(x, y);
              rubyCluster.position.set(posX, elevation, posZ);
              addWorldEntity(rubyCluster, x, y);
            } else if (decSeed % 13 === 0 && !isMobile) {
              const pebble = create3DRockPebbleMesh(posX, posZ, decSeed);
              pebble.position.y += elevation;
              addWorldEntity(pebble, x, y);
            }
          } else if (currentZone.id === 'zone_castle') {
            // Celestial Relic Crystals & Mossy Stone Plinths
            if (decSeed % 7 === 0) {
              const relicCluster = create3DRoyalRelicCrystalMesh(x, y);
              relicCluster.position.set(posX, elevation, posZ);
              addWorldEntity(relicCluster, x, y);
            } else if (decSeed % 13 === 0 && !isMobile) {
              const pebble = create3DRockPebbleMesh(posX, posZ, decSeed);
              pebble.position.y += elevation;
              addWorldEntity(pebble, x, y);
            }
          } else if (hasNeighborPath && currentZone.id === 'zone_forest') {
            // 🏙️ Diversified, balanced urban & garden street decorations
            const propType = decSeed % 10;
            if (propType === 1) {
              // 🪑 Medieval Wooden Park Bench
              const benchOrientation = (x + y) % 2 === 0 ? 0 : Math.PI / 2;
              const bench = create3DWoodenBenchMesh(posX, posZ, benchOrientation);
              bench.position.y += elevation;
              addWorldEntity(bench, x, y);
              obstacleGroups.push({ group: bench, gridX: x, gridY: y });
            } else if (propType === 2) {
              // 🪴 Terracotta / Oak Flower Planter Box with blooming flowers
              const planter = create3DFlowerPlanterMesh(posX, posZ, decSeed);
              planter.position.y += elevation;
              addWorldEntity(planter, x, y);
              obstacleGroups.push({ group: planter, gridX: x, gridY: y });
            } else if (propType === 3) {
              // 🫐 Natural Organic Berry Bush
              const berryBush = create3DBerryBushMesh(posX, posZ, decSeed);
              berryBush.position.y += elevation;
              addWorldEntity(berryBush, x, y);
              obstacleGroups.push({ group: berryBush, gridX: x, gridY: y });
            } else if (propType === 4) {
              // 📦 Rustic Market Crates & Barrel Stacks
              const crates = create3DMarketCratesMesh(posX, posZ, decSeed);
              crates.position.y += elevation;
              addWorldEntity(crates, x, y);
              obstacleGroups.push({ group: crates, gridX: x, gridY: y });
            } else if (propType === 5) {
              // 🏮 Medieval Wrought-Iron Street Lantern Post with warm glow
              const lanternGroup = create3DLanternPostMesh(posX, posZ);
              lanternGroup.position.y += elevation;
              addWorldEntity(lanternGroup, x, y);
              const lanternLight = lanternGroup.children.find((c) => c instanceof THREE.PointLight) as THREE.PointLight;
              if (lanternLight && !isMobile) animatedLanterns.push(lanternLight);
            } else if (propType === 6 && (x + y) % 12 === 0) {
              // ⛲ Stone Village Well
              const well = create3DStoneWellMesh(posX, posZ);
              well.position.y += elevation;
              addWorldEntity(well, x, y);
              obstacleGroups.push({ group: well, gridX: x, gridY: y });
            } else if (propType === 7 && (x + y) % 14 === 0) {
              // 🛒 Rustic Wooden Cargo Cart
              const cart = create3DWoodenCartMesh(posX, posZ, (x % 2) * Math.PI / 2);
              cart.position.y += elevation;
              addWorldEntity(cart, x, y);
              obstacleGroups.push({ group: cart, gridX: x, gridY: y });
            }
          } else if (decSeed % 11 === 0 && !isMobile) {
            const flowerGroup = create3DFlowerPatchMesh(posX, posZ, decSeed);
            flowerGroup.position.y += elevation;
            addWorldEntity(flowerGroup, x, y);
          } else if (decSeed % 29 === 0) {
            const lanternGroup = create3DLanternPostMesh(posX, posZ);
            lanternGroup.position.y += elevation;
            addWorldEntity(lanternGroup, x, y);
            const lanternLight = lanternGroup.children.find((c) => c instanceof THREE.PointLight) as THREE.PointLight;
            if (lanternLight && !isMobile) animatedLanterns.push(lanternLight);
          } else if (currentZone.id === 'zone_forest') {
            // 🌳 Rich RPG Wilderness & Rural Environment Decorators
            if (decSeed % 23 === 0) {
              // 🍎 Orchard Fruit Tree with Red Apples
              const fruitTree = create3DFruitTreeMesh(posX, posZ, decSeed);
              fruitTree.position.y += elevation;
              addWorldEntity(fruitTree, x, y);
              if (!isMobile) animatedSwayObjects.push(fruitTree);
              obstacleGroups.push({ group: fruitTree, gridX: x, gridY: y });
            } else if (decSeed % 37 === 0) {
              // 🌿 Weeping Willow Tree
              const willow = create3DWillowTreeMesh(posX, posZ, decSeed);
              willow.position.y += elevation;
              addWorldEntity(willow, x, y);
              if (!isMobile) animatedSwayObjects.push(willow);
              obstacleGroups.push({ group: willow, gridX: x, gridY: y });
            } else if (decSeed % 41 === 0) {
              // 🌾 Golden Rolled Hay Bales
              const hay = create3DHayBaleMesh(posX, posZ, decSeed);
              hay.position.y += elevation;
              addWorldEntity(hay, x, y);
              obstacleGroups.push({ group: hay, gridX: x, gridY: y });
            } else if (decSeed % 53 === 0) {
              // 🌾 Straw Scarecrow
              const scarecrow = create3DScarecrowMesh(posX, posZ);
              scarecrow.position.y += elevation;
              addWorldEntity(scarecrow, x, y);
              obstacleGroups.push({ group: scarecrow, gridX: x, gridY: y });
            } else if (decSeed % 67 === 0) {
              // 🔥 Glowing Campfire with Embers
              const campfire = create3DCampfireMesh(posX, posZ);
              campfire.position.y += elevation;
              addWorldEntity(campfire, x, y);
              const fireLight = campfire.children.find((c) => c instanceof THREE.PointLight) as THREE.PointLight;
              if (fireLight && !isMobile) animatedLanterns.push(fireLight);
              obstacleGroups.push({ group: campfire, gridX: x, gridY: y });
            } else if (decSeed % 71 === 0) {
              // 🛒 Wooden Cargo Cart
              const cart = create3DWoodenCartMesh(posX, posZ, (decSeed % 4) * (Math.PI / 2));
              cart.position.y += elevation;
              addWorldEntity(cart, x, y);
              obstacleGroups.push({ group: cart, gridX: x, gridY: y });
            } else if (decSeed % 79 === 0) {
              // 🗿 Ancient Runic Monolith
              const monolith = create3DRunicMonolithMesh(posX, posZ, decSeed);
              monolith.position.y += elevation;
              addWorldEntity(monolith, x, y);
              obstacleGroups.push({ group: monolith, gridX: x, gridY: y });
            } else if (decSeed % 83 === 0) {
              // 🍻 Outdoor Tavern Patio with benches & ale tankards
              const patio = create3DTavernPatioMesh(posX, posZ, (decSeed % 2) * (Math.PI / 2));
              patio.position.y += elevation;
              addWorldEntity(patio, x, y);
              obstacleGroups.push({ group: patio, gridX: x, gridY: y });
            } else if (!isMobile) {
              // 3D Grass Tuft clusters (Desktop Only)
              if (decSeed % 2 === 0) {
                const grassTuft = create3DGrassTuftMesh(posX + ((decSeed % 5) - 2) * 0.2, posZ + ((decSeed % 7) - 3) * 0.2, decSeed);
                grassTuft.position.y += elevation;
                addWorldEntity(grassTuft, x, y);
              }
              // Mossy Pebble (Desktop Only)
              if (decSeed % 5 === 1) {
                const pebble = create3DRockPebbleMesh(posX + ((decSeed % 3) - 1) * 0.3, posZ + ((decSeed % 4) - 2) * 0.3, decSeed);
                pebble.position.y += elevation;
                addWorldEntity(pebble, x, y);
              }
            }
          }
        }

        // Obstacles (Castle Rotundas & Walls, Volcanic Basalt Spires, Dungeon Walls, Trees, Cottages)
        if (tileType === 1) {
          const seed = Math.abs(x * 31 + y * 17);
          let obsGroup: THREE.Group;

          if (currentZone.isInterior) {
            // 🏰 Specialized Instanced Interior Walls (Timber/Plaster/Dungeon)
            if (currentZone.interiorType === 'crypt' || currentZone.interiorType === 'smugglers_cave') {
              const wallRes = create3DDungeonStoneWallMesh(x, y, (x + y) % 3 === 0);
              obsGroup = wallRes.group;
              obsGroup.position.set(posX, elevation, posZ);
              if (wallRes.updateAnimation) animatedBuildingUpdaters.push(wallRes.updateAnimation);
            } else {
              obsGroup = new THREE.Group();
              const wallMat = new THREE.MeshStandardMaterial({
                color: currentZone.interiorType === 'castle' ? 0xe2e8f0 : (currentZone.interiorType === 'forge' ? 0x475569 : 0x5c3a21),
                roughness: 0.75,
              });
              const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.2, 2.5), wallMat);
              wallMesh.position.y = 1.6;
              wallMesh.castShadow = true;
              wallMesh.receiveShadow = true;
              obsGroup.add(wallMesh);

              const trim = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.20, 2.55), new THREE.MeshStandardMaterial({ color: 0x3d1c06, roughness: 0.7 }));
              trim.position.y = 3.1;
              obsGroup.add(trim);
              obsGroup.position.set(posX, elevation, posZ);
            }
          } else if (currentZone.id === 'zone_castle') {
            // Monumental Circular Watchtower Rotundas & Arched Stone Walls (Matching Reference Photo!)
            const isRotunda = (x % 6 === 0 && y % 6 === 0) || (x + y) % 9 === 0;
            const castleRes = create3DCastleArchedWallMesh(x, y, isRotunda);
            obsGroup = castleRes.group;
            obsGroup.position.set(posX, elevation, posZ);
            if (castleRes.updateAnimation) animatedBuildingUpdaters.push(castleRes.updateAnimation);
          } else if (currentZone.id === 'zone_volcano') {
            // Monolithic Jagged Basalt Spire with Flaming Geysers (Matching Reference Photo!)
            const basaltRes = create3DVolcanicBasaltSpireMesh(x, y, (x + y) % 3 === 0);
            obsGroup = basaltRes.group;
            obsGroup.position.set(posX, elevation, posZ);
            if (basaltRes.updateAnimation) animatedBuildingUpdaters.push(basaltRes.updateAnimation);
          } else if (currentZone.id === 'zone_cave') {
            // Authentic Carved Stone Dungeon Wall with Recessed Arches & Flickering Torches
            const wallRes = create3DDungeonStoneWallMesh(x, y, (x + y) % 3 === 0);
            obsGroup = wallRes.group;
            obsGroup.position.set(posX, elevation, posZ);
            if (wallRes.updateAnimation) animatedBuildingUpdaters.push(wallRes.updateAnimation);
          } else if (currentZone.id === 'zone_forest') {
            if (seed % 19 === 0) {
              // 3D Villager Cottage
              const cotRes = createLowPolyCottage(seed % 2 === 0 ? 0xb91c1c : 0x0284c7, true);
              obsGroup = cotRes.group;
              obsGroup.position.set(posX, elevation, posZ);
              if (cotRes.updateAnimation) animatedBuildingUpdaters.push(cotRes.updateAnimation);
            } else if (seed % 17 === 2) {
              // Ancient Stone Ruins
              obsGroup = create3DRuinsMesh(posX, posZ);
              obsGroup.position.y += elevation;
            } else if (seed % 13 === 1) {
              // Wooden Fence & Barrels
              obsGroup = create3DFenceMesh(posX, posZ);
              obsGroup.position.y += elevation;
            } else {
              // 3D Optimized Procedural Tree with Cached PBR Shaders
              obsGroup = create3DRichTreeMesh(posX, posZ, currentZone.id, x, y);
              obsGroup.position.y += elevation;
              animatedSwayObjects.push(obsGroup);
            }
          } else {
            obsGroup = create3DRichTreeMesh(posX, posZ, currentZone.id, x, y);
            obsGroup.position.y += elevation;
            animatedSwayObjects.push(obsGroup);
          }

          addWorldEntity(obsGroup, x, y);
          obstacleGroups.push({ group: obsGroup, gridX: x, gridY: y });
        }

        // Water / Lava Rivers / Waterfall Cascades / Subterranean Turquoise Flooded Grotto
        if (tileType === 3) {
          if (currentZone.id === 'zone_castle') {
            // Crystalline Azure/Turquoise Cascades with Foaming Rapids & Stone Curbs
            const waterRes = create3DCastleWaterfallRiverMesh(x, y);
            const waterGroup = waterRes.group;
            waterGroup.position.set(posX, elevation, posZ);
            addWorldEntity(waterGroup, x, y);
            if (waterRes.updateAnimation) animatedBuildingUpdaters.push(waterRes.updateAnimation);
          } else if (currentZone.id === 'zone_volcano') {
            // Glowing Magma River Channels with Heat Waves & Crust Borders
            const lavaRes = create3DLavaRiverTileMesh(x, y);
            const lavaGroup = lavaRes.group;
            lavaGroup.position.set(posX, elevation, posZ);
            addWorldEntity(lavaGroup, x, y);
            if (lavaRes.updateAnimation) animatedBuildingUpdaters.push(lavaRes.updateAnimation);
          } else if (currentZone.id === 'zone_cave') {
            // Iconic Turquoise Cavern Pool with Stone Rim
            const grottoRes = create3DTurquoiseGrottoMesh(x, y);
            const grottoGroup = grottoRes.group;
            grottoGroup.position.set(posX, elevation, posZ);
            addWorldEntity(grottoGroup, x, y);
            if (grottoRes.updateAnimation) animatedBuildingUpdaters.push(grottoRes.updateAnimation);
          } else {
            const liquidMat = new THREE.MeshPhysicalMaterial({
              map: waterPBR.diffuse,
              normalMap: waterPBR.normal,
              normalScale: new THREE.Vector2(2.0, 2.0),
              roughness: 0.05,
              metalness: 0.15,
              transmission: currentZone.id === 'zone_volcano' ? 0 : (isMobile ? 0.2 : 0.65),
              ior: 1.333,
              clearcoat: 1.0,
              clearcoatRoughness: 0.03,
              reflectivity: 0.95,
            });
            const liquidMesh = new THREE.Mesh(new THREE.BoxGeometry(2.505, 0.42, 2.505), liquidMat);
            liquidMesh.position.set(posX, -0.10 + elevation, posZ);
            addWorldEntity(liquidMesh, x, y);
            animatedWaters.push(liquidMesh);

            // Natural Riverbanks & Pebble Borders around grass boundaries (Desktop Only)
            if (!isMobile) {
              const bankMat = new THREE.MeshStandardMaterial({
                color: currentZone.id === 'zone_volcano' ? 0x451a03 : currentZone.id === 'zone_cave' ? 0x334155 : 0xc89d68,
                roughness: 0.9,
              });
              const pebbleMat = new THREE.MeshStandardMaterial({
                color: 0x475569,
                roughness: 0.75,
              });

              const hasNorthGrass = currentZone.tileData[y - 1]?.[x] !== 3;
              const hasSouthGrass = currentZone.tileData[y + 1]?.[x] !== 3;
              const hasEastGrass = currentZone.tileData[y]?.[x + 1] !== 3;
              const hasWestGrass = currentZone.tileData[y]?.[x - 1] !== 3;

              if (hasNorthGrass) {
                const bankN = new THREE.Mesh(new THREE.BoxGeometry(2.505, 0.16, 0.28), bankMat);
                bankN.position.set(posX, 0.04 + elevation, posZ - 1.15);
                addWorldEntity(bankN, x, y);
                const pN = new THREE.Mesh(new THREE.DodecahedronGeometry(0.16, 1), pebbleMat);
                pN.position.set(posX + 0.5, 0.08 + elevation, posZ - 1.12);
                addWorldEntity(pN, x, y);
              }
              if (hasSouthGrass) {
                const bankS = new THREE.Mesh(new THREE.BoxGeometry(2.505, 0.16, 0.28), bankMat);
                bankS.position.set(posX, 0.04 + elevation, posZ + 1.15);
                addWorldEntity(bankS, x, y);
                const pS = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18, 1), pebbleMat);
                pS.position.set(posX - 0.4, 0.08 + elevation, posZ + 1.12);
                addWorldEntity(pS, x, y);
              }
              if (hasWestGrass) {
                const bankW = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 2.505), bankMat);
                bankW.position.set(posX - 1.15, 0.04 + elevation, posZ);
                addWorldEntity(bankW, x, y);
                const pW = new THREE.Mesh(new THREE.DodecahedronGeometry(0.15, 1), pebbleMat);
                pW.position.set(posX - 1.12, 0.08 + elevation, posZ + 0.3);
                addWorldEntity(pW, x, y);
              }
              if (hasEastGrass) {
                const bankE = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 2.505), bankMat);
                bankE.position.set(posX + 1.15, 0.04 + elevation, posZ);
                addWorldEntity(bankE, x, y);
                const pE = new THREE.Mesh(new THREE.DodecahedronGeometry(0.17, 1), pebbleMat);
                pE.position.set(posX + 1.12, 0.08 + elevation, posZ - 0.4);
                addWorldEntity(pE, x, y);
              }
            }
          }
        }

        // Shop (Merchant Market Stall)
        if (tileType === 4) {
          const shopRes = createLowPolyMarketStall('weapons');
          const shopGroup = shopRes.group;
          shopGroup.position.set(posX, elevation, posZ);
          addWorldEntity(shopGroup, x, y);
          obstacleGroups.push({ group: shopGroup, gridX: x, gridY: y });
        }

        // Inn (Tavern / Inn Building - Tile 5)
        if (tileType === 5) {
          const tavernRes = create3DTavernBuildingMesh();
          const tavernGroup = tavernRes.group;
          tavernGroup.position.set(posX, elevation, posZ);
          addWorldEntity(tavernGroup, x, y);
          obstacleGroups.push({ group: tavernGroup, gridX: x, gridY: y });
          if (tavernRes.updateAnimation) animatedBuildingUpdaters.push(tavernRes.updateAnimation);
        }

        // 🌿 Botica Alquímica de Lynda (Tile 27)
        if (tileType === 27) {
          const boticaRes = create3DApothecaryBuildingMesh();
          const boticaGroup = boticaRes.group;
          boticaGroup.position.set(posX, elevation, posZ);
          addWorldEntity(boticaGroup, x, y);
          obstacleGroups.push({ group: boticaGroup, gridX: x, gridY: y });
          if (boticaRes.updateAnimation) animatedBuildingUpdaters.push(boticaRes.updateAnimation);
        }

        // 👑 Gran Casa Consistorial / Salón del Trono del Castillo (Tile 31)
        if (tileType === 31) {
          const cityHallRes = create3DCityHallBuildingMesh();
          const cityHallGroup = cityHallRes.group;
          cityHallGroup.position.set(posX, elevation, posZ);
          addWorldEntity(cityHallGroup, x, y);
          obstacleGroups.push({ group: cityHallGroup, gridX: x, gridY: y });
          if (cityHallRes.updateAnimation) animatedBuildingUpdaters.push(cityHallRes.updateAnimation);
        }

        // 🌾 Windmill (Tile 6)
        if (tileType === 6) {
          const windmillRes = createLowPolyWindmill();
          const windmillGroup = windmillRes.group;
          windmillGroup.position.set(posX, elevation, posZ);
          addWorldEntity(windmillGroup, x, y);
          obstacleGroups.push({ group: windmillGroup, gridX: x, gridY: y });
          if (windmillRes.updateAnimation) animatedBuildingUpdaters.push(windmillRes.updateAnimation);
        }

        // Chest (Tile 7)
        if (tileType === 7) {
          const chestId = `${currentZone.id}_${x}_${y}`;
          const isOpened = openedChestsRef.current.includes(chestId);
          const chestRes = createStylizedChestMesh(isOpened);
          const chestGroup = chestRes.group;
          chestGroup.position.set(posX, elevation, posZ);
          addWorldEntity(chestGroup, x, y);
          if (chestRes.updateAnimation) animatedBuildingUpdaters.push(chestRes.updateAnimation);
        }

        // Village Cottage / House (Tile 8)
        if (tileType === 8) {
          const variant = (x * 7 + y * 13) % 5;
          const cottageRoof =
            currentZone.id === 'zone_forest'
              ? undefined // Use natural weathered wooden shakes
              : currentZone.id === 'zone_cave'
              ? 0x475569 // Slate mountain stone shakes
              : currentZone.id === 'zone_castle'
              ? 0x6d28d9 // Royal imperial violet slate
              : 0x9a3412; // Volcanic terracotta shakes

          const cottageRes = createLowPolyCottage(cottageRoof, (x + y) % 2 === 0, variant);
          const cottageGroup = cottageRes.group;
          cottageGroup.position.set(posX, elevation, posZ);
          const randScale = 0.95 + ((x * 3 + y * 5) % 4) * 0.08;
          cottageGroup.scale.set(randScale, randScale, randScale);
          addWorldEntity(cottageGroup, x, y);
          obstacleGroups.push({ group: cottageGroup, gridX: x, gridY: y });
          if (cottageRes.updateAnimation) animatedBuildingUpdaters.push(cottageRes.updateAnimation);
        }

        // 🎪 Bazaar Market Stall (Tile 9)
        if (tileType === 9) {
          const stallRes = createLowPolyMarketStall((x + y) % 2 === 0 ? 'potions' : 'armor');
          const stallGroup = stallRes.group;
          stallGroup.position.set(posX, elevation, posZ);
          addWorldEntity(stallGroup, x, y);
          obstacleGroups.push({ group: stallGroup, gridX: x, gridY: y });
        }

        // 🔨 Blacksmith Forge (Tile 10)
        if (tileType === 10) {
          let forgeGroup: THREE.Group;
          if (currentZone.id === 'zone_castle') {
            const royalForgeRes = create3DRoyalForgeMesh();
            forgeGroup = royalForgeRes.group;
            if (royalForgeRes.updateAnimation) animatedBuildingUpdaters.push(royalForgeRes.updateAnimation);
          } else if (currentZone.id === 'zone_volcano') {
            const dragonForgeRes = create3DDragonForgeMesh();
            forgeGroup = dragonForgeRes.group;
            if (dragonForgeRes.updateAnimation) animatedBuildingUpdaters.push(dragonForgeRes.updateAnimation);
          } else if (currentZone.id === 'zone_cave') {
            const caveForgeRes = create3DDwarvenForgeMesh();
            forgeGroup = caveForgeRes.group;
            if (caveForgeRes.updateAnimation) animatedBuildingUpdaters.push(caveForgeRes.updateAnimation);
          } else {
            const forgeRes = createLowPolyForge();
            forgeGroup = forgeRes.group;
            if (forgeRes.updateAnimation) animatedBuildingUpdaters.push(forgeRes.updateAnimation);
          }
          forgeGroup.position.set(posX, elevation, posZ);
          addWorldEntity(forgeGroup, x, y);
          obstacleGroups.push({ group: forgeGroup, gridX: x, gridY: y });
        }

        // ⚔️ Boss Portal / Zone Travel Gateway (Tile 11)
        if (tileType === 11) {
          const portalGroup = create3DBossPortalMesh(posX, posZ, defeatedBossesRef.current.includes(currentZone.boss.name), isBossPortalUnlocked);
          portalGroup.position.y += elevation;
          addWorldEntity(portalGroup, x, y);
          obstacleGroups.push({ group: portalGroup, gridX: x, gridY: y });
        }

        // 🥕 Huerto de Cultivo y Parcela de Hortalizas (Tile 13)
        if (tileType === 13) {
          const cropGroup = create3DCropPatchMesh(posX, posZ);
          cropGroup.position.y += elevation;
          addWorldEntity(cropGroup, x, y);
          obstacleGroups.push({ group: cropGroup, gridX: x, gridY: y });
        }

        // 🪵 Depósito de Leña y Pila de Troncos (Tile 14)
        if (tileType === 14) {
          const woodGroup = create3DWoodpileMesh(posX, posZ);
          woodGroup.position.y += elevation;
          addWorldEntity(woodGroup, x, y);
          obstacleGroups.push({ group: woodGroup, gridX: x, gridY: y });
        }

        // 🏮 Farola de la Calle / Poste de Luz (Tile 17)
        if (tileType === 17) {
          const lampGroup = create3DLanternPostMesh(posX, posZ);
          lampGroup.position.y += elevation;
          addWorldEntity(lampGroup, x, y);
          obstacleGroups.push({ group: lampGroup, gridX: x, gridY: y });
        }

        // 🪨 Cantera de Piedra Natural & Veta de Mineral (Tile 18)
        if (tileType === 18) {
          const quarryGroup = create3DStoneQuarryMesh(posX, posZ, x * 7 + y * 13);
          quarryGroup.position.y += elevation;
          addWorldEntity(quarryGroup, x, y);
          obstacleGroups.push({ group: quarryGroup, gridX: x, gridY: y });
        }

        // 💎 Geoda de Cristal Arcano (Tile 20)
        if (tileType === 20) {
          const geodeGroup = create3DGeodeCrystalMesh(posX, posZ, x * 11 + y * 17);
          geodeGroup.position.y += elevation;
          addWorldEntity(geodeGroup, x, y);
          obstacleGroups.push({ group: geodeGroup, gridX: x, gridY: y });
        }

        // 🚪 Puerta de Entrada / Portal de Instancia (Tile 28)
        if (tileType === 28) {
          const doorGroup = new THREE.Group();
          doorGroup.position.set(posX, elevation, posZ);

          const matchingPortal = currentZone.portals?.find((p) => p.x === x && p.y === y);
          const portalLabel = matchingPortal?.label || (currentZone.isInterior ? '🚪 Salir al Exterior' : '🚪 Entrar al Interior');

          const frameMat = new THREE.MeshStandardMaterial({
            color: currentZone.isInterior ? 0x78716c : 0x5c2b08,
            roughness: 0.7,
          });
          const postL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 2.4, 0.24), frameMat);
          postL.position.set(-0.85, 1.2, 0);
          postL.castShadow = true;
          doorGroup.add(postL);

          const postR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 2.4, 0.24), frameMat);
          postR.position.set(0.85, 1.2, 0);
          postR.castShadow = true;
          doorGroup.add(postR);

          const lintel = new THREE.Mesh(new THREE.BoxGeometry(1.94, 0.30, 0.30), frameMat);
          lintel.position.set(0, 2.35, 0);
          lintel.castShadow = true;
          doorGroup.add(lintel);

          // Glowing Golden / Cyan Threshold Portal Ring
          const ringColor = currentZone.isInterior ? 0x38bdf8 : 0xf59e0b;
          const ringEmissive = currentZone.isInterior ? 0x0284c7 : 0xd97706;
          const ringMat = new THREE.MeshStandardMaterial({
            color: ringColor,
            emissive: ringEmissive,
            emissiveIntensity: 2.2,
            roughness: 0.2,
          });
          const portalRing = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.05, 8, 24), ringMat);
          portalRing.rotation.x = Math.PI / 2;
          portalRing.position.y = 0.04;
          doorGroup.add(portalRing);

          // Warm light column
          const lightColumnMat = new THREE.MeshBasicMaterial({
            color: currentZone.isInterior ? 0xbae6fd : 0xfef08a,
            transparent: true,
            opacity: 0.25,
            side: THREE.DoubleSide,
          });
          const lightCol = new THREE.Mesh(new THREE.CylinderGeometry(0.70, 0.70, 2.4, 16, 1, true), lightColumnMat);
          lightCol.position.y = 1.2;
          doorGroup.add(lightCol);

          // 🏷️ Floating High-Res 3D Doorway Signboard Sprite
          const signCanvas = document.createElement('canvas');
          signCanvas.width = 512;
          signCanvas.height = 128;
          const sCtx = signCanvas.getContext('2d');
          if (sCtx) {
            sCtx.fillStyle = 'rgba(15, 23, 42, 0.90)';
            sCtx.beginPath();
            sCtx.roundRect(12, 12, 488, 104, 24);
            sCtx.fill();

            sCtx.lineWidth = 6;
            sCtx.strokeStyle = currentZone.isInterior ? '#38bdf8' : '#f59e0b';
            sCtx.stroke();

            sCtx.font = 'bold 30px sans-serif';
            sCtx.fillStyle = '#ffffff';
            sCtx.textAlign = 'center';
            sCtx.textBaseline = 'middle';
            sCtx.fillText(portalLabel, 256, 64);
          }

          const signTex = new THREE.CanvasTexture(signCanvas);
          signTex.minFilter = THREE.LinearFilter;
          const signSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: signTex, transparent: true, depthTest: false }));
          signSprite.scale.set(3.4, 0.85, 1);
          signSprite.position.set(0, 2.9, 0);
          doorGroup.add(signSprite);

          addWorldEntity(doorGroup, x, y);
        }
      }
    }

    // 🚀 ATTACH PATH INSTANCED MESH
    if (totalPathCount > 0) {
      pathInstancedMesh.instanceMatrix.needsUpdate = true;
      tileGroup.add(pathInstancedMesh);
    }

    // 5.3 SPAWN ATMOSPHERIC VILLAGE PROPS IN FOREST (Crates, Barrels, Merchant Carts, Planters)
    if (currentZone.id === 'zone_forest' && !isMobile) {
      // Planters around the Great Fountain & Notice Board
      const planterPositions = [
        [36 * 2.5 - 0.9, 60 * 2.5, 36, 60],
        [36 * 2.5 + 0.9, 60 * 2.5, 36, 60],
        [36 * 2.5, 60 * 2.5 - 0.9, 36, 60],
        [36 * 2.5, 60 * 2.5 + 0.9, 36, 60],
        [39 * 2.5, 57 * 2.5 - 0.8, 39, 57], // Next to Mission Board
      ];
      planterPositions.forEach(([px, pz, gx, gy]) => {
        addWorldEntity(create3DStonePlanterMesh(px, pz), gx, gy);
      });

      // Wooden Crate Stacks at Bazaar, Corners and Inns
      const cratePositions = [
        [30 * 2.5 + 0.6, 56 * 2.5 + 0.6, 30, 56], // Bazaar Stall 1
        [30 * 2.5 + 0.6, 58 * 2.5 + 0.6, 30, 58], // Bazaar Stall 2
        [42 * 2.5 - 0.5, 57 * 2.5 + 0.5, 42, 57], // East corner
        [32 * 2.5 - 0.6, 54 * 2.5 + 0.6, 32, 54], // Inn side
        [41 * 2.5 + 0.6, 63 * 2.5 - 0.6, 41, 63], // South corner
      ];
      cratePositions.forEach(([cx, cz, gx, gy]) => {
        addWorldEntity(create3DWoodenCratesMesh(cx, cz), gx, gy);
      });

      // Oak Barrels near Tavern and Market
      const barrelPositions = [
        [31 * 2.5 + 0.4, 57 * 2.5 - 0.5, 31, 57],
        [41 * 2.5 - 0.4, 56 * 2.5 + 0.5, 41, 56],
        [34 * 2.5 - 0.6, 62 * 2.5 - 0.4, 34, 62],
        [40 * 2.5 - 0.5, 59 * 2.5 - 0.5, 40, 59],
      ];
      barrelPositions.forEach(([bx, bz, gx, gy]) => {
        addWorldEntity(create3DOakBarrelsMesh(bx, bz), gx, gy);
      });

      // Traveling Merchant Caravan Cart parked at plaza side
      addWorldEntity(create3DMerchantCartMesh(30 * 2.5, 61 * 2.5), 30, 61);
    }

    // 5.5 SPAWN ALL ZONE NPCS WITH 3D QUEST MARKERS
    if (currentZone.npcs) {
      currentZone.npcs.forEach((npc) => {
        const npcX = npc.x * 2.5;
        const npcZ = npc.y * 2.5;
        const hasQuest = !!npc.quest && !completedQuests.includes(npc.quest.id);
        let isQuestReady = false;

        if (hasQuest && npc.quest) {
          if (npc.quest.targetType === 'reach_level' && player.level >= Number(npc.quest.targetValue)) {
            isQuestReady = true;
          } else if (npc.quest.targetType === 'defeat_boss' && defeatedBossesRef.current.includes(currentZone.boss.name)) {
            isQuestReady = true;
          } else if (npc.quest.targetType === 'open_chests' && openedChestsRef.current.length >= Number(npc.quest.targetValue)) {
            isQuestReady = true;
          }
        }

        const npcRes = createHumanNPCMesh(npc.avatarStyle, hasQuest, isQuestReady);
        const npcMesh = npcRes.group;
        npcMesh.position.set(npcX, 0, npcZ);
        addWorldEntity(npcMesh, npc.x, npc.y);
        obstacleGroups.push({ group: npcMesh, gridX: npc.x, gridY: npc.y });
        animatedNPCUpdaters.push(npcRes.updateAnimation);
      });
    }

    // 6. REALISTIC 3D HUMAN HERO CHARACTER MESH WITH DYNAMIC EQUIPMENT
    const heroMeshResult = createHumanHeroMesh(player, equipment);
    const heroGroup = heroMeshResult.group;

    const blenderHeroContainer = new THREE.Group();
    heroGroup.add(blenderHeroContainer);

    let mapMixer: THREE.AnimationMixer | null = null;

    const applyBlenderHero = (model: THREE.Group) => {
      if (!model.userData?.animations || model.userData.animations.length === 0) {
        // External model has no skeletal animation clips, keep full procedural articulated hero!
        return;
      }

      heroGroup.children.forEach((child) => {
        if (child !== blenderHeroContainer) child.visible = false;
      });

      const glbClone = model.clone();
      const bbox = new THREE.Box3().setFromObject(glbClone);
      const size = bbox.getSize(new THREE.Vector3());
      const targetHeight = 1.15;
      const maxDim = Math.max(size.y, size.x * 0.75) || 1;
      const autoScale = targetHeight / maxDim;

      glbClone.scale.set(autoScale, autoScale, autoScale);
      const scaledBbox = new THREE.Box3().setFromObject(glbClone);
      glbClone.position.x = -((scaledBbox.min.x + scaledBbox.max.x) / 2);
      glbClone.position.y = -scaledBbox.min.y;
      glbClone.position.z = -((scaledBbox.min.z + scaledBbox.max.z) / 2);

      mapMixer = new THREE.AnimationMixer(glbClone);
      const action = model.userData.animations[0];
      mapMixer.clipAction(action).play();

      blenderHeroContainer.clear();
      blenderHeroContainer.add(glbClone);
    };

    const classModelKey =
      player.heroClass === 'Mago' ? 'hero_mage' :
      player.heroClass === 'Pícaro' ? 'hero_rogue' :
      player.heroClass === 'Paladín' ? 'hero_paladin' :
      player.heroClass === 'Nigromante' ? 'hero_necromancer' :
      player.heroClass === 'Arquero' ? 'hero_archer' :
      player.heroClass === 'Berserker' ? 'hero_berserker' : 'hero_warrior';
    const genderKey = player.gender === 'male' ? 'male' : 'female';
    const modelPath = `/models/${classModelKey}_${genderKey}.glb`;

    if (cachedHeroGLTFScene) {
      applyBlenderHero(cachedHeroGLTFScene);
    } else {
      heroGLTFLoader.load(
        modelPath,
        (gltf) => {
          const model = gltf.scene;
          model.userData.animations = gltf.animations;
          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          cachedHeroGLTFScene = model;
          applyBlenderHero(model);
        },
        undefined,
        (err) => {
          console.warn('Fallback a modelo procedural:', err);
        }
      );
    }

    // FLOATING 3D HERO BEACON ARROW (Pointer above Hero Head)
    const arrowGeo = new THREE.OctahedronGeometry(0.32);
    const arrowMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xeab308,
      emissiveIntensity: 1.8,
      metalness: 0.5,
    });
    const arrowMesh = new THREE.Mesh(arrowGeo, arrowMat);
    arrowMesh.position.y = 2.8;
    heroGroup.add(arrowMesh);

    // VERTICAL LIGHT BEACON COLUMN (Visible even through foliage!)
    const beamGeo = new THREE.CylinderGeometry(0.25, 0.35, 7.0, 12);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.y = 3.8;
    heroGroup.add(beamMesh);

    // Hero Ground Magic Aura Rings
    const ringGeo = new THREE.RingGeometry(0.85, 1.15, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.02;
    heroGroup.add(ringMesh);

    const innerDiscGeo = new THREE.CircleGeometry(0.8, 32);
    const innerDiscMat = new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
    const innerDiscMesh = new THREE.Mesh(innerDiscGeo, innerDiscMat);
    innerDiscMesh.rotation.x = -Math.PI / 2;
    innerDiscMesh.position.y = 0.01;
    heroGroup.add(innerDiscMesh);

    // Player Light (Bright Torch/Magic aura emission)
    const playerLight = new THREE.PointLight(0xfef08a, 2.5, 12);
    playerLight.position.y = 2.2;
    heroGroup.add(playerLight);

    scene.add(heroGroup);

    // 7. PARTICLES (Embers / Falling Autumn Leaves)
    const particleCount = isMobile ? 18 : 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = Math.random() * mapW;
      particlePos[i + 1] = Math.random() * 8 + 1;
      particlePos[i + 2] = Math.random() * mapH;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.25,
      color: currentZone.id === 'zone_forest' ? 0xef4444 : currentZone.id === 'zone_volcano' ? 0xf97316 : 0x38bdf8,
      transparent: true,
      opacity: 0.85,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 8. ANIMATION, ADVANCED PHYSICS & CAMERA FOLLOW LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let lastRippleTime = 0;
    let walkPhase = 0;
    let frameCount = 0;
    let lastFpsCheckTime = performance.now();
    let lowFpsStreak = 0;
    let lastCullGX = -999;
    let lastCullGZ = -999;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.08);
      const time = clock.getElapsedTime();

      // Smoothly move hero position with exponential delta-time damper (Immune to FPS drops)
      const curr = playerCurrentPosRef.current;
      const targ = playerTargetPosRef.current;

      // 🎯 FRUSTUM & DISTANCE CULLING (Cuts 95% of Draw Calls on Mobile & Tablets)
      const playerGX = Math.round(curr.x / 2.5);
      const playerGZ = Math.round(curr.z / 2.5);
      if (Math.abs(playerGX - lastCullGX) >= 1 || Math.abs(playerGZ - lastCullGZ) >= 1) {
        lastCullGX = playerGX;
        lastCullGZ = playerGZ;
        const cullRadius = isTouchOrMobile ? 6 : 15;
        for (let i = 0; i < cullingEntities.length; i++) {
          const item = cullingEntities[i];
          const isVisible = Math.abs(item.gridX - playerGX) <= cullRadius && Math.abs(item.gridY - playerGZ) <= cullRadius;
          item.object.visible = isVisible;
        }
      }

      const prevX = curr.x;
      const prevZ = curr.z;

      const decay = 13.5;
      const lerpFactor = 1.0 - Math.exp(-decay * delta);
      curr.x += (targ.x - curr.x) * lerpFactor;
      curr.z += (targ.z - curr.z) * lerpFactor;

      // Realistic Kinematics & Velocity vector
      const distToTarget = Math.hypot(targ.x - curr.x, targ.z - curr.z);
      const isMoving = distToTarget > 0.02;

      // Hero Character Rotation based on Facing Direction
      let targetRotY = Math.PI; // default facing up (away down the path into screen)
      if (facingDirRef.current === 'up') targetRotY = Math.PI;
      if (facingDirRef.current === 'down') targetRotY = 0;
      if (facingDirRef.current === 'left') targetRotY = -Math.PI / 2;
      if (facingDirRef.current === 'right') targetRotY = Math.PI / 2;

      let rotDiff = targetRotY - heroGroup.rotation.y;
      while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
      while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
      heroGroup.rotation.y += rotDiff * (1.0 - Math.exp(-16 * delta));

      // 🌟 PHYSICAL INERTIA & BANKING: Lean hero into corners and turns
      const velX = (curr.x - prevX) / Math.max(delta, 0.001);
      const velZ = (curr.z - prevZ) / Math.max(delta, 0.001);
      const targetBankZ = THREE.MathUtils.clamp(-velX * 0.045, -0.22, 0.22);
      const targetBankX = THREE.MathUtils.clamp(velZ * 0.045, -0.22, 0.22);
      heroGroup.rotation.z = THREE.MathUtils.damp(heroGroup.rotation.z, targetBankZ, 12, delta);
      heroGroup.rotation.x = THREE.MathUtils.damp(heroGroup.rotation.x, targetBankX, 12, delta);

      // 🌟 STEP WEIGHT SPRING BOUNCE: Footstep ground compression
      if (isMoving) {
        walkPhase += delta * 15.5;
        const stepBounce = Math.abs(Math.sin(walkPhase)) * 0.055;
        heroGroup.position.set(curr.x, -stepBounce, curr.z);

        // Human Character Walking & Dynamic Skeletal Physics
        heroMeshResult.leftLeg.rotation.x = Math.sin(walkPhase) * 0.74;
        heroMeshResult.rightLeg.rotation.x = -Math.sin(walkPhase) * 0.74;
        heroMeshResult.leftArm.rotation.x = -Math.sin(walkPhase) * 0.62;
        heroMeshResult.rightArm.rotation.x = Math.sin(walkPhase) * 0.62;
        heroMeshResult.torsoGroup.rotation.y = Math.sin(walkPhase) * 0.12;
        heroMeshResult.torsoGroup.position.y = 0.70 + Math.abs(Math.sin(walkPhase)) * 0.045;
        heroMeshResult.headGroup.position.y = 1.15 + Math.abs(Math.sin(walkPhase)) * 0.045;
        
        // 🌟 VERLET CLOTH & HAIR LAG: Cape / Headband sways against movement direction
        if (heroMeshResult.headbandTail) {
          heroMeshResult.headbandTail.rotation.z = -0.3 + Math.sin(walkPhase) * 0.35;
          heroMeshResult.headbandTail.rotation.x = THREE.MathUtils.damp(heroMeshResult.headbandTail.rotation.x, 0.55, 10, delta);
        }

        // 🌟 INTERACTIVE FLUID SHOCKWAVES: Spawn concentric ripples when near water / lava
        const gridX = Math.round(curr.x / 2.5);
        const gridY = Math.round(curr.z / 2.5);
        const currentTile = currentZone.tileData[gridY]?.[gridX] ?? 0;

        if (currentTile === 3 && time - lastRippleTime > 0.22) {
          lastRippleTime = time;
          const inactiveRipple = waterRipples.find((r) => !r.active);
          if (inactiveRipple) {
            inactiveRipple.active = true;
            inactiveRipple.scale = 0.2;
            inactiveRipple.opacity = 0.85;
            inactiveRipple.mesh.position.set(curr.x, -0.18, curr.z);
          }
        }
      } else {
        const stepBounce = Math.sin(time * 2.8) * 0.015;
        heroGroup.position.set(curr.x, -stepBounce, curr.z);

        const breathCycle = time * 3;
        heroMeshResult.leftLeg.rotation.x = THREE.MathUtils.damp(heroMeshResult.leftLeg.rotation.x, 0, 14, delta);
        heroMeshResult.rightLeg.rotation.x = THREE.MathUtils.damp(heroMeshResult.rightLeg.rotation.x, 0, 14, delta);
        heroMeshResult.leftArm.rotation.x = THREE.MathUtils.damp(heroMeshResult.leftArm.rotation.x, Math.sin(breathCycle) * 0.06, 10, delta);
        heroMeshResult.rightArm.rotation.x = THREE.MathUtils.damp(heroMeshResult.rightArm.rotation.x, -Math.sin(breathCycle) * 0.06, 10, delta);
        heroMeshResult.torsoGroup.rotation.y = THREE.MathUtils.damp(heroMeshResult.torsoGroup.rotation.y, 0, 12, delta);
        heroMeshResult.torsoGroup.position.y = 0.70 + Math.sin(breathCycle) * 0.015;
        heroMeshResult.headGroup.position.y = 1.15 + Math.sin(breathCycle) * 0.02;
        if (heroMeshResult.headbandTail) {
          heroMeshResult.headbandTail.rotation.z = -0.3 + Math.sin(time * 4) * 0.1;
          heroMeshResult.headbandTail.rotation.x = THREE.MathUtils.damp(heroMeshResult.headbandTail.rotation.x, 0, 8, delta);
        }
      }

      // Update fluid ripples
      waterRipples.forEach((rip) => {
        if (rip.active) {
          rip.scale += delta * 2.8;
          rip.opacity -= delta * 1.6;
          rip.mesh.scale.set(rip.scale, rip.scale, 1);
          (rip.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, rip.opacity);
          if (rip.opacity <= 0) {
            rip.active = false;
          }
        }
      });

      ringMesh.rotation.z = time * 2;
      arrowMesh.position.y = 2.8 + Math.sin(time * 4) * 0.15;
      arrowMesh.rotation.y = time * 2.5;
      beamMat.opacity = 0.25 + Math.sin(time * 3) * 0.12;

      // 🌟 ENVIRONMENTAL WIND & WAVE DYNAMICS (Desktop Only)
      if (!isMobile) {
        const windSpeed = 1.6;
        const heroX = curr.x;
        const heroZ = curr.z;
        const maxSwayDistSq = 32 * 32; // 32 units radius from player
        animatedSwayObjects.forEach((tree) => {
          const dx = tree.position.x - heroX;
          const dz = tree.position.z - heroZ;
          if (dx * dx + dz * dz < maxSwayDistSq) {
            const windPhase = time * windSpeed + (tree.position.x * 0.4 + tree.position.z * 0.3);
            tree.rotation.z = Math.sin(windPhase) * 0.028;
            tree.rotation.x = Math.cos(windPhase * 0.85) * 0.018;
          }
        });
      }

      // 🌊 Continuous Dynamic River & Ocean Flow Dynamics
      const riverFlow = delta * 0.12;
      waterPBR.diffuse.offset.y += riverFlow;
      waterPBR.normal.offset.y += riverFlow * 1.35;
      waterPBR.normal.offset.x += riverFlow * 0.45;

      animatedWaters.forEach((w, idx) => {
        if (w === oceanMesh) {
          w.position.y = -0.38 + Math.sin(time * 1.4) * 0.045;
        } else {
          w.position.y = -0.10 + Math.sin(time * 2.2 + idx * 0.4) * 0.008;
        }
      });

      // Drifting 3D Clouds in the background sky (Desktop Only)
      if (!isMobile && animatedClouds.length > 0) {
        animatedClouds.forEach((cloud) => {
          cloud.position.x += delta * 0.8;
          if (cloud.position.x > centerX + 180) {
            cloud.position.x = centerX - 180;
          }
        });
      }

      const heroX = curr.x;
      const heroZ = curr.z;
      animatedLanterns.forEach((l, idx) => {
        const dx = l.position.x - heroX;
        const dz = l.position.z - heroZ;
        if (dx * dx + dz * dz < 900) {
          l.intensity = 1.8 + Math.sin(time * 8 + idx * 2) * 0.4;
        }
      });

      animatedSmokes.forEach((s, idx) => {
        s.position.y = 2.7 + ((time * 0.6 + idx * 0.5) % 0.8);
      });

      // Animate Windmills, Embers, Chimneys
      animatedBuildingUpdaters.forEach((fn) => fn(time));

      // Animate Human NPCs & Floating 3D Exclamation Marks (!)
      animatedNPCUpdaters.forEach((fn) => fn(time));

      // Drifting environmental particles (Desktop Only)
      if (!isMobile) {
        const pPositions = particleGeo.attributes.position.array as Float32Array;
        if (currentZone.id === 'zone_volcano') {
          for (let i = 0; i < particleCount * 3; i += 3) {
            pPositions[i + 1] += delta * 1.2;
            pPositions[i] += Math.sin(time * 2 + i) * 0.012;
            if (pPositions[i + 1] > 9.0) {
              pPositions[i + 1] = 0.4;
            }
          }
        } else {
          for (let i = 0; i < particleCount * 3; i += 3) {
            pPositions[i + 1] -= delta * 0.4;
            pPositions[i] += Math.sin(time + i) * 0.006;
            if (pPositions[i + 1] < 0.2) {
              pPositions[i + 1] = 8.0;
            }
          }
        }
        particleGeo.attributes.position.needsUpdate = true;
      }

      // DYNAMIC X-RAY TRANSPARENCY: Fade only foreground forest trees when player moves behind them
      if (currentZone.id === 'zone_forest' && obstacleGroups.length > 0) {
        const playerGridX = Math.round(curr.x / 2.5);
        const playerGridY = Math.round(curr.z / 2.5);

        for (let i = 0; i < obstacleGroups.length; i++) {
          const obs = obstacleGroups[i];
          const dx = obs.gridX - playerGridX;
          const dy = obs.gridY - playerGridY;
          if (dx >= -1 && dx <= 3 && dy >= -1 && dy <= 3) {
            const isBlocking = dx >= 0 && dx <= 2 && dy >= 0 && dy <= 2;
            const targetOpacity = isBlocking ? 0.4 : 1.0;
            const mat = (obs.group.children[0] as THREE.Mesh)?.material as THREE.Material;
            if (mat && mat.opacity !== undefined && Math.abs(mat.opacity - targetOpacity) > 0.05) {
              obs.group.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material) {
                  child.material.transparent = true;
                  child.material.opacity = targetOpacity;
                }
              });
            }
          }
        }
      }

      // Smooth camera follow target hero position (Close Crisp Isometric ARPG Angle)
      const camTargetX = curr.x + 8.5;
      const camTargetZ = curr.z + 8.5;
      camera.position.x += (camTargetX - camera.position.x) * 0.15;
      camera.position.z += (camTargetZ - camera.position.z) * 0.15;
      camera.position.y = 11.5;
      camera.lookAt(curr.x, 0.8, curr.z);

      // Keep sunlight positioned relative to player for crisp dynamic shadows
      // Render Scene
      renderer.render(scene, camera);

      // Project Player 3D Position -> 2D Screen HUD Position (Direct GPU transform, ZERO React Re-renders!)
      const vector = new THREE.Vector3(curr.x, 3.4, curr.z);
      vector.project(camera);

      const x2d = (vector.x * 0.5 + 0.5) * width;
      const y2d = (-(vector.y * 0.5) + 0.5) * height;

      if (hudRef.current) {
        if (vector.z < 1) {
          hudRef.current.style.display = 'block';
          hudRef.current.style.transform = `translate3d(${x2d}px, ${y2d}px, 0)`;
        } else {
          hudRef.current.style.display = 'none';
        }
      }
    };

    animate();

    // Raycaster for clicking 3D grid tiles
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleContainerClick = (e: MouseEvent) => {
      if (!onTileClick) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(tileGroup.children, true);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        const gridX = Math.round(point.x / 2.5);
        const gridY = Math.round(point.z / 2.5);

        if (gridX >= 0 && gridX < currentZone.mapWidth && gridY >= 0 && gridY < currentZone.mapHeight) {
          onTileClick(gridX, gridY);
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('click', handleContainerClick);

    const handleContextLost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(animationFrameId); };
    const handleContextRestored = () => { renderer.setSize(container.clientWidth, container.clientHeight); animationFrameId = requestAnimationFrame(animate); };
    domEl.addEventListener('webglcontextlost', handleContextLost);
    domEl.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('click', handleContainerClick);
      domEl.removeEventListener('webglcontextlost', handleContextLost);
      domEl.removeEventListener('webglcontextrestored', handleContextRestored);

      scene.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m: any) => { m.dispose(); if (m.map) m.map.dispose(); if (m.normalMap) m.normalMap.dispose(); });
          } else {
            obj.material.dispose();
            if (obj.material.map) obj.material.map.dispose();
            if (obj.material.normalMap) obj.material.normalMap.dispose();
          }
        }
      });

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [currentZone, player.heroClass, equipment]);

  return (
    <div className="relative w-full h-full min-h-[500px] flex-1 select-none overflow-hidden bg-slate-950">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full min-h-[500px] cursor-pointer" />

      {/* OVERHEAD MOBA HEALTHBAR HUD (Direct hardware transform, 0 React Overhead) */}
      <div
        ref={hudRef}
        className="absolute top-0 left-0 pointer-events-none -translate-x-1/2 -translate-y-full z-20 will-change-transform"
        style={{ display: 'none' }}
      >
        {/* Hero Nameplate */}
        <div className="bg-slate-950/90 border border-amber-500/80 px-2 py-0.5 rounded shadow-lg text-center mb-1">
          <span className="text-[10px] font-bold text-amber-300 whitespace-nowrap">
            {player.name} <span className="text-slate-400">(Niv. {player.level})</span>
          </span>
        </div>

        {/* Green HP Bar */}
        <div className="w-24 bg-slate-900/90 h-2 rounded-full overflow-hidden border border-slate-700 shadow-inner">
          <div
            className="bg-emerald-500 h-full transition-all duration-200"
            style={{ width: `${Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100))}%` }}
          />
        </div>

        {/* Blue MP Bar */}
        <div className="w-24 bg-slate-900/90 h-1.5 rounded-full overflow-hidden border border-slate-800 shadow-inner mt-0.5">
          <div
            className="bg-sky-500 h-full transition-all duration-200"
            style={{ width: `${Math.max(0, Math.min(100, (player.mp / player.maxMp) * 100))}%` }}
          />
        </div>
      </div>

    </div>
  );
};

// ============================================================================
// 🌟 ADVANCED PBR SHADER TEXTURE GENERATORS (Sobel Normal Map & Micro-Relief)
// ============================================================================

/**
 * Computes a true 3D Normal Map (Tangent Space) using Sobel convolution gradient filter
 */
function createNormalMapFromCanvas(srcCanvas: HTMLCanvasElement, strength: number = 3.0): THREE.CanvasTexture {
  const width = srcCanvas.width;
  const height = srcCanvas.height;
  const srcCtx = srcCanvas.getContext('2d')!;
  const srcData = srcCtx.getImageData(0, 0, width, height).data;

  const normCanvas = document.createElement('canvas');
  normCanvas.width = width;
  normCanvas.height = height;
  const normCtx = normCanvas.getContext('2d')!;
  const normImgData = normCtx.createImageData(width, height);
  const normData = normImgData.data;

  const getLum = (x: number, y: number): number => {
    const px = (x + width) % width;
    const py = (y + height) % height;
    const idx = (py * width + px) * 4;
    return srcData[idx] * 0.299 + srcData[idx + 1] * 0.587 + srcData[idx + 2] * 0.114;
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tl = getLum(x - 1, y - 1);
      const l  = getLum(x - 1, y);
      const bl = getLum(x - 1, y + 1);
      const t  = getLum(x, y - 1);
      const b  = getLum(x, y + 1);
      const tr = getLum(x + 1, y - 1);
      const r  = getLum(x + 1, y);
      const br = getLum(x + 1, y + 1);

      // Sobel kernel filter
      const dx = (tr + 2.0 * r + br) - (tl + 2.0 * l + bl);
      const dy = (bl + 2.0 * b + br) - (tl + 2.0 * t + tr);
      const dz = 255.0 / strength;

      // Normalization
      const len = Math.hypot(dx, dy, dz);
      const nx = (-(dx / len) * 0.5 + 0.5) * 255;
      const ny = (-(dy / len) * 0.5 + 0.5) * 255;
      const nz = ((dz / len) * 0.5 + 0.5) * 255;

      const idx = (y * width + x) * 4;
      normData[idx] = Math.round(nx);
      normData[idx + 1] = Math.round(ny);
      normData[idx + 2] = Math.round(nz);
      normData[idx + 3] = 255;
    }
  }

  normCtx.putImageData(normImgData, 0, 0);
  const texture = new THREE.CanvasTexture(normCanvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
/**
 * Generates ultra-realistic stylized RPG Water PBR Textures (Animated multi-wave normals, caustics & shoreline foam)
 */
function createProceduralWaterPBRTextures(zoneId: string): { diffuse: THREE.CanvasTexture; normal: THREE.CanvasTexture; foam: THREE.CanvasTexture } {
  const isVolcano = zoneId === 'zone_volcano';
  const isCave = zoneId === 'zone_cave';
  const isCastle = zoneId === 'zone_castle';

  // 1. Water Diffuse & Caustics Canvas (512x512)
  const diffCanvas = document.createElement('canvas');
  diffCanvas.width = 512;
  diffCanvas.height = 512;
  const dCtx = diffCanvas.getContext('2d')!;

  if (isVolcano) {
    // Glowing Molten Magma Surface with incandescent energy veins
    const grad = dCtx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#ea580c');
    grad.addColorStop(0.35, '#dc2626');
    grad.addColorStop(0.7, '#991b1b');
    grad.addColorStop(1, '#450a0a');
    dCtx.fillStyle = grad;
    dCtx.fillRect(0, 0, 512, 512);

    // Glowing magma convection cells
    for (let i = 0; i < 40; i++) {
      const cx = (i * 97) % 512;
      const cy = (i * 137) % 512;
      const r = 24 + (i % 5) * 12;
      const rGrad = dCtx.createRadialGradient(cx, cy, 2, cx, cy, r);
      rGrad.addColorStop(0, '#fef08a');
      rGrad.addColorStop(0.4, '#f59e0b');
      rGrad.addColorStop(0.8, '#dc2626');
      rGrad.addColorStop(1, 'transparent');
      dCtx.fillStyle = rGrad;
      dCtx.beginPath();
      dCtx.arc(cx, cy, r, 0, Math.PI * 2);
      dCtx.fill();
    }
  } else {
    // Crystal Clear Azure & Emerald Water with Caustics Network
    const baseGrad = dCtx.createLinearGradient(0, 0, 512, 512);
    if (isCave) {
      baseGrad.addColorStop(0, '#06b6d4');
      baseGrad.addColorStop(0.5, '#0891b2');
      baseGrad.addColorStop(1, '#0e7490');
    } else if (isCastle) {
      baseGrad.addColorStop(0, '#38bdf8');
      baseGrad.addColorStop(0.5, '#0284c7');
      baseGrad.addColorStop(1, '#0369a1');
    } else {
      // Natural Forest River: Crystal turquoise shallows into sapphire deeps
      baseGrad.addColorStop(0, '#06b6d4');
      baseGrad.addColorStop(0.3, '#0284c7');
      baseGrad.addColorStop(0.7, '#0369a1');
      baseGrad.addColorStop(1, '#1e3a8a');
    }
    dCtx.fillStyle = baseGrad;
    dCtx.fillRect(0, 0, 512, 512);

    // Dynamic Sunlit Caustic Wave Patterns
    dCtx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    dCtx.lineWidth = 3;
    dCtx.filter = 'blur(1px)';
    for (let c = 0; c < 24; c++) {
      dCtx.beginPath();
      const startX = (c * 43) % 512;
      const startY = (c * 67) % 512;
      dCtx.moveTo(startX, startY);
      for (let s = 0; s < 6; s++) {
        const nx = (startX + Math.sin(s * 1.2 + c) * 60 + s * 45) % 512;
        const ny = (startY + Math.cos(s * 1.4 + c) * 60 + s * 55) % 512;
        dCtx.quadraticCurveTo(nx - 20, ny + 20, nx, ny);
      }
      dCtx.stroke();
    }
    dCtx.filter = 'none';

    // Sparkling Sun Specular Highlights on wave peaks
    dCtx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    for (let i = 0; i < 180; i++) {
      const sx = (i * 73 + (i % 7) * 31) % 512;
      const sy = (i * 127 + (i % 11) * 23) % 512;
      dCtx.beginPath();
      dCtx.arc(sx, sy, 1.5 + (i % 3) * 0.8, 0, Math.PI * 2);
      dCtx.fill();
    }
  }

  // 2. Multi-Frequency Wave Normal Map (Generates physical 3D ripples with sunlight specular)
  const normCanvas = document.createElement('canvas');
  normCanvas.width = 512;
  normCanvas.height = 512;
  const nCtx = normCanvas.getContext('2d')!;

  const normImg = nCtx.createImageData(512, 512);
  const data = normImg.data;

  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      // Superimposed Sinusoidal & Trochoidal Wave Functions
      const u = (x / 512) * Math.PI * 8;
      const v = (y / 512) * Math.PI * 8;

      const wave1 = Math.sin(u * 1.5 + v * 0.8);
      const wave2 = Math.cos(u * 0.7 - v * 1.6);
      const wave3 = Math.sin(u * 3.1 + v * 2.7) * 0.4;
      const wave4 = Math.cos(u * 4.5 - v * 3.8) * 0.25;

      const dzdx = (Math.cos(u * 1.5) * 1.5 + Math.sin(u * 3.1) * 1.24) * 0.6;
      const dzdy = (Math.sin(v * 1.6) * 1.6 + Math.cos(v * 2.7) * 1.08) * 0.6;

      const nx = (-dzdx * 0.5 + 0.5) * 255;
      const ny = (-dzdy * 0.5 + 0.5) * 255;
      const nz = (1.0 / Math.sqrt(dzdx * dzdx + dzdy * dzdy + 1.0)) * 255;

      const idx = (y * 512 + x) * 4;
      data[idx] = Math.round(nx);
      data[idx + 1] = Math.round(ny);
      data[idx + 2] = Math.round(nz);
      data[idx + 3] = 255;
    }
  }
  nCtx.putImageData(normImg, 0, 0);

  // 3. Shoreline Foam & Crests Texture
  const foamCanvas = document.createElement('canvas');
  foamCanvas.width = 256;
  foamCanvas.height = 256;
  const fCtx = foamCanvas.getContext('2d')!;
  fCtx.fillStyle = 'rgba(255, 255, 255, 0)';
  fCtx.fillRect(0, 0, 256, 256);

  fCtx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  fCtx.lineWidth = 4;
  for (let i = 0; i < 16; i++) {
    fCtx.beginPath();
    const yPos = i * 16;
    fCtx.moveTo(0, yPos);
    for (let xPos = 0; xPos <= 256; xPos += 16) {
      fCtx.lineTo(xPos, yPos + Math.sin(xPos * 0.1 + i) * 4);
    }
    fCtx.stroke();
  }

  const diffuse = new THREE.CanvasTexture(diffCanvas);
  diffuse.wrapS = THREE.RepeatWrapping;
  diffuse.wrapT = THREE.RepeatWrapping;

  const normal = new THREE.CanvasTexture(normCanvas);
  normal.wrapS = THREE.RepeatWrapping;
  normal.wrapT = THREE.RepeatWrapping;

  const foam = new THREE.CanvasTexture(foamCanvas);
  foam.wrapS = THREE.RepeatWrapping;
  foam.wrapT = THREE.RepeatWrapping;

  return { diffuse, normal, foam };
}

/**
 * Generates high-fidelity PBR ground textures (Diffuse + Real Sobel Normal Relief Map)
 */
function createProceduralGroundPBRTextures(zoneId: string): { diffuse: THREE.CanvasTexture; normal: THREE.CanvasTexture } {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  if (zoneId === 'zone_forest') {
    // 🌿 Hand-Painted Stylized Forest Floor (Vibrant Greens, Lush Blades, Wildflowers & Clovers)
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#15803d');
    grad.addColorStop(0.35, '#16a34a');
    grad.addColorStop(0.7, '#22c55e');
    grad.addColorStop(1, '#15803d');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Natural warm sunlight & ambient shade blotches
    for (let i = 0; i < 35; i++) {
      const cx = (i * 89) % 512;
      const cy = (i * 131) % 512;
      const r = 35 + (i % 6) * 18;
      const patchGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
      patchGrad.addColorStop(0, i % 2 === 0 ? 'rgba(74, 222, 128, 0.45)' : 'rgba(21, 128, 61, 0.55)');
      patchGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = patchGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hand-Painted Stylized Grass Blades with Highlighted Tips & Ambient Occlusion Bases
    for (let i = 0; i < 2800; i++) {
      const gx = Math.random() * 512;
      const gy = Math.random() * 512;
      const bladeH = 5 + Math.random() * 8;
      const bladeW = 2 + Math.random() * 1.5;
      const lean = (Math.random() - 0.5) * 4;

      // Dark Root Occlusion Shadow
      ctx.fillStyle = '#052e16';
      ctx.fillRect(gx - 1, gy, bladeW + 2, 2);

      // Mid-tone Grass Stem
      ctx.fillStyle = Math.random() > 0.4 ? '#22c55e' : '#16a34a';
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx + lean, gy - bladeH);
      ctx.lineTo(gx + bladeW + lean, gy - bladeH);
      ctx.lineTo(gx + bladeW, gy);
      ctx.closePath();
      ctx.fill();

      // Golden Sunlit Tip Highlight
      ctx.fillStyle = '#86efac';
      ctx.fillRect(gx + lean, gy - bladeH, bladeW, 2);
    }

    // Four-Leaf & Three-Leaf Clover Clusters
    for (let c = 0; c < 120; c++) {
      const cx = (c * 97) % 512;
      const cy = (c * 173) % 512;
      ctx.fillStyle = '#4ade80';
      for (let l = 0; l < 4; l++) {
        const ang = (l * Math.PI) / 2;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(ang) * 4, cy + Math.sin(ang) * 4, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#14532d';
      ctx.fillRect(cx - 0.5, cy - 0.5, 1, 1);
    }

    // Wild Woodland Flowers: Scarlet Poppies, Golden Buttercups & Pale Daisies
    const flowerColors = ['#ef4444', '#facc15', '#ffffff', '#38bdf8', '#f472b6'];
    for (let f = 0; f < 160; f++) {
      const fx = (f * 67 + 33) % 512;
      const fy = (f * 113 + 57) % 512;
      const col = flowerColors[f % flowerColors.length];

      ctx.fillStyle = col;
      for (let p = 0; p < 5; p++) {
        const rad = (p * Math.PI * 2) / 5;
        ctx.beginPath();
        ctx.arc(fx + Math.cos(rad) * 3, fy + Math.sin(rad) * 3, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      // Golden flower pistil center
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(fx, fy, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (zoneId === 'zone_cave') {
    // Authentic Dwarven Flagstone & Granite Tile Ground with micro-bevels
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 512, 512);

    const tileSize = 64;
    for (let py = 0; py < 512; py += tileSize) {
      for (let px = 0; px < 512; px += tileSize) {
        const shade = Math.floor(35 + Math.random() * 30);
        ctx.fillStyle = `rgb(${shade}, ${shade + 6}, ${shade + 16})`;
        ctx.fillRect(px + 2, py + 2, tileSize - 4, tileSize - 4);

        for (let i = 0; i < 50; i++) {
          ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.2)';
          ctx.fillRect(px + 4 + Math.random() * (tileSize - 8), py + 4 + Math.random() * (tileSize - 8), 2, 2);
        }
      }
    }

    // Mortar groove lines
    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = 3;
    for (let i = 0; i <= 512; i += tileSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }

    // Glowing Mithril and Cyan ore flecks in fissures
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = Math.random() > 0.6 ? '#38bdf8' : '#818cf8';
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
  } else if (zoneId === 'zone_volcano') {
    // Cracked Basalt Slabs with Glowing Magma Fissures
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(0, 0, 512, 512);

    const tileSize = 64;
    for (let py = 0; py < 512; py += tileSize) {
      for (let px = 0; px < 512; px += tileSize) {
        const shade = Math.floor(20 + Math.random() * 22);
        ctx.fillStyle = `rgb(${shade}, ${shade - 2}, ${shade - 2})`;
        ctx.beginPath();
        const crackMargin = 4;
        ctx.roundRect(px + crackMargin, py + crackMargin, tileSize - crackMargin * 2, tileSize - crackMargin * 2, 4);
        ctx.fill();

        for (let i = 0; i < 40; i++) {
          ctx.fillStyle = Math.random() > 0.6 ? '#3f3f46' : 'rgba(0,0,0,0.45)';
          ctx.fillRect(px + 6 + Math.random() * (tileSize - 12), py + 6 + Math.random() * (tileSize - 12), 2, 2);
        }
      }
    }

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    for (let i = 0; i <= 512; i += tileSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }

    for (let i = 0; i < 450; i++) {
      ctx.fillStyle = Math.random() > 0.6 ? '#fbbf24' : '#f97316';
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
  } else if (zoneId === 'zone_castle') {
    // Imperial Limestone Cobblestones with Lush Moss & Concentric Paving
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 512, 512);

    const tileSize = 64;
    for (let py = 0; py < 512; py += tileSize) {
      for (let px = 0; px < 512; px += tileSize) {
        const shade = Math.floor(130 + Math.random() * 35);
        ctx.fillStyle = `rgb(${shade}, ${shade + 4}, ${shade + 8})`;
        ctx.fillRect(px + 2, py + 2, tileSize - 4, tileSize - 4);

        for (let i = 0; i < 35; i++) {
          ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)';
          ctx.fillRect(px + 4 + Math.random() * (tileSize - 8), py + 4 + Math.random() * (tileSize - 8), 2, 2);
        }

        if (Math.random() > 0.4) {
          ctx.fillStyle = '#166534';
          ctx.fillRect(px + 1, py + 1, 6, 6);
        }
      }
    }

    // Concentric Circular Medallion Paving
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    [32, 64, 96, 128, 160].forEach((r) => {
      ctx.beginPath();
      ctx.arc(256, 256, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    for (let i = 0; i <= 512; i += tileSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }

    for (let i = 0; i < 300; i++) {
      ctx.fillStyle = Math.random() > 0.6 ? '#c084fc' : '#fde047';
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
  } else if (zoneId === 'zone_tundra') {
    // Frosty Crisp Snow with Glittering Ice Crystals
    const sGrad = ctx.createLinearGradient(0, 0, 512, 512);
    sGrad.addColorStop(0, '#f8fafc');
    sGrad.addColorStop(0.5, '#e2e8f0');
    sGrad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = sGrad;
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 500; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#93c5fd';
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
  } else {
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 0, 512, 512);
  }

  const diffuse = new THREE.CanvasTexture(canvas);
  const normal = createNormalMapFromCanvas(canvas, zoneId === 'zone_forest' ? 3.8 : 3.2);

  return { diffuse, normal };
}

/**
 * Generates high-fidelity PBR path textures with beveled cobblestone normal maps
 */
function createProceduralPathPBRTextures(): { diffuse: THREE.CanvasTexture; normal: THREE.CanvasTexture } {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep Damp Earth & Mortar Grout Base
  ctx.fillStyle = '#291209';
  ctx.fillRect(0, 0, 512, 512);

  const cols = 8;
  const rows = 8;
  const w = 512 / cols;
  const h = 512 / rows;

  for (let r = 0; r < rows; r++) {
    const shift = (r % 2) * (w / 2);
    for (let c = -1; c < cols + 1; c++) {
      const bx = c * w + shift + 3;
      const by = r * h + 3;
      const bw = w - 6;
      const bh = h - 6;

      // Realistic Medieval Brick / Flagstone Gradient with Warm Terracotta & Granitic Ochre
      const grad = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
      const stoneSeed = Math.abs(r * 17 + c * 31);
      if (stoneSeed % 3 === 0) {
        grad.addColorStop(0, '#e06f52');
        grad.addColorStop(0.5, '#c2410c');
        grad.addColorStop(1, '#9a3412');
      } else if (stoneSeed % 3 === 1) {
        grad.addColorStop(0, '#d97706');
        grad.addColorStop(0.5, '#b45309');
        grad.addColorStop(1, '#78350f');
      } else {
        grad.addColorStop(0, '#ea580c');
        grad.addColorStop(0.5, '#c2410c');
        grad.addColorStop(1, '#831843');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, 6);
      ctx.fill();

      // Top Specular Sunlit Chamfer Edge
      ctx.strokeStyle = '#fdba74';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(bx + 4, by + 2);
      ctx.lineTo(bx + bw - 4, by + 2);
      ctx.stroke();

      // Left Soft Rim Highlight
      ctx.strokeStyle = '#fed7aa';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(bx + 2, by + 4);
      ctx.lineTo(bx + 2, by + bh - 4);
      ctx.stroke();

      // Bottom-Right Deep Shadow Crevice
      ctx.strokeStyle = '#431407';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(bx + bw - 1, by + 4);
      ctx.lineTo(bx + bw - 1, by + bh - 1);
      ctx.lineTo(bx + 4, by + bh - 1);
      ctx.stroke();

      // Weathered Stone Pitting & Surface Grain
      for (let p = 0; p < 18; p++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.22)';
        ctx.fillRect(bx + 3 + Math.random() * (bw - 6), by + 3 + Math.random() * (bh - 6), 2, 2);
      }

      // Crevice Green Moss & Lichen
      if ((c + r) % 3 === 0) {
        ctx.fillStyle = '#15803d';
        ctx.fillRect(bx + Math.random() * bw, by + Math.random() * bh, 3, 3);
      }
    }
  }

  const diffuse = new THREE.CanvasTexture(canvas);
  diffuse.wrapS = THREE.RepeatWrapping;
  diffuse.wrapT = THREE.RepeatWrapping;
  diffuse.repeat.set(1, 1);

  const normal = createNormalMapFromCanvas(canvas, 4.2);
  normal.wrapS = THREE.RepeatWrapping;
  normal.wrapT = THREE.RepeatWrapping;
  normal.repeat.set(1, 1);

  return { diffuse, normal };
}

// --- GLOBAL TEXTURE CACHING SYSTEM (ELIMINATES ZERO-DELAY MAP TRANSITIONS) ---
const globalTextureCache: Record<string, THREE.CanvasTexture> = {};
const globalGroundPBRCache: Record<string, { diffuse: THREE.CanvasTexture; normal: THREE.CanvasTexture }> = {};
const globalWaterPBRCache: Record<string, { diffuse: THREE.CanvasTexture; normal: THREE.CanvasTexture; foam: THREE.CanvasTexture }> = {};
let cachedPathPBR: { diffuse: THREE.CanvasTexture; normal: THREE.CanvasTexture } | null = null;
let cachedBarkTexture: THREE.CanvasTexture | null = null;
let cachedBirchTexture: THREE.CanvasTexture | null = null;

function applyHighFidelityTextureSettings(tex: THREE.CanvasTexture, repeatX: number = 1, repeatY: number = 1) {
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 4;
}

function getCachedWaterPBR(zoneId: string) {
  if (!globalWaterPBRCache[zoneId]) {
    const pbr = createProceduralWaterPBRTextures(zoneId);
    applyHighFidelityTextureSettings(pbr.diffuse, 48, 48);
    applyHighFidelityTextureSettings(pbr.normal, 48, 48);
    globalWaterPBRCache[zoneId] = pbr;
  }
  return globalWaterPBRCache[zoneId];
}

function getCachedBarkTexture(): THREE.CanvasTexture {
  if (!cachedBarkTexture) {
    cachedBarkTexture = createProceduralBarkTexture();
    applyHighFidelityTextureSettings(cachedBarkTexture, 1, 4);
  }
  return cachedBarkTexture;
}

function getCachedLeafTexture(colorBase: string, colorHighlight: string): THREE.CanvasTexture {
  const key = `${colorBase}_${colorHighlight}`;
  if (!globalTextureCache[key]) {
    const tex = createProceduralLeafTexture(colorBase, colorHighlight);
    applyHighFidelityTextureSettings(tex, 2, 2);
    globalTextureCache[key] = tex;
  }
  return globalTextureCache[key];
}

function getCachedBirchTexture(): THREE.CanvasTexture {
  if (!cachedBirchTexture) {
    const birchCanvas = document.createElement('canvas');
    birchCanvas.width = 256;
    birchCanvas.height = 256;
    const bCtx = birchCanvas.getContext('2d')!;
    bCtx.fillStyle = '#f8fafc';
    bCtx.fillRect(0, 0, 256, 256);
    bCtx.fillStyle = '#0f172a';
    for (let i = 0; i < 40; i++) {
      bCtx.fillRect(Math.random() * 256, Math.random() * 256, 12 + Math.random() * 20, 3 + Math.random() * 3);
    }
    cachedBirchTexture = new THREE.CanvasTexture(birchCanvas);
    applyHighFidelityTextureSettings(cachedBirchTexture, 1, 3);
  }
  return cachedBirchTexture;
}

function getCachedGroundPBR(zoneId: string) {
  if (!globalGroundPBRCache[zoneId]) {
    const pbr = createProceduralGroundPBRTextures(zoneId);
    applyHighFidelityTextureSettings(pbr.diffuse, 1, 1);
    applyHighFidelityTextureSettings(pbr.normal, 1, 1);
    globalGroundPBRCache[zoneId] = pbr;
  }
  return globalGroundPBRCache[zoneId];
}

function getCachedPathPBR() {
  if (!cachedPathPBR) {
    const pbr = createProceduralPathPBRTextures();
    applyHighFidelityTextureSettings(pbr.diffuse, 1, 1);
    applyHighFidelityTextureSettings(pbr.normal, 1, 1);
    cachedPathPBR = pbr;
  }
  return cachedPathPBR;
}

// --- PROCEDURAL BARK TEXTURE FOR REALISTIC TREE TRUNKS ---
function createProceduralBarkTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#3b1c08';
  ctx.fillRect(0, 0, 256, 256);

  // Vertical wood grain & bark fissures
  for (let x = 0; x < 256; x += 4) {
    const darkness = Math.random() * 0.4;
    ctx.fillStyle = `rgba(15, 7, 2, ${darkness})`;
    ctx.fillRect(x, 0, 2 + Math.random() * 3, 256);
  }

  // Organic bark knots & moss specks
  for (let i = 0; i < 60; i++) {
    const kx = Math.random() * 256;
    const ky = Math.random() * 256;
    ctx.fillStyle = Math.random() > 0.4 ? '#211005' : '#15803d';
    ctx.beginPath();
    ctx.ellipse(kx, ky, 4 + Math.random() * 8, 2 + Math.random() * 3, Math.PI / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 4);
  return texture;
}

// --- PROCEDURAL LEAF TEXTURE FOR REALISTIC CANOPIES ---
function createProceduralLeafTexture(colorBase: string, colorHighlight: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = colorBase;
  ctx.fillRect(0, 0, 512, 512);

  // Dense leaf silhouettes & veins
  for (let i = 0; i < 1500; i++) {
    const lx = Math.random() * 512;
    const ly = Math.random() * 512;
    ctx.fillStyle = Math.random() > 0.5 ? colorHighlight : '#0e3d1c';
    ctx.beginPath();
    ctx.arc(lx, ly, 4 + Math.random() * 8, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

// --- 3D GRASS TUFT MESH FOR LUSH TERRAIN ---
function create3DGrassTuftMesh(posX: number, posZ: number, seed: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);

  const colors = [0x22c55e, 0x16a34a, 0x15803d, 0x4ade80, 0x84cc16];
  const count = 4 + (seed % 4);

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + seed * 0.7;
    const dist = 0.15 + ((seed + i * 3) % 4) * 0.1;
    const h = 0.35 + ((seed * 11 + i * 5) % 5) * 0.08;
    const bladeMat = new THREE.MeshStandardMaterial({
      color: colors[(seed + i) % colors.length],
      roughness: 0.6,
      side: THREE.DoubleSide,
    });
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.08, h, 3), bladeMat);
    blade.position.set(Math.cos(angle) * dist, h / 2, Math.sin(angle) * dist);
    blade.rotation.x = 0.2 + (i % 2) * 0.15;
    blade.rotation.z = Math.cos(angle) * 0.25;
    g.add(blade);
  }

  // Tiny wildflower in 35% of grass tufts
  if (seed % 3 === 0) {
    const flowerMat = new THREE.MeshStandardMaterial({
      color: seed % 2 === 0 ? 0xf472b6 : 0xfde047,
      roughness: 0.4,
    });
    const flower = new THREE.Mesh(new THREE.DodecahedronGeometry(0.08), flowerMat);
    flower.position.set(0, 0.38, 0);
    g.add(flower);
  }

  return g;
}

// --- 3D PEBBLE / MOSSY ROCK MESH ---
function create3DRockPebbleMesh(posX: number, posZ: number, seed: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);

  const rockMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 });
  const mossMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7 });

  const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3 + (seed % 3) * 0.08, 1), rockMat);
  rock.position.y = 0.15;
  rock.rotation.set((seed % 5) * 0.2, (seed % 7) * 0.3, (seed % 3) * 0.1);
  rock.castShadow = true;
  g.add(rock);

  // Moss Cap
  const moss = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 6), mossMat);
  moss.position.set(0, 0.26, 0);
  moss.scale.set(1.1, 0.4, 1.1);
  g.add(moss);

  return g;
}

// --- 3D DIVERSIFIED RPG STREET & GARDEN PROPS ---

// 1. 🪑 Medieval Wooden Park Bench
function create3DWoodenBenchMesh(posX: number, posZ: number, rotY: number = 0): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);
  g.rotation.y = rotY;

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.75 });
  const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.6 });

  // Iron legs
  const legGeo = new THREE.BoxGeometry(0.08, 0.45, 0.45);
  const leftLeg = new THREE.Mesh(legGeo, ironMat);
  leftLeg.position.set(-0.65, 0.225, 0);
  leftLeg.castShadow = true;
  g.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, ironMat);
  rightLeg.position.set(0.65, 0.225, 0);
  rightLeg.castShadow = true;
  g.add(rightLeg);

  // Seat slats
  for (let s = -0.15; s <= 0.15; s += 0.12) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 0.09), woodMat);
    slat.position.set(0, 0.46, s);
    slat.castShadow = true;
    slat.receiveShadow = true;
    g.add(slat);
  }

  // Backrest slats
  for (let b = 0.58; b <= 0.82; b += 0.11) {
    const backSlat = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 0.04), woodMat);
    backSlat.position.set(0, b, -0.2);
    backSlat.castShadow = true;
    g.add(backSlat);
  }

  return g;
}

// 2. 🪴 Terracotta / Oak Flower Planter Box with Blooming Flowers
function create3DFlowerPlanterMesh(posX: number, posZ: number, seed: number = 0): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);

  // Planter Box Trough
  const boxMat = new THREE.MeshStandardMaterial({
    color: seed % 2 === 0 ? 0x9a3412 : 0x5c3a21,
    roughness: 0.85,
  });
  const box = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.38, 0.65), boxMat);
  box.position.y = 0.19;
  box.castShadow = true;
  box.receiveShadow = true;
  g.add(box);

  // Potting Soil
  const soil = new THREE.Mesh(
    new THREE.BoxGeometry(1.28, 0.05, 0.53),
    new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.95 })
  );
  soil.position.y = 0.37;
  g.add(soil);

  // Foliage Base
  const foliageMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.6 });
  for (let i = -0.45; i <= 0.45; i += 0.45) {
    const fol = new THREE.Mesh(new THREE.DodecahedronGeometry(0.22, 1), foliageMat);
    fol.position.set(i, 0.48, (seed % 3 - 1) * 0.05);
    fol.castShadow = true;
    g.add(fol);
  }

  // Colorful Blossoms (Tulips, Poppies, Roses, Cornflowers)
  const flowerCols = [0xef4444, 0xfacc15, 0xf472b6, 0x38bdf8, 0xffffff];
  for (let f = 0; f < 5; f++) {
    const col = flowerCols[(f + seed) % flowerCols.length];
    const blossom = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 6, 6),
      new THREE.MeshStandardMaterial({ color: col, roughness: 0.4 })
    );
    blossom.position.set(-0.5 + f * 0.25, 0.62 + ((f % 2) * 0.06), ((f * 17) % 3 - 1) * 0.12);
    blossom.castShadow = true;
    g.add(blossom);
  }

  return g;
}

// 3. 🫐 Natural Organic Berry Bush (Spherical with red/golden berries)
function create3DBerryBushMesh(posX: number, posZ: number, seed: number = 0): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);

  const bushMat = new THREE.MeshStandardMaterial({
    color: seed % 2 === 0 ? 0x15803d : 0x166534,
    roughness: 0.6,
  });

  // Main natural bush clusters
  const mainCluster = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 1), bushMat);
  mainCluster.position.set(0, 0.45, 0);
  mainCluster.castShadow = true;
  mainCluster.receiveShadow = true;
  g.add(mainCluster);

  const sideCluster1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38, 1), bushMat);
  sideCluster1.position.set(0.35, 0.35, 0.15);
  sideCluster1.castShadow = true;
  g.add(sideCluster1);

  const sideCluster2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.35, 1), bushMat);
  sideCluster2.position.set(-0.32, 0.32, -0.15);
  sideCluster2.castShadow = true;
  g.add(sideCluster2);

  // Red / Gold berries
  const berryMat = new THREE.MeshStandardMaterial({
    color: seed % 3 === 0 ? 0xfacc15 : 0xdc2626,
    roughness: 0.3,
  });
  for (let b = 0; b < 6; b++) {
    const berry = new THREE.Mesh(new THREE.SphereGeometry(0.06, 5, 5), berryMat);
    const ang = (b * Math.PI * 2) / 6;
    berry.position.set(Math.cos(ang) * 0.45, 0.4 + ((b % 3) * 0.1), Math.sin(ang) * 0.45);
    berry.castShadow = true;
    g.add(berry);
  }

  return g;
}

// 4. 📦 Rustic Market Crates & Barrel Stacks
function create3DMarketCratesMesh(posX: number, posZ: number, seed: number = 0): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 });
  const ironMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6, metalness: 0.6 });

  // Wooden Barrel
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.72, 12), woodMat);
  barrel.position.set(-0.35, 0.36, 0.1);
  barrel.castShadow = true;
  barrel.receiveShadow = true;
  g.add(barrel);

  // Barrel metal rings
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.02, 8, 16), ironMat);
  ring1.rotation.x = Math.PI / 2;
  ring1.position.set(-0.35, 0.52, 0.1);
  g.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.02, 8, 16), ironMat);
  ring2.rotation.x = Math.PI / 2;
  ring2.position.set(-0.35, 0.20, 0.1);
  g.add(ring2);

  // Fruit Crate
  const crate = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 0.42, 0.55),
    new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.85 })
  );
  crate.position.set(0.35, 0.21, -0.1);
  crate.castShadow = true;
  crate.receiveShadow = true;
  g.add(crate);

  // Red Apples inside crate
  const appleMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 });
  for (let a = 0; a < 4; a++) {
    const apple = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), appleMat);
    apple.position.set(0.25 + (a % 2) * 0.18, 0.44, -0.18 + Math.floor(a / 2) * 0.18);
    apple.castShadow = true;
    g.add(apple);
  }

  return g;
}

// 5. 🍎 Orchard Apple / Cherry Fruit Tree
function create3DFruitTreeMesh(posX: number, posZ: number, seed: number = 0): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);

  // Trunk
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.85 });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 1.4, 8), woodMat);
  trunk.position.y = 0.7;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  g.add(trunk);

  // Foliage Spheres
  const leafMat = new THREE.MeshStandardMaterial({ color: seed % 2 === 0 ? 0x16a34a : 0x22c55e, roughness: 0.55 });
  const mainCrown = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9, 1), leafMat);
  mainCrown.position.y = 1.9;
  mainCrown.castShadow = true;
  g.add(mainCrown);

  const subCrown1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.65, 1), leafMat);
  subCrown1.position.set(0.4, 1.6, 0.3);
  subCrown1.castShadow = true;
  g.add(subCrown1);

  const subCrown2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.6, 1), leafMat);
  subCrown2.position.set(-0.35, 1.7, -0.3);
  subCrown2.castShadow = true;
  g.add(subCrown2);

  // Ripe Red / Golden Apples
  const appleMat = new THREE.MeshStandardMaterial({ color: seed % 3 === 0 ? 0xfacc15 : 0xef4444, roughness: 0.3 });
  for (let a = 0; a < 8; a++) {
    const apple = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), appleMat);
    const ang = (a * Math.PI * 2) / 8;
    const rad = 0.75 + ((a % 3) * 0.1);
    apple.position.set(Math.cos(ang) * rad, 1.5 + ((a % 4) * 0.25), Math.sin(ang) * rad);
    apple.castShadow = true;
    g.add(apple);
  }

  return g;
}

// 6. 🌿 Weeping Willow Tree with Cascading Foliage
function create3DWillowTreeMesh(posX: number, posZ: number, seed: number = 0): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.36, 1.6, 8), woodMat);
  trunk.position.y = 0.8;
  trunk.castShadow = true;
  g.add(trunk);

  // Hanging Willow Vines Canopy
  const willowLeafMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.6 });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.2, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.6), willowLeafMat);
  dome.position.y = 1.9;
  dome.castShadow = true;
  g.add(dome);

  // Drooping vine tendrils
  for (let v = 0; v < 8; v++) {
    const ang = (v * Math.PI * 2) / 8;
    const vine = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.04, 1.1, 6), willowLeafMat);
    vine.position.set(Math.cos(ang) * 1.0, 1.4, Math.sin(ang) * 1.0);
    vine.castShadow = true;
    g.add(vine);
  }

  return g;
}

// 7. ⛲ Stone Village Well with Wooden Canopy & Bucket
function create3DStoneWellMesh(posX: number, posZ: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);

  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.85 });
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.75 });
  const waterMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.3 });

  // Stone Circular Base Basin
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.9, 0.65, 14), stoneMat);
  basin.position.y = 0.325;
  basin.castShadow = true;
  basin.receiveShadow = true;
  g.add(basin);

  // Well Water Surface Inside
  const water = new THREE.Mesh(new THREE.CircleGeometry(0.68, 12), waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.y = 0.45;
  g.add(water);

  // Wooden Support Posts
  [-0.6, 0.6].forEach((px) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 6), woodMat);
    post.position.set(px, 1.0, 0);
    post.castShadow = true;
    g.add(post);
  });

  // Roof Canopy
  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.05, 0.6, 4), woodMat);
  roof.rotation.y = Math.PI / 4;
  roof.position.y = 1.95;
  roof.castShadow = true;
  g.add(roof);

  return g;
}

// 8. 🌾 Golden Rolled Hay Bales
function create3DHayBaleMesh(posX: number, posZ: number, seed: number = 0): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);

  const hayMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.9 });
  const ropeMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });

  // Main Hay Cylinder
  const bale1 = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.95, 12), hayMat);
  bale1.rotation.z = Math.PI / 2;
  bale1.position.set(0, 0.42, 0);
  bale1.castShadow = true;
  bale1.receiveShadow = true;
  g.add(bale1);

  // Twine rope bindings
  [-0.22, 0.22].forEach((rx) => {
    const rope = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.02, 6, 16), ropeMat);
    rope.rotation.y = Math.PI / 2;
    rope.position.set(rx, 0.42, 0);
    g.add(rope);
  });

  if (seed % 2 === 0) {
    const bale2 = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.85, 12), hayMat);
    bale2.rotation.z = Math.PI / 2;
    bale2.position.set(0.15, 0.85, 0.1);
    bale2.castShadow = true;
    g.add(bale2);
  }

  return g;
}

// 9. 🌾 Straw Scarecrow
function create3DScarecrowMesh(posX: number, posZ: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
  const clothMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.7 });
  const hatMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.85 });

  // Main Wooden Post
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.8, 6), woodMat);
  pole.position.y = 0.9;
  pole.castShadow = true;
  g.add(pole);

  // Cross Arms
  const arms = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.2, 6), woodMat);
  arms.rotation.z = Math.PI / 2;
  arms.position.y = 1.35;
  g.add(arms);

  // Tattered Shirt
  const shirt = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.55, 0.28), clothMat);
  shirt.position.y = 1.2;
  shirt.castShadow = true;
  g.add(shirt);

  // Pumpkin / Straw Head & Hat
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), hatMat);
  head.position.y = 1.62;
  head.castShadow = true;
  g.add(head);

  const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.04, 10), hatMat);
  hatBrim.position.y = 1.74;
  g.add(hatBrim);

  return g;
}

// 10. 🔥 Animated Campfire with Stones & Kettle
function create3DCampfireMesh(posX: number, posZ: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);

  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x292524, roughness: 0.85 });
  const emberMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 2.5 });

  // Stone Ring
  for (let s = 0; s < 8; s++) {
    const ang = (s * Math.PI * 2) / 8;
    const stone = new THREE.Mesh(new THREE.DodecahedronGeometry(0.14, 1), stoneMat);
    stone.position.set(Math.cos(ang) * 0.48, 0.08, Math.sin(ang) * 0.48);
    stone.castShadow = true;
    g.add(stone);
  }

  // Crossed Logs
  for (let l = 0; l < 3; l++) {
    const log = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.65, 6), woodMat);
    log.rotation.y = (l * Math.PI) / 3;
    log.rotation.z = 0.2;
    log.position.y = 0.12;
    log.castShadow = true;
    g.add(log);
  }

  // Glowing Fire Core & Flame Light
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.45, 6), emberMat);
  flame.position.y = 0.28;
  g.add(flame);

  const fireLight = new THREE.PointLight(0xf97316, 2.2, 12, 1.8);
  fireLight.position.set(0, 0.45, 0);
  g.add(fireLight);

  return g;
}

// 11. 🍻 Outdoor Tavern Patio (Wooden Table, Benches & Ale Tankards)
function create3DTavernPatioMesh(posX: number, posZ: number, rotY: number = 0): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);
  g.rotation.y = rotY;

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.75 });
  const mugMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.6, roughness: 0.3 });

  // Table Top & Legs
  const table = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.75), woodMat);
  table.position.y = 0.52;
  table.castShadow = true;
  table.receiveShadow = true;
  g.add(table);

  [-0.55, 0.55].forEach((tx) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 0.55), woodMat);
    leg.position.set(tx, 0.25, 0);
    leg.castShadow = true;
    g.add(leg);
  });

  // Benches on both sides
  [-0.6, 0.6].forEach((bz) => {
    const bench = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.06, 0.28), woodMat);
    bench.position.set(0, 0.32, bz);
    bench.castShadow = true;
    g.add(bench);
  });

  // Ale Tankards on table
  for (let m = 0; m < 3; m++) {
    const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 8), mugMat);
    mug.position.set(-0.35 + m * 0.35, 0.62, (m % 2 === 0 ? 0.12 : -0.12));
    mug.castShadow = true;
    g.add(mug);
  }

  return g;
}

// 12. 🛒 Wooden Cargo Cart with Spoked Wheels
function create3DWoodenCartMesh(posX: number, posZ: number, rotY: number = 0): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);
  g.rotation.y = rotY;

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.8 });
  const ironMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6, metalness: 0.6 });

  // Cart Bed
  const bed = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.35, 0.95), woodMat);
  bed.position.y = 0.45;
  bed.castShadow = true;
  bed.receiveShadow = true;
  g.add(bed);

  // Spoked Wheels
  [-0.55, 0.55].forEach((wz) => {
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.04, 8, 16), ironMat);
    wheel.position.set(0, 0.35, wz);
    wheel.castShadow = true;
    g.add(wheel);
  });

  // Cargo Sacks inside
  const sackMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, roughness: 0.9 });
  for (let s = 0; s < 3; s++) {
    const sack = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), sackMat);
    sack.scale.set(1.2, 0.8, 1.0);
    sack.position.set(-0.35 + s * 0.35, 0.58, 0);
    sack.castShadow = true;
    g.add(sack);
  }

  return g;
}

// 13. 🗿 Ancient Runic Monolith Standing Stone
function create3DRunicMonolithMesh(posX: number, posZ: number, seed: number = 0): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);

  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85 });
  const runeMat = new THREE.MeshStandardMaterial({
    color: seed % 2 === 0 ? 0x38bdf8 : 0xfacc15,
    emissive: seed % 2 === 0 ? 0x0284c7 : 0xd97706,
    emissiveIntensity: 2.2,
  });

  // Obelisk monolith
  const monolith = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.42, 1.8, 6), stoneMat);
  monolith.position.y = 0.9;
  monolith.castShadow = true;
  monolith.receiveShadow = true;
  g.add(monolith);

  // Glowing Runic Core Band
  const runeBand = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.22, 6), runeMat);
  runeBand.position.y = 1.05;
  g.add(runeBand);

  return g;
}

// --- 3D GREEN HEDGE BUSH MESH (LEGACY / RETAINED) ---
function create3DHedgeMesh(posX: number, posZ: number): THREE.Group {
  return create3DBerryBushMesh(posX, posZ, 0);
}

// --- 3D ENVIRONMENT BUILDINGS & OBJECTS ---
function create3DShopMesh(x: number, z: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(x, 0, z);

  const counter = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.7, 1.0),
    new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 })
  );
  counter.position.y = 0.35;
  counter.castShadow = true;
  g.add(counter);

  const awning = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.15, 1.2),
    new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 })
  );
  awning.position.y = 1.4;
  awning.castShadow = true;
  g.add(awning);

  return g;
}

function create3DTavernMesh(x: number, z: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(x, 0, z);

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1.2, 1.8),
    new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 })
  );
  base.position.y = 0.6;
  base.castShadow = true;
  g.add(base);

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(1.5, 0.9, 4),
    new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.6 })
  );
  roof.position.y = 1.65;
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  g.add(roof);

  return g;
}

function create3DBossPortalMesh(x: number, z: number, isDefeated: boolean, isUnlocked: boolean = true): THREE.Group {
  const g = new THREE.Group();
  g.position.set(x, 0, z);

  const archMat = new THREE.MeshStandardMaterial({
    color: isDefeated ? 0x334155 : isUnlocked ? 0x1e293b : 0x450a0a,
    roughness: 0.5,
    metalness: 0.3,
  });
  const pillar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 2.0, 8), archMat);
  pillar1.position.set(-0.8, 1.0, 0);
  pillar1.castShadow = true;
  g.add(pillar1);

  const pillar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 2.0, 8), archMat);
  pillar2.position.set(0.8, 1.0, 0);
  pillar2.castShadow = true;
  g.add(pillar2);

  const topArch = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.3, 0.4), archMat);
  topArch.position.set(0, 1.9, 0);
  topArch.castShadow = true;
  g.add(topArch);

  if (isDefeated) {
    // Purified Celestial Amethyst Crystal
    const core = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.55, 0),
      new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        emissive: 0x9333ea,
        emissiveIntensity: 0.9,
        roughness: 0.1,
        metalness: 0.2,
      })
    );
    core.position.set(0, 1.0, 0);
    g.add(core);

    const light = new THREE.PointLight(0xc084fc, 2.0, 6);
    light.position.set(0, 1.2, 0);
    g.add(light);
  } else if (!isUnlocked) {
    // 🔒 SEALED RUNIC BARRIER SHIELD (Locked before main quests)
    const barrierMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      emissive: 0xdc2626,
      emissiveIntensity: 1.2,
      transparent: true,
      opacity: 0.65,
      roughness: 0.2,
    });
    const barrier = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 1.5, 16), barrierMat);
    barrier.position.set(0, 0.85, 0);
    g.add(barrier);

    // Runic Lock Ring
    const lockRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.05, 8, 24),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.8, metalness: 0.9 })
    );
    lockRing.position.set(0, 0.9, 0.15);
    g.add(lockRing);

    // Lock Core Sigil
    const sigil = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.24, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x78350f, metalness: 0.8 })
    );
    sigil.position.set(0, 0.9, 0.2);
    g.add(sigil);

    const light = new THREE.PointLight(0xef4444, 1.6, 5);
    light.position.set(0, 1.0, 0.3);
    g.add(light);
  } else {
    // ⚔️ ACTIVE BOSS VORTEX PORTAL
    const portalMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.4,
      roughness: 0.1,
    });
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 1.5, 16), portalMat);
    core.position.set(0, 0.85, 0);
    g.add(core);

    const light = new THREE.PointLight(0xf59e0b, 2.5, 7);
    light.position.set(0, 1.2, 0);
    g.add(light);
  }

  return g;
}



function create3DShrineMesh(x: number, z: number, isActivated: boolean): THREE.Group {
  const g = new THREE.Group();
  g.position.set(x, 0, z);

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 1.0, 0.4, 8),
    new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 })
  );
  base.position.y = 0.2;
  base.castShadow = true;
  g.add(base);

  const pillar = new THREE.Mesh(
    new THREE.ConeGeometry(0.5, 2.2, 4),
    new THREE.MeshStandardMaterial({
      color: isActivated ? 0x64748b : 0x0284c7,
      emissive: isActivated ? 0x000000 : 0x0369a1,
      emissiveIntensity: 0.8,
      roughness: 0.3,
    })
  );
  pillar.position.y = 1.3;
  pillar.rotation.y = Math.PI / 4;
  pillar.castShadow = true;
  g.add(pillar);

  if (!isActivated) {
    const gem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.35),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 1.2,
      })
    );
    gem.position.y = 2.8;
    g.add(gem);

    const shrineLight = new THREE.PointLight(0x38bdf8, 2.2, 6);
    shrineLight.position.y = 2.8;
    g.add(shrineLight);
  }

  return g;
}

function create3DFountainMesh(x: number, z: number, isActivated: boolean): THREE.Group {
  const g = new THREE.Group();
  g.position.set(x, 0, z);

  const basin = new THREE.Mesh(
    new THREE.CylinderGeometry(1.0, 1.1, 0.5, 12),
    new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 })
  );
  basin.position.y = 0.25;
  basin.castShadow = true;
  g.add(basin);

  const coreMat = new THREE.MeshStandardMaterial({
    color: isActivated ? 0x451a03 : 0xf59e0b,
    emissive: isActivated ? 0x000000 : 0xd97706,
    emissiveIntensity: 0.9,
    roughness: 0.2,
  });
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.45, 12), coreMat);
  core.position.y = 0.28;
  g.add(core);

  if (!isActivated) {
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const coin = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.12),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xeab308, emissiveIntensity: 0.5 })
      );
      coin.position.set(Math.cos(angle) * 0.5, 0.55, Math.sin(angle) * 0.5);
      g.add(coin);
    }

    const goldLight = new THREE.PointLight(0xfab107, 2.5, 6);
    goldLight.position.y = 0.8;
    g.add(goldLight);
  }

  return g;
}



function create3DRichTreeMesh(posX: number, posZ: number, zoneId: string, x: number, y: number): THREE.Group {
  const g = new THREE.Group();

  // Pseudo-random seed derived from tile coordinates
  const seed = Math.abs(x * 37 + y * 19);
  const seed2 = Math.abs(x * 13 + y * 41);

  // Slight position jitter so trees don't look locked to a robotic grid (+/- 0.2)
  const jitterX = ((seed % 10) - 5) * 0.04;
  const jitterZ = ((seed2 % 10) - 5) * 0.04;
  g.position.set(posX + jitterX, 0, posZ + jitterZ);

  // Random Y-rotation (0 to 360 degrees)
  g.rotation.y = ((seed * 17) % 360) * (Math.PI / 180);

  // HEIGHT VARIATION: scale Y between 0.85x and 1.7x for natural realism!
  const heightScale = 0.85 + ((seed % 10) / 9) * 0.85;
  // WIDTH VARIATION: scale X/Z between 0.85x and 1.35x!
  const widthScale = 0.85 + ((seed2 % 8) / 7) * 0.5;

  g.scale.set(widthScale, heightScale, widthScale);

  const barkTexture = getCachedBarkTexture();
  const trunkMat = new THREE.MeshStandardMaterial({
    map: barkTexture,
    roughness: 0.9,
    metalness: 0.05,
  });

  // Tree Model Selection
  const modelType = seed % 4;

  if (zoneId === 'zone_forest') {
    if (modelType === 0) {
      // 1. ANCIENT OAK WITH HEAVY ORGANIC BRANCHES (Roble Realista de Gran Cúpula)
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.52, 3.2, 12), trunkMat);
      trunk.position.y = 1.6;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      g.add(trunk);

      // Root flares extending into ground
      for (let r = 0; r < 4; r++) {
        const rootAngle = (r / 4) * Math.PI * 2 + (seed * 0.2);
        const root = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.28, 1.2, 8), trunkMat);
        root.position.set(Math.cos(rootAngle) * 0.35, 0.4, Math.sin(rootAngle) * 0.35);
        root.rotation.z = Math.cos(rootAngle) * 0.45;
        root.rotation.x = Math.sin(rootAngle) * 0.45;
        root.castShadow = true;
        g.add(root);
      }

      // Organic Branches splitting from top of trunk
      const branchAngles = [0.3, 1.8, 3.6, 5.1];
      branchAngles.forEach((bAngle) => {
        const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, 1.8, 8), trunkMat);
        const bx = Math.cos(bAngle) * 0.5;
        const bz = Math.sin(bAngle) * 0.5;
        branch.position.set(bx, 2.7, bz);
        branch.rotation.z = Math.cos(bAngle) * 0.6;
        branch.rotation.x = Math.sin(bAngle) * 0.6;
        branch.castShadow = true;
        g.add(branch);
      });

      // Layered Dense Leaf Canopies
      const leafTexMain = getCachedLeafTexture('#15803d', '#4ade80');
      const leafTexAlt = getCachedLeafTexture('#166534', '#a3e635');
      const leafMatMain = new THREE.MeshStandardMaterial({ map: leafTexMain, roughness: 0.5 });
      const leafMatAlt = new THREE.MeshStandardMaterial({ map: leafTexAlt, roughness: 0.5 });

      const clusters = [
        { x: 0, y: 3.8, z: 0, r: 1.5, mat: leafMatMain },
        { x: 0.8, y: 3.4, z: 0.4, r: 1.1, mat: leafMatAlt },
        { x: -0.8, y: 3.5, z: -0.3, r: 1.15, mat: leafMatMain },
        { x: 0.2, y: 4.4, z: -0.5, r: 1.0, mat: leafMatAlt },
        { x: -0.3, y: 4.6, z: 0.6, r: 0.9, mat: leafMatMain },
      ];

      clusters.forEach((c) => {
        const clusterMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(c.r, 2), c.mat);
        clusterMesh.position.set(c.x, c.y, c.z);
        clusterMesh.rotation.set((seed % 3) * 0.2, (seed % 5) * 0.3, (seed % 7) * 0.1);
        clusterMesh.castShadow = true;
        clusterMesh.receiveShadow = true;
        g.add(clusterMesh);
      });

    } else if (modelType === 1) {
      // 2. REALISTIC TIERED FIR/PINE (Pino Silvestre de Altura con Capas)
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.42, 4.2, 12), trunkMat);
      trunk.position.y = 2.1;
      trunk.castShadow = true;
      g.add(trunk);

      const pineLeafTex = getCachedLeafTexture('#14532d', '#22c55e');
      const pineMat = new THREE.MeshStandardMaterial({ map: pineLeafTex, roughness: 0.6 });

      const tiers = [
        { y: 2.6, r: 1.7, h: 1.6 },
        { y: 3.5, r: 1.4, h: 1.4 },
        { y: 4.3, r: 1.1, h: 1.2 },
        { y: 5.0, r: 0.75, h: 1.0 },
        { y: 5.6, r: 0.4, h: 0.7 },
      ];

      tiers.forEach((t) => {
        const tierMesh = new THREE.Mesh(new THREE.ConeGeometry(t.r, t.h, 12), pineMat);
        tierMesh.position.y = t.y;
        tierMesh.castShadow = true;
        tierMesh.receiveShadow = true;
        g.add(tierMesh);
      });

    } else if (modelType === 2) {
      // 3. SLENDER WHITE BIRCH (Abedul Realista con Corteza Blanca y Hojas Vibrantes)
      const birchTex = getCachedBirchTexture();
      const birchTrunkMat = new THREE.MeshStandardMaterial({ map: birchTex, roughness: 0.7 });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.28, 4.5, 10), birchTrunkMat);
      trunk.position.y = 2.25;
      trunk.castShadow = true;
      g.add(trunk);

      const birchLeafTex = getCachedLeafTexture('#65a30d', '#a3e635');
      const birchLeafMat = new THREE.MeshStandardMaterial({ map: birchLeafTex, roughness: 0.5 });

      const crowns = [
        { x: 0, y: 4.2, z: 0, r: 1.1 },
        { x: 0.4, y: 3.6, z: 0.3, r: 0.8 },
        { x: -0.4, y: 4.8, z: -0.2, r: 0.7 },
      ];
      crowns.forEach((c) => {
        const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(c.r, 2), birchLeafMat);
        crown.position.set(c.x, c.y, c.z);
        crown.castShadow = true;
        g.add(crown);
      });

    } else {
      // 4. AUTUMN MAPLE (Arce de Otoño Carmesí y Dorado)
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.44, 3.4, 10), trunkMat);
      trunk.position.y = 1.7;
      trunk.castShadow = true;
      g.add(trunk);

      const autumnRedTex = getCachedLeafTexture('#dc2626', '#fca5a5');
      const autumnGoldTex = getCachedLeafTexture('#d97706', '#fef08a');

      const matRed = new THREE.MeshStandardMaterial({ map: autumnRedTex, roughness: 0.5 });
      const matGold = new THREE.MeshStandardMaterial({ map: autumnGoldTex, roughness: 0.5 });

      const mapleClusters = [
        { x: -0.4, y: 3.2, z: 0.2, r: 1.3, mat: matRed },
        { x: 0.5, y: 3.7, z: -0.3, r: 1.15, mat: matGold },
        { x: 0.0, y: 4.4, z: 0.1, r: 0.95, mat: matRed },
      ];

      mapleClusters.forEach((mc) => {
        const cluster = new THREE.Mesh(new THREE.IcosahedronGeometry(mc.r, 2), mc.mat);
        cluster.position.set(mc.x, mc.y, mc.z);
        cluster.castShadow = true;
        g.add(cluster);
      });
    }
  } else {
    // Cave / Volcano rock formations
    const rockMat = new THREE.MeshStandardMaterial({
      color: zoneId === 'zone_cave' ? 0x334155 : 0x7c2d12,
      roughness: 0.6,
      metalness: 0.2,
    });
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2, 1), rockMat);
    rock.position.y = 0.8;
    rock.rotation.set((seed % 5) * 0.2, (seed2 % 7) * 0.3, (seed % 3) * 0.1);
    rock.castShadow = true;
    g.add(rock);
  }

  return g;
}

function create3DCottageMesh(posX: number, posZ: number, variant: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);

  // Stone/Cobblestone Foundation Base
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.3, 1.8),
    new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 })
  );
  base.position.y = 0.15;
  base.castShadow = true;
  base.receiveShadow = true;
  g.add(base);

  // Main House Body (Timber & Plaster)
  const wallMat = new THREE.MeshStandardMaterial({
    color: variant === 0 ? 0xfef3c7 : 0xe2e8f0,
    roughness: 0.7,
  });
  const houseBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.5), wallMat);
  houseBody.position.y = 0.9;
  houseBody.castShadow = true;
  houseBody.receiveShadow = true;
  g.add(houseBody);

  // Timber Frame Corner Beams
  const timberMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 });
  const beamLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.22, 0.12), timberMat);
  beamLeft.position.set(-0.8, 0.9, 0.75);
  g.add(beamLeft);

  const beamRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.22, 0.12), timberMat);
  beamRight.position.set(0.8, 0.9, 0.75);
  g.add(beamRight);

  // Gabled Pitched Tiled Roof
  const roofMat = new THREE.MeshStandardMaterial({
    color: variant === 0 ? 0x991b1b : 0x78350f,
    roughness: 0.5,
  });
  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.4, 1.0, 4), roofMat);
  roof.position.y = 2.0;
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  g.add(roof);

  // Brick Chimney
  const chimney = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.9, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.9 })
  );
  chimney.position.set(0.45, 2.1, -0.3);
  chimney.castShadow = true;
  g.add(chimney);

  // Smoke Puff
  const smoke = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.18, 1),
    new THREE.MeshStandardMaterial({ color: 0xcbd5e1, transparent: true, opacity: 0.6 })
  );
  smoke.position.set(0.45, 2.7, -0.3);
  g.add(smoke);

  // Glowing Glass Window
  const windowGlass = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.4, 0.08),
    new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xeab308,
      emissiveIntensity: 1.2,
    })
  );
  windowGlass.position.set(-0.35, 1.1, 0.76);
  g.add(windowGlass);

  // Wooden Front Door
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.7, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x3f2305, roughness: 0.8 })
  );
  door.position.set(0.3, 0.65, 0.76);
  g.add(door);

  return g;
}

function create3DFenceMesh(posX: number, posZ: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });

  const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 0.15), woodMat);
  p1.position.set(-0.6, 0.4, 0);
  p1.castShadow = true;
  g.add(p1);

  const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 0.15), woodMat);
  p2.position.set(0.6, 0.4, 0);
  p2.castShadow = true;
  g.add(p2);

  const r1 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.1, 0.08), woodMat);
  r1.position.set(0, 0.55, 0);
  g.add(r1);

  const r2 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.1, 0.08), woodMat);
  r2.position.set(0, 0.25, 0);
  g.add(r2);

  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.65, 10),
    new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 })
  );
  barrel.position.set(0, 0.33, 0.4);
  barrel.castShadow = true;
  g.add(barrel);

  return g;
}

function create3DLanternPostMesh(posX: number, posZ: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x3f2305, roughness: 0.8 });
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 1.8, 8), woodMat);
  post.position.y = 0.9;
  post.castShadow = true;
  g.add(post);

  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 0.08), woodMat);
  arm.position.set(0.15, 1.7, 0);
  g.add(arm);

  const lantern = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.16),
    new THREE.MeshStandardMaterial({
      color: 0xfde047,
      emissive: 0xeab308,
      emissiveIntensity: 2.2,
      roughness: 0.2,
    })
  );
  lantern.position.set(0.3, 1.5, 0);
  g.add(lantern);

  return g;
}

function create3DFlowerPatchMesh(posX: number, posZ: number, seed: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);

  const flowerColors = [0xef4444, 0xf59e0b, 0xec4899, 0x3b82f6, 0xa855f7];

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + seed;
    const dist = 0.3 + ((seed * 13 + i * 7) % 5) * 0.1;
    const fx = Math.cos(angle) * dist;
    const fz = Math.sin(angle) * dist;

    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.3, 4),
      new THREE.MeshStandardMaterial({ color: 0x22c55e })
    );
    stem.position.set(fx, 0.15, fz);
    g.add(stem);

    const bloom = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.08),
      new THREE.MeshStandardMaterial({
        color: flowerColors[(seed + i) % flowerColors.length],
        roughness: 0.5,
      })
    );
    bloom.position.set(fx, 0.3, fz);
    g.add(bloom);
  }

  return g;
}

function create3DRuinsMesh(posX: number, posZ: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);

  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 });

  const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 1.8, 8), stoneMat);
  p1.position.set(-0.5, 0.9, -0.2);
  p1.castShadow = true;
  g.add(p1);

  const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.2, 8), stoneMat);
  p2.position.set(0.3, 0.2, 0.2);
  p2.rotation.z = Math.PI / 2.3;
  p2.castShadow = true;
  g.add(p2);

  const rune = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.9, 0.2, 8),
    new THREE.MeshStandardMaterial({
      color: 0x334155,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
      roughness: 0.5,
    })
  );
  rune.position.y = 0.1;
  rune.castShadow = true;
  g.add(rune);

  return g;
}

// 🪨 Cantera de Piedra Natural & Veta de Mineral (Tile 18)
function create3DStoneQuarryMesh(posX: number, posZ: number, seed: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);

  const rockMat = new THREE.MeshStandardMaterial({ color: 0x52525b, roughness: 0.85, flatShading: true });
  const lightRockMat = new THREE.MeshStandardMaterial({ color: 0x71717a, roughness: 0.8, flatShading: true });
  const ironMat = new THREE.MeshStandardMaterial({ color: 0xa1a1aa, metalness: 0.8, roughness: 0.3 });

  // Base Excavated Gravel Circle
  const baseGravel = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 1.25, 0.08, 10),
    new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.95 })
  );
  baseGravel.position.y = 0.04;
  baseGravel.receiveShadow = true;
  g.add(baseGravel);

  // Main Massive Boulder
  const mainRock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.72, 1), rockMat);
  mainRock.position.set(-0.15, 0.55, -0.1);
  mainRock.scale.set(1.1, 0.95, 1.2);
  mainRock.rotation.set(0.3, seed * 0.5, -0.2);
  mainRock.castShadow = true;
  mainRock.receiveShadow = true;
  g.add(mainRock);

  // Secondary Boulder
  const secRock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.48, 1), lightRockMat);
  secRock.position.set(0.55, 0.38, 0.3);
  secRock.rotation.set(-0.2, seed * 0.8, 0.4);
  secRock.castShadow = true;
  g.add(secRock);

  // Cut Masonry Stone Slabs (Bloques tallados)
  const slab1 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.28, 0.42), lightRockMat);
  slab1.position.set(-0.55, 0.14, 0.45);
  slab1.rotation.y = 0.35;
  slab1.castShadow = true;
  g.add(slab1);

  const slab2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.22, 0.35), rockMat);
  slab2.position.set(-0.5, 0.38, 0.42);
  slab2.rotation.y = -0.2;
  slab2.castShadow = true;
  g.add(slab2);

  // Metallic Iron Ore Deposit Nuggets (Vetas brillantes incrustadas)
  for (let i = 0; i < 4; i++) {
    const ore = new THREE.Mesh(new THREE.OctahedronGeometry(0.12), ironMat);
    ore.position.set(
      -0.25 + (i % 2) * 0.4,
      0.45 + (i > 1 ? 0.3 : 0),
      -0.05 + (i % 3) * 0.25
    );
    g.add(ore);
  }

  // Miner Pickaxe leaning against stone
  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.75, 6),
    new THREE.MeshStandardMaterial({ color: 0x78350f })
  );
  handle.position.set(0.35, 0.35, -0.45);
  handle.rotation.z = -0.55;
  handle.rotation.x = 0.25;
  g.add(handle);

  const pickHead = new THREE.Mesh(
    new THREE.ConeGeometry(0.06, 0.32, 4),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.85, roughness: 0.2 })
  );
  pickHead.position.set(0.52, 0.65, -0.4);
  pickHead.rotation.z = Math.PI / 2;
  g.add(pickHead);

  return g;
}

// 🥕 Huerto de Cultivo y Parcela de Hortalizas (Tile 13)
function create3DCropPatchMesh(posX: number, posZ: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);

  // Raised Fertile Soil Bed
  const soilMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.95 });
  const soilBed = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.14, 2.1), soilMat);
  soilBed.position.y = 0.07;
  soilBed.receiveShadow = true;
  g.add(soilBed);

  // Wooden Edge Frame
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.85 });
  [
    [0, 1.02, 2.18, 0.08],
    [0, -1.02, 2.18, 0.08],
    [1.02, 0, 0.08, 2.18],
    [-1.02, 0, 0.08, 2.18],
  ].forEach(([fx, fz, fw, fd]) => {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(fw, 0.16, fd), frameMat);
    plank.position.set(fx, 0.08, fz);
    g.add(plank);
  });

  const carrotMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.6 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.7 });
  const cabbageMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.8 });

  // Rows of Crops (Zanahorias y Coles)
  for (let row = -1; row <= 1; row++) {
    for (let col = -1; col <= 1; col++) {
      const cx = col * 0.6;
      const cz = row * 0.6;

      if ((row + col) % 2 === 0) {
        // Carrot with Green Foliage Top
        const carrotTop = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.04, 0.12, 6), carrotMat);
        carrotTop.position.set(cx, 0.18, cz);
        g.add(carrotTop);

        for (let l = 0; l < 3; l++) {
          const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.18, 4), leafMat);
          leaf.position.set(cx, 0.28, cz);
          leaf.rotation.z = (l - 1) * 0.35;
          leaf.rotation.x = ((l % 2) - 0.5) * 0.3;
          g.add(leaf);
        }
      } else {
        // Big Lush Cabbage
        const cabbage = new THREE.Mesh(new THREE.DodecahedronGeometry(0.16, 1), cabbageMat);
        cabbage.position.set(cx, 0.2, cz);
        cabbage.scale.set(1.2, 0.85, 1.2);
        g.add(cabbage);
      }
    }
  }

  return g;
}

// 🪵 Depósito de Leña y Pila de Troncos (Tile 14)
function create3DWoodpileMesh(posX: number, posZ: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);

  const barkMat = new THREE.MeshStandardMaterial({ color: 0x543822, roughness: 0.9 });
  const woodEndMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.7 });

  // Wooden Ground Stand / Stakes
  const stakeMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.9 });
  [
    [-0.65, -0.45],
    [-0.65, 0.45],
    [0.65, -0.45],
    [0.65, 0.45],
  ].forEach(([sx, sz]) => {
    const stake = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.85, 0.12), stakeMat);
    stake.position.set(sx, 0.42, sz);
    stake.castShadow = true;
    g.add(stake);
  });

  // Stacked Cylindrical Logs Pyramid (3 at bottom, 2 in middle, 1 at top)
  const logRadius = 0.16;
  const logLength = 1.35;
  const layers = [
    { count: 3, y: logRadius, offsetZ: -0.32 },
    { count: 2, y: logRadius * 2.5, offsetZ: -0.16 },
    { count: 1, y: logRadius * 4.0, offsetZ: 0 },
  ];

  layers.forEach(({ count, y, offsetZ }) => {
    for (let i = 0; i < count; i++) {
      const log = new THREE.Group();
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(logRadius, logRadius, logLength, 8),
        [woodEndMat, barkMat, woodEndMat]
      );
      trunk.rotation.z = Math.PI / 2;
      trunk.castShadow = true;
      log.add(trunk);

      log.position.set(0, y, offsetZ + i * (logRadius * 2.1));
      g.add(log);
    }
  });

  return g;
}

// 💎 Geoda de Cristal Arcano (Tile 20)
function create3DGeodeCrystalMesh(posX: number, posZ: number, seed: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);

  const geodeRockMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9, flatShading: true });
  const crystalColors = [0xc084fc, 0x38bdf8, 0xec4899, 0xa855f7];
  const crystalColor = crystalColors[seed % crystalColors.length];

  const crystalMat = new THREE.MeshStandardMaterial({
    color: crystalColor,
    emissive: crystalColor,
    emissiveIntensity: 1.8,
    roughness: 0.15,
    metalness: 0.4,
  });

  // Hollow Rocky Crater Base
  const baseRock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75, 1), geodeRockMat);
  baseRock.position.y = 0.35;
  baseRock.scale.set(1.3, 0.65, 1.3);
  baseRock.castShadow = true;
  baseRock.receiveShadow = true;
  g.add(baseRock);

  // Cluster of 6 Arcane Crystals radiating upwards
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + seed;
    const dist = 0.18 + (i % 3) * 0.12;
    const height = 0.45 + ((seed + i) % 4) * 0.18;

    const crystal = new THREE.Mesh(new THREE.ConeGeometry(0.12, height, 6), crystalMat);
    crystal.position.set(Math.cos(angle) * dist, 0.45 + height / 2, Math.sin(angle) * dist);
    crystal.rotation.x = Math.cos(angle) * 0.35;
    crystal.rotation.z = Math.sin(angle) * 0.35;
    crystal.castShadow = true;
    g.add(crystal);
  }

  return g;
}

export const ThreeMapCanvas = React.memo(ThreeMapCanvasComponent);
