export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  vote_average: number | null;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  overview: string | null;
}

export interface MovieCardData {
  id: number;
  title: string;
  posterUrl: string | null;
  year: string | null;
  rating: number | null;
  genres: string[];
  runtime: number | null;
}

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const genreMap: Record<number, string> = {
  28: "Ação",
  12: "Aventura",
  16: "Animação",
  35: "Comédia",
  80: "Crime",
  99: "Documentário",
  18: "Drama",
  10751: "Família",
  14: "Fantasia",
  36: "História",
  27: "Terror",
  10402: "Música",
  9648: "Mistério",
  10749: "Romance",
  878: "Ficção Científica",
  10770: "Cinema TV",
  53: "Thriller",
  10752: "Guerra",
  37: "Faroeste"
};

export async function discoverMovies(page = 1, genreId: number | null = null): Promise<MovieCardData[]> {
  if (!TMDB_API_KEY) {
    console.error("VITE_TMDB_API_KEY não está definida!");
    return [];
  }

  const url = new URL(`${BASE_URL}/discover/movie`);
  url.searchParams.append('api_key', TMDB_API_KEY);
  url.searchParams.append('language', 'pt-BR');
  url.searchParams.append('region', 'BR');
  url.searchParams.append('sort_by', 'popularity.desc');
  url.searchParams.append('include_adult', 'false');
  url.searchParams.append('include_video', 'false');
  url.searchParams.append('page', page.toString());
  if (genreId !== null) {
    url.searchParams.append('with_genres', genreId.toString());
  }

  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    
    if (!data.results) return [];

    return data.results.map((m: TMDBMovie) => ({
      id: m.id,
      title: m.title,
      posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
      year: m.release_date ? m.release_date.substring(0, 4) : null,
      rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : null,
      genres: m.genre_ids.map(id => genreMap[id]).filter(Boolean),
      runtime: null, // Discover API não traz runtime
    }));
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    return [];
  }
}
