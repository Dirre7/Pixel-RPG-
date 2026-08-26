import React, { useEffect, useState, useCallback } from 'react';
import { HeroClass, HeroCombatSkill, OverworldEnemy } from '../types';
import { HERO_COMBAT_SKILLS } from '../data/gameData';
import { Swords, Skull, Info, Sparkles } from 'lucide-react';

interface ActionCombatControlsProps {
  heroClass: HeroClass;
  currentMp: number;
  maxMp: number;
  onBasicAttack: () => void;
  onUseSkill: (skill: HeroCombatSkill, slotIndex: number) => boolean; // returns true if executed
  activeBoss?: OverworldEnemy | null;
  className?: string;
}

export const ActionCombatControls: React.FC<ActionCombatControlsProps> = ({
  heroClass,
  currentMp,
  maxMp,
  onBasicAttack,
  onUseSkill,
  activeBoss,
  className = '',
}) => {
  const skills = HERO_COMBAT_SKILLS[heroClass] || HERO_COMBAT_SKILLS.warrior;

  // Cooldown tracking (in milliseconds timestamp when available)
  const [skillCooldowns, setSkillCooldowns] = useState<number[]>([0, 0, 0]);
  const [nowTime, setNowTime] = useState<number>(Date.now());
  const [basicAttackActive, setBasicAttackActive] = useState(false);
  const [selectedTooltipIndex, setSelectedTooltipIndex] = useState<number | null>(null);

  // Update clock for cooldown progress
  useEffect(() => {
    const timer = setInterval(() => setNowTime(Date.now()), 60);
    return () => clearInterval(timer);
  }, []);

  const triggerBasicAttack = useCallback(() => {
    setBasicAttackActive(true);
    setTimeout(() => setBasicAttackActive(false), 160);
    onBasicAttack();
  }, [onBasicAttack]);

  const triggerSkill = useCallback(
    (slotIndex: number) => {
      const skill = skills[slotIndex];
      if (!skill) return;

      const cdEnd = skillCooldowns[slotIndex] || 0;
      if (Date.now() < cdEnd) return; // on cooldown
      if (currentMp < skill.manaCost) return; // not enough mana

      const success = onUseSkill(skill, slotIndex);
      if (success) {
        setSkillCooldowns((prev) => {
          const next = [...prev];
          next[slotIndex] = Date.now() + skill.cooldownSeconds * 1000;
          return next;
        });
      }
    },
    [skills, skillCooldowns, currentMp, onUseSkill]
  );

  // Keyboard Shortcuts (Space = Basic Attack, 1/2/3 or Q/E/R = Skills)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        triggerBasicAttack();
      } else if (e.code === 'KeyQ' || e.code === 'Digit1') {
        e.preventDefault();
        triggerSkill(0);
      } else if (e.code === 'KeyE' || e.code === 'Digit2') {
        e.preventDefault();
        triggerSkill(1);
      } else if (e.code === 'KeyR' || e.code === 'Digit3') {
        e.preventDefault();
        triggerSkill(2);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerBasicAttack, triggerSkill]);

  return (
    <div className={`pointer-events-none select-none ${className}`}>
      {/* 👑 EPIC BOSS HEALTH BAR AT TOP (Visible when fighting an active boss) */}
      {activeBoss && activeBoss.hp > 0 && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 w-11/12 max-w-lg z-40 bg-slate-950/95 border-2 border-red-500/80 rounded-xl p-2.5 shadow-2xl backdrop-blur-md animate-fade-in pointer-events-auto">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1.5">
              <Skull className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="font-extrabold text-sm text-red-300 tracking-wide">
                {activeBoss.name}
              </span>
              <span className="text-[10px] bg-red-950 text-red-400 px-1.5 py-0.5 rounded border border-red-800 font-bold">
                JEFE NIV. {activeBoss.level}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-300">
              {Math.max(0, activeBoss.hp)} / {activeBoss.maxHp}
            </span>
          </div>
          <div className="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden border border-red-900/60 p-0.5">
            <div
              className="bg-gradient-to-r from-red-600 via-amber-500 to-red-500 h-full rounded-full transition-all duration-150 shadow-lg shadow-red-500/50"
              style={{
                width: `${Math.max(0, Math.min(100, (activeBoss.hp / activeBoss.maxHp) * 100))}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* 🎮 COMBAT ACTION CONTROLS HUD (Bottom Right on Screen) */}
      <div className="fixed bottom-4 right-4 z-40 flex items-end gap-2 sm:gap-3 pointer-events-auto">
        {/* SKILLS CONTAINER (3 Clean Buttons with Hotkeys & Tooltips) */}
        <div className="flex items-center gap-2 mb-1">
          {skills.map((skill, idx) => {
            const cdEnd = skillCooldowns[idx] || 0;
            const remainingMs = Math.max(0, cdEnd - nowTime);
            const isCooling = remainingMs > 0;
            const hasMana = currentMp >= skill.manaCost;

            return (
              <div key={skill.id} className="relative group">
                {/* TOOLTIP POPUP (Visible on hover or touch) */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex group-focus:flex flex-col w-48 p-2.5 bg-slate-950/95 border-2 border-amber-500/60 rounded-xl shadow-2xl backdrop-blur-md pointer-events-none z-50 text-left">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1">
                    <span className="font-extrabold text-xs text-amber-300 flex items-center gap-1">
                      {skill.name}
                    </span>
                    <span className="text-[10px] font-mono text-sky-400 font-bold">
                      {skill.manaCost} MP
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-tight mb-1.5 font-sans">
                    {skill.description}
                  </p>
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                    <span>Recarga: {skill.cooldownSeconds}s</span>
                    <span className="text-amber-400 font-bold">Daño: {Math.round(skill.damageMultiplier * 100)}%</span>
                  </div>
                </div>

                {/* SKILL BUTTON */}
                <button
                  onClick={() => triggerSkill(idx)}
                  disabled={isCooling || !hasMana}
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center border-2 transition-all active:scale-95 shadow-xl ${
                    !hasMana
                      ? 'bg-slate-900/80 border-slate-700 opacity-60'
                      : isCooling
                      ? 'bg-slate-900/90 border-slate-700'
                      : idx === 0
                      ? 'bg-gradient-to-b from-amber-600 to-amber-900 border-amber-400 hover:brightness-110 shadow-amber-900/40'
                      : idx === 1
                      ? 'bg-gradient-to-b from-sky-600 to-sky-900 border-sky-400 hover:brightness-110 shadow-sky-900/40'
                      : 'bg-gradient-to-b from-purple-600 to-purple-900 border-purple-400 hover:brightness-110 shadow-purple-900/40'
                  }`}
                >
                  {/* Skill Icon */}
                  <span className="text-xl sm:text-2xl leading-none drop-shadow">{skill.icon}</span>

                  {/* Hotkey Badge */}
                  <span className="absolute -top-1.5 -left-1.5 bg-slate-950/90 text-amber-300 text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.2 rounded-md border border-amber-500/50 shadow">
                    {idx === 0 ? 'Q' : idx === 1 ? 'E' : 'R'}
                  </span>

                  {/* Mana Cost Badge */}
                  <span className={`text-[9px] font-bold ${hasMana ? 'text-sky-300' : 'text-red-400'}`}>
                    {skill.manaCost} MP
                  </span>

                  {/* Cooldown Dark Overlay */}
                  {isCooling && (
                    <div className="absolute inset-0 bg-slate-950/85 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-600">
                      <span className="font-extrabold text-xs sm:text-sm text-amber-300 font-mono drop-shadow">
                        {(remainingMs / 1000).toFixed(1)}s
                      </span>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* BIG PRIMARY ATTACK BUTTON [⚔️] */}
        <button
          onClick={triggerBasicAttack}
          title="Ataque Básico - [Espacio / Click]"
          className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center border-4 transition-all shadow-2xl active:scale-90 ${
            basicAttackActive
              ? 'bg-amber-400 border-yellow-200 scale-95 shadow-amber-500/80 ring-4 ring-amber-400/50'
              : 'bg-gradient-to-b from-red-600 via-amber-600 to-amber-800 border-amber-300 hover:brightness-110 shadow-red-950/80'
          }`}
        >
          <Swords className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-md transition-transform group-active:rotate-12" />
          <span className="text-[9px] sm:text-[10px] font-extrabold text-amber-100 tracking-wider">
            ATACAR
          </span>

          <span className="absolute -top-1 -right-1 bg-slate-950/90 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-400 shadow">
            Espacio
          </span>
        </button>
      </div>
    </div>
  );
};
