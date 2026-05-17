import React, { useRef } from 'react';
import { useMovieStore } from '../store/movieStore';
import { genreMap } from '../features/movies/tmdb';
import { cn } from '../lib/utils';

export const GenreFilter: React.FC = () => {
  const { selectedGenre, setGenre } = useMovieStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const genres = [
    { id: null, name: 'Todos' },
    ...Object.entries(genreMap).map(([id, name]) => ({
      id: Number(id),
      name,
    })),
  ];

  return (
    <div className="w-full py-3">
      {/* Mobile: scroll horizontal com fade */}
      <div
        className="md:hidden relative"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        }}
      >
        <div
          ref={scrollRef}
          className="flex items-center space-x-2 px-8 overflow-x-auto scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {genres.map((genre) => (
            <button
              key={genre.id ?? 'all'}
              onClick={() => setGenre(genre.id)}
              className={cn(
                "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border whitespace-nowrap",
                selectedGenre === genre.id
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                  : "bg-card text-card-foreground border-border hover:border-primary/50 hover:bg-accent"
              )}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: pills em linha centralizada com wrap */}
      <div className="hidden md:flex flex-wrap justify-center gap-2 px-4">
        {genres.map((genre) => (
          <button
            key={genre.id ?? 'all'}
            onClick={() => setGenre(genre.id)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border whitespace-nowrap",
              selectedGenre === genre.id
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                : "bg-card text-card-foreground border-border hover:border-primary/50 hover:bg-accent"
            )}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};
