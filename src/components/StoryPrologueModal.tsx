import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  Scroll,
  Shield,
  Zap,
  Flame,
  Crown
} from 'lucide-react';

interface StoryPrologueModalProps {
  onClose: () => void;
  onStartAdventure?: () => void;
  initialSlideIndex?: number;
  mode?: 'prologue' | 'zone_intro';
  zoneName?: string;
}

export const StoryPrologueModal: React.FC<StoryPrologueModalProps> = ({
  onClose,
  onStartAdventure,
  initialSlideIndex = 0,
  mode = 'prologue',
  zoneName,
}) => {
  const [currentSlide, setCurrentSlide] = useState(initialSlideIndex);

  useEffect(() => {
    soundEngine.playMusic('sanctuary');
  }, []);

  const PROLOGUE_SLIDES = [
    {
      title: 'La Era del Cristal y la Gran Concordia',
      era: 'El Génesis de Aethelgard',
      icon: '✨',
      gradient: 'from-blue-950/80 via-slate-900 to-amber-950/60',
      paragraphs: [
        'En los albores de los tiempos, los Titanes Estelares descendieron sobre el mundo salvaje de Aethelgard.',
        'Para dar equilibrio y vida eterna a la tierra, forjaron el Cristal Primigenio: una joya divina colocada en el corazón de la Gran Ciudadela.',
        'Bajo su brillo celestial, humanos, elfos y enanos vivieron siglos de paz en la Gran Concordia.'
      ],
      quote: '«Mientras el Cristal brille, ninguna sombra devorará la esperanza de los mortales.»'
    },
    {
      title: 'La Traición de Malakor & La Fractura',
      era: 'Año 342 • El Eclipse Sombrío',
      icon: '⚡',
      gradient: 'from-purple-950/80 via-slate-900 to-red-950/60',
      paragraphs: [
        'Pero la codicia humana no conoció límites. El Archicanciller Malakor descubrió los Tomos Prohibidos del Vacío.',
        'En una noche de eclipse, hizo estallar el Cristal Primigenio en cuatro fragmentos elementales dispersos por todo el continente.',
        'La onda expansiva convirtió la Ciudadela en el Castillo Maldito y despertó hordas arcanas en cada rincón del reino.'
      ],
      quote: '«La luz se hizo añicos, y con su caída el abismo reclamó los tronos de los reyes.»'
    },
    {
      title: 'Los Cuatro Reinos Elementales',
      era: 'La Geografía de la Calamidad',
      icon: '🗺️',
      gradient: 'from-emerald-950/80 via-slate-900 to-amber-950/60',
      paragraphs: [
        '🌲 Bosque Verde: La vitalidad desbordada engendró al Gran Rey Slime y corrompió la fauna silvestre.',
        '⛏️ Cueva de Sombras: Las antiguas minas enanas cayeron ante el titánico Gólem de Obsidiana.',
        '🌋 Volcán Ancestral: El Dragón Primordial Ignis despertó furioso en la caldera de fuego eterno.',
        '🏰 Castillo Maldito: El Lich Rey Malakor alza a los caídos esperando el fin del mundo.'
      ],
      quote: '«Solo reuniendo los 4 fragmentos se podrá restaurar el Cristal y devolver la paz a Aethelgard.»'
    },
    {
      title: 'La Profecía del Elegido',
      era: 'Tu Destino Comienza Ahora',
      icon: '⚔️',
      gradient: 'from-amber-950/80 via-slate-900 to-blue-950/70',
      paragraphs: [
        'Las estrellas han hablado. Un viajero intrépido ha tomado las armas para recorrer los cuatro dominios.',
        'Armado con coraje, magia y destreza, deberás vencer a los monstruos, ayudar a los sabios y forjar tu leyenda en el Códice de Aethelgard.',
        '¡Desenvaina tu arma, domina tus habilidades y salva el reino de la oscuridad eterna!'
      ],
      quote: '«¡Que la luz del Cristal guíe tus pasos, valiente héroe!»'
    }
  ];

  const slides = PROLOGUE_SLIDES;

  const handleFinish = () => {
    soundEngine.playSfx('select');
    if (onStartAdventure) {
      onStartAdventure();
    } else {
      onClose();
    }
  };

  const handleNext = () => {
    soundEngine.playSfx('select');
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    soundEngine.playSfx('select');
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn select-none">
      <div
        className={`relative w-full max-w-2xl sm:max-w-3xl bg-gradient-to-b ${slide.gradient} border-2 border-amber-500/60 rounded-2xl sm:rounded-3xl shadow-2xl text-slate-100 overflow-hidden flex flex-col`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-amber-500/30 bg-black/50">
          <div className="flex items-center gap-2 text-amber-400">
            <Scroll className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider font-mono text-amber-300">
              Crónicas de Aethelgard • Prólogo
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFinish}
              className="px-2.5 py-1 text-xs font-mono font-bold text-amber-300/80 hover:text-amber-200 bg-slate-900/80 hover:bg-amber-950/80 border border-amber-500/40 rounded-lg transition active:scale-95"
              title="Saltar Prólogo e iniciar juego"
            >
              Saltar ⏭️
            </button>
            <button
              onClick={handleFinish}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Story Body Content */}
        <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Era & Title */}
          <div className="text-center space-y-1.5 sm:space-y-2">
            <span className="inline-block px-3 py-0.5 sm:py-1 text-xs font-semibold text-amber-300 bg-amber-950/70 border border-amber-500/50 rounded-full font-mono shadow">
              {slide.era}
            </span>
            <div className="text-3xl sm:text-4xl my-1 sm:my-2 drop-shadow-md">{slide.icon}</div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-200 font-serif tracking-wide drop-shadow">
              {slide.title}
            </h2>
          </div>

          {/* Paragraphs with Old Tome Design */}
          <div className="p-4 sm:p-6 rounded-2xl bg-black/60 border border-amber-500/30 shadow-inner space-y-3 sm:space-y-4 font-serif text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed text-justify">
            {slide.paragraphs.map((p, idx) => (
              <p key={idx} className="first-letter:text-2xl sm:first-letter:text-3xl first-letter:font-bold first-letter:text-amber-400 first-letter:mr-1">
                {p}
              </p>
            ))}
            <div className="pt-3 border-t border-amber-500/30 text-center italic text-xs sm:text-sm text-amber-300 font-serif">
              {slide.quote}
            </div>
          </div>

          {/* Slide Progress Indicators */}
          <div className="flex items-center justify-center gap-2 pt-1 sm:pt-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundEngine.playSfx('select');
                  setCurrentSlide(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide
                    ? 'w-8 bg-amber-400 shadow-md shadow-amber-500/60'
                    : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                aria-label={`Ir al capítulo ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-black/70 border-t border-amber-500/30">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl text-slate-300 font-medium transition active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/30 transition transform active:scale-95 border border-amber-300"
          >
            {currentSlide === slides.length - 1 ? (
              <>
                ¡Comenzar Aventura! <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              </>
            ) : (
              <>
                Siguiente Capítulo <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
