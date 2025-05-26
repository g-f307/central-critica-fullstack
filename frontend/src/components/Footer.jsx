import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Cores para modo claro
  const lightTextColor = "text-purple-200";
  const lightLinkColor = "hover:text-white";
  const lightMutedColor = "text-purple-200"; // Rodapé do modo claro já era suave

  // Cores para modo escuro (baseado no protótipo)
  const darkTextColor = "dark:text-gray-400"; // Do protótipo
  const darkLinkColor = "dark:hover:text-white"; // Do protótipo
  const darkMutedColor = "dark:text-gray-500"; // Copyright do protótipo
  const darkSocialIconBg = "dark:bg-slate-700 dark:hover:bg-dark-cyan"; // Ícones sociais do protótipo

  return (
    <footer className="gradient-bg border-t border-purple-400 dark:border-dark-border py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className={`text-lg font-bold mb-4 flex items-center text-white dark:text-dark-text-primary`}>
              <i className={`fas fa-film mr-2 text-purple-300 dark:text-dark-cyan`}></i> Central Crítica
            </h3>
            <p className={`${lightTextColor} ${darkTextColor} text-sm`}>A plataforma definitiva para amantes de cinema, séries e cultura. Compartilhe suas opiniões e descubra novas obras.</p>
          </div>
          <div>
            <h4 className={`font-bold mb-4 text-white dark:text-dark-text-primary`}>Navegação</h4>
            <ul className="space-y-2">
              <li><Link to="/" className={`${lightTextColor} ${darkTextColor} ${lightLinkColor} ${darkLinkColor} transition`}>Início</Link></li>
              <li><Link to="/filmes" className={`${lightTextColor} ${darkTextColor} ${lightLinkColor} ${darkLinkColor} transition`}>Filmes</Link></li>
              <li><Link to="/series" className={`${lightTextColor} ${darkTextColor} ${lightLinkColor} ${darkLinkColor} transition`}>Séries</Link></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-bold mb-4 text-white dark:text-dark-text-primary`}>Sobre</h4>
            <ul className="space-y-2">
              <li><Link to="/jornal" className={`${lightTextColor} ${darkTextColor} ${lightLinkColor} ${darkLinkColor} transition`}>Jornal</Link></li>
              <li><Link to="/sobre" className={`${lightTextColor} ${darkTextColor} ${lightLinkColor} ${darkLinkColor} transition`}>Sobre Nós</Link></li>
              <li><a href="#" className={`${lightTextColor} ${darkTextColor} ${lightLinkColor} ${darkLinkColor} transition`}>Termos de Uso</a></li>
              <li><a href="#" className={`${lightTextColor} ${darkTextColor} ${lightLinkColor} ${darkLinkColor} transition`}>Política de Privacidade</a></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-bold mb-4 text-white dark:text-dark-text-primary`}>Redes Sociais</h4>
            <div className="flex space-x-4">
              {/* Ícones sociais adaptados */}
              <a href="#" className={`w-10 h-10 rounded-full bg-purple-500/50 ${darkSocialIconBg} flex items-center justify-center text-white transition`}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className={`w-10 h-10 rounded-full bg-purple-500/50 ${darkSocialIconBg} flex items-center justify-center text-white transition`}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className={`w-10 h-10 rounded-full bg-purple-500/50 ${darkSocialIconBg} flex items-center justify-center text-white transition`}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className={`w-10 h-10 rounded-full bg-purple-500/50 ${darkSocialIconBg} flex items-center justify-center text-white transition`}>
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
        <div className={`border-t border-purple-400 dark:border-dark-border pt-6 text-center ${lightMutedColor} ${darkMutedColor} text-sm`}>
          <p>© {currentYear} Central Crítica. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;