import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HeroSection = () => {
  const { user } = useAuth(); // Obtenha o estado do usuário
  const navigate = useNavigate();

  const handleCadastroClick = () => {
    // Navega para a página de autenticação e passa um estado para
    // indicar que queremos mostrar o formulário de registro.
    navigate('/auth', { state: { showRegister: true } });
  };

  return (
    <section className="gradient-bg text-white py-16 md:py-24"> {/* */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 hero-text-shadow">
              Descubra, Analise, Compartilhe
            </h1>
            <p className="text-xl mb-6 text-purple-100">
              A plataforma definitiva para críticas de filmes e séries. Junte-se à comunidade e compartilhe suas opiniões.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
              <Link 
                to="/filmes" 
                className="bg-white text-light-purple-primary px-6 py-3 rounded-full font-semibold hover:bg-purple-100 transition transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                Explorar Filmes <i className="fas fa-chevron-right ml-2"></i>
              </Link>
              
              {!user && (
                <button 
                  onClick={handleCadastroClick}
                  className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-800 dark:hover:text-dark-bg-primary transition transform hover:scale-105 flex items-center justify-center"
                >
                  Cadastre-se <i className="fas fa-user-plus ml-2"></i>
                </button>
              )}
            </div>
            <div className="mt-8 flex items-center space-x-4 justify-center md:justify-start">
                <div className="flex -space-x-2">
                    <img src="https://randomuser.me/api/portraits/women/12.jpg" className="w-10 h-10 rounded-full border-2 border-white" alt="User"/>
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-10 h-10 rounded-full border-2 border-white" alt="User"/>
                    <img src="https://randomuser.me/api/portraits/women/45.jpg" className="w-10 h-10 rounded-full border-2 border-white" alt="User"/>
                </div>
                <p className="text-purple-100 text-sm">
                    <span className="font-semibold">+10.000</span> usuários ativos
                </p>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
            <img 
              src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt="Pessoas assistindo filme"
              className="rounded-xl shadow-2xl w-full max-w-md lg:max-w-lg hero-image-shadow" /* */
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;