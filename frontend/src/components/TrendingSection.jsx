import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Importe Link
import MediaCard from './MediaCard';

const TrendingSection = ({ onOpenModal }) => {
    const [activeTab, setActiveTab] = useState('movies');
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        setLoading(true);
        const endpoint = activeTab === 'movies' ? '/api/movies/popular' : '/api/series/popular';
        
        fetch(`http://localhost:5000${endpoint}`)
            .then(res => res.json())
            .then(data => {
                setContent(data.results.slice(0, 10)); // Pega 10 itens
                setLoading(false);
            })
            .catch(err => {
                console.error(`Erro ao buscar ${activeTab}:`, err);
                setLoading(false);
            });
    }, [activeTab]);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8; // Rola 80% da largura visível
            scrollContainerRef.current.scrollBy({ 
                left: direction === 'left' ? -scrollAmount : scrollAmount, 
                behavior: 'smooth' 
            });
        }
    };

    return (
        <section className="py-12 bg-gray-100 dark:bg-dark-bg-primary">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text-primary">Em alta esta semana</h2>
                        <p className="text-gray-500 dark:text-dark-text-muted mt-2">Os conteúdos mais populares do momento</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <button 
                            onClick={() => setActiveTab('movies')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center ${activeTab === 'movies' ? 'bg-purple-600 text-white dark:bg-dark-cyan dark:text-dark-bg-primary' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-dark-text-secondary hover:bg-gray-300 dark:hover:bg-slate-600'}`}
                        >
                            <i className="fas fa-film mr-2"></i> Filmes
                        </button>
                        <button 
                            onClick={() => setActiveTab('series')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center ${activeTab === 'series' ? 'bg-purple-600 text-white dark:bg-dark-cyan dark:text-dark-bg-primary' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-dark-text-secondary hover:bg-gray-300 dark:hover:bg-slate-600'}`}
                        >
                            <i className="fas fa-tv mr-2"></i> Séries
                        </button>
                    </div>
                </div>
                <div className="relative group"> {/* Adicionado group para mostrar botões no hover */}
                    {/* Botão Scroll Esquerda */}
                    <button 
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none -ml-4 md:-ml-6"
                        aria-label="Scroll Esquerda"
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>

                    <div ref={scrollContainerRef} className="flex overflow-x-auto pb-6 space-x-6 scrollbar-hide custom-scrollbar"> {/* Adicionado custom-scrollbar */}
                        {loading ? (
                            <p className="dark:text-white p-4">Carregando...</p>
                        ) : content.length === 0 ? (
                             <p className="dark:text-white p-4">Nenhum item encontrado.</p>
                        ) : (
                            content.map(item => (
                                <div key={item.id} className="flex-shrink-0 w-64 sm:w-72"> {/* Largura dos cards */}
                                    <MediaCard media={item} type={activeTab === 'movies' ? 'movie' : 'tv'} onOpenModal={onOpenModal} />
                                </div>
                            ))
                        )}
                        {/* Card "Ver Todos" */}
                        {!loading && content.length > 0 && (
                             <div className="flex-shrink-0 w-64 sm:w-72 flex items-center justify-center">
                                <Link 
                                    to={activeTab === 'movies' ? '/filmes' : '/series'}
                                    className="flex flex-col items-center justify-center h-full w-full bg-white dark:bg-dark-card rounded-xl card-hover shadow-lg dark:shadow-[0_10px_25px_rgba(0,0,0,0.2)] p-6 text-center text-light-text-primary dark:text-dark-text-primary hover:text-purple-600 dark:hover:text-dark-cyan"
                                >
                                    <i className="fas fa-arrow-right text-4xl mb-4"></i>
                                    <span className="font-semibold text-lg">Ver Todos {activeTab === 'movies' ? 'os Filmes' : 'as Séries'}</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Botão Scroll Direita */}
                     <button 
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none -mr-4 md:-mr-6"
                        aria-label="Scroll Direita"
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TrendingSection;