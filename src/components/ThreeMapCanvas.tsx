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
    let height = Math.min(650, Math.max(480, Math.round(width * 0.6)));

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

    camera.position.set(centerX + 15, 22, centerZ + 15);
    camera.lookAt(centerX, 0, centerZ);

    // 2. RENDERER SETUP
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = currentZone.id === 'zone_cave' || currentZone.id === 'zone_volcano' || currentZone.id === 'zone_castle' ? 1.4 : 1.15;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Handle Resize dynamically
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      if (!newW) return;
      const newH = Math.min(650, Math.max(480, Math.round(newW * 0.6)));
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
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 250;
    const shadowD = 45;
    sunLight.shadow.camera.left = -shadowD;
    sunLight.shadow.camera.right = shadowD;
    sunLight.shadow.camera.top = shadowD;
    sunLight.shadow.camera.bottom = -shadowD;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // --- BACKGROUND MAP ENVIRONMENT: OCEAN, SUN, CLOUDS & COASTAL CLIFFS ---
    // 1. VAST OCEAN WATER PLANE WITH SUN SPECULAR REFLECTIONS
    const oceanGeo = new THREE.PlaneGeometry(1200, 1200, 64, 64);
    const oceanMat = new THREE.MeshPhysicalMaterial({
      color: currentZone.id === 'zone_volcano' ? 0x991b1b : 0x0284c7,
      emissive: currentZone.id === 'zone_volcano' ? 0x7f1d1d : 0x0369a1,
      emissiveIntensity: 0.25,
      roughness: 0.08,
      metalness: 0.4,
      transmission: 0.35,
      ior: 1.333,
      clearcoat: 1.0,
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
      new THREE.SphereGeometry(14, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xfff3c7 })
    );
    sunGroup.add(sunCore);

    const sunCoronaMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.35,
      side: THREE.BackSide,
    });
    const sunCorona = new THREE.Mesh(new THREE.SphereGeometry(24, 32, 32), sunCoronaMat);
    sunGroup.add(sunCorona);

    const sunCoronaOuter = new THREE.Mesh(
      new THREE.SphereGeometry(38, 32, 32),
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

    for (let c = 0; c < 14; c++) {
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

    // 4. COASTAL ROCK CLIFFS SURROUNDING THE ISLAND MAP
    const cliffMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    const islandMinX = -2;
    const islandMaxX = mapW + 2;
    const islandMinZ = -2;
    const islandMaxZ = mapH + 2;

    for (let i = -10; i <= mapW + 10; i += 5) {
      // North & South Coast Cliffs
      [islandMinZ - 1.5, islandMaxZ + 1.5].forEach((cz) => {
        const cliff = new THREE.Mesh(new THREE.DodecahedronGeometry(2.5 + Math.random() * 2, 1), cliffMat);
        cliff.position.set(i, 0.2, cz);
        cliff.scale.set(1.2, 0.6 + Math.random() * 0.8, 1.2);
        cliff.castShadow = true;
        cliff.receiveShadow = true;
        scene.add(cliff);
      });
    }

    for (let j = -10; j <= mapH + 10; j += 5) {
      // East & West Coast Cliffs
      [islandMinX - 1.5, islandMaxX + 1.5].forEach((cx) => {
        const cliff = new THREE.Mesh(new THREE.DodecahedronGeometry(2.5 + Math.random() * 2, 1), cliffMat);
        cliff.position.set(cx, 0.2, j);
        cliff.scale.set(1.2, 0.6 + Math.random() * 0.8, 1.2);
        cliff.castShadow = true;
        cliff.receiveShadow = true;
        scene.add(cliff);
      });
    }

    // 4. PROCEDURAL PBR CANVAS TEXTURES FOR GROUND & PATHS (With Sobel Normal Maps & Micro-Relief)
    const groundPBR = createProceduralGroundPBRTextures(currentZone.id);
    groundPBR.diffuse.wrapS = THREE.RepeatWrapping;
    groundPBR.diffuse.wrapT = THREE.RepeatWrapping;
    groundPBR.diffuse.repeat.set(currentZone.mapWidth * 0.8, currentZone.mapHeight * 0.8);
    groundPBR.normal.wrapS = THREE.RepeatWrapping;
    groundPBR.normal.wrapT = THREE.RepeatWrapping;
    groundPBR.normal.repeat.set(currentZone.mapWidth * 0.8, currentZone.mapHeight * 0.8);

    // 5. BUILD 3D TERRAIN TILES
    const tileGroup = new THREE.Group();
    scene.add(tileGroup);

    const tileGeo = new THREE.BoxGeometry(2.35, 0.4, 2.35);

    // Geometries & Materials reuse with True PBR Normal Map
    const pathPBR = createProceduralPathPBRTextures();
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

    // Populate Map Tiles
    for (let y = 0; y < currentZone.mapHeight; y++) {
      for (let x = 0; x < currentZone.mapWidth; x++) {
        const tileType = currentZone.tileData[y]?.[x] ?? 0;
        const posX = x * 2.5;
        const posZ = y * 2.5;

        // Micro-elevation height variation for natural organic terrain
        const elevation = (Math.sin(x * 1.3 + y * 1.7) * 0.05) + (Math.cos(x * 0.8 - y * 1.2) * 0.04);

        // Ground Tile Mesh with True PBR Physical Shader
        const groundMat = new THREE.MeshStandardMaterial({
          map: groundPBR.diffuse,
          normalMap: groundPBR.normal,
          normalScale: new THREE.Vector2(1.4, 1.4),
          roughness: currentZone.id === 'zone_castle' ? 0.45 : currentZone.id === 'zone_cave' ? 0.6 : 0.85,
          metalness: currentZone.id === 'zone_castle' ? 0.15 : currentZone.id === 'zone_cave' ? 0.18 : 0.05,
        });

        const tileMesh = new THREE.Mesh(tileGeo, groundMat);
        tileMesh.position.set(posX, -0.2 + elevation, posZ);
        tileMesh.receiveShadow = true;
        tileGroup.add(tileMesh);

        // CONTINUOUS SEAMLESS PATH (Blended Connection Overlays & Rounded Corner Fillets)
        if (tileType === 2) {
          const hasNorth = currentZone.tileData[y - 1]?.[x] === 2;
          const hasSouth = currentZone.tileData[y + 1]?.[x] === 2;
          const hasEast = currentZone.tileData[y]?.[x + 1] === 2;
          const hasWest = currentZone.tileData[y]?.[x - 1] === 2;

          // Main Base Path Mesh spanning full cell width seamlessly
          const pathMainGeo = new THREE.BoxGeometry(2.52, 0.42, 2.52);
          const pathMesh = new THREE.Mesh(pathMainGeo, pathMat);
          pathMesh.position.set(posX, -0.19 + elevation, posZ);
          pathMesh.receiveShadow = true;
          tileGroup.add(pathMesh);

          // Directional Overlap Connectors bridging seamlessly into connected path neighbor tiles
          if (hasNorth) {
            const bridgeN = new THREE.Mesh(new THREE.BoxGeometry(2.52, 0.42, 0.4), pathMat);
            bridgeN.position.set(posX, -0.19 + elevation, posZ - 1.28);
            bridgeN.receiveShadow = true;
            tileGroup.add(bridgeN);
          }
          if (hasSouth) {
            const bridgeS = new THREE.Mesh(new THREE.BoxGeometry(2.52, 0.42, 0.4), pathMat);
            bridgeS.position.set(posX, -0.19 + elevation, posZ + 1.28);
            bridgeS.receiveShadow = true;
            tileGroup.add(bridgeS);
          }
          if (hasEast) {
            const bridgeE = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.42, 2.52), pathMat);
            bridgeE.position.set(posX + 1.28, -0.19 + elevation, posZ);
            bridgeE.receiveShadow = true;
            tileGroup.add(bridgeE);
          }
          if (hasWest) {
            const bridgeW = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.42, 2.52), pathMat);
            bridgeW.position.set(posX - 1.28, -0.19 + elevation, posZ);
            bridgeW.receiveShadow = true;
            tileGroup.add(bridgeW);
          }

          // Curved Rounded Fillets on Turn Corners
          if (hasNorth && hasEast) {
            const filletNE = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.42, 12), pathMat);
            filletNE.position.set(posX + 1.0, -0.19 + elevation, posZ - 1.0);
            tileGroup.add(filletNE);
          }
          if (hasNorth && hasWest) {
            const filletNW = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.42, 12), pathMat);
            filletNW.position.set(posX - 1.0, -0.19 + elevation, posZ - 1.0);
            tileGroup.add(filletNW);
          }
          if (hasSouth && hasEast) {
            const filletSE = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.42, 12), pathMat);
            filletSE.position.set(posX + 1.0, -0.19 + elevation, posZ + 1.0);
            tileGroup.add(filletSE);
          }
          if (hasSouth && hasWest) {
            const filletSW = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.42, 12), pathMat);
            filletSW.position.set(posX - 1.0, -0.19 + elevation, posZ + 1.0);
            tileGroup.add(filletSW);
          }

          // Natural Soil/Dirt Border Edge Strips along non-path borders
          if (!hasWest) {
            const edgeW = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.41, 2.52), pathBorderMat);
            edgeW.position.set(posX - 1.28, -0.18 + elevation, posZ);
            tileGroup.add(edgeW);
          }
          if (!hasEast) {
            const edgeE = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.41, 2.52), pathBorderMat);
            edgeE.position.set(posX + 1.28, -0.18 + elevation, posZ);
            tileGroup.add(edgeE);
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
              // 3D Fantasy Tree GLTF Model
              const treeContainer = new THREE.Group();
              treeContainer.position.set(posX, elevation, posZ);

              const rotY = ((seed * 73) % 360) * (Math.PI / 180);
              const scaleVar = 0.44 + (seed % 5) * 0.02;

              const fallbackTree = create3DRichTreeMesh(0, 0, currentZone.id, x, y);
              treeContainer.add(fallbackTree);

              loadFantasyTreeGLTF((treeModel) => {
                fallbackTree.visible = false;
                const clone = treeModel.clone();
                clone.scale.set(scaleVar, scaleVar, scaleVar);
                clone.rotation.y = rotY;
                treeContainer.add(clone);
              });

              obsGroup = treeContainer;
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
              emissiveIntensity: 0.5,
              roughness: 0.1,
              metalness: 0.2,
              transmission: 0.5,
              ior: 1.333,
              clearcoat: 1.0,
              clearcoatRoughness: 0.1,
            });
            const liquidMesh = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.38, 2.35), liquidMat);
            liquidMesh.position.set(posX, -0.21 + elevation, posZ);
            tileGroup.add(liquidMesh);
            animatedWaters.push(liquidMesh);

            // Riverbed pebbles visible under clear water
            if (currentZone.id === 'zone_forest' && (x + y) % 2 === 0) {
              const riverPebble = new THREE.Mesh(
                new THREE.DodecahedronGeometry(0.2, 1),
                new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 })
              );
              riverPebble.position.set(posX + 0.3, -0.35 + elevation, posZ - 0.2);
              tileGroup.add(riverPebble);
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

        // Boss Portal
        if (tileType === 6) {
          const portalGroup = create3DBossPortalMesh(posX, posZ, isBossDefeated, isBossPortalUnlocked);
          portalGroup.position.y += elevation;
          tileGroup.add(portalGroup);
        }

        // Chest
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

        // Windmill / Fountain (Tile 9)
        if (tileType === 9) {
          if (currentZone.id === 'zone_forest') {
            const windmillRes = createLowPolyWindmill();
            const windmillGroup = windmillRes.group;
            windmillGroup.position.set(posX, elevation, posZ);
            tileGroup.add(windmillGroup);
            obstacleGroups.push({ group: windmillGroup, gridX: x, gridY: y });
            if (windmillRes.updateAnimation) animatedBuildingUpdaters.push(windmillRes.updateAnimation);
          } else {
            const fountainId = `${currentZone.id}_${x}_${y}`;
            const isActivated = openedChests.includes(fountainId);
            const fountainGroup = create3DFountainMesh(posX, posZ, isActivated);
            fountainGroup.position.y += elevation;
            tileGroup.add(fountainGroup);
          }
        }

        // Village Water Well / Town Square (Tile 10)
        if (tileType === 10) {
          const wellRes = createLowPolyWaterWell();
          const wellGroup = wellRes.group;
          wellGroup.position.set(posX, elevation, posZ);
          tileGroup.add(wellGroup);
          obstacleGroups.push({ group: wellGroup, gridX: x, gridY: y });
        }

        // Blacksmith Forge (Tile 11)
        if (tileType === 11) {
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

      if (model.userData?.animations && model.userData.animations.length > 0) {
        mapMixer = new THREE.AnimationMixer(glbClone);
        const action = model.userData.animations[0];
        mapMixer.clipAction(action).play();
      }

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
    const particleCount = 120;
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

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      // Smoothly move hero position with spring-damper interpolation
      const curr = playerCurrentPosRef.current;
      const targ = playerTargetPosRef.current;

      const prevX = curr.x;
      const prevZ = curr.z;

      curr.x += (targ.x - curr.x) * 0.18;
      curr.z += (targ.z - curr.z) * 0.18;

      // Realistic Kinematics & Velocity vector
      const velX = (curr.x - prevX) / Math.max(delta, 0.001);
      const velZ = (curr.z - prevZ) / Math.max(delta, 0.001);
      const speed = Math.hypot(velX, velZ);
      const isMoving = speed > 0.15;

      // Hero Character Rotation based on Facing Direction
      let targetRotY = Math.PI; // default facing up (away down the path into screen)
      if (facingDirRef.current === 'up') targetRotY = Math.PI;
      if (facingDirRef.current === 'down') targetRotY = 0;
      if (facingDirRef.current === 'left') targetRotY = -Math.PI / 2;
      if (facingDirRef.current === 'right') targetRotY = Math.PI / 2;

      let rotDiff = targetRotY - heroGroup.rotation.y;
      while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
      while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
      heroGroup.rotation.y += rotDiff * 0.22;

      // 🌟 PHYSICAL INERTIA & BANKING: Lean hero into corners and turns
      const targetBankZ = THREE.MathUtils.clamp(-velX * 0.045, -0.22, 0.22);
      const targetBankX = THREE.MathUtils.clamp(velZ * 0.045, -0.22, 0.22);
      heroGroup.rotation.z = THREE.MathUtils.lerp(heroGroup.rotation.z, targetBankZ, 0.18);
      heroGroup.rotation.x = THREE.MathUtils.lerp(heroGroup.rotation.x, targetBankX, 0.18);

      // 🌟 STEP WEIGHT SPRING BOUNCE: Footstep ground compression
      const stepBounce = isMoving ? Math.abs(Math.sin(time * 13)) * 0.05 : Math.sin(time * 2.8) * 0.015;
      heroGroup.position.set(curr.x, -stepBounce, curr.z);

      // Físicas del Modelo 3D (Mixer esqueletal o Animación Procedural Viva)
      if (mapMixer) {
        mapMixer.update(delta);
      } else {
        if (isMoving) {
          const stepBounce = Math.abs(Math.sin(time * 13)) * 0.055;
          const walkSwayZ = Math.sin(time * 6.5) * 0.05;
          const forwardLean = 0.06;

          blenderHeroContainer.position.y = stepBounce;
          blenderHeroContainer.rotation.z = walkSwayZ;
          blenderHeroContainer.rotation.x = forwardLean;
        } else {
          const breathY = Math.sin(time * 2.8) * 0.02;
          const breathSway = Math.sin(time * 1.4) * 0.015;

          blenderHeroContainer.position.y = breathY;
          blenderHeroContainer.rotation.z = breathSway;
          blenderHeroContainer.rotation.x = Math.sin(time * 2.8) * 0.008;
        }
      }

      // Human Character Walking & Dynamic Skeletal Physics
      if (isMoving) {
        heroMeshResult.leftLeg.rotation.x = Math.sin(time * 13) * 0.48;
        heroMeshResult.rightLeg.rotation.x = -Math.sin(time * 13) * 0.48;
        heroMeshResult.leftArm.rotation.x = -Math.sin(time * 13) * 0.38;
        heroMeshResult.rightArm.rotation.x = Math.sin(time * 13) * 0.38;
        heroMeshResult.torsoGroup.position.y = 0.70 + Math.abs(Math.sin(time * 13)) * 0.04;
        heroMeshResult.headGroup.position.y = 1.15 + Math.abs(Math.sin(time * 13)) * 0.04;
        
        // 🌟 VERLET CLOTH & HAIR LAG: Cape / Headband sways against movement direction
        if (heroMeshResult.headbandTail) {
          heroMeshResult.headbandTail.rotation.z = -0.3 + Math.sin(time * 13) * 0.28;
          heroMeshResult.headbandTail.rotation.x = THREE.MathUtils.lerp(heroMeshResult.headbandTail.rotation.x, 0.45, 0.2);
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
        heroMeshResult.leftLeg.rotation.x = 0;
        heroMeshResult.rightLeg.rotation.x = 0;
        heroMeshResult.leftArm.rotation.x = 0;
        heroMeshResult.rightArm.rotation.x = 0;
        heroMeshResult.torsoGroup.position.y = 0.70 + Math.sin(time * 3) * 0.015;
        heroMeshResult.headGroup.position.y = 1.15 + Math.sin(time * 3) * 0.02;
        if (heroMeshResult.headbandTail) {
          heroMeshResult.headbandTail.rotation.z = -0.3 + Math.sin(time * 4) * 0.1;
          heroMeshResult.headbandTail.rotation.x = THREE.MathUtils.lerp(heroMeshResult.headbandTail.rotation.x, 0, 0.1);
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
          w.position.y = -0.21 + Math.sin(time * 2.8 + idx * 0.4) * 0.03;
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

      // Smooth camera follow target hero position (Isometric Overhead ARPG Angle)
      const camTargetX = curr.x + 15;
      const camTargetZ = curr.z + 15;
      camera.position.x += (camTargetX - camera.position.x) * 0.12;
      camera.position.z += (camTargetZ - camera.position.z) * 0.12;
      camera.position.y = 22;
      camera.lookAt(curr.x, 0, curr.z);

      // Keep sunlight positioned relative to player for crisp dynamic shadows
      sunLight.position.set(curr.x + 15, 35, curr.z - 10);

      // Animate floating particles
      const positions = particleSystem.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i + 1] -= delta * 1.5;
        positions[i] += Math.sin(time + i) * 0.02;
        if (positions[i + 1] < 0) {
          positions[i + 1] = 8;
        }
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

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
    <div className="relative flex justify-center items-center w-full my-1 select-none overflow-hidden rounded-xl border-2 border-amber-900/60 shadow-[0_0_30px_rgba(0,0,0,0.9)] bg-slate-950">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-[520px] sm:h-[580px] cursor-pointer" />

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

      {/* TOP MOBA BOSS STATUS HUD */}
      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-slate-950/90 border-2 border-amber-600/80 px-4 py-1.5 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.8)] z-10 flex flex-col items-center">
        <div className="text-xs font-black text-amber-400 tracking-wider flex items-center gap-1.5">
          <span>{isBossDefeated ? '✨' : '💀'}</span>
          <span>{currentZone.boss.name}</span>
          <span className="text-[10px] text-slate-400">({currentZone.name})</span>
        </div>
        <div className="w-48 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-700 mt-1">
          <div
            className={`h-full transition-all duration-300 ${isBossDefeated ? 'bg-purple-500 w-0' : 'bg-red-600 w-full animate-pulse'}`}
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

// --- PROCEDURAL BARK TEXTURE FOR REALISTIC TREE TRUNKS ---
function createProceduralBarkTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#3b1c08';
  ctx.fillRect(0, 0, 512, 512);

  // Vertical wood grain & bark fissures
  for (let x = 0; x < 512; x += 4) {
    const darkness = Math.random() * 0.4;
    ctx.fillStyle = `rgba(15, 7, 2, ${darkness})`;
    ctx.fillRect(x, 0, 2 + Math.random() * 3, 512);
  }

  // Organic bark knots & moss specks
  for (let i = 0; i < 120; i++) {
    const kx = Math.random() * 512;
    const ky = Math.random() * 512;
    ctx.fillStyle = Math.random() > 0.4 ? '#211005' : '#15803d';
    ctx.beginPath();
    ctx.ellipse(kx, ky, 6 + Math.random() * 12, 2 + Math.random() * 4, Math.PI / 2, 0, Math.PI * 2);
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

  const barkTexture = createProceduralBarkTexture();
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
      const leafTexMain = createProceduralLeafTexture('#15803d', '#4ade80');
      const leafTexAlt = createProceduralLeafTexture('#166534', '#a3e635');
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

      const pineLeafTex = createProceduralLeafTexture('#14532d', '#22c55e');
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
      const birchTex = new THREE.CanvasTexture(birchCanvas);
      birchTex.wrapS = THREE.RepeatWrapping;
      birchTex.wrapT = THREE.RepeatWrapping;
      birchTex.repeat.set(1, 3);

      const birchTrunkMat = new THREE.MeshStandardMaterial({ map: birchTex, roughness: 0.7 });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.28, 4.5, 10), birchTrunkMat);
      trunk.position.y = 2.25;
      trunk.castShadow = true;
      g.add(trunk);

      const birchLeafTex = createProceduralLeafTexture('#65a30d', '#a3e635');
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

      const autumnRedTex = createProceduralLeafTexture('#dc2626', '#fca5a5');
      const autumnGoldTex = createProceduralLeafTexture('#d97706', '#fef08a');

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

  // Warm Lantern Light
  const houseLight = new THREE.PointLight(0xfba107, 1.5, 4);
  houseLight.position.set(0.3, 1.2, 0.9);
  g.add(houseLight);

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
      emissiveIntensity: 1.8,
    })
  );
  lantern.position.set(0.3, 1.5, 0);
  g.add(lantern);

  const light = new THREE.PointLight(0xfab107, 2.0, 5);
  light.position.set(0.3, 1.5, 0);
  g.add(light);

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
