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
    <div className="flex flex-col items-center gap-1 sm:gap-1.5 pointer-events-auto select-none pb-1 sm:pb-2">
      {/* 6-Slot Quick Action Hotbar */}
      <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/75 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-amber-500/50 shadow-2xl backdrop-blur-md overflow-x-auto max-w-full no-scrollbar">
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
                  onShowToast('🥩 ¡Has comido Carne Asada! +50 HP restaurados (-2 Cosechas).');
                } else {
                  soundEngine.playSfx('error');
                  onShowToast('⚠️ Necesitas al menos 2 Cosechas para preparar Carne Asada.');
                }
              } else if (slot.type === 'elixir') {
                if (player.hp >= player.maxHp && player.mp >= player.maxMp) {
                  soundEngine.playSfx('select');
                  onShowToast('✨ ¡Tu salud y maná ya están al 100%!');
                  return;
                }
                if (elixirItem && elixirItem.quantity > 0) {
                  onUseConsumable(elixirItem.id);
                  onShowToast(`🏺 ¡Usado ${elixirItem.name}! Vida y Maná restaurados al 100%.`);
                } else {
                  soundEngine.playSfx('error');
                  onShowToast('⚠️ No te quedan Elixires Sagrados.');
                }
              }
            }}
            className="relative flex flex-col items-center justify-center w-7 h-7 sm:w-10 sm:h-10 bg-slate-900/85 hover:bg-slate-800 active:scale-90 rounded-md sm:rounded-xl border border-slate-700/80 hover:border-amber-400/80 shadow-md transition-all group flex-shrink-0"
            title={`${slot.name} (Tecla ${slot.key})`}
          >
            {/* Slot Hotkey Label */}
            <span className="hidden sm:inline absolute top-0.5 left-1 text-[8px] font-mono font-black text-slate-400 group-hover:text-amber-300">
              {slot.key}
            </span>

            {/* Icon */}
            <span className="text-xs sm:text-lg select-none">{slot.icon}</span>

            {/* Count Badge */}
            {slot.count > 0 && (
              <span className="absolute -bottom-1 -right-1 text-[7px] sm:text-[9px] font-mono font-black text-amber-200 bg-slate-950 px-1 rounded-full border border-amber-500/60 shadow">
                {slot.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
