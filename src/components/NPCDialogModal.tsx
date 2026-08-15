import React, { useState } from 'react';
import { NPC, PlayerStats } from '../types';
import {
  MessageSquare,
  Sparkles,
  Award,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  BookOpen,
  Shield,
  Zap,
  HelpCircle,
  Coins
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface NPCDialogModalProps {
  npc: NPC;
  player: PlayerStats;
  defeatedBosses: string[];
  openedChests?: string[];
  defeatedEnemyCounts?: Record<string, number>;
  completedQuests: string[];
  onClose: () => void;
  onClaimReward: (questId: string, gold: number, exp: number) => void;
}

export const NPCDialogModal: React.FC<NPCDialogModalProps> = ({
  npc,
  player,
  defeatedBosses,
  openedChests = [],
  defeatedEnemyCounts = {},
  completedQuests,
  onClose,
  onClaimReward,
}) => {
  const [dialogPageIndex, setDialogPageIndex] = useState(0);

  const quest = npc.quest;
  const isQuestCompleted = quest ? completedQuests.includes(quest.id) : false;

  // Check if quest requirements are currently fulfilled
  let canClaimQuest = false;
  let progressDescription = '';
  if (quest && !isQuestCompleted) {
    if (quest.targetType === 'defeat_boss') {
      const bossName = String(quest.targetValue).toLowerCase();
      canClaimQuest = defeatedBosses.some((b) =>
        b.toLowerCase().includes(bossName) || bossName.includes(b.toLowerCase())
      );
      progressDescription = canClaimQuest ? '¡Jefe derrotado!' : `Derrotar a ${quest.targetValue}`;
    } else if (quest.targetType === 'reach_level') {
      const targetLvl = Number(quest.targetValue);
      canClaimQuest = player.level >= targetLvl;
      progressDescription = `Nivel ${player.level} / ${targetLvl}`;
    } else if (quest.targetType === 'open_chests') {
      const targetCount = Number(quest.targetValue);
      const zoneChests = (openedChests || []).filter((id) => id.startsWith(quest.zoneId || '')).length;
      canClaimQuest = zoneChests >= targetCount;
      progressDescription = `Cofres en la región: ${Math.min(zoneChests, targetCount)} / ${targetCount}`;
    } else if (quest.targetType === 'defeat_enemies') {
      const targetCount = Number(quest.targetValue);
      const enemyKey = (quest.targetEnemyType || '').toLowerCase();
      const kills = defeatedEnemyCounts[enemyKey] || 0;
      canClaimQuest = kills >= targetCount;
      progressDescription = `Enemigos derrotados: ${Math.min(kills, targetCount)} / ${targetCount}`;
    }
  }

  const handleNextPage = () => {
    soundEngine.playSfx('select');
    if (dialogPageIndex < npc.dialogue.length - 1) {
      setDialogPageIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    soundEngine.playSfx('select');
    if (dialogPageIndex > 0) {
      setDialogPageIndex((prev) => prev - 1);
    }
  };

  const handleClaim = () => {
    if (!quest || !canClaimQuest) return;
    soundEngine.playSfx('level_up');
    soundEngine.playSfx('gold');
    onClaimReward(quest.id, quest.rewardGold, quest.rewardExp);
  };

  const getAvatarBadge = () => {
    switch (npc.avatarStyle) {
      case 'elder':
        return <BookOpen className="w-8 h-8 text-emerald-400" />;
      case 'wizard':
        return <Sparkles className="w-8 h-8 text-purple-400" />;
      case 'knight':
        return <Shield className="w-8 h-8 text-cyan-400" />;
      case 'elf':
        return <Zap className="w-8 h-8 text-lime-400" />;
      case 'dwarf':
        return <Coins className="w-8 h-8 text-amber-400" />;
      case 'blacksmith':
        return <span className="text-2xl">🔨</span>;
      case 'alchemist':
        return <span className="text-2xl">⚗️</span>;
      case 'fisherman':
        return <span className="text-2xl">🎣</span>;
      default:
        return <MessageSquare className="w-8 h-8 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900/95 border-2 border-emerald-500/40 rounded-2xl shadow-2xl text-slate-100 overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-inner">
              {getAvatarBadge()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-emerald-400 tracking-wide">{npc.name}</h2>
              <span className="text-xs text-slate-400 font-medium px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                {npc.title}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playSfx('select');
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Dialogue Box */}
          <div className="relative p-5 bg-slate-950/80 border border-emerald-500/30 rounded-xl shadow-inner">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-slate-200 text-sm md:text-base leading-relaxed font-sans">
                "{npc.dialogue[dialogPageIndex]}"
              </p>
            </div>

            {/* Pagination controls if multiple dialogue pages */}
            {npc.dialogue.length > 1 && (
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-500">
                  Página {dialogPageIndex + 1} de {npc.dialogue.length}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={dialogPageIndex === 0}
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg transition"
                  >
                    <ChevronLeft className="w-4 h-4" /> Anterior
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={dialogPageIndex === npc.dialogue.length - 1}
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 rounded-lg text-white font-medium transition"
                  >
                    Siguiente <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Lore / Gameplay Tip Card */}
          {npc.tip && (
            <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                  Lore & Consejo de Viaje
                </h4>
                <p className="text-xs md:text-sm text-amber-100/90 leading-relaxed">{npc.tip}</p>
              </div>
            </div>
          )}

          {/* Quest Card */}
          {quest && (
            <div className="p-5 bg-slate-800/80 border border-purple-500/30 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-400" />
                  <h3 className="font-bold text-purple-300 text-sm md:text-base">
                    Misión Secundaría: {quest.title}
                  </h3>
                </div>
                {isQuestCompleted ? (
                  <span className="flex items-center gap-1 text-xs bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 px-2.5 py-1 rounded-full font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completada
                  </span>
                ) : canClaimQuest ? (
                  <span className="text-xs bg-amber-500 text-slate-950 font-extrabold px-2.5 py-1 rounded-full animate-pulse">
                    ¡Lista para Reclamar!
                  </span>
                ) : (
                  <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                    En Progreso
                  </span>
                )}
              </div>

              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {quest.description}
              </p>

              {/* Rewards */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="text-amber-400">💰 +{quest.rewardGold} Oro</span>
                  <span className="text-purple-300">⭐ +{quest.rewardExp} EXP</span>
                </div>

                {!isQuestCompleted && (
                  <button
                    onClick={handleClaim}
                    disabled={!canClaimQuest}
                    className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition shadow-lg flex items-center gap-2 ${
                      canClaimQuest
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-amber-500/20'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <Award className="w-4 h-4" /> Reclamar Recompensa
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              soundEngine.playSfx('select');
              onClose();
            }}
            className="px-5 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium transition"
          >
            Continuar Viaje
          </button>
        </div>
      </div>
    </div>
  );
};
