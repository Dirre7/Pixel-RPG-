import React from 'react';
import { Inventory, PlayerStats } from '../types';
import {
  ShoppingBag,
  Scroll,
  Heart,
  Droplet,
  Sparkles,
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface BottomActionBarProps {
  player: PlayerStats;
  inventory: Inventory;
  onOpenInventory: () => void;
  onOpenQuests: () => void;
  onOpenShop: () => void;
  onOpenSettings: () => void;
  onUseConsumable: (consumableId: string) => void;
  onShowToast: (msg: string) => void;
  onTeleportToTown?: () => void;
}

const BottomActionBarComponent: React.FC<BottomActionBarProps> = ({
  player,
  inventory,
  onOpenInventory,
  onOpenQuests,
  onOpenShop,
  onUseConsumable,
  onShowToast,
  onTeleportToTown,
}) => {
  const hpItem = inventory.consumables.find((c) => c.effect === 'heal_hp' || c.id.includes('hp'));
  const mpItem = inventory.consumables.find((c) => c.effect === 'heal_mp' || c.id.includes('mp'));
  const scrollItem = inventory.consumables.find((c) => c.effect === 'teleport' || c.id.includes('teleport') || c.id.includes('scroll'));
  const elixirItem = inventory.consumables.find((c) => c.effect === 'heal_all' || c.id.includes('elixir') || c.id.includes('divine'));

  const hpCount = hpItem?.quantity || 0;
  const mpCount = mpItem?.quantity || 0;
  const scrollCount = scrollItem?.quantity || 0;
  const elixirCount = elixirItem?.quantity || 0;
  const cropsCount = player.resources?.crops || 0;
  const meatCount = Math.floor(cropsCount / 2);

  const hpPercent = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
  const mpPercent = Math.max(0, Math.min(100, (player.mp / player.maxMp) * 100));

  // 8 Quick Action Hotbar Slots (Directamente inspirado en las imágenes de referencia)
  const hotbarSlots = [
    { key: '1', id: 'potion_hp', name: 'Poción de Vida', icon: '🧪', count: hpCount, color: 'text-red-400', type: 'hp' },
    { key: '2', id: 'potion_mp', name: 'Poción de Maná', icon: '💧', count: mpCount, color: 'text-blue-400', type: 'mp' },
    { key: '3', id: 'crops_bread', name: 'Pan de Trigo (+35 HP)', icon: '🍞', count: cropsCount, color: 'text-amber-300', type: 'bread' },
    { key: '4', id: 'scroll_return', name: 'Pergamino de Retorno', icon: '📜', count: scrollCount, color: 'text-purple-300', type: 'teleport' },
    { key: '5', id: 'roasted_meat', name: 'Carne Asada (+50 HP)', icon: '🥩', count: meatCount, color: 'text-orange-400', type: 'meat' },
    { key: '6', id: 'divine_elixir', name: 'Elixir Sagrado (100%)', icon: '🏺', count: elixirCount, color: 'text-yellow-300', type: 'elixir' },
    { key: 'I', id: 'open_inv', name: 'Mochila & Equipo', icon: '🎒', count: 0, color: 'text-amber-400', type: 'inventory' },
    { key: 'M', id: 'open_shop', name: 'Bazar / Tienda', icon: '🛒', count: 0, color: 'text-emerald-400', type: 'shop' },
  ];

  return (
    <div className="flex flex-col items-center gap-1.5 pointer-events-auto select-none font-mono">
      {/* 🌟 1. DUAL HEALTH & MANA STATUS BARS (Estilo Dark Fantasy & Bronze Beveled) */}
      <div className="flex items-center gap-2 bg-[#0e0d18]/95 border-2 border-amber-600/70 p-1.5 sm:p-2 rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.8)] backdrop-blur-md w-[310px] sm:w-[380px] max-w-[95vw]">
        {/* Hero Class Emblem */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-amber-600/30 via-slate-900 to-slate-950 border border-amber-400/60 flex items-center justify-center text-base sm:text-lg flex-shrink-0 shadow-inner">
          {player.heroClass === 'Guerrero' ? '⚔️' : player.heroClass === 'Mago' ? '🪄' : player.heroClass === 'Pícaro' ? '🗡️' : player.heroClass === 'Paladín' ? '🛡️' : '🏹'}
        </div>

        {/* Dual Bars Container */}
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          {/* Health Bar */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-black leading-none mb-0.5">
              <span className="text-red-300 flex items-center gap-0.5">
                <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-400 fill-red-400" />
                <span>Salud:</span>
              </span>
              <span className="text-red-200">
                {player.hp} / {player.maxHp} ({Math.round(hpPercent)}%)
              </span>
            </div>
            <div className="w-full bg-[#06060c] rounded-full h-2 sm:h-2.5 overflow-hidden border border-red-950 p-[1px] shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-700 via-rose-500 to-red-400 transition-all duration-300 shadow-[0_0_8px_rgba(239,68,68,0.7)]"
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>

          {/* Mana Bar */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-black leading-none mb-0.5">
              <span className="text-cyan-300 flex items-center gap-0.5">
                <Droplet className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400 fill-cyan-400" />
                <span>Maná:</span>
              </span>
              <span className="text-cyan-200">
                {player.mp} / {player.maxMp} ({Math.round(mpPercent)}%)
              </span>
            </div>
            <div className="w-full bg-[#06060c] rounded-full h-2 sm:h-2.5 overflow-hidden border border-cyan-950 p-[1px] shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-700 via-indigo-500 to-cyan-400 transition-all duration-300 shadow-[0_0_8px_rgba(6,182,212,0.7)]"
                style={{ width: `${mpPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 2. 8-SLOT ACTION BELT / HOTBAR (Estilo Medieval Biselado) */}
      <div className="flex items-center gap-1 sm:gap-1.5 bg-[#0e0d18]/95 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border-2 border-amber-600/70 shadow-[0_4px_25px_rgba(0,0,0,0.85)] backdrop-blur-md overflow-x-auto max-w-full no-scrollbar">
        {hotbarSlots.map((slot) => (
          <button
            key={slot.key}
            onClick={() => {
              if (slot.type === 'hp') {
                if (player.hp >= player.maxHp) {
                  soundEngine.playSfx('select');
                  onShowToast('💚 ¡Tu salud ya está al 100%! No se gastó la poción.');
                  return;
                }
                if (hpItem && hpItem.quantity > 0) {
                  onUseConsumable(hpItem.id);
                  onShowToast(`🧪 ¡Usada ${hpItem.name}! +${hpItem.power || 40} HP.`);
                } else {
                  soundEngine.playSfx('error');
                  onShowToast('⚠️ No te quedan Pociones de Vida.');
                }
              } else if (slot.type === 'mp') {
                if (player.mp >= player.maxMp) {
                  soundEngine.playSfx('select');
                  onShowToast('💙 ¡Tu maná ya está al 100%! No se gastó la poción.');
                  return;
                }
                if (mpItem && mpItem.quantity > 0) {
                  onUseConsumable(mpItem.id);
                  onShowToast(`💧 ¡Usada ${mpItem.name}! +${mpItem.power || 25} MP.`);
                } else {
                  soundEngine.playSfx('error');
                  onShowToast('⚠️ No te quedan Pociones de Maná.');
                }
              } else if (slot.type === 'bread') {
                if (player.hp >= player.maxHp) {
                  soundEngine.playSfx('select');
                  onShowToast('💚 ¡Tu salud ya está al 100%!');
                  return;
                }
                if (player.resources && player.resources.crops >= 1) {
                  player.resources.crops -= 1;
                  player.hp = Math.min(player.maxHp, player.hp + 35);
                  soundEngine.playSfx('heal');
                  onShowToast('🍞 ¡Pan de Trigo consumido! +35 HP (-1 Cosecha).');
                } else {
                  soundEngine.playSfx('error');
                  onShowToast('⚠️ No tienes cosechas en tu inventario.');
                }
              } else if (slot.type === 'teleport') {
                if (scrollItem && scrollItem.quantity > 0) {
                  onUseConsumable(scrollItem.id);
                  if (onTeleportToTown) onTeleportToTown();
                  onShowToast('✨ ¡Teletransportado a la Plaza Mayor!');
                } else {
                  soundEngine.playSfx('error');
                  onShowToast('⚠️ No tienes Pergaminos de Retorno.');
                }
              } else if (slot.type === 'meat') {
                if (player.hp >= player.maxHp) {
                  soundEngine.playSfx('select');
                  onShowToast('💚 ¡Tu salud ya está al 100%!');
                  return;
                }
                if (player.resources && player.resources.crops >= 2) {
                  player.resources.crops -= 2;
                  player.hp = Math.min(player.maxHp, player.hp + 50);
                  soundEngine.playSfx('heal');
                  onShowToast('🥩 ¡Carne Asada consumida! +50 HP (-2 Cosechas).');
                } else {
                  soundEngine.playSfx('error');
                  onShowToast('⚠️ Necesitas al menos 2 Cosechas para preparar Carne.');
                }
              } else if (slot.type === 'elixir') {
                if (player.hp >= player.maxHp && player.mp >= player.maxMp) {
                  soundEngine.playSfx('select');
                  onShowToast('✨ ¡Tu salud y maná ya están al 100%!');
                  return;
                }
                if (elixirItem && elixirItem.quantity > 0) {
                  onUseConsumable(elixirItem.id);
                  onShowToast(`🏺 ¡Usado ${elixirItem.name}! Vida y Maná al 100%.`);
                } else {
                  soundEngine.playSfx('error');
                  onShowToast('⚠️ No te quedan Elixires Sagrados.');
                }
              } else if (slot.type === 'inventory') {
                soundEngine.playSfx('select');
                onOpenInventory();
              } else if (slot.type === 'shop') {
                soundEngine.playSfx('select');
                onOpenShop();
              }
            }}
            className="relative flex flex-col items-center justify-center w-8 h-8 sm:w-11 sm:h-11 bg-[#141224] hover:bg-[#1f1c38] active:scale-90 rounded-lg sm:rounded-xl border border-amber-500/40 hover:border-amber-400 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] transition-all group flex-shrink-0"
            title={`${slot.name} (Tecla ${slot.key})`}
          >
            {/* Slot Hotkey Badge */}
            <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] font-mono font-black text-amber-400/80 group-hover:text-amber-200">
              {slot.key}
            </span>

            {/* Icon */}
            <span className="text-sm sm:text-lg select-none filter drop-shadow">{slot.icon}</span>

            {/* Quantity Badge */}
            {slot.count > 0 && (
              <span className="absolute -bottom-1 -right-1 text-[8px] sm:text-[9px] font-mono font-black text-amber-200 bg-[#06060c] px-1 rounded-full border border-amber-500/70 shadow-md">
                x{slot.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export const BottomActionBar = React.memo(BottomActionBarComponent);

