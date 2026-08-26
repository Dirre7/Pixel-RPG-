import React from 'react';
import { Sparkles, Gift, Coins, Award, Check, X } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export interface ChestLoot {
  chestId: string;
  gold: number;
  exp: number;
  itemName: string;
  itemIcon: string;
  equipmentName?: string;
  equipmentIcon?: string;
  equipmentRarity?: string;
  loreTitle?: string;
}

interface ChestLootModalProps {
  loot: ChestLoot;
  onClose: () => void;
}

export const ChestLootModal: React.FC<ChestLootModalProps> = ({ loot, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-mono">
      <div className="relative w-full max-w-md bg-slate-950 border-2 border-amber-500 rounded-2xl shadow-2xl overflow-hidden flex flex-col p-4 sm:p-6 max-h-[90dvh] overflow-y-auto text-center text-slate-100">
        {/* Animated Background Rays / Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/15 via-transparent to-slate-950 pointer-events-none" />

        {/* Chest Icon Celebration */}
        <div className="relative mx-auto mb-3 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-amber-300 shadow-2xl flex items-center justify-center text-4xl animate-bounce">
            🎁
          </div>
          <div className="absolute -top-1 -right-1 text-amber-300 animate-spin">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <h2 className="text-xl font-black text-amber-300 tracking-wide mb-1">
          ¡COFRE DEL TESORO ABIERTO!
        </h2>
        <p className="text-xs text-slate-400 mb-5">
          Has descubierto un valioso botín oculto en las tierras de Aethelgard.
        </p>

        {/* Loot Breakdown Cards */}
        <div className="space-y-2.5 mb-6 text-left">
          {/* Gold */}
          <div className="flex items-center justify-between p-3 bg-slate-900/90 rounded-xl border border-amber-500/30">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">💰</span>
              <div>
                <div className="text-xs font-bold text-amber-300">Monedas de Oro</div>
                <div className="text-[10px] text-slate-400">Añadido a tu bolsa</div>
              </div>
            </div>
            <span className="text-sm font-black text-amber-400">+{loot.gold} ORO</span>
          </div>

          {/* Experience */}
          <div className="flex items-center justify-between p-3 bg-slate-900/90 rounded-xl border border-sky-500/30">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⭐</span>
              <div>
                <div className="text-xs font-bold text-sky-300">Puntos de Experiencia</div>
                <div className="text-[10px] text-slate-400">Progreso de nivel</div>
              </div>
            </div>
            <span className="text-sm font-black text-sky-400">+{loot.exp} EXP</span>
          </div>

          {/* Consumable Potion */}
          {loot.itemName && (
            <div className="flex items-center justify-between p-3 bg-slate-900/90 rounded-xl border border-emerald-500/30">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{loot.itemIcon || '🧪'}</span>
                <div>
                  <div className="text-xs font-bold text-emerald-300">{loot.itemName}</div>
                  <div className="text-[10px] text-slate-400">Objeto consumible guardado</div>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400">x1</span>
            </div>
          )}

          {/* Rare Equipment if found */}
          {loot.equipmentName && (
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-950/80 to-slate-900/90 rounded-xl border border-purple-500/50">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{loot.equipmentIcon || '⚔️'}</span>
                <div>
                  <div className="text-xs font-bold text-purple-300">{loot.equipmentName}</div>
                  <div className="text-[10px] text-purple-400/80">¡Equipamiento Especial!</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-900/60 text-purple-200 border border-purple-500/40">
                {loot.equipmentRarity || 'RARO'}
              </span>
            </div>
          )}

          {/* Lore Codex Unlocked */}
          {loot.loreTitle && (
            <div
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                borderColor: '#f59e0b',
                borderWidth: '1.5px',
              }}
              className="flex items-center space-x-3 p-3.5 rounded-xl shadow-lg"
            >
              <span className="text-2xl">📜</span>
              <div className="text-left">
                <div style={{ color: '#fbbf24', fontWeight: 900 }} className="text-xs sm:text-sm">
                  Códice Desbloqueado
                </div>
                <div style={{ color: '#f8fafc', fontWeight: 700 }} className="text-xs mt-0.5">
                  {loot.loreTitle}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Claim Button */}
        <button
          onClick={() => {
            soundEngine.playSfx('select');
            onClose();
          }}
          style={{
            backgroundColor: '#fbbf24',
            color: '#020617',
            borderColor: '#fef08a',
            boxShadow: '0 0 25px rgba(251, 191, 36, 0.6)',
          }}
          className="w-full py-3.5 sm:py-4 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl transition border-2 flex items-center justify-center space-x-2 active:scale-95 cursor-pointer hover:brightness-110"
        >
          <Check className="w-5 h-5 text-slate-950 stroke-[3]" />
          <span style={{ color: '#020617', fontWeight: 900 }}>¡Guardar y Continuar Aventura!</span>
        </button>
      </div>
    </div>
  );
};
