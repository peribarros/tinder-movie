import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Logo } from './Logo';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/update-password`,
        });
        if (error) throw error;
        setMessage('Check your email for the password reset link.');
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
          },
        });
        if (error) throw error;
        // Se a confirmação de email estiver desligada, já fará login.
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-card rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-border">
        
        {/* Left Side - Image/Branding */}
        <div className="hidden md:flex md:w-1/2 relative bg-secondary flex-col justify-between p-8">
          <div className="absolute inset-0 z-0">
            {/* Imagem de fundo com gradiente escuro */}
            <img 
              src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop" 
              alt="Cinema background" 
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent"></div>
          </div>
          
          <div className="relative z-10 flex items-center justify-between">
            <Logo className="transform scale-90 origin-left" />
            <button 
              onClick={() => navigate('/')}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm"
            >
              Back to website &rarr;
            </button>
          </div>

          <div className="relative z-10 mb-12">
            <h2 className="text-4xl font-semibold text-foreground leading-tight mb-4">
              Encontre o filme<br />perfeito para hoje.
            </h2>
            <div className="flex space-x-2">
              <div className="w-8 h-1 bg-primary rounded-full"></div>
              <div className="w-4 h-1 bg-muted rounded-full"></div>
              <div className="w-4 h-1 bg-muted rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-card">
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {isForgotPassword ? 'Reset password' : isLogin ? 'Log in' : 'Create an account'}
            </h2>
            <p className="text-muted-foreground mb-8 text-sm">
              {isForgotPassword ? "Remember your password? " : isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  if (!isForgotPassword) setIsLogin(!isLogin);
                  else setIsLogin(true);
                }}
                className="text-primary hover:underline font-medium"
              >
                {isForgotPassword ? 'Log in' : isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && !isForgotPassword && (
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <input
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-secondary text-foreground rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground text-sm border border-transparent focus:border-primary/30"
                      required
                    />
                  </div>
                  <div className="w-1/2">
                    <input
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-secondary text-foreground rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground text-sm border border-transparent focus:border-primary/30"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-secondary text-foreground rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground text-sm border border-transparent focus:border-primary/30"
                  required
                />
              </div>

              {!isForgotPassword && (
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-secondary text-foreground rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground text-sm border border-transparent focus:border-primary/30"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              )}

              {isLogin && !isForgotPassword && (
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => setIsForgotPassword(true)}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {!isLogin && !isForgotPassword && (
                <div className="flex items-center space-x-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    className="rounded border-border bg-secondary text-primary focus:ring-primary/50"
                    required
                  />
                  <label htmlFor="terms" className="text-xs text-muted-foreground">
                    I agree to the <a href="#" className="text-primary hover:underline">Terms & Conditions</a>
                  </label>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              {message && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg px-4 py-3 transition-colors mt-2 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  isForgotPassword ? 'Send Reset Link' : isLogin ? 'Log in' : 'Create account'
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
