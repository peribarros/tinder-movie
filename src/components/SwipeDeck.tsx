import { useEffect } from 'react';
import { useMovieStore } from '../store/movieStore';
import { MovieCard } from './MovieCard';
import { Heart, X, Loader2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export function SwipeDeck() {
  const { queue, loading, loadMoreMovies, likeMovie, discardMovie } = useMovieStore();

  useEffect(() => {
    if (queue.length < 3) {
      loadMoreMovies();
    }
  }, [queue.length, loadMoreMovies]);

  if (queue.length === 0 && loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] w-full max-w-sm mx-auto text-muted-foreground">
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
        <p className="text-lg font-medium">Buscando filmes incríveis...</p>
      </div>
    );
  }

  if (queue.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] w-full max-w-sm mx-auto text-muted-foreground bg-card rounded-3xl border border-border">
        <p className="text-lg font-medium px-8 text-center">Não há mais filmes disponíveis no momento. Volte mais tarde!</p>
      </div>
    );
  }

  // We want to show the top 2 movies for the stack effect
  const activeMovie = queue[0];
  const nextMovie = queue[1];

  const handleSwipe = (dir: 'left' | 'right') => {
    if (dir === 'right') {
      likeMovie(activeMovie);
    } else {
      discardMovie(activeMovie.id);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative w-full max-w-sm h-[600px] mb-8 perspective-1000">
        <AnimatePresence>
          {nextMovie && (
            <div key={nextMovie.id} className="absolute w-full h-full scale-[0.95] translate-y-4 opacity-50 z-0">
              <MovieCard movie={nextMovie} />
            </div>
          )}
          {activeMovie && (
            <MovieCard
              key={activeMovie.id}
              movie={activeMovie}
              active={true}
              onSwipe={handleSwipe}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center space-x-6">
        <button
          onClick={() => handleSwipe('left')}
          className="p-4 bg-card hover:bg-red-500/10 rounded-full shadow-lg border border-red-500/20 text-red-500 transition-transform hover:scale-110 active:scale-95"
        >
          <X className="w-8 h-8" />
        </button>
        <button
          onClick={() => handleSwipe('right')}
          className="p-4 bg-card hover:bg-green-500/10 rounded-full shadow-lg border border-green-500/20 text-green-500 transition-transform hover:scale-110 active:scale-95"
        >
          <Heart className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
