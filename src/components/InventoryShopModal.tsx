import React, { useState } from 'react';
import { PlayerStats, Inventory, EquipmentItem, ConsumableItem, EquipmentSlot } from '../types';
import { HERO_CLASSES, SHOP_CONSUMABLES, SHOP_EQUIPMENT } from '../data/gameData';
import { soundEngine } from '../utils/soundEngine';
import {
  ShoppingBag,
  Shield,
  Swords,
  X,
  Heart,
  Zap,
  Sparkles,
  Target,
  Wind,
  Flame,
  Droplet,
  ShieldAlert
} from 'lucide-react';

interface InventoryShopModalProps {
  player: PlayerStats;
  inventory: Inventory;
  initialTab?: 'inventory' | 'shop' | 'equipment';
  onClose: () => void;
  onUpdatePlayerAndInventory: (updatedPlayer: PlayerStats, updatedInventory: Inventory) => void;
}

const SLOT_CONFIG: {
  key: EquipmentSlot;
  label: string;
  icon: string;
  placeholder: string;
}[] = [
  { key: 'weapon', label: 'Arma Principal', icon: '🗡️', placeholder: 'Sin arma equipada' },
  { key: 'shield', label: 'Mano Izq. / Escudo', icon: '🛡️', placeholder: 'Sin escudo equipado' },
  { key: 'helmet', label: 'Casco / Yelmo', icon: '👑', placeholder: 'Sin casco equipado' },
  { key: 'armor', label: 'Armadura / Coraza', icon: '🥋', placeholder: 'Sin armadura equipada' },
  { key: 'boots', label: 'Botas / Grebas', icon: '👢', placeholder: 'Sin botas equipadas' },
  { key: 'ring', label: 'Anillo', icon: '💍', placeholder: 'Sin anillo equipado' },
  { key: 'amulet', label: 'Amuleto / Reliquia', icon: '📿', placeholder: 'Sin amuleto equipado' },
];

export const InventoryShopModal: React.FC<InventoryShopModalProps> = ({
  player,
  inventory,
  initialTab = 'equipment',
  onClose,
  onUpdatePlayerAndInventory,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'shop' | 'equipment'>(initialTab);
  const [shopCategory, setShopCategory] = useState<'consumables' | 'equipment'>('equipment');
  const [filterSlot, setFilterSlot] = useState<EquipmentSlot | 'all'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  // Recalculate player stats with active equipment and tactical bonuses
  const getCalculatedPlayerStats = (eq: Inventory['equipment']): PlayerStats => {
    const classBase = HERO_CLASSES[player.heroClass]?.baseStats || {
      accuracy: 95,
      evasion: 5,
      critRate: 10,
      critDamage: 175,
      blockRate: 0,
      lifesteal: 0,
      mpRegen: 0,
    };

    let atkBonus = 0;
    let defBonus = 0;
    let hpBonus = 0;
    let mpBonus = 0;
    let spdBonus = 0;
    let accBonus = 0;
    let evaBonus = 0;
    let critBonus = 0;
    let critDmgBonus = 0;
    let blockBonus = 0;
    let lifestealBonus = 0;
    let mpRegenBonus = 0;

    Object.values(eq).forEach((item) => {
      if (item) {
        if (item.bonusAttack) atkBonus += item.bonusAttack;
        if (item.bonusDefense) defBonus += item.bonusDefense;
        if (item.bonusHp) hpBonus += item.bonusHp;
        if (item.bonusMp) mpBonus += item.bonusMp;
        if (item.bonusSpeed) spdBonus += item.bonusSpeed;
        if (item.bonusAccuracy) accBonus += item.bonusAccuracy;
        if (item.bonusEvasion) evaBonus += item.bonusEvasion;
        if (item.bonusCritRate) critBonus += item.bonusCritRate;
        if (item.bonusCritDamage) critDmgBonus += item.bonusCritDamage;
        if (item.bonusBlockRate) blockBonus += item.bonusBlockRate;
        if (item.bonusLifesteal) lifestealBonus += item.bonusLifesteal;
        if (item.bonusMpRegen) mpRegenBonus += item.bonusMpRegen;
      }
    });

    const newMaxHp = player.maxHp + hpBonus;
    const newMaxMp = player.maxMp + mpBonus;

    return {
      ...player,
      maxHp: newMaxHp,
      hp: Math.min(player.hp, newMaxHp),
      maxMp: newMaxMp,
      mp: Math.min(player.mp, newMaxMp),
      attack: player.attack + atkBonus,
      defense: player.defense + defBonus,
      speed: player.speed + spdBonus,
      accuracy: Math.min(100, (classBase.accuracy ?? 95) + accBonus),
      evasion: (classBase.evasion ?? 5) + evaBonus,
      critRate: (classBase.critRate ?? 10) + critBonus,
      critDamage: (classBase.critDamage ?? 175) + critDmgBonus,
      blockRate: (classBase.blockRate ?? 0) + blockBonus,
      lifesteal: (classBase.lifesteal ?? 0) + lifestealBonus,
      mpRegen: (classBase.mpRegen ?? 0) + mpRegenBonus,
    };
  };

  // Equip Item
  const handleEquip = (item: EquipmentItem) => {
    soundEngine.playSfx('select');
    const slot = item.slot;
    const currentEquipped = inventory.equipment[slot];
    const newEquipment = { ...inventory.equipment, [slot]: item };
    let newOwned = [...inventory.ownedEquipment].filter((i) => i.id !== item.id);
    if (currentEquipped) newOwned.push(currentEquipped);

    const updatedInventory: Inventory = { ...inventory, equipment: newEquipment, ownedEquipment: newOwned };
    const updatedPlayer = getCalculatedPlayerStats(newEquipment);
    onUpdatePlayerAndInventory(updatedPlayer, updatedInventory);
    showToast(`⚔️ ¡Equipado ${item.name}!`);
  };

  // Unequip Item
  const handleUnequip = (slot: EquipmentSlot) => {
    const item = inventory.equipment[slot];
    if (!item) return;
    soundEngine.playSfx('select');
    const newEquipment = { ...inventory.equipment, [slot]: null };
    const updatedInventory: Inventory = { ...inventory, equipment: newEquipment, ownedEquipment: [...inventory.ownedEquipment, item] };
    const updatedPlayer = getCalculatedPlayerStats(newEquipment);
    onUpdatePlayerAndInventory(updatedPlayer, updatedInventory);
    showToast(`🛡️ Desequipado ${item.name}.`);
  };

  // Use Consumable out of combat
  const handleUseConsumable = (item: ConsumableItem) => {
    if (item.quantity <= 0) return;

    if (item.effect === 'heal_hp' && player.hp >= player.maxHp) {
      soundEngine.playSfx('select');
      showToast('💚 ¡Tu salud ya está al 100%! No se gastó la poción.');
      return;
    }
    if (item.effect === 'heal_mp' && player.mp >= player.maxMp) {
      soundEngine.playSfx('select');
      showToast('💙 ¡Tu maná ya está al 100%! No se gastó la poción.');
      return;
    }

    soundEngine.playSfx('heal');
    let newHp = player.hp;
    let newMp = player.mp;
    if (item.effect === 'heal_hp') newHp = Math.min(player.maxHp, player.hp + item.power);
    else if (item.effect === 'heal_mp') newMp = Math.min(player.maxMp, player.mp + item.power);
    else if (item.effect === 'heal_all') { newHp = player.maxHp; newMp = player.maxMp; }

    const updatedConsumables = inventory.consumables
      .map((c) => (c.id === item.id ? { ...c, quantity: c.quantity - 1 } : c))
      .filter((c) => c.quantity > 0);

    onUpdatePlayerAndInventory({ ...player, hp: newHp, mp: newMp }, { ...inventory, consumables: updatedConsumables });
    showToast(`🧪 Usaste ${item.name}.`);
  };

  // Buy Consumable
  const handleBuyConsumable = (item: Omit<ConsumableItem, 'quantity'>) => {
    if (player.gold < item.price) {
      soundEngine.playSfx('error');
      showToast('❌ ¡No tienes suficiente Oro!');
      return;
    }
    soundEngine.playSfx('buy');
    const existingIndex = inventory.consumables.findIndex((c) => c.id === item.id);
    let updatedConsumables = [...inventory.consumables];
    if (existingIndex >= 0) updatedConsumables[existingIndex].quantity += 1;
    else updatedConsumables.push({ ...item, quantity: 1 });

    onUpdatePlayerAndInventory({ ...player, gold: player.gold - item.price }, { ...inventory, consumables: updatedConsumables });
    showToast(`🛒 Compraste ${item.name} (-${item.price} G)`);
  };

  // Buy Equipment
  const handleBuyEquipment = (item: EquipmentItem) => {
    if (player.gold < item.price) {
      soundEngine.playSfx('error');
      showToast('❌ ¡No tienes suficiente Oro!');
      return;
    }
    soundEngine.playSfx('buy');
    onUpdatePlayerAndInventory(
      { ...player, gold: player.gold - item.price },
      { ...inventory, ownedEquipment: [...inventory.ownedEquipment, item] }
    );
    showToast(`⚔️ Compraste ${item.name} (-${item.price} G)`);
  };

  // Sell Item for 30% value (Realistic Merchant Pawn Economy)
  const handleSellEquipment = (item: EquipmentItem) => {
    soundEngine.playSfx('buy');
    const sellPrice = Math.max(1, Math.floor(item.price * 0.3));
    onUpdatePlayerAndInventory(
      { ...player, gold: player.gold + sellPrice },
      { ...inventory, ownedEquipment: inventory.ownedEquipment.filter((i) => i.id !== item.id) }
    );
    showToast(`💰 Vendiste ${item.name} por +${sellPrice} G`);
  };

  const filteredOwnedEquipment = inventory.ownedEquipment.filter((item) => filterSlot === 'all' || item.slot === filterSlot);

  const renderItemTacticalBadges = (item: EquipmentItem) => (
    <div className="text-[10px] font-bold mt-1.5 flex flex-wrap gap-1">
      {item.bonusAttack ? <span className="bg-amber-950/60 text-amber-300 border border-amber-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">⚔️ +{item.bonusAttack} Atq</span> : null}
      {item.bonusDefense ? <span className="bg-blue-950/60 text-blue-300 border border-blue-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">🛡️ +{item.bonusDefense} Def</span> : null}
      {item.bonusHp ? <span className="bg-rose-950/60 text-rose-300 border border-rose-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">❤️ +{item.bonusHp} HP</span> : null}
      {item.bonusMp ? <span className="bg-sky-950/60 text-sky-300 border border-sky-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">💧 +{item.bonusMp} MP</span> : null}
      {item.bonusSpeed ? <span className="bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">🌀 +{item.bonusSpeed} Vel</span> : null}
      {item.bonusAccuracy ? <span className="bg-amber-900/40 text-amber-200 border border-amber-700/50 px-1.5 py-0.5 rounded flex items-center gap-0.5">🎯 +{item.bonusAccuracy}% Prec</span> : null}
      {item.bonusEvasion ? <span className="bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">💨 +{item.bonusEvasion}% Eva</span> : null}
      {item.bonusCritRate ? <span className="bg-yellow-950/60 text-yellow-300 border border-yellow-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">💥 +{item.bonusCritRate}% Crít</span> : null}
      {item.bonusCritDamage ? <span className="bg-orange-950/60 text-orange-300 border border-orange-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">⚡ +{item.bonusCritDamage}% Dño Crít</span> : null}
      {item.bonusBlockRate ? <span className="bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">🛡️ +{item.bonusBlockRate}% Bloqueo</span> : null}
      {item.bonusLifesteal ? <span className="bg-red-950/70 text-red-300 border border-red-800/70 px-1.5 py-0.5 rounded flex items-center gap-0.5">🩸 +{item.bonusLifesteal}% Robo</span> : null}
      {item.bonusMpRegen ? <span className="bg-teal-950/60 text-teal-300 border border-teal-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">✨ +{item.bonusMpRegen} MP/t</span> : null}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50 font-mono">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-amber-300">
              {activeTab === 'shop' ? '🛒 Gran Bazar y Forja Imperial' : '🎒 Hoja de Personaje & Equipamiento'}
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs bg-slate-800 text-amber-400 px-3 py-1 rounded border border-amber-500/30 font-bold shadow-inner">
              💰 {player.gold.toLocaleString()} G
            </span>
            <button
              onClick={() => {
                soundEngine.playSfx('select');
                onClose();
              }}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/70 p-1.5 text-xs font-bold gap-1">
          <button
            onClick={() => {
              soundEngine.playSfx('select');
              setActiveTab('equipment');
            }}
            className={`flex-1 py-2.5 rounded-lg transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'equipment' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <span>🛡️</span>
            <span>Equipo & Stats</span>
          </button>
          <button
            onClick={() => {
              soundEngine.playSfx('select');
              setActiveTab('inventory');
            }}
            className={`flex-1 py-2.5 rounded-lg transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'inventory' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <span>🧪</span>
            <span>Consumibles ({inventory.consumables.reduce((acc, c) => acc + c.quantity, 0)})</span>
          </button>
          <button
            onClick={() => {
              soundEngine.playSfx('select');
              setActiveTab('shop');
            }}
            className={`flex-1 py-2.5 rounded-lg transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'shop' ? 'bg-emerald-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <span>🛒</span>
            <span>Bazar / Tienda</span>
          </button>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="bg-amber-400 text-slate-950 px-4 py-1.5 text-center text-xs font-black tracking-wide border-b border-amber-600 shadow-md animate-pulse">
            {toastMessage}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
          {/* TAB 1: EQUIPMENT & STATS */}
          {activeTab === 'equipment' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* SIDEBAR: CHARACTER STATS SHEET */}
              <div className="lg:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-2xl shadow-md border border-amber-300/40">
                      {player.heroClass === 'Guerrero'
                        ? '⚔️'
                        : player.heroClass === 'Mago'
                        ? '🔮'
                        : player.heroClass === 'Pícaro'
                        ? '🗡️'
                        : player.heroClass === 'Paladín'
                        ? '🛡️'
                        : player.heroClass === 'Nigromante'
                        ? '💀'
                        : player.heroClass === 'Arquero'
                        ? '🏹'
                        : '🪓'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-black text-amber-300 text-sm">{player.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold">
                          {player.heroClass}
                        </span>
                      </div>
                      <div className="text-xs text-amber-400 font-bold mt-0.5">Nivel {player.level}</div>
                    </div>
                  </div>

                  {/* EXP Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1">
                      <span>Experiencia</span>
                      <span>
                        {player.exp} / {player.maxExp} EXP
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.round((player.exp / player.maxExp) * 100))}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats Breakdown */}
                  <div className="mt-3.5 space-y-2">
                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Atributos Primarios</span>
                      <span className="text-[9px] text-amber-400 font-normal">Base + Equipo</span>
                    </div>

                    <div className="flex items-center justify-between p-1.5 px-2 bg-slate-900/80 rounded-lg border border-slate-800/80 text-xs">
                      <div className="flex items-center space-x-2 text-rose-400 font-bold">
                        <Heart className="w-3.5 h-3.5" />
                        <span>Puntos de Vida</span>
                      </div>
                      <span className="font-black text-slate-100">
                        {player.hp} / {player.maxHp}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-1.5 px-2 bg-slate-900/80 rounded-lg border border-slate-800/80 text-xs">
                      <div className="flex items-center space-x-2 text-sky-400 font-bold">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Puntos de Maná</span>
                      </div>
                      <span className="font-black text-slate-100">
                        {player.mp} / {player.maxMp}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-1.5 px-2 bg-slate-900/80 rounded-lg border border-slate-800/80 text-xs">
                      <div className="flex items-center space-x-2 text-amber-400 font-bold">
                        <Swords className="w-3.5 h-3.5" />
                        <span>Poder de Ataque</span>
                      </div>
                      <span className="font-black text-slate-100">{player.attack}</span>
                    </div>

                    <div className="flex items-center justify-between p-1.5 px-2 bg-slate-900/80 rounded-lg border border-slate-800/80 text-xs">
                      <div className="flex items-center space-x-2 text-blue-400 font-bold">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Defensa & Armadura</span>
                      </div>
                      <span className="font-black text-slate-100">{player.defense}</span>
                    </div>

                    <div className="flex items-center justify-between p-1.5 px-2 bg-slate-900/80 rounded-lg border border-slate-800/80 text-xs">
                      <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Velocidad de Turno</span>
                      </div>
                      <span className="font-black text-slate-100">{player.speed}</span>
                    </div>
                  </div>

                  {/* TACTICAL COMBAT STATS */}
                  <div className="mt-3.5 space-y-1.5">
                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Estadísticas Tácticas</span>
                      <span className="text-[9px] text-sky-400 font-normal">Combate RPG</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      {/* Precisión */}
                      <div className="p-1.5 bg-slate-900/90 rounded border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
                          <Target className="w-3 h-3 text-amber-400" />
                          <span>Precisión</span>
                        </div>
                        <span className="font-black text-amber-200">{player.accuracy ?? 95}%</span>
                      </div>

                      {/* Evasión */}
                      <div className="p-1.5 bg-slate-900/90 rounded border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 text-cyan-300 font-bold">
                          <Wind className="w-3 h-3 text-cyan-400" />
                          <span>Evasión</span>
                        </div>
                        <span className="font-black text-cyan-200">{player.evasion ?? 6}%</span>
                      </div>

                      {/* Crítico */}
                      <div className="p-1.5 bg-slate-900/90 rounded border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 text-yellow-300 font-bold">
                          <Flame className="w-3 h-3 text-yellow-400" />
                          <span>Crítico</span>
                        </div>
                        <span className="font-black text-yellow-200">{player.critRate ?? 10}%</span>
                      </div>

                      {/* Daño Crítico */}
                      <div className="p-1.5 bg-slate-900/90 rounded border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 text-orange-300 font-bold">
                          <Zap className="w-3 h-3 text-orange-400" />
                          <span>Daño Crít.</span>
                        </div>
                        <span className="font-black text-orange-200">{player.critDamage ?? 175}%</span>
                      </div>

                      {/* Bloqueo */}
                      <div className="p-1.5 bg-slate-900/90 rounded border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 text-blue-300 font-bold">
                          <ShieldAlert className="w-3 h-3 text-blue-400" />
                          <span>Bloqueo</span>
                        </div>
                        <span className="font-black text-blue-200">{player.blockRate ?? 0}%</span>
                      </div>

                      {/* Robo de Vida */}
                      <div className="p-1.5 bg-slate-900/90 rounded border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 text-rose-300 font-bold">
                          <Droplet className="w-3 h-3 text-rose-400" />
                          <span>Robo Vida</span>
                        </div>
                        <span className="font-black text-rose-200">{player.lifesteal ?? 0}%</span>
                      </div>
                    </div>

                    {/* MP Regen Bar if active */}
                    {(player.mpRegen ?? 0) > 0 && (
                      <div className="p-1.5 bg-sky-950/40 rounded border border-sky-800/60 flex items-center justify-between text-[11px]">
                        <div className="flex items-center space-x-1.5 text-sky-300 font-bold">
                          <Sparkles className="w-3 h-3 text-sky-400" />
                          <span>Regeneración Pasiva</span>
                        </div>
                        <span className="font-black text-sky-200">+{player.mpRegen} MP/turno</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs font-bold text-slate-400">
                  <span>
                    Puntuación: <span className="text-amber-300">{player.score.toLocaleString()} pts</span>
                  </span>
                  <span>
                    Oro: <span className="text-amber-400">{player.gold.toLocaleString()} G</span>
                  </span>
                </div>
              </div>

              {/* MAIN CONTENT: 7 EQUIPPED SLOTS & INVENTORY */}
              <div className="lg:col-span-7 space-y-4">
                {/* PAPER DOLL 7 EQUIPPED SLOTS */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 shadow-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <span>⚔️</span>
                      <span>Equipo Activo del Héroe (7 Ranuras)</span>
                    </h3>
                    <span className="text-[10px] text-slate-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {Object.values(inventory.equipment).filter(Boolean).length}/7 Equipados
                    </span>
                  </div>

                  {/* Slot Card Renderer Helper */}
                  {(() => {
                    const renderSlotItemCard = (slotKey: EquipmentSlot) => {
                      const config = SLOT_CONFIG.find((s) => s.key === slotKey);
                      if (!config) return null;
                      const item = inventory.equipment[slotKey];

                      return (
                        <div
                          key={slotKey}
                          className={`p-2 rounded-lg border text-xs flex items-start space-x-2.5 transition relative ${
                            item
                              ? 'bg-slate-900/95 border-amber-500/30 hover:border-amber-400/60 shadow-sm'
                              : 'bg-slate-900/40 border-slate-800/80 border-dashed hover:border-slate-700'
                          }`}
                        >
                          {/* Slot Icon Frame */}
                          <div
                            className={`w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-lg border transition ${
                              item
                                ? 'bg-gradient-to-br from-slate-800 to-slate-950 border-amber-400/50 shadow-inner'
                                : 'bg-slate-950/80 border-slate-800 text-slate-600'
                            }`}
                          >
                            {item ? item.icon : config.icon}
                          </div>

                          {/* Item Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                {config.label}
                              </span>
                              {item && (
                                <button
                                  onClick={() => handleUnequip(slotKey)}
                                  title={`Desequipar ${item.name}`}
                                  className="text-[9px] text-rose-400 hover:text-rose-200 bg-rose-950/60 hover:bg-rose-900/80 px-1.5 py-0.5 rounded border border-rose-800/60 transition font-bold"
                                >
                                  Desequipar
                                </button>
                              )}
                            </div>

                            {item ? (
                              <div>
                                <div className="font-black text-amber-300 text-xs leading-snug mt-0.5" title={item.name}>
                                  {item.name}
                                </div>
                                {renderItemTacticalBadges(item)}
                              </div>
                            ) : (
                              <div className="text-slate-600 text-[10px] italic mt-0.5">{config.placeholder}</div>
                            )}
                          </div>
                        </div>
                      );
                    };

                    return (
                      <div className="space-y-2.5">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-stretch">
                          {/* Columna Izquierda (Ataque y Accesorios) */}
                          <div className="md:col-span-5 space-y-2 flex flex-col justify-between">
                            {renderSlotItemCard('weapon')}
                            {renderSlotItemCard('helmet')}
                            {renderSlotItemCard('ring')}
                          </div>

                          {/* Centro: Pedestal del Héroe / Paper Doll */}
                          <div className="md:col-span-2 hidden md:flex flex-col items-center justify-center p-2.5 bg-gradient-to-b from-slate-900/90 to-slate-950 rounded-xl border border-slate-800 shadow-inner relative overflow-hidden">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-800 to-slate-900 border-2 border-amber-400/40 flex items-center justify-center text-3xl shadow-lg relative z-10 animate-pulse">
                              {player.heroClass === 'Guerrero'
                                ? '⚔️'
                                : player.heroClass === 'Mago'
                                ? '🔮'
                                : player.heroClass === 'Pícaro'
                                ? '🗡️'
                                : player.heroClass === 'Paladín'
                                ? '🛡️'
                                : player.heroClass === 'Nigromante'
                                ? '💀'
                                : player.heroClass === 'Arquero'
                                ? '🏹'
                                : '🪓'}
                            </div>

                            <div className="text-center mt-2 relative z-10">
                              <div className="text-[11px] font-black text-amber-300 truncate max-w-[80px]">{player.name}</div>
                              <div className="text-[9px] text-slate-400 font-bold">Nv.{player.level}</div>
                            </div>
                          </div>

                          {/* Columna Derecha (Defensa y Armadura) */}
                          <div className="md:col-span-5 space-y-2 flex flex-col justify-between">
                            {renderSlotItemCard('shield')}
                            {renderSlotItemCard('armor')}
                            {renderSlotItemCard('boots')}
                          </div>
                        </div>

                        {/* Fila Inferior Centrada: Amuleto / Reliquia */}
                        <div className="w-full">
                          {renderSlotItemCard('amulet')}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* INVENTORY ITEMS & CATEGORY FILTERS */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 shadow-lg space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <span>🎒</span>
                      <span>Equipamiento en Mochila ({filteredOwnedEquipment.length})</span>
                    </h3>

                    {/* Filter Pills */}
                    <div className="flex items-center overflow-x-auto gap-1 text-[10px] pb-1 sm:pb-0">
                      {(
                        [
                          { key: 'all', label: 'Todos' },
                          { key: 'weapon', label: '🗡️ Armas' },
                          { key: 'shield', label: '🛡️ Escudos' },
                          { key: 'helmet', label: '👑 Cascos' },
                          { key: 'armor', label: '🥋 Armaduras' },
                          { key: 'boots', label: '👢 Botas' },
                          { key: 'ring', label: '💍 Anillos' },
                          { key: 'amulet', label: '📿 Amuletos' },
                        ] as const
                      ).map((f) => (
                        <button
                          key={f.key}
                          onClick={() => setFilterSlot(f.key)}
                          className={`px-2 py-1 rounded whitespace-nowrap font-bold transition ${
                            filterSlot === f.key
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Owned Equipment List */}
                  {filteredOwnedEquipment.length === 0 ? (
                    <div className="p-8 text-center bg-slate-900/50 rounded-lg border border-slate-800/80 text-xs text-slate-500">
                      No tienes equipo en esta categoría. ¡Visita la tienda o abre cofres!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1">
                      {filteredOwnedEquipment.map((item) => (
                        <div
                          key={item.id}
                          className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 hover:border-amber-500/50 text-xs flex flex-col justify-between transition shadow-sm"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-100 truncate text-xs">
                                {item.icon} {item.name}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold border border-slate-700">
                                {SLOT_CONFIG.find((s) => s.key === item.slot)?.label}
                              </span>
                            </div>

                            <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>

                            {renderItemTacticalBadges(item)}
                          </div>

                          <div className="mt-2.5 flex items-center space-x-1.5 pt-2 border-t border-slate-800/80">
                            <button
                              onClick={() => handleEquip(item)}
                              className="flex-1 py-1 px-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded text-[10px] transition"
                            >
                              Equipar
                            </button>
                            <button
                              onClick={() => handleSellEquipment(item)}
                              className="py-1 px-2 bg-slate-800 hover:bg-amber-950 hover:text-amber-400 text-slate-400 rounded text-[10px] border border-slate-700 transition"
                            >
                              Vender ({Math.max(1, Math.floor(item.price * 0.3))}G)
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONSUMABLES & MATERIALS */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              {/* Materials & Resources */}
              <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 shadow-lg">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2.5 flex items-center space-x-2">
                  <span>🪵</span>
                  <span>Materiales de Recolección & Crafteo</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl">🪵</span>
                      <span className="font-bold text-amber-200">Madera</span>
                    </div>
                    <span className="font-bold text-amber-400">{(player.resources?.wood || 0).toLocaleString()}</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl">🪨</span>
                      <span className="font-bold text-slate-200">Hierro</span>
                    </div>
                    <span className="font-bold text-slate-400">{(player.resources?.stone || 0).toLocaleString()}</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl">🥕</span>
                      <span className="font-bold text-orange-200">Cosechas</span>
                    </div>
                    <span className="font-bold text-orange-400">{(player.resources?.crops || 0).toLocaleString()}</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl">💎</span>
                      <span className="font-bold text-cyan-200">Gemas</span>
                    </div>
                    <span className="font-bold text-cyan-400">{(player.resources?.gems || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-lg">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
                  <span>🧪</span>
                  <span>Pociones, Pergaminos y Consumibles</span>
                </h3>

                {inventory.consumables.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No tienes consumibles en tu bolsa. ¡Cómpralos en la tienda!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {inventory.consumables.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <div className="font-bold text-slate-100 text-xs">
                              {item.name}{' '}
                              <span className="text-amber-400 font-bold ml-1">x{item.quantity}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{item.description}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleUseConsumable(item)}
                          className="py-1 px-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded text-[11px] transition shadow"
                        >
                          Usar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: BAZAR / TIENDA */}
          {activeTab === 'shop' && (
            <div className="space-y-4">
              {/* Category Selector */}
              <div className="flex space-x-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-xs font-bold">
                <button
                  onClick={() => {
                    soundEngine.playSfx('select');
                    setShopCategory('equipment');
                  }}
                  className={`flex-1 py-1.5 rounded transition ${
                    shopCategory === 'equipment'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  🛡️ Armamento y Reliquias
                </button>
                <button
                  onClick={() => {
                    soundEngine.playSfx('select');
                    setShopCategory('consumables');
                  }}
                  className={`flex-1 py-1.5 rounded transition ${
                    shopCategory === 'consumables'
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  🧪 Pociones y Consumibles
                </button>
              </div>

              {/* Shop Consumables */}
              {shopCategory === 'consumables' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SHOP_CONSUMABLES.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <div className="font-bold text-slate-100 text-xs">{item.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{item.description}</div>
                          <div className="text-[10px] font-bold text-amber-400 mt-1">💰 {item.price} G</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBuyConsumable(item)}
                        className="py-1 px-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded text-[11px] transition shadow"
                      >
                        Comprar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Shop Equipment */}
              {shopCategory === 'equipment' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SHOP_EQUIPMENT.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col justify-between text-xs hover:border-slate-700 transition"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-300 text-xs">
                            {item.icon} {item.name}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold">
                            {SLOT_CONFIG.find((s) => s.key === item.slot)?.label}
                          </span>
                        </div>

                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        {renderItemTacticalBadges(item)}
                      </div>

                      <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <span className="text-xs font-black text-amber-400">💰 {item.price} G</span>
                        <button
                          onClick={() => handleBuyEquipment(item)}
                          className="py-1 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded text-[10px] transition shadow"
                        >
                          Comprar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
