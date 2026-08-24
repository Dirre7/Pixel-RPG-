import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';
import { getActiveGamepadName } from '../utils/gamepadManager';
import { Volume2, VolumeX, Gamepad, Settings, X, HelpCircle } from 'lucide-react';

interface AudioSettingsModalProps {
  onClose: () => void;
  onResetGame: () => void;
  onUnlockAllContent?: () => void;
  onReturnToTitle?: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({
  onClose,
  onResetGame,
  onUnlockAllContent,
  onReturnToTitle,
}) => {
  const [muted, setMuted] = useState(soundEngine.getMuted());
  const [musicVol, setMusicVol] = useState(soundEngine.getMusicVolume());
  const [sfxVol, setSfxVol] = useState(soundEngine.getSfxVolume());

  const activeGamepad = getActiveGamepadName();

  const handleMuteToggle = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    soundEngine.setMute(newMuted);
  };

  const handleMusicChange = (val: number) => {
    setMusicVol(val);
    soundEngine.setMusicVolume(val);
  };

  const handleSfxChange = (val: number) => {
    setSfxVol(val);
    soundEngine.setSfxVolume(val);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 z-50 font-mono">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl max-w-md w-full p-4 shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-amber-300">Ajustes del Juego y Sonido</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Controls */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-200">Silenciar Audio</span>
            <button
              onClick={handleMuteToggle}
              className={`p-2 rounded border transition ${
                muted ? 'bg-red-950 text-red-400 border-red-800' : 'bg-emerald-950 text-emerald-400 border-emerald-800'
              }`}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-bold mb-1">
              <span>Música Chiptune</span>
              <span>{Math.round(musicVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicVol}
              onChange={(e) => handleMusicChange(parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-bold mb-1">
              <span>Efectos de Sonido SFX</span>
              <span>{Math.round(sfxVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={sfxVol}
              onChange={(e) => handleSfxChange(parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800"
            />
          </div>
        </div>

        {/* Gamepad Info */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
          <div className="flex items-center space-x-2 font-bold text-amber-300">
            <Gamepad className="w-4 h-4" />
            <span>Estado del Mando / Mandos</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {activeGamepad ? `🎮 Mando Detectado: ${activeGamepad}` : '⌨️ Teclado o Controles Táctiles Activos'}
          </p>
        </div>

        {/* Cheat / Creator Dev Mode Unlock */}
        {onUnlockAllContent && (
          <div className="bg-purple-950/40 p-3 rounded-lg border border-purple-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300">⚡ Modo Creador / Probar Todo</span>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playSfx('levelup');
                  onUnlockAllContent();
                }}
                className="py-1.5 px-3 bg-purple-900 hover:bg-purple-800 text-purple-200 border border-purple-500 rounded text-xs font-black transition active:scale-95 shadow"
              >
                Desbloquear Todo
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Desbloquea Nivel 75, 99.999 Oro, todo el equipo Tier 8 Divino, todas las habilidades legendarias, códice y acceso libre a las 8 regiones.
            </p>
          </div>
        )}

        {/* Danger zone: Reset Game & Return to Title */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-2">
            {onReturnToTitle && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onReturnToTitle();
                }}
                className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded text-xs font-bold transition active:scale-95"
              >
                🚪 Menú Principal
              </button>
            )}

            <button
              onClick={() => {
                if (confirm('¿Reiniciar la ranura actual y borrar este personaje?')) {
                  onResetGame();
                }
              }}
              className="py-1.5 px-3 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded text-xs font-bold"
            >
              Borrar Héroe
            </button>
          </div>

          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
