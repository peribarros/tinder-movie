import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { discoverMovies } from '../features/movies/tmdb';
import type { MovieCardData } from '../features/movies/tmdb';
import { supabase } from '../lib/supabase';

interface MovieState {
  user: any | null;
  queue: MovieCardData[];
  liked: number[];
  discarded: number[];
  watchlist: number[];
  page: number;
  loading: boolean;
  selectedGenre: number | null;
  setUser: (user: any | null) => void;
  syncPreferences: () => Promise<void>;
  loadMoreMovies: () => Promise<void>;
  likeMovie: (movie: MovieCardData) => void;
  likeMovieById: (id: number) => void;
  discardMovie: (movieId: number) => void;
  addToWatchlist: (movieId: number) => void;
  removeFromWatchlist: (movieId: number) => void;
  setGenre: (genreId: number | null) => void;
  resetSession: () => void;
}

export const useMovieStore = create<MovieState>()(
  persist(
    (set, get) => ({
      user: null,
      queue: [],
      liked: [],
      discarded: [],
      watchlist: [],
      page: 1,
      loading: false,
      selectedGenre: null,

      setUser: (user) => {
        set({ user });
        if (user) {
          get().syncPreferences();
        } else {
          // Quando deslogar, reseta as preferências locais
          set({ liked: [], discarded: [], watchlist: [], queue: [], page: 1 });
        }
      },

      syncPreferences: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const { data, error } = await supabase
            .from('user_preferences')
            .select('movie_id, status')
            .eq('user_id', user.id);

          if (error) throw error;

          if (data) {
            const liked = data.filter(p => p.status === 'liked').map(p => p.movie_id);
            const discarded = data.filter(p => p.status === 'discarded').map(p => p.movie_id);
            set({ liked, discarded });
          }
        } catch (error) {
          console.error('Erro ao sincronizar preferências:', error);
        }
      },

      loadMoreMovies: async () => {
        if (get().loading) return;
        set({ loading: true });
        
        try {
          const currentPage = get().page;
          const currentGenre = get().selectedGenre;
          const newMovies = await discoverMovies(currentPage, currentGenre);
          
          const { liked, discarded, queue } = get();
          const seenIds = new Set([...liked, ...discarded, ...queue.map(m => m.id)]);
          
          const filteredMovies = newMovies.filter(m => !seenIds.has(m.id));
          
          set({ 
            queue: [...get().queue, ...filteredMovies],
            page: currentPage + 1,
            loading: false 
          });
        } catch (error) {
          console.error(error);
          set({ loading: false });
        }
      },

      likeMovie: (movie) => {
        const { user, liked } = get();
        if (!liked.includes(movie.id)) {
          set((state) => ({
            liked: [...state.liked, movie.id],
            queue: state.queue.filter(m => m.id !== movie.id)
          }));

          if (user) {
            supabase.from('user_preferences').upsert({
              user_id: user.id,
              movie_id: movie.id,
              status: 'liked'
            }, { onConflict: 'user_id,movie_id' }).then(({error}) => { 
              if (error) console.error('Error saving like:', error) 
            });
          }
        }
      },

      likeMovieById: (id) => {
        const { user, liked } = get();
        if (!liked.includes(id)) {
          set((state) => ({
            liked: [...state.liked, id],
            discarded: state.discarded.filter(d => d !== id),
          }));

          if (user) {
            supabase.from('user_preferences').upsert({
              user_id: user.id,
              movie_id: id,
              status: 'liked'
            }, { onConflict: 'user_id,movie_id' }).then(({error}) => { 
              if (error) console.error('Error saving like:', error) 
            });
          }
        }
      },

      discardMovie: (movieId) => {
        const { user, discarded } = get();
        if (!discarded.includes(movieId)) {
          set((state) => ({
            discarded: [...state.discarded, movieId],
            liked: state.liked.filter(l => l !== movieId),
            queue: state.queue.filter(m => m.id !== movieId)
          }));

          if (user) {
            supabase.from('user_preferences').upsert({
              user_id: user.id,
              movie_id: movieId,
              status: 'discarded'
            }, { onConflict: 'user_id,movie_id' }).then(({error}) => { 
              if (error) console.error('Error saving discard:', error) 
            });
          }
        }
      },

      addToWatchlist: (movieId) => {
        set((state) => ({
          watchlist: state.watchlist.includes(movieId) ? state.watchlist : [...state.watchlist, movieId]
        }));
      },

      removeFromWatchlist: (movieId) => {
        set((state) => ({
          watchlist: state.watchlist.filter(id => id !== movieId)
        }));
      },

      setGenre: (genreId) => {
        set({
          selectedGenre: genreId,
          queue: [],
          page: 1,
        });
        get().loadMoreMovies();
      },

      resetSession: () => {
        set({
          queue: [],
          liked: [],
          discarded: [],
          page: 1,
        });
        get().loadMoreMovies();
      }
    }),
    {
      name: 'tinder-movie-storage',
      partialize: (state) => ({ 
        liked: state.liked, 
        discarded: state.discarded,
        watchlist: state.watchlist,
        user: state.user // Persiste o usuário
      }),
    }
  )
);
