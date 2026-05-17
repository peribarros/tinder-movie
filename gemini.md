# Project Constitution (gemini.md)

## Data Schemas
### 1. Filme bruto (TMDB)
```json
{
  "id": "number",
  "title": "string",
  "poster_path": "string|null",
  "release_date": "string|null",
  "vote_average": "number|null",
  "genre_ids": ["number"],
  "adult": "boolean",
  "original_language": "string",
  "overview": "string|null"
}
```

### 2. Filme transformado para card
```json
{
  "id": "number",
  "title": "string",
  "posterUrl": "string|null",
  "year": "string|null",
  "rating": "number|null",
  "genres": ["string"],
  "runtime": "number|null"
}
```

### 3. Filme salvo
```json
{
  "movieId": "number",
  "savedAt": "ISODate"
}
```

### 4. Filme descartado
```json
{
  "movieId": "number",
  "discardedAt": "ISODate"
}
```

### 5. Filtros ativos
```json
{
  "genres": ["number"],
  "language": "string|null",
  "region": "string|null",
  "year": "number|null",
  "minRating": "number|null"
}
```

### 6. Estado da sessão
```json
{
  "queue": ["movieId"],
  "liked": ["movieId"],
  "discarded": ["movieId"],
  "filters": {},
  "currentMovie": "number|null"
}
```

## Architectural Invariants
- **Stack**: React + Vite + TypeScript. Sem backend (Serverless/Client-only).
- **Persistência**: localStorage apenas.
- **UI**: TailwindCSS + shadcn/ui.
- **Animações**: framer-motion (SwipeDeck).

## Estrutura de Diretórios Proposta
```text
src/
 ├── app/
 │   ├── App.tsx
 │   └── routes.tsx
 ├── components/
 │   ├── MovieCard.tsx
 │   ├── SwipeDeck.tsx
 │   ├── FilterDrawer.tsx
 │   └── SavedMoviesList.tsx
 ├── features/movies/
 │   ├── tmdb.ts
 │   ├── movieMapper.ts
 │   └── useMovies.ts
 ├── store/
 │   └── movieStore.ts
 ├── lib/
 │   ├── storage.ts
 │   └── env.ts
 └── styles/
```

## Behavioral Rules
- **Regra de Exibição**: Nunca repetir curtidos/descartados na sessão.
- **Filtros Iniciais**: `adult=false`, idioma `pt-BR`, região `BR`.
- **Tema**: Modo escuro como padrão (estética premium/cinematográfica).
- **Fluxo**: buscar lote TMDB -> filtrar adult=false -> remover ids vistos -> renderizar topo -> swipe (persistir em localstorage) -> puxar próximo.

## Maintenance Log
- Blueprint inicializado com sucesso.
