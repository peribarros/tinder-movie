import React from 'react';

export function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative flex items-center justify-center group">
        <svg viewBox="0 0 100 100" className="w-10 h-10 transform transition-transform group-hover:scale-110">
          <defs>
            <linearGradient id="tinderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF416C" />
              <stop offset="100%" stopColor="#FF4B2B" />
            </linearGradient>
            <linearGradient id="filmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#333333" />
              <stop offset="100%" stopColor="#1a1a1a" />
            </linearGradient>
          </defs>
          
          {/* Lado esquerdo do coração (Chama/Fogo em gradiente) */}
          <path 
            d="M50 90 C 20 65, 5 45, 10 25 C 13 10, 30 5, 45 15 C 47 16, 49 18, 50 20 C 50 20, 50 20, 50 20 C 50 20, 50 40, 50 40 Z" 
            fill="url(#tinderGrad)" 
          />
          
          {/* Chama extra */}
          <path 
            d="M25 30 C 25 15, 35 5, 40 0 C 35 15, 45 25, 45 35 Z" 
            fill="url(#tinderGrad)" 
            opacity="0.8"
          />

          {/* Lado direito do coração (Rolo de Filme) */}
          <path 
            d="M50 90 C 80 65, 95 45, 90 25 C 87 10, 70 5, 55 15 C 53 16, 51 18, 50 20 L 50 90 Z" 
            fill="url(#filmGrad)" 
          />
          
          {/* Furos do rolo de filme */}
          <rect x="75" y="25" width="4" height="4" fill="#ffffff" transform="rotate(15 75 25)" />
          <rect x="80" y="35" width="4" height="4" fill="#ffffff" transform="rotate(25 80 35)" />
          <rect x="82" y="45" width="4" height="4" fill="#ffffff" transform="rotate(35 82 45)" />
          <rect x="80" y="55" width="4" height="4" fill="#ffffff" transform="rotate(45 80 55)" />
          <rect x="73" y="65" width="4" height="4" fill="#ffffff" transform="rotate(55 73 65)" />

          {/* Círculo central branco */}
          <circle cx="50" cy="45" r="18" fill="#ffffff" />
          
          {/* Ícone de Play central */}
          <path d="M45 37 L 58 45 L 45 53 Z" fill="url(#tinderGrad)" />
        </svg>
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-center space-x-1 leading-none">
          <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FF416C] to-[#FF4B2B]">
            Tinder
          </span>
          <span className="text-2xl font-black tracking-tight text-foreground">
            MOVIE
          </span>
        </div>
        <span className="text-[0.6rem] font-semibold tracking-widest text-muted-foreground uppercase mt-0.5">
          Encontre seu filme perfeito
        </span>
      </div>
    </div>
  );
}
