import React, { useState } from 'react';
import { PlayerStats, Zone } from '../types';
import { ALL_GAME_QUESTS } from '../data/gameData';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface TopResourceBarProps {
  player: PlayerStats;
  currentZone: Zone;
  acceptedQuests: string[];
  completedQuests: string[];
  onOpenQuests: () => void;
}

export const TopResourceBar: React.FC<TopResourceBarProps> = ({
  player,
  currentZone,
  acceptedQuests,
  completedQuests,
  onOpenQuests,
}) => {
  const [isQuestCollapsed, setIsQuestCollapsed] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  const [showResourcesMobile, setShowResourcesMobile] = useState(false);

  // Find current active quest
  const activeQuestId = acceptedQuests.find((id) => !completedQuests.includes(id)) || 'q_main_forest_1';
  const currentQuest = ALL_GAME_QUESTS.find((q) => q.id === activeQuestId) || ALL_GAME_QUESTS[0];

  return (
    <div className="absolute top-0 left-0 right-0 z-30 flex flex-col pointer-events-none select-none">
      {/* Top Resources Bar - Pixel Tribe Style */}
      {/* Desktop / Expanded View */}
      <div
        className={`w-full items-center justify-between bg-amber-950/95 border-b-2 border-amber-600/80 px-2 sm:px-4 py-1 sm:py-1.5 shadow-2xl backdrop-blur-md text-amber-100 font-mono text-xs sm:text-sm pointer-events-auto transition-all ${
          showResourcesMobile ? 'flex' : 'hidden sm:flex'
        }`}
      >
        {/* Left: Resource Badges */}
        <div className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto no-scrollbar">
          {/* Wood */}
          <div className="flex items-center gap-1.5 bg-amber-900/80 px-2 py-1 rounded-xl border border-amber-500/50 shadow-inner" title="Madera de Roble">
            <span className="text-amber-400 font-bold text-sm sm:text-base">🪵</span>
            <span className="font-black text-amber-200 text-xs sm:text-sm">{(player.resources?.wood || 0).toLocaleString()}</span>
          </div>

          {/* Stone / Mineral */}
          <div className="flex items-center gap-1.5 bg-amber-900/80 px-2 py-1 rounded-xl border border-amber-500/50 shadow-inner" title="Piedra y Mineral">
            <span className="text-slate-300 font-bold text-sm sm:text-base">🪨</span>
            <span className="font-black text-slate-200 text-xs sm:text-sm">{(player.resources?.stone || 0).toLocaleString()}</span>
          </div>

          {/* Crops / Food */}
          <div className="flex items-center gap-1.5 bg-amber-900/80 px-2 py-1 rounded-xl border border-amber-500/50 shadow-inner" title="Cosechas">
            <span className="text-orange-400 font-bold text-sm sm:text-base">🥕</span>
            <span className="font-black text-orange-200 text-xs sm:text-sm">{(player.resources?.crops || 0).toLocaleString()}</span>
          </div>

          {/* Gems / Arcane Essences */}
          <div className="flex items-center gap-1.5 bg-amber-900/80 px-2 py-1 rounded-xl border border-amber-500/50 shadow-inner" title="Gemas">
            <span className="text-cyan-400 font-bold text-sm sm:text-base">💎</span>
            <span className="font-black text-cyan-200 text-xs sm:text-sm">{(player.resources?.gems || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Right: Date & Season */}
        <div className="flex items-center gap-1.5 bg-amber-900/90 px-2.5 py-1 rounded-xl border border-amber-400/60 shadow-inner ml-2 flex-shrink-0">
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
          <span className="font-black text-amber-200 whitespace-nowrap text-xs sm:text-sm">Día 15, Primavera</span>
        </div>
      </div>

      {/* Row below top bar: Quest Pill (Left) & Mobile Resource Toggle (Right) */}
      <div className="flex items-center justify-between w-full px-2 pt-1 pointer-events-auto">
        {/* Collapsible Active Quest Card - Top Left */}
        <div className="flex items-center bg-slate-950/90 border border-amber-500/80 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden max-w-[190px] sm:max-w-[260px]">
          <button
            onClick={onOpenQuests}
            className="flex flex-col gap-0.5 p-1.5 text-left hover:bg-slate-900 transition flex-1"
            title="Abrir Diario de Misiones"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[8.5px] sm:text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
                Misión
              </span>
              <span className="w-3 h-3 rounded-full bg-red-600 text-white text-[7px] font-black flex items-center justify-center">
                !
              </span>
            </div>

            <div className="font-bold text-[11px] sm:text-xs text-slate-100 font-mono truncate">
              {currentQuest ? currentQuest.title : 'Explora la Aldea de Roble'}
            </div>

            {!isQuestCollapsed && (
              <>
                <div className="text-[8.5px] sm:text-[9px] text-slate-300 font-mono line-clamp-1">
                  {currentQuest ? currentQuest.description : 'Habla con el Anciano Eldrin.'}
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-0.5 border border-slate-700">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(25, (player.exp / player.maxExp) * 100))}%` }}
                  />
                </div>
              </>
            )}
          </button>

          {/* Collapse Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsQuestCollapsed(!isQuestCollapsed);
            }}
            className="p-1 hover:bg-slate-800 text-amber-400 border-l border-slate-800 self-stretch flex items-center justify-center"
            title={isQuestCollapsed ? 'Expandir Misión' : 'Minimizar Misión'}
          >
            {isQuestCollapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>
        </div>

        {/* Mobile-only Resource Toggle Pill */}
        <button
          onClick={() => setShowResourcesMobile(!showResourcesMobile)}
          className="sm:hidden flex items-center gap-1 bg-amber-950/90 border border-amber-600/70 px-2 py-1 rounded-lg text-[9px] font-mono font-bold text-amber-300 shadow-lg backdrop-blur-md active:scale-95 transition"
          title="Ver Recursos de Crafteo"
        >
          <span>🪵 {player.resources?.wood || 0}</span>
          <span>🪨 {player.resources?.stone || 0}</span>
          <span>{showResourcesMobile ? '▲' : '▼'}</span>
        </button>
      </div>
    </div>
  );
};
