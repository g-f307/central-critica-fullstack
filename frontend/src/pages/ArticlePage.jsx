import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext'; // Opcional, se quiser mostrar algo específico para o autor

const ArticlePage = () => {
  const { slug } = useParams();
  // const { user } = useAuth(); 
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`http://localhost:5000/api/articles/${slug}`);
        if (!response.ok) {
          if (response.status === 404) throw new Error('Artigo não encontrado.');
          throw new Error('Falha ao buscar o artigo.');
        }
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        console.error(`Erro ao buscar artigo ${slug}:`, err);
        setError(err.message || 'Não foi possível carregar o artigo.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center dark:text-white">Carregando artigo...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 dark:text-red-400 text-xl">{error}</p>
        <Link to="/jornal" className="mt-4 inline-block text-link">Voltar ao Jornal</Link>
      </div>
    );
  }

  if (!article) {
    return <div className="container mx-auto px-4 py-8 text-center dark:text-white">Artigo não encontrado.</div>;
  }

  const publicationDate = new Date(article.createdAt).toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="bg-white dark:bg-dark-card py-8 md:py-12"> {/* Fundo da página do artigo */}
      <div className="container mx-auto px-4 max-w-3xl">
        <article>
          <header className="mb-8 text-center border-b border-gray-200 dark:border-slate-700 pb-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-dark-text-primary mb-3 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center justify-center text-sm text-gray-500 dark:text-dark-text-muted">
              <img 
                src={article.author?.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author?.firstName || 'A')}+${encodeURIComponent(article.author?.lastName || 'N')}&background=random&color=fff&font-size=0.5`} 
                alt={article.author?.firstName} 
                className="w-8 h-8 rounded-full mr-3 object-cover"
              />
              <span>Por {article.author?.firstName} {article.author?.lastName || 'Autor Desconhecido'}</span>
              <span className="mx-2">•</span>
              <span>Publicado em {publicationDate}</span>
            </div>
          </header>

          <div 
            className="prose prose-lg lg:prose-xl dark:prose-invert max-w-none 
                       prose-headings:text-gray-800 dark:prose-headings:text-dark-text-primary
                       prose-p:text-gray-700 dark:prose-p:text-dark-text-secondary
                       prose-strong:text-gray-900 dark:prose-strong:text-dark-text-primary
                       prose-a:text-purple-600 dark:prose-a:text-dark-cyan hover:prose-a:underline
                       prose-blockquote:border-l-purple-500 dark:prose-blockquote:border-l-dark-cyan
                       prose-code:bg-gray-100 prose-code:dark:bg-slate-700 prose-code:p-1 prose-code:rounded prose-code:text-sm
                       prose-img:rounded-md prose-img:shadow-md
                       prose-video:rounded-md prose-video:shadow-md prose-video:aspect-video
                       /* As classes .ql-align-* virão do quill.snow.css global */
                       "
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />

        </article>
        <div className="mt-12 text-center">
            <Link to="/jornal" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 dark:bg-dark-cyan dark:hover:bg-cyan-700 text-white font-semibold rounded-md transition">
                <i className="fas fa-arrow-left mr-2"></i> Voltar para todos os artigos
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;