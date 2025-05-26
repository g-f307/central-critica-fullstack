import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const { user, logout, loadingAuth } = useAuth();
  
  // Refs separadas para os menus, para evitar conflito
  const userMenuRefDesktop = useRef(null);
  const userMenuRefMobile = useRef(null); // Se o menu de usuário mobile também for um dropdown complexo
  const mobileMenuRef = useRef(null); // Para o menu de navegação mobile principal

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Efeito para fechar o dropdown do usuário (desktop e mobile) ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRefDesktop.current && !userMenuRefDesktop.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      // Adicione lógica similar para userMenuRefMobile se ele for um dropdown separado e complexo
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('#mobile-menu-button-main')) {
         // Fecha o menu mobile principal se o clique for fora e não no botão de toggle
        // (O #mobile-menu-button-main é um ID que adicionaremos ao botão de toggle do menu mobile)
        // setIsMobileMenuOpen(false); // Descomente se quiser esse comportamento
      }
    };

    if (isUserMenuOpen || isMobileMenuOpen) { // Adiciona listener se qualquer menu estiver aberto
        document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, isMobileMenuOpen]);


  const handleThemeSwitch = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false); // Fecha o menu mobile após a busca
      setIsUserMenuOpen(false); // Fecha o menu de usuário também
    }
  };

  const handleLogout = () => {
    logout(); // Chama a função logout do AuthContext
    setIsUserMenuOpen(false); // Garante que o menu do usuário (desktop e mobile) feche
    setIsMobileMenuOpen(false); // Garante que o menu mobile principal feche
  };

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Filmes', path: '/filmes' },
    { name: 'Séries', path: '/series' },
    { name: 'Jornal', path: '/jornal' },
    { name: 'Sobre Nós', path: '/sobre' },
  ];

  const linkColors = "text-purple-200 dark:text-gray-300 hover:text-white dark:hover:text-white";
  const activeLinkColors = "text-white dark:text-white";
  const iconColors = "text-purple-300 dark:text-dark-cyan";
  const buttonIconColors = "text-purple-200 dark:text-gray-300 hover:text-white dark:hover:text-white";

  if (loadingAuth) {
    return (
        <nav className="gradient-bg text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 h-[68px]">
                {/* Placeholder para evitar pulo de layout */}
            </div>
        </nav>
    );
  }

  return (
    <nav className="gradient-bg text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <i className={`fas fa-film text-2xl ${iconColors}`}></i>
            <span className={`text-xl font-bold text-white dark:bg-gradient-to-r dark:from-dark-cyan dark:to-blue-500 dark:bg-clip-text dark:text-transparent`}>
                Central Crítica
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navLinks.map((link) => (
              <NavLink 
                key={link.name} 
                to={link.path} 
                className={({ isActive }) => 
                  `transition font-medium ${isActive ? activeLinkColors : linkColors}`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <form onSubmit={handleSearchSubmit} className="flex items-center relative">
              <input 
                type="search" placeholder="Buscar..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 w-40 lg:w-48 rounded-full text-sm bg-white/10 dark:bg-slate-700/40 placeholder-gray-300 dark:placeholder-gray-400 focus:bg-white/20 dark:focus:bg-slate-700/60 focus:outline-none focus:ring-1 focus:ring-purple-300 dark:focus:ring-dark-cyan text-white"
              />
              <button type="submit" className="absolute right-0 top-0 bottom-0 px-3 text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-dark-cyan">
                <i className="fas fa-search"></i>
              </button>
            </form>
            
            <button onClick={handleThemeSwitch} className={`text-xl focus:outline-none ${buttonIconColors} ml-2`}>
              {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
            </button>

            {user ? (
              <div className="relative" ref={userMenuRefDesktop}> {/* Ref para o dropdown desktop */}
                <button onClick={() => setIsUserMenuOpen(prev => !prev)} className="focus:outline-none">
                  <img 
                    src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName)}+${encodeURIComponent(user.lastName || '')}&background=random&color=fff&font-size=0.5`} 
                    alt="Perfil" 
                    className="w-9 h-9 rounded-full object-cover border-2 border-transparent hover:border-white dark:hover:border-dark-cyan transition"
                  />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-md shadow-xl py-1 z-20 ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                      <p className="text-sm text-gray-700 dark:text-dark-text-secondary">Logado como</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-dark-text-primary truncate">{user.firstName} {user.lastName || ''}</p>
                    </div>
                    <Link 
                      to="/minhas-criticas"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-slate-700 w-full text-left"
                    >
                      <i className="fas fa-feather-alt w-5 mr-2 text-gray-500 dark:text-gray-400"></i>Minhas Críticas
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700"
                    >
                      <i className="fas fa-sign-out-alt w-5 mr-2"></i>Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" className={`px-4 py-2 rounded-full text-sm font-medium transition ${linkColors} border border-purple-300 dark:border-gray-500 hover:bg-white/10 dark:hover:bg-white/5`}>
                Entrar
              </Link>
            )}
          </div>

          {/* Botão do Menu Mobile e Ícones de Usuário/Tema para Telas Pequenas */}
          <div className="md:hidden flex items-center space-x-3"> {/* Adicionado space-x-3 */}
            {/* Ícone de Busca para Mobile - pode abrir um campo de busca ou ir para a página de busca */}
            <button onClick={() => navigate('/search')} className={`text-xl focus:outline-none ${buttonIconColors}`}>
                <i className="fas fa-search"></i>
            </button>
             <button onClick={handleThemeSwitch} className={`text-xl focus:outline-none ${buttonIconColors}`}>
              {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
            </button>
            <button id="mobile-menu-button-main" onClick={() => setIsMobileMenuOpen(prev => !prev)} className="text-white focus:outline-none">
              <i className="fas fa-bars text-2xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown do Menu Mobile Principal */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className={`md:hidden gradient-bg px-4 pb-4 space-y-2 absolute w-full shadow-lg z-10`}>
          <form onSubmit={handleSearchSubmit} className="flex items-center relative mt-2">
              <input 
                type="search" placeholder="Buscar filmes e séries..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 w-full rounded-full text-sm bg-white/20 dark:bg-slate-700/50 placeholder-gray-300 dark:placeholder-gray-400 focus:bg-white/30 dark:focus:bg-slate-700/80 focus:outline-none focus:ring-1 focus:ring-purple-300 dark:focus:ring-dark-cyan text-white"
              />
              <button type="submit" className="absolute right-0 top-0 bottom-0 px-3 text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-dark-cyan">
                <i className="fas fa-search"></i>
              </button>
          </form>
          {navLinks.map((link) => (
            <NavLink 
              key={link.name} 
              to={link.path} 
              className={`block py-2 transition ${linkColors}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
          {user ? (
            <>
                <Link 
                    to="/minhas-criticas"
                    onClick={() => { setIsMobileMenuOpen(false); }}
                    className={`block py-2 transition ${linkColors}`}
                >
                    Minhas Críticas
                </Link>
                <button 
                    onClick={handleLogout}
                    className={`block w-full text-left py-2 transition text-red-400 hover:text-red-300`}
                >
                    Sair
                </button>
            </>
          ) : (
            <Link 
                to="/auth" 
                className={`block py-2 transition ${linkColors}`}
                onClick={() => setIsMobileMenuOpen(false)}
            >
            Entrar / Cadastrar
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;