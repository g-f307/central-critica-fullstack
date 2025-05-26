import React, { useState, useEffect } from 'react';
import MediaCard from '../components/MediaCard';
import Pagination from '../components/Pagination'; // Importe

const SeriesPage = ({ onOpenModal }) => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/series/popular?page=${currentPage}`)
      .then(res => {
        if (!res.ok) throw new Error('Falha na resposta da rede');
        return res.json();
      })
      .then(data => {
        setSeries(data.results);
        setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
        setLoading(false);
        window.scrollTo(0, 0);
      })
      .catch(err => {
        console.error("Erro ao buscar séries:", err);
        setLoading(false);
      });
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <section className="py-12 bg-gray-100 dark:bg-dark-bg-primary">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text-primary">Séries em Destaque</h2>
        </div>
        {loading ? (
          <p className="text-center text-lg dark:text-white">Carregando séries...</p>
        ) : series.length === 0 ? (
            <p className="text-center text-lg dark:text-white">Nenhuma série encontrada.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {series.map(serie => (
              <MediaCard key={serie.id} media={serie} type="tv" onOpenModal={onOpenModal} />
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

export default SeriesPage;