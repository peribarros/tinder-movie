import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Star, Clock, Calendar, Globe,
  Heart, Bookmark, BookmarkCheck, HeartOff, Play
} from 'lucide-react';
import { useMovieStore } from '../store/movieStore';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMG_BASE = 'https://image.tmdb.org/t/p/';

interface MovieDetail {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  genres: { id: number; name: string }[];
  original_language: string;
  spoken_languages: { name: string }[];
  budget: number;
  revenue: number;
  status: string;
  production_companies: { name: string; logo_path: string | null }[];
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Video {
  key: string;
  type: string;
  site: string;
}

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  const { liked, watchlist, likeMovieById, discardMovie, addToWatchlist, removeFromWatchlist } = useMovieStore();

  const isLiked = liked.includes(Number(id));
  const isInWatchlist = watchlist.includes(Number(id));

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    window.scrollTo(0, 0);

    async function fetchAll() {
      const [movieRes, creditsRes, videosRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=pt-BR`),
        fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}&language=pt-BR`),
        fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=pt-BR`),
      ]);

      const movieData = await movieRes.json();
      const creditsData = await creditsRes.json();
      const videosData = await videosRes.json();

      setMovie(movieData);
      setCast(creditsData.cast?.slice(0, 10) || []);

      // Tenta trailer em pt-BR primeiro, depois em inglês
      const ptTrailer = videosData.results?.find((v: Video) => v.type === 'Trailer' && v.site === 'YouTube');
      if (!ptTrailer) {
        const enRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=en-US`);
        const enData = await enRes.json();
        const enTrailer = enData.results?.find((v: Video) => v.type === 'Trailer' && v.site === 'YouTube');
        setTrailer(enTrailer || null);
      } else {
        setTrailer(ptTrailer);
      }

      setLoading(false);
    }

    fetchAll().catch(console.error);
  }, [id]);

  const handleLike = () => {
    if (isLiked) {
      discardMovie(Number(id));
    } else {
      likeMovieById(Number(id));
    }
  };

  const handleWatchlist = () => {
    if (isInWatchlist) {
      removeFromWatchlist(Number(id));
    } else {
      addToWatchlist(Number(id));
    }
  };

  const formatCurrency = (n: number) =>
    n > 0 ? `$${(n / 1_000_000).toFixed(1)}M` : 'N/D';

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-muted-foreground">
        <p className="text-lg">Filme não encontrado.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary underline">Voltar</button>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path ? `${IMG_BASE}w1280${movie.backdrop_path}` : null;
  const posterUrl = movie.poster_path ? `${IMG_BASE}w500${movie.poster_path}` : null;
  const ratingPercent = Math.round((movie.vote_average / 10) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background text-foreground"
    >
      {/* Backdrop */}
      <div className="relative w-full h-[45vh] md:h-[55vh] overflow-hidden">
        {backdropUrl ? (
          <img src={backdropUrl} alt="" className="w-full h-full object-cover object-top" />
        ) : (
          <div className="w-full h-full bg-secondary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-background" />

        {/* Botão Voltar */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-32 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Poster */}
          <div className="flex-shrink-0 w-48 md:w-64 mx-auto md:mx-0">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full rounded-2xl shadow-2xl ring-1 ring-white/10"
              />
            ) : (
              <div className="w-full aspect-[2/3] rounded-2xl bg-card flex items-center justify-center text-muted-foreground">
                Sem poster
              </div>
            )}
          </div>

          {/* Informações */}
          <div className="flex-1 mt-0 md:mt-32">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-muted-foreground italic mb-4">"{movie.tagline}"</p>
            )}

            {/* Metadados rápidos */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              {movie.release_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {movie.release_date.substring(0, 4)}
                </span>
              )}
              {movie.runtime > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {movie.runtime} min
                </span>
              )}
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {movie.original_language.toUpperCase()}
              </span>
              <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                <Star className="w-4 h-4 fill-current" />
                {movie.vote_average.toFixed(1)}
                <span className="text-muted-foreground font-normal">({movie.vote_count.toLocaleString()} votos)</span>
              </span>
            </div>

            {/* Gêneros */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map(g => (
                <span key={g.id} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-semibold">
                  {g.name}
                </span>
              ))}
            </div>

            {/* BOTÕES DE AÇÃO */}
            <div className="flex flex-wrap gap-3 mb-8">
              {/* Match / Like */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all active:scale-95 ${
                  isLiked
                    ? 'bg-green-500 text-white hover:bg-green-400'
                    : 'bg-card border border-green-500/40 text-green-500 hover:bg-green-500/10'
                }`}
              >
                {isLiked ? (
                  <><HeartOff className="w-5 h-5" /> Remover Match</>
                ) : (
                  <><Heart className="w-5 h-5" /> Dar Match</>
                )}
              </button>

              {/* Watchlist */}
              <button
                onClick={handleWatchlist}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all active:scale-95 ${
                  isInWatchlist
                    ? 'bg-blue-500 text-white hover:bg-blue-400'
                    : 'bg-card border border-blue-500/40 text-blue-400 hover:bg-blue-500/10'
                }`}
              >
                {isInWatchlist ? (
                  <><BookmarkCheck className="w-5 h-5" /> Na Minha Lista</>
                ) : (
                  <><Bookmark className="w-5 h-5" /> Adicionar à Lista</>
                )}
              </button>

              {/* Trailer */}
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-red-600 text-white hover:bg-red-500 transition-all active:scale-95"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Ver Trailer
                </a>
              )}
            </div>

            {/* Sinopse */}
            {movie.overview && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-2">Sinopse</h2>
                <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
              </div>
            )}

            {/* Ficha técnica */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-card rounded-2xl border border-border mb-8">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                <p className="font-semibold text-sm">{movie.status}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Orçamento</p>
                <p className="font-semibold text-sm">{formatCurrency(movie.budget)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Bilheteria</p>
                <p className="font-semibold text-sm">{formatCurrency(movie.revenue)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Aprovação</p>
                <p className="font-semibold text-sm text-yellow-400">{ratingPercent}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Elenco */}
        {cast.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Elenco Principal</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border">
              {cast.map(person => (
                <div key={person.id} className="flex-shrink-0 w-28 text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-secondary mx-auto mb-2 ring-2 ring-border">
                    {person.profile_path ? (
                      <img
                        src={`${IMG_BASE}w185${person.profile_path}`}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                        {person.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold leading-tight">{person.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
