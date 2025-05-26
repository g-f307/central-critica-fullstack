import React, { useState, useEffect } from 'react';
import MediaCard from '../components/MediaCard';
import Pagination from '../components/Pagination'; // Importe

const MoviesPage = ({ onOpenModal }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setLoading(true);
    // Adiciona o parâmetro page à URL
    fetch(`http://localhost:5000/api/movies/popular?page=${currentPage}`)
      .then(res => {
        if (!res.ok) throw new Error('Falha na resposta da rede');
        return res.json();
      })
      .then(data => {
        setMovies(data.results);
        // O TMDB limita o total_pages em 500
        setTotalPages(data.total_pages > 500 ? 500 : data.total_pages); 
        setLoading(false);
        window.scrollTo(0, 0); // Rola para o topo da página
      })
      .catch(err => {
        console.error("Erro ao buscar filmes:", err);
        setLoading(false);
      });
  }, [currentPage]); // Re-busca quando currentPage muda

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <section className="py-12 bg-gray-100 dark:bg-dark-bg-primary">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text-primary">Filmes em Destaque</h2>
            {/* Pode adicionar um seletor de ordenação ou filtro aqui no futuro */}
        </div>
        
        {loading ? (
          <p className="text-center text-lg dark:text-white">Carregando filmes...</p>
        ) : movies.length === 0 ? (
          <p className="text-center text-lg dark:text-white">Nenhum filme encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {movies.map(movie => (
              <MediaCard key={movie.id} media={movie} type="movie" onOpenModal={onOpenModal} />
            ))}
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default MoviesPage;