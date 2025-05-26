import express from 'express';
import db from '../models/index.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Nosso middleware de autenticação

const router = express.Router();
const { Review, User } = db; // User é necessário para incluir dados do autor

// ROTA POST: Criar uma nova crítica (Protegida pelo authMiddleware)
router.post('/', authMiddleware, async (req, res) => {
  const { mediaId, mediaType, rating, comment } = req.body;
  const userId = req.user.id; // Obtido do token JWT pelo authMiddleware

  // Validação básica dos dados recebidos
  if (!mediaId || !mediaType || rating == null || !comment) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios: mediaId, mediaType, rating, comment.' });
  }
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'A avaliação (rating) deve ser um número entre 1 e 5.' });
  }
  if (typeof comment !== 'string' || comment.trim() === '') {
    return res.status(400).json({ message: 'O comentário não pode estar vazio.' });
  }
  if (mediaType !== 'movie' && mediaType !== 'tv') {
    return res.status(400).json({ message: 'Tipo de mídia inválido. Use "movie" ou "tv".' });
  }


  try {
    // Opcional: Verificar se o usuário já fez uma crítica para esta mídia específica
    const existingReview = await Review.findOne({ where: { userId, mediaId: parseInt(mediaId, 10), mediaType } });
    if (existingReview) {
      // Você pode optar por permitir a atualização da crítica aqui ou retornar um erro.
      // Por agora, vamos retornar um erro se já existir.
      return res.status(409).json({ message: 'Você já fez uma crítica para esta mídia.' });
    }

    const newReview = await Review.create({
      userId,
      mediaId: parseInt(mediaId, 10),
      mediaType,
      rating,
      comment,
    });

    // Para retornar a crítica recém-criada com os dados do usuário (nome, profileImageUrl)
    const reviewWithUser = await Review.findByPk(newReview.id, {
        include: [{
            model: User,
            as: 'user', // Alias definido na associação do modelo Review
            attributes: ['id', 'firstName', 'lastName', 'profileImageUrl']
        }]
    });

    res.status(201).json({ message: 'Crítica adicionada com sucesso!', review: reviewWithUser });
  } catch (error) {
    console.error('Erro ao criar crítica:', error);
    if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(e => e.message);
        return res.status(400).json({ message: 'Erro de validação', errors: messages });
    }
    res.status(500).json({ message: 'Erro interno do servidor ao tentar criar crítica.' });
  }
});

// ROTA GET: Buscar todas as críticas do usuário logado (Minhas Críticas)
// A rota é /api/reviews/my-reviews/all por causa do prefixo no server.js
router.get('/my-reviews/all', authMiddleware, async (req, res) => {
  const userId = req.user.id; // Obtido do token JWT pelo authMiddleware

  try {
    const userReviews = await Review.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']], // Ordena pelas mais recentes
      // Não incluímos o User aqui, pois o frontend já terá os dados do usuário logado.
      // O frontend usará mediaId e mediaType para buscar detalhes da mídia separadamente.
    });
    res.json(userReviews);
  } catch (error) {
    console.error('Erro ao buscar as críticas do usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar suas críticas.' });
  }
});

// ROTA GET: Buscar todas as críticas para uma mídia específica
router.get('/:mediaType/:mediaId', async (req, res) => {
  const { mediaType, mediaId } = req.params;

  if (!mediaId || !mediaType) {
    return res.status(400).json({ message: 'mediaId e mediaType são obrigatórios.' });
  }
  if (mediaType !== 'movie' && mediaType !== 'tv') {
    return res.status(400).json({ message: 'Tipo de mídia inválido.' });
  }

  try {
    const reviews = await Review.findAll({
      where: { mediaId: parseInt(mediaId, 10), mediaType },
      include: [{
        model: User,
        as: 'user', // Usar o mesmo alias definido na associação do modelo Review
        attributes: ['id', 'firstName', 'lastName', 'profileImageUrl'], // Seleciona apenas campos específicos do usuário
      }],
      order: [['createdAt', 'DESC']], // Ordena pelas mais recentes
    });
    res.json(reviews);
  } catch (error) {
    console.error('Erro ao buscar críticas:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao tentar buscar críticas.' });
  }
});
    
// Futuramente, você pode adicionar rotas para ATUALIZAR e DELETAR críticas:
// router.put('/:reviewId', authMiddleware, async (req, res) => { /* ... lógica para atualizar ... */ });
// router.delete('/:reviewId', authMiddleware, async (req, res) => { /* ... lógica para deletar ... */ });

export default router;