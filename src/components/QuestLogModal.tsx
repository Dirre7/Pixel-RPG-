import React, { useState } from 'react';
import { Zone, NPCQuest, PlayerStats } from '../types';
import { ALL_GAME_QUESTS, ZONES, isZoneUnlocked, getQuestRewardEquipment, getQuestRewardConsumable } from '../data/gameData';
import { soundEngine } from '../utils/soundEngine';
import { Scroll, CheckCircle2, Circle, Trophy, Award, Gift, Sparkles, X, Compass, MapPin } from 'lucide-react';

interface QuestLogModalProps {
  currentZone: Zone;
  player: PlayerStats;
  completedQuests: string[];
  acceptedQuests?: string[];
  openedChests: string[];
  defeatedBosses: string[];
  defeatedEnemyCounts?: Record<string, number>;
  onClaimReward: (questId: string, gold: number, exp: number) => void;
  onClose: () => void;
}

export const QuestLogModal: React.FC<QuestLogModalProps> = ({
  currentZone,
  player,
  completedQuests,
  acceptedQuests = [],
  openedChests,
  defeatedBosses,
  defeatedEnemyCounts = {},
  onClaimReward,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'main' | 'side' | 'completed'>('active');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('all_zones');
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);

  // Process all quests with acceptance, live progress and completion status
  const allProcessedQuests: (NPCQuest & {
    isAccepted: boolean;
    isCompleted: boolean;
    isReadyToClaim: boolean;
    progressText: string;
    zoneName: string;
  })[] = ALL_GAME_QUESTS.map((quest) => {
    const isCompleted = completedQuests.includes(quest.id);
    const isAccepted = acceptedQuests.includes(quest.id);
    let isReadyToClaim = false;
    let progressText = 'No iniciada (Habla con el NPC)';

    const zoneUnlocked = isZoneUnlocked(quest.zoneId || 'zone_forest', defeatedBosses);

    if (!zoneUnlocked) {
      isReadyToClaim = false;
      progressText = '🔒 Región bloqueada. Derrota al jefe previo.';
    } else if (isCompleted) {
      progressText = '✅ Misión completada';
    } else if (!isAccepted) {
      progressText = `Disponible en ${quest.giverName || 'NPC'}`;
    } else if (quest.targetType === 'defeat_boss') {
      const bossName = String(quest.targetValue).toLowerCase();
      const isBossDefeated = defeatedBosses.some((b) =>
        b.toLowerCase().includes(bossName) || bossName.includes(b.toLowerCase())
      );
      isReadyToClaim = isBossDefeated;
      progressText = isBossDefeated ? '¡Jefe derrotado! Regresa al NPC para entregar' : `Derrotar a ${quest.targetValue} (0/1)`;
    } else if (quest.targetType === 'reach_level') {
      const targetLvl = Number(quest.targetValue);
      isReadyToClaim = player.level >= targetLvl;
      progressText = `Nivel actual ${player.level} / Requerido ${targetLvl}`;
    } else if (quest.targetType === 'open_chests') {
      const targetCount = Number(quest.targetValue);
      const zoneChests = openedChests.filter((id) => id.startsWith(quest.zoneId || '')).length;
      const currentCount = Math.min(targetCount, zoneChests);
      isReadyToClaim = currentCount >= targetCount;
      progressText = `Cofres en la región: ${currentCount} / ${targetCount}`;
    } else if (quest.targetType === 'defeat_enemies') {
      const targetCount = Number(quest.targetValue);
      const enemyKey = (quest.targetEnemyType || '').toLowerCase();
      const kills = defeatedEnemyCounts[enemyKey] || 0;
      const currentKills = Math.min(targetCount, kills);
      isReadyToClaim = currentKills >= targetCount;
      progressText = `Enemigos derrotados: ${currentKills} / ${targetCount}`;
    }

    const zoneObj = ZONES.find((z) => z.id === quest.zoneId);
    const zoneName = zoneObj ? zoneObj.name.split(':')[0] : 'Aethelgard';

    return {
      ...quest,
      isAccepted,
      isCompleted,
      isReadyToClaim,
      progressText,
      zoneName,
    };
  });

  // Filter only quests the player has engaged with (accepted or completed)
  const filteredQuests = allProcessedQuests.filter((q) => {
    // Zone filter
    if (selectedZoneFilter !== 'all_zones' && q.zoneId !== selectedZoneFilter) {
      return false;
    }

    // Category filter: Active tabs only show accepted & not completed quests
    if (activeTab === 'active') return q.isAccepted && !q.isCompleted;
    if (activeTab === 'main') return q.isAccepted && q.category === 'main' && !q.isCompleted;
    if (activeTab === 'side') return q.isAccepted && q.category === 'side' && !q.isCompleted;
    if (activeTab === 'completed') return q.isCompleted;
    return true;
  });

  const selectedQuest =
    filteredQuests.find((q) => q.id === selectedQuestId) ||
    filteredQuests[0] ||
    null;

  const totalCompletedCount = allProcessedQuests.filter((q) => q.isCompleted).length;
  const activeQuestsCount = allProcessedQuests.filter((q) => q.isAccepted && !q.isCompleted).length;
  const readyToClaimCount = allProcessedQuests.filter((q) => q.isAccepted && q.isReadyToClaim && !q.isCompleted).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in font-mono select-none">
      <div className="relative w-full max-w-4xl bg-slate-950 border-2 border-amber-500/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 bg-slate-900/95 border-b border-amber-500/40">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400 border border-amber-500/40">
              <Scroll className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-300 tracking-wide flex items-center gap-2">
                <span>DIARIO DE AVENTURAS Y MISIONES</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-600/60 text-amber-300">
                  {totalCompletedCount} Completadas • {activeQuestsCount} En curso
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Habla con los aldeanos y sabios en cada región para descubrir y aceptar misiones
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playSfx('select');
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-900/60 border-b border-slate-800 text-xs font-bold">
          <div className="flex space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'active', label: `⏳ En Curso (${activeQuestsCount})` },
              { id: 'main', label: `⭐ Principales (${allProcessedQuests.filter(q => q.isAccepted && q.category === 'main' && !q.isCompleted).length})` },
              { id: 'side', label: `📜 Secundarias (${allProcessedQuests.filter(q => q.isAccepted && q.category === 'side' && !q.isCompleted).length})` },
              { id: 'completed', label: `✅ Completadas (${totalCompletedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  soundEngine.playSfx('select');
                  setActiveTab(tab.id as any);
                }}
                className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap text-xs ${
                  activeTab === tab.id
                    ? 'bg-amber-500/20 border border-amber-500 text-amber-300 shadow-sm'
                    : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick claim alert if any */}
          {readyToClaimCount > 0 && (
            <span className="text-[11px] text-amber-300 bg-amber-950/70 border border-amber-500/60 px-2.5 py-1 rounded-lg animate-pulse font-bold">
              ✨ ¡{readyToClaimCount} lista(s) para entregar al NPC!
            </span>
          )}
        </div>

        {/* Zone Filters Bar */}
        <div className="flex space-x-1 p-2 bg-slate-950/80 border-b border-slate-800/80 text-[11px] overflow-x-auto">
          {[
            { id: 'all_zones', label: '🌍 Todo el Reino' },
            { id: 'zone_forest', label: '🌲 Bosque Verde' },
            { id: 'zone_cave', label: '⛏️ Cueva de Sombras' },
            { id: 'zone_volcano', label: '🌋 Volcán Ancestral' },
            { id: 'zone_castle', label: '🏰 Ciudadela Imperial' },
          ].map((z) => (
            <button
              key={z.id}
              onClick={() => {
                soundEngine.playSfx('select');
                setSelectedZoneFilter(z.id);
              }}
              className={`px-2.5 py-1 rounded transition whitespace-nowrap ${
                selectedZoneFilter === z.id
                  ? 'bg-slate-800 text-amber-300 border border-amber-500/50 font-bold'
                  : 'bg-slate-900/50 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>

        {/* Modal Body: Split View (List + Details) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3.5 sm:p-4 flex-1 overflow-y-auto min-h-[340px]">
          {/* Left Column: Quest List */}
          <div className="md:col-span-5 space-y-2 overflow-y-auto max-h-[420px] pr-1">
            {filteredQuests.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs bg-slate-900/40 rounded-xl border border-slate-800 space-y-2">
                <Scroll className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="font-bold text-slate-300">
                  {activeTab === 'completed'
                    ? 'Aún no has completado ninguna misión.'
                    : 'No tienes misiones activas en este registro.'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {activeTab === 'completed'
                    ? 'Cumple misiones y entrégalas a los NPCs para ganar recompensas y gloria.'
                    : 'Explora las aldeas y habla con los NPCs para aceptar encargos y aventuras.'}
                </p>
              </div>
            ) : (
              filteredQuests.map((quest) => {
                const isSelected = selectedQuest?.id === quest.id;

                return (
                  <button
                    key={quest.id}
                    onClick={() => {
                      soundEngine.playSfx('select');
                      setSelectedQuestId(quest.id);
                    }}
                    className={`w-full p-2.5 sm:p-3 rounded-xl border text-left transition flex flex-col space-y-1.5 ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 shadow-md'
                        : 'bg-slate-900/70 border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {quest.category === 'main' ? '⭐ Principal' : '📜 Secundaria'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {quest.zoneName.split(' ')[0]}
                        </span>
                      </div>
                      {quest.isCompleted ? (
                        <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Completada</span>
                        </span>
                      ) : quest.isReadyToClaim ? (
                        <span className="text-[10px] text-amber-300 font-bold animate-pulse flex items-center space-x-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>¡Entregar!</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-sky-400 flex items-center space-x-1">
                          <Circle className="w-3 h-3" />
                          <span>En curso</span>
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-bold text-slate-100 line-clamp-1">{quest.title}</div>
                    <div className="text-[10px] text-slate-400">Emisor: {quest.giverName}</div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Column: Quest Details */}
          <div className="md:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between space-y-3.5">
            {selectedQuest ? (
              <>
                <div className="space-y-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {selectedQuest.category === 'main' ? '⭐ Misión Principal' : 'Misión Secundaria'}
                      </span>
                      {selectedQuest.category === 'main' && selectedQuest.targetType !== 'defeat_boss' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                          <span>🔒</span> Requisito para abrir el Portal del Jefe
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">
                        Otorgada por: <strong className="text-slate-200">{selectedQuest.giverName}</strong> ({selectedQuest.zoneName})
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-amber-300 mt-1">
                      {selectedQuest.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                    {selectedQuest.description}
                  </p>

                  {/* Objective & Progress */}
                  <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80 space-y-1">
                    <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>Objetivo de la Misión:</span>
                      <span className="text-amber-400 font-normal">{selectedQuest.progressText}</span>
                    </div>
                  </div>

                  {/* Rewards */}
                  <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80 space-y-2">
                    <div className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                      <Gift className="w-4 h-4" />
                      <span>Recompensas al Entregar:</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                      <div className="p-2 bg-slate-900 rounded border border-slate-800 text-amber-400 flex items-center space-x-1.5">
                        <span>💰</span>
                        <span>+{selectedQuest.rewardGold} Oro</span>
                      </div>
                      <div className="p-2 bg-slate-900 rounded border border-slate-800 text-sky-400 flex items-center space-x-1.5">
                        <span>⭐</span>
                        <span>+{selectedQuest.rewardExp} EXP</span>
                      </div>
                      {selectedQuest.rewardItemName && (() => {
                        const equip = getQuestRewardEquipment(selectedQuest);
                        const consumable = getQuestRewardConsumable(selectedQuest);
                        return (
                          <div className="p-2.5 bg-emerald-950/40 rounded border border-emerald-500/40 text-emerald-300 text-xs font-bold flex flex-col space-y-1 col-span-2">
                            <div className="flex items-center space-x-1.5 text-emerald-400">
                              <span>{equip?.icon || consumable?.icon || '🎁'}</span>
                              <span className="font-black text-amber-200">Recompensa: {selectedQuest.rewardItemName}</span>
                              <span className="text-[10px] text-emerald-400 font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-900/60 ml-auto">
                                {equip ? `Equip: ${equip.slot}` : consumable ? 'Consumible' : 'Objeto'}
                              </span>
                            </div>
                            {equip && (
                              <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
                                {equip.bonusAttack ? <span className="text-red-300 font-bold">+{equip.bonusAttack} ATK</span> : null}
                                {equip.bonusDefense ? <span className="text-cyan-300 font-bold">+{equip.bonusDefense} DEF</span> : null}
                                {equip.bonusHp ? <span className="text-emerald-300 font-bold">+{equip.bonusHp} HP</span> : null}
                                {equip.bonusMp ? <span className="text-sky-300 font-bold">+{equip.bonusMp} MP</span> : null}
                                {equip.bonusSpeed ? <span className="text-yellow-300 font-bold">+{equip.bonusSpeed} VEL</span> : null}
                              </div>
                            )}
                            {consumable && !equip && (
                              <div className="text-[11px] text-slate-300 font-normal">
                                {consumable.description || 'Poción o elixir para restaurar vitalidad.'}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Status Guidance */}
                <div>
                  {selectedQuest.isCompleted ? (
                    <div className="w-full py-2.5 bg-slate-800 text-emerald-400 text-xs font-bold text-center rounded-lg border border-emerald-500/30 flex items-center justify-center space-x-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Misión Completada y Recompensas Reclamadas</span>
                    </div>
                  ) : selectedQuest.isReadyToClaim ? (
                    <div className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg shadow-lg flex items-center justify-center space-x-2 animate-pulse">
                      <Sparkles className="w-4 h-4" />
                      <span>¡Habla con {selectedQuest.giverName} en {selectedQuest.zoneName} para entregar!</span>
                    </div>
                  ) : (
                    <div className="w-full py-2.5 bg-slate-950/60 text-slate-400 text-xs font-bold text-center rounded-lg border border-slate-800 flex items-center justify-center space-x-2">
                      <Circle className="w-3.5 h-3.5 text-sky-400" />
                      <span>Misión en progreso... Cumple el objetivo y regresa con {selectedQuest.giverName}</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center h-full space-y-2">
                <Scroll className="w-10 h-10 text-slate-700" />
                <p>Selecciona una misión de la lista para ver su descripción, objetivos y recompensas.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
