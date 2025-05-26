import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/index.js'; 

const router = express.Router();
const { User } = db; 

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
  // Validação opcional para a URL da imagem (pode ser mais robusta)
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
      profileImageUrl: newUser.profileImageUrl, // Retorna a URL da imagem
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
        profileImageUrl: user.profileImageUrl, // Adicionado ao payload do token
      },
    };

    const jwtSecret = process.env.JWT_SECRET || 'seuSegredoSuperSecretoTemporarioPadrao'; 
    if (jwtSecret === 'seuSegredoSuperSecretoTemporarioPadrao') {
        console.warn("AVISO: Usando chave JWT secreta padrão. Defina JWT_SECRET no seu arquivo .env para produção!");
    }
    
    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '1h' }, // Token expira em 1 hora
      (err, token) => {
        if (err) throw err;
        res.json({
          message: 'Login bem-sucedido!',
          token,
          user: { // Retorna os dados do usuário, incluindo a imagem de perfil
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

export default router;