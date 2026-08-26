import React, { useState, useEffect } from 'react';
import { PlayerStats, Inventory, Enemy, Skill, ConsumableItem, EquipmentItem } from '../types';
import { ALL_SKILLS, getRandomEncounterDrop, getBossLegendaryDrop } from '../data/gameData';
import { PixelCanvas } from './PixelCanvas';
import { PixelBattleCanvas } from './PixelBattleCanvas';
import { ThreeBattleCanvas } from './ThreeBattleCanvas';
import { soundEngine } from '../utils/soundEngine';
import { useGamepadControls, ControllerAction } from '../utils/gamepadManager';
import {
  Swords,
  Sparkles,
  Package,
  ShieldAlert,
  Footprints,
  Heart,
  Zap,
  Award,
  ArrowRight,
  Flame,
  Shield,
  Skull,
  Gift
} from 'lucide-react';

interface BattleScreenProps {
  player: PlayerStats;
  inventory: Inventory;
  enemy: Enemy;
  unlockedSkillIds: string[];
  onBattleEnd: (result: {
    won: boolean;
    expEarned: number;
    goldEarned: number;
    updatedPlayer: PlayerStats;
    updatedInventory: Inventory;
    newlyUnlockedSkills: Skill[];
  }) => void;
}

interface FloatingText {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({
  player: initialPlayer,
  inventory: initialInventory,
  enemy: initialEnemy,
  unlockedSkillIds,
  onBattleEnd,
}) => {
  const safeMaxHp = initialEnemy.maxHp || initialEnemy.hp || 50;
  const safeHp = typeof initialEnemy.hp === 'number' && !isNaN(initialEnemy.hp) && initialEnemy.hp > 0
    ? initialEnemy.hp
    : safeMaxHp;

  const [player, setPlayer] = useState<PlayerStats>({ ...initialPlayer });
  const [enemy, setEnemy] = useState<Enemy>({
    ...initialEnemy,
    maxHp: safeMaxHp,
    hp: safeHp,
  });
  const [inventory, setInventory] = useState<Inventory>({ ...initialInventory });

  const [turn, setTurn] = useState<'player' | 'enemy' | 'animating'>('player');
  const [activeMenu, setActiveMenu] = useState<'main' | 'skills' | 'items'>('main');
  const [combatLogs, setCombatLogs] = useState<string[]>([]);

  // Animation states
  const [enemyIsHit, setEnemyIsHit] = useState(false);
  const [playerIsHit, setPlayerIsHit] = useState(false);
  const [enemyIsAttacking, setEnemyIsAttacking] = useState(false);
  const [playerIsAttacking, setPlayerIsAttacking] = useState(false);

  const [activeEffect, setActiveEffect] = useState<
    'physical' | 'fire' | 'ice' | 'thunder' | 'holy' | 'shadow' | 'heal' | null
  >(null);

  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [isDefending, setIsDefending] = useState(false);
  const [atkBuff, setAtkBuff] = useState(1);
  const [defBuff, setDefBuff] = useState(1);

  // Victory / Defeat modals & Loot
  const [battleState, setBattleState] = useState<'in_progress' | 'victory' | 'defeat'>('in_progress');
  const [battleLoot, setBattleLoot] = useState<{ consumable?: ConsumableItem; equipment?: EquipmentItem } | null>(null);
  const [levelUpInfo, setLevelUpInfo] = useState<{
    leveledUp: boolean;
    oldLevel: number;
    newLevel: number;
    newSkills: Skill[];
  } | null>(null);

  // Play battle / boss BGM
  useEffect(() => {
    if (enemy.isBoss) {
      soundEngine.playMusic('boss_battle');
    } else {
      soundEngine.playMusic('battle');
    }
  }, [enemy.isBoss]);

  const addLog = (msg: string) => {
    setCombatLogs((prev) => [msg, ...prev.slice(0, 7)]);
  };

  const spawnFloatingText = (text: string, color: string, x: number = 50, y: number = 40) => {
    const id = 'ft-' + Date.now() + '-' + Math.random();
    setFloatingTexts((prev) => [...prev, { id, text, color, x, y }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((ft) => ft.id !== id));
    }, 1200);
  };

  // Get available skills for hero
  const availableSkills = ALL_SKILLS.filter(
    (s) =>
      (s.heroClass === player.heroClass || s.heroClass === 'all') &&
      s.minLevel <= player.level
  );

  // --- PLAYER ACTIONS ---

  // 1. Basic Physical Attack
  const handlePlayerAttack = () => {
    if (turn !== 'player' || battleState !== 'in_progress') return;

    setTurn('animating');
    setPlayerIsAttacking(true);
    soundEngine.playSfx('attack');
    setActiveEffect('physical');

    setTimeout(() => {
      setPlayerIsAttacking(false);

      // Hit / Evasion Check
      const playerAcc = player.accuracy ?? 95;
      const enemyEva = enemy.evasion ?? 5;
      const hitChance = Math.min(100, Math.max(25, playerAcc - enemyEva));
      const rollHit = Math.random() * 100 < hitChance;

      if (!rollHit) {
        soundEngine.playSfx('flee');
        addLog(`💨 ¡${player.name} lanzó un ataque pero ${enemy.name} lo esquivó ágilmente!`);
        spawnFloatingText(`¡ESQUIVADO!`, '#94a3b8', 70, 30);

        setTimeout(() => {
          setActiveEffect(null);
          setTurn('enemy');
          triggerEnemyTurn(enemy.hp);
        }, 500);
        return;
      }

      setEnemyIsHit(true);
      soundEngine.playSfx('hit');

      // Calculate Damage & Dynamic Crits with Armor Penetration
      const enemyEffectiveDef = Math.max(0, enemy.defense * (1 - (player.armorPenetration ?? 0) / 100));
      const baseDmg = Math.max(1, Math.round((player.attack * atkBuff) - enemyEffectiveDef * 0.4));
      const critChance = (player.critRate ?? 10) / 100;
      const critMultiplier = (player.critDamage ?? 175) / 100;
      const isCrit = Math.random() < critChance;
      const finalDmg = Math.round(baseDmg * (isCrit ? critMultiplier : 1.0) * (0.9 + Math.random() * 0.2));

      const newEnemyHp = Math.max(0, enemy.hp - finalDmg);
      setEnemy((prev) => ({ ...prev, hp: newEnemyHp }));

      const critTag = isCrit ? ' 💥 ¡GOLPE CRÍTICO!' : '';
      const penTag = (player.armorPenetration ?? 0) > 0 ? ` (🛡️ -${player.armorPenetration}% Armadura)` : '';
      addLog(`⚔️ ${player.name} atacó a ${enemy.name} e infligió ${finalDmg} de daño.${critTag}${penTag}`);
      spawnFloatingText(`-${finalDmg}${isCrit ? ' CRIT!' : ''}`, isCrit ? '#facc15' : '#ef4444', 70, 30);

      // Lifesteal Mechanic
      if (player.lifesteal && player.lifesteal > 0) {
        const healAmt = Math.max(1, Math.round(finalDmg * (player.lifesteal / 100)));
        const newPlayerHp = Math.min(player.maxHp, player.hp + healAmt);
        setPlayer((prev) => ({ ...prev, hp: newPlayerHp }));
        addLog(`🩸 ${player.name} drenó ${healAmt} HP por robo de vida.`);
        spawnFloatingText(`+${healAmt} HP 🩸`, '#10b981', 30, 65);
      }

      setTimeout(() => {
        setEnemyIsHit(false);
        setActiveEffect(null);

        if (newEnemyHp <= 0) {
          handleVictory();
        } else {
          setTurn('enemy');
          triggerEnemyTurn(newEnemyHp);
        }
      }, 500);
    }, 300);
  };

  // 2. Use Special Skill
  const handleUseSkill = (skill: Skill) => {
    if (turn !== 'player' || battleState !== 'in_progress') return;

    if (player.mp < skill.mpCost) {
      soundEngine.playSfx('error');
      addLog(`⚠️ ¡Maná insuficiente! Requiere ${skill.mpCost} MP.`);
      return;
    }

    setTurn('animating');
    setActiveMenu('main');

    // Deduct MP
    const newMp = player.mp - skill.mpCost;
    setPlayer((prev) => ({ ...prev, mp: newMp }));

    if (skill.type === 'heal') {
      soundEngine.playSfx('heal');
      setActiveEffect('heal');

      const healAmount = Math.round(player.maxHp * 0.4 * skill.power);
      const newHp = Math.min(player.maxHp, player.hp + healAmount);
      setPlayer((prev) => ({ ...prev, hp: newHp }));

      addLog(`✨ ${player.name} usó ${skill.name} y recuperó ${healAmount} de HP.`);
      spawnFloatingText(`+${healAmount} HP`, '#10b981', 30, 60);

      setTimeout(() => {
        setActiveEffect(null);
        setTurn('enemy');
        triggerEnemyTurn(enemy.hp);
      }, 700);
    } else if (skill.type === 'buff_atk' || skill.type === 'buff_def') {
      soundEngine.playSfx('magic');
      setActiveEffect('holy');

      if (skill.type === 'buff_atk') {
        setAtkBuff(skill.power);
        addLog(`🔥 ${player.name} usó ${skill.name}. ¡Ataque aumentado un ${Math.round((skill.power - 1) * 100)}%!`);
      } else {
        setDefBuff(skill.power);
        addLog(`🛡️ ${player.name} usó ${skill.name}. ¡Defensa aumentada un ${Math.round((skill.power - 1) * 100)}%!`);
      }

      setTimeout(() => {
        setActiveEffect(null);
        setTurn('enemy');
        triggerEnemyTurn(enemy.hp);
      }, 700);
    } else {
      // Skill Damage with Magic / Physical scaling and Armor Penetration
      setPlayerIsAttacking(true);
      soundEngine.playSfx('magic');
      setActiveEffect(skill.element);

      setTimeout(() => {
        setPlayerIsAttacking(false);

        // Accuracy check for damaging skills (skills have +10% bonus accuracy)
        const playerAcc = (player.accuracy ?? 95) + 10;
        const enemyEva = enemy.evasion ?? 5;
        const hitChance = Math.min(100, Math.max(30, playerAcc - enemyEva));
        const rollHit = Math.random() * 100 < hitChance;

        if (!rollHit) {
          soundEngine.playSfx('flee');
          addLog(`💨 ¡${enemy.name} esquivó el hechizo ${skill.name}!`);
          spawnFloatingText(`¡ESQUIVADO!`, '#94a3b8', 70, 30);

          setTimeout(() => {
            setActiveEffect(null);
            setTurn('enemy');
            triggerEnemyTurn(enemy.hp);
          }, 500);
          return;
        }

        setEnemyIsHit(true);
        soundEngine.playSfx('hit');

        const effectivePower = skill.element === 'magic' || skill.element === 'fire' || skill.element === 'ice' || skill.element === 'thunder' || skill.element === 'holy' || skill.element === 'shadow'
          ? Math.max(player.attack, player.magicAttack ?? player.attack)
          : player.attack;

        const enemyEffectiveDef = Math.max(0, enemy.defense * (1 - (player.armorPenetration ?? 0) / 100));
        const baseDmg = Math.max(1, Math.round(((effectivePower * atkBuff) * skill.power) - enemyEffectiveDef * 0.25));
        const critChance = (player.critRate ?? 10) / 100;
        const critMultiplier = (player.critDamage ?? 175) / 100;
        const isCrit = Math.random() < critChance;
        const finalDmg = Math.round(baseDmg * (isCrit ? critMultiplier : 1.0) * (0.95 + Math.random() * 0.15));

        const newEnemyHp = Math.max(0, enemy.hp - finalDmg);
        setEnemy((prev) => ({ ...prev, hp: newEnemyHp }));

        const critTag = isCrit ? ' 💥 ¡GOLPE CRÍTICO MÁGICO!' : '';
        addLog(`✨ ${player.name} desató ${skill.name} e infligió ${finalDmg} de daño elemental.${critTag}`);
        spawnFloatingText(`-${finalDmg}${isCrit ? ' CRIT!' : ''}`, isCrit ? '#facc15' : '#38bdf8', 70, 30);

        // Lifesteal on magic/skills if applicable
        if (player.lifesteal && player.lifesteal > 0) {
          const healAmt = Math.max(1, Math.round(finalDmg * (player.lifesteal / 100)));
          const newPlayerHp = Math.min(player.maxHp, player.hp + healAmt);
          setPlayer((prev) => ({ ...prev, hp: newPlayerHp }));
          addLog(`🩸 ${player.name} absorbió ${healAmt} HP con drenaje.`);
          spawnFloatingText(`+${healAmt} HP 🩸`, '#10b981', 30, 65);
        }

        setTimeout(() => {
          setEnemyIsHit(false);
          setActiveEffect(null);

          if (newEnemyHp <= 0) {
            handleVictory();
          } else {
            setTurn('enemy');
            triggerEnemyTurn(newEnemyHp);
          }
        }, 600);
      }, 400);
    }
  };

  // 3. Use Item in Battle
  const handleUseItem = (item: ConsumableItem) => {
    if (turn !== 'player' || battleState !== 'in_progress' || item.quantity <= 0) return;

    setTurn('animating');
    setActiveMenu('main');

    // Reduce item count
    const updatedConsumables = inventory.consumables
      .map((c) => (c.id === item.id ? { ...c, quantity: c.quantity - 1 } : c))
      .filter((c) => c.quantity > 0);

    setInventory((prev) => ({ ...prev, consumables: updatedConsumables }));

    if (item.effect === 'heal_hp') {
      soundEngine.playSfx('heal');
      const healAmt = item.power;
      const newHp = Math.min(player.maxHp, player.hp + healAmt);
      setPlayer((prev) => ({ ...prev, hp: newHp }));
      addLog(`🧪 Usaste ${item.name} y restauraste ${healAmt} HP.`);
      spawnFloatingText(`+${healAmt} HP`, '#10b981', 30, 60);
    } else if (item.effect === 'heal_mp') {
      soundEngine.playSfx('heal');
      const mpAmt = item.power;
      const newMp = Math.min(player.maxMp, player.mp + mpAmt);
      setPlayer((prev) => ({ ...prev, mp: newMp }));
      addLog(`💧 Usaste ${item.name} y restauraste ${mpAmt} MP.`);
      spawnFloatingText(`+${mpAmt} MP`, '#38bdf8', 30, 60);
    } else if (item.effect === 'heal_all') {
      soundEngine.playSfx('heal');
      setPlayer((prev) => ({ ...prev, hp: prev.maxHp, mp: prev.maxMp }));
      addLog(`✨ Usaste ${item.name}. ¡Vida y Maná restaurados por completo!`);
      spawnFloatingText(`FULL RESTORE`, '#facc15', 30, 60);
    } else if (item.effect === 'buff_atk') {
      soundEngine.playSfx('magic');
      setAtkBuff(item.power);
      addLog(`🏺 Usaste ${item.name}. ¡Ataque aumentado en combate!`);
    } else if (item.effect === 'buff_def') {
      soundEngine.playSfx('magic');
      setDefBuff(item.power);
      addLog(`🛡️ Usaste ${item.name}. ¡Defensa aumentada en combate!`);
    }

    setTimeout(() => {
      setTurn('enemy');
      triggerEnemyTurn(enemy.hp);
    }, 600);
  };

  // 4. Defend
  const handleDefend = () => {
    if (turn !== 'player' || battleState !== 'in_progress') return;

    soundEngine.playSfx('select');
    setIsDefending(true);
    const restoredMp = Math.min(player.maxMp, player.mp + Math.round(player.maxMp * 0.15));
    setPlayer((prev) => ({ ...prev, mp: restoredMp }));

    addLog(`🛡️ ${player.name} adopta una postura defensiva. Daño reducido un 50% y recupera MP.`);
    spawnFloatingText(`DEFENSA (+MP)`, '#38bdf8', 30, 60);

    setTimeout(() => {
      setTurn('enemy');
      triggerEnemyTurn(enemy.hp);
    }, 500);
  };

  // 5. Flee
  const handleFlee = () => {
    if (turn !== 'player' || battleState !== 'in_progress') return;

    if (enemy.isBoss) {
      soundEngine.playSfx('error');
      addLog(`⚠️ ¡No puedes huir de una batalla contra un Jefe!`);
      return;
    }

    const fleeSuccess = Math.random() < 0.6 + (player.speed - enemy.speed) * 0.02;

    if (fleeSuccess) {
      soundEngine.playSfx('flee');
      addLog(`🏃 ¡Lograste escapar con éxito de la batalla!`);
      setTimeout(() => {
        onBattleEnd({
          won: false,
          expEarned: 0,
          goldEarned: 0,
          updatedPlayer: player,
          updatedInventory: inventory,
          newlyUnlockedSkills: [],
        });
      }, 700);
    } else {
      soundEngine.playSfx('error');
      addLog(`❌ ¡Fallaste al intentar escapar! El enemigo aprovecha la oportunidad.`);
      setTurn('enemy');
      triggerEnemyTurn(enemy.hp);
    }
  };

  // --- ENEMY TURN LOGIC ---
  const triggerEnemyTurn = (currentEnemyHp: number) => {
    if (currentEnemyHp <= 0) return;

    setTimeout(() => {
      setEnemyIsAttacking(true);

      // Choose enemy skill or basic attack (60% for regular, 75% for bosses)
      const specialChance = enemy.isBoss ? 0.75 : 0.60;
      const hasSpecial = enemy.specialSkills && enemy.specialSkills.length > 0 && Math.random() < specialChance;
      const specialSkill = hasSpecial ? enemy.specialSkills![Math.floor(Math.random() * enemy.specialSkills!.length)] : null;

      if (specialSkill) {
        soundEngine.playSfx('boss_roar');
        setActiveEffect(specialSkill.element);
      } else {
        soundEngine.playSfx('attack');
        setActiveEffect('physical');
      }

      setTimeout(() => {
        setEnemyIsAttacking(false);

        // Player Evasion Check vs Enemy Accuracy
        const enemyAcc = enemy.accuracy ?? 90;
        const playerEva = player.evasion ?? 6;
        const enemyHitChance = Math.min(100, Math.max(20, enemyAcc - playerEva));
        const enemyHits = Math.random() * 100 < enemyHitChance;

        if (!enemyHits) {
          soundEngine.playSfx('flee');
          const skillName = specialSkill ? ` ${specialSkill.name}` : '';
          addLog(`💨 ¡${player.name} esquivó ágilmente el ataque${skillName} de ${enemy.name}!`);
          spawnFloatingText(`¡ESQUIVADO!`, '#38bdf8', 30, 50);

          setTimeout(() => {
            setActiveEffect(null);
            setIsDefending(false);

            // Turn starts for player - Apply MP & HP Regen
            let updatedMp = player.mp;
            let updatedHp = player.hp;
            if (player.mpRegen && player.mpRegen > 0) {
              const regen = Math.min(player.maxMp - player.mp, player.mpRegen);
              if (regen > 0) {
                updatedMp += regen;
                addLog(`✨ Regeneración pasiva: +${regen} MP.`);
              }
            }
            if (player.hpRegen && player.hpRegen > 0) {
              const regenHp = Math.min(player.maxHp - player.hp, player.hpRegen);
              if (regenHp > 0) {
                updatedHp += regenHp;
                addLog(`🌿 Regeneración pasiva: +${regenHp} HP.`);
              }
            }
            setPlayer((prev) => ({ ...prev, mp: updatedMp, hp: updatedHp }));

            setTurn('player');
          }, 600);
          return;
        }

        setPlayerIsHit(true);
        soundEngine.playSfx('hit');

        // Damage Calculation with Physical DEF vs Magic DEF
        const powerMult = specialSkill ? specialSkill.power : 1.0;
        const isMagicSkill = specialSkill && (specialSkill.element === 'magic' || specialSkill.element === 'fire' || specialSkill.element === 'ice' || specialSkill.element === 'thunder' || specialSkill.element === 'shadow');
        const effectiveDef = isMagicSkill
          ? ((player.magicDefense ?? player.defense) * defBuff) * (isDefending ? 2.0 : 1.0)
          : (player.defense * defBuff) * (isDefending ? 2.0 : 1.0);

        const rawDmg = Math.max(2, Math.round((enemy.attack * powerMult) - effectiveDef * 0.5));
        let finalDmg = Math.round(rawDmg * (0.9 + Math.random() * 0.2));

        // Shield / Class Block Check (Only for physical attacks)
        const blockRate = !isMagicSkill ? ((player.blockRate ?? 0) / 100) : 0;
        const isBlocked = Math.random() < blockRate;

        if (isBlocked) {
          finalDmg = Math.max(1, Math.round(finalDmg * 0.4)); // 60% damage reduction on block!
        }

        const newPlayerHp = Math.max(0, player.hp - finalDmg);
        setPlayer((prev) => ({ ...prev, hp: newPlayerHp }));

        const skillName = specialSkill ? ` usó ${specialSkill.name}` : ' atacó';
        if (isBlocked) {
          addLog(`🛡️ ¡${player.name} bloqueó el golpe de ${enemy.name} reduciendo el daño un 60%! (-${finalDmg} HP)`);
          spawnFloatingText(`-${finalDmg} BLOQUEO!`, '#fbbf24', 30, 50);
        } else {
          addLog(`💥 ¡${enemy.name}${skillName} e infligió ${finalDmg} de daño!`);
          spawnFloatingText(`-${finalDmg}`, '#ef4444', 30, 50);
        }

        setTimeout(() => {
          setPlayerIsHit(false);
          setActiveEffect(null);
          setIsDefending(false); // Reset defense stance

          if (newPlayerHp <= 0) {
            handleDefeat();
          } else {
            // Turn starts for player - Apply MP & HP Regen
            let updatedMp = player.mp;
            let updatedHp = newPlayerHp;
            if (player.mpRegen && player.mpRegen > 0) {
              const regen = Math.min(player.maxMp - player.mp, player.mpRegen);
              if (regen > 0) {
                updatedMp += regen;
                addLog(`✨ Regeneración pasiva: +${regen} MP.`);
              }
            }
            if (player.hpRegen && player.hpRegen > 0) {
              const regenHp = Math.min(player.maxHp - newPlayerHp, player.hpRegen);
              if (regenHp > 0) {
                updatedHp += regenHp;
                addLog(`🌿 Regeneración pasiva: +${regenHp} HP.`);
              }
            }
            setPlayer((prev) => ({ ...prev, mp: updatedMp, hp: updatedHp }));

            setTurn('player');
          }
        }, 600);
      }, 400);
    }, 600);
  };

  // --- BATTLE RESOLUTION ---
  const handleVictory = () => {
    setBattleState('victory');
    soundEngine.playMusic('victory');
    addLog(`🏆 ¡VICTORIA! Has derrotado a ${enemy.name}.`);

    const expMultiplier = 1 + (player.expBonus ?? 0) / 100;
    const goldMultiplier = 1 + (player.goldBonus ?? 0) / 100;
    const expGained = Math.round(enemy.expReward * expMultiplier);
    const goldGained = Math.round(enemy.goldReward * goldMultiplier);

    // Calculate probabilistic loot drop
    let droppedLoot: { consumable?: ConsumableItem; equipment?: EquipmentItem } | null = null;
    if (enemy.isBoss) {
      const bossRelic = getBossLegendaryDrop(enemy.zoneId, player.magicFind ?? 0);
      if (bossRelic) {
        droppedLoot = { equipment: bossRelic };
        setBattleLoot(droppedLoot);
        soundEngine.playSfx('chest');
        setInventory((prev) => ({
          ...prev,
          ownedEquipment: [...prev.ownedEquipment, bossRelic],
        }));
        addLog(`👑🌟 ¡BOTÍN LEGENDARIO DEL JEFE OBTENIDO!: ${bossRelic.name}!`);
      } else {
        addLog(`💀 Has derrotado al Jefe, pero su reliquia suprema no cayó esta vez.`);
      }
    } else {
      droppedLoot = getRandomEncounterDrop(enemy.zoneId);
      if (droppedLoot) {
        setBattleLoot(droppedLoot);
        soundEngine.playSfx('chest');
        if (droppedLoot.consumable) {
          const item = droppedLoot.consumable;
          const exists = inventory.consumables.find((c) => c.id === item.id);
          if (exists) {
            setInventory((prev) => ({
              ...prev,
              consumables: prev.consumables.map((c) =>
                c.id === item.id ? { ...c, quantity: c.quantity + (item.quantity || 1) } : c
              ),
            }));
          } else {
            setInventory((prev) => ({
              ...prev,
              consumables: [...prev.consumables, { ...item, quantity: 1 }],
            }));
          }
          addLog(`🎁 ¡Botín obtenido!: ${item.name} x1.`);
        } else if (droppedLoot.equipment) {
          const equip = droppedLoot.equipment;
          setInventory((prev) => ({
            ...prev,
            ownedEquipment: [...prev.ownedEquipment, equip],
          }));
          addLog(`🎁 ¡Botín obtenido!: ${equip.name} (${equip.slot}).`);
        }
      }
    }

    let newExp = player.exp + expGained;
    let newLevel = player.level;
    let newMaxExp = player.maxExp;
    let newHp = player.maxHp;
    let newMp = player.maxMp;
    let newAtk = player.attack;
    let newDef = player.defense;
    let newSpd = player.speed;

    let leveledUp = false;
    const newlyUnlockedSkills: Skill[] = [];

    // Check level up (Cap level 80)
    while (newExp >= newMaxExp && newLevel < 80) {
      leveledUp = true;
      newExp -= newMaxExp;
      newLevel += 1;
      newMaxExp = Math.round(newLevel * 85 + Math.pow(newLevel, 1.75) * 38);

      // Stat boosts per level
      newHp += 35;
      newMp += 18;
      newAtk += 5;
      newDef += 4;
      newSpd += 2;

      // Check newly unlocked skills
      const newlyAvailable = ALL_SKILLS.filter(
        (s) =>
          (s.heroClass === player.heroClass || s.heroClass === 'all') &&
          s.minLevel === newLevel
      );
      newlyUnlockedSkills.push(...newlyAvailable);
    }

    if (leveledUp) {
      soundEngine.playSfx('levelup');
      setLevelUpInfo({
        leveledUp: true,
        oldLevel: player.level,
        newLevel,
        newSkills: newlyUnlockedSkills,
      });
    }

    const updatedPlayer: PlayerStats = {
      ...player,
      level: newLevel,
      exp: newExp,
      maxExp: newMaxExp,
      hp: newHp, // Full restore on level up or win
      maxHp: newHp,
      mp: newMp,
      maxMp: newMp,
      attack: newAtk,
      defense: newDef,
      speed: newSpd,
      gold: player.gold + goldGained,
      score: player.score + (enemy.isBoss ? 2000 : 300) + enemy.levelRewardBonus! || 150,
    };

    setPlayer(updatedPlayer);

    setTimeout(() => {
      // Auto finish after short pause or user confirmation button
    }, 1000);
  };

  const handleDefeat = () => {
    setBattleState('defeat');
    soundEngine.playMusic('game_over');
    addLog(`💀 ¡Has sido derrotado por ${enemy.name}!`);
  };

  const finalizeBattle = () => {
    const isWin = battleState === 'victory';
    onBattleEnd({
      won: isWin,
      expEarned: isWin ? enemy.expReward : 0,
      goldEarned: isWin ? enemy.goldReward : 0,
      updatedPlayer: isWin
        ? player
        : { ...player, hp: Math.round(player.maxHp * 0.5) }, // Revive at 50% HP if lost
      updatedInventory: inventory,
      newlyUnlockedSkills: levelUpInfo?.newSkills || [],
    });
  };

  // Gamepad controls inside battle menu
  const handleControllerAction = (action: ControllerAction) => {
    if (battleState !== 'in_progress') {
      if (action === 'CONFIRM') finalizeBattle();
      return;
    }

    if (turn !== 'player') return;

    if (activeMenu === 'main') {
      switch (action) {
        case 'UP':
        case 'CONFIRM':
          handlePlayerAttack();
          break;
        case 'LEFT':
          setActiveMenu('skills');
          soundEngine.playSfx('select');
          break;
        case 'RIGHT':
          setActiveMenu('items');
          soundEngine.playSfx('select');
          break;
        case 'DOWN':
          handleDefend();
          break;
        case 'CANCEL':
          handleFlee();
          break;
      }
    } else {
      if (action === 'CANCEL') {
        setActiveMenu('main');
        soundEngine.playSfx('select');
      }
    }
  };

  useGamepadControls(handleControllerAction, true);

  return (
    <div
      className="relative w-full h-full max-h-[100dvh] max-w-4xl mx-auto p-1.5 sm:p-4 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden font-mono select-none touch-none"
      style={{
        paddingTop: 'max(0.5rem, env(safe-area-inset-top, 0.5rem))',
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))',
      }}
    >
      {/* Top Banner: Enemy Info & Stage */}
      <div className="w-full bg-slate-900/90 rounded-lg p-1.5 sm:p-3 border border-slate-800 flex justify-between items-center mb-1 flex-shrink-0">
        <div className="flex items-center space-x-2">
          {enemy.isBoss && <Skull className="w-4 h-4 text-red-500 animate-pulse" />}
          <div>
            <h2 className="text-xs sm:text-lg font-bold text-amber-300">
              {enemy.isBoss ? `👑 JEFE: ${enemy.name}` : enemy.name}
            </h2>
            <p className="text-[9px] sm:text-xs text-slate-400 truncate max-w-[160px] sm:max-w-none">{enemy.description}</p>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <span className="text-[9px] sm:text-xs px-1.5 py-0.5 sm:py-1 bg-red-950 text-red-300 border border-red-800 rounded">
            {enemy.isBoss ? 'DESAFÍO ÉPICO' : 'COMBATE'}
          </span>
        </div>
      </div>

      {/* Main 2.5D Battle Arena Stage */}
      <div className={`relative w-full flex-1 min-h-[120px] rounded-xl border-2 border-slate-800/80 p-1.5 sm:p-2 flex flex-col justify-between overflow-hidden shadow-2xl bg-slate-950 ${playerIsHit || enemyIsHit ? 'animate-screen-shake' : ''}`}>
        {/* Floating Combat Text Overlay */}
        {floatingTexts.map((ft) => (
          <div
            key={ft.id}
            className="absolute font-black text-base sm:text-2xl animate-floating-damage z-40 pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,1)]"
            style={{
              left: `${ft.x}%`,
              top: `${ft.y}%`,
              color: ft.color,
            }}
          >
            {ft.text}
          </div>
        ))}

        {/* Visual FX Animation Layer */}
        {activeEffect && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none bg-slate-950/20 backdrop-blur-[1px]">
            <PixelCanvas
              type="effect"
              spriteName="effect"
              effectType={activeEffect}
              size={140}
            />
          </div>
        )}

        {/* HUD OVERLAY TOP-LEFT: PLAYER HERO STATS */}
        <div className="absolute top-2 left-2 z-20 pointer-events-none origin-top-left scale-75 sm:scale-100">
          <div className="bg-slate-950/90 backdrop-blur-md p-2.5 rounded-lg border border-emerald-500/40 w-52 sm:w-60 shadow-[0_0_15px_rgba(16,185,129,0.2)] space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-amber-300">
              <span className="truncate max-w-[130px]">
                {player.name} (Niv. {player.level})
              </span>
              {isDefending && (
                <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800 px-1.5 py-0.5 rounded animate-pulse">
                  🛡️ Guardia
                </span>
              )}
            </div>

            {/* HP Bar */}
            <div>
              <div className="flex justify-between text-[10px] text-emerald-400 font-bold mb-0.5">
                <span>HP</span>
                <span>
                  {player.hp}/{player.maxHp}
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-emerald-950/80">
                <div
                  className="bar-fill-hp h-full rounded-full"
                  style={{ width: `${Math.min(100, Math.max(0, (player.hp / player.maxHp) * 100))}%` }}
                />
              </div>
            </div>

            {/* MP Bar */}
            <div>
              <div className="flex justify-between text-[10px] text-sky-400 font-bold mb-0.5">
                <span>MP</span>
                <span>
                  {player.mp}/{player.maxMp}
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-sky-950/80">
                <div
                  className="bar-fill-mp h-full rounded-full"
                  style={{ width: `${Math.min(100, Math.max(0, (player.mp / player.maxMp) * 100))}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* HUD OVERLAY TOP-RIGHT: ENEMY STATS */}
        <div className="absolute top-2 right-2 z-20 pointer-events-none origin-top-right scale-75 sm:scale-100">
          <div className="bg-slate-950/90 backdrop-blur-md p-2.5 rounded-lg border border-red-500/40 w-52 sm:w-60 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <div className="flex justify-between items-center text-xs font-bold text-red-400 mb-1">
              <span className="truncate max-w-[120px]">{enemy.name}</span>
              <span>
                {Math.max(0, Math.round(enemy.hp || 0))}/{Math.max(1, Math.round(enemy.maxHp || 1))} HP
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-red-950/80">
              <div
                className="bar-fill-hp h-full rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, ((enemy.hp || 0) / (enemy.maxHp || 1)) * 100)
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* 🌟 AUTÉNTICA ARENA DE COMBATE 2.5D RETRO PIXEL ART */}
        <div className="w-full h-full min-h-[120px] sm:min-h-[220px]">
          <PixelBattleCanvas
            player={player}
            equipment={inventory.equipment}
            enemy={enemy}
            playerIsAttacking={playerIsAttacking}
            playerIsHit={playerIsHit}
            isDefending={isDefending}
            enemyIsAttacking={enemyIsAttacking}
            enemyIsHit={enemyIsHit}
            activeEffect={activeEffect}
          />
        </div>
      </div>

      {/* Combat Log Text Box */}
      <div className="w-full my-1 bg-slate-900/80 rounded-lg p-1.5 sm:p-2.5 border border-slate-800 text-[10px] sm:text-xs h-10 sm:h-14 overflow-y-auto font-mono text-slate-300 flex-shrink-0">
        {combatLogs.length > 0 ? (
          combatLogs.map((log, idx) => (
            <div key={idx} className={idx === 0 ? 'text-amber-300 font-bold' : 'text-slate-400'}>
              {log}
            </div>
          ))
        ) : (
          <div className="text-slate-500 italic">¡Comienza el combate! Selecciona tu acción.</div>
        )}
      </div>

      {/* Action Command Controls */}
      {battleState === 'in_progress' && (
        <div className="w-full bg-slate-900 rounded-lg p-1.5 sm:p-2.5 border border-slate-800 flex-shrink-0">
          {activeMenu === 'main' && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2">
              <button
                onClick={handlePlayerAttack}
                disabled={turn !== 'player'}
                className="flex items-center justify-center space-x-1 py-2 sm:py-2.5 px-1.5 sm:px-2 bg-red-900/80 hover:bg-red-800 disabled:opacity-50 text-red-100 rounded-lg border border-red-700 font-bold text-[11px] sm:text-xs transition"
              >
                <Swords className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-300" />
                <span>Atacar [Z/A]</span>
              </button>

              <button
                onClick={() => {
                  setActiveMenu('skills');
                  soundEngine.playSfx('select');
                }}
                disabled={turn !== 'player'}
                className="flex items-center justify-center space-x-1 py-2 sm:py-2.5 px-1.5 sm:px-2 bg-blue-900/80 hover:bg-blue-800 disabled:opacity-50 text-blue-100 rounded-lg border border-blue-700 font-bold text-[11px] sm:text-xs transition"
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-300" />
                <span>Habilidades</span>
              </button>

              <button
                onClick={() => {
                  setActiveMenu('items');
                  soundEngine.playSfx('select');
                }}
                disabled={turn !== 'player'}
                className="flex items-center justify-center space-x-1 py-2 sm:py-2.5 px-1.5 sm:px-2 bg-amber-900/80 hover:bg-amber-800 disabled:opacity-50 text-amber-100 rounded-lg border border-amber-700 font-bold text-[11px] sm:text-xs transition"
              >
                <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                <span>Objetos</span>
              </button>

              <button
                onClick={handleDefend}
                disabled={turn !== 'player'}
                className="flex items-center justify-center space-x-1 py-2 sm:py-2.5 px-1.5 sm:px-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 rounded-lg border border-slate-700 font-bold text-[11px] sm:text-xs transition"
              >
                <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />
                <span>Defender</span>
              </button>

              <button
                onClick={handleFlee}
                disabled={turn !== 'player' || enemy.isBoss}
                className="col-span-2 sm:col-span-1 flex items-center justify-center space-x-1 py-2 sm:py-2.5 px-1.5 sm:px-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-400 rounded-lg border border-slate-800 font-bold text-[11px] sm:text-xs transition"
              >
                <Footprints className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                <span>Huir [X/B]</span>
              </button>
            </div>
          )}

          {/* Submenu: Skills Selection */}
          {activeMenu === 'skills' && (
            <div>
              <div className="flex justify-between items-center mb-2 pb-1 border-b border-slate-800">
                <span className="text-xs font-bold text-blue-400">✨ Habilidades Especiales (MP: {player.mp}/{player.maxMp})</span>
                <button
                  onClick={() => setActiveMenu('main')}
                  className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300 hover:bg-slate-700"
                >
                  Volver [Esc]
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {availableSkills.map((sk) => {
                  const canAfford = player.mp >= sk.mpCost;
                  return (
                    <button
                      key={sk.id}
                      onClick={() => handleUseSkill(sk)}
                      disabled={!canAfford}
                      className={`p-2 rounded border text-left flex justify-between items-center transition ${
                        canAfford
                          ? 'bg-slate-800 hover:bg-blue-950 border-slate-700 text-slate-100'
                          : 'bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-amber-300">{sk.name}</div>
                        <div className="text-[10px] text-slate-400">{sk.description}</div>
                      </div>
                      <span className="text-xs font-bold text-sky-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        {sk.mpCost} MP
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submenu: Items Selection */}
          {activeMenu === 'items' && (
            <div>
              <div className="flex justify-between items-center mb-2 pb-1 border-b border-slate-800">
                <span className="text-xs font-bold text-amber-400">🧪 Objetos de Consumo</span>
                <button
                  onClick={() => setActiveMenu('main')}
                  className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300 hover:bg-slate-700"
                >
                  Volver [Esc]
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {inventory.consumables.length > 0 ? (
                  inventory.consumables.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleUseItem(item)}
                      className="p-2 bg-slate-800 hover:bg-amber-950 border border-slate-700 rounded text-left flex justify-between items-center transition"
                    >
                      <div>
                        <div className="text-xs font-bold text-amber-300">
                          {item.icon} {item.name} x{item.quantity}
                        </div>
                        <div className="text-[10px] text-slate-400">{item.description}</div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-slate-900 px-2 py-1 rounded">
                        Usar
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="col-span-2 text-xs text-slate-500 italic p-2">
                    No tienes objetos de curación en tu inventario.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Victory / Defeat Resolution Overlay Modal */}
      {battleState !== 'in_progress' && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-40 rounded-xl">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4 sm:p-5 max-w-md w-full shadow-2xl text-center space-y-3 max-h-[92dvh] overflow-y-auto">
            {battleState === 'victory' ? (
              <>
                <div className="text-3xl sm:text-4xl">🏆</div>
                <h3 className="text-xl sm:text-2xl font-black text-amber-400">¡VICTORIA ÉPICA!</h3>
                <p className="text-xs text-slate-300">Has derrotado con éxito a {enemy.name}.</p>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between text-purple-300">
                    <span>Experiencia Ganada:</span>
                    <span className="font-bold">+{enemy.expReward} EXP</span>
                  </div>
                  <div className="flex justify-between text-amber-300">
                    <span>Oro Obtenido:</span>
                    <span className="font-bold">+{enemy.goldReward} G</span>
                  </div>
                </div>

                {/* Extra Encounter Loot Announcement */}
                {battleLoot && (
                  <div className="bg-emerald-950/70 p-3 rounded-lg border border-emerald-500/60 text-xs text-left space-y-1 animate-pulse">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-amber-300 flex items-center space-x-1.5">
                        <Gift className="w-4 h-4 text-emerald-400" />
                        <span>¡BOTÍN DE COMBATE OBTENIDO!</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-200 uppercase font-mono">
                        {battleLoot.consumable ? 'Consumible' : 'Equipo'}
                      </span>
                    </div>
                    <div className="text-emerald-200 text-xs font-bold flex items-center space-x-2">
                      <span className="text-base">{battleLoot.consumable?.icon || battleLoot.equipment?.icon || '🎁'}</span>
                      <span>{battleLoot.consumable?.name || battleLoot.equipment?.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {battleLoot.consumable?.description || battleLoot.equipment?.description}
                    </div>
                  </div>
                )}

                {/* Level Up Announcement */}
                {levelUpInfo?.leveledUp && (
                  <div className="bg-gradient-to-r from-amber-950 via-purple-950 to-amber-950 p-3 rounded-lg border border-amber-500/60 text-xs space-y-1 animate-pulse">
                    <div className="text-amber-300 font-bold text-sm">
                      ✨ ¡SUBISTE DE NIVEL! (Nivel {levelUpInfo.newLevel})
                    </div>
                    <div className="text-slate-200 text-[11px]">
                      ¡Vida y Maná restaurados! Atributos incrementados.
                    </div>
                    {levelUpInfo.newSkills.length > 0 && (
                      <div className="text-sky-300 font-bold mt-1">
                        🔓 ¡Habilidad Desbloqueada!: {levelUpInfo.newSkills.map((s) => s.name).join(', ')}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={finalizeBattle}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg transition shadow-lg text-sm"
                >
                  Continuar Aventura [Z/Espacio]
                </button>
              </>
            ) : (
              <>
                <div className="text-3xl sm:text-4xl">💀</div>
                <h3 className="text-xl sm:text-2xl font-black text-red-500">DERROTADO EN COMBATE</h3>
                <p className="text-xs text-slate-300">
                  {enemy.name} ha prevalecido. Te has replegado para recuperarte.
                </p>

                <button
                  onClick={finalizeBattle}
                  className="w-full py-3 bg-red-800 hover:bg-red-700 text-slate-100 font-black rounded-lg transition shadow-lg text-sm"
                >
                  Regresar a la Zona [Z/Espacio]
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
