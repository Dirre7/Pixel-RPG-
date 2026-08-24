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
  create3DCastleWaterfallRiverMesh,
  create3DRoyalRelicCrystalMesh,
  create3DRoyalForgeMesh,
  createStylizedChestMesh,
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

export const ThreeMapCanvas: React.FC<ThreeMapCanvasProps> = ({
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

  useEffect(() => {
    facingDirRef.current = facingDir;
  }, [facingDir]);

  // Overhead MOBA HUD screen projection coordinates
  const [playerHudPos, setPlayerHudPos] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  });

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

    const isMobile = typeof window !== 'undefined' && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 900);

    // 2. RENDERER SETUP
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: false,
      powerPreference: 'high-performance',
      precision: isMobile ? 'mediump' : 'highp',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = isMobile ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = currentZone.id === 'zone_cave' || currentZone.id === 'zone_volcano' || currentZone.id === 'zone_castle' ? 1.4 : 1.15;

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
    sunLight.shadow.mapSize.width = isMobile ? 512 : 1024;
    sunLight.shadow.mapSize.height = isMobile ? 512 : 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 250;
    const shadowD = 35;
    sunLight.shadow.camera.left = -shadowD;
    sunLight.shadow.camera.right = shadowD;
    sunLight.shadow.camera.top = shadowD;
    sunLight.shadow.camera.bottom = -shadowD;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // --- BACKGROUND MAP ENVIRONMENT: OCEAN, SUN, CLOUDS & COASTAL CLIFFS ---
    // 1. VAST OCEAN WATER PLANE WITH SUN SPECULAR REFLECTIONS
    const oceanGeo = new THREE.PlaneGeometry(1200, 1200, isMobile ? 16 : 48, isMobile ? 16 : 48);
    const oceanMat = new THREE.MeshPhysicalMaterial({
      color: currentZone.id === 'zone_volcano' ? 0x991b1b : 0x0284c7,
      emissive: currentZone.id === 'zone_volcano' ? 0x7f1d1d : 0x0369a1,
      emissiveIntensity: 0.25,
      roughness: 0.08,
      metalness: 0.4,
      transmission: isMobile ? 0 : 0.35,
      ior: 1.333,
      clearcoat: isMobile ? 0 : 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.9,
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

    // 3. FLOATING 3D VOLUMETRIC CUMULUS CLOUDS
    const cloudGroup = new THREE.Group();
    const animatedClouds: THREE.Group[] = [];
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      metalness: 0.0,
      transparent: true,
      opacity: 0.92,
    });

    const cloudCount = isMobile ? 4 : 12;
    for (let c = 0; c < cloudCount; c++) {
      const cloud = new THREE.Group();
      const cloudCX = centerX - 120 + Math.random() * 240;
      const cloudCY = 38 + Math.random() * 25;
      const cloudCZ = centerZ - 120 + Math.random() * 240;
      cloud.position.set(cloudCX, cloudCY, cloudCZ);

      const puffCount = isMobile ? 3 : 5 + Math.floor(Math.random() * 4);
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

    // 4. COASTAL ROCK CLIFFS SURROUNDING THE ISLAND MAP
    const cliffMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    const islandMinX = -2;
    const islandMaxX = mapW + 2;
    const islandMinZ = -2;
    const islandMaxZ = mapH + 2;
    const cliffStep = isMobile ? 10 : 5;

    for (let i = -10; i <= mapW + 10; i += cliffStep) {
      // North & South Coast Cliffs
      [islandMinZ - 1.5, islandMaxZ + 1.5].forEach((cz) => {
        const cliff = new THREE.Mesh(new THREE.DodecahedronGeometry(2.5 + Math.random() * 2, 1), cliffMat);
        cliff.position.set(i, 0.2, cz);
        cliff.scale.set(1.2, 0.6 + Math.random() * 0.8, 1.2);
        cliff.castShadow = !isMobile;
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
        cliff.castShadow = !isMobile;
        cliff.receiveShadow = true;
        scene.add(cliff);
      });
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

    // Geometries & Materials reuse with True PBR Normal Map
    const pathPBR = getCachedPathPBR();
    const pathMat = new THREE.MeshStandardMaterial({
      map: pathPBR.diffuse,
      normalMap: pathPBR.normal,
      normalScale: new THREE.Vector2(1.5, 1.5),
      roughness: 0.55,
      metalness: 0.12,
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

    // Ground Tile Material with True PBR Physical Shader (Reused instance for high performance)
    const groundMat = new THREE.MeshStandardMaterial({
      map: groundPBR.diffuse,
      normalMap: groundPBR.normal,
      normalScale: new THREE.Vector2(1.4, 1.4),
      roughness: currentZone.id === 'zone_castle' ? 0.45 : currentZone.id === 'zone_cave' ? 0.6 : 0.85,
      metalness: currentZone.id === 'zone_castle' ? 0.15 : currentZone.id === 'zone_cave' ? 0.18 : 0.05,
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
        const isWaterTile = currentZone.tileData[y]?.[x] === 3;
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

    const pathMainGeo = new THREE.BoxGeometry(2.505, 0.40, 2.505);

    // Populate Map Tiles Details, Paths, Buildings & Obstacles
    for (let y = 0; y < currentZone.mapHeight; y++) {
      for (let x = 0; x < currentZone.mapWidth; x++) {
        const tileType = currentZone.tileData[y]?.[x] ?? 0;
        const posX = x * 2.5;
        const posZ = y * 2.5;

        // Perfectly flat and uniform terrain level
        const elevation = 0;

        // SOLID CONTINUOUS SEAMLESS PATH (Single clean tile mesh, 0% Z-Fighting Moiré stripes)
        if (tileType === 2) {
          const pathMesh = new THREE.Mesh(pathMainGeo, pathMat);
          pathMesh.position.set(posX, -0.18, posZ);
          pathMesh.receiveShadow = true;
          tileGroup.add(pathMesh);

          // 🌉 Wooden Bridge Handrails when path crosses water
          const hasNorthWater = currentZone.tileData[y - 1]?.[x] === 3;
          const hasSouthWater = currentZone.tileData[y + 1]?.[x] === 3;
          const hasEastWater = currentZone.tileData[y]?.[x + 1] === 3;
          const hasWestWater = currentZone.tileData[y]?.[x - 1] === 3;

          const bridgeRailMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.85 });
          const bridgePostMat = new THREE.MeshStandardMaterial({ color: 0x3b1c0a, roughness: 0.9 });

          if (hasNorthWater) {
            const railN = new THREE.Mesh(new THREE.BoxGeometry(2.52, 0.08, 0.08), bridgeRailMat);
            railN.position.set(posX, 0.32, posZ - 1.18);
            railN.castShadow = true;
            tileGroup.add(railN);

            for (let p = -1; p <= 1; p++) {
              const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.12), bridgePostMat);
              post.position.set(posX + p * 1.05, 0.15, posZ - 1.18);
              post.castShadow = true;
              tileGroup.add(post);
            }
          }

          if (hasSouthWater) {
            const railS = new THREE.Mesh(new THREE.BoxGeometry(2.52, 0.08, 0.08), bridgeRailMat);
            railS.position.set(posX, 0.32, posZ + 1.18);
            railS.castShadow = true;
            tileGroup.add(railS);

            for (let p = -1; p <= 1; p++) {
              const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.12), bridgePostMat);
              post.position.set(posX + p * 1.05, 0.15, posZ + 1.18);
              post.castShadow = true;
              tileGroup.add(post);
            }
          }

          if (hasWestWater) {
            const railW = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 2.52), bridgeRailMat);
            railW.position.set(posX - 1.18, 0.32, posZ);
            railW.castShadow = true;
            tileGroup.add(railW);

            for (let p = -1; p <= 1; p++) {
              const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.12), bridgePostMat);
              post.position.set(posX - 1.18, 0.15, posZ + p * 1.05);
              post.castShadow = true;
              tileGroup.add(post);
            }
          }

          if (hasEastWater) {
            const railE = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 2.52), bridgeRailMat);
            railE.position.set(posX + 1.18, 0.32, posZ);
            railE.castShadow = true;
            tileGroup.add(railE);

            for (let p = -1; p <= 1; p++) {
              const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.12), bridgePostMat);
              post.position.set(posX + 1.18, 0.15, posZ + p * 1.05);
              post.castShadow = true;
              tileGroup.add(post);
            }
          }

          // 🌿 Organic RPG Roadside Transitions: Stone Curbs, Wild Grass, Pebbles & Wooden Fences
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
            tileGroup.add(curbN);

            if ((x + y) % 2 === 0) {
              const pN = new THREE.Mesh(new THREE.DodecahedronGeometry(0.09, 1), pebbleMat);
              pN.position.set(posX + 0.45, 0.05, posZ - 1.16);
              tileGroup.add(pN);
            }

            if ((x * 7 + y * 11) % 3 === 0) {
              const gN = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 4), grassMat);
              gN.position.set(posX - 0.5, 0.08, posZ - 1.18);
              tileGroup.add(gN);
            }

            if ((x * 13 + y * 19) % 4 === 0 && currentZone.id === 'zone_forest') {
              const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.55, 6), fenceMat);
              post1.position.set(posX - 0.7, 0.25, posZ - 1.22);
              post1.castShadow = true;
              tileGroup.add(post1);

              const post2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.55, 6), fenceMat);
              post2.position.set(posX + 0.7, 0.25, posZ - 1.22);
              post2.castShadow = true;
              tileGroup.add(post2);

              const rail = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.04), fenceMat);
              rail.position.set(posX, 0.35, posZ - 1.22);
              rail.castShadow = true;
              tileGroup.add(rail);
            }
          }

          if (hasSouthGrass) {
            const curbS = new THREE.Mesh(new THREE.BoxGeometry(2.505, 0.04, 0.12), curbMat);
            curbS.position.set(posX, 0.02, posZ + 1.20);
            tileGroup.add(curbS);

            if ((x + y) % 2 === 1) {
              const pS = new THREE.Mesh(new THREE.DodecahedronGeometry(0.09, 1), pebbleMat);
              pS.position.set(posX - 0.45, 0.05, posZ + 1.16);
              tileGroup.add(pS);
            }

            if ((x * 11 + y * 13) % 3 === 0) {
              const gS = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 4), grassMat);
              gS.position.set(posX + 0.5, 0.08, posZ + 1.18);
              tileGroup.add(gS);
            }

            if ((x * 17 + y * 23) % 4 === 0 && currentZone.id === 'zone_forest') {
              const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.55, 6), fenceMat);
              post1.position.set(posX - 0.7, 0.25, posZ + 1.22);
              post1.castShadow = true;
              tileGroup.add(post1);

              const post2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.55, 6), fenceMat);
              post2.position.set(posX + 0.7, 0.25, posZ + 1.22);
              post2.castShadow = true;
              tileGroup.add(post2);

              const rail = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.04), fenceMat);
              rail.position.set(posX, 0.35, posZ + 1.22);
              rail.castShadow = true;
              tileGroup.add(rail);
            }
          }

          if (hasWestGrass) {
            const curbW = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 2.505), curbMat);
            curbW.position.set(posX - 1.20, 0.02, posZ);
            tileGroup.add(curbW);

            if ((x + y) % 2 === 0) {
              const pW = new THREE.Mesh(new THREE.DodecahedronGeometry(0.09, 1), pebbleMat);
              pW.position.set(posX - 1.16, 0.05, posZ + 0.45);
              tileGroup.add(pW);
            }

            if ((x * 13 + y * 17) % 3 === 0) {
              const gW = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 4), grassMat);
              gW.position.set(posX - 1.18, 0.08, posZ - 0.5);
              tileGroup.add(gW);
            }

            if ((x * 19 + y * 29) % 4 === 0 && currentZone.id === 'zone_forest') {
              const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.55, 6), fenceMat);
              post1.position.set(posX - 1.22, 0.25, posZ - 0.7);
              post1.castShadow = true;
              tileGroup.add(post1);

              const post2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.55, 6), fenceMat);
              post2.position.set(posX - 1.22, 0.25, posZ + 0.7);
              post2.castShadow = true;
              tileGroup.add(post2);

              const rail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 1.6), fenceMat);
              rail.position.set(posX - 1.22, 0.35, posZ);
              rail.castShadow = true;
              tileGroup.add(rail);
            }
          }

          if (hasEastGrass) {
            const curbE = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 2.505), curbMat);
            curbE.position.set(posX + 1.20, 0.02, posZ);
            tileGroup.add(curbE);

            if ((x + y) % 2 === 1) {
              const pE = new THREE.Mesh(new THREE.DodecahedronGeometry(0.09, 1), pebbleMat);
              pE.position.set(posX + 1.16, 0.05, posZ - 0.45);
              tileGroup.add(pE);
            }

            if ((x * 17 + y * 23) % 3 === 0) {
              const gE = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 4), grassMat);
              gE.position.set(posX + 1.18, 0.08, posZ + 0.5);
              tileGroup.add(gE);
            }

            if ((x * 23 + y * 31) % 4 === 0 && currentZone.id === 'zone_forest') {
              const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.55, 6), fenceMat);
              post1.position.set(posX + 1.22, 0.25, posZ - 0.7);
              post1.castShadow = true;
              tileGroup.add(post1);

              const post2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.55, 6), fenceMat);
              post2.position.set(posX + 1.22, 0.25, posZ + 0.7);
              post2.castShadow = true;
              tileGroup.add(post2);

              const rail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 1.6), fenceMat);
              rail.position.set(posX + 1.22, 0.35, posZ);
              rail.castShadow = true;
              tileGroup.add(rail);
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
              tileGroup.add(crystalCluster);
            } else if (decSeed % 17 === 0) {
              const pebble = create3DRockPebbleMesh(posX, posZ, decSeed);
              pebble.position.y += elevation;
              tileGroup.add(pebble);
            }
          } else if (currentZone.id === 'zone_volcano') {
            // Volcanic Ruby Crystals & Basalt Debris
            if (decSeed % 7 === 0) {
              const rubyCluster = create3DVolcanicRubyCrystalMesh(x, y);
              rubyCluster.position.set(posX, elevation, posZ);
              tileGroup.add(rubyCluster);
            } else if (decSeed % 13 === 0) {
              const pebble = create3DRockPebbleMesh(posX, posZ, decSeed);
              pebble.position.y += elevation;
              tileGroup.add(pebble);
            }
          } else if (currentZone.id === 'zone_castle') {
            // Celestial Relic Crystals & Mossy Stone Plinths
            if (decSeed % 7 === 0) {
              const relicCluster = create3DRoyalRelicCrystalMesh(x, y);
              relicCluster.position.set(posX, elevation, posZ);
              tileGroup.add(relicCluster);
            } else if (decSeed % 13 === 0) {
              const pebble = create3DRockPebbleMesh(posX, posZ, decSeed);
              pebble.position.y += elevation;
              tileGroup.add(pebble);
            }
          } else if (hasNeighborPath && decSeed % 3 === 0 && currentZone.id === 'zone_forest') {
            const hedgeGroup = create3DHedgeMesh(posX, posZ);
            hedgeGroup.position.y += elevation;
            tileGroup.add(hedgeGroup);
            obstacleGroups.push({ group: hedgeGroup, gridX: x, gridY: y });
          } else if (decSeed % 11 === 0) {
            const flowerGroup = create3DFlowerPatchMesh(posX, posZ, decSeed);
            flowerGroup.position.y += elevation;
            tileGroup.add(flowerGroup);
          } else if (decSeed % 29 === 0) {
            const lanternGroup = create3DLanternPostMesh(posX, posZ);
            lanternGroup.position.y += elevation;
            tileGroup.add(lanternGroup);
            const lanternLight = lanternGroup.children.find((c) => c instanceof THREE.PointLight) as THREE.PointLight;
            if (lanternLight) animatedLanterns.push(lanternLight);
          } else if (currentZone.id === 'zone_forest') {
            // 3D Grass Tuft clusters
            if (decSeed % 2 === 0) {
              const grassTuft = create3DGrassTuftMesh(posX + ((decSeed % 5) - 2) * 0.2, posZ + ((decSeed % 7) - 3) * 0.2, decSeed);
              grassTuft.position.y += elevation;
              tileGroup.add(grassTuft);
            }
            // Mossy Pebble
            if (decSeed % 5 === 1) {
              const pebble = create3DRockPebbleMesh(posX + ((decSeed % 3) - 1) * 0.3, posZ + ((decSeed % 4) - 2) * 0.3, decSeed);
              pebble.position.y += elevation;
              tileGroup.add(pebble);
            }
          }
        }

        // Obstacles (Castle Rotundas & Walls, Volcanic Basalt Spires, Dungeon Walls, Trees, Cottages)
        if (tileType === 1) {
          const seed = Math.abs(x * 31 + y * 17);
          let obsGroup: THREE.Group;

          if (currentZone.id === 'zone_castle') {
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

          tileGroup.add(obsGroup);
          obstacleGroups.push({ group: obsGroup, gridX: x, gridY: y });
        }

        // Water / Lava Rivers / Waterfall Cascades / Subterranean Turquoise Flooded Grotto
        if (tileType === 3) {
          if (currentZone.id === 'zone_castle') {
            // Crystalline Azure/Turquoise Cascades with Foaming Rapids & Stone Curbs
            const waterRes = create3DCastleWaterfallRiverMesh(x, y);
            const waterGroup = waterRes.group;
            waterGroup.position.set(posX, elevation, posZ);
            tileGroup.add(waterGroup);
            if (waterRes.updateAnimation) animatedBuildingUpdaters.push(waterRes.updateAnimation);
          } else if (currentZone.id === 'zone_volcano') {
            // Glowing Magma River Channels with Heat Waves & Crust Borders
            const lavaRes = create3DLavaRiverTileMesh(x, y);
            const lavaGroup = lavaRes.group;
            lavaGroup.position.set(posX, elevation, posZ);
            tileGroup.add(lavaGroup);
            if (lavaRes.updateAnimation) animatedBuildingUpdaters.push(lavaRes.updateAnimation);
          } else if (currentZone.id === 'zone_cave') {
            // Iconic Turquoise Cavern Pool with Stone Rim
            const grottoRes = create3DTurquoiseGrottoMesh(x, y);
            const grottoGroup = grottoRes.group;
            grottoGroup.position.set(posX, elevation, posZ);
            tileGroup.add(grottoGroup);
            if (grottoRes.updateAnimation) animatedBuildingUpdaters.push(grottoRes.updateAnimation);
          } else {
            const liquidMat = new THREE.MeshPhysicalMaterial({
              color: 0x0284c7,
              emissive: 0x0369a1,
              emissiveIntensity: 0.6,
              roughness: 0.08,
              metalness: 0.3,
              transmission: 0.4,
              ior: 1.333,
              clearcoat: 1.0,
              clearcoatRoughness: 0.05,
              reflectivity: 0.9,
            });
            const liquidMesh = new THREE.Mesh(new THREE.BoxGeometry(2.505, 0.42, 2.505), liquidMat);
            liquidMesh.position.set(posX, -0.10 + elevation, posZ);
            tileGroup.add(liquidMesh);
            animatedWaters.push(liquidMesh);

            // Natural Riverbanks & Pebble Borders around grass boundaries
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
              tileGroup.add(bankN);
              const pN = new THREE.Mesh(new THREE.DodecahedronGeometry(0.16, 1), pebbleMat);
              pN.position.set(posX + 0.5, 0.08 + elevation, posZ - 1.12);
              tileGroup.add(pN);
            }
            if (hasSouthGrass) {
              const bankS = new THREE.Mesh(new THREE.BoxGeometry(2.505, 0.16, 0.28), bankMat);
              bankS.position.set(posX, 0.04 + elevation, posZ + 1.15);
              tileGroup.add(bankS);
              const pS = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18, 1), pebbleMat);
              pS.position.set(posX - 0.4, 0.08 + elevation, posZ + 1.12);
              tileGroup.add(pS);
            }
            if (hasWestGrass) {
              const bankW = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 2.505), bankMat);
              bankW.position.set(posX - 1.15, 0.04 + elevation, posZ);
              tileGroup.add(bankW);
              const pW = new THREE.Mesh(new THREE.DodecahedronGeometry(0.15, 1), pebbleMat);
              pW.position.set(posX - 1.12, 0.08 + elevation, posZ + 0.3);
              tileGroup.add(pW);
            }
            if (hasEastGrass) {
              const bankE = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 2.505), bankMat);
              bankE.position.set(posX + 1.15, 0.04 + elevation, posZ);
              tileGroup.add(bankE);
              const pE = new THREE.Mesh(new THREE.DodecahedronGeometry(0.17, 1), pebbleMat);
              pE.position.set(posX + 1.12, 0.08 + elevation, posZ - 0.4);
              tileGroup.add(pE);
            }
          }
        }

        // Shop (Merchant Market Stall)
        if (tileType === 4) {
          const shopRes = createLowPolyMarketStall('weapons');
          const shopGroup = shopRes.group;
          shopGroup.position.set(posX, elevation, posZ);
          tileGroup.add(shopGroup);
          obstacleGroups.push({ group: shopGroup, gridX: x, gridY: y });
        }

        // Inn (Tavern / Inn Building)
        if (tileType === 5) {
          const innRes = createLowPolyCottage(0xd97706, true, 2);
          const innGroup = innRes.group;
          innGroup.position.set(posX, elevation, posZ);
          innGroup.scale.set(1.3, 1.3, 1.3);
          tileGroup.add(innGroup);
          obstacleGroups.push({ group: innGroup, gridX: x, gridY: y });
          if (innRes.updateAnimation) animatedBuildingUpdaters.push(innRes.updateAnimation);
        }

        // 🌾 Windmill (Tile 6)
        if (tileType === 6) {
          const windmillRes = createLowPolyWindmill();
          const windmillGroup = windmillRes.group;
          windmillGroup.position.set(posX, elevation, posZ);
          tileGroup.add(windmillGroup);
          obstacleGroups.push({ group: windmillGroup, gridX: x, gridY: y });
          if (windmillRes.updateAnimation) animatedBuildingUpdaters.push(windmillRes.updateAnimation);
        }

        // Chest (Tile 7)
        if (tileType === 7) {
          const chestId = `${currentZone.id}_${x}_${y}`;
          const isOpened = openedChests.includes(chestId);
          const chestRes = createStylizedChestMesh(isOpened);
          const chestGroup = chestRes.group;
          chestGroup.position.set(posX, elevation, posZ);
          tileGroup.add(chestGroup);
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
          tileGroup.add(cottageGroup);
          obstacleGroups.push({ group: cottageGroup, gridX: x, gridY: y });
          if (cottageRes.updateAnimation) animatedBuildingUpdaters.push(cottageRes.updateAnimation);
        }

        // 🎪 Bazaar Market Stall (Tile 9)
        if (tileType === 9) {
          const stallRes = createLowPolyMarketStall((x + y) % 2 === 0 ? 'potions' : 'armor');
          const stallGroup = stallRes.group;
          stallGroup.position.set(posX, elevation, posZ);
          tileGroup.add(stallGroup);
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
          tileGroup.add(forgeGroup);
          obstacleGroups.push({ group: forgeGroup, gridX: x, gridY: y });
        }

        // ⚔️ Boss Portal / Zone Travel Gateway (Tile 11)
        if (tileType === 11) {
          const portalGroup = create3DBossPortalMesh(posX, posZ, isBossDefeated, isBossPortalUnlocked);
          portalGroup.position.y += elevation;
          tileGroup.add(portalGroup);
          obstacleGroups.push({ group: portalGroup, gridX: x, gridY: y });
        }

        // 🥕 Huerto de Cultivo y Parcela de Hortalizas (Tile 13)
        if (tileType === 13) {
          const cropGroup = create3DCropPatchMesh(posX, posZ);
          cropGroup.position.y += elevation;
          tileGroup.add(cropGroup);
          obstacleGroups.push({ group: cropGroup, gridX: x, gridY: y });
        }

        // 🪵 Depósito de Leña y Pila de Troncos (Tile 14)
        if (tileType === 14) {
          const woodGroup = create3DWoodpileMesh(posX, posZ);
          woodGroup.position.y += elevation;
          tileGroup.add(woodGroup);
          obstacleGroups.push({ group: woodGroup, gridX: x, gridY: y });
        }

        // 🏮 Farola de la Calle / Poste de Luz (Tile 17)
        if (tileType === 17) {
          const lampGroup = create3DLanternPostMesh(posX, posZ);
          lampGroup.position.y += elevation;
          tileGroup.add(lampGroup);
          obstacleGroups.push({ group: lampGroup, gridX: x, gridY: y });
        }

        // 🪨 Cantera de Piedra Natural & Veta de Mineral (Tile 18)
        if (tileType === 18) {
          const quarryGroup = create3DStoneQuarryMesh(posX, posZ, x * 7 + y * 13);
          quarryGroup.position.y += elevation;
          tileGroup.add(quarryGroup);
          obstacleGroups.push({ group: quarryGroup, gridX: x, gridY: y });
        }

        // 💎 Geoda de Cristal Arcano (Tile 20)
        if (tileType === 20) {
          const geodeGroup = create3DGeodeCrystalMesh(posX, posZ, x * 11 + y * 17);
          geodeGroup.position.y += elevation;
          tileGroup.add(geodeGroup);
          obstacleGroups.push({ group: geodeGroup, gridX: x, gridY: y });
        }
      }
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
          } else if (npc.quest.targetType === 'defeat_boss' && isBossDefeated) {
            isQuestReady = true;
          } else if (npc.quest.targetType === 'open_chests' && openedChests.length >= Number(npc.quest.targetValue)) {
            isQuestReady = true;
          }
        }

        const npcRes = createHumanNPCMesh(npc.avatarStyle, hasQuest, isQuestReady);
        const npcMesh = npcRes.group;
        npcMesh.position.set(npcX, 0, npcZ);
        tileGroup.add(npcMesh);
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

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.08);
      const time = clock.getElapsedTime();

      // Smoothly move hero position with exponential delta-time damper (Immune to FPS drops)
      const curr = playerCurrentPosRef.current;
      const targ = playerTargetPosRef.current;

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

      // 🌟 ENVIRONMENTAL WIND & WAVE DYNAMICS
      const windSpeed = 1.6;
      animatedSwayObjects.forEach((tree, idx) => {
        const windPhase = time * windSpeed + (tree.position.x * 0.4 + tree.position.z * 0.3);
        tree.rotation.z = Math.sin(windPhase) * 0.028;
        tree.rotation.x = Math.cos(windPhase * 0.85) * 0.018;
      });

      animatedWaters.forEach((w, idx) => {
        if (w === oceanMesh) {
          w.position.y = -0.38 + Math.sin(time * 1.4) * 0.045;
        } else {
          w.position.y = -0.10 + Math.sin(time * 2.2 + idx * 0.4) * 0.008;
        }
      });

      // Drifting 3D Clouds in the background sky
      animatedClouds.forEach((cloud) => {
        cloud.position.x += delta * 0.8;
        if (cloud.position.x > centerX + 180) {
          cloud.position.x = centerX - 180;
        }
      });

      animatedLanterns.forEach((l, idx) => {
        l.intensity = 1.8 + Math.sin(time * 8 + idx * 2) * 0.4;
      });

      animatedSmokes.forEach((s, idx) => {
        s.position.y = 2.7 + ((time * 0.6 + idx * 0.5) % 0.8);
      });

      // Animate Windmills, Embers, Chimneys
      animatedBuildingUpdaters.forEach((fn) => fn(time));

      // Animate Human NPCs & Floating 3D Exclamation Marks (!)
      animatedNPCUpdaters.forEach((fn) => fn(time));

      // Drifting environmental particles (Ascending embers for volcano / Falling leaves for forest)
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

      // DYNAMIC X-RAY TRANSPARENCY: Fade forest trees that block the camera view of the player
      if (currentZone.id === 'zone_forest') {
        const playerGridX = Math.round(curr.x / 2.5);
        const playerGridY = Math.round(curr.z / 2.5);

        obstacleGroups.forEach(({ group, gridX, gridY }) => {
          const dx = gridX - playerGridX;
          const dy = gridY - playerGridY;

          const isBlockingPlayer = dx >= 0 && dx <= 2 && dy >= 0 && dy <= 2;
          const targetOpacity = isBlockingPlayer ? 0.35 : 1.0;

          group.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((m) => {
                  m.transparent = true;
                  m.opacity += (targetOpacity - m.opacity) * 0.25;
                });
              } else {
                child.material.transparent = true;
                child.material.opacity += (targetOpacity - child.material.opacity) * 0.25;
              }
            }
          });
        });
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

      // Project Player 3D Position -> 2D Screen HUD Position
      const vector = new THREE.Vector3(curr.x, 3.4, curr.z);
      vector.project(camera);

      const x2d = (vector.x * 0.5 + 0.5) * width;
      const y2d = (-(vector.y * 0.5) + 0.5) * height;

      setPlayerHudPos({
        x: x2d,
        y: y2d,
        visible: vector.z < 1,
      });
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

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('click', handleContainerClick);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [currentZone, player.heroClass, equipment, openedChests, defeatedBosses, isBossDefeated]);

  return (
    <div className="relative w-full h-full min-h-[500px] flex-1 select-none overflow-hidden bg-slate-950">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full min-h-[500px] cursor-pointer" />

      {/* OVERHEAD MOBA HEALTHBAR HUD (Projected from 3D to 2D) */}
      {playerHudPos.visible && (
        <div
          className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-75 z-20"
          style={{ left: `${playerHudPos.x}px`, top: `${playerHudPos.y}px` }}
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
      )}

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
 * Generates high-fidelity PBR ground textures (Diffuse + Real Sobel Normal Relief Map)
 */
function createProceduralGroundPBRTextures(zoneId: string): { diffuse: THREE.CanvasTexture; normal: THREE.CanvasTexture } {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  if (zoneId === 'zone_forest') {
    // Rich forest floor gradient base
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#15803d');
    grad.addColorStop(0.5, '#166534');
    grad.addColorStop(1, '#14532d');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Organic Soil/Dirt patches
    ctx.fillStyle = '#451a03';
    for (let i = 0; i < 18; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * 512,
        Math.random() * 512,
        25 + Math.random() * 45,
        0,
        Math.PI * 2
      );
      ctx.globalAlpha = 0.28;
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Grass noise speckles & moss patches
    for (let i = 0; i < 3500; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      const rVal = Math.random();
      ctx.fillStyle = rVal > 0.6 ? '#22c55e' : rVal > 0.3 ? '#16a34a' : '#15803d';
      ctx.fillRect(rx, ry, 3 + Math.random() * 4, 3 + Math.random() * 4);
    }

    // Autumn leaf litter (crimson, gold, orange specks)
    const leafColors = ['#dc2626', '#ea580c', '#eab308', '#b91c1c'];
    for (let i = 0; i < 450; i++) {
      ctx.fillStyle = leafColors[Math.floor(Math.random() * leafColors.length)];
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 3, 2);
    }

    // White/Pink clover flower dots
    ctx.fillStyle = '#fbcfe8';
    for (let i = 0; i < 180; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
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
  } else {
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 0, 512, 512);
  }

  const diffuse = new THREE.CanvasTexture(canvas);
  const normal = createNormalMapFromCanvas(canvas, 3.2);

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

  // Dark mortar grout
  ctx.fillStyle = '#450a0a';
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

      const grad = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
      grad.addColorStop(0, '#dc2626');
      grad.addColorStop(0.5, '#b91c1c');
      grad.addColorStop(1, '#881337');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, 8);
      ctx.fill();

      // Top Highlight
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(bx + 4, by + 2);
      ctx.lineTo(bx + bw - 4, by + 2);
      ctx.stroke();

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

  const normal = createNormalMapFromCanvas(canvas, 3.8);
  normal.wrapS = THREE.RepeatWrapping;
  normal.wrapT = THREE.RepeatWrapping;
  normal.repeat.set(1, 1);

  return { diffuse, normal };
}

// --- GLOBAL TEXTURE CACHING SYSTEM (ELIMINATES ZERO-DELAY MAP TRANSITIONS) ---
const globalTextureCache: Record<string, THREE.CanvasTexture> = {};
const globalGroundPBRCache: Record<string, { diffuse: THREE.CanvasTexture; normal: THREE.CanvasTexture }> = {};
let cachedPathPBR: { diffuse: THREE.CanvasTexture; normal: THREE.CanvasTexture } | null = null;
let cachedBarkTexture: THREE.CanvasTexture | null = null;
let cachedBirchTexture: THREE.CanvasTexture | null = null;

function getCachedBarkTexture(): THREE.CanvasTexture {
  if (!cachedBarkTexture) {
    cachedBarkTexture = createProceduralBarkTexture();
  }
  return cachedBarkTexture;
}

function getCachedLeafTexture(colorBase: string, colorHighlight: string): THREE.CanvasTexture {
  const key = `${colorBase}_${colorHighlight}`;
  if (!globalTextureCache[key]) {
    globalTextureCache[key] = createProceduralLeafTexture(colorBase, colorHighlight);
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
    cachedBirchTexture.wrapS = THREE.RepeatWrapping;
    cachedBirchTexture.wrapT = THREE.RepeatWrapping;
    cachedBirchTexture.repeat.set(1, 3);
  }
  return cachedBirchTexture;
}

function getCachedGroundPBR(zoneId: string) {
  if (!globalGroundPBRCache[zoneId]) {
    globalGroundPBRCache[zoneId] = createProceduralGroundPBRTextures(zoneId);
  }
  return globalGroundPBRCache[zoneId];
}

function getCachedPathPBR() {
  if (!cachedPathPBR) {
    cachedPathPBR = createProceduralPathPBRTextures();
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

// --- 3D GREEN HEDGE BUSH MESH FOR PATH BORDERS ---
function create3DHedgeMesh(posX: number, posZ: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(posX, 0, posZ);

  const hedgeMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
  const bush = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 0.9), hedgeMat);
  bush.position.y = 0.4;
  bush.castShadow = true;
  bush.receiveShadow = true;
  g.add(bush);

  // Top rounded leaves
  for (let i = -0.7; i <= 0.7; i += 0.7) {
    const topLeaf = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.45, 1),
      new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.5 })
    );
    topLeaf.position.set(i, 0.75, 0);
    topLeaf.castShadow = true;
    g.add(topLeaf);
  }

  // Pink flower accents along hedge
  const flowerMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.5 });
  for (let f = 0; f < 3; f++) {
    const fl = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), flowerMat);
    fl.position.set(-0.6 + f * 0.6, 0.8, 0.4);
    g.add(fl);
  }

  return g;
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
