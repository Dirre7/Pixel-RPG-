import React, { useEffect, useState } from 'react';
import { LeaderboardEntry, PlayerStats } from '../types';
import { Trophy, RefreshCw, X, Award, Medal, Crown } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface LeaderboardModalProps {
  player?: PlayerStats;
  currentZoneName?: string;
  defeatedBossesCount?: number;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  player,
  currentZoneName = 'Bosque Verde',
  defeatedBossesCount = 0,
  onClose,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      if (data.success && Array.isArray(data.leaderboard)) {
        setEntries(data.leaderboard);
      } else {
        setError('Error al obtener la tabla de clasificación.');
      }
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleSubmitScore = async () => {
    if (!player || submitting) return;
    setSubmitting(true);
    soundEngine.playSfx('select');

    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: player.name,
          heroClass: player.heroClass,
          level: player.level,
          score: player.score,
          zone: currentZoneName,
          bossesDefeated: defeatedBossesCount,
          playTimeMinutes: 20,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        soundEngine.playSfx('levelup');
        if (data.leaderboard) {
          setEntries(data.leaderboard);
        }
      }
    } catch (err) {
      console.error('Error submitting score:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 z-50 font-mono">
      <div className="bg-slate-900 border-2 border-amber-500/80 rounded-xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-amber-300">
              🏆 Tabla de Clasificación Global
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchLeaderboard}
              disabled={loading}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-100 transition"
              title="Actualizar"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Submit current player run option */}
        {player && (
          <div className="p-3 bg-slate-950/90 border-b border-slate-800 flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-amber-300">{player.name}</span> · Niv. {player.level} {player.heroClass}
              <div className="text-[10px] text-slate-400">Puntuación Actual: {player.score} Pts</div>
            </div>

            <button
              onClick={handleSubmitScore}
              disabled={submitting || submitted}
              className={`py-1.5 px-3 rounded font-bold text-xs transition ${
                submitted
                  ? 'bg-emerald-600 text-slate-950'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {submitted ? '✓ Puntuación Enviada' : submitting ? 'Enviando...' : 'Publicar en Ranking'}
            </button>
          </div>
        )}

        {/* Leaderboard Table List */}
        <div className="flex-1 p-3 overflow-y-auto space-y-2">
          {loading ? (
            <div className="text-center p-8 text-xs text-slate-400 animate-pulse">
              Cargando clasificaciones globales...
            </div>
          ) : error ? (
            <div className="text-center p-8 text-xs text-red-400">{error}</div>
          ) : entries.length === 0 ? (
            <div className="text-center p-8 text-xs text-slate-500">
              Aún no hay puntuaciones registradas. ¡Sé el primero en el podio!
            </div>
          ) : (
            entries.map((item, idx) => {
              const rank = idx + 1;
              let rankBadge = <span className="font-bold text-slate-400">#{rank}</span>;
              let rowStyle = 'bg-slate-950/60 border-slate-800';

              if (rank === 1) {
                rankBadge = <Crown className="w-4 h-4 text-yellow-400" />;
                rowStyle = 'bg-amber-950/40 border-amber-500/60 text-amber-200';
              } else if (rank === 2) {
                rankBadge = <Medal className="w-4 h-4 text-slate-300" />;
                rowStyle = 'bg-slate-800/80 border-slate-600';
              } else if (rank === 3) {
                rankBadge = <Medal className="w-4 h-4 text-amber-600" />;
                rowStyle = 'bg-amber-950/20 border-amber-800/60';
              }

              return (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-lg border flex items-center justify-between text-xs transition ${rowStyle}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 text-center">{rankBadge}</div>
                    <div>
                      <div className="font-bold text-amber-300">{item.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {item.heroClass} · Niv. {item.level} · {item.zone}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-amber-400 text-sm">{item.score} Pts</div>
                    <div className="text-[10px] text-slate-500">
                      💀 {item.bossesDefeated} Jefes · {item.date}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
