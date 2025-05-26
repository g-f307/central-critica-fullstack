import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import MediaCard from '../components/MediaCard';
import Pagination from '../components/Pagination';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResultsPage = ({ onOpenModal }) => {
  const queryParams = useQuery();
  const searchQuery = queryParams.get('query');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!searchQuery) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/search?query=${encodeURIComponent(searchQuery)}&page=${currentPage}`)
      .then(res => res.json())
      .then(data => {
        setResults(data.results);
        setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
        setLoading(false);
        window.scrollTo(0, 0);
      })
      .catch(err => {
        console.error("Erro na busca:", err);
        setLoading(false);
      });
  }, [searchQuery, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <section className="py-12 bg-gray-100 dark:bg-dark-bg-primary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text-primary mb-2">
          Resultados da Busca por: <span className="text-purple-600 dark:text-dark-cyan">{searchQuery}</span>
        </h2>
        <p className="text-gray-600 dark:text-dark-text-muted mb-8">
          Página {currentPage} de {totalPages}
        </p>

        {loading ? (
          <p className="text-center text-lg dark:text-white">Buscando...</p>
        ) : results.length === 0 ? (
          <p className="text-center text-lg dark:text-white">Nenhum resultado encontrado para "{searchQuery}".</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {results.map(item => (
              <MediaCard key={item.id} media={item} type={item.media_type} onOpenModal={onOpenModal} />
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

export default SearchResultsPage;