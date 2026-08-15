import React, { useState } from 'react';
import { PlayerStats, Inventory, EquipmentItem, ConsumableItem, EquipmentSlot } from '../types';
import { SHOP_CONSUMABLES, SHOP_EQUIPMENT } from '../data/gameData';
import { soundEngine } from '../utils/soundEngine';
import {
  ShoppingBag,
  Shield,
  Swords,
  X,
  Heart,
  Zap,
  Sparkles
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

  // Recalculate player stats with active equipment
  const getCalculatedPlayerStats = (eq: Inventory['equipment']): PlayerStats => {
    let atkBonus = 0;
    let defBonus = 0;
    let hpBonus = 0;
    let mpBonus = 0;
    let spdBonus = 0;

    Object.values(eq).forEach((item) => {
      if (item) {
        if (item.bonusAttack) atkBonus += item.bonusAttack;
        if (item.bonusDefense) defBonus += item.bonusDefense;
        if (item.bonusHp) hpBonus += item.bonusHp;
        if (item.bonusMp) mpBonus += item.bonusMp;
        if (item.bonusSpeed) spdBonus += item.bonusSpeed;
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
                  <div className="mt-4 space-y-2">
                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Atributos del Héroe</span>
                      <span className="text-[9px] text-amber-400 font-normal">Base + Equipo</span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-slate-900/80 rounded-lg border border-slate-800/80 text-xs">
                      <div className="flex items-center space-x-2 text-rose-400 font-bold">
                        <Heart className="w-4 h-4" />
                        <span>Puntos de Vida</span>
                      </div>
                      <span className="font-black text-slate-100">
                        {player.hp} / {player.maxHp}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-slate-900/80 rounded-lg border border-slate-800/80 text-xs">
                      <div className="flex items-center space-x-2 text-sky-400 font-bold">
                        <Zap className="w-4 h-4" />
                        <span>Puntos de Maná</span>
                      </div>
                      <span className="font-black text-slate-100">
                        {player.mp} / {player.maxMp}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-slate-900/80 rounded-lg border border-slate-800/80 text-xs">
                      <div className="flex items-center space-x-2 text-amber-400 font-bold">
                        <Swords className="w-4 h-4" />
                        <span>Poder de Ataque</span>
                      </div>
                      <span className="font-black text-slate-100">{player.attack}</span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-slate-900/80 rounded-lg border border-slate-800/80 text-xs">
                      <div className="flex items-center space-x-2 text-blue-400 font-bold">
                        <Shield className="w-4 h-4" />
                        <span>Defensa & Resistencia</span>
                      </div>
                      <span className="font-black text-slate-100">{player.defense}</span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-slate-900/80 rounded-lg border border-slate-800/80 text-xs">
                      <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                        <Sparkles className="w-4 h-4" />
                        <span>Velocidad de Turno</span>
                      </div>
                      <span className="font-black text-slate-100">{player.speed}</span>
                    </div>
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
                {/* 7 EQUIPPED SLOTS */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 shadow-lg">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                    <span>⚔️</span>
                    <span>Ranuras de Equipamiento (7/7)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SLOT_CONFIG.map(({ key, label, icon, placeholder }) => {
                      const item = inventory.equipment[key];
                      return (
                        <div
                          key={key}
                          className={`p-2 rounded-lg border text-xs flex flex-col justify-between min-h-[75px] transition ${
                            item
                              ? 'bg-slate-900/90 border-amber-500/30'
                              : 'bg-slate-900/40 border-slate-800/80 border-dashed'
                          }`}
                        >
                          <div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1 flex items-center justify-between">
                              <span>
                                {icon} {label}
                              </span>
                              {item && (
                                <button
                                  onClick={() => handleUnequip(key)}
                                  className="text-[9px] text-rose-400 hover:text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 px-1.5 py-0.5 rounded border border-rose-800/60 transition"
                                >
                                  Desequipar
                                </button>
                              )}
                            </div>

                            {item ? (
                              <div>
                                <div className="font-bold text-amber-300 text-xs truncate">
                                  {item.icon} {item.name}
                                </div>
                                <div className="text-[10px] text-emerald-400 font-bold mt-0.5 flex flex-wrap gap-x-1.5">
                                  {item.bonusAttack ? <span>+{item.bonusAttack} Atq</span> : null}
                                  {item.bonusDefense ? <span>+{item.bonusDefense} Def</span> : null}
                                  {item.bonusHp ? <span>+{item.bonusHp} HP</span> : null}
                                  {item.bonusMp ? <span>+{item.bonusMp} MP</span> : null}
                                  {item.bonusSpeed ? <span>+{item.bonusSpeed} Vel</span> : null}
                                </div>
                              </div>
                            ) : (
                              <div className="text-slate-600 text-[11px] italic mt-1">{placeholder}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
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

                            <div className="text-[10px] text-emerald-400 font-bold mt-1.5 flex flex-wrap gap-x-1.5">
                              {item.bonusAttack ? <span>+{item.bonusAttack} Atq</span> : null}
                              {item.bonusDefense ? <span>+{item.bonusDefense} Def</span> : null}
                              {item.bonusHp ? <span>+{item.bonusHp} HP</span> : null}
                              {item.bonusMp ? <span>+{item.bonusMp} MP</span> : null}
                              {item.bonusSpeed ? <span>+{item.bonusSpeed} Vel</span> : null}
                            </div>
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

          {/* TAB 2: CONSUMABLES */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-lg">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
                  <span>🧪</span>
                  <span>Pociones y Elixires Mágicos</span>
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

                        <div className="text-[10px] text-emerald-400 font-bold mt-1.5 flex flex-wrap gap-x-1.5">
                          {item.bonusAttack ? <span>+{item.bonusAttack} Atq</span> : null}
                          {item.bonusDefense ? <span>+{item.bonusDefense} Def</span> : null}
                          {item.bonusHp ? <span>+{item.bonusHp} HP</span> : null}
                          {item.bonusMp ? <span>+{item.bonusMp} MP</span> : null}
                          {item.bonusSpeed ? <span>+{item.bonusSpeed} Vel</span> : null}
                        </div>
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
