import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Para verificar se o usuário está logado
import ArticleCard from '../components/ArticleCard'; 

const JornalPage = () => {
  const { user } = useAuth(); // Pega o estado do usuário
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('http://localhost:5000/api/articles');
        if (!response.ok) {
          throw new Error('Falha ao buscar artigos.');
        }
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        console.error("Erro ao buscar artigos:", err);
        setError(err.message || 'Não foi possível carregar os artigos.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <section className="py-12 bg-gray-100 dark:bg-dark-bg-primary min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-gray-300 dark:border-slate-700 pb-6">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-dark-text-primary mb-4 sm:mb-0">
            Jornal Central Crítica
          </h1>
          {user && ( // Botão "Escrever Artigo" visível apenas se o usuário estiver logado
            <Link
              to="/escrever-artigo"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 dark:bg-dark-cyan dark:hover:bg-cyan-700 text-white font-semibold rounded-md transition duration-150 ease-in-out flex items-center self-center sm:self-auto"
            >
              <i className="fas fa-pen-alt mr-2"></i> Escrever Novo Artigo
            </Link>
          )}
        </div>

        {/* Mensagem para usuários não logados, visível mesmo com artigos na lista */}
        {!user && articles.length > 0 && (
          <div className="mb-8 p-4 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-lg text-center shadow">
            <p className="text-gray-700 dark:text-dark-text-secondary">
              Gostou dos artigos?{' '}
              <Link to="/auth" state={{ showRegister: true }} className="text-link font-semibold">
                Crie sua conta
              </Link>
              {' ou '}
              <Link to="/auth" className="text-link font-semibold">
                faça login
              </Link>
              {' para compartilhar suas próprias ideias e críticas!'}
            </p>
          </div>
        )}

        {loading && <p className="text-center text-lg dark:text-white py-10">Carregando artigos...</p>}
        {error && <p className="text-center text-red-500 dark:text-red-400 py-10">{error}</p>}
        
        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-10 px-6 bg-white dark:bg-dark-card rounded-lg shadow-md mt-8">
            <i className="fas fa-newspaper text-5xl text-gray-400 dark:text-slate-500 mb-4"></i>
            <p className="text-xl text-gray-700 dark:text-dark-text-secondary">
              Ainda não há artigos publicados.
            </p>
            {user ? (
              <p className="text-gray-600 dark:text-dark-text-muted mt-2">
                Seja o primeiro a compartilhar suas ideias! Clique em "Escrever Novo Artigo" acima.
              </p>
            ) : (
              <p className="text-gray-600 dark:text-dark-text-muted mt-2">
                <Link to="/auth" className="text-link font-semibold">Faça login ou cadastre-se</Link> para escrever o primeiro artigo.
              </p>
            )}
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
        {/* Paginação pode ser adicionada aqui no futuro */}
      </div>
    </section>
  );
};

export default JornalPage;