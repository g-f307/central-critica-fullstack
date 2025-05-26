import express from 'express';
import db from '../models/index.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Nosso middleware de autenticação

const router = express.Router();
const { Article, User } = db;

// ROTA POST: Criar um novo artigo (Protegida)
router.post('/', authMiddleware, async (req, res) => {
  const { title, content, slug } = req.body; // Slug pode ser opcional se gerado no backend
  const userId = req.user.id; 

  if (!title || !content) {
    return res.status(400).json({ message: 'Título e conteúdo são obrigatórios.' });
  }

  try {
    // O hook beforeValidate no modelo Article cuidará da geração do slug se não for fornecido
    const newArticle = await Article.create({
      userId,
      title,
      content,
      slug: slug || null, // Permite que o hook gere se for nulo
    });

    // Retorna o artigo com dados do autor
    const articleWithAuthor = await Article.findByPk(newArticle.id, {
        include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'firstName', 'lastName', 'profileImageUrl']
        }]
    });

    res.status(201).json({ message: 'Artigo criado com sucesso!', article: articleWithAuthor });
  } catch (error) {
    console.error('Erro ao criar artigo:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const messages = error.errors.map(e => e.message);
        return res.status(400).json({ message: 'Erro de validação', errors: messages });
    }
    res.status(500).json({ message: 'Erro interno do servidor ao tentar criar artigo.' });
  }
});

// ROTA GET: Buscar todos os artigos (para a página Jornal)
router.get('/', async (req, res) => {
  try {
    const articles = await Article.findAll({
      include: [{
        model: User,
        as: 'author', // Usar o mesmo alias definido na associação
        attributes: ['id', 'firstName', 'lastName', 'profileImageUrl'],
      }],
      order: [['createdAt', 'DESC']], // Ordena pelos mais recentes
    });
    res.json(articles);
  } catch (error) {
    console.error('Erro ao buscar artigos:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao tentar buscar artigos.' });
  }
});

// ROTA GET: Buscar um artigo específico pelo slug (para leitura individual)
router.get('/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const article = await Article.findOne({
            where: { slug },
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'firstName', 'lastName', 'profileImageUrl'],
            }],
        });
        if (!article) {
            return res.status(404).json({ message: 'Artigo não encontrado.' });
        }
        res.json(article);
    } catch (error) {
        console.error(`Erro ao buscar artigo com slug ${slug}:`, error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// Futuramente: Rotas PUT para atualizar e DELETE para remover artigos (protegidas e com verificação de autoria)

export default router;