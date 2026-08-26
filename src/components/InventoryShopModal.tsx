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
  const [activeTab, setActiveTab] = useState<'inventory' | 'shop' | 'equipment' | 'stats'>(initialTab);
  const [shopCategory, setShopCategory] = useState<'consumables' | 'equipment'>('equipment');
  const [filterSlot, setFilterSlot] = useState<EquipmentSlot | 'all' | 'consumable' | 'material'>('all');
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | ConsumableItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  // Recalculate player stats with active equipment and tactical bonuses
  const getCalculatedPlayerStats = (eq: Inventory['equipment']): PlayerStats => {
    const classBase = HERO_CLASSES[player.heroClass]?.baseStats || {
      hp: 100,
      maxHp: 100,
      mp: 50,
      maxMp: 50,
      attack: 15,
      magicAttack: 10,
      defense: 10,
      magicDefense: 10,
      speed: 10,
      accuracy: 95,
      evasion: 5,
      critRate: 10,
      critDamage: 175,
      blockRate: 0,
      armorPenetration: 0,
      lifesteal: 0,
      mpRegen: 0,
      hpRegen: 0,
      magicFind: 0,
      goldBonus: 0,
      expBonus: 0,
    };

    let atkBonus = 0;
    let matkBonus = 0;
    let defBonus = 0;
    let mdefBonus = 0;
    let hpBonus = 0;
    let mpBonus = 0;
    let spdBonus = 0;
    let accBonus = 0;
    let evaBonus = 0;
    let critBonus = 0;
    let critDmgBonus = 0;
    let blockBonus = 0;
    let armorPenBonus = 0;
    let lifestealBonus = 0;
    let mpRegenBonus = 0;
    let hpRegenBonus = 0;
    let magicFindBonus = 0;
    let goldBonusBonus = 0;
    let expBonusBonus = 0;

    Object.values(eq).forEach((item) => {
      if (item) {
        if (item.bonusAttack) atkBonus += item.bonusAttack;
        if (item.bonusMagicAttack) matkBonus += item.bonusMagicAttack;
        if (item.bonusDefense) defBonus += item.bonusDefense;
        if (item.bonusMagicDefense) mdefBonus += item.bonusMagicDefense;
        if (item.bonusHp) hpBonus += item.bonusHp;
        if (item.bonusMp) mpBonus += item.bonusMp;
        if (item.bonusSpeed) spdBonus += item.bonusSpeed;
        if (item.bonusAccuracy) accBonus += item.bonusAccuracy;
        if (item.bonusEvasion) evaBonus += item.bonusEvasion;
        if (item.bonusCritRate) critBonus += item.bonusCritRate;
        if (item.bonusCritDamage) critDmgBonus += item.bonusCritDamage;
        if (item.bonusBlockRate) blockBonus += item.bonusBlockRate;
        if (item.bonusArmorPenetration) armorPenBonus += item.bonusArmorPenetration;
        if (item.bonusLifesteal) lifestealBonus += item.bonusLifesteal;
        if (item.bonusMpRegen) mpRegenBonus += item.bonusMpRegen;
        if (item.bonusHpRegen) hpRegenBonus += item.bonusHpRegen;
        if (item.bonusMagicFind) magicFindBonus += item.bonusMagicFind;
        if (item.bonusGoldBonus) goldBonusBonus += item.bonusGoldBonus;
        if (item.bonusExpBonus) expBonusBonus += item.bonusExpBonus;
      }
    });

    const baseMaxHp = (classBase.maxHp || 100) + (player.level - 1) * 15;
    const baseMaxMp = (classBase.maxMp || 50) + (player.level - 1) * 8;
    const newMaxHp = baseMaxHp + hpBonus;
    const newMaxMp = baseMaxMp + mpBonus;

    return {
      ...player,
      maxHp: newMaxHp,
      hp: Math.min(player.hp, newMaxHp),
      maxMp: newMaxMp,
      mp: Math.min(player.mp, newMaxMp),
      attack: (classBase.attack || 15) + (player.level - 1) * 2 + atkBonus,
      magicAttack: (classBase.magicAttack || 10) + (player.level - 1) * 2 + matkBonus,
      defense: (classBase.defense || 10) + (player.level - 1) * 1.5 + defBonus,
      magicDefense: (classBase.magicDefense || 10) + (player.level - 1) * 1.5 + mdefBonus,
      speed: (classBase.speed || 10) + spdBonus,
      accuracy: Math.min(100, (classBase.accuracy ?? 95) + accBonus),
      evasion: (classBase.evasion ?? 5) + evaBonus,
      critRate: (classBase.critRate ?? 10) + critBonus,
      critDamage: (classBase.critDamage ?? 175) + critDmgBonus,
      blockRate: Math.min(75, (classBase.blockRate ?? 0) + blockBonus),
      armorPenetration: (classBase.armorPenetration ?? 0) + armorPenBonus,
      lifesteal: (classBase.lifesteal ?? 0) + lifestealBonus,
      mpRegen: (classBase.mpRegen ?? 0) + mpRegenBonus,
      hpRegen: (classBase.hpRegen ?? 0) + hpRegenBonus,
      magicFind: (classBase.magicFind ?? 0) + magicFindBonus,
      goldBonus: (classBase.goldBonus ?? 0) + goldBonusBonus,
      expBonus: (classBase.expBonus ?? 0) + expBonusBonus,
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

  // Sell Item for 10% value (Realistic Demanding RPG Resale Economy)
  const handleSellEquipment = (item: EquipmentItem) => {
    soundEngine.playSfx('buy');
    const sellPrice = Math.max(1, Math.floor(item.price * 0.10));
    onUpdatePlayerAndInventory(
      { ...player, gold: player.gold + sellPrice },
      { ...inventory, ownedEquipment: inventory.ownedEquipment.filter((i) => i.id !== item.id) }
    );
    showToast(`💰 Vendiste ${item.name} por +${sellPrice} G`);
  };

  const filteredOwnedEquipment = inventory.ownedEquipment.filter((item) => {
    if (filterSlot === 'all') return true;
    if (filterSlot === 'consumable' || filterSlot === 'material') return false;
    return item.slot === filterSlot;
  });

  const renderItemTacticalBadges = (item: EquipmentItem) => (
    <div className="text-[10px] font-bold mt-1.5 flex flex-wrap gap-1">
      {item.bonusAttack ? <span className="bg-amber-950/60 text-amber-300 border border-amber-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">⚔️ +{item.bonusAttack} Atq</span> : null}
      {item.bonusMagicAttack ? <span className="bg-purple-950/60 text-purple-300 border border-purple-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">🪄 +{item.bonusMagicAttack} Magia</span> : null}
      {item.bonusDefense ? <span className="bg-blue-950/60 text-blue-300 border border-blue-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">🛡️ +{item.bonusDefense} Def</span> : null}
      {item.bonusMagicDefense ? <span className="bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">🔮 +{item.bonusMagicDefense} Def.Mág</span> : null}
      {item.bonusHp ? <span className="bg-rose-950/60 text-rose-300 border border-rose-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">❤️ +{item.bonusHp} HP</span> : null}
      {item.bonusMp ? <span className="bg-sky-950/60 text-sky-300 border border-sky-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">💧 +{item.bonusMp} MP</span> : null}
      {item.bonusSpeed ? <span className="bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">🌀 +{item.bonusSpeed} Vel</span> : null}
      {item.bonusAccuracy ? <span className="bg-amber-900/40 text-amber-200 border border-amber-700/50 px-1.5 py-0.5 rounded flex items-center gap-0.5">🎯 +{item.bonusAccuracy}% Prec</span> : null}
      {item.bonusEvasion ? <span className="bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">💨 +{item.bonusEvasion}% Eva</span> : null}
      {item.bonusCritRate ? <span className="bg-yellow-950/60 text-yellow-300 border border-yellow-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">💥 +{item.bonusCritRate}% Crít</span> : null}
      {item.bonusCritDamage ? <span className="bg-orange-950/60 text-orange-300 border border-orange-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">⚡ +{item.bonusCritDamage}% Dño Crít</span> : null}
      {item.bonusBlockRate ? <span className="bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">🛡️ +{item.bonusBlockRate}% Bloqueo</span> : null}
      {item.bonusArmorPenetration ? <span className="bg-rose-950/60 text-rose-300 border border-rose-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">🗡️ +{item.bonusArmorPenetration}% Perforación</span> : null}
      {item.bonusLifesteal ? <span className="bg-red-950/70 text-red-300 border border-red-800/70 px-1.5 py-0.5 rounded flex items-center gap-0.5">🩸 +{item.bonusLifesteal}% Robo</span> : null}
      {item.bonusMpRegen ? <span className="bg-teal-950/60 text-teal-300 border border-teal-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">✨ +{item.bonusMpRegen} MP/t</span> : null}
      {item.bonusHpRegen ? <span className="bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">🌿 +{item.bonusHpRegen} HP/t</span> : null}
      {item.bonusMagicFind ? <span className="bg-amber-900/60 text-amber-300 border border-amber-700/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">🌟 +{item.bonusMagicFind}% Drop</span> : null}
      {item.bonusGoldBonus ? <span className="bg-yellow-900/60 text-yellow-300 border border-yellow-700/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">🪙 +{item.bonusGoldBonus}% Oro</span> : null}
      {item.bonusExpBonus ? <span className="bg-blue-900/60 text-blue-300 border border-blue-700/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">📖 +{item.bonusExpBonus}% EXP</span> : null}
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-1 sm:p-4 z-50 font-mono select-none"
      style={{
        paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0.75rem))',
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))',
        paddingLeft: 'max(0.5rem, env(safe-area-inset-left, 0.5rem))',
        paddingRight: 'max(0.5rem, env(safe-area-inset-right, 0.5rem))',
      }}
    >
      <div className="bg-[#0e0d18] border-2 border-amber-600/70 rounded-2xl max-w-5xl w-full h-[88dvh] sm:h-[85vh] max-h-[92dvh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-1.5 min-w-0">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0" />
            <h2 className="text-xs sm:text-lg font-bold text-amber-300 truncate">
              {activeTab === 'shop' ? '🛒 Bazar & Forja' : '🎒 Personaje & Equipo'}
            </h2>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-[11px] sm:text-xs bg-slate-800 text-amber-400 px-2 py-0.5 sm:px-3 sm:py-1 rounded border border-amber-500/30 font-bold shadow-inner">
              💰 {player.gold.toLocaleString()} G
            </span>
            <button
              onClick={() => {
                soundEngine.playSfx('select');
                onClose();
              }}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-100 transition"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4 Direct Navigation Tabs (Estilo RPG Ergonómico Móvil) */}
        <div className="flex border-b border-slate-800 bg-slate-950/70 p-1 text-xs font-bold gap-1 flex-shrink-0">
          <button
            onClick={() => {
              soundEngine.playSfx('select');
              setActiveTab('equipment');
            }}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl transition flex items-center justify-center space-x-1 min-h-[40px] ${
              activeTab === 'equipment' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <span>⚔️</span>
            <span className="text-[11px] sm:text-xs">Equipo ({Object.values(inventory.equipment).filter(Boolean).length}/7)</span>
          </button>
          <button
            onClick={() => {
              soundEngine.playSfx('select');
              setActiveTab('inventory');
            }}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl transition flex items-center justify-center space-x-1 min-h-[40px] ${
              activeTab === 'inventory' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <span>🎒</span>
            <span className="text-[11px] sm:text-xs">Mochila ({filteredOwnedEquipment.length + inventory.consumables.reduce((a, c) => a + c.quantity, 0)})</span>
          </button>
          <button
            onClick={() => {
              soundEngine.playSfx('select');
              setActiveTab('stats');
            }}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl transition flex items-center justify-center space-x-1 min-h-[40px] ${
              activeTab === 'stats' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <span>👤</span>
            <span className="text-[11px] sm:text-xs">Stats</span>
          </button>
          <button
            onClick={() => {
              soundEngine.playSfx('select');
              setActiveTab('shop');
            }}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl transition flex items-center justify-center space-x-1 min-h-[40px] ${
              activeTab === 'shop' ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <span>🛒</span>
            <span className="text-[11px] sm:text-xs">Bazar</span>
          </button>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="bg-amber-400 text-slate-950 px-4 py-1.5 text-center text-xs font-black tracking-wide border-b border-amber-600 shadow-md animate-pulse">
            {toastMessage}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 p-2.5 sm:p-4 overflow-hidden flex flex-col min-h-0">
          {/* TAB 1: EQUIPMENT (7 SLOTS VISUALES CON BOTONES GRANDES) */}
          {activeTab === 'equipment' && (
            <div className="space-y-3 h-full overflow-y-auto pr-1">
              {/* Hero Showcase Header */}
              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-slate-900 border border-amber-400/50 flex items-center justify-center text-xl flex-shrink-0">
                    {player.heroClass === 'Guerrero' ? '⚔️' : player.heroClass === 'Mago' ? '🪄' : '🗡️'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-amber-300 truncate">{player.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-bold">
                        Nv.{player.level}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {player.heroClass} · Armamento Activo
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-black text-amber-300 bg-amber-950/70 border border-amber-800/70 px-2.5 py-1 rounded-lg flex-shrink-0">
                  ⚔️ {Object.values(inventory.equipment).filter(Boolean).length}/7 Equipados
                </span>
              </div>

              {/* 7 Equipped Slots Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SLOT_CONFIG.map((config) => {
                  const item = inventory.equipment[config.key];
                  return (
                    <div
                      key={config.key}
                      className={`p-2.5 rounded-xl border flex items-center gap-3 transition min-h-[56px] ${
                        item
                          ? 'bg-slate-950 border-amber-500/40 shadow-sm'
                          : 'bg-slate-950/50 border-dashed border-slate-800'
                      }`}
                    >
                      {/* Slot Icon */}
                      <div
                        className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center text-xl border ${
                          item
                            ? 'bg-gradient-to-br from-slate-800 to-slate-950 border-amber-400/60 shadow'
                            : 'bg-slate-900 border-slate-800 text-slate-600'
                        }`}
                      >
                        {item ? item.icon : config.icon}
                      </div>

                      {/* Slot Info & Actions */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {config.label}
                        </div>
                        <div className="text-xs font-black text-amber-300 truncate">
                          {item ? item.name : config.placeholder}
                        </div>
                        {item && (
                          <div className="flex flex-wrap gap-1 mt-0.5 text-[9px] text-emerald-400 font-bold">
                            {item.bonusAttack ? <span>+{item.bonusAttack} ATK</span> : null}
                            {item.bonusDefense ? <span>+{item.bonusDefense} DEF</span> : null}
                            {item.bonusHp ? <span>+{item.bonusHp} HP</span> : null}
                            {item.bonusMp ? <span>+{item.bonusMp} MP</span> : null}
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      {item ? (
                        <button
                          onClick={() => handleUnequip(config.key)}
                          className="px-2.5 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-lg text-xs font-bold transition flex-shrink-0"
                          title="Desequipar"
                        >
                          Quitar
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setFilterSlot(config.key);
                            setActiveTab('inventory');
                          }}
                          className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 rounded-lg text-xs font-bold transition flex-shrink-0"
                        >
                          Equipar
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: STATS (HOJA COMPLETA DE 19 ATRIBUTOS TÁCTICOS POR ROLES) */}
          {activeTab === 'stats' && (
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3.5 h-full overflow-y-auto pr-1">
              {/* Header: Hero Badge & Level */}
              <div className="flex items-center space-x-3 pb-2.5 border-b border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-2xl shadow-md border border-amber-300/40 flex-shrink-0">
                  {player.heroClass === 'Guerrero' ? '⚔️' : player.heroClass === 'Mago' ? '🪄' : player.heroClass === 'Pícaro' ? '🗡️' : player.heroClass === 'Paladín' ? '🛡️' : player.heroClass === 'Nigromante' ? '💀' : player.heroClass === 'Arquero' ? '🏹' : '🪓'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-amber-300 text-sm sm:text-base truncate">{player.name}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">
                      {player.heroClass}
                    </span>
                  </div>
                  <div className="text-xs text-amber-400 font-bold mt-0.5">
                    Nivel {player.level} · {player.score.toLocaleString()} Puntos de Rango
                  </div>
                </div>
              </div>

              {/* EXP Bar */}
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1">
                  <span>Experiencia del Héroe</span>
                  <span>{player.exp} / {player.maxExp} EXP</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.round((player.exp / player.maxExp) * 100))}%` }}
                  />
                </div>
              </div>

              {/* PANEL 1: ⚔️ PODER OFENSIVO */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-black text-rose-400 uppercase tracking-wider flex items-center gap-1">
                  <span>⚔️</span>
                  <span>Poder Ofensivo & Ataque</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-bold flex items-center gap-1">⚔️ Ataque Físico</span>
                    <span className="font-black text-rose-300 text-sm">{player.attack}</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-bold flex items-center gap-1">🪄 Poder Mágico</span>
                    <span className="font-black text-purple-300 text-sm">{player.magicAttack ?? 10}</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-bold flex items-center gap-1">💥 Golpe Crítico</span>
                    <span className="font-black text-yellow-300 text-sm">{player.critRate ?? 10}%</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-bold flex items-center gap-1">⚡ Daño Crítico</span>
                    <span className="font-black text-orange-300 text-sm">{player.critDamage ?? 175}%</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-bold flex items-center gap-1">🎯 Precisión</span>
                    <span className="font-black text-amber-300 text-sm">{player.accuracy ?? 95}%</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-bold flex items-center gap-1">🗡️ Perforación</span>
                    <span className="font-black text-red-400 text-sm">{player.armorPenetration ?? 0}%</span>
                  </div>
                </div>
              </div>

              {/* PANEL 2: 🛡️ DEFENSA & MITIGACIÓN */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-black text-sky-400 uppercase tracking-wider flex items-center gap-1">
                  <span>🛡️</span>
                  <span>Defensa & Mitigación de Daño</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-bold flex items-center gap-1">🛡️ Def. Física</span>
                    <span className="font-black text-blue-300 text-sm">{player.defense}</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-bold flex items-center gap-1">🔮 Def. Mágica</span>
                    <span className="font-black text-indigo-300 text-sm">{player.magicDefense ?? 10}</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-bold flex items-center gap-1">🛡️ Bloqueo</span>
                    <span className="font-black text-cyan-300 text-sm">{player.blockRate ?? 0}%</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-bold flex items-center gap-1">💨 Evasión</span>
                    <span className="font-black text-teal-300 text-sm">{player.evasion ?? 5}%</span>
                  </div>
                </div>
              </div>

              {/* PANEL 3: ⚡ AGILIDAD & SUSTENTO */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <span>⚡</span>
                  <span>Agilidad, Regeneración & Sustento</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-bold flex items-center gap-1">🌀 Velocidad</span>
                    <span className="font-black text-emerald-300 text-sm">{player.speed}</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-bold flex items-center gap-1">🩸 Robo Vida</span>
                    <span className="font-black text-rose-300 text-sm">{player.lifesteal ?? 0}%</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-bold flex items-center gap-1">✨ Regen MP</span>
                    <span className="font-black text-sky-300 text-sm">+{player.mpRegen ?? 0}/t</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-bold flex items-center gap-1">🌿 Regen HP</span>
                    <span className="font-black text-green-300 text-sm">+{player.hpRegen ?? 0}/t</span>
                  </div>
                </div>
              </div>

              {/* PANEL 4: 🌟 FORTUNA & PROGRESIÓN */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <span>🌟</span>
                  <span>Fortuna, Economía & Progresión</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-bold flex items-center gap-1">🌟 Drop Raro</span>
                    <span className="font-black text-amber-300 text-sm">+{player.magicFind ?? 0}%</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-bold flex items-center gap-1">🪙 Bono Oro</span>
                    <span className="font-black text-yellow-300 text-sm">+{player.goldBonus ?? 0}%</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-bold flex items-center gap-1">📖 Bono EXP</span>
                    <span className="font-black text-blue-300 text-sm">+{player.expBonus ?? 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY (GRID RPG 4x7 + WEAPON / ITEM DETAIL CARD - IMAGEN 2 & 3) */}
          {activeTab === 'inventory' && (
            <div className="flex flex-col lg:flex-row gap-3 h-full flex-1 min-h-0 overflow-hidden">
              {/* LEFT COLUMN: 4x7 ITEM GRID */}
              <div className="flex-1 flex flex-col gap-2 min-h-0 h-full overflow-hidden">
                {/* Category Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 text-[10px]">
                  {[
                    { key: 'all', label: '📦 Todo' },
                    { key: 'weapon', label: '🗡️ Armas' },
                    { key: 'armor', label: '🥋 Armaduras' },
                    { key: 'shield', label: '🛡️ Escudos' },
                    { key: 'helmet', label: '👑 Cascos' },
                    { key: 'boots', label: '👢 Botas' },
                    { key: 'ring', label: '💍 Anillos' },
                    { key: 'amulet', label: '📿 Amuletos' },
                    { key: 'consumable', label: '🧪 Pociones' },
                    { key: 'material', label: '🪵 Materiales' },
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => {
                        soundEngine.playSfx('select');
                        setFilterSlot(f.key as any);
                      }}
                      className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-bold transition ${
                        filterSlot === f.key
                          ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                          : 'bg-[#141224] text-slate-400 hover:bg-[#1f1c38] border border-[#2a243d]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* 4x7 Grid Container (Biselado de Bronce) */}
                <div className="bg-[#0b0a14] p-3 rounded-xl border-2 border-amber-600/50 shadow-inner flex-1 min-h-0 overflow-y-auto">
                  {/* Empty state check */}
                  {filterSlot !== 'all' &&
                  filterSlot !== 'consumable' &&
                  filterSlot !== 'material' &&
                  filteredOwnedEquipment.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 text-xs font-mono">
                      <span className="text-3xl mb-2 opacity-40">🎒</span>
                      <span>No tienes ningún objeto en esta categoría.</span>
                      <span className="text-[10px] text-amber-500/60 mt-1">¡Visita la forja o el bazar para adquirirlo!</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {/* Consumables Items (Only on 'all' or 'consumable') */}
                      {(filterSlot === 'all' || filterSlot === 'consumable') &&
                        inventory.consumables.map((item) => {
                          const isSelected = (selectedItem as any)?.id === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                soundEngine.playSfx('select');
                                setSelectedItem(item as any);
                              }}
                              className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex flex-col items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-[#221c3b] border-2 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)] scale-105'
                                  : 'bg-[#141224] hover:bg-[#1a1730] border border-[#2a243d] hover:border-amber-500/60'
                              }`}
                            >
                              <span className="text-2xl filter drop-shadow">{item.icon}</span>
                              <span className="absolute bottom-1 right-1.5 text-[9px] font-mono font-black text-amber-300 bg-[#06060c] px-1 rounded border border-amber-500/60">
                                x{item.quantity}
                              </span>
                            </button>
                          );
                        })}

                      {/* Equipment Items */}
                      {filteredOwnedEquipment.map((item) => {
                        const isEquipped = Object.values(inventory.equipment).some((e) => e?.id === item.id);
                        const isSelected = (selectedItem as any)?.id === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              soundEngine.playSfx('select');
                              setSelectedItem(item);
                            }}
                            className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex flex-col items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-[#221c3b] border-2 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)] scale-105'
                              : isEquipped
                              ? 'bg-[#0f241d] border-2 border-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                              : 'bg-[#141224] hover:bg-[#1a1730] border border-[#2a243d] hover:border-amber-500/60'
                          }`}
                        >
                          <span className="text-2xl filter drop-shadow">{item.icon}</span>
                          {isEquipped && (
                            <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                          )}
                          <span className="absolute bottom-1 right-1 text-[8px] font-bold text-amber-200/90 truncate max-w-[48px]">
                            {item.bonusAttack ? `+${item.bonusAttack}` : item.bonusDefense ? `+${item.bonusDefense}` : ''}
                          </span>
                        </button>
                      );
                    })}

                    {/* Material Resources Badges (Only on 'all' or 'material') */}
                    {(filterSlot === 'all' || filterSlot === 'material') && (
                      <>
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#141224] border border-[#2a243d] flex flex-col items-center justify-center relative">
                          <span className="text-xl">🪵</span>
                          <span className="text-[9px] text-amber-200 font-bold mt-0.5">Madera</span>
                          <span className="absolute bottom-0.5 right-1 text-[8px] font-mono text-amber-400">
                            {player.resources?.wood || 0}
                          </span>
                        </div>
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#141224] border border-[#2a243d] flex flex-col items-center justify-center relative">
                          <span className="text-xl">🪨</span>
                          <span className="text-[9px] text-slate-200 font-bold mt-0.5">Hierro</span>
                          <span className="absolute bottom-0.5 right-1 text-[8px] font-mono text-slate-400">
                            {player.resources?.stone || 0}
                          </span>
                        </div>
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#141224] border border-[#2a243d] flex flex-col items-center justify-center relative">
                          <span className="text-xl">🥕</span>
                          <span className="text-[9px] text-orange-200 font-bold mt-0.5">Trigo</span>
                          <span className="absolute bottom-0.5 right-1 text-[8px] font-mono text-orange-400">
                            {player.resources?.crops || 0}
                          </span>
                        </div>
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#141224] border border-[#2a243d] flex flex-col items-center justify-center relative">
                          <span className="text-xl">💎</span>
                          <span className="text-[9px] text-cyan-200 font-bold mt-0.5">Gemas</span>
                          <span className="absolute bottom-0.5 right-1 text-[8px] font-mono text-cyan-400">
                            {player.resources?.gems || 0}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  )}
                </div>

                {/* Footer Balance Bar (Estilo Imagen 3) */}
                <div className="flex items-center justify-between bg-[#0b0a14] px-3 py-2 rounded-xl border border-[#2a243d] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">🪙 Monedas de Oro:</span>
                    <span className="font-black text-amber-300 font-mono text-sm">{player.gold.toLocaleString()} G</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">💎 Gemas:</span>
                    <span className="font-black text-cyan-300 font-mono text-sm">{(player.resources?.gems || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: 🗡️ WEAPON & ITEM DETAIL CARD (DIRECTAMENTE ESTILO IMAGEN 2 & 3) */}
              <div className="w-full lg:w-80 bg-[#0e0d18] border-2 border-amber-600/70 rounded-xl p-3.5 flex flex-col justify-between gap-3 shadow-2xl flex-shrink-0 h-auto lg:h-full overflow-y-auto">
                {selectedItem ? (
                  <div className="space-y-3">
                    {/* Header Card: Name & Stars */}
                    <div className="border-b border-amber-600/40 pb-2">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-black text-amber-300 truncate">{selectedItem.name}</span>
                        <span className="text-xs text-yellow-400 tracking-tighter">★★★★★</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                        {(selectedItem as any).slot
                          ? `Ranura: ${SLOT_CONFIG.find((s) => s.key === (selectedItem as any).slot)?.label}`
                          : 'Objeto Consumible'}
                      </div>
                    </div>

                    {/* Big Showcase Box */}
                    <div className="w-full h-20 rounded-xl bg-gradient-to-b from-[#1c1830] to-[#0a0914] border border-amber-500/40 flex items-center justify-center shadow-inner">
                      <span className="text-4xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                        {selectedItem.icon}
                      </span>
                    </div>

                    {/* Stats & Attributes Box */}
                    <div className="bg-[#141224] p-2.5 rounded-lg border border-[#2a243d] space-y-1.5 text-xs">
                      {(selectedItem as any).bonusAttack && (
                        <div className="flex justify-between items-center text-rose-300 font-bold">
                          <span>⚔️ Daño de Ataque:</span>
                          <span className="font-mono text-sm">+{ (selectedItem as any).bonusAttack }</span>
                        </div>
                      )}
                      {(selectedItem as any).bonusDefense && (
                        <div className="flex justify-between items-center text-blue-300 font-bold">
                          <span>🛡️ Defensa Física:</span>
                          <span className="font-mono text-sm">+{ (selectedItem as any).bonusDefense }</span>
                        </div>
                      )}
                      {(selectedItem as any).bonusHp && (
                        <div className="flex justify-between items-center text-emerald-300 font-bold">
                          <span>❤️ Vitalidad Máxima:</span>
                          <span className="font-mono text-sm">+{ (selectedItem as any).bonusHp } HP</span>
                        </div>
                      )}
                      {(selectedItem as any).bonusMp && (
                        <div className="flex justify-between items-center text-cyan-300 font-bold">
                          <span>💧 Reserva de Maná:</span>
                          <span className="font-mono text-sm">+{ (selectedItem as any).bonusMp } MP</span>
                        </div>
                      )}
                      {(selectedItem as any).bonusSpeed && (
                        <div className="flex justify-between items-center text-amber-300 font-bold">
                          <span>🌀 Agilidad / Velocidad:</span>
                          <span className="font-mono text-sm">+{ (selectedItem as any).bonusSpeed }</span>
                        </div>
                      )}
                      <p className="text-[10px] text-slate-300 leading-relaxed pt-1 border-t border-slate-800">
                        {selectedItem.description}
                      </p>
                    </div>

                    {/* Passive Ability Banner */}
                    <div className="p-2 bg-amber-950/40 border border-amber-500/40 rounded-lg text-[10px] text-amber-200 italic">
                      ✨ Otorga bonificación de combate directa al portador en todas las zonas de Aethelgard.
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-1">
                      {(selectedItem as any).slot ? (
                        <>
                          {Object.values(inventory.equipment).some((e) => e?.id === selectedItem.id) ? (
                            <button
                              onClick={() => handleUnequip((selectedItem as any).slot)}
                              className="flex-1 py-2 bg-rose-700 hover:bg-rose-600 text-slate-950 font-black rounded-lg text-xs transition shadow-md"
                            >
                              Quitar
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEquip(selectedItem as EquipmentItem)}
                              className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg text-xs transition shadow-md"
                            >
                              Equipar
                            </button>
                          )}
                          <button
                            onClick={() => handleSellEquipment(selectedItem as EquipmentItem)}
                            className="px-3 py-2 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/50 rounded-lg text-xs font-bold transition"
                            title="Vender"
                          >
                            🪙 Vender
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleUseConsumable(selectedItem as ConsumableItem)}
                          className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg text-xs transition shadow-md"
                        >
                          Consumir
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500 text-xs">
                    <span className="text-3xl mb-2 opacity-50">🗡️</span>
                    <span>Selecciona un objeto de la cuadrícula para inspeccionar sus estadísticas de combate.</span>
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
