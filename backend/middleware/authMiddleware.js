import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  // Pega o token do header Authorization: Bearer TOKEN
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Nenhum token fornecido, acesso negado.' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token mal formatado.' });
  }

  const token = parts[1];

  try {
    const jwtSecret = process.env.JWT_SECRET || 'seuSegredoSuperSecretoTemporarioPadrao';
    const decoded = jwt.verify(token, jwtSecret);

    req.user = decoded.user; // Adiciona os dados do usuário decodificados ao objeto req
    next(); // Prossegue para a próxima função (a rota protegida)
  } catch (err) {
    console.error('Erro na validação do token:', err.message);
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expirado.' });
    }
    res.status(401).json({ message: 'Token inválido.' });
  }
};