import { motion, useAnimation } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import type { MovieCardData } from '../features/movies/tmdb';
import { Star, Clock, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
  movie: MovieCardData;
  active?: boolean;
  onSwipe?: (dir: 'left' | 'right') => void;
}

export function MovieCard({ movie, active = false, onSwipe }: MovieCardProps) {
  const controls = useAnimation();
  const navigate = useNavigate();

  const handleDragEnd = async (_e: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    
    if (offset > 100 || velocity > 500) {
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe?.('right');
    } else if (offset < -100 || velocity < -500) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe?.('left');
    } else {
      controls.start({ x: 0, y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  return (
    <motion.div
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      className={`absolute w-full h-full max-w-sm rounded-3xl overflow-hidden shadow-2xl bg-card border border-border flex flex-col ${active ? 'z-10' : 'z-0'}`}
      style={{
        transformOrigin: 'bottom center'
      }}
      whileDrag={{ scale: 1.05 }}
    >
      <div className="relative flex-1 bg-muted">
        {movie.posterUrl ? (
          <img 
            src={movie.posterUrl} 
            alt={movie.title} 
            className="w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground font-medium">
            Sem Imagem
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
      </div>

      <div className="absolute bottom-0 w-full p-6 text-white">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="text-2xl font-bold tracking-tight leading-tight">
            {movie.title} <span className="text-lg font-normal text-gray-300">({movie.year})</span>
          </h2>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/movie/${movie.id}`); }}
            className="flex-shrink-0 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-colors"
            title="Ver detalhes"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center space-x-4 mb-4 text-sm font-medium">
          {movie.rating && (
            <div className="flex items-center text-yellow-400">
              <Star className="w-4 h-4 mr-1 fill-current" />
              <span>{movie.rating}</span>
            </div>
          )}
          {movie.runtime && (
            <div className="flex items-center text-gray-300">
              <Clock className="w-4 h-4 mr-1" />
              <span>{movie.runtime} min</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pointer-events-none">
          {movie.genres.slice(0, 3).map((genre, i) => (
            <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
