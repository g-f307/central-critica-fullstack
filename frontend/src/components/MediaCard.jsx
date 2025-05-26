import React, { useState, useEffect } from 'react';
import { useGenres } from '../contexts/GenreContext'; // Importe o hook

const MediaCard = ({ media, type, onOpenModal }) => {
  const { getGenreNamesByIds, loadingGenres } = useGenres(); // Use o contexto
  const [displayGenres, setDisplayGenres] = useState([]);

  const imageUrl = media.poster_path
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';
  const title = type === 'movie' ? media.title : media.name;
  const releaseDate = type === 'movie' ? media.release_date : media.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const voteAverage = media.vote_average ? media.vote_average.toFixed(1) : 'N/A';

  let ratingCircleClass = 'average';
  if (media.vote_average >= 8) ratingCircleClass = 'excellent';
  else if (media.vote_average >= 6.5) ratingCircleClass = 'good';
  else if (media.vote_average < 5) ratingCircleClass = 'bad';

  useEffect(() => {
    if (!loadingGenres && media.genre_ids) {
      const names = getGenreNamesByIds(media.genre_ids, type);
      setDisplayGenres(names);
    } else if (media.genres) { // Se os gêneros já vêm com nome (como na página de detalhes)
        setDisplayGenres(media.genres.slice(0, 2).map(g => g.name));
    }
  }, [loadingGenres, media.genre_ids, media.genres, getGenreNamesByIds, type]);


  const handleDetailsClick = () => {
    if (onOpenModal) {
      onOpenModal(media.id, type);
    }
  };

  const getGenreTagClass = (genreName = "") => {
    const normalizedGenre = genreName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''); // Normaliza mais
    switch (normalizedGenre) {
      case 'acao': case 'action': return 'action';
      case 'Aventura': case 'adventure': return 'adventure';
      case 'ficcao-cientifica': case 'science-fiction': return 'scifi';
      case 'drama': return 'drama';
      case 'Crime': return 'crime';
      case 'animacao': case 'animation': return 'animation';
      case 'fantasia': case 'fantasy': return 'fantasy';
      case 'comedia': case 'comedy': return 'comedy';
      case 'Terror': return 'terror'; // Adicionado
      case 'misterio': case 'mystery': return 'misterio'; // Adicionado
      case 'familia': case 'family': return 'familia'; // Adicionado
      default: return 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200'; // Estilo Padrão
    }
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl overflow-hidden card-hover shadow-lg dark:shadow-[0_10px_25px_rgba(0,0,0,0.2)] flex flex-col h-full">
      <div className="relative group">
        <img src={imageUrl} alt={title} className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        <div className={`absolute top-3 right-3 rating-circle ${ratingCircleClass} text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
          {voteAverage}
        </div>
        <div className="absolute bottom-2 left-2 bg-black/60 p-1 rounded text-white text-xs sm:hidden group-hover:opacity-0 transition-opacity duration-300">
             <i className="fas fa-star text-yellow-400 mr-1"></i>
             <span>{voteAverage}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className={`font-bold text-lg mb-1 truncate text-light-text-primary dark:text-dark-text-primary`}>{title}</h3>
        <p className="text-xs text-gray-500 dark:text-dark-text-muted mb-2">{year}</p>

        {displayGenres.length > 0 && (
          <div className="flex flex-wrap mb-3 h-6 overflow-hidden">
            {displayGenres.map((genreName, index) => (
              <span key={index} className={`genre-tag ${getGenreTagClass(genreName)}`}>
                {genreName}
              </span>
            ))}
          </div>
        )}
        
        <p className={`text-sm mb-4 flex-grow h-[60px] overflow-hidden text-light-text-secondary dark:text-dark-text-secondary`}>
            {media.overview ? `${media.overview.substring(0, 80)}...` : 'Sinopse não disponível.'}
        </p>
        
        <button 
          onClick={handleDetailsClick}
          className="w-full mt-auto bg-light-purple-primary dark:bg-dark-cyan hover:bg-purple-700 dark:hover:bg-cyan-700 text-white dark:text-dark-bg-primary font-semibold py-2 rounded-md transition"
        >
          Ver detalhes
        </button>
      </div>
    </div>
  );
};

export default MediaCard;