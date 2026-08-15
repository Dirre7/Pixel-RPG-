import React from 'react';
import { Sparkles, Trophy, Compass, MapPin, Check, Crown } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export interface BossVictoryInfo {
  bossName: string;
  zoneId: string;
  zoneName: string;
  nextZoneId?: string;
  nextZoneName?: string;
  fragmentName: string;
  fragmentIcon: string;
  fragmentColor: string;
  loreStory: string;
  isFinalBoss?: boolean;
  scoreBonus: number;
}

interface BossVictoryModalProps {
  victoryInfo: BossVictoryInfo;
  onTravelToNextZone: (nextZoneId: string) => void;
  onStayInCurrentZone: () => void;
}

export const BossVictoryModal: React.FC<BossVictoryModalProps> = ({
  victoryInfo,
  onTravelToNextZone,
  onStayInCurrentZone,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in font-mono select-none">
      <div className="relative w-full max-w-lg bg-slate-950 border-2 border-amber-500/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col p-5 sm:p-7 text-center text-slate-100">
        {/* Animated Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/20 via-slate-900/40 to-slate-950 pointer-events-none" />

        {/* Fragment Icon / Trophy Header */}
        <div className="relative mx-auto mb-4 flex items-center justify-center">
          <div
            className="w-24 h-24 rounded-3xl border-2 shadow-2xl flex items-center justify-center text-5xl animate-bounce relative"
            style={{
              borderColor: victoryInfo.fragmentColor || '#f59e0b',
              backgroundColor: `${victoryInfo.fragmentColor}20`,
              boxShadow: `0 0 30px ${victoryInfo.fragmentColor}40`,
            }}
          >
            {victoryInfo.fragmentIcon}
            <div className="absolute -top-2 -right-2 text-amber-300 animate-spin">
              <Sparkles className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full inline-block mb-2">
            {victoryInfo.isFinalBoss ? '¡HAZAÑA SUPREMA COMPLETADA!' : '¡GRAN GUARDIÁN DERROTADO!'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-amber-300 tracking-wide">
            {victoryInfo.isFinalBoss ? '¡AETHELGARD HA SIDO PURIFICADO!' : `¡${victoryInfo.bossName.toUpperCase()} DERROTADO!`}
          </h2>
        </div>

        {/* Fragment Earned Banner */}
        <div
          className="my-3 p-3 rounded-xl border flex items-center justify-center space-x-3 bg-slate-900/90 shadow-inner"
          style={{ borderColor: `${victoryInfo.fragmentColor}60` }}
        >
          <span className="text-2xl">{victoryInfo.fragmentIcon}</span>
          <div className="text-left">
            <div className="text-[11px] font-bold text-slate-400">Fragmento Sagrado Obtenido:</div>
            <div className="text-xs sm:text-sm font-black text-amber-200">
              {victoryInfo.fragmentName}
            </div>
          </div>
          <div className="ml-auto pl-2">
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-600/40 px-2 py-1 rounded">
              +{victoryInfo.scoreBonus} PTS
            </span>
          </div>
        </div>

        {/* Narrative Lore Text */}
        <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl mb-5 text-left text-xs sm:text-[13px] text-slate-300 leading-relaxed max-h-40 overflow-y-auto">
          <p className="italic text-amber-100/90">
            «{victoryInfo.loreStory}»
          </p>
        </div>

        {/* Action Buttons */}
        {victoryInfo.isFinalBoss ? (
          <div className="space-y-3">
            <button
              onClick={() => {
                soundEngine.playSfx('levelup');
                onStayInCurrentZone();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition shadow-xl flex items-center justify-center space-x-2 active:scale-95 border border-amber-300"
            >
              <Crown className="w-5 h-5 text-slate-950" />
              <span>¡Consagrar Victoria & Continuar en el Reino!</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Option A: Travel to Next Zone */}
            {victoryInfo.nextZoneId && (
              <button
                onClick={() => {
                  soundEngine.playSfx('select');
                  onTravelToNextZone(victoryInfo.nextZoneId!);
                }}
                className="py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center justify-center space-x-2 active:scale-95 border border-emerald-400"
              >
                <Compass className="w-4 h-4 text-slate-950" />
                <span>Viajar a {victoryInfo.nextZoneName?.split(' ')[0] || 'Siguiente Zona'}</span>
              </button>
            )}

            {/* Option B: Stay in Current Zone */}
            <button
              onClick={() => {
                soundEngine.playSfx('select');
                onStayInCurrentZone();
              }}
              className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition border border-slate-700 shadow flex items-center justify-center space-x-2 active:scale-95"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Permanecer y Explorar</span>
            </button>
          </div>
        )}

        {!victoryInfo.isFinalBoss && (
          <p className="text-[10px] text-slate-500 mt-3">
            💡 Podrás viajar libremente a {victoryInfo.nextZoneName || 'la nueva zona'} en cualquier momento desde la barra de zonas superior.
          </p>
        )}
      </div>
    </div>
  );
};
