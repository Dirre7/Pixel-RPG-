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
    <div
      className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-1 sm:p-4 z-50 font-mono select-none"
      style={{
        paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0.75rem))',
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))',
        paddingLeft: 'max(0.5rem, env(safe-area-inset-left, 0.5rem))',
        paddingRight: 'max(0.5rem, env(safe-area-inset-right, 0.5rem))',
      }}
    >
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl max-w-5xl w-full max-h-[96dvh] flex flex-col shadow-2xl overflow-hidden">
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
        <div className="flex-1 p-2.5 sm:p-4 overflow-y-auto">
          {/* TAB 1: EQUIPMENT (7 SLOTS VISUALES CON BOTONES GRANDES) */}
          {activeTab === 'equipment' && (
            <div className="space-y-3">
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

          {/* TAB 2: STATS (HOJA COMPLETA DE ATRIBUTOS) */}
          {activeTab === 'stats' && (
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3">
              {/* Header */}
              <div className="flex items-center space-x-3 pb-2.5 border-b border-slate-800">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-2xl shadow-md border border-amber-300/40 flex-shrink-0">
                  {player.heroClass === 'Guerrero' ? '⚔️' : player.heroClass === 'Mago' ? '🪄' : '🗡️'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-amber-300 text-sm">{player.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-bold">
                      {player.heroClass}
                    </span>
                  </div>
                  <div className="text-xs text-amber-400 font-bold mt-0.5">Nivel {player.level} · {player.score.toLocaleString()} Puntos</div>
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

              {/* Primary Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                    <Heart className="w-4 h-4" />
                    <span>Vida (HP)</span>
                  </div>
                  <span className="font-black text-slate-100 text-sm">{player.hp}/{player.maxHp}</span>
                </div>

                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sky-400 font-bold text-xs">
                    <Zap className="w-4 h-4" />
                    <span>Maná (MP)</span>
                  </div>
                  <span className="font-black text-slate-100 text-sm">{player.mp}/{player.maxMp}</span>
                </div>

                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                    <Swords className="w-4 h-4" />
                    <span>Ataque</span>
                  </div>
                  <span className="font-black text-slate-100 text-sm">{player.attack}</span>
                </div>

                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
                    <Shield className="w-4 h-4" />
                    <span>Defensa</span>
                  </div>
                  <span className="font-black text-slate-100 text-sm">{player.defense}</span>
                </div>

                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>Velocidad</span>
                  </div>
                  <span className="font-black text-slate-100 text-sm">{player.speed}</span>
                </div>

                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-yellow-300 font-bold text-xs">
                    <Flame className="w-4 h-4" />
                    <span>Crítico</span>
                  </div>
                  <span className="font-black text-yellow-200 text-sm">{player.critRate ?? 10}%</span>
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

              {/* Owned Equipment in Backpack */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-lg space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <span>🎒</span>
                    <span>Equipamiento Almacenado ({filteredOwnedEquipment.length})</span>
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

                {filteredOwnedEquipment.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No tienes equipo en esta categoría. ¡Visita la tienda o forja nuevas armas!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredOwnedEquipment.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between gap-2"
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-xl flex-shrink-0">
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-amber-300 text-xs truncate">{item.name}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-bold">
                                {SLOT_CONFIG.find((s) => s.key === item.slot)?.label.split('/')[0]}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{item.description}</p>
                            {renderItemTacticalBadges(item)}
                          </div>
                        </div>

                        <div className="flex gap-1.5 pt-1.5 border-t border-slate-800/80">
                          <button
                            onClick={() => handleEquip(item)}
                            className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-xs transition"
                          >
                            Equipar
                          </button>
                          <button
                            onClick={() => handleSellEquipment(item)}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-amber-950 hover:text-amber-300 text-slate-400 font-bold rounded-lg text-xs transition"
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
