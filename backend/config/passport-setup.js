import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { randomBytes } from 'node:crypto';
import db from '../models/index.js';

const { User } = db;

passport.use(
  new GoogleStrategy(
    {
      // Opções para a estratégia do Google
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback', // Deve corresponder ao URI de redirecionamento no Google Console
      scope: ['profile', 'email'], // Escopos que estamos solicitando
    },
    async (accessToken, refreshToken, profile, done) => {
      // Esta função é chamada quando o Google nos redireciona com sucesso
      // 'profile' contém as informações do usuário do Google

      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      if (!email) {
        return done(new Error("Não foi possível obter o e-mail do perfil do Google."), null);
      }

      try {
        // 1. Tenta encontrar um usuário com o e-mail do Google
        let user = await User.findOne({ where: { email } });

        if (user) {
          // Usuário já existe, prossiga com o login
          // No futuro, você pode querer associar o Google ID ao perfil existente
          return done(null, user);
        } else {
          // 2. Se o usuário não existe, cria um novo
          const newUser = await User.create({
            firstName: profile.name.givenName || 'Usuário',
            lastName: profile.name.familyName || 'Google',
            email,
            // O modelo atual exige senha; para contas OAuth usamos um valor
            // criptograficamente aleatório, que nunca é exposto ao usuário.
            password: randomBytes(32).toString('hex'),
            profileImageUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
          });
          return done(null, newUser);
        }
      } catch (error) {
        console.error("Erro na estratégia de autenticação do Google:", error);
        return done(error, null);
      }
    }
  )
);

// O Passport precisa serializar e desserializar usuários para gerenciar a sessão
// Mesmo que usemos JWT, isso é necessário para o fluxo OAuth
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
