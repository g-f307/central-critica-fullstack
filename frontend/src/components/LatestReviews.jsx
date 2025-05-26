import React from 'react';
import { Link } from 'react-router-dom'; // Para o link "Ver mais críticas"

// Componente interno para o card de uma crítica individual
const ReviewCard = ({ review }) => {
    const { user, mediaName, rating, comment, date, mediaType, mediaId } = review;

    // Função para renderizar estrelas
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i key={i} className={`fas fa-star ${i <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}></i>
            );
        }
        return stars;
    };

    return (
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 card-hover shadow-lg dark:shadow-[0_10px_25px_rgba(0,0,0,0.25)] flex flex-col"> {/* Sombra e efeito do modoEscuro.html */} {/* */}
            <div className="flex items-start mb-3">
                <img 
                    src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName)}+${encodeURIComponent(user.lastName)}&background=random&color=fff&font-size=0.5`} 
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-10 h-10 rounded-full mr-3 object-cover bg-gray-300 dark:bg-slate-700"
                />
                <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-dark-text-primary">
                        {user.firstName} {user.lastName}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-dark-text-muted">{date}</p>
                </div>
            </div>
            <div className="mb-3">
                <Link 
                    // No futuro, o link pode ir para a página de detalhes da mídia
                    to={mediaId && mediaType ? (mediaType === 'movie' ? `/filmes/${mediaId}` : `/series/${mediaId}`) : '#'} 
                    className="font-bold text-lg text-gray-800 dark:text-dark-text-primary hover:underline"
                >
                    {mediaName}
                </Link>
                <div className="flex items-center mt-1">
                    {renderStars(rating)}
                    <span className="ml-2 text-sm text-gray-600 dark:text-dark-text-secondary">({rating.toFixed(1)})</span>
                </div>
            </div>
            <p className="text-sm text-gray-700 dark:text-dark-text-secondary leading-relaxed flex-grow line-clamp-4">
                {comment}
            </p>
            {/* Você pode adicionar um link "Ler mais" para a crítica completa se o texto for longo */}
            {/* <Link to={`/critica/${review.id}`} className="text-sm text-link mt-3 inline-block">Ler crítica completa</Link> */}
        </div>
    );
};

const LatestReviews = () => {
    // Dados mockados mais detalhados para a seção de Últimas Críticas
    // No futuro, isso virá do seu backend: /api/reviews?latest=true&limit=3 (ou algo similar)
    const mockReviews = [
        { 
            id: 1, 
            user: { 
                firstName: 'João', 
                lastName: 'Pedro', 
                profileImageUrl: 'https://randomuser.me/api/portraits/men/32.jpg' 
            }, 
            mediaName: 'Oppenheimer', 
            mediaId: 872585, // ID do TMDB (exemplo)
            mediaType: 'movie', // 'movie' ou 'tv'
            rating: 5, 
            comment: 'Nolan mais uma vez mostra sua maestria na direção. A performance de Cillian Murphy é simplesmente brilhante. O filme é intenso do começo ao fim, com uma fotografia impecável.', 
            date: '20 de Mai, 2025' 
        },
        { 
            id: 2, 
            user: { 
                firstName: 'Ana', 
                lastName: 'Maria', 
                profileImageUrl: 'https://randomuser.me/api/portraits/women/44.jpg' 
            }, 
            mediaName: 'Barbie', 
            mediaId: 346698,
            mediaType: 'movie',
            rating: 4, 
            comment: 'Que hino de empoderamento! Margot está no auge. A letra é inteligente e a melodia cativante. Visualmente deslumbrante e com uma mensagem poderosa.', 
            date: '18 de Mai, 2025' 
        },
        { 
            id: 3, 
            user: { 
                firstName: 'Carlos', 
                lastName: 'Roberto', 
                profileImageUrl: 'https://randomuser.me/api/portraits/men/75.jpg' 
            }, 
            mediaName: 'The Last of Us', 
            mediaId: 100088,
            mediaType: 'tv',
            rating: 5, 
            comment: 'A adaptação superou minhas expectativas. Pedro Pascal e Bella Ramsey têm uma química incrível. A série consegue capturar a essência do jogo enquanto traz novas camadas narrativas.', 
            date: '15 de Mai, 2025' 
        },
    ];

    return (
        <section className="py-12 bg-white dark:bg-dark-bg-secondary"> {/* Cor de fundo da seção */}
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text-primary">Últimas Críticas</h2>
                    {/* O botão abaixo pode ser um Link para uma página de todas as críticas */}
                    <Link 
                        to="/criticas" // Rota futura para uma página de todas as críticas
                        className="text-sm font-medium text-link"
                    >
                        Ver todas as críticas <i className="fas fa-arrow-right ml-1"></i>
                    </Link>
                </div>
                
                {mockReviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {mockReviews.map(review => <ReviewCard key={review.id} review={review} />)}
                    </div>
                ) : (
                    <div className="text-center py-8 px-6 bg-gray-50 dark:bg-dark-card rounded-lg shadow">
                        <i className="fas fa-comment-slash text-4xl text-gray-400 dark:text-slate-500 mb-4"></i>
                        <p className="text-gray-600 dark:text-dark-text-secondary">Ainda não há críticas por aqui. Que tal ser o primeiro?</p>
                        {/* Futuramente, um link para o usuário escrever uma crítica */}
                    </div>
                )}
            </div>
        </section>
    );
};

export default LatestReviews;