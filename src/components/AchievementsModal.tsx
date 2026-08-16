import React, { useState } from 'react';
import { Achievement, AchievementCategory, AchievementRarity, PlayerStats, Inventory } from '../types';
import { GAME_ACHIEVEMENTS, getAchievementProgress } from '../data/achievementsData';
import { soundEngine } from '../utils/soundEngine';
import {
  Trophy,
  Award,
  Sparkles,
  Shield,
  Coins,
  CheckCircle2,
  Lock,
  X,
  Swords,
  Compass,
  TrendingUp,
  Package,
  Star,
  Gift
} from 'lucide-react';

interface AchievementsModalProps {
  player: PlayerStats;
  inventory: Inventory;
  defeatedBosses: string[];
  openedChests: string[];
  completedQuests: string[];
  unlockedLoreIds: string[];
  defeatedEnemyCounts: Record<string, number>;
  unlockedAchievements: string[];
  claimedAchievements: string[];
  onClaimReward: (achievement: Achievement) => void;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  player,
  inventory,
  defeatedBosses,
  openedChests,
  completedQuests,
  unlockedLoreIds,
  defeatedEnemyCounts,
  unlockedAchievements,
  claimedAchievements,
  onClaimReward,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | AchievementCategory>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const totalAchievements = GAME_ACHIEVEMENTS.length;

  // Calculate completion for all achievements
  const achievementStatusList = GAME_ACHIEVEMENTS.map((ach) => {
    const isUnlockedInState = unlockedAchievements.includes(ach.id);
    const isClaimed = claimedAchievements.includes(ach.id);
    const progress = getAchievementProgress(
      ach,
      player,
      inventory,
      defeatedBosses,
      openedChests,
      completedQuests,
      unlockedLoreIds,
      defeatedEnemyCounts
    );
    const isCompleted = isUnlockedInState || progress.isCompleted;

    return {
      achievement: ach,
      progress,
      isCompleted,
      isClaimed,
      canClaim: isCompleted && !isClaimed,
    };
  });

  const completedCount = achievementStatusList.filter((a) => a.isCompleted).length;
  const unclaimedCount = achievementStatusList.filter((a) => a.canClaim).length;
  const progressPercent = Math.round((completedCount / totalAchievements) * 100);

  const filteredAchievements = achievementStatusList.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.achievement.category === selectedCategory;
  });

  const getRarityBadge = (rarity: AchievementRarity) => {
    switch (rarity) {
      case 'common':
        return { label: 'Común', border: 'border-slate-500/50', bg: 'bg-slate-800/80 text-slate-300' };
      case 'rare':
        return { label: 'Raro', border: 'border-blue-500/60', bg: 'bg-blue-950/80 text-blue-300' };
      case 'epic':
        return { label: 'Épico', border: 'border-purple-500/60', bg: 'bg-purple-950/80 text-purple-300' };
      case 'legendary':
        return { label: 'Legendario', border: 'border-amber-400/80', bg: 'bg-amber-950/80 text-amber-300' };
    }
  };

  const getCategoryIcon = (category: AchievementCategory) => {
    switch (category) {
      case 'combat':
        return <Swords className="w-4 h-4" />;
      case 'exploration':
        return <Compass className="w-4 h-4" />;
      case 'progression':
        return <TrendingUp className="w-4 h-4" />;
      case 'collection':
        return <Package className="w-4 h-4" />;
      case 'special':
        return <Star className="w-4 h-4" />;
    }
  };

  const handleClaim = (ach: Achievement) => {
    soundEngine.playSfx('achievement');
    onClaimReward(ach);

    const parts: string[] = [];
    if (ach.rewardGold) parts.push(`+${ach.rewardGold}G`);
    if (ach.rewardExp) parts.push(`+${ach.rewardExp} EXP`);
    if (ach.rewardConsumable) parts.push(`🧪 ${ach.rewardConsumable.name} (en Consumibles)`);
    if (ach.rewardEquipment) parts.push(`⚔️ ${ach.rewardEquipment.name} (en Equipamiento)`);
    if (ach.rewardTitle) parts.push(`👑 Título: "${ach.rewardTitle}"`);

    showToast(`🎉 ¡Recompensa reclamada!: ${parts.join(' | ')}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] bg-slate-950/95 border-2 border-amber-400 text-amber-300 font-bold px-4 py-2.5 rounded-xl shadow-2xl text-xs sm:text-sm animate-bounce text-center max-w-lg">
          {toastMessage}
        </div>
      )}

      <div className="relative w-full max-w-5xl h-[90vh] bg-slate-900 border-2 border-amber-500/40 rounded-2xl shadow-2xl text-slate-100 overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 border border-amber-500/50 rounded-xl shadow-inner text-amber-400">
              <Trophy className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-retro tracking-wide text-amber-300 flex items-center gap-2">
                SISTEMA DE LOGROS & RECOMPENSAS
                {unclaimedCount > 0 && (
                  <span className="text-xs bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full animate-bounce">
                    {unclaimedCount} por reclamar
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Desbloquea hitos de combate, exploración y progreso para obtener gloria y recompensas únicas.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playSfx('select');
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all"
            title="Cerrar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="text-sm font-semibold text-slate-200">
              Progreso General: <span className="text-amber-400">{completedCount}</span> / {totalAchievements} ({progressPercent}%)
            </div>
          </div>
          <div className="w-full md:w-80 bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700 relative">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 px-6 py-2 bg-slate-900 border-b border-slate-800/80 overflow-x-auto select-none">
          {[
            { id: 'all', label: 'Todos', icon: <Award className="w-4 h-4" /> },
            { id: 'combat', label: 'Combate', icon: <Swords className="w-4 h-4" /> },
            { id: 'exploration', label: 'Exploración', icon: <Compass className="w-4 h-4" /> },
            { id: 'progression', label: 'Progresión', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'collection', label: 'Colección', icon: <Package className="w-4 h-4" /> },
            { id: 'special', label: 'Especiales', icon: <Star className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundEngine.playSfx('select');
                setSelectedCategory(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                selectedCategory === tab.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Achievements List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {filteredAchievements.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              No hay logros en esta categoría actualmente.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredAchievements.map(({ achievement, progress, isCompleted, isClaimed, canClaim }) => {
                const rarityStyle = getRarityBadge(achievement.rarity);

                return (
                  <div
                    key={achievement.id}
                    className={`relative flex flex-col justify-between p-4 rounded-xl border transition-all ${
                      isClaimed
                        ? 'bg-slate-950/40 border-emerald-900/40 text-slate-300'
                        : isCompleted
                        ? 'bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900 border-amber-500/60 shadow-lg shadow-amber-500/5'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                    }`}
                  >
                    {/* Header with icon, title, rarity */}
                    <div className="flex items-start gap-3">
                      <div
                        className={`text-2xl p-2.5 rounded-xl border flex items-center justify-center ${
                          isCompleted
                            ? 'bg-amber-500/10 border-amber-500/40 shadow-inner'
                            : 'bg-slate-800/60 border-slate-700/60 opacity-75'
                        }`}
                      >
                        {achievement.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3
                            className={`font-bold font-retro text-sm ${
                              isCompleted ? 'text-amber-200' : 'text-slate-300'
                            }`}
                          >
                            {achievement.title}
                          </h3>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded border font-medium uppercase tracking-wider ${rarityStyle.bg} ${rarityStyle.border}`}
                          >
                            {rarityStyle.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {achievement.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar for Incomplete Achievements */}
                    {!isCompleted && (
                      <div className="mt-3">
                        <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                          <span>Progreso</span>
                          <span className="font-mono text-slate-300">
                            {progress.current} / {progress.max}
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden border border-slate-700">
                          <div
                            className="h-full bg-amber-500/70"
                            style={{
                              width: `${Math.min(100, (progress.current / progress.max) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Rewards & Action Button Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
                      {/* Rewards Tags */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                          <Gift className="w-3.5 h-3.5 text-amber-400" /> Recompensas:
                        </span>
                        {achievement.rewardGold > 0 && (
                          <span className="flex items-center gap-1 text-[11px] bg-amber-950/50 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">
                            <Coins className="w-3 h-3 text-amber-400" /> +{achievement.rewardGold} Oro
                          </span>
                        )}
                        {achievement.rewardExp > 0 && (
                          <span className="flex items-center gap-1 text-[11px] bg-blue-950/50 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-mono font-bold">
                            <Sparkles className="w-3 h-3 text-blue-400" /> +{achievement.rewardExp} EXP
                          </span>
                        )}
                        {achievement.rewardConsumable && (
                          <span className="flex items-center gap-1 text-[11px] bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-medium">
                            <span>{achievement.rewardConsumable.icon}</span> {achievement.rewardConsumable.name}
                          </span>
                        )}
                        {achievement.rewardEquipment && (
                          <span className="flex items-center gap-1 text-[11px] bg-purple-950/50 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-medium">
                            <span>{achievement.rewardEquipment.icon}</span> {achievement.rewardEquipment.name}
                          </span>
                        )}
                        {achievement.rewardTitle && (
                          <span className="flex items-center gap-1 text-[11px] bg-yellow-950/50 text-yellow-300 border border-yellow-500/30 px-2 py-0.5 rounded font-medium">
                            <Award className="w-3 h-3 text-yellow-400" /> Título: "{achievement.rewardTitle}"
                          </span>
                        )}
                      </div>

                      {/* State Button */}
                      <div>
                        {isClaimed ? (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg font-semibold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            Reclamado
                          </div>
                        ) : canClaim ? (
                          <button
                            onClick={() => handleClaim(achievement)}
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 px-3.5 py-1.5 rounded-lg shadow-md hover:shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all animate-pulse"
                          >
                            <Gift className="w-4 h-4" />
                            ¡Reclamar!
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                            <Lock className="w-3.5 h-3.5 text-slate-500" />
                            Bloqueado
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
