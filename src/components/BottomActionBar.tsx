import React from 'react';
import { Inventory, PlayerStats } from '../types';
import {
  Hammer,
  Users,
  Scroll,
  ArrowLeftRight,
  Settings,
  Map,
  Anvil,
  ShoppingBag,
  Package,
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

export const BottomActionBar: React.FC<BottomActionBarProps> = ({
  player,
  inventory,
  onOpenInventory,
  onOpenQuests,
  onOpenShop,
  onOpenSettings,
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

  // 6 100% Action-Oriented Usable Hotbar Items with Live Inventories
  const hotbarSlots = [
    { key: '1', id: 'potion_hp', name: 'Poción de Vida', icon: '🧪', count: hpCount, color: 'text-red-400', type: 'hp' },
    { key: '2', id: 'potion_mp', name: 'Poción de Maná', icon: '💧', count: mpCount, color: 'text-blue-400', type: 'mp' },
    { key: '3', id: 'crops_bread', name: 'Pan de Trigo (+35 HP)', icon: '🍞', count: cropsCount, color: 'text-amber-300', type: 'bread' },
    { key: '4', id: 'scroll_return', name: 'Pergamino de Retorno', icon: '📜', count: scrollCount, color: 'text-purple-300', type: 'teleport' },
    { key: '5', id: 'roasted_meat', name: 'Carne Asada (+50 HP)', icon: '🥩', count: meatCount, color: 'text-orange-400', type: 'meat' },
    { key: '6', id: 'divine_elixir', name: 'Elixir Sagrado (100%)', icon: '🏺', count: elixirCount, color: 'text-yellow-300', type: 'elixir' },
  ];

  return (
    <div className="w-full flex flex-col items-center gap-1.5 pointer-events-auto select-none z-20">
      {/* 6-Slot Quick Action Hotbar */}
      <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950/95 p-1.5 sm:p-2 rounded-2xl border-2 border-amber-600/80 shadow-2xl backdrop-blur-md overflow-x-auto max-w-full no-scrollbar">
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
                  onShowToast('⚠️ No te quedan Pociones de Vida en tu inventario.');
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
                  onShowToast('⚠️ No te quedan Pociones de Maná en tu inventario.');
                }
              } else if (slot.type === 'bread') {
                if (player.hp >= player.maxHp) {
                  soundEngine.playSfx('select');
                  onShowToast('💚 ¡Tu salud ya está al 100%! No necesitas comer.');
                  return;
                }
                if (player.resources && player.resources.crops >= 1) {
                  player.resources.crops -= 1;
                  player.hp = Math.min(player.maxHp, player.hp + 35);
                  soundEngine.playSfx('heal');
                  onShowToast('🍞 ¡Has comido Pan de Trigo! +35 HP restaurados (-1 Cosecha).');
                } else {
                  soundEngine.playSfx('error');
                  onShowToast('⚠️ No tienes cosechas ni trigo en tu inventario.');
                }
              } else if (slot.type === 'teleport') {
                if (scrollItem && scrollItem.quantity > 0) {
                  onUseConsumable(scrollItem.id);
                  if (onTeleportToTown) onTeleportToTown();
                  onShowToast('✨ ¡Pergamino de Retorno usado! Teletransportado a la Plaza Mayor.');
                } else {
                  soundEngine.playSfx('error');
                  onShowToast('⚠️ No tienes Pergaminos de Retorno. Cómpralos en el bazar.');
                }
              } else if (slot.type === 'meat') {
                if (player.hp >= player.maxHp) {
                  soundEngine.playSfx('select');
                  onShowToast('💚 ¡Tu salud ya está al 100%! No necesitas comer.');
                  return;
                }
                if (player.resources && player.resources.crops >= 2) {
                  player.resources.crops -= 2;
                  player.hp = Math.min(player.maxHp, player.hp + 50);
                  soundEngine.playSfx('heal');
                  onShowToast('🥩 ¡Carne Asada consumida! +50 HP restaurados (-2 Cosechas).');
                } else {
                  soundEngine.playSfx('error');
                  onShowToast('⚠️ Necesitas al menos 2 cosechas/provisiones en tu inventario.');
                }
              } else if (slot.type === 'elixir') {
                if (elixirItem && elixirItem.quantity > 0) {
                  onUseConsumable(elixirItem.id);
                  onShowToast('🏺 ¡Elixir Sagrado consumido! HP y MP restaurados al 100%.');
                } else {
                  soundEngine.playSfx('error');
                  onShowToast('⚠️ No tienes Elixires Sagrados en tu inventario.');
                }
              }
            }}
            className="relative group w-11 h-11 sm:w-13 sm:h-13 bg-slate-900/95 hover:bg-slate-800 active:scale-90 border-2 border-slate-700 hover:border-amber-400 rounded-2xl flex flex-col items-center justify-center transition shadow-lg flex-shrink-0"
            title={`${slot.name} (Tecla ${slot.key})`}
          >
            {/* Key shortcut badge */}
            <span className="absolute top-0.5 left-1.5 text-[9px] font-mono text-slate-400 group-hover:text-amber-300 font-bold">
              {slot.key}
            </span>

            {/* Icon */}
            <span className="text-xl sm:text-2xl select-none">{slot.icon}</span>

            {/* Count Badge */}
            {slot.count > 0 && (
              <span className="absolute bottom-0.5 right-1 text-[9px] sm:text-[10px] font-mono font-black text-amber-200 bg-slate-950 px-1.5 py-0.2 rounded-full border border-amber-500/60 shadow">
                {slot.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Village Management Navigation Bar (Pixel Tribe Style) */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-3 overflow-x-auto max-w-full no-scrollbar py-1">

        {/* Misiones */}
        <button
          onClick={() => {
            soundEngine.playSfx('select');
            onOpenQuests();
          }}
          className="flex items-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 bg-amber-950/95 hover:bg-amber-900 active:scale-95 text-amber-200 rounded-2xl border-2 border-amber-600 shadow-xl font-mono text-xs sm:text-sm font-black transition"
        >
          <Scroll className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          <span>Misiones</span>
        </button>

        {/* Comercio / Tienda */}
        <button
          onClick={() => {
            soundEngine.playSfx('select');
            onOpenShop();
          }}
          className="flex items-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 bg-slate-900/95 hover:bg-slate-800 active:scale-95 text-emerald-300 rounded-2xl border-2 border-emerald-600 shadow-xl font-mono text-xs sm:text-sm font-black transition"
        >
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
          <span>Comercio</span>
        </button>

        {/* Inventario */}
        <button
          onClick={() => {
            soundEngine.playSfx('select');
            onOpenInventory();
          }}
          className="flex items-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 bg-slate-900/95 hover:bg-slate-800 active:scale-95 text-amber-300 rounded-2xl border-2 border-amber-500 shadow-xl font-mono text-xs sm:text-sm font-black transition"
        >
          <Package className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          <span>Inventario</span>
        </button>

        {/* Ajustes */}
        <button
          onClick={() => {
            soundEngine.playSfx('select');
            onOpenSettings();
          }}
          className="flex items-center gap-1 p-2 sm:p-2.5 bg-slate-900/95 hover:bg-slate-800 active:scale-95 text-slate-300 rounded-2xl border-2 border-slate-700 shadow-xl font-mono text-xs sm:text-sm font-bold transition"
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
