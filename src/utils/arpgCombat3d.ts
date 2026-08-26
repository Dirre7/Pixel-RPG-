import * as THREE from 'three';
import { OverworldEnemy, OverworldEnemyType } from '../types';

/**
 * Creates a distinct stylized 3D mesh model for overworld enemies with animated parts & healthbar
 */
export function createEnemy3DMesh(enemy: OverworldEnemy): {
  group: THREE.Group;
  healthBarMesh: THREE.Mesh;
  animator?: (time: number, isMoving: boolean) => void;
} {
  const group = new THREE.Group();
  const scale = enemy.scale || 1.0;

  // Overhead Mini Healthbar Container
  const barWidth = 1.2 * Math.max(1, scale * 0.8);
  const barHeight = 0.12;
  const barY = 1.8 * scale;

  const bgGeo = new THREE.PlaneGeometry(barWidth, barHeight);
  const bgMat = new THREE.MeshBasicMaterial({ color: 0x1e293b, side: THREE.DoubleSide });
  const barBg = new THREE.Mesh(bgGeo, bgMat);
  barBg.position.set(0, barY, 0);
  group.add(barBg);

  const fillGeo = new THREE.PlaneGeometry(barWidth * 0.96, barHeight * 0.8);
  const fillMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide });
  const healthBarMesh = new THREE.Mesh(fillGeo, fillMat);
  healthBarMesh.position.set(0, barY, 0.01);
  group.add(healthBarMesh);

  // Soft Ground Shadow
  const shadowGeo = new THREE.CircleGeometry(0.65 * scale, 16);
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  let animator: ((time: number, isMoving: boolean) => void) | undefined;

  // --- 1. SLIME (Jelly bouncy creature with cute eyes) ---
  if (enemy.enemyType === 'slime') {
    const bodyGeo = new THREE.SphereGeometry(0.65 * scale, 16, 12);
    bodyGeo.scale(1, 0.75, 1);
    const bodyMat = new THREE.MeshLambertMaterial({
      color: new THREE.Color(enemy.color || 0x22c55e),
      transparent: true,
      opacity: 0.9,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.5 * scale;
    group.add(body);

    // Cute Black Eyes
    const eyeGeo = new THREE.SphereGeometry(0.08 * scale, 8, 8);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.2 * scale, 0.55 * scale, 0.52 * scale);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.2 * scale, 0.55 * scale, 0.52 * scale);
    group.add(eyeL, eyeR);

    animator = (time: number, isMoving: boolean) => {
      const bounce = Math.abs(Math.sin(time * (isMoving ? 10 : 4)));
      body.scale.set(1.0 + bounce * 0.2, 0.85 - bounce * 0.2, 1.0 + bounce * 0.2);
      body.position.y = (0.45 + bounce * 0.3) * scale;
    };
  }
  // --- 2. WOLF / BEAST (Quadruped predator) ---
  else if (enemy.enemyType === 'wolf') {
    const furMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(enemy.color || 0x64748b) });
    const bellyMat = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7 * scale, 0.6 * scale, 1.2 * scale), furMat);
    torso.position.y = 0.65 * scale;
    group.add(torso);

    // Head & Snout
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5 * scale, 0.45 * scale, 0.6 * scale), furMat);
    head.position.set(0, 0.95 * scale, 0.65 * scale);
    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.3 * scale, 0.25 * scale, 0.35 * scale), bellyMat);
    snout.position.set(0, 0.85 * scale, 0.95 * scale);
    group.add(head, snout);

    // Pointed Ears
    const earGeo = new THREE.ConeGeometry(0.12 * scale, 0.25 * scale, 4);
    const earL = new THREE.Mesh(earGeo, furMat);
    earL.position.set(-0.18 * scale, 1.25 * scale, 0.6 * scale);
    const earR = new THREE.Mesh(earGeo, furMat);
    earR.position.set(0.18 * scale, 1.25 * scale, 0.6 * scale);
    group.add(earL, earR);

    // 4 Legs
    const legGeo = new THREE.BoxGeometry(0.18 * scale, 0.55 * scale, 0.18 * scale);
    const legs = [
      new THREE.Mesh(legGeo, furMat),
      new THREE.Mesh(legGeo, furMat),
      new THREE.Mesh(legGeo, furMat),
      new THREE.Mesh(legGeo, furMat),
    ];
    legs[0].position.set(-0.25 * scale, 0.28 * scale, 0.4 * scale);
    legs[1].position.set(0.25 * scale, 0.28 * scale, 0.4 * scale);
    legs[2].position.set(-0.25 * scale, 0.28 * scale, -0.4 * scale);
    legs[3].position.set(0.25 * scale, 0.28 * scale, -0.4 * scale);
    group.add(...legs);

    animator = (time: number, isMoving: boolean) => {
      if (isMoving) {
        const swing = Math.sin(time * 12) * 0.4;
        legs[0].rotation.x = swing;
        legs[1].rotation.x = -swing;
        legs[2].rotation.x = -swing;
        legs[3].rotation.x = swing;
      } else {
        legs.forEach((l) => (l.rotation.x = 0));
      }
    };
  }
  // --- 3. SKELETON / UNDEAD (Bone warrior with sword) ---
  else if (enemy.enemyType === 'skeleton') {
    const boneMat = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

    // Skull
    const skull = new THREE.Mesh(new THREE.BoxGeometry(0.45 * scale, 0.45 * scale, 0.45 * scale), boneMat);
    skull.position.set(0, 1.45 * scale, 0);
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.06 * scale, 6, 6), eyeMat);
    eyeL.position.set(-0.12 * scale, 1.48 * scale, 0.24 * scale);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.06 * scale, 6, 6), eyeMat);
    eyeR.position.set(0.12 * scale, 1.48 * scale, 0.24 * scale);
    group.add(skull, eyeL, eyeR);

    // Ribcage & Spine
    const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.08 * scale, 0.08 * scale, 0.7 * scale, 6), boneMat);
    spine.position.set(0, 0.9 * scale, 0);
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.5 * scale, 0.35 * scale, 0.3 * scale), boneMat);
    rib.position.set(0, 1.05 * scale, 0);
    group.add(spine, rib);

    // Rusty Sword
    const swordMat = new THREE.MeshLambertMaterial({ color: 0x78716c });
    const sword = new THREE.Mesh(new THREE.BoxGeometry(0.1 * scale, 0.85 * scale, 0.15 * scale), swordMat);
    sword.position.set(0.35 * scale, 0.8 * scale, 0.3 * scale);
    sword.rotation.x = Math.PI / 4;
    group.add(sword);

    animator = (time: number) => {
      skull.rotation.y = Math.sin(time * 3) * 0.15;
      sword.rotation.z = Math.sin(time * 4) * 0.1;
    };
  }
  // --- 4. ELEMENTAL / MAGMA / GHOST (Floating glowing entity) ---
  else if (enemy.enemyType === 'elemental') {
    const glowMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(enemy.color || 0xf97316) });
    const core = new THREE.Mesh(new THREE.DodecahedronGeometry(0.65 * scale), glowMat);
    core.position.y = 0.9 * scale;
    group.add(core);

    // Orbiting flame shards
    const shards: THREE.Mesh[] = [];
    const shardGeo = new THREE.ConeGeometry(0.15 * scale, 0.4 * scale, 4);
    for (let i = 0; i < 4; i++) {
      const shard = new THREE.Mesh(shardGeo, glowMat);
      shards.push(shard);
      group.add(shard);
    }

    animator = (time: number) => {
      core.rotation.y = time * 2;
      core.rotation.x = time * 1.5;
      shards.forEach((s, idx) => {
        const ang = time * 3 + (idx * Math.PI) / 2;
        s.position.set(Math.cos(ang) * 0.9 * scale, 0.9 * scale + Math.sin(time * 4 + idx) * 0.2, Math.sin(ang) * 0.9 * scale);
        s.rotation.y = -ang;
      });
    };
  }
  // --- 5. GOLEM / TITAN (Heavy blocky behemoth) ---
  else if (enemy.enemyType === 'golem') {
    const stoneMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(enemy.color || 0x475569) });
    const crystalMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    // Chunky Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.2 * scale, 1.0 * scale, 0.8 * scale), stoneMat);
    torso.position.y = 1.0 * scale;
    const crystalHeart = new THREE.Mesh(new THREE.OctahedronGeometry(0.25 * scale), crystalMat);
    crystalHeart.position.set(0, 1.0 * scale, 0.42 * scale);
    group.add(torso, crystalHeart);

    // Massive Stone Fists
    const fistGeo = new THREE.BoxGeometry(0.45 * scale, 0.6 * scale, 0.45 * scale);
    const fistL = new THREE.Mesh(fistGeo, stoneMat);
    fistL.position.set(-0.85 * scale, 0.75 * scale, 0.1 * scale);
    const fistR = new THREE.Mesh(fistGeo, stoneMat);
    fistR.position.set(0.85 * scale, 0.75 * scale, 0.1 * scale);
    group.add(fistL, fistR);

    animator = (time: number) => {
      fistL.position.y = (0.75 + Math.sin(time * 3) * 0.15) * scale;
      fistR.position.y = (0.75 + Math.sin(time * 3 + Math.PI) * 0.15) * scale;
    };
  }
  // --- 6. DRAGON / BOSS (Winged majestic beast) ---
  else if (enemy.enemyType === 'dragon' || enemy.isBoss) {
    const dragonMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(enemy.color || 0xb91c1c) });
    const hornMat = new THREE.MeshLambertMaterial({ color: 0xf59e0b });

    // Dragon Body
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.9 * scale, 2.0 * scale, 6), dragonMat);
    body.rotation.x = Math.PI / 2.3;
    body.position.set(0, 1.1 * scale, -0.2 * scale);
    group.add(body);

    // Dragon Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.7 * scale, 0.5 * scale, 1.0 * scale), dragonMat);
    head.position.set(0, 1.6 * scale, 0.9 * scale);
    const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.12 * scale, 0.6 * scale, 4), hornMat);
    hornL.position.set(-0.25 * scale, 2.0 * scale, 0.6 * scale);
    hornL.rotation.x = -0.4;
    const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.12 * scale, 0.6 * scale, 4), hornMat);
    hornR.position.set(0.25 * scale, 2.0 * scale, 0.6 * scale);
    hornR.rotation.x = -0.4;
    group.add(head, hornL, hornR);

    // Dragon Wings
    const wingGeo = new THREE.BoxGeometry(1.6 * scale, 0.08 * scale, 0.8 * scale);
    const wingL = new THREE.Mesh(wingGeo, dragonMat);
    wingL.position.set(-1.0 * scale, 1.5 * scale, 0);
    const wingR = new THREE.Mesh(wingGeo, dragonMat);
    wingR.position.set(1.0 * scale, 1.5 * scale, 0);
    group.add(wingL, wingR);

    animator = (time: number) => {
      const flap = Math.sin(time * 6) * 0.35;
      wingL.rotation.z = -flap;
      wingR.rotation.z = flap;
      head.position.y = (1.6 + Math.sin(time * 3) * 0.1) * scale;
    };
  }
  // --- 7. DEFAULT HUMANOID (Goblin, Bandit, Knight) ---
  else {
    const skinMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(enemy.color || 0x3b82f6) });
    const clothMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.6 * scale, 0.7 * scale, 0.35 * scale), clothMat);
    torso.position.y = 0.85 * scale;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.28 * scale, 10, 10), skinMat);
    head.position.set(0, 1.35 * scale, 0);
    group.add(torso, head);

    const weaponMat = new THREE.MeshLambertMaterial({ color: 0x94a3b8 });
    const weapon = new THREE.Mesh(new THREE.BoxGeometry(0.1 * scale, 0.7 * scale, 0.1 * scale), weaponMat);
    weapon.position.set(0.45 * scale, 0.85 * scale, 0.25 * scale);
    weapon.rotation.x = Math.PI / 4;
    group.add(weapon);

    animator = (time: number) => {
      weapon.rotation.z = Math.sin(time * 4) * 0.15;
    };
  }

  return { group, healthBarMesh, animator };
}

/**
 * Creates 3D Combat Visual Effects (Sword slashes, fireballs, arcane projectiles)
 */
export function createCombatVfxMesh(type: string, colorHex: number = 0xf59e0b): THREE.Group {
  const g = new THREE.Group();

  if (type === 'slash_wave') {
    const arcGeo = new THREE.TorusGeometry(1.6, 0.12, 8, 24, Math.PI * 0.8);
    const arcMat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.9 });
    const arc = new THREE.Mesh(arcGeo, arcMat);
    arc.rotation.x = Math.PI / 2;
    g.add(arc);
  } else if (type === 'fireball') {
    const ballGeo = new THREE.SphereGeometry(0.4, 12, 12);
    const ballMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
    const core = new THREE.Mesh(ballGeo, ballMat);
    g.add(core);

    const light = new THREE.PointLight(0xf97316, 1.5, 4);
    g.add(light);
  } else if (type === 'multi_arrow' || type === 'arrow') {
    const arrowGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 6);
    const arrowMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });
    const arrow = new THREE.Mesh(arrowGeo, arrowMat);
    arrow.rotation.x = Math.PI / 2;
    g.add(arrow);
  } else {
    // Arcane orb / holy bolt
    const orbGeo = new THREE.SphereGeometry(0.35, 10, 10);
    const orbMat = new THREE.MeshBasicMaterial({ color: colorHex });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    g.add(orb);
  }

  return g;
}

/**
 * Creates a floating 3D magnetic ground loot orb (Gold, EXP, Item)
 */
export function createGroundDrop3DMesh(type: 'gold' | 'exp' | 'item' | 'health_orb', colorHex: string): THREE.Group {
  const g = new THREE.Group();

  if (type === 'gold') {
    const coinGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.08, 12);
    const coinMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const coin = new THREE.Mesh(coinGeo, coinMat);
    coin.rotation.x = Math.PI / 3;
    g.add(coin);
  } else if (type === 'exp') {
    const diamondGeo = new THREE.OctahedronGeometry(0.28);
    const diamondMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const diamond = new THREE.Mesh(diamondGeo, diamondMat);
    g.add(diamond);
  } else if (type === 'health_orb') {
    const orbGeo = new THREE.SphereGeometry(0.28, 10, 10);
    const orbMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    g.add(orb);
  } else {
    // Item bag / loot pouch
    const bagGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
    const bagMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
    const bag = new THREE.Mesh(bagGeo, bagMat);
    g.add(bag);
  }

  // Ground glow ring
  const ringGeo = new THREE.RingGeometry(0.2, 0.45, 16);
  const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(colorHex), side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -0.15;
  g.add(ring);

  return g;
}

/**
 * Generates a 2D canvas sprite for crisp floating damage numbers (-120, CRÍTICO, etc.)
 */
export function createDamageTextSprite(text: string, color: string = '#fde047', isCrit: boolean = false): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext('2d')!;

  ctx.font = isCrit ? 'bold 44px sans-serif' : 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Deep shadow outline
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = isCrit ? 8 : 6;
  ctx.strokeText(text, 128, 48);

  ctx.fillStyle = color;
  ctx.fillText(text, 128, 48);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;

  const mat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });

  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(isCrit ? 2.8 : 2.0, isCrit ? 1.05 : 0.75, 1);
  return sprite;
}
