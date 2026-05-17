import { useMovieStore } from '../store/movieStore';
import { Star, Clock, HeartOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export function SavedMoviesList() {
  const { liked, discardMovie } = useMovieStore();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLikedMovies() {
      if (liked.length === 0) {
        setMovies([]);
        setLoading(false);
        return;
      }
      
      try {
        const fetchedMovies = await Promise.all(
          liked.map(async (id) => {
            const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=pt-BR`);
            return res.json();
          })
        );
        
        const formatted = fetchedMovies.map((m: any) => ({
          id: m.id,
          title: m.title,
          posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
          year: m.release_date ? m.release_date.substring(0, 4) : null,
          rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : null,
          runtime: m.runtime,
          genres: m.genres?.map((g: any) => g.name) || [],
        }));
        
        setMovies(formatted);
      } catch (error) {
        console.error("Erro ao carregar filmes curtidos", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLikedMovies();
  }, [liked]);

  const handleRemove = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    discardMovie(id);
    setMovies(movies.filter(m => m.id !== id));
  };

  if (loading) {
    return <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-muted-foreground">
        <HeartOff className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-xl font-medium">Você ainda não curtiu nenhum filme.</p>
        <p className="text-sm mt-2">Dê match em alguns filmes na página inicial!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight">Meus Filmes</h1>
        <p className="text-muted-foreground text-sm mt-1">{movies.length} filme{movies.length !== 1 ? 's' : ''} com match</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="bg-card rounded-2xl overflow-hidden border border-border shadow-md transition-all hover:scale-[1.03] hover:shadow-primary/20 hover:shadow-xl cursor-pointer group"
          >
            <div className="relative aspect-[2/3] bg-muted">
              {movie.posterUrl ? (
                <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">Sem imagem</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-2 right-2">
                <button 
                  onClick={(e) => handleRemove(e, movie.id)}
                  className="bg-black/50 backdrop-blur-md p-2 rounded-full text-white hover:text-red-500 hover:bg-black/80 transition-colors"
                  title="Remover dos favoritos"
                >
                  <HeartOff className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-semibold text-center bg-black/50 backdrop-blur-sm rounded-full py-1">
                  Ver detalhes
                </p>
              </div>
            </div>
            
            <div className="p-3">
              <h3 className="font-bold text-sm leading-tight mb-1 line-clamp-2">{movie.title}</h3>
              <p className="text-xs text-muted-foreground mb-2">{movie.year}</p>
              
              <div className="flex items-center gap-3 text-xs font-medium">
                {movie.rating && (
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    <span>{movie.rating}</span>
                  </div>
                )}
                {movie.runtime > 0 && (
                  <div className="flex items-center text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{movie.runtime}m</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
