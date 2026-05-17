# 🎬 Tinder Movie
> **Encontre seu filme perfeito.**

O **Tinder Movie** é uma aplicação web moderna de descoberta de filmes que utiliza uma interface no estilo "swipe" (arrastar para os lados) para ajudar usuários a encontrarem e salvarem os filmes que desejam assistir. Chega de passar horas rodando o catálogo das plataformas de streaming sem saber o que escolher!

![Tinder Movie Preview](public/logo.png)

## ✨ Funcionalidades Principais

- **Swipe Interface:** Arraste os cards de filmes para a direita (Gostei) ou para a esquerda (Descartar) utilizando animações fluidas.
- **Integração com TMDB:** Consome dados em tempo real da *The Movie Database (TMDB)* para trazer os lançamentos, clássicos e sinopses detalhadas.
- **Filtros Avançados:** Filtre os filmes por gênero direto na tela principal para descobrir filmes exatamente do seu gosto no momento.
- **Autenticação Segura:** Sistema de Login, Cadastro e Recuperação de Senha utilizando o ecossistema do Supabase.
- **Sincronização na Nuvem:** Suas preferências (filmes curtidos e descartados) são salvas em tempo real no banco de dados, protegidas por regras robustas de segurança (Row Level Security).
- **Dark Mode Premium:** Uma estética imersiva, elegante e veloz construída com Tailwind CSS.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com as melhores práticas de desenvolvimento web moderno:

- **Frontend:**
  - [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/) (Estilização)
  - [Framer Motion](https://www.framer.com/motion/) (Animações de Swipe)
  - [Lucide React](https://lucide.dev/) (Ícones)
  - [Zustand](https://github.com/pmndrs/zustand) (Gerenciamento de Estado)
  - [React Router DOM](https://reactrouter.com/) (Navegação/Rotas Protegidas)

- **Backend / BaaS:**
  - [Supabase](https://supabase.com/) (Autenticação, Banco de Dados PostgreSQL)
  - [TMDB API](https://developer.themoviedb.org/docs) (Provedor de dados dos filmes)

## 🛠️ Como rodar o projeto localmente

Siga os passos abaixo para testar o projeto em sua própria máquina.

### Pré-requisitos
- [Node.js](https://nodejs.org/en/) (Versão 18+)
- [Git](https://git-scm.com/)
- Conta no [Supabase](https://supabase.com) e no [TMDB](https://www.themoviedb.org/) para obter as chaves de API.

### Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/tinder-movie.git
cd tinder-movie
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
Crie um arquivo `.env` na raiz do projeto e preencha com as suas chaves:
```env
VITE_TMDB_API_KEY=sua_chave_do_tmdb_aqui
VITE_SUPABASE_URL=sua_url_do_supabase_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase_aqui
```

4. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

Acesse `http://localhost:5173` no seu navegador! 🎉

## 🔒 Configuração do Banco de Dados (Supabase)

Caso você esteja configurando seu próprio backend, rode o script SQL abaixo no **SQL Editor** do seu projeto no Supabase para preparar as tabelas e políticas de segurança:

```sql
-- Cria a tabela de preferências do usuário
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  movie_id int NOT NULL,
  status text CHECK (status IN ('liked', 'discarded')) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, movie_id)
);

-- Habilita Row Level Security (RLS)
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view their own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own preferences" ON public.user_preferences FOR DELETE USING (auth.uid() = user_id);
```

---
Feito com 🎬 e 🍿 por Peri Barros.
