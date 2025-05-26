import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
  // Função para criar um trecho do conteúdo do artigo
  const createExcerpt = (htmlContent, length = 150) => {
    if (!htmlContent) return ""; // Adiciona uma verificação para conteúdo nulo ou indefinido
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    if (text.length <= length) {
      return text;
    }
    return text.substring(0, length) + "...";
  };

  const excerpt = createExcerpt(article.content);
  const publicationDate = new Date(article.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  // Placeholder usando o título do artigo com placehold.co
  // Usando cores neutras: E2E8F0 (cinza claro para fundo) e 4A5568 (cinza escuro para texto)
  // O título é limitado a 30 caracteres e codificado para URL
  const placeholderImageUrl = `https://placehold.co/600x400/E2E8F0/4A5568?text=${encodeURIComponent(article.title ? article.title.substring(0, 30) : 'Artigo')}&font=poppins`;

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg overflow-hidden flex flex-col card-hover dark:shadow-[0_10px_25px_rgba(0,0,0,0.25)] h-full"> {/* Adicionado h-full */}
      <Link to={`/jornal/${article.slug}`} className="block">
        <img
          src={article.coverImageUrl || placeholderImageUrl}
          alt={`Capa para ${article.title}`}
          className="w-full h-48 object-cover bg-gray-200 dark:bg-slate-700" // Fundo enquanto carrega ou se falhar
          onError={(e) => { 
            // Em caso de erro ao carregar a imagem principal (coverImageUrl ou placeholder),
            // tenta carregar um placeholder ainda mais genérico.
            e.target.onerror = null; // Previne loop infinito se o próximo também falhar
            e.target.src = `https://placehold.co/600x400/cccccc/969696?text=Imagem+Indisponivel`;
          }}
        />
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-dark-text-primary">
          <Link to={`/jornal/${article.slug}`} className="hover:underline">
            {article.title || "Título Indisponível"}
          </Link>
        </h3>
        <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-3 flex-grow line-clamp-3">
          {excerpt || "Sem resumo disponível."}
        </p>
        <div className="mt-auto">
          <div className="flex items-center text-xs text-gray-500 dark:text-dark-text-muted mb-3">
            <img
              src={article.author?.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author?.firstName || 'A')}+${encodeURIComponent(article.author?.lastName || 'N')}&background=random&color=fff&font-size=0.5`}
              alt={article.author?.firstName || 'Autor'}
              className="w-6 h-6 rounded-full mr-2 object-cover bg-gray-300 dark:bg-slate-600" // Fundo para avatar
            />
            <span>Por {article.author?.firstName || 'Autor'} {article.author?.lastName || 'Desconhecido'}</span>
            <span className="mx-1">•</span>
            <span>{publicationDate}</span>
          </div>
          <Link
            to={`/jornal/${article.slug}`}
            className="inline-block text-sm font-medium text-purple-600 dark:text-dark-cyan hover:text-purple-800 dark:hover:text-cyan-300 transition"
          >
            Ler mais <i className="fas fa-arrow-right ml-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;