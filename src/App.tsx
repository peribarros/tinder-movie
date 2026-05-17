import { useEffect } from 'react';
import { SwipeDeck } from './components/SwipeDeck';
import { SavedMoviesList } from './components/SavedMoviesList';
import { MovieDetailPage } from './components/MovieDetailPage';
import { GenreFilter } from './components/GenreFilter';
import { AuthPage } from './components/AuthPage';
import { UpdatePasswordPage } from './components/UpdatePasswordPage';
import { Logo } from './components/Logo';
import { Film, Home } from 'lucide-react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { useMovieStore } from './store/movieStore';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const isDetail = location.pathname.startsWith('/movie/');
  const isAuth = location.pathname === '/login' || location.pathname === '/update-password';
  const { user, setUser } = useMovieStore();

  // Não renderiza a navbar nas páginas de detalhe e autenticação
  if (isDetail || isAuth) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="p-4 md:p-6 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <Link to="/" className="group">
        <Logo className="transform transition-transform group-hover:scale-105" />
      </Link>
      <nav className="flex items-center space-x-4">
        {isHome ? (
          <Link to="/saved" className="flex items-center space-x-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-full font-medium transition-colors text-sm md:text-base">
            <Film className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Meus Filmes</span>
          </Link>
        ) : (
          <Link to="/" className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-full font-medium transition-colors text-sm md:text-base">
            <Home className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Descobrir</span>
          </Link>
        )}
        
        {user ? (
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-muted-foreground hover:text-destructive transition-colors p-2"
            title="Sair da conta"
          >
            <span className="font-medium text-sm">Sair</span>
          </button>
        ) : (
          <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useMovieStore();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const { setUser } = useMovieStore();

  useEffect(() => {
    // Verifica sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Escuta mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-x-hidden">
        <Navigation />
        
        <main className="flex-1 flex flex-col w-full">
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/update-password" element={<UpdatePasswordPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <div className="flex-1 flex flex-col items-center p-4 max-w-4xl mx-auto w-full">
                  <GenreFilter />
                  <div className="flex-1 flex flex-col items-center justify-center w-full">
                    <SwipeDeck />
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/saved" element={
              <ProtectedRoute>
                <SavedMoviesList />
              </ProtectedRoute>
            } />
            <Route path="/movie/:id" element={
              <ProtectedRoute>
                <MovieDetailPage />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

