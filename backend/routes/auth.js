import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport'; // Importe o passport
import db from '../models/index.js'; 

const router = express.Router();
const { User } = db; 
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const getJwtSecret = () => {
  if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET é obrigatório em produção.');
  }
  return process.env.JWT_SECRET || 'desenvolvimento-local-apenas';
};

// ROTA DE REGISTRO
router.post('/register', async (req, res) => {
  // Adiciona profileImageUrl aos campos esperados
  const { firstName, lastName, email, password, profileImageUrl } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'Nome, sobrenome, e-mail e senha são obrigatórios.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'A senha deve ter pelo menos 8 caracteres.' });
  }
  if (profileImageUrl && (typeof profileImageUrl !== 'string' || profileImageUrl.length > 255)) { 
      return res.status(400).json({ message: 'URL da imagem de perfil inválida ou muito longa.' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Este e-mail já está cadastrado.' });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      profileImageUrl: profileImageUrl || null, // Salva a URL ou null
    });

    const userResponse = {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      profileImageUrl: newUser.profileImageUrl,
    };

    res.status(201).json({ message: 'Usuário registrado com sucesso!', user: userResponse });

  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: 'Erro de validação', errors: messages });
    }
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao tentar registrar.' });
  }
});

// ROTA DE LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas (usuário não encontrado).' }); 
    }

    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas (senha incorreta).' }); 
    }

    const payload = {
      user: {
        id: user.id,
        firstName: user.firstName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      },
    };

    const jwtSecret = getJwtSecret();
    
    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          message: 'Login bem-sucedido!',
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
          },
        });
      }
    );

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao tentar fazer login.' });
  }
});

// --- ROTAS DE AUTENTICAÇÃO COM GOOGLE ---

// ROTA DE INÍCIO DA AUTENTICAÇÃO COM GOOGLE
// O frontend redirecionará o usuário para GET /api/auth/google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'] // Escopos que solicitamos ao Google
}));

// ROTA DE CALLBACK DO GOOGLE
// O Google redirecionará o usuário para cá após o login na tela dele
router.get('/google/callback', 
  passport.authenticate('google', { 
  failureRedirect: `${FRONTEND_URL}/auth?error=google-login-failed`,
    session: false // Não estamos usando sessões persistentes, vamos usar JWT
  }),
  (req, res) => {
    // Se a autenticação foi bem-sucedida, o usuário estará em req.user (fornecido pelo Passport)
    const user = req.user;

    // Geramos nosso próprio token JWT para o frontend
    const payload = {
      user: {
        id: user.id,
        firstName: user.firstName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      },
    };

    const jwtSecret = getJwtSecret();
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
    
    // Redireciona de volta para o frontend com o token
    // O frontend terá uma página/lógica para capturar este token e logar o usuário
    res.redirect(`${FRONTEND_URL}/auth/callback?token=${encodeURIComponent(token)}`);
  }
);

export default router;
