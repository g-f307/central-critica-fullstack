import React, { createContext, useState, useEffect, useContext } from 'react';

const GenreContext = createContext();

export const useGenres = () => useContext(GenreContext);

export const GenreProvider = ({ children }) => {
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTvGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllGenres = async () => {
      try {
        // Usaremos rotas do backend para proteger a chave da API
        const movieRes = await fetch('http://localhost:5000/api/genres/movie');
        const tvRes = await fetch('http://localhost:5000/api/genres/tv');

        if (!movieRes.ok || !tvRes.ok) {
          throw new Error('Falha ao buscar listas de gêneros');
        }

        const movieData = await movieRes.json();
        const tvData = await tvRes.json();

        setMovieGenres(movieData.genres || []);
        setTvGenres(tvData.genres || []);
      } catch (error) {
        console.error("Erro ao buscar gêneros:", error);
        // Definir como arrays vazios em caso de erro para evitar quebras
        setMovieGenres([]);
        setTvGenres([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllGenres();
  }, []);

  const getGenreNamesByIds = (ids, type) => {
    if (loading || !ids || ids.length === 0) return [];
    const source = type === 'movie' ? movieGenres : tvGenres;
    if (!source || source.length === 0) return ids.map(id => ({id, name: `Gênero ${id}`})); // Fallback

    return ids.map(id => {
        const genre = source.find(g => g.id === id);
        return genre ? genre.name : `Gênero ${id}`; // Retorna o nome ou um fallback
    }).slice(0, 2); // Pega no máximo 2 nomes de gênero
  };


  return (
    <GenreContext.Provider value={{ movieGenres, tvGenres, loadingGenres: loading, getGenreNamesByIds }}>
      {children}
    </GenreContext.Provider>
  );
};