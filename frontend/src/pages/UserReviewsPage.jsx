import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Um pequeno componente para o card de cada crítica do usuário
const UserReviewCard = ({ review, onOpenModal }) => {
  const [mediaDetails, setMediaDetails] = useState(null);
  const [loadingMedia, setLoadingMedia] = useState(true);

  useEffect(() => {
    const fetchMediaDetails = async () => {
      setLoadingMedia(true);
      try {
        // Busca os detalhes da mídia (nome, poster) usando a rota que já temos
        const response = await fetch(`http://localhost:5000/api/details/${review.mediaType}/${review.mediaId}`);
        if (!response.ok) {
          throw new Error('Falha ao buscar detalhes da mídia para a crítica.');
        }
        const data = await response.json();
        setMediaDetails(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes da mídia para card de crítica:", error);
        setMediaDetails(null); // Define como nulo para tratar o erro na renderização
      } finally {
        setLoadingMedia(false);
      }
    };

    if (review.mediaId && review.mediaType) {
      fetchMediaDetails();
    }
  }, [review.mediaId, review.mediaType]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i key={i} className={`fas fa-star ${i <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}></i>
      );
    }
    return stars;
  };

  const handleCardClick = () => {
    if (onOpenModal && mediaDetails) {
        onOpenModal(review.mediaId, review.mediaType);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg overflow-hidden card-hover dark:shadow-[0_10px_25px_rgba(0,0,0,0.2)]">
      {loadingMedia ? (
        <div className="p-6 text-center text-sm text-gray-500 dark:text-dark-text-muted">Carregando detalhes da mídia...</div>
      ) : mediaDetails ? (
        <>
          <div className="flex items-start p-4 sm:p-6 space-x-4">
            <img
              src={mediaDetails.poster_path ? `https://image.tmdb.org/t/p/w185${mediaDetails.poster_path}` : `https://via.placeholder.com/185x278.png/E2E8F0/4A5568?text=${encodeURIComponent(mediaDetails.title || mediaDetails.name || 'Mídia')}`}
              alt={mediaDetails.title || mediaDetails.name}
              className="w-20 h-auto sm:w-24 rounded-md object-cover flex-shrink-0 bg-gray-200 dark:bg-slate-700"
            />
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary mb-1">
                {/* Opcional: Fazer o título da mídia um link para o modal também */}
                <button onClick={handleCardClick} className="hover:underline text-left">
                    {mediaDetails.title || mediaDetails.name || 'Mídia Desconhecida'}
                </button>
              </h3>
              <div className="flex items-center mb-2">
                {renderStars(review.rating)}
                <span className="ml-2 text-xs text-gray-500 dark:text-dark-text-muted">({review.rating.toFixed(1)})</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-dark-text-secondary leading-relaxed line-clamp-3 sm:line-clamp-4">
                {review.comment}
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">
                Em: {new Date(review.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 mt-auto text-right">
            <button 
                onClick={handleCardClick}
                className="text-sm font-medium text-purple-600 dark:text-dark-cyan hover:text-purple-800 dark:hover:text-cyan-300 transition"
            >
                Ver Detalhes da Mídia
            </button>
            {/* Futuramente: Botões de Editar/Excluir Crítica */}
          </div>
        </>
      ) : (
        <div className="p-6 text-center text-sm text-red-500 dark:text-red-400">
            Não foi possível carregar os detalhes desta mídia.
        </div>
      )}
    </div>
  );
};


const UserReviewsPage = ({ onOpenModal }) => { // Adicione onOpenModal se não estiver lá
  const { user, token, loadingAuth } = useAuth();
  const navigate = useNavigate();
  const [myReviews, setMyReviews] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (loadingAuth) return; // Espera a autenticação carregar

    if (!user) {
      navigate('/auth', { state: { message: 'Você precisa estar logado para ver suas críticas.' } });
      return;
    }

    const fetchMyReviews = async () => {
      setLoadingPage(true);
      setError('');
      try {
        const response = await fetch('http://localhost:5000/api/reviews/my-reviews/all', {
          headers: {
            'Authorization': `Bearer ${token}`, // Envia o token para a rota protegida
          },
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Falha ao buscar suas críticas.');
        }
        const data = await response.json();
        setMyReviews(data);
      } catch (err) {
        console.error("Erro ao buscar minhas críticas:", err);
        setError(err.message || 'Não foi possível carregar suas críticas.');
      } finally {
        setLoadingPage(false);
      }
    };

    if (token) { // Só busca se houver um token (e, por implicação, um usuário)
      fetchMyReviews();
    }
  }, [user, token, loadingAuth, navigate]);

  if (loadingAuth || loadingPage) {
    return <div className="container mx-auto px-4 py-8 text-center dark:text-white">Carregando suas críticas...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 dark:text-red-400 text-xl">{error}</p>
        <Link to="/" className="mt-4 inline-block text-link">Voltar para a Home</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 border-b border-gray-300 dark:border-slate-700 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-dark-text-primary">Minhas Críticas</h1>
        {user && (
             <div className="flex items-center mt-4 sm:mt-0">
                <img src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName)}+${encodeURIComponent(user.lastName || '')}&background=random&color=fff&font-size=0.5`} alt="Perfil" className="w-10 h-10 rounded-full object-cover mr-3"/>
                <span className="text-lg font-medium text-gray-700 dark:text-dark-text-secondary">{user.firstName} {user.lastName}</span>
             </div>
        )}
      </div>

      {myReviews.length === 0 ? (
        <div className="text-center py-10 px-6 bg-white dark:bg-dark-card rounded-lg shadow-md">
          <i className="fas fa-comments text-5xl text-gray-400 dark:text-slate-500 mb-4"></i>
          <p className="text-xl text-gray-700 dark:text-dark-text-secondary">Você ainda não fez nenhuma crítica.</p>
          <p className="text-gray-600 dark:text-dark-text-muted mt-2">
            Explore <Link to="/filmes" className="text-link">filmes</Link> ou <Link to="/series" className="text-link">séries</Link> e compartilhe sua opinião!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {myReviews.map(review => (
            <UserReviewCard key={review.id} review={review} onOpenModal={onOpenModal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReviewsPage;