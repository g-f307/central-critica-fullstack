import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import db from './models/index.js'; // Importa a instância do Sequelize e os modelos
import authRoutes from './routes/auth.js'; // Importa as rotas de autenticação
import reviewRoutes from './routes/reviews.js';
import articleRoutes from './routes/articles.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json()); // Essencial para o Express interpretar o corpo das requisições como JSON

// Rota de Teste Principal
app.get('/', (req, res) => {
  res.send('Servidor do Central Crítica está rodando com ES Modules!');
});
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/articles', articleRoutes);

// --- Rotas da API do TMDB (Proxy) ---

// Rota para buscar filmes populares
app.get('/api/movies/popular', async (req, res) => {
  const page = req.query.page || 1;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=pt-BR&page=${page}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar filmes populares:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ 
        message: `Erro no servidor ao buscar filmes populares. ${error.response ? error.response.data.status_message : ''}` 
    });
  }
});

// Rota para buscar séries populares
app.get('/api/series/popular', async (req, res) => {
  const page = req.query.page || 1;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.TMDB_API_KEY}&language=pt-BR&page=${page}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar séries populares:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ 
        message: `Erro no servidor ao buscar séries populares. ${error.response ? error.response.data.status_message : ''}` 
    });
  }
});

// Rota para buscar detalhes de um filme ou série
app.get('/api/details/:mediaType/:mediaId', async (req, res) => {
  const { mediaType, mediaId } = req.params;
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ message: 'Chave da API não configurada no servidor.' });
  }
  if (mediaType !== 'movie' && mediaType !== 'tv') {
    return res.status(400).json({ message: 'Tipo de mídia inválido. Use "movie" ou "tv".' });
  }

  try {
    const url = `https://api.themoviedb.org/3/${mediaType}/${mediaId}?api_key=${apiKey}&language=pt-BR&append_to_response=credits,videos`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(`Erro ao buscar detalhes para ${mediaType} ID ${mediaId}:`, error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ 
        message: `Erro no servidor ao buscar detalhes. ${error.response ? error.response.data.status_message : ''}` 
    });
  }
});

// Rota para buscar lista de gêneros de filmes
app.get('/api/genres/movie', async (req, res) => {
  const apiKey = process.env.TMDB_API_KEY;
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=pt-BR`);
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar gêneros de filmes:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ 
        message: `Erro no servidor ao buscar gêneros de filmes. ${error.response ? error.response.data.status_message : ''}` 
    });
  }
});

// Rota para buscar lista de gêneros de séries (TV)
app.get('/api/genres/tv', async (req, res) => {
  const apiKey = process.env.TMDB_API_KEY;
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=pt-BR`);
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar gêneros de TV:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ 
        message: `Erro no servidor ao buscar gêneros de TV. ${error.response ? error.response.data.status_message : ''}` 
    });
  }
});

// Rota para pesquisa multi (filmes e séries)
app.get('/api/search', async (req, res) => {
  const { query, page = 1 } = req.query;
  const apiKey = process.env.TMDB_API_KEY;

  if (!query) {
    return res.status(400).json({ message: 'Parâmetro de busca "query" é obrigatório.' });
  }
  if (!apiKey) {
    return res.status(500).json({ message: 'Chave da API não configurada no servidor.' });
  }

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
    );
    // Filtra para retornar apenas filmes e séries (personagens, etc. são ignorados)
    const filteredResults = response.data.results.filter(
      result => result.media_type === 'movie' || result.media_type === 'tv'
    );
    res.json({ ...response.data, results: filteredResults });
  } catch (error) {
    console.error('Erro na busca:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ 
        message: `Erro no servidor ao realizar busca. ${error.response ? error.response.data.status_message : ''}` 
    });
  }
});


// Inicialização do Banco de Dados e do Servidor
const startServer = async () => {
  try {
    await db.sequelize.sync();
    console.log('Banco de dados sincronizado com sucesso.');
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados ou iniciar o servidor:', error);
  }
};

startServer();