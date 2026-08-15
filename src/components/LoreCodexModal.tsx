import React, { useState } from 'react';
import { LoreEntry, PlayerStats } from '../types';
import { GAME_LORE_ENTRIES } from '../data/loreData';
import { soundEngine } from '../utils/soundEngine';
import {
  BookOpen,
  Scroll,
  Shield,
  Sparkles,
  Award,
  CheckCircle2,
  Lock,
  ChevronRight,
  X,
  Compass,
  Flame,
  Crown,
  Eye,
  MapPin
} from 'lucide-react';

interface LoreCodexModalProps {
  player: PlayerStats;
  unlockedLoreIds: string[];
  defeatedBosses: string[];
  currentZoneId: string;
  onClose: () => void;
  onUnlockLore?: (loreId: string) => void;
}

export const LoreCodexModal: React.FC<LoreCodexModalProps> = ({
  player,
  unlockedLoreIds,
  defeatedBosses,
  currentZoneId,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'chronicle' | 'location' | 'boss' | 'character' | 'relic'>('all');
  const [selectedLoreId, setSelectedLoreId] = useState<string>(GAME_LORE_ENTRIES[0].id);

  const totalEntries = GAME_LORE_ENTRIES.length;
  
  // Calculate if entry is unlocked
  const isLoreUnlocked = (entry: LoreEntry): boolean => {
    if (entry.unlockedByDefault) return true;
    if (unlockedLoreIds.includes(entry.id)) return true;
    
    // Auto-check boss unlocks
    if (entry.id === 'lore_boss_slime' && defeatedBosses.includes('Gran Rey Slime')) return true;
    if (entry.id === 'lore_boss_golem' && defeatedBosses.includes('Golem de Obsidiana')) return true;
    if (entry.id === 'lore_boss_dragon' && defeatedBosses.includes('Dragón Infernal Ignis')) return true;
    if (entry.id === 'lore_boss_malakor' && defeatedBosses.includes('Lich Rey Malakor')) return true;

    // Auto-check zone discoveries
    if (entry.id === 'lore_forest_secret') return true;
    if (entry.id === 'lore_cave_ruins' && (currentZoneId === 'zone_cave' || currentZoneId === 'zone_volcano' || currentZoneId === 'zone_castle')) return true;
    if (entry.id === 'lore_volcano_forge' && (currentZoneId === 'zone_volcano' || currentZoneId === 'zone_castle')) return true;
    if (entry.id === 'lore_castle_fall' && currentZoneId === 'zone_castle') return true;

    return false;
  };

  const unlockedCount = GAME_LORE_ENTRIES.filter((e) => isLoreUnlocked(e)).length;
  const progressPercent = Math.round((unlockedCount / totalEntries) * 100);

  const filteredEntries = GAME_LORE_ENTRIES.filter((entry) => {
    if (selectedCategory === 'all') return true;
    return entry.category === selectedCategory;
  });

  const selectedEntry = GAME_LORE_ENTRIES.find((e) => e.id === selectedLoreId) || GAME_LORE_ENTRIES[0];
  const isSelectedUnlocked = isLoreUnlocked(selectedEntry);

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'chronicle':
        return { label: 'Crónica Principal', color: 'text-amber-400 bg-amber-950/40 border-amber-500/30' };
      case 'location':
        return { label: 'Región & Mapa', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30' };
      case 'boss':
        return { label: 'Bestiario de Jefes', color: 'text-purple-400 bg-purple-950/40 border-purple-500/30' };
      case 'character':
        return { label: 'Héroe Fundador', color: 'text-blue-400 bg-blue-950/40 border-blue-500/30' };
      case 'relic':
        return { label: 'Reliquia Sagrada', color: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30' };
      default:
        return { label: 'Lore', color: 'text-slate-400 bg-slate-800 border-slate-700' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[88vh] bg-slate-900 border-2 border-amber-500/40 rounded-2xl shadow-2xl text-slate-100 overflow-hidden flex flex-col">
        {/* Top Header Banner */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/30 border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/40 rounded-xl shadow-inner text-amber-400">
              <Scroll className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black text-amber-300 tracking-wide font-serif">
                  Compendio y Códice de Aethelgard
                </h2>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/40 rounded-full">
                  Historia & Leyendas
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Descubre los secretos del Cristal Primigenio y las memorias olvidadas del reino.
              </p>
            </div>
          </div>

          {/* Progress Tracker & Close */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs text-amber-400 font-bold">
                Descubrimiento: {unlockedCount} / {totalEntries} ({progressPercent}%)
              </span>
              <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden mt-1 border border-amber-500/20">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
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
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 overflow-x-auto text-xs font-medium">
          {[
            { id: 'all', label: 'Todo el Compendio', icon: BookOpen },
            { id: 'chronicle', label: 'Crónica Principal', icon: Scroll },
            { id: 'location', label: 'Mapas & Regiones', icon: MapPin },
            { id: 'boss', label: 'Bestiario de Jefes', icon: Crown },
            { id: 'character', label: 'Héroes Legendarios', icon: Shield },
            { id: 'relic', label: 'Reliquias Sagradas', icon: Sparkles },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundEngine.playSfx('select');
                  setSelectedCategory(cat.id as any);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg whitespace-nowrap transition ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm font-semibold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Main Content: Two Columns (List + Detail Pane) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-slate-900/50">
          {/* Left Column: List of Lore Tomes */}
          <div className="md:col-span-5 border-r border-slate-800 overflow-y-auto p-4 space-y-2">
            {filteredEntries.map((entry) => {
              const unlocked = isLoreUnlocked(entry);
              const isSelected = entry.id === selectedLoreId;
              const badge = getCategoryBadge(entry.category);

              return (
                <button
                  key={entry.id}
                  onClick={() => {
                    soundEngine.playSfx('select');
                    setSelectedLoreId(entry.id);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500/60 shadow-md ring-1 ring-amber-500/30'
                      : unlocked
                      ? 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700 text-slate-300'
                      : 'bg-slate-950/20 border-slate-800/60 opacity-60 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 border ${
                        unlocked
                          ? 'bg-slate-900 border-slate-700 text-amber-400 shadow-inner'
                          : 'bg-slate-950 border-slate-800 text-slate-600'
                      }`}
                    >
                      {unlocked ? entry.icon : <Lock className="w-4 h-4 text-slate-500" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-100 truncate">
                          {unlocked ? entry.title : 'Tomo Sellado por la Niebla'}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {unlocked ? entry.shortSummary : entry.unlockConditionText}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition ${
                      isSelected ? 'text-amber-400 translate-x-0.5' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Reading Parchment Viewer */}
          <div className="md:col-span-7 overflow-y-auto p-6 flex flex-col justify-between bg-slate-950/70 relative">
            {isSelectedUnlocked ? (
              <div className="space-y-6">
                {/* Entry Header */}
                <div className="border-b border-amber-500/20 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        getCategoryBadge(selectedEntry.category).color
                      }`}
                    >
                      {getCategoryBadge(selectedEntry.category).label}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      📅 {selectedEntry.dateOrEra}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-amber-300 font-serif tracking-wide flex items-center gap-2">
                    <span className="text-2xl">{selectedEntry.icon}</span>
                    {selectedEntry.title}
                  </h3>
                  <p className="text-xs text-amber-200/70 italic mt-1 font-serif">
                    « {selectedEntry.shortSummary} »
                  </p>
                </div>

                {/* Narrative Paragraphs with Parchment Feel */}
                <div className="space-y-4 text-slate-200 text-sm md:text-base leading-relaxed font-serif bg-amber-950/10 p-5 rounded-2xl border border-amber-500/20 shadow-inner">
                  {selectedEntry.fullText.map((p, idx) => (
                    <p key={idx} className="first-letter:text-2xl first-letter:font-bold first-letter:text-amber-400 first-letter:mr-1">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Discovery Honor Reward Badge */}
                <div className="flex items-center justify-between p-3.5 bg-slate-900/90 border border-emerald-500/30 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold text-emerald-400">
                        Entrada del Códice Desbloqueada
                      </span>
                      <p className="text-[11px] text-slate-400">
                        {selectedEntry.unlockConditionText}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
                    +{selectedEntry.revelationBonusScore || 200} Pts Gloria
                  </span>
                </div>
              </div>
            ) : (
              // Locked State Viewer
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-600 shadow-inner">
                  <Lock className="w-12 h-12 text-amber-500/40 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-slate-300">
                  Tomo Sellado por la Calamidad
                </h3>
                <p className="text-sm text-slate-400 max-w-md leading-relaxed font-sans">
                  Las páginas de esta memoria ancestral permanecen ocultas bajo la niebla de la fractura.
                </p>
                <div className="p-4 bg-slate-900/80 border border-amber-500/30 rounded-xl text-xs text-amber-300 max-w-md">
                  <span className="font-bold block mb-1">🔍 Cómo desbloquear esta historia:</span>
                  {selectedEntry.unlockConditionText}
                </div>
              </div>
            )}

            {/* Bottom Footer Note */}
            <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span>Aethelgard RPG • Crónicas del Cristal</span>
              <span>Viajero: {player.name} ({player.heroClass})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
