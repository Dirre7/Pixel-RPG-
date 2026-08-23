import React, { useState } from 'react';
import { PlayerStats, Inventory, EquipmentItem } from '../types';
import { X, Anvil, Flame, Lock, Coins, Check } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export interface ForgeRecipe {
  id: string;
  name: string;
  slot: 'weapon' | 'shield' | 'helmet' | 'armor' | 'boots';
  icon: string;
  tier: number;
  stars: number;
  requiredLevel: number;
  goldCost: number;
  woodCost: number;
  stoneCost: number;
  gemsCost: number;
  bonusAttack: number;
  bonusDefense?: number;
  critRate: string;
  durability: string;
  description: string;
}

export const FORGE_RECIPES: ForgeRecipe[] = [
  {
    id: 'forge_steel_dagger',
    name: 'Daga de Acero Forjado',
    slot: 'weapon',
    icon: '🗡️',
    tier: 1,
    stars: 2,
    requiredLevel: 5,
    goldCost: 250,
    woodCost: 20,
    stoneCost: 10,
    gemsCost: 0,
    bonusAttack: 18,
    critRate: '+12%',
    durability: '100/100',
    description: 'Daga afilada templada con carbón vegetal y madera de roble.',
  },
  {
    id: 'forge_knight_sword',
    name: 'Espada del León Dorado',
    slot: 'weapon',
    icon: '⚔️',
    tier: 2,
    stars: 3,
    requiredLevel: 12,
    goldCost: 600,
    woodCost: 0,
    stoneCost: 40,
    gemsCost: 5,
    bonusAttack: 32,
    critRate: '+15%',
    durability: '120/120',
    description: 'Espada regia de la guardia imperial reforzada con doble filo.',
  },
  {
    id: 'forge_berserker_axe',
    name: 'Gran Hacha de Mithril',
    slot: 'weapon',
    icon: '🪓',
    tier: 3,
    stars: 4,
    requiredLevel: 22,
    goldCost: 1500,
    woodCost: 50,
    stoneCost: 60,
    gemsCost: 10,
    bonusAttack: 52,
    critRate: '+20%',
    durability: '150/150',
    description: 'Hacha pesada forjada con mithril puro capaz de quebrar armaduras.',
  },
  {
    id: 'forge_arcane_staff',
    name: 'Báculo Ígneo de Ignis',
    slot: 'weapon',
    icon: '🔮',
    tier: 4,
    stars: 4,
    requiredLevel: 35,
    goldCost: 3500,
    woodCost: 80,
    stoneCost: 20,
    gemsCost: 25,
    bonusAttack: 78,
    critRate: '+25%',
    durability: '180/180',
    description: 'Canaliza llamas ancestrales del volcán aumentando el poder de los hechizos.',
  },
  {
    id: 'forge_frost_blade',
    name: 'Mandoble Glacial de Ymir',
    slot: 'weapon',
    icon: '❄️',
    tier: 5,
    stars: 5,
    requiredLevel: 50,
    goldCost: 8000,
    woodCost: 30,
    stoneCost: 100,
    gemsCost: 50,
    bonusAttack: 115,
    critRate: '+30%',
    durability: '220/220',
    description: 'Hoja forjada en hielo eterno que congela a los enemigos con cada estocada.',
  },
  {
    id: 'forge_void_katana',
    name: 'Espada Dimensional del Vacío',
    slot: 'weapon',
    icon: '🌌',
    tier: 6,
    stars: 5,
    requiredLevel: 65,
    goldCost: 18000,
    woodCost: 0,
    stoneCost: 150,
    gemsCost: 100,
    bonusAttack: 165,
    critRate: '+35%',
    durability: '280/280',
    description: 'Hoja de antimateria cósmica que rasga el tejido del espacio.',
  },
  {
    id: 'forge_divine_blade',
    name: 'Mandoble Sagrado de Cronos',
    slot: 'weapon',
    icon: '👑',
    tier: 7,
    stars: 6,
    requiredLevel: 75,
    goldCost: 40000,
    woodCost: 100,
    stoneCost: 200,
    gemsCost: 200,
    bonusAttack: 240,
    critRate: '+45%',
    durability: '350/350',
    description: 'Arma suprema de los dioses que manipula el flujo temporal de la batalla.',
  },
];

interface ForgeModalProps {
  player: PlayerStats;
  inventory: Inventory;
  onClose: () => void;
  onEquipItem: (item: EquipmentItem) => void;
  onShowToast: (msg: string) => void;
}

export const ForgeModal: React.FC<ForgeModalProps> = ({
  player,
  inventory,
  onClose,
  onEquipItem,
  onShowToast,
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState<ForgeRecipe>(FORGE_RECIPES[0]);
  const [forgedWeapons, setForgedWeapons] = useState<string[]>([]);

  const playerWood = player.resources?.wood || 0;
  const playerStone = player.resources?.stone || 0;
  const playerGems = player.resources?.gems || 0;

  const meetsLevel = player.level >= selectedRecipe.requiredLevel;
  const meetsGold = player.gold >= selectedRecipe.goldCost;
  const meetsWood = playerWood >= selectedRecipe.woodCost;
  const meetsStone = playerStone >= selectedRecipe.stoneCost;
  const meetsGems = playerGems >= selectedRecipe.gemsCost;

  const isAlreadyForged = forgedWeapons.includes(selectedRecipe.id);
  const canForge = meetsLevel && meetsGold && meetsWood && meetsStone && meetsGems && !isAlreadyForged;

  const handleForge = (recipe: ForgeRecipe) => {
    if (!meetsLevel) {
      soundEngine.playSfx('error');
      onShowToast(`🔒 Requiere Nivel ${recipe.requiredLevel} para forjar esta arma.`);
      return;
    }
    if (!meetsGold) {
      soundEngine.playSfx('error');
      onShowToast(`💰 Oro insuficiente. Necesitas ${recipe.goldCost.toLocaleString()} Oro.`);
      return;
    }
    if (!meetsWood || !meetsStone || !meetsGems) {
      soundEngine.playSfx('error');
      onShowToast('🎒 Materiales insuficientes para forjar esta arma.');
      return;
    }

    soundEngine.playSfx('levelup');
    soundEngine.playSfx('gold');
    setForgedWeapons((prev) => [...prev, recipe.id]);

    // Descontar oro y recursos reales del héroe
    player.gold = Math.max(0, player.gold - recipe.goldCost);
    if (player.resources) {
      player.resources.wood = Math.max(0, player.resources.wood - recipe.woodCost);
      player.resources.stone = Math.max(0, player.resources.stone - recipe.stoneCost);
      player.resources.gems = Math.max(0, player.resources.gems - recipe.gemsCost);
    }

    const forgedItem: EquipmentItem = {
      id: recipe.id,
      name: recipe.name,
      slot: recipe.slot,
      bonusAttack: recipe.bonusAttack,
      bonusDefense: recipe.bonusDefense,
      description: recipe.description,
      price: Math.round(recipe.goldCost * 0.75),
      icon: recipe.icon,
    };

    onEquipItem(forgedItem);
    onShowToast(`🔥 ¡Has forjado ${recipe.name} (+${recipe.bonusAttack} Ataque)!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-slate-900 to-amber-950/95 border-2 border-amber-500 rounded-2xl shadow-2xl p-4 sm:p-6 text-slate-100 font-mono flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-600/70 pb-3">
          <div className="flex items-center gap-2">
            <Anvil className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-amber-300 uppercase tracking-wider">
                Forja de Armas & Recolección
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400">
                Usa tus materiales recolectados y oro para forjar armas de combate
              </p>
            </div>
          </div>

          {/* Player stats header badge */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            <div className="flex items-center gap-1 bg-amber-900/80 px-2 py-0.5 rounded border border-amber-500/50 text-xs text-yellow-300 font-bold shadow-inner">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              <span>{player.gold.toLocaleString()} G</span>
            </div>
            <div className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-xs text-emerald-400 font-bold">
              Nv. {player.level}
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-amber-900/50 active:scale-95 rounded-lg border border-amber-500/40 text-amber-300 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Recipe List */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Recetas Disponibles
            </span>
            <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1">
              {FORGE_RECIPES.map((recipe) => {
                const isSelected = selectedRecipe.id === recipe.id;
                const isUnlocked = player.level >= recipe.requiredLevel;
                const hasForged = forgedWeapons.includes(recipe.id);

                return (
                  <button
                    key={recipe.id}
                    onClick={() => {
                      soundEngine.playSfx('select');
                      setSelectedRecipe(recipe);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition text-left ${
                      isSelected
                        ? 'bg-amber-950/90 border-amber-400 shadow-md ring-1 ring-amber-400'
                        : isUnlocked
                        ? 'bg-slate-900/80 border-slate-700 hover:border-amber-500/50'
                        : 'bg-slate-950/60 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{recipe.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{recipe.name}</span>
                          {hasForged && (
                            <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-1 rounded">
                              Forjada
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="text-amber-300 font-bold">+{recipe.bonusAttack} ATK</span>
                          <span>•</span>
                          <span className={isUnlocked ? 'text-slate-300' : 'text-rose-400 font-bold'}>
                            Nv. {recipe.requiredLevel}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-yellow-400">
                        {recipe.goldCost.toLocaleString()} G
                      </div>
                      {!isUnlocked && <Lock className="w-3.5 h-3.5 text-slate-500 inline ml-auto mt-0.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Recipe Detail Card */}
          <div className="bg-slate-900/90 border border-amber-600/60 rounded-xl p-4 flex flex-col justify-between shadow-inner">
            <div className="flex flex-col gap-3">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{selectedRecipe.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-amber-300">{selectedRecipe.name}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-amber-400">
                      {'⭐'.repeat(selectedRecipe.stars)}
                      <span className="text-slate-400 ml-1">Tier {selectedRecipe.tier}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Ataque:</span>
                  <span className="font-bold text-amber-300">+{selectedRecipe.bonusAttack}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Crítico:</span>
                  <span className="font-bold text-emerald-400">{selectedRecipe.critRate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Durabilidad:</span>
                  <span className="font-bold text-slate-200">{selectedRecipe.durability}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Nivel Requerido:</span>
                  <span className={`font-bold ${meetsLevel ? 'text-emerald-400' : 'text-rose-400'}`}>
                    Nv. {selectedRecipe.requiredLevel}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 italic bg-amber-950/30 p-2 rounded border border-amber-900/40">
                "{selectedRecipe.description}"
              </p>

              {/* Live Materials Requirement List */}
              <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 flex flex-col gap-1.5 text-xs">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  Materiales Necesarios:
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  {selectedRecipe.woodCost > 0 && (
                    <div className={`p-1 rounded border flex items-center gap-1 ${meetsWood ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'}`}>
                      <span>🪵</span>
                      <span className="font-bold">{playerWood}/{selectedRecipe.woodCost}</span>
                    </div>
                  )}
                  {selectedRecipe.stoneCost > 0 && (
                    <div className={`p-1 rounded border flex items-center gap-1 ${meetsStone ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'}`}>
                      <span>🪨</span>
                      <span className="font-bold">{playerStone}/{selectedRecipe.stoneCost}</span>
                    </div>
                  )}
                  {selectedRecipe.gemsCost > 0 && (
                    <div className={`p-1 rounded border flex items-center gap-1 ${meetsGems ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'}`}>
                      <span>💎</span>
                      <span className="font-bold">{playerGems}/{selectedRecipe.gemsCost}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-3 border-t border-slate-800 mt-2">
              <button
                onClick={() => handleForge(selectedRecipe)}
                disabled={!canForge}
                className={`w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95 ${
                  isAlreadyForged
                    ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                    : canForge
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 border border-amber-300 shadow-amber-500/20'
                    : 'bg-slate-800 text-rose-300 border border-rose-900/60 opacity-80 cursor-not-allowed'
                }`}
              >
                {isAlreadyForged ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Arma ya Forjada</span>
                  </>
                ) : !meetsLevel ? (
                  <>
                    <Lock className="w-4 h-4 text-rose-400" />
                    <span>Nivel insuficiente (Requiere Nv. {selectedRecipe.requiredLevel})</span>
                  </>
                ) : !meetsGold ? (
                  <>
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span>Oro insuficiente (Costo: {selectedRecipe.goldCost.toLocaleString()} G)</span>
                  </>
                ) : !meetsWood || !meetsStone || !meetsGems ? (
                  <>
                    <Lock className="w-4 h-4 text-rose-400" />
                    <span>Faltan Materiales de Crafteo</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4 text-orange-950 animate-pulse" />
                    <span>Forjar por {selectedRecipe.goldCost.toLocaleString()} Oro</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
