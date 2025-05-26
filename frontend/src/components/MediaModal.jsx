import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Componente para Estrelas de Avaliação
const StarRatingInput = ({ rating, setRating, disabled = false }) => {
    const [hoverRating, setHoverRating] = useState(0);
    return (
        <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    type="button"
                    key={star}
                    disabled={disabled}
                    className={`text-2xl focus:outline-none transition-colors ${
                        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                    } ${
                        (hoverRating || rating) >= star 
                        ? 'text-yellow-400' 
                        : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                    }`}
                    onClick={() => !disabled && setRating(star)}
                    onMouseEnter={() => !disabled && setHoverRating(star)}
                    onMouseLeave={() => !disabled && setHoverRating(0)}
                    aria-label={`Avaliar ${star} estrelas`}
                >
                    <i className="fas fa-star"></i>
                </button>
            ))}
        </div>
    );
};


const MediaModal = ({ mediaId, mediaType, onClose }) => {
  const { user, token } = useAuth();
  const [details, setDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!mediaId || !mediaType) return;

    const fetchDetailsAndReviews = async () => {
        setLoadingDetails(true);
        setLoadingReviews(true);
        try {
            const detailsRes = await fetch(`http://localhost:5000/api/details/${mediaType}/${mediaId}`);
            if (!detailsRes.ok) throw new Error('Falha ao buscar detalhes da mídia');
            const detailsData = await detailsRes.json();
            setDetails(detailsData);
            setLoadingDetails(false);

            const reviewsRes = await fetch(`http://localhost:5000/api/reviews/${mediaType}/${mediaId}`);
            if (!reviewsRes.ok) throw new Error('Falha ao buscar críticas');
            const reviewsData = await reviewsRes.json();
            setReviews(reviewsData);

        } catch (error) {
            console.error("Erro ao buscar dados do modal:", error);
        } finally {
            setLoadingDetails(false);
            setLoadingReviews(false);
        }
    };

    fetchDetailsAndReviews();
  }, [mediaId, mediaType]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (newReviewRating === 0 || newReviewComment.trim() === '') {
      setReviewError('Por favor, selecione uma avaliação em estrelas e escreva um comentário.');
      return;
    }
    setReviewError('');
    setSubmittingReview(true);

    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          mediaId: parseInt(mediaId, 10),
          mediaType,
          rating: newReviewRating,
          comment: newReviewComment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao enviar crítica.');
      }
      
      setReviews(prevReviews => [data.review, ...prevReviews]);
      setNewReviewComment('');
      setNewReviewRating(0);

    } catch (error) {
      console.error('Erro ao submeter crítica:', error);
      setReviewError(error.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!mediaId) return null;

  const getYear = (dateString) => dateString ? new Date(dateString).getFullYear() : 'N/A';
  const getDirectors = (crew) => crew?.filter(member => member.job === 'Director').map(d => d.name).join(', ');
  const getCreators = (creators) => creators?.map(c => c.name).join(', ');
  const getTrailerKey = (videos) => videos?.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer')?.key;

  const trailerKey = details ? getTrailerKey(details.videos) : null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black bg-opacity-80 flex items-center justify-center p-2 sm:p-4 transition-opacity duration-300">
      <div className="bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text-primary rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto custom-scrollbar transform transition-all duration-300 scale-95 opacity-0 animate-modal-appear">
        {loadingDetails ? (
          <div className="p-8 text-center min-h-[300px] flex items-center justify-center">Carregando detalhes...</div>
        ) : !details ? (
          <div className="p-8 text-center min-h-[300px] flex items-center justify-center">Não foi possível carregar os detalhes. Tente novamente.</div>
        ) : (
          <>
            <div className="relative">
              {details.backdrop_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w1280${details.backdrop_path}`}
                  alt={`Fundo de ${details.title || details.name}`}
                  className="w-full h-48 md:h-72 object-cover rounded-t-lg opacity-60 dark:opacity-40"
                />
              )}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-white bg-black/50 dark:bg-dark-bg-secondary/70 rounded-full p-2 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-dark-cyan z-10"
                aria-label="Fechar modal"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                <div className="flex-shrink-0 w-full md:w-1/3 mx-auto md:mx-0 max-w-[200px] sm:max-w-[250px] md:max-w-xs">
                  <img
                    src={details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                    alt={details.title || details.name}
                    className="rounded-lg shadow-lg w-full"
                  />
                </div>

                <div className="flex-grow">
                  <h2 className="text-2xl md:text-4xl font-bold mb-1 text-gray-900 dark:text-dark-text-primary">{details.title || details.name}</h2>
                  {details.tagline && <p className="text-md text-gray-600 dark:text-dark-text-muted italic mb-3">{details.tagline}</p>}
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-700 dark:text-dark-text-secondary mb-4">
                    <span>{getYear(details.release_date || details.first_air_date)}</span>
                    {mediaType === 'movie' && details.runtime ? <span><i className="far fa-clock mr-1"></i>{`${Math.floor(details.runtime / 60)}h ${details.runtime % 60}min`}</span> : null}
                    {mediaType === 'tv' && details.number_of_seasons ? <span>{`${details.number_of_seasons} temp.`} ({details.number_of_episodes} ep.)</span> : null}
                    <div className="flex items-center">
                      <i className="fas fa-star text-yellow-400 mr-1"></i>
                      <span>{details.vote_average?.toFixed(1)} ({details.vote_count?.toLocaleString()} votos)</span>
                    </div>
                  </div>

                  {details.genres && details.genres.length > 0 && (
                    <div className="mb-4">
                        <h4 className="font-semibold mb-1 text-gray-800 dark:text-dark-text-secondary">Gêneros:</h4>
                        <div className="flex flex-wrap gap-2">
                        {details.genres.map(genre => (
                            <span key={genre.id} className="text-xs bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-dark-text-secondary px-3 py-1 rounded-full">
                            {genre.name}
                            </span>
                        ))}
                        </div>
                    </div>
                  )}

                  {mediaType === 'movie' && getDirectors(details.credits?.crew) && (
                    <p className="text-sm text-gray-700 dark:text-dark-text-secondary mb-1"><strong>Direção:</strong> {getDirectors(details.credits.crew)}</p>
                  )}
                  {mediaType === 'tv' && getCreators(details.created_by) && details.created_by.length > 0 && (
                    <p className="text-sm text-gray-700 dark:text-dark-text-secondary mb-1"><strong>Criação:</strong> {getCreators(details.created_by)}</p>
                  )}
                  
                  {details.overview && (
                    <>
                        <h4 className="font-semibold mb-1 mt-3 text-gray-800 dark:text-dark-text-secondary">Sinopse:</h4>
                        <p className="text-sm text-gray-700 dark:text-dark-text-secondary mb-4 leading-relaxed max-h-40 overflow-y-auto custom-scrollbar pr-2">
                            {details.overview}
                        </p>
                    </>
                  )}
                </div>
              </div>
              
              {details.credits?.cast && details.credits.cast.length > 0 && (
                <div className="mt-6 border-t border-gray-300 dark:border-dark-border pt-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-dark-text-primary">Elenco Principal</h3>
                  <div className="flex overflow-x-auto pb-4 space-x-4 custom-scrollbar">
                    {details.credits.cast.slice(0, 10).map(person => (
                      <div key={person.cast_id || person.id} className="flex-shrink-0 w-28 text-center">
                        <img 
                          src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random&color=fff&font-size=0.3&size=185`}
                          alt={person.name}
                          className="w-24 h-24 object-cover rounded-full mb-2 mx-auto shadow-sm bg-gray-300 dark:bg-slate-700"
                        />
                        <p className="font-semibold text-xs text-gray-800 dark:text-dark-text-secondary">{person.name}</p>
                        <p className="text-xs text-gray-600 dark:text-dark-text-muted truncate" title={person.character}>{person.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {trailerKey && (
                <div className="mt-6 border-t border-gray-300 dark:border-dark-border pt-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-dark-text-primary">Trailer</h3>
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
                    <iframe 
                      src={`https://www.youtube.com/embed/${trailerKey}`}
                      title="Trailer" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </div>
              )}

              {details.production_companies && details.production_companies.length > 0 && (
                <div className="mt-6 border-t border-gray-300 dark:border-dark-border pt-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-dark-text-primary">Produção</h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-4 items-center">
                    {details.production_companies.map(company => (
                      company.logo_path ? (
                        <img 
                          key={company.id} 
                          src={`https://image.tmdb.org/t/p/w200${company.logo_path}`} 
                          alt={company.name}
                          title={company.name}
                          className="h-8 md:h-10 object-contain dark:bg-white dark:p-1 dark:rounded" // Adiciona fundo branco para logos no modo escuro
                        />
                      ) : (
                        <span key={company.id} className="text-sm text-gray-600 dark:text-dark-text-muted bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">
                          {company.name}
                        </span>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Seção de Críticas */}
              <div className="mt-8 border-t border-gray-300 dark:border-dark-border pt-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-dark-text-primary">Críticas de Usuários</h3>
                
                {user ? (
                  <form onSubmit={handleReviewSubmit} className="mb-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg shadow">
                    <h4 className="text-md font-semibold mb-3 text-gray-700 dark:text-dark-text-secondary">Deixe sua crítica:</h4>
                    <div className="mb-3">
                        <StarRatingInput rating={newReviewRating} setRating={setNewReviewRating} />
                    </div>
                    <textarea
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      rows="3"
                      placeholder="Escreva seu comentário..."
                      className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 dark:focus:ring-dark-cyan bg-white dark:bg-slate-700 text-gray-900 dark:text-dark-text-primary placeholder-gray-500 dark:placeholder-dark-text-muted"
                      required
                    ></textarea>
                    {reviewError && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{reviewError}</p>}
                    <button 
                      type="submit" 
                      disabled={submittingReview}
                      className="mt-3 px-4 py-2 bg-purple-600 dark:bg-dark-cyan text-white font-semibold rounded-md hover:bg-purple-700 dark:hover:bg-cyan-700 transition disabled:opacity-50"
                    >
                      {submittingReview ? 'Enviando...' : 'Enviar Crítica'}
                    </button>
                  </form>
                ) : (
                  <div className="mb-6 p-4 bg-gray-100 dark:bg-slate-800 rounded-lg text-center shadow">
                    <p className="text-gray-700 dark:text-dark-text-secondary">
                      <Link to="/auth" onClick={onClose} className="text-link font-semibold">Faça login ou cadastre-se</Link> para deixar uma crítica.
                    </p>
                  </div>
                )}

                {loadingReviews ? (
                    <p className="text-sm text-gray-600 dark:text-dark-text-muted">Carregando críticas...</p>
                ) : reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <div key={review.id} className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 shadow">
                        <div className="flex items-center mb-2">
                          <img 
                            src={review.user?.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.firstName || 'U')}+${encodeURIComponent(review.user?.lastName || 'N')}&background=random&color=fff&font-size=0.5`}
                            alt={review.user?.firstName || 'Usuário'}
                            className="w-10 h-10 rounded-full mr-3 object-cover bg-gray-300"
                          />
                          <div>
                            <p className="font-semibold text-sm text-gray-900 dark:text-dark-text-primary">
                                {review.user?.firstName || 'Usuário'} {review.user?.lastName || ''}
                            </p>
                            <div className="flex items-center text-xs text-gray-500 dark:text-dark-text-muted">
                                <StarRatingInput rating={review.rating} setRating={() => {}} disabled={true} />
                                <span className="ml-2 text-gray-400 dark:text-slate-500">•</span>
                                <span className="ml-2">{new Date(review.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-dark-text-secondary leading-relaxed whitespace-pre-wrap">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-dark-text-muted">Nenhuma crítica ainda. Seja o primeiro!</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MediaModal;