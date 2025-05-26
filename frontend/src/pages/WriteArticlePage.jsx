import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css'; // << REMOVA ESTA LINHA DAQUI

const WriteArticlePage = () => {
  const { user, token, loadingAuth } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loadingAuth && !user) {
      navigate('/auth', { state: { message: 'Você precisa estar logado para escrever um artigo.' } });
    }
  }, [user, loadingAuth, navigate]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      [{ 'align': [] }], // Importante para ter os botões de alinhamento
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video', 'align', 'color', 'background' // 'align' é importante
  ];

  const handleSubmitArticle = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!title.trim() || !content.trim() || content === '<p><br></p>') {
      setError('Título e conteúdo são obrigatórios.');
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.errors?.join(', ') || 'Erro ao publicar artigo.');
      }

      setSuccessMessage('Artigo publicado com sucesso!');
      setTitle('');
      setContent('');
      setTimeout(() => {
         navigate('/jornal');
      }, 2000);

    } catch (err) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loadingAuth) {
    return <div className="p-8 text-center dark:text-white">Verificando autenticação...</div>;
  }
  if (!user) {
    return <div className="p-8 text-center dark:text-white">Redirecionando para login...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800 dark:text-dark-text-primary text-center">
        Escrever Novo Artigo
      </h1>

      {error && <p className="mb-4 text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-md">{error}</p>}
      {successMessage && <p className="mb-4 text-center text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 p-3 rounded-md">{successMessage}</p>}
      
      <form onSubmit={handleSubmitArticle} className="max-w-3xl mx-auto bg-white dark:bg-dark-card shadow-xl rounded-lg p-6 md:p-8 space-y-6">
        <div>
          <label htmlFor="articleTitle" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
            Título do Artigo
          </label>
          <input
            type="text"
            id="articleTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 dark:focus:ring-dark-cyan bg-white dark:bg-slate-700 text-gray-900 dark:text-dark-text-primary placeholder-gray-500 dark:placeholder-dark-text-muted"
            placeholder="Um título impactante para seu artigo"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
            Conteúdo
          </label>
          <div className="quill-editor-container bg-white dark:text-dark-text-primary border border-gray-300 dark:border-slate-600 rounded-md overflow-hidden">
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent}
              modules={modules}
              formats={formats}
              placeholder="Comece a escrever sua obra-prima aqui..."
              className="min-h-[300px] 
                         dark:bg-slate-700 
                         dark:[&_.ql-toolbar]:bg-slate-700
                         dark:[&_.ql-toolbar]:border-slate-600
                         dark:[&_.ql-container]:border-slate-600
                         dark:[&_.ql-editor]:text-dark-text-primary 
                         dark:[&_.ql-picker-label]:text-dark-text-secondary 
                         dark:[&_.ql-picker-item]:text-dark-text-secondary 
                         dark:[&_.ql-stroke]:stroke-dark-text-secondary 
                         dark:[&_.ql-fill]:fill-dark-text-secondary
                         dark:[&_.ql-picker-options]:bg-slate-800
                         dark:[&_.ql-picker-options]:border-slate-600"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 dark:bg-dark-cyan dark:hover:bg-cyan-700 text-white font-semibold rounded-md transition duration-150 ease-in-out disabled:opacity-50"
          >
            {isSubmitting ? 'Publicando...' : 'Publicar Artigo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WriteArticlePage;