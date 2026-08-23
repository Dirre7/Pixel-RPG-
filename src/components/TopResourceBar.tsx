import React, { useState } from 'react';
import { PlayerStats, Zone } from '../types';
import { ALL_GAME_QUESTS } from '../data/gameData';
import { Calendar, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

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
  const [isQuestCollapsed, setIsQuestCollapsed] = useState(false);

  // Find current active quest
  const activeQuestId = acceptedQuests.find((id) => !completedQuests.includes(id)) || 'q_main_forest_1';
  const currentQuest = ALL_GAME_QUESTS.find((q) => q.id === activeQuestId) || ALL_GAME_QUESTS[0];

  return (
    <div className="absolute top-0 left-0 right-0 z-30 flex flex-col pointer-events-none select-none">
      {/* Top Resources Bar - Pixel Tribe Style */}
      <div className="w-full flex items-center justify-between bg-amber-950/95 border-b-2 border-amber-600/80 px-2 sm:px-4 py-1 shadow-2xl backdrop-blur-md text-amber-100 font-mono text-[10px] sm:text-xs pointer-events-auto">
        {/* Left: Resource Badges */}
        <div className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto no-scrollbar">
          {/* Gold */}
          <div className="flex items-center gap-1 bg-amber-900/70 px-2 py-0.5 rounded border border-amber-500/40 shadow-inner" title="Oro acumulado">
            <span className="text-yellow-400 font-bold">🪙</span>
            <span className="font-bold text-yellow-300">{player.gold.toLocaleString()}</span>
          </div>

          {/* Wood */}
          <div className="flex items-center gap-1 bg-amber-900/70 px-2 py-0.5 rounded border border-amber-500/40 shadow-inner" title="Madera de Roble recolectada">
            <span className="text-amber-400 font-bold">🪵</span>
            <span className="font-bold text-amber-200">{(player.resources?.wood || 0).toLocaleString()}</span>
          </div>

          {/* Stone / Mineral */}
          <div className="flex items-center gap-1 bg-amber-900/70 px-2 py-0.5 rounded border border-amber-500/40 shadow-inner" title="Piedra y Mineral de Hierro">
            <span className="text-slate-300 font-bold">🪨</span>
            <span className="font-bold text-slate-200">{(player.resources?.stone || 0).toLocaleString()}</span>
          </div>

          {/* Crops / Food */}
          <div className="flex items-center gap-1 bg-amber-900/70 px-2 py-0.5 rounded border border-amber-500/40 shadow-inner" title="Cosechas y Provisiones">
            <span className="text-orange-400 font-bold">🥕</span>
            <span className="font-bold text-orange-200">{(player.resources?.crops || 0).toLocaleString()}</span>
          </div>

          {/* Gems / Arcane Essences */}
          <div className="flex items-center gap-1 bg-amber-900/70 px-2 py-0.5 rounded border border-amber-500/40 shadow-inner" title="Gemas y Esencias Arcanas">
            <span className="text-cyan-400 font-bold">💎</span>
            <span className="font-bold text-cyan-200">{(player.resources?.gems || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Right: Date & Season */}
        <div className="flex items-center gap-1 bg-amber-900/80 px-2 py-0.5 rounded border border-amber-400/50 shadow-inner ml-2 flex-shrink-0">
          <Calendar className="w-3 h-3 text-amber-300" />
          <span className="font-bold text-amber-200 whitespace-nowrap">Día 15, Primavera</span>
        </div>
      </div>

      {/* Collapsible Active Quest Card - Top Left */}
      <div className="flex flex-col items-start mt-1.5 ml-2 pointer-events-auto">
        <div className="flex items-center bg-slate-950/90 border border-amber-500/80 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden max-w-[220px] sm:max-w-[260px]">
          <button
            onClick={onOpenQuests}
            className="flex flex-col gap-0.5 p-2 text-left hover:bg-slate-900 transition flex-1"
            title="Abrir Diario de Misiones"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
                Misión
              </span>
              <span className="w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[8px] font-black flex items-center justify-center">
                !
              </span>
            </div>

            <div className="font-bold text-xs text-slate-100 font-mono truncate">
              {currentQuest ? currentQuest.title : 'Explora la Aldea de Roble'}
            </div>

            {!isQuestCollapsed && (
              <>
                <div className="text-[9px] text-slate-300 font-mono line-clamp-1">
                  {currentQuest ? currentQuest.description : 'Habla con el Anciano Eldrin en la plaza.'}
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
      </div>
    </div>
  );
};
